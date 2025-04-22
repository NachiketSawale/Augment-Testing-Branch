/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Project leave item information.
 */
export interface ISidebarFavoritesFavType {
	/**
	 * Common fav type number for each project leave items.
	 */
	favType: number;

	/**
	 * Unique id of leave node item.
	 */
	id: number;

	/**
	 * Description of leave node item.
	 */
	description: string;
}
