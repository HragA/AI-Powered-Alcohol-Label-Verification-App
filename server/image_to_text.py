import base64
import re
from typing import Dict, Any, List, Optional

import cv2
import easyocr
import numpy as np

ALCOHOL_TYPES = [
	'vodka', 'whiskey', 'whisky', 'rum', 'gin', 'tequila', 'brandy', 'wine', 'beer', 'bourbon', 'scotch', 'cognac'
]

BEER_SUBTYPES = [
	'lager', 'ipa', 'stout', 'porter', 'pilsner', 'ale', 'sour', 'bock', 'kolsch', 'dubbel', 'tripel', 'quad', 'goose', 'brown', 'red', 'blonde', 'pale', 'amber', 'session', 'hazy', 'imperial', 'barleywine', 'mild', 'schwarzbier', 'marzen', 'dunkel', 'helles', 'altbier', 'rauchbier', 'witbier', 'gose', 'farmhouse', 'wild', 'fruit', 'cream', 'rice', 'corn', 'dry', 'sweet', 'extra', 'strong', 'light', 'dark'
]

_OCR_READER: Optional[easyocr.Reader] = None


def _get_reader() -> easyocr.Reader:
	global _OCR_READER
	if _OCR_READER is None:
		_OCR_READER = easyocr.Reader(['en'])
	return _OCR_READER


def decode_base64_to_image(b64: str) -> np.ndarray:
	try:
		data = base64.b64decode(b64)
	except Exception as e:
		raise ValueError(f"Invalid base64 data: {e}")

	arr = np.frombuffer(data, dtype=np.uint8)
	img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

	if img is None:
		raise ValueError("Could not decode image data into an image")

	return img


def ocr_image(image: np.ndarray) -> List[Dict[str, Any]]:
	reader = _get_reader()
	raw = reader.readtext(image)
	results = []

	for bbox, text, conf in raw:
		results.append({"bbox": bbox, "text": text, "confidence": conf})

	return results


def extract_fields_from_text(all_text: List[str]) -> Dict[str, Any]:
	full_text = re.sub(r"\s+", "", ' '.join(all_text))
	spaced_text = ' '.join(all_text)

	alcohol_content = None
	net_contents = None
	health_warning = False
	alcohol_type = None
	alcohol_subtype = None
	brand_name = all_text[0] if all_text else None

	ac_match = re.search(r"(\d+(?:\.\d+)?)\s*%", full_text)
	if ac_match:
		alcohol_content = ac_match.group(1) + '%'

	nc_match = re.search(r"(\d+(?:\.\d+)?)\s*(ml|L|oz)", full_text, re.IGNORECASE)
	if nc_match:
		net_contents = nc_match.group(0)

	if re.search(r"GOVERNMENT\W*WARNING", spaced_text):
		health_warning = True

	for atype in ALCOHOL_TYPES:
		if atype.lower() in full_text.lower():
			alcohol_type = atype.title()
			break

	for subtype in BEER_SUBTYPES:
		if re.search(rf"\b{subtype}\b", full_text, re.IGNORECASE):
			alcohol_subtype = subtype.title()
			break

	product_class = alcohol_subtype if alcohol_subtype else alcohol_type

	return {
		'brand_name': brand_name,
		'alcohol_content': alcohol_content,
		'net_contents': net_contents,
		'health_warning': health_warning,
		'product_class': product_class,
		'all_text': all_text,
		'full_text': full_text,
	}


def image_to_text(base64_str: str) -> Dict[str, Any]:
	try:
		img = decode_base64_to_image(base64_str)
	except ValueError as e:
		raise Exception(f"Failed to decode image: {str(e)}")

	ocr_results = ocr_image(img)
	if not ocr_results:
		raise Exception("Could not read text from the label image. Please try a clearer image")

	tokens = [r['text'] for r in ocr_results]

	return extract_fields_from_text(tokens)