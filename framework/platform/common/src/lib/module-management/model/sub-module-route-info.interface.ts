/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CanActivateFn, LoadChildren } from '@angular/router';

/**
 * Stores information about the route to a lazily loaded submodule.
 *
 * The purpose of the `ISubModuleRouteInfo` interface is to define the route to a sub-module.
 * It is used by a preload module to indicate the existence of the sub-module.
 *
 * ## Destination Module
 *
 * Loading of the sub-module is assumed to take place lazily.
 * Therefore, the route info contains a `loadChildren` function that will be passed on to the router.
 *
 * ## Route Definition
 *
 * The route can be defined in either of two ways:
 *
 * - The `subModuleName` is specified.
 *   In this case, the route will be assembled from the module name, as specified by the preload module, and the sub-module name.
 *   This case should be applicable to most sub-modules.
 * - The `fullPath` is specified.
 *   In this case, the route is fully specified by the `fullPath` property and will not be combined with any other route parts.
 *   This technique may be used in exceptional cases where the module name is not supposed to be a prefix of the route.
 *
 * ## Tabbed Modules
 *
 * Most sub-modules open with a tabbed interface.
 * For such modules, the ID of the active tab is reflected in the route.
 * Accordingly, the route can be used to specify the ID of the active tab.
 * For modules where this is not desired, the `withoutTabs` field must be set to `true`.
 *
 * @group Module Management
 */
export interface ISubModuleRouteInfo {

	/**
	 * The submodule name, as it should appear in the route.
	 * This text will be appended to the main module name provided by the preload module.
	 * The value of this field will be ignored if {@link fullPath} is set.
	 */
	subModuleName?: string;

	/**
	 * The full path to the submodule.
	 * This is only required if the submodule is not identified by its {@link subModuleName}.
	 */
	fullPath?: string;

	/**
	 * Specifies a function that loads child routes for the submodule.
	 */
	loadChildren: LoadChildren;

	/**
	 * Indicates that the submodule does not offer switching between tabs.
	 */
	withoutTabs?: boolean;

	/**
	 * An array of CanActivateFn used to look up CanActivate() handlers, in order to determine if the current user is allowed to activate the component. By default, any user can activate.
	 */
	canActivate?: Array<CanActivateFn>;
}