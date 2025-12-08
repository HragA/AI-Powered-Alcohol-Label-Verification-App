from typing import Optional, Dict, Any
from decimal import Decimal
import re

from image_to_text import image_to_text

def _normalize_text(s: Optional[str]) -> Optional[str]:
	if s is None:
		return None

	return re.sub(r"[^a-z0-9]+", "", str(s).lower())

def _parse_alc_percent(s: Optional[str]) -> Optional[float]:
	if not s:
		return None

	m = re.search(r"(\d+(?:\.\d+)?)", str(s))

	if not m:
		return None
	try:
		return float(m.group(1))
	except ValueError:
		return None

def _convert_to_ml(s: Optional[str]) -> Optional[float]:
	if not s:
		return None

	m = re.search(r"(\d+(?:\.\d+)?)[\s-]*(ml|l|oz)", str(s), re.IGNORECASE)
	if not m:
		return None

	qty_ml = float(m.group(1))
	unit = m.group(2).lower()

	if unit == 'l':
		return qty_ml * 1000.0
	elif unit == 'oz':
		return qty_ml * 29.5735
	return qty_ml

def _compare_text_field(provided: Optional[str], extracted: Optional[str]) -> Optional[bool]:
	if provided is None or str(provided).strip() == "":
		return None

	return _normalize_text(provided) == _normalize_text(extracted)

def _compare_alcohol_content(provided: Optional[str], extracted: Optional[str]) -> Optional[bool]:
	if provided is None or str(provided).strip() == "":
		return None

	p = _parse_alc_percent(provided)
	e = _parse_alc_percent(extracted)

	if p is None or e is None:
		return False

	return abs(p - e) == 0.0

def _compare_net_contents(provided: Optional[str], extracted: Optional[str]) -> Optional[bool]:
	if provided is None or str(provided).strip() == "":
		return None

	p = _convert_to_ml(provided)
	e = _convert_to_ml(extracted)

	if p is None or e is None:
		return False

	return Decimal(p) == Decimal(e)

def _compare_brand_name(brandName: Optional[str], full_text: str) -> tuple[Optional[bool], Optional[str]]:
	if not brandName or not brandName.strip():
		return None, None

	brand_words = brandName.split()
	normalized_full_text = _normalize_text(full_text)

	found_words = [
		word for word in brand_words
		if _normalize_text(word) in normalized_full_text
	]

	if not found_words:
		return False, None

	found_brand_name = ' '.join(found_words)
	match = len(found_words) == len(brand_words)

	return match, found_brand_name

def process_label_data(
	brandName: Optional[str],
	productClass: Optional[str],
	alcoholContent: Optional[str],
	netContents: Optional[str],
	labelImage: Optional[str]
) -> Dict[str, Any]:
	result: Dict[str, Any] = {
		"imageExtracted": None,
		"errors": []
	}

	extracted = None
	if labelImage:
		match = re.match(r"^data:image/[^;]+;base64,(.*)$", labelImage)
		if match:
			base64_str = match.group(1)
			try:
				extracted = image_to_text(base64_str)
				result["imageExtracted"] = extracted
			except Exception as e:
				result["errors"].append(f"Image extraction error: {str(e)}")
		else:
			result["errors"].append("Invalid base64 image format")

	if extracted:
		# Brand name
		b_match, found_brand = _compare_brand_name(brandName, extracted.get('full_text', ''))
		if found_brand:
			extracted['brand_name'] = found_brand
		if b_match is False:
			result["errors"].append(f"Brand Name: Provided '{brandName}' vs Extracted '{extracted.get('brand_name')}'")

		# Product class
		c_match = _compare_text_field(productClass, extracted.get('product_class'))
		if c_match is False:
			result["errors"].append(f"Product Class: Provided '{productClass}' vs Extracted '{extracted.get('product_class')}'")

		# Alcohol content
		ac_match = _compare_alcohol_content(alcoholContent, extracted.get('alcohol_content'))
		if ac_match is False:
			result["errors"].append(f"Alcohol Content: Provided '{alcoholContent}' vs Extracted '{extracted.get('alcohol_content')}'")

		# Net contents
		nc_match = _compare_net_contents(netContents, extracted.get('net_contents'))
		if nc_match is False:
			result["errors"].append(f"Net Contents: Provided '{netContents}' vs Extracted '{extracted.get('net_contents')}'")

		# Health warning check
		if not extracted.get('health_warning'):
			result["errors"].append("Health Warning: Label does not contain required GOVERNMENT WARNING")

	return result