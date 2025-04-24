/**
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface that stores bing event route object.
 */
export interface IEventRoute {
	/**
	 * RouteLegs.
	 */
	//TODO any, will be removed in future.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	routeLegs: any[];
}