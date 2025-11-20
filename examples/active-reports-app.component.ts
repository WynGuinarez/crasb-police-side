import { Component } from '@angular/core';
import { ActiveReportsDashboardComponent } from './active-reports-dashboard.component';

/**
 * Root Application Component
 * 
 * Main entry point for the Angular application.
 * Renders the Active Reports Dashboard component.
 * 
 * @component
 */
@Component({
  selector: 'app-root',
  standalone: false,
  imports: [],
  template: `
    <div class="app-container">
      <app-active-reports-dashboard></app-active-reports-dashboard>
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
  title = 'Active Reports Dashboard';
}

