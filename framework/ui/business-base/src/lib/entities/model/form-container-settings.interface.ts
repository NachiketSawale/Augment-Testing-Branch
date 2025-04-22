/*
 * Copyright(c) RIB Software GmbH
 */

import { OptionallyAsyncResource } from '@libs/platform/common';
import { IEntityContainerBehavior } from './entity-container-link.model';
import { IFormContainerLink } from './form-container-link.interface';
import { IEntityContainerSettingsBase } from './entity-container-settings-base.interface';

/**
 * Stores special settings for the form container.
 */
export interface IFormContainerSettings<T extends object> extends IEntityContainerSettingsBase {

	/**
	 * Returns the UUID to use for the container.
	 */
	readonly containerUuid: string;

	/**
	 * Supplies custom behavior to the container.
	 * Use this to modify the behavior of the standard container without creating a new component.
	 * If this is not set, the {@link IEntityInfo.containerBehavior} from the enclosing entity info
	 *   will be used.
	 */
	readonly behavior?: OptionallyAsyncResource<IEntityContainerBehavior<IFormContainerLink<T>, T>>;
}