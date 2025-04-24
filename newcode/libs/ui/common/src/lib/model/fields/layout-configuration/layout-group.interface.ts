/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable, TypedPropertyPath } from '@libs/platform/common';

/**
 * Settings for a group in an {@link ILayoutConfiguration|entity layout configuration}.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export interface ILayoutGroup<T extends object> {

	/**
	 * The group ID.
	 */
	gid: string;

	/**
	 * Optionally, a human-readable title for the group.
	 */
	title?: Translatable;

	/**
	 * The names of all attributes of the underlying entity type that are to appear in the group.
	 */
	attributes:	(keyof T | string)[];

	/**
	 * The list of nested attributes from the entity that are to appear in this group.
	 */
	additionalAttributes?: TypedPropertyPath<T>[];
}
