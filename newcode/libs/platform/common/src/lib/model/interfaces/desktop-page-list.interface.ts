/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * An interface for Default Group properties.
 */
export interface IDesktopGroup {
	/**
	 * The default group Name of the tiles .
	 */
	get groupName(): string;

	/**
	 * The default page ID of the tile.
	 */
	get pageId(): string;

	/**
	 * Group name title for translation .
	 */
	get key(): string;
}
