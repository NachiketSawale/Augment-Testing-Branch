/*
 * Copyright(c) RIB Software GmbH
 */


import { OptionallyAsyncResource } from '@libs/platform/common';
import {
	IEntityContainerBehavior,
	IEntityContainerSettingsBase,
	IEntityTreeConfiguration,
	ITreeContainerLink
} from '../index';

/**
 * Stores special settings for the grid container.
 */
export interface ITreeContainerSettings<T extends object> extends IEntityContainerSettingsBase {

	/**
	 * Returns an optional UUID to use for the container.
	 */
	readonly containerUuid: string;

	/**
	 * Supplies custom behavior to the container.
	 * Use this to modify the behavior of the standard container without creating a new component.
	 * If this is not set, the {@link IEntityInfo.containerBehavior} from the enclosing entity info
	 *   will be used.	 */
	readonly behavior?: OptionallyAsyncResource<IEntityContainerBehavior<ITreeContainerLink<T>, T>>;

	/**
	 * Stores configuration options for the tree display.
	 *
	 * If this is not specified, the underlying data service must represent a hierarchical entity.
	 */
	readonly treeConfiguration?: OptionallyAsyncResource<IEntityTreeConfiguration<T>>;
}
