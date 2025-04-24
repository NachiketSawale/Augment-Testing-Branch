/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISidebarFavorites } from './sidebar-favorites.interface';
import { ISidebarFavoritesProject } from './sidebar-favorites-project.interface';

/**
 * Favorites sidebar data fetched from database.
 */
export interface ISidebarFavoritesData {
	/**
	 * Information of projects.
	 */
	projectInfo: Record<string | number, ISidebarFavoritesProject>;

	/**
	 * Projects settings information.
	 */
	favoritesSetting: Record<string | number, ISidebarFavorites>;
}
