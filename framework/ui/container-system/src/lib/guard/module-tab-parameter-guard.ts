/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ModuleLayoutService } from '../services/module-layout.service';

/**
 * A route guard to make sure the active module route has tab parameter.
 * @param route
 * @param state
 */
export const moduleTabParameterGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
	const router = inject(Router);
	const layoutService = inject(ModuleLayoutService);

	const modulePaths = state.url.split('/').splice(1, 2);
	const moduleName = modulePaths.join('.');
	const tabId = route.params['tabId'];

	return tabId ? of(true) : new Observable<UrlTree>(subscriber => {
		layoutService.getTabs(moduleName).subscribe(tabs => {
			const activeTab = tabs.find(tab => {
				return tab.Views.some(view => view.Isactivetab);
			}) ?? tabs[0];

			subscriber.next(router.createUrlTree([...modulePaths, activeTab.Id]));
			subscriber.complete();
		});
	});
};