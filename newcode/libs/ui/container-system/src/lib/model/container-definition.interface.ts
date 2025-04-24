/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { ContainerTypeRef } from './container-type-ref.type';
import { ContainerInjectionProviders } from './container-injection-providers.type';
import { ContainerLoadPermissions } from './container-load-permissions.type';

/**
 * Provides settings for a container definition.
 */
export interface IContainerDefinition {

	/**
	 * The unique ID of the container.
	 */
	readonly uuid: string;

	/**
	 * The human-readable title of the container.
	 */
	readonly title: Translatable;

	/**
	 * The component type that represents the client area of the container, or a function that returns a promise that gets resolved to such a component type.
	 */
	readonly containerType: ContainerTypeRef;

	/**
	 * The permission UUID of the container. If none is specified, the UUID will be used.
	 */
	readonly permission?: string;

	/**
	 * Optionally, the legacy container ID.
	 */
	readonly id?: string;

	/**
	 * An optional array of injection providers to supply to the container, or a function hat returns such an array either synchronously or asynchronously.
	 */
	readonly providers?: ContainerInjectionProviders;

	/**
	 * Access right descriptor GUIDs to load before the container is displayed.
	 */
	readonly loadPermissions?: ContainerLoadPermissions;
}