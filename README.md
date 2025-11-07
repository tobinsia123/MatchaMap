# MatchaMap 🍵

A full-stack web application for UCI students to discover and explore matcha spots in and around Irvine, CA.


## Features

- 🔍 **Search & Filter**: Search matcha spots by name, location, or description
- ⭐ **Ratings & Reviews**: View ratings and review counts for each spot
- 🏆 **Featured Spots**: Highlight your favorite matcha locations
- 💰 **Price Range**: Filter by price range ($ to $$$$)
- 📍 **Location Details**: Complete address information for each spot
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎨 **Modern UI**: Clean, matcha-themed design with smooth animations

## Tech Stack

### Backend
- **Django 5.2.7**: Python web framework
- **Django REST Framework**: RESTful API
- **django-cors-headers**: CORS support for React frontend
- **django-filter**: Advanced filtering capabilities
- **Pillow**: Image handling

### Frontend
- **React 19**: Modern React with hooks
- **Axios**: HTTP client for API calls
- **CSS3**: Custom styling with modern design patterns

## Project Structure

```
MatchaMap/
├── backend/              # Django project settings
│   ├── settings.py       # Django configuration
│   ├── urls.py          # Main URL configuration
│   └── ...
├── matcha_spots/        # Django app
│   ├── models.py        # MatchaSpot model
│   ├── views.py         # API viewsets
│   ├── serializers.py   # DRF serializers
│   ├── urls.py          # API endpoints
│   └── admin.py         # Django admin configuration
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layer
│   │   ├── App.js       # Main app component
│   │   └── App.css      # App styles
│   └── package.json
├── requirements.txt     # Python dependencies
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+ (recommended: Python 3.13)
- Node.js 14+ and npm
- pip (Python package manager)

### Backend Setup

1. **Create and activate virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Create a superuser** (optional, for admin access):
   ```bash
   python manage.py createsuperuser
   ```

5. **Load sample data** (optional):
   ```bash
   python manage.py load_sample_data
   ```
   This will create 6 sample matcha spots in Irvine for testing.

6. **Run the Django development server**:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

   The React app will automatically open in your browser at `http://localhost:3000`

   If it doesn't open automatically, navigate to `http://localhost:3000` in your browser.

   > **Tip:** If your backend runs on a different domain or port, create `frontend/.env` with `REACT_APP_API_URL=https://your-backend-domain/api`.

### Firebase Authentication (Frontend)

To use Firebase for login/registration:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication → Sign-in method → Email/Password
3. Create a Firestore database (Production mode is fine)
4. Copy your Web App config from Project settings → General → Your Apps
5. Create `frontend/.env` and add:
   ```
   REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
   # optional
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
   ```
6. Restart the React dev server (`npm start`) to pick up env vars

The app will now use Firebase Authentication for login/registration and Firestore for the experiences feed.

### Firestore for Matcha Spots

If you want to host `MatchaSpot` data in Firebase instead of Django:

1. In Firebase Console, open Firestore and create a collection named `spots`.
2. Each document should include fields:
   - `name` (string), `address` (string), `city` (string), `state` (string), `zip_code` (string)
   - `latitude` (number), `longitude` (number)
   - `rating` (number), `review_count` (number)
   - `description` (string), `phone` (string), `website` (string), `hours` (string)
   - `price_range` (string: `$`, `$$`, `$$$`, `$$$$`)
   - `is_featured` (boolean)
   - `imageUrl` (string, optional; host in Firebase Storage or external URL)
3. **Security rules (REQUIRED - See FIRESTORE_SETUP.md for detailed instructions)**:
   
   ⚠️ **IMPORTANT**: Without proper Firestore security rules, you'll get "Missing or insufficient permissions" errors when posting experiences.
   
   Quick setup:
   - Go to Firebase Console → Firestore Database → Rules tab
   - Paste the rules from `FIRESTORE_SETUP.md` (or see below)
   - Click **"Publish"** (this is critical!)
   
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /experiences/{experienceId} {
         allow read: if true;
         allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
         allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
       }
       match /spots/{spotId} {
         allow read: if true;
         allow write: if false;
       }
     }
   }
   ```
   
   See `FIRESTORE_SETUP.md` for troubleshooting if you encounter permission errors.
4. Restart the frontend after setting Firebase env vars. The app will read spots from Firestore and continue to use Firestore for the feed.

## API Endpoints

### Base URL: `http://localhost:8000/api/`

### Authentication
- `POST /auth/register/` – Create a new user account (returns token)
- `POST /auth/login/` – Obtain token for existing user
- `GET /auth/user/` – Retrieve current user profile (requires `Authorization: Token <token>` header)

### Matcha Spots
- `GET /spots/` – List all matcha spots
- `GET /spots/{id}/` – Get a specific matcha spot
- `POST /spots/` – Create a new matcha spot
- `PUT /spots/{id}/` – Update a matcha spot
- `DELETE /spots/{id}/` – Delete a matcha spot
- `GET /spots/featured/` – Get featured matcha spots
- `GET /spots/top_rated/` – Get top-rated matcha spots (rating >= 4.0)

Query parameters: `city`, `price_range`, `is_featured`, `search`, `ordering`

### Matcha Experiences Feed
- `GET /experiences/` – List all shared experiences (public)
- `POST /experiences/` – Share a new experience (requires auth)
- `GET /experiences/{id}/` – Retrieve a single experience
- `PUT /experiences/{id}/` – Update your experience
- `DELETE /experiences/{id}/` – Delete your experience

Request payload for `POST /experiences/`:
```json
{
  "title": "Sunset Matcha Session",
  "content": "Loved the cozy atmosphere and smooth matcha latte.",
  "rating": 5,            // optional, integer 1-5
  "spot": 3               // optional MatchaSpot ID, or null
}
```

## Adding Matcha Spots

### Via Django Admin

1. Access the admin panel at `http://localhost:8000/admin`
2. Log in with your superuser credentials
3. Navigate to "Matcha Spots"
4. Click "Add Matcha Spot" and fill in the details

### Via API

You can use tools like Postman or curl to add spots:

```bash
curl -X POST http://localhost:8000/api/spots/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Example Matcha Cafe",
    "address": "123 Main St",
    "city": "Irvine",
    "state": "CA",
    "zip_code": "92620",
    "rating": 4.5,
    "review_count": 150,
    "description": "A cozy matcha cafe with excellent service",
    "phone": "(949) 123-4567",
    "website": "https://example.com",
    "hours": "Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-10PM",
    "price_range": "$$"
  }'
```

## Development

### Running Both Servers

You'll need two terminal windows:

**Terminal 1 - Django Backend**:
```bash
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - React Frontend**:
```bash
cd frontend
npm start
```

### Database Migrations

When you modify models, create and apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Production Deployment

### Backend

1. Set `DEBUG = False` in `backend/settings.py`
2. Update `ALLOWED_HOSTS` with your domain
3. Configure a production database (PostgreSQL recommended)
4. Set up static file serving
5. Use a production WSGI server (gunicorn, uWSGI)

### Frontend

1. Build the React app:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the `build/` directory with a web server (nginx, Apache)
3. Update API base URL in `frontend/src/services/api.js` for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See LICENSE file for details.

## Acknowledgments

Built for UCI students to discover the best matcha spots in Irvine! 🍵
