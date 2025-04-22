/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IGroup } from './group.interface';

/**
 * An interface for default tile data for desktop module .
 */
export interface IDefaultPage {
	/**
	 * The unique ID of the tile.
	 */
	id?: string;

	/**
	 * The default page routing for tile
	 */
	targetRoute?: string | undefined;

	/**
	 * The visibility for tile.
	 */
	visibility?: boolean;

	/**
	 *	The default group name of the Tile.
	 */
	groups: IGroup[];

	/**
	 * The default ID.
	 */
	rib?: boolean;
}
