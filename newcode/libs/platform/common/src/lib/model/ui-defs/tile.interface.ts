/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TileSize } from './tile-size.enum';
import { Translatable } from '../translation/translatable.interface';
import { TileGroup } from './tile-group.enum';

/**
 * An interface for desktop tile definitions.
 */
export interface ITile {
	/**
	 * The unique ID of the tile.
	 */
	get id(): string;

	/**
	 * The default tile size.
	 */
	get tileSize(): TileSize;

	/**
	 * The default fill color of the tile.
	 */
	get color(): number;

	/**
	 * The default opacity of the tile.
	 */
	get opacity(): number;

	/**
	 * The default iconClass of the tile.
	 */
	get iconClass(): string;

	/**
	 * The default iconColor of the tile
	 */
	get iconColor(): number;

	/**
	 * The default foreground color of the tile.
	 */
	get textColor(): number;

	/**
	 * The human-readable title of the tile.
	 */
	get displayName(): Translatable;

	/**
	 * The human-readable description that will be displayed along with the title if the tile is large enough.
	 */
	get description(): Translatable;

	/**
	 * The default group ID.
	 */
	get defaultGroupId(): TileGroup;

	/**
	 * The default sorting within the group.
	 */
	get defaultSorting(): number;

	/**
	 * The access right descriptor GUID required for opening the tile.
	 */
	get permissionGuid(): string;

	/**
	 * Indicates the target route that the application navigates to when the tile is clicked.
	 */
	get targetRoute(): string;
}
