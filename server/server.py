import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps

from logic import process_label_data

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for API routes
# Get CORS origins from environment variable (defaults to * for development)
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}}, supports_credentials=True)

# API Secret Key
API_SECRET_KEY = os.getenv('API_SECRET_KEY')

def require_api_key(f):
	"""Decorator to require API key authentication"""
	@wraps(f)
	def decorated_function(*args, **kwargs):
		# Get API key from header
		api_key = request.headers.get('X-API-Key')

		if not API_SECRET_KEY:
			# If no secret key is configured, allow access (development mode)
			return f(*args, **kwargs)

		if not api_key or api_key != API_SECRET_KEY:
			return jsonify({"success": False, "error": "Invalid or missing API key"}), 401

		return f(*args, **kwargs)
	return decorated_function

@app.route('/api/submit-label', methods=['POST'])
@require_api_key
def submit_label():
	data = request.get_json() or {}
	required = ["brandName", "productClass", "alcoholContent", "netContents"]
	missing = [k for k in required if not data.get(k)]

	if missing:
		return jsonify({"success": False, "error": f"Missing fields: {', '.join(missing)}"}), 400

	result = process_label_data(
		data.get("brandName"),
		data.get("productClass"),
		data.get("alcoholContent"),
		data.get("netContents"),
		data.get("labelImage")
	)

	response = jsonify({
		"success": True,
		"result": result
	})

	response.status_code = 200

	return response

@app.errorhandler(404)
def not_found(error):
	"""Handle 404 errors for any undefined routes"""
	return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
	"""Handle wrong HTTP methods"""
	return jsonify({"success": False, "error": "Method not allowed"}), 405

if __name__ == '__main__':
	app.run(host="0.0.0.0", port=5001)