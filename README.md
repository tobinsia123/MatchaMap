# Matchaverse

A full-stack web application for UCI students to discover and explore matcha spots in and around Irvine, CA.

## Features

- 🔍 **Search & Filter**: Search matcha spots by name, location, or description
- ⭐ **Ratings & Reviews**: View ratings and review counts for each spot
- 🏆 **Featured Spots**: Highlight your favorite matcha locations
- 💰 **Price Range**: Filter by price range ($ to $$$$)
- 📍 **Location Details**: Complete address information for each spot
- 📱 **Responsive Design**: Beautiful, modern UI that works on all devices
- 🎨 **Modern UI**: Clean, matcha-themed design with smooth animations
- 👥 **User Authentication**: Firebase Authentication for user accounts
- 📝 **Matcha Feed**: Share and discover matcha experiences from the community

## Tech Stack

### Backend (Firebase)
- **Firebase Authentication**: User login/registration
- **Cloud Firestore**: Database for spots and experiences
- **Firebase Storage** (optional): For hosting images

### Frontend
- **React 19**: Modern React with hooks
- **Firebase SDK**: Firebase client libraries
- **React Leaflet**: Interactive maps
- **CSS3**: Custom styling with modern design patterns

## Project Structure

```
MatchaMap/
├── frontend/            # React application
│   ├── public/
│   │   ├── matcha_spots/  # Static image files
│   │   └── MatchaverseLogo.png
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── LandingPage.js
│   │   │   ├── MapView.js
│   │   │   ├── Sidebar.js
│   │   │   ├── FeedPanel.js
│   │   │   ├── AuthModal.js
│   │   │   └── ...
│   │   ├── services/    # Firebase service layer
│   │   │   ├── firebase.js
│   │   │   ├── authFirebase.js
│   │   │   ├── spotsFirebase.js
│   │   │   └── experiencesFirebase.js
│   │   ├── App.js       # Main app component
│   │   └── App.css      # App styles
│   └── package.json
├── FIRESTORE_SETUP.md   # Firestore security rules setup
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 14+ and npm
- Firebase account (free tier works)

### Firebase Setup

1. **Create a Firebase project** at https://console.firebase.google.com
2. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
3. **Create a Firestore database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in "Production mode" (we'll set rules next)
4. **Set up Firestore security rules** (REQUIRED):
   - Go to Firestore Database → Rules tab
   - Copy the rules from `FIRESTORE_SETUP.md` or see below
   - Click **"Publish"** (critical step!)
   
   ```javascript
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

5. **Get your Firebase config**:
   - Go to Project settings → General → Your apps
   - Click the web icon (`</>`) to add a web app
   - Copy the config values

6. **Create `frontend/.env` file**:
   ```env
   REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
   REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
   ```

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

### Setting Up Matcha Spots Data

1. **Create the `spots` collection in Firestore**:
   - Go to Firebase Console → Firestore Database
   - Click "Start collection"
   - Collection ID: `spots`
   - Add documents with the following fields:
     - `name` (string)
     - `address` (string)
     - `city` (string)
     - `state` (string)
     - `zip_code` (string)
     - `latitude` (number)
     - `longitude` (number)
     - `rating` (number, 0-5)
     - `review_count` (number)
     - `description` (string)
     - `phone` (string, optional)
     - `website` (string, optional)
     - `hours` (string, optional)
     - `price_range` (string: `$`, `$$`, `$$$`, or `$$$$`)
     - `is_featured` (boolean)
     - `imageUrl` (string, optional) - Use paths like `/matcha_spots/omomo.jpg` for images in `public/matcha_spots/`

2. **Add images** (optional):
   - Place images in `frontend/public/matcha_spots/`
   - Set `imageUrl` field in Firestore to `/matcha_spots/your-image.jpg`

## Usage

### Viewing Matcha Spots

- **Map View**: Interactive map showing all matcha spots
- **Sidebar**: Searchable list of all spots with filters
- **Featured Spots**: Toggle to show only featured locations
- **User Location**: Click the location button to center map on your position

### Sharing Experiences

1. Click the "Feed" button on the map
2. Log in or register (if not already logged in)
3. Fill out the experience form:
   - Title (required)
   - Content (required)
   - Optional: Select a matcha spot
   - Optional: Add a rating (1-5)
4. Click "Post experience"

### Managing Your Account

- **Register**: Click "Log in / Register" → Create account
- **Log in**: Enter your email and password
- **Log out**: Click your username in the Feed panel → Log out

## Development

### Running the App

```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
cd frontend
npm run build
```

The `build/` folder contains the production-ready app. Deploy this folder to Vercel, Netlify, or any static hosting service.

## Deployment

### Frontend (Vercel Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `REACT_APP_FIREBASE_*` variables from your `.env` file

4. **Redeploy** after adding env vars

### Firebase Environment Variables

Make sure to add your Firebase config as environment variables in your hosting platform:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`

## Troubleshooting

### "Missing or insufficient permissions" Error

This means your Firestore security rules aren't set up correctly. See `FIRESTORE_SETUP.md` for detailed instructions.

### Images Not Showing

- Make sure images are in `frontend/public/matcha_spots/`
- Check that `imageUrl` in Firestore starts with `/matcha_spots/`
- Verify image filenames match exactly (case-sensitive)

### Authentication Not Working

- Verify Firebase Authentication is enabled (Email/Password)
- Check that your `.env` file has correct Firebase config
- Restart the dev server after changing `.env` file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

See LICENSE file for details.

## Acknowledgments

Built for UCI students to discover the best matcha spots in Irvine! 🍵
