/*
 * Copyright(c) RIB Software GmbH
 */

import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { preloadModules } from './model/module-management/preload-modules.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PlatformConfigurationService } from '@libs/platform/common';
import { AuthContextInterceptorService } from '@libs/platform/common';
import { ServiceLocator } from '@libs/platform/common';
import { UiMainFrameModule } from '@libs/ui/main-frame';
import { PlatformAuthenticationModule } from '@libs/platform/authentication';
import { AuthInterceptorService, PLATFORM_AUTH_CONFIG } from '@libs/platform/authentication';
import { UiGridModule } from '@libs/ui/grid';
import { ErrorInterceptorService } from '@libs/ui/platform';

/**
 * reading config.json via xhr call
 * @param config
 */
function configurationReaderXhr(config: PlatformConfigurationService) {
	return () => config.loadInitialConfiguration();
}

function authUserConfigFactory(configService: PlatformConfigurationService) {
	return configService.getOidcUserConfig();
}

type SafeAny = any;

// const authModuleConfig: PassedInitialConfig = {
// 	config: {
// 		configId: "0-LocalIdSrv",
// 		//authority: 'https://rib-w1236.rib-software.com/itwo40dev/trunk/identityservercore/core',
// 		//secureRoutes: ['https://rib-w1236.rib-software.com/itwo40dev/trunk', 'https://rib-w1236.rib-software.com'],
// 		authority: 'https://apps-int.itwo40.eu/itwo40/identityserver600/core',
// 		secureRoutes: ['https://apps-int.itwo40.eu/itwo40/daily',
// 			'https://rib-w1236.rib-software.com/itwo40dev/trunk',
// 			'/itwo40dev/trunk', /* '/itwo40dev/trunk'  local url do not hav the dns as prefix, therefore we only need to define path right from dns */
// 			'https://rib-w1184.rib-software.com/itwo40/dev',
// 			'/itwo40/dev',
// 			'https://apps-int.itwo40.eu/itwo40'],
// 		redirectUrl: window.location.origin + window.location.pathname,
// 		postLoginRoute: window.location.origin + "/#/company",
// 		// postLogoutRedirectUri: window.location.origin+"/#/logout",
// 		postLogoutRedirectUri: window.location.origin + "",
// 		clientId: 'itwo40.authcode.nosecret', //clientId: 'devkit-clients-spa.pkce',
// 		scope: 'openid profile email offline_access',
// 		responseType: 'code',
// 		silentRenew: true, // silentRenewUrl: '${window.location.origin}/silent-renew.html',
// 		useRefreshToken: true,
// 		autoUserInfo: true,
// 		refreshTokenRetryInSeconds: 30,
// 		tokenRefreshInSeconds: 30,
// 		logLevel: LogLevel.Warn,
// 	}
// }

@NgModule({
	declarations: [AppComponent],
	imports: ([BrowserModule, CommonModule, RouterModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule, UiMainFrameModule, PlatformAuthenticationModule, UiGridModule] as SafeAny[]).concat(preloadModules),
	providers: [
		PlatformConfigurationService,
		{provide: APP_INITIALIZER, deps: [PlatformConfigurationService], multi: true, useFactory: configurationReaderXhr},
		{provide: PLATFORM_AUTH_CONFIG, deps: [PlatformConfigurationService], useFactory: authUserConfigFactory},
		{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: AuthContextInterceptorService, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
		{provide: LocationStrategy, useClass: HashLocationStrategy},
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(private injector: Injector) {
		ServiceLocator.injector = this.injector;
	}
}
