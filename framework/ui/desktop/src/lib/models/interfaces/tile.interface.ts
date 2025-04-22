/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface for each tile in Desktop module.
 */
export interface ITilesData {

	/**
	 * The unique ID of the tile.
	 */	

	id?: string;

	/**
	 * The human-readable title of the tile.
	 */
	displayName?: string;

	/**
	 * The human-readable title of the tile.
	 */
	displayName$tr$?: string;

	/**
	 * The human-readable description that will be displayed along with the title if the tile is large enough.
	 */
	description?: string;

	/**
	 * The human-readable description that will be displayed along with the title if the tile is large enough.
	 */
	description$tr$?: string;

	/**
	 * The default iconClass of the tile.
	 */
	iconClass: string;

	/**
	 * The default tile size.
	 */
	tileSize?: number;

	/**
	 * The default fill color of the tile.
	 */
	tileColor: number;

	/**
	 * The default opacity of the tile.
	 */
	tileOpacity: number;

	/**
	 * The default foreground color of the tile.
	 */
	textColor: number;

	/**
	 * The default iconColor of the tile
	 */
	iconColor: number;

	/**
	 *	The default group name of the Tile.
	 */
	group?: string;

	/**
	 * The default image of the tile.
	 */
	image?: string;

	/**
	 * The default icon of the tile.
	 */
	icon?: string;

	/**
	 * The default permission of the tile.
	 */
	permission?: string;

	/**
	 * The disabled property of the tile.
	 */
	disabled?: number;

	/**
	 * The default type of tile.
	 */
	type?: number;

	/**
	 * The default button group of the tile.
	 */
	btngrp?: string;

	/**
	 * The default groups.
	 */
	groupInRow?: string | boolean;

	/**
	 * The default url of the tile.
	 */
	url?: string;

	/**
	 * The default routing of the tile
	 */
	targetRoute: string;


	
}
