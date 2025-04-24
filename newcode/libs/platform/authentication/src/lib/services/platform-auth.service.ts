import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PlatformAuthService {

	private authenticated = false;

	public constructor(private oidcSecurityService: OidcSecurityService) {
	}

	public setAuthenticated(value: boolean): void {
		this.authenticated = value;
	}

	public isLoggedOn() {
		return this.oidcSecurityService.isAuthenticated$;
	}

	public checkAuth() {
		return this.oidcSecurityService.checkAuth();
	}

	public authorize() {
		this.oidcSecurityService.authorize();
	}

	/***
	 * Gets the current access token
	 */
	public getAccessToken() : Observable<string> {
		return this.oidcSecurityService.getAccessToken();
	}

	/**
	 * Redirects to the Security Token Service to log into the app using the default configuration
	 */
	public login() {
		this.oidcSecurityService.authorize();
	}

	private refreshSession() {
		this.oidcSecurityService.forceRefreshSession().subscribe((result) => console.log(result));
	}

	private logout() {
		this.oidcSecurityService.logoff().subscribe(() => {
			console.log('Logout complete');
		});
	}

	public logoffAndRevokeTokens() {
		this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => console.log(result));
	}

	private revokeRefreshToken() {
		this.oidcSecurityService.revokeRefreshToken().subscribe((result) => console.log(result));
	}

	private revokeAccessToken() {
		this.oidcSecurityService.revokeAccessToken().subscribe((result) => console.log(result));
	}

	public getUserData() {
		return this.oidcSecurityService.getUserData();
	}
}
