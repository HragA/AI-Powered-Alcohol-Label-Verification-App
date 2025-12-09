# AI-Powered Alcohol Label Verification App

A full-stack web application that simulates a simplified version of the Alcohol and Tobacco Tax and Trade Bureau (TTB) label approval process using OCR technology.

## Features

- **OCR Text Extraction**: Automatically extracts text from alcohol label images using EasyOCR
- **Field Validation**: Compares user-provided information against extracted label data
- **Brand Name Matching**: Flexible matching that handles multi-word brands and variations
- **Health Warning Detection**: Validates presence of required government warnings
- **Volume Conversion**: Supports multiple units (mL, L, oz) with automatic conversion

## Tech Stack

**Frontend:**
- React with Vite
- Tailwind CSS
- Custom hooks for state management

**Backend:**
- Python Flask
- OpenCV & EasyOCR for image processing
- Flask-CORS for cross-origin requests

## Installation & Run Locally

### Prerequisites
- Node.js (v14 or higher)
- Python 3.9.6

### Frontend Setup (React + Vite)

Navigate to the client folder:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

The client will be available at [http://localhost:5173](http://localhost:5173)

### Backend Setup (Python + Flask)

Navigate to the server folder:
```bash
cd server
```

Create a virtual environment:
```bash
python -m venv .venv
```

Activate the virtual environment:
```bash
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the Flask server:
```bash
python server.py
```

The server will be available at [http://localhost:5001](http://localhost:5001)

## Usage

1. **Start both servers**: Ensure both the frontend (port 5173) and backend (port 5001) are running
2. **Open the app**: Navigate to [http://localhost:5173](http://localhost:5173)
3. **Fill out the form**:
   - Brand Name
   - Product Class/Type (e.g., Vodka, Rum, Whiskey)
   - Alcohol Content (e.g., 40% or just 40)
   - Net Contents (number + unit selection)
4. **Upload a label image**: Drag and drop or click to select an image file
5. **Submit**: Click the submit button to validate your information
6. **Review results**:
   - ✓ Success message if all fields match
   - ✗ Error details showing mismatched fields or missing warnings

## Validation Rules

- **Brand Name**: All words must appear in the label (order-independent)
- **Product Class**: Exact match (case-insensitive, normalized)
- **Alcohol Content**: Numeric value must match exactly
- **Net Contents**: Volume must match (handles unit conversion)
- **Health Warning**: Label must contain "GOVERNMENT WARNING" text

## Sample Label Images

Sample label images can be found in the `sample label example/` directory called "Sample Label Example"

## Build & Deploy

### Frontend Build

To create a production build of the React frontend:

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/dist` directory.


### Backend Deployment

For production deployment of the Flask backend:

```bash
cd server
pip freeze > requirements.txt
```

### Environment Variables

For production, you need to configure environment variables for both frontend and backend:

#### Frontend API Configuration

The frontend needs to know your backend server URL:

1. **Create a `.env` file** in the `client/` directory (if not exists)
2. **Add your backend URL**:
   ```env
   # For local development
   VITE_API_URL=http://127.0.0.1:5001

   # For production
   VITE_API_URL=https://your-backend-domain.com
   ```
3. **Update your API calls** to use `import.meta.env.VITE_API_URL` instead of hardcoded URLs
4. **For deployment platforms**, set `VITE_API_URL` as an environment variable in your platform's dashboard

#### Backend CORS Configuration

The backend uses a `.env` file to configure allowed CORS origins. Before deploying:

1. **Locate** the `.env` file in the `server/` directory
2. **Update CORS_ORIGINS** with your production frontend domain:
   ```env
   # For production
   CORS_ORIGINS=https://your-frontend-domain.com

   # For multiple domains (comma-separated)
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app.netlify.app
   ```
3. **For cloud deployments** (Heroku, Railway, etc.), set the environment variable in your platform's dashboard instead of using the `.env` file

**Development vs Production:**
- **Frontend**: `VITE_API_URL=http://127.0.0.1:5001` (local) → `VITE_API_URL=https://your-backend.com` (production)
- **Backend**: `CORS_ORIGINS=*` (development) → `CORS_ORIGINS=https://your-frontend.com` (production)

**Important:** Never commit `.env` files with production values to version control. Ensure `.env` is in your `.gitignore`