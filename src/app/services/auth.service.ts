import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private oidcSecurityService: OidcSecurityService) {}

	get isLoggedIn() {
		return this.oidcSecurityService.isAuthenticated$;
	}

	get isAuthenticated$() {
		return this.oidcSecurityService.authorize();
	}
	// Note : depreciated
	get token() {
		return this.oidcSecurityService.getAccessToken();
	}

	get idToken() {
		return this.oidcSecurityService.getIdToken();
	}

	get user() {
		return async () => {
			await this.oidcSecurityService.userData$.toPromise();
		};
	}

	async GetUser() {
		return await this.oidcSecurityService.userData$.toPromise();
	}


	get userData() {
    return this.oidcSecurityService.userData$;
	}

	checkAuth() {
    return this.oidcSecurityService.checkAuth();
	}

	doLogin() {
    return of(this.oidcSecurityService.authorize());
	}

  GetUserData() {
    return this.oidcSecurityService.getUserData();
  }

	signOut() {
		this.oidcSecurityService.logoff();
	}
}
