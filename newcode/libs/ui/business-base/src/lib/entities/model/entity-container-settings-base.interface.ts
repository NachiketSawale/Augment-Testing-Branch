/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider } from '@angular/core';
import {
	AsyncCtxFactoryEnabled,
	Translatable
} from '@libs/platform/common';
import {
	ContainerTypeRef,
	ContainerLoadPermissions
} from '@libs/ui/container-system';

/**
 * The base interface for settings that can be applied to entity containers.
 */
export interface IEntityContainerSettingsBase {

	/**
	 * Optionally, the legacy ID of the container.
	 * Required to load the container based on view layout definitions saved in the legacy
	 * format.
	 */
	readonly legacyId?: string;

	/**
	 * Returns a reference to a custom container type, in case the standard entity container should not be used.
	 */
	readonly containerType?: ContainerTypeRef;

	/**
	 * Defines injection providers supplied when instantiating {@link containerType}.
	 */
	readonly providers?: AsyncCtxFactoryEnabled<StaticProvider[]>;

	/**
	 * The human-readable title of the container.
	 */
	readonly title?: Translatable;

	/**
	 * The permission UUID of the container.
	 * If none is specified, the entity permission UUID will be used.
	 */
	readonly permission?: string;

	/**
	 * Access right descriptor GUIDs to load before the container is displayed.
	 */
	readonly loadPermissions?: ContainerLoadPermissions;
}
