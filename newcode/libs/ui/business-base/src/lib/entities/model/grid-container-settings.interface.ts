/*
 * Copyright(c) RIB Software GmbH
 */

import { OptionallyAsyncResource } from '@libs/platform/common';
import { IEntityContainerBehavior } from './entity-container-link.model';
import { IGridContainerLink } from './grid-container-link.interface';
import { IEntityContainerSettingsBase } from './entity-container-settings-base.interface';
import { IEntityTreeConfiguration } from './entity-tree-configuration.interface';

/**
 * Stores special settings for the grid container.
 */
export interface IGridContainerSettings<T extends object> extends IEntityContainerSettingsBase {

	/**
	 * Returns an optional UUID to use for the container.
	 * By default, the grid container will use the permission ID of its entity info for the container UUID.
	 * Specify this value only if your grid container UUID must deviate from the entity's permission ID.
	 */
	readonly containerUuid?: string;

	/**
	 * Supplies custom behavior to the container.
	 * Use this to modify the behavior of the standard container without creating a new component.
	 * If this is not set, the {@link IEntityInfo.containerBehavior} from the enclosing entity info
	 *   will be used.	 */
	readonly behavior?: OptionallyAsyncResource<IEntityContainerBehavior<IGridContainerLink<T>, T>>;

	/**
	 * If the grid should be displayed as a hierarchical list, set this object to specify tree properties.
	 * Note that if your entity is supposed to have a flat list *and* a tree container, set this field to
	 * `undefined` and use the {@link IEntityInfo.tree} field.
	 *
	 * If specified as a boolean value, `false` indicates that the grid should not be displayed as
	 * a tree, while `true` indicates it should be displayed as a tree. In the latter case, the
	 * data service must represent a hierarchical entity.
	 */
	readonly treeConfiguration?: OptionallyAsyncResource<IEntityTreeConfiguration<T>> | boolean;
}