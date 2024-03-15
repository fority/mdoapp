import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { CsrfInterceptor } from './core/interceptor/csrf.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptor/error-handler.interceptor';
import { AuthConfigModule } from './shared/auth/auth-config.module';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';

@NgModule({
  declarations: [AppComponent],
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SpinnerComponent,
    AppRoutingModule,
    AuthConfigModule,
    BrowserModule,
    BrowserAnimationsModule,
    ConfirmPopupModule,
    ToastModule,
    SharedModule,
  ],
})
export class AppModule {}