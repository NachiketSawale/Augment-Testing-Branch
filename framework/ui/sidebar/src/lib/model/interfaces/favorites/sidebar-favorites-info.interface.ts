/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ISidebarFavoritesFurtherFilters } from './sidebar-favorites-further-filters.interface';

/**
 * Module Favorites Information
 */
export interface ISidebarFavoritesFavInfo {
	/**
	 * Name of the module.
	 */
	moduleName: string;

	/**
	 * Sorting index for the module data.
	 */
	sort: number;

	/**
	 * Module name.
	 */
	name: string;

	/**
	 * Icon for the module.
	 */
	ico: string;

	/**
	 * Context present.
	 */
	projectContext?: boolean;

	/**
	 * Favorites type information further filters.
	 */
	furtherFilters?: ISidebarFavoritesFurtherFilters;

	//TODO:Kept any due to lack of object details.
	naviServiceConnector?: object;
}
