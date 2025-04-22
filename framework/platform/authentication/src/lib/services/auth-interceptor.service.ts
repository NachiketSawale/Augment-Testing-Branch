import { Injectable } from '@angular/core';
import { AuthInterceptor } from 'angular-auth-oidc-client';

/**
 * Interceptor adding bearer token to http requests. only the routes which are present in the secureRoutes array of AuthModule config get the bearer token
 */
@Injectable({
	providedIn: 'root'
})
export class AuthInterceptorService extends AuthInterceptor {

}
