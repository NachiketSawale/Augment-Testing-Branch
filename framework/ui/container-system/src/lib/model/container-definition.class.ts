/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { IContainerDefinition } from './container-definition.interface';
import { ContainerTypeRef } from './container-type-ref.type';
import { ContainerInjectionProviders } from './container-injection-providers.type';
import { ContainerLoadPermissions } from './container-load-permissions.type';
import { PlaceholderContainerComponent } from '../components/placeholder-container/placeholder-container.component';

/**
 * Defines a container that can be displayed.
 *
 * Use the `ContainerDefinition` class to define a container that users can insert into their view layout.
 *
 * ## Unique ID
 *
 * Each container has a UUID.
 * This UUID is used to identify the container in saved view layouts.
 * At the same time, it means that no container can be added more than once to a view layout.
 *
 * The unique ID is in GUID format without spaces, hyphens, or any other separators.
 * The unique ID should be written in lower-case, although some legacy containers may use the upper-case notation.
 *
 * Legacy IDs semi-readable for humans are no longer used.
 * While they may still appear on the database in saved view layouts, they are mapped to the corresponding GUIDs by mapping code on the server.
 *
 * ## Permission
 *
 * Each container is governed by an access right descriptor.
 * The current user needs to have at least read permissions for that access right descriptor in order to see the container.
 *
 * By default, the container UUID doubles as the UUID for the required access right descriptor.
 * A different access right descriptor UUID can be specified in the constructor.
 *
 * This is typically used in grid/form container pairs:
 * There, by convention, the entity access right descriptor UUID is also used as the container UUID for the grid container.
 * The form container, on the other hand, uses the same access right descriptor UUID, but has a different container UUID.
 *
 * ## Content
 *
 * The graphical content of the container is supplied as a component.
 * The container definition just contains a reference to the component type, which gets instantiated when the container becomes visible (and destroyed when it becomes invisible again).
 *
 * ### Injections Available for Container Components
 *
 * Beside the global injections, container components may inject a couple of special injectables.
 * Check out the {@link ContainerInjectionInfo} object for more information.
 *
 * The {@link ContainerBaseComponent} class already injects these and publishes them as protected fields.
 *
 * ### Lazily-Loaded Content
 *
 * Containers provided by other modules should be lazily loaded.
 * For this purpose, the `containerType` proprety can be set to a function that returns a promise.
 * Use the `import()` expression to lazily load the source module of the container and return the container component from there.
 * This will ensure the source module is only loaded once needed.
 *
 * Do not attempt to use this function for any other purpose than for lazy loading.
 * Caching will be applied, meaning that the function may be called only once.
 *
 * ## Custom Options
 *
 * The members of the `ContainerDefinition` class are supposed to cover all aspects of functionality common to all containers.
 *
 * There are, however, some individual containers that require information to be provided on the container definition that is specific to the particular container type.
 * In these cases (and *only* then), use the `customOptions` object to store this additional data.
 */
export class ContainerDefinition {

	/**
	 * Initializes an instance based on a configuration object.
	 *
	 * @param configuration The configuration object.
	 */
	public constructor(configuration: IContainerDefinition);

	/**
	 * Initializes an instance based on the most common settings.
	 *
	 * @param uuid The unique ID of the container.
	 * @param title The human-readable title of the container.
	 * @param containerType The component type that represents the client area of the container, or a function that returns a promise that gets resolved to such a component type.
	 * @param permission The permission UUID of the container. If none is specified, the UUID will be used.
	 * @param id Optionally, the legacy container ID.
	 */
	public constructor(
		uuid: string,
		title: Translatable,
		containerType: ContainerTypeRef,
		permission?: string,
		id?: string
	);

	public constructor(
		uuidOrConfig: string | IContainerDefinition,
		title?: Translatable,
		containerType?: ContainerTypeRef,
		permission?: string,
		id?: string
	) {
		if (typeof uuidOrConfig === 'string') {
			if (!containerType) {
				throw new Error('No container type specified.');
			}

			this.uuid = uuidOrConfig;
			this.title = title ?? {};
			this.containerType = containerType;
			this.permission = permission ?? uuidOrConfig;
			this.id = id;
		} else {
			this.uuid = uuidOrConfig.uuid;
			this.title = uuidOrConfig.title;
			this.containerType = uuidOrConfig.containerType;
			this.permission = uuidOrConfig.permission ?? uuidOrConfig.uuid;
			this.id = uuidOrConfig.id;
			this.providers = uuidOrConfig.providers;
			this.loadPermissions = uuidOrConfig.loadPermissions;
		}
	}

	/**
	 * The unique ID of the container.
	 */
	public readonly uuid: string;

	/**
	 * The human-readable title of the container.
	 */
	public readonly title: Translatable;

	/**
	 * The component type that represents the client area of the container, or
	 * a function that returns a promise that gets resolved to such a component type.
	 */
	public readonly containerType: ContainerTypeRef;

	/**
	 * Indicates whether the container is a placeholder for a missing or unknown container.
	 */
	public get isUnknownContainerPlaceholder(): boolean {
		return this.containerType === PlaceholderContainerComponent;
	}

	/**
	 * Optionally, the legacy container ID.
	 */
	public readonly id?: string;

	/**
	 * An optional array of injection providers to supply to the container, or
	 * a function hat returns such an array either synchronously or asynchronously.
	 */
	public readonly providers?: ContainerInjectionProviders;

	/**
	 * The permission UUID of the container.
	 */
	public readonly permission: string;

	/**
	 * Access right descriptor GUIDs to load before the container is displayed.
	 */
	public readonly loadPermissions?: ContainerLoadPermissions;
}