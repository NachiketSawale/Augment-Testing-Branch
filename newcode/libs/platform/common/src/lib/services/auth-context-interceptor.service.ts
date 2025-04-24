import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ServiceLocator } from './locator.service';
import { PlatformConfigurationService } from './platform-configuration.service';

@Injectable({
	providedIn: 'root'
})


export class AuthContextInterceptorService implements HttpInterceptor {

	public constructor(private configurationService: PlatformConfigurationService) {
	}

	public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		if (!this.configurationService) {
			console.log('Http intercept load configurationService');
			this.configurationService = ServiceLocator.injector.get(PlatformConfigurationService);

			console.log('Http intercept load configurationService loaded', this.configurationService);
		}

		if (this.configurationService) {
			const cCtx = this.configurationService.getContextHeader();
			if(cCtx){
				request = request.clone({
					setHeaders: {'client-context': cCtx}
				});
			}
		}
		return next.handle(request).pipe(
			catchError((err) => {
				if (err instanceof HttpErrorResponse) {
					if (err.status === 401) {
						// redirect user to the logout page
					}
				}
				return throwError(err);
			})
		);
	}

	/**
	 * first test with our own intervceptor, was not working like expected... oidc service only suppling obeservables.
	 * @param request
	 * @param next
	 */
	// intercept1(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	// 	const allConfig = this.configurationService.getAllConfigurations();
	// 	const currentConfig = allConfig.find((x) => x.configId === '0-LocalIdSrv');
	// 	if (currentConfig && this.theLogonService.isLoggedOn()) {
	// 		const token = this.authService.getAccessToken('0-LocalIdSrv');
	// 		this.authStateService.getAccessToken(currentConfig);
	// 		//const token = this.authService.getAccessToken();
	// 		if (token instanceof Observable) {
	// 			console.log('AuthContextInterceptorService: no token found');
	// 		} else {
	// 			// If we have a token, we set it to the header
	// 			request = request.clone({
	// 				setHeaders: {Authorization: `Bearer ${token}`}
	// 			});
	// 		}
	// 	}
	// 	return next.handle(request).pipe(
	// 		catchError((err) => {
	// 			if (err instanceof HttpErrorResponse) {
	// 				if (err.status === 401) {
	// 					// redirect user to the logout page
	// 				}
	// 			}
	// 			return throwError(err);
	// 		})
	// 	)
	// }
}
