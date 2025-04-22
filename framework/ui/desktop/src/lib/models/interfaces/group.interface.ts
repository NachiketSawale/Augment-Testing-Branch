/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ITilesData } from './tile.interface';

/**
 * An interface for tiles group data in Desktop Module.
 */
export interface IGroup {
	/**
	 * The default ID.
	 */
	id?: string;

	/**
	 * The human-readable title of the Group
	 */
	groupName: string;

	/**
	 * The human-readable title of the Group
	 */
	groupNameKey?: string;

	/**
	 * The default tiles.
	 */
	tiles: ITilesData[];
}
