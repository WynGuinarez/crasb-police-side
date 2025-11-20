# Firebase Setup Guide

## Why the Error Occurred

The error "Failed to initialize: Firebase configuration (__firebase_config) is not provided" occurs because the chat component expects Firebase configuration to be available as global variables on the `window` object, but these variables were never initialized.

## Solution

I've set up automatic initialization of Firebase global variables. Now you just need to configure your Firebase credentials.

## Setup Steps

### 1. Create Environment File

Create a file named `.env.local` in the root of your project with the following content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Application ID
NEXT_PUBLIC_APP_ID=crash-police-app

# Optional: Firebase Custom Auth Token (if using custom authentication)
NEXT_PUBLIC_FIREBASE_AUTH_TOKEN=
```

### 2. Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon (</>)
7. Copy the configuration values from the `firebaseConfig` object

### 3. Update Environment Variables

Replace the placeholder values in `.env.local` with your actual Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyExample123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 4. Restart Development Server

After creating/updating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

1. **`lib/firebase-config.ts`**: Contains Firebase configuration that reads from environment variables
2. **`pages/_app.tsx`**: Automatically initializes global variables when the app loads
3. **Chat Component**: Uses the global variables to connect to Firebase

## Firestore Security Rules

Make sure your Firestore security rules allow read/write access. Example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/active_reports/{reportId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      
      match /chats/{userId}/{messageId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null 
                     && request.resource.data.text.size() <= 500
                     && request.resource.data.senderType in ['police', 'sender'];
      }
    }
  }
}
```

## Troubleshooting

### Error: "Firebase configuration is missing"
- Make sure `.env.local` exists in the project root
- Verify all `NEXT_PUBLIC_*` variables are set
- Restart the development server after creating/updating `.env.local`

### Error: "Permission denied"
- Check your Firestore security rules
- Ensure you're authenticated (if using custom tokens)

### Error: "App ID is missing"
- Set `NEXT_PUBLIC_APP_ID` in `.env.local`
- Default value is `crash-police-app` if not set

## Notes

- **Never commit `.env.local`** to version control (it's already in `.gitignore`)
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- For production, set these variables in your hosting platform's environment settings

