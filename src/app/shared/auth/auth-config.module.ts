import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: environment.AuthServerUrl,
        redirectUrl: environment.RedirectUrl,
        postLogoutRedirectUri: environment.RedirectUrl,
        clientId: 'PrimeOrderClient',
        scope: 'openid profile email offline_access roles api_scope',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 30,
        ignoreNonceAfterRefresh: true, // this is required if the id_token is not returned
        triggerRefreshWhenIdTokenExpired: false, // required when refreshing the browser if id_token is not updated after the first authentication
        // allowUnsafeReuseRefreshToken: true, // this is required if the refresh token is not rotated
        autoUserInfo: true, // if the user endpoint is not supported.
        logLevel: LogLevel.Error,
        historyCleanupOff: false,
        triggerAuthorizationResultEvent: true,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule { }
