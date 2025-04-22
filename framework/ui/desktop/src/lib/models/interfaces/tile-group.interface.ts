/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITileArray } from './tile-data.interface';

/**
 * An interface for tiles data in Desktop Module.
 */
export interface ITileGroup {
	/**
	 *	The default group ID of the Tile.
	 */
	id: string | number | undefined;

	/**
	 *	The default mainPage ID of the Tile.
	 */
	mainPageId: string;

	/**
	 *	The default tiles.
	 */
	tiles: ITileArray[];

	/**
	 * The human readable group name key for translation
	 */
	groupNameKey: string;
}
