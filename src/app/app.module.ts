import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthConfigModule } from './shared/auth/auth-config.module';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { AuthInterceptor, CsrfInterceptor, ErrorInterceptor } from 'fxt-core';

@NgModule({
  declarations: [AppComponent],
  providers: [
    provideHttpClient(),
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
      useClass: ErrorInterceptor,
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
