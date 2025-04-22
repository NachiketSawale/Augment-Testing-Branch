/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * A group definition in a [form configuration]{@link IFormConfig}.
 *
 * @group Form Generator
 */
export interface IFormGroup {

	/**
	 * The unique ID of the group.
	 * This is used to reference the group from the row.
	 */
	groupId: string | number;

	/**
	 * The human-readable caption of the form group.
	 */
	header?: Translatable;

	/**
	 * Indicates whether the collapsible group is expanded.
	 * If this is not set, a value of `true` will be assumed.
	 */
	open?: boolean;

	/**
	 * Indicates whether the group and its rows are visible.
	 * If this is not set, a value of `true` will be assumed.
	 */
	visible?: boolean;

	/**
	 * Groups are sorted based on this value, then by their order of declaration.
	 */
	sortOrder?: number;
}