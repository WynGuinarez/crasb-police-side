# Police-Sender Chat - Usage Guide

## Quick Start

This guide will help you integrate the Police-Sender Chat component into your Angular application.

---

## Prerequisites

1. **Angular 17+** (for standalone components support)
2. **Firebase SDK** installed:
   ```bash
   npm install @angular/fire firebase
   ```
3. **Tailwind CSS** configured in your project
4. **Firebase Project** with Firestore enabled

---

## Installation Steps

### 1. Install Dependencies

```bash
npm install @angular/fire firebase
```

### 2. Configure Firebase

Before the Angular application initializes, set the global Firebase variables:

**Option A: In `index.html`**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Police-Sender Chat</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    // Set global Firebase variables BEFORE Angular loads
    window.__app_id = 'your-app-id';
    window.__firebase_config = {
      apiKey: "your-api-key",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef"
    };
    window.__initial_auth_token = 'your-custom-token'; // Optional
  </script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

**Option B: In `main.ts` (before bootstrap)**
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Set global variables before bootstrapping
(window as any).__app_id = 'your-app-id';
(window as any).__firebase_config = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
(window as any).__initial_auth_token = 'your-custom-token'; // Optional

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

### 3. Import the Component

The component is standalone, so you can import it directly:

**In your module:**
```typescript
import { PoliceSenderChatComponent } from './police-sender-chat.component';

@NgModule({
  imports: [
    PoliceSenderChatComponent,
    // ... other imports
  ],
  // ...
})
export class YourModule { }
```

**Or in a standalone component:**
```typescript
import { PoliceSenderChatComponent } from './police-sender-chat.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [PoliceSenderChatComponent],
  template: `<app-police-sender-chat></app-police-sender-chat>`
})
export class ChatPageComponent { }
```

### 4. Use the Component

Simply add the component selector to your template:

```html
<app-police-sender-chat></app-police-sender-chat>
```

---

## Configuration

### Required Global Variables

| Variable | Type | Required | Description |
|-----------|------|----------|-------------|
| `__app_id` | `string` | Yes | Application identifier used in Firestore collection path |
| `__firebase_config` | `object` | Yes | Firebase configuration object |
| `__initial_auth_token` | `string` | No | Custom authentication token (optional) |

### Firestore Collection Path

Messages are stored at:
```
/artifacts/{__app_id}/public/data/police_sender_chats
```

Example: If `__app_id = "crash-app"`, messages are stored at:
```
/artifacts/crash-app/public/data/police_sender_chats
```

---

## Firestore Security Rules

Set up security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/police_sender_chats/{messageId} {
      // Allow read if authenticated
      allow read: if request.auth != null;
      
      // Allow write if authenticated and data is valid
      allow write: if request.auth != null 
                   && request.resource.data.text is string
                   && request.resource.data.text.size() > 0
                   && request.resource.data.text.size() <= 500
                   && request.resource.data.senderType in ['police', 'sender']
                   && request.resource.data.timestamp is timestamp;
    }
  }
}
```

---

## Features

### ✅ Real-time Updates
- Messages appear instantly using Firestore `onSnapshot` listeners
- No page refresh needed
- Automatic reconnection on network issues

### ✅ Role Switching
- Toggle between 'Police' and 'Sender' roles
- Visual indication of current role
- Messages are tagged with the selected role

### ✅ Message Ordering
- Messages automatically sorted by timestamp (oldest first)
- New messages appear at the bottom
- Auto-scroll to latest message

### ✅ Responsive Design
- Works on desktop and mobile devices
- Tailwind CSS styling
- Blue bubbles for Police messages (right-aligned)
- Gray bubbles for Sender messages (left-aligned)

### ✅ Error Handling
- User-friendly error messages
- Loading states
- Network error recovery

---

## Styling

The component uses Tailwind CSS. Ensure Tailwind is configured in your project:

**tailwind.config.js:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./police-sender-chat.component.ts"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## Troubleshooting

### Messages Not Appearing

1. **Check Firestore Rules**: Ensure read permissions are granted
2. **Verify Authentication**: Check if user is authenticated
3. **Check Console**: Look for Firestore errors in browser console
4. **Verify Collection Path**: Ensure `__app_id` is correctly set

### Real-time Updates Not Working

1. **Check onSnapshot Listener**: Verify listener is set up in component
2. **Check Network**: Ensure stable internet connection
3. **Check Firestore Rules**: Read permissions must be granted
4. **Check Browser Console**: Look for Firestore errors

### Permission Denied Errors

1. **Authenticate User**: Ensure user is logged in
2. **Update Firestore Rules**: Grant appropriate permissions
3. **Check Custom Token**: If using custom token, ensure it's valid

### Component Not Rendering

1. **Check Imports**: Ensure component is imported in module
2. **Check Selector**: Verify `<app-police-sender-chat>` is used correctly
3. **Check Console**: Look for Angular errors
4. **Verify Firebase Config**: Ensure `__firebase_config` is set

---

## Example Integration

### Complete Example: `app.component.ts`

```typescript
import { Component } from '@angular/core';
import { PoliceSenderChatComponent } from './police-sender-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PoliceSenderChatComponent],
  template: `
    <div class="h-screen w-screen">
      <app-police-sender-chat></app-police-sender-chat>
    </div>
  `
})
export class AppComponent { }
```

### Complete Example: `main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

// Set global variables
(window as any).__app_id = 'crash-police-app';
(window as any).__firebase_config = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp((window as any).__firebase_config)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));
```

---

## Best Practices

1. **Error Handling**: Always handle Firestore errors gracefully
2. **Memory Management**: Unsubscribe from listeners in `ngOnDestroy`
3. **Security**: Never expose Firebase config in client-side code (use environment variables)
4. **Validation**: Validate message content before sending
5. **Performance**: Consider pagination for large message histories
6. **Testing**: Test with different network conditions (online/offline)

---

## Support

For issues or questions:
1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Review Firebase Firestore documentation
3. Check Angular Fire documentation

---

**Version**: 1.0  
**Last Updated**: 2024

