# Firestore Security Rules Setup

## Quick Fix for "Missing or insufficient permissions" Error

If you're getting permission errors when posting experiences, you need to update your Firestore security rules.

### Steps:

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**
3. **Open Firestore Database** (left sidebar)
4. **Click on "Rules" tab** (at the top)
5. **Replace the existing rules with this**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Experiences: Anyone can read, authenticated users can create/update/delete their own
    match /experiences/{experienceId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Spots: Public read, no writes (or restrict to admins)
    match /spots/{spotId} {
      allow read: if true;
      allow write: if false; // Lock down - update later if you add admin UI
    }
  }
}
```

6. **Click "Publish"** (top right) - This is critical! Rules won't apply until you publish.
7. **Wait a few seconds** for rules to propagate
8. **Try posting an experience again**

### What these rules do:

- **Experiences read**: Anyone can view experiences (public feed)
- **Experiences create**: Only authenticated users can create, and they must set `userId` to their own `uid`
- **Experiences update/delete**: Users can only modify their own experiences
- **Spots read**: Anyone can view spots
- **Spots write**: Currently disabled (update later when you add admin features)

### Troubleshooting:

- **Still getting errors?** Make sure:
  1. Rules are **published** (not just saved)
  2. You're **logged in** (check the Feed panel shows your username)
  3. The `experiences` collection exists in Firestore
  4. Your Firebase project ID in `.env` matches the console

- **Rules syntax error?** Make sure you copied the entire block including `rules_version = '2';`

### Testing Rules:

After publishing, try:
1. Create a new experience while logged in → Should work ✅
2. Try creating while logged out → Should show auth prompt ✅
3. View experiences while logged out → Should work ✅

