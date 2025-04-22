import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractSecurityStorage, AuthModule, LogLevel, OpenIdConfiguration, StsConfigLoader, StsConfigStaticLoader } from 'angular-auth-oidc-client';
import { IAuthConfig } from './interfaces/auth-config.interface';
import { PLATFORM_AUTH_CONFIG } from './constants/auth-token.type';
import { AuthStorageService } from './services/auth-storage.service';
import { AuthGuard } from './guards/auth.guard';


const authConfig: OpenIdConfiguration = {
	configId: '0-LocalIdSrv',
	authority: 'https://apps-int.itwo40.eu/itwo40/identityserver600/core',
	secureRoutes: ['https://apps-int.itwo40.eu/itwo40/daily',
		'https://apps-int.itwo40.eu/itwo40'],
	redirectUrl: window.location.origin + window.location.pathname + '#/auth-callback',
	// postLoginRoute: window.location.origin + "/#/company",
	// postLogoutRedirectUri: window.location.origin+"/#/logout",
	postLogoutRedirectUri: window.location.origin + window.location.pathname,
	clientId: 'itwo40.authcode.nosecret',
	scope: 'openid profile email offline_access',
	responseType: 'code',
	silentRenew: true,
	useRefreshToken: true,
	autoUserInfo: true,
	refreshTokenRetryInSeconds: 30,
	tokenRefreshInSeconds: 30,
	ignoreNonceAfterRefresh: true,
	logLevel: LogLevel.Warn,
};

@NgModule({
	imports: [
		AuthModule.forRoot({
			loader: {
				provide: StsConfigLoader,
				useFactory: (config: IAuthConfig) => {
					authConfig.authority = config.identityBaseUrl;
					authConfig.logLevel = LogLevel[config.logLevel as keyof typeof LogLevel];

					const splitted = config.identityBaseUrl.split('/');
					const baseUrl = splitted.slice(0, splitted.length - 2).join('/');

					authConfig.secureRoutes = [baseUrl, ...(authConfig.secureRoutes || [])];

					return new StsConfigStaticLoader(authConfig);
				},
				deps: [PLATFORM_AUTH_CONFIG],
			},
		}),
		CommonModule
	],
	providers: [
		AuthGuard,
		{provide: AbstractSecurityStorage, useClass: AuthStorageService}
	]
})
export class PlatformAuthenticationModule {

}
