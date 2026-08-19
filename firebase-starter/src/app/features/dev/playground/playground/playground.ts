import { Component, inject, signal } from '@angular/core';

// Teste Theme
import { ThemeToggle } from '@shared/components/theme-toggle/theme-toggle';

// Teste Lucide
import { LucideHouse, LucideSettings, LucideTrash2, LucideUser, LucideArrowRight, LucideSave, } from '@lucide/angular';

// Teste Toast
import { ToastService } from '@shared/services/toast.service';

// Teste Dialog
import { Dialog } from '@shared/components/dialog/dialog';
import { DialogIconDirective } from '@shared/components/dialog/dialog-icon.directive';
import { DialogFooterDirective } from '@shared/components/dialog/dialog-footer.directive';

// Loading
import { Loading } from '@shared/components/loading/loading';
import { LoadingService } from '@shared/services/loading.service';

// Loading Button
import { Button } from '@shared/components/button/button';

// Guard
import { AuthService } from '@core/auth/auth.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { SKIP_LOADING } from '@core/interceptors/loading.interceptor';


@Component({
  selector: 'app-playground',
  imports: [
    ThemeToggle,
    LucideHouse, 
    LucideUser, 
    LucideSettings,
    LucideSave,
    LucideArrowRight,
    Dialog,
    LucideTrash2,
    DialogIconDirective,
    DialogFooterDirective,
    Loading,
    Button,
  ],
  templateUrl: './playground.html',
  styleUrl: './playground.scss',
})
export class Playground {

  readonly toastService = inject(ToastService);
  readonly loadingService = inject(LoadingService);
  readonly authService = inject(AuthService);
   private readonly http = inject(HttpClient);

  ngOnInit(): void {
  }

  testToast(): void {
    this.toastService.success(
      'Operação realizada com sucesso!'
    );
  }

  testMultipleToasts(): void {
    this.toastService.success('Toast 1');
    this.toastService.info('Toast 2');
    this.toastService.success('Toast 3');
    this.toastService.warning('Toast 4');
    this.toastService.error('Toast 5');
    this.toastService.success('Toast 6');
    this.toastService.info('Toast 7');
  }

  showDialog = signal(false);

  openDialog(): void {
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  startLoading(): void {
    this.loadingService.start();
  }

  stopLoading(): void {
    this.loadingService.stop();
  }

  // Teste Guard
  async logout(): Promise<void> {
    await this.authService.logout();
  }

  // Teste interceptor
  testHttp(): void {
    this.http
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.error(error);
        },
      });
  }

  testHttpWithError(): void {
    this.http
      .get('https://jsonplaceholder.typicode.com/rota-inexistente')
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.error(error);
        },
      });
  }

  testHttpWithoutLoading(): void {
    this.http
      .get(
        'https://jsonplaceholder.typicode.com/posts/1',
        {
          context: new HttpContext().set(
            SKIP_LOADING,
            true
          ),
        }
      )
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          console.error(error);
        },
      });
  }
}