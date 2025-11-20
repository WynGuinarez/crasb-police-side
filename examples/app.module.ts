import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { PoliceSenderChatComponent } from './police-sender-chat.component';

/**
 * Root Application Module
 * 
 * Configures the Angular application with:
 * - Browser and animation modules
 * - Firebase services (App, Firestore, Auth)
 * - Police-Sender Chat component
 * 
 * @module
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PoliceSenderChatComponent,
    provideFirebaseApp(() => {
      const firebaseConfig = (window as any).__firebase_config;
      if (!firebaseConfig) {
        throw new Error('Firebase configuration (__firebase_config) must be provided globally');
      }
      return initializeApp(firebaseConfig);
    }),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

