import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from logic import process_label_data

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable CORS for API routes
# Get CORS origins from environment variable (defaults to * for development)
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
CORS(app, resources={r"/api/*": {"origins": CORS_ORIGINS}}, supports_credentials=True)

@app.route('/api/submit-label', methods=['POST'])
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

if __name__ == '__main__':
	app.run()