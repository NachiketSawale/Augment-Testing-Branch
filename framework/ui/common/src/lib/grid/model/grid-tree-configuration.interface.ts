/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { PropertyPath } from '@libs/platform/common';

/**
 * Configuration of tree structure column
 */
export interface IGridTreeConfiguration<T extends object> {
	/**
	 * Queries parent entity of given entity
	 */
	parent: (entity: T) => T | null;

	/**
	 * Queries children of given entity
	 */
	children: (entity: T) => T[];

	/**
	 * Root entities of the tree
	 */
	rootEntities?: () => T[];

	/**
	 * Width of tree column.
	 * Will be overwritten by saved configurations
	 * Default: 150
	 */
	width?: number;

	/**
	 * Displays tree node collapse or expanded
	 */
	collapsed?: boolean;

	/**
	 * Properties to be used as text in tree row
	 * Can be
	 */
	description?: PropertyPath<T>[];

	/**
	 * Header caption of tree column
	 */
	header?: Translatable;

	/**
	 * Is tree column printable
	 */
	printable?: boolean;
}
