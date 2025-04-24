/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * Modified Quickstart settings.
 */
export interface IQuickstartSettings {
	/**
	 * The unique ID of the tile.
	 */
	id: string;

	/**
	 * The default iconClass of the tile.
	 */
	iconClass: string;

	/**
	 * The human-readable title of the tile.
	 */
	displayName: Translatable;

	/**
	 * The human-readable description that will be displayed along with the title if the tile is large enough.
	 */
	description: Translatable;

	/**
	 * The default group ID.
	 */
	defaultGroupId?: string;

	/**
	 * The default sorting within the group.
	 */
	defaultSorting?: number;

	/**
	 * Indicates the target route that the application navigates to when the tile is clicked.
	 */
	targetRoute: string;
}
