/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * An interface for Tile data related to groups of Desktop tile module.
 */
export interface ITileArray {
	/**
	 * The default sorting within the group.
	 */
	defaultSorting: number;

	/**
	 * The human-readable description that will be displayed along with the title if the tile is large enough.
	 */
	description: Translatable;

	/**
	 * The default disabled tile.
	 */
	disabled?: boolean;

	/**
	 * The human-readable title of the tile.
	 */
	displayName: Translatable;

	/**
	 *	The default group name of the Tile.
	 */
	group?: string;

	/**
	 * The default group in row.
	 */
	groupInRow?: boolean;

	/**
	 * The default iconClass of the tile.
	 */
	iconClass: string;

	/**
	 * The default iconColor of the tile
	 */
	iconColor: number;

	/**
	 * The default ID.
	 */
	id: string;

	/**
	 * The access right descriptor GUID required for opening the tile.
	 */
	permission: string;

	/**
	 * The default page routing for tile when click
	 */
	targetRoute: string;
	/**
	 * The default foreground color of the tile.
	 */
	textColor: number;

	/**
	 * The default fill color of the tile.
	 */
	tileColor: number;

	/**
	 * The default tile group ID.
	 */
	tileGroupId: string | number | undefined;

	/**
	 * The default tile Opacity.
	 */
	tileOpacity: number;

	/**
	 * The default tile Size.
	 */
	tileSize: number;

	/**
	 * The default type of tile.
	 */
	type?: number;
}
