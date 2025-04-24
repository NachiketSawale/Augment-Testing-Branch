/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridContainerSettings } from './grid-container-settings.interface';
import { IFormContainerSettings } from './form-container-settings.interface';
import { ITreeContainerSettings } from './tree-container-settings.interface';
import {
	BaseValidationService,
	IEntitySchema,
	IEntitySchemaId,
	IEntitySelection
} from '@libs/platform/data-access';
import {
	DragDropBase,
	IInitializationContext,
	OptionallyAsyncResource,
	SimpleIdProperty,
	Translatable,
	ValueOrType
} from '@libs/platform/common';
import { ContainerLayoutConfiguration } from './container-layout-configuration.type';
import {
	ContainerDefinition,
	IContainerDefinition
} from '@libs/ui/container-system';
import {
	IEntityContainerBehavior,
	IEntityContainerLink
} from './entity-container-link.model';
import { IEntityLookupSettings } from './entity-lookup-settings.interface';

/**
 * Provides information about an entity handled by the application.
 *
 * @typeParam T The entity type.
 */
export interface IEntityInfo<T extends object> {

	/**
	 * Specifies the ID of the server-side DTO class for the entity.
	 */
	readonly dtoSchemeId?: IEntitySchemaId;

	/**
	 * Gets or sets a human-readable name for the entity.
	 */
	readonly description?: Translatable;

	/**
	 * The permission UUID for the entity.
	 */
	readonly permissionUuid: string;

	/**
	 * Specifies whether the entity has a grid container.
	 * Use this for a flat list, or for a tree of items if your hierarchical entity is
	 * not supposed to have a flat list of items.
	 * Defaults to `true`.
	 * If supplied as a 1-tuple, use the legacy ID of the container for the tuple's
	 * only element.
	 */
	readonly grid?: boolean | [string] | IGridContainerSettings<T>;

	/**
	 * Specifies whether the entity has a tree container beside the grid container.
	 * Defaults to `false`.
	 * Use this field if your entity has a dedicated tree container beside the (flat)
	 * grid container.
	 * If your entity *only* has a tree container and no corresponding flat list, you
	 * can configure the grid container to show a tree of items.
	 */
	readonly tree?: false | ITreeContainerSettings<T>;

	/**
	 * Specifies whether the entity has a form container.
	 * Defaults to `false`.
	 * If supplied as a string, use the UUID for the container.
	 * If supplied as a 2-tuple, use the container's UUID for the first element and
	 * the legacy ID for the second element.
	 */
	readonly form?: false | string | [string, string] | IFormContainerSettings<T>;

	/**
	 * A property name on type `T` that serves as a unique identifier when items are
	 * displayed in a grid or similar.
	 *
	 * Setting this property is commonly required if the entity type uses a composite
	 * key that includes multiple fields. Use a single field (whose value can be
	 * computed transiently) to store a scalar unique ID.
	 */
	readonly idProperty?: SimpleIdProperty<T>;

	/**
	 * The injection token to use for the entity selection source.
	 */
	readonly dataService: OptionallyAsyncResource<IEntitySelection<T>>;

	/**
	 * The injection token to use for the entity selection source.
	 */
	readonly dragDropService?: OptionallyAsyncResource<DragDropBase<T>>;

	/**
	 * The validation service to use, if any.
	 */
	readonly validationService?: OptionallyAsyncResource<BaseValidationService<T>>;

	/**
	 * Returns the custom layout configuration for the entity.
	 */
	readonly layoutConfiguration?: ContainerLayoutConfiguration<T>;

	/**
	 * Returns locally defined entity schema.
	 */
	readonly entitySchema?: ValueOrType<IEntitySchema<T>>;

	/**
	 * An optional function that is run whenever a container for the entity gets initialized.
	 * This function will run before any other initialization takes place.
	 */
	readonly prepareEntityContainer?: (context: IInitializationContext) => Promise<void> | void;

	/**
	 * Supplies custom behavior to all standard containers for the entity that do not define their
	 * own behavior.
	 * Use this to modify the behavior of the standard container without creating a new component.
	 */
	readonly containerBehavior?: OptionallyAsyncResource<IEntityContainerBehavior<IEntityContainerLink<T>, T>>;

	/**
	 * Lists definitions for additional containers that are related to the entity.
	 * These containers will be instantiated using the same injections as the standard entity
	 *   containers.
	 */
	readonly additionalEntityContainers?: (ContainerDefinition | IContainerDefinition)[];

	/**
	 * Optionally provides settings for lookups pointing to the entity.
	 *
	 * This settings object is not required to use lookups with the entity.
	 * It does, however, help to generate uniform lookups for the entity if it is referenced
	 * from multiple places in the application.
	 */
	readonly lookup?: IEntityLookupSettings<T>;

	/**
	 * Id of the Corresponding entity facade.
	 */
	readonly entityFacadeId?: string;
}

export function isGridSettingsObject<T extends object>(grid?: boolean | [string] | IGridContainerSettings<T>): grid is IGridContainerSettings<T> {
	return typeof grid === 'object' && !Object.prototype.hasOwnProperty.call(grid, 0);
}

export function isTreeSettingsObject<T extends object>(tree?: boolean | ITreeContainerSettings<T>): tree is ITreeContainerSettings<T> {
	return typeof tree === 'object' && !Object.prototype.hasOwnProperty.call(tree, 0);
}

export function isFormSettingsObject<T extends object>(form?: false | string | [string, string] | IFormContainerSettings<T>): form is IFormContainerSettings<T> {
	return typeof form === 'object' && !(Object.prototype.hasOwnProperty.call(form, 0) && Object.prototype.hasOwnProperty.call(form, 1));
}
