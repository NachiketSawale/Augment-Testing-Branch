/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, NgModule } from '@angular/core';
import { NavigationStart, ResolveEnd, Route, Router, RouterModule, ROUTES, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiPlatformModule } from '@libs/ui/platform';
import { CompanySelectionComponent, IdentityserverFailedComponent, AuthProcessComponent } from '@libs/ui/platform';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { MainFrameComponent } from '@libs/ui/main-frame';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

const routes: Routes = [
	{ path: 'company', title: 'company', component: CompanySelectionComponent },
	{ path: 'identityServerfailed', title: 'identityServerfailed', component: IdentityserverFailedComponent },
	{ path: 'auth-callback', component: AuthProcessComponent },

	// TODO: delete the following routes, just for testing
	//{path: 'resource', loadChildren: () => import('@libs/resource/certificate').then((module) => module.ModulesResourceCertificateModule)},
	{ path: 'ui-common', loadChildren: () => import('@libs/ui/common').then((module) => module.UiCommonModule) },
	{
		path: 'ui-container-system',
		loadChildren: () => import('@libs/ui/container-system').then((module) => module.UiContainerSystemModule)
	}
];

@NgModule({
	declarations: [],
	imports: [CommonModule, RouterModule.forRoot(routes)]
})
export class AppRoutingModule {
	private moduleManager = inject(PlatformModuleManagerService);

	constructor(public router: Router) {

		this.moduleManager.getAllPreloadRoutes$().subscribe(moduleRoutes => {
			const routerConfig = [];
			routerConfig.push(...routes);
			routerConfig.push(...this.generateRouterConfig(moduleRoutes));
			this.router.resetConfig(routerConfig);
		});

	}

	private generateRouterConfig(preloadRoutes: Routes) {
		const moduleRoutes: Route[] = [
			{
				// TODO: declare route to desktop in suitable preload module instead of having it hard-coded in here
				path: 'app/:type',
				canActivate: [AutoLoginPartialRoutesGuard],
				canLoad: [AutoLoginPartialRoutesGuard],
				children: [
					{
						path: '',
						outlet: 'clientArea',
						loadChildren: () => import('@libs/ui/desktop').then((module) => module.UiDesktopModule)
					}
				]
			}
		];

		moduleRoutes.push(...preloadRoutes);

		moduleRoutes.push({ path: '**', redirectTo: 'app/main' });

		return [
			{
				path: '',
				component: MainFrameComponent,
				children: moduleRoutes
			}
		];
	}
}
