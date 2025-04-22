/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITileGroup } from './tile-group.interface';

/**
 * An interface for tiles data in Desktop Module.
 */
export interface IDefaultTiles {
	/**
	 *	The default group name of the Tile.
	 */
	groups: ITileGroup[];

	/**
	 * The default ID of tile.
	 */
	id: string;
}
