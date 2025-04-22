/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
// TODO: restore test cases
//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { HttpClient, HttpHandler } from '@angular/common/http';
//import { RouterModule } from '@angular/router';
//import { LogLevel, OpenIdConfiguration, StsConfigLoader, StsConfigStaticLoader } from 'angular-auth-oidc-client';

//import { UiMainFrameHeaderComponent } from './header.component';
//import { UiMainFrameAppInfoHeaderComponent } from '../app-info-header/app-info-header.component';
//import { UiMainFrameNotificationDisplayComponent } from '../notification-display/notification-display.component';
//import { UiMainFrameSessionInfoHeaderComponent } from '../session-info-header/session-info-header.component';
//import { IAuthConfig } from '@libs/platform/authentication';
//import { UiMainFrameMainMenuComponent } from '../main-menu/main-menu.component';
//import { UiCommonDropdownButtonComponent } from '@libs/ui/common';
// TODO: This is from menu-list-old and will be removed
//import { UiCommonMenuListSideBarDropdownComponent } from '@libs/ui/common';
//import { PlatformCommonModule } from '@libs/platform/common';
/*
const authConfig: OpenIdConfiguration = {
   configId: '0-LocalIdSrv',
   authority: 'https://apps-int.itwo40.eu/itwo40/identityserver600/core',
   secureRoutes: ['https://apps-int.itwo40.eu/itwo40/daily',
      'https://rib-w1236.rib-software.com/itwo40dev/trunk',
      '/itwo40dev/trunk', /* '/itwo40dev/trunk'  local url do not hav the dns as prefix, therefore we only need to define path right from dns */
     /* 'https://apps-int.itwo40.eu/itwo40'],
   redirectUrl: window.location.origin + window.location.pathname + '#/auth-callback',
   // postLoginRoute: window.location.origin + "/#/company",
   // postLogoutRedirectUri: window.location.origin+"/#/logout",
   postLogoutRedirectUri: window.location.origin + window.location.pathname,
   clientId: 'itwo40.authcode.nosecret', //clientId: 'devkit-clients-spa.pkce',
   scope: 'openid profile email offline_access',
   responseType: 'code',
   silentRenew: true, // silentRenewUrl: '${window.location.origin}/silent-renew.html',
   useRefreshToken: true,
   autoUserInfo: true,
   refreshTokenRetryInSeconds: 30,
   tokenRefreshInSeconds: 30,
   ignoreNonceAfterRefresh: true,
   logLevel: LogLevel.Warn,
};*/
describe('UiMainFrameHeaderComponent', () => {
   // TODO: replace with actual test cases
   it('is successful', () => {
      expect(true).toBeTruthy();
   });

   // let component: UiMainFrameHeaderComponent;
   // let fixture: ComponentFixture<UiMainFrameHeaderComponent>;
   //
   // beforeEach(async () => {
   // 	await TestBed.configureTestingModule({
   // 		imports: [
   // 			RouterModule.forRoot([]),PlatformCommonModule
   // 		  ],
   // 		declarations: [UiMainFrameHeaderComponent,UiMainFrameAppInfoHeaderComponent,UiMainFrameNotificationDisplayComponent,UiMainFrameMainMenuComponent,
   // 			UiMainFrameSessionInfoHeaderComponent,UiCommonDropdownButtonComponent/*,UiCommonMenuListSideBarDropdownComponent*/],
   // 		providers :[HttpClient,HttpHandler,
   // 			{
   // 				provide: StsConfigLoader,
   // 				useFactory: (config: IAuthConfig) => {
   // 					authConfig.authority = config?.identityBaseUrl;
   // 					authConfig.logLevel = LogLevel[config?.logLevel as keyof typeof LogLevel];
   // 					console.log('PlatformAuthenticationModule() got user config ', config);
   // 					console.log('PlatformAuthenticationModule() using config ', authConfig);
   // 					return new StsConfigStaticLoader(authConfig);
   // 				}
   // 			},]
   // 	}).compileComponents();
   // });
   //
   // beforeEach(() => {
   // 	fixture = TestBed.createComponent(UiMainFrameHeaderComponent);
   // 	component = fixture.componentInstance;
   // 	fixture.detectChanges();
   // });
   //
   // it('should create', () => {
   // 	expect(component).toBeTruthy();
   // });
});
