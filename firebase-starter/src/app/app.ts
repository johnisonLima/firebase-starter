import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastContainer } from '@shared/components/toast/toast-container/toast-container';
import { LoadingOverlay } from '@shared/components/loading-overlay/loading-overlay';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    LoadingOverlay,
    ToastContainer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('firebase_starter');
}
