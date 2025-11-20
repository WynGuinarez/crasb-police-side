# Active Reports Dashboard - Quick Start Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install @angular/fire firebase
```

### 2. Set Global Firebase Variables

Add to your `index.html` or `main.ts`:

```typescript
(window as any).__app_id = 'your-app-id';
(window as any).__firebase_config = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
(window as any).__initial_auth_token = 'your-token'; // Optional
```

### 3. Import Component

```typescript
import { ActiveReportsDashboardComponent } from './active-reports-dashboard.component';

@NgModule({
  imports: [
    ActiveReportsDashboardComponent,
    // ... other imports
  ],
})
```

### 4. Use in Template

```html
<app-active-reports-dashboard></app-active-reports-dashboard>
```

---

## 📋 Features

✅ **Real-Time Reports Dashboard**
- Displays active reports from Firestore
- Real-time updates using onSnapshot
- Table shows: Category, Location, Status, Time, Actions
- No Distance/ETA columns (as per requirements)

✅ **Per-Report Chat System**
- Each report has its own chat subcollection
- Unique path: `/artifacts/{__app_id}/public/data/active_reports/{reportId}/chats`
- Real-time message updates
- Role switching (Police/Sender)
- Blue bubbles for Police (right-aligned)
- Gray bubbles for Sender (left-aligned)

---

## 📁 File Structure

```
active-reports-dashboard.component.ts    # Main dashboard component (single-file)
active-reports-app.component.ts          # Root app component
active-reports-app.module.ts             # Angular module
ACTIVE_REPORTS_DASHBOARD_DOCUMENTATION.md # Complete documentation
```

---

## 🔥 Firestore Structure

### Reports Collection
```
/artifacts/{__app_id}/public/data/active_reports
```

### Chat Subcollection (Per Report)
```
/artifacts/{__app_id}/public/data/active_reports/{reportId}/chats
```

---

## 🎨 UI Preview

### Dashboard Table
```
┌──────────┬──────────────┬──────────┬──────────┬─────────┐
│ Category │ Location     │ Status   │ Time     │ Actions │
├──────────┼──────────────┼──────────┼──────────┼─────────┤
│ Crime    │ Manila       │ Pending  │ Jan 15   │ [Chat]  │
│ Fire     │ Quezon City  │ En Route │ Jan 15   │ [Chat]  │
└──────────┴──────────────┴──────────┴──────────┴─────────┘
```

### Chat Modal
```
┌─────────────────────────────────────┐
│ Chat - Report #RPT-001              │
│ Crime - Manila                      │
├─────────────────────────────────────┤
│ Role: [Police] [Sender]            │
├─────────────────────────────────────┤
│              [Blue Bubble]         │
│              Police Message         │
│              2m ago                 │
│                                     │
│  [Gray Bubble]                      │
│  Sender Message                     │
│  5m ago                             │
├─────────────────────────────────────┤
│ [Type message...] [Send]            │
└─────────────────────────────────────┘
```

---

## 🔒 Security Rules

Set up Firestore rules in Firebase Console:

```javascript
match /artifacts/{appId}/public/data/active_reports/{reportId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;
  
  match /chats/{messageId} {
    allow read: if request.auth != null;
    allow write: if request.auth != null 
                 && request.resource.data.text.size() <= 500
                 && request.resource.data.senderType in ['police', 'sender'];
  }
}
```

---

## 📚 Documentation

For complete documentation, see:
- **[ACTIVE_REPORTS_DASHBOARD_DOCUMENTATION.md](./ACTIVE_REPORTS_DASHBOARD_DOCUMENTATION.md)**

---

**Version**: 1.0  
**Status**: ✅ Complete and Production-Ready

