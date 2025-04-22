/*
 * Copyright(c) RIB Software GmbH
 */

import { ITile } from '../../model/ui-defs/tile.interface';
import { ActivatedRouteSnapshot, Route, Routes } from '@angular/router';
import { ISubModuleRouteInfo } from './sub-module-route-info.interface';
import { IWizard } from '../../model/wizards/wizard.interface';
import { AuthGuard } from '@libs/platform/authentication';
import { LazyInjectableInfo } from '../../lazy-injection/index';
import { IApplicationModuleInfo } from './application-module-info.interface';

/**
 * The base class for objects that provide information about the preload-part of a module.
 *
 * Each main module in the application comes with a preload module.
 * As implied by the name, this module is loaded upon application start-up, before anything else is loaded.
 *
 * As preload modules are invariably loaded along with the application, they should be kept as small as possible.
 * The preload module info object provides much of the information a preload module comprises.
 *
 * The module info class must be derived from `ModulePreloadInfoBase`.
 * Methods and properties of the base class can be overridden to provide module-specific information.
 *
 * ## Sub-Modules
 *
 * In contrast to the preload module, the other sub-modules in a main module are loaded lazily.
 * The preload module provides information about how to address these sub-modules.
 *
 * Concretely, this requires overriding the `getRouteInfos()` method.
 * Use it to return an array of small objects that specify the name of a sub-module and information on how to lazily load it.
 *
 * ## Desktop Tiles
 *
 * Override the `desktopTiles` getter to return desktop tile definitions.
 * These desktop tiles will appear on one of the standard desktops and are eligible for inclusion on user-defined desktops.
 *
 * ## Wizards
 *
 * If any of the sub-modules in the module provides a wizward, override `wizards` in the preload module info to return a declaration of that wizard.
 *
 * @group Module Management
 */
export abstract class ModulePreloadInfoBase implements IApplicationModuleInfo {

	/**
	 * Returns the internal name of the module.
	 */
	public abstract get internalModuleName(): string;

	/**
	 * Returns the desktop tiles supplied by the module.
	 */
	public get desktopTiles(): ITile[] | null {
		return null;
	}

	/**
	 * Returns all routes to sub-modules in the module.
	 *
	 * @return {Routes} The sub-module routes.
	 */
	public getRoutes(): Routes {
		const result: Route[] = [];

		const modulePrefix = this.internalModuleName ?? '';

		for (const routeInfo of this.getRouteInfos()) {
			const path = routeInfo.fullPath ?? `${modulePrefix}/${routeInfo.subModuleName}`;
			result.push({
				path,
				canActivate: [AuthGuard, ...(routeInfo.canActivate ?? [])],
				canLoad: [AuthGuard],
				children: [{
					path: '',
					outlet: 'clientArea',
					loadChildren: routeInfo.loadChildren
				}]
			});

			if (!routeInfo.withoutTabs) {
				result.push({
					path: `${path}/:tabId`,
					canActivate: [AuthGuard, ...(routeInfo.canActivate ?? [])],
					canLoad: [AuthGuard],
					children: [{
						path: '',
						outlet: 'clientArea',
						loadChildren: routeInfo.loadChildren,
						resolve: {
							'activeTabId': function (activatedRouteSnapshot: ActivatedRouteSnapshot) {
								return activatedRouteSnapshot.params['tabId'];
							}
						}
					}]
				});
			}
		}

		return result;
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 * Override this function to return information about the sub-modules.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the sub-module routes.
	 */
	protected getRouteInfos(): ISubModuleRouteInfo[] {
		return [];
	}

	/**
	 * Returns all wizards provided by the module.
	 *
	 * @returns The array of wizard declarations, or `null` if no wizards are provided by the module.
	 */
	public get wizards(): IWizard[] | null {
		return null;
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public get lazyInjectables(): LazyInjectableInfo[] {
		return [];
	}
}