import { Component } from '@angular/core';
import { PoliceSenderChatComponent } from './police-sender-chat.component';

/**
 * Root Application Component
 * 
 * Main entry point for the Angular application.
 * Renders the Police-Sender Chat component.
 * 
 * @component
 */
@Component({
  selector: 'app-root',
  standalone: false,
  imports: [],
  template: `
    <div class="app-container">
      <app-police-sender-chat></app-police-sender-chat>
    </div>
  `,
  styles: [`
    .app-container {
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'Police-Sender Chat Application';
}

