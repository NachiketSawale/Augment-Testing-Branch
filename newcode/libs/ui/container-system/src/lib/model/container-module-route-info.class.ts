/*
 * Copyright(c) RIB Software GmbH
 */

import { CanActivateFn, LoadChildren } from '@angular/router';
import { ISubModuleRouteInfo } from '@libs/platform/common';
import { moduleTabParameterGuard } from '../guard/module-tab-parameter-guard';

/**
 * Represents a route to a container-based submodule that can be registered by a preload module.
 */
export class ContainerModuleRouteInfo implements ISubModuleRouteInfo {

	private constructor(
		public readonly subModuleName: string | undefined,
		public readonly fullPath: string | undefined,
		public readonly loadChildren: LoadChildren) {
	}

	/**
	 * Creates a new instance whose route is defined relative to the main module route.
	 *
	 * @param subModuleName The submodule name, as it should appear in the route. This text will be appended to the main module name provided by the preload module.
	 * @param loadChildren Specifies a function that loads child routes for the submodule.
	 */
	public static create(subModuleName: string, loadChildren: LoadChildren): ContainerModuleRouteInfo {
		return new ContainerModuleRouteInfo(subModuleName, undefined, loadChildren);
	}

	/**
	 * Creates a new instance with a custom full path.
	 *
	 * @param fullPath The full path to the submodule.
	 * @param loadChildren Specifies a function that loads child routes for the submodule.
	 */
	public static createWithFullPath(fullPath: string, loadChildren: LoadChildren): ContainerModuleRouteInfo {
		return new ContainerModuleRouteInfo(undefined, fullPath, loadChildren);
	}

	/**
	 * Indicates that the submodule does not offer switching between tabs.
	 */
	public readonly withoutTabs = false;

	/**
	 * An array of CanActivateFn used to look up CanActivate() handlers, in order to determine if the current user is allowed to activate the component. By default, any user can activate.
	 */
	public readonly canActivate: CanActivateFn[] = [moduleTabParameterGuard];
}
