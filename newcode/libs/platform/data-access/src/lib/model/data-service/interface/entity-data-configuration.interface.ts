/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityDynamicCreateDialogService } from './entity-dynamic-create-dialog-service.interface';
import { IEntityDataCreationContext } from './entity-data-creation-context.interface';

/**
 * Interface for entity creation configuration, defining methods to check for dynamic creation support
 * and to initiate the entity creation process using a specific configuration.
 * @typeParam T The type of the entity being created.
 */
export interface IEntityDataCreateConfiguration<T extends object> {
	/**
	 * Checks if dynamic entity creation with configuration is supported.
	 * @returns A boolean indicating whether configured creation is supported.
	 */
	supportsConfiguredCreate(): boolean;

	/**
	 * Creates a new entity using the provided context and creation dialog service.
	 * @param context Information required for configuring the dynamic create dialog, such as schema, validation, and layout.
	 * @param dialogService The service responsible for handling the dynamic create dialog.
	 * @returns A promise that resolves to the created entity, or undefined if no entity was created.
	 */
	createByConfiguration(context: IEntityDataCreationContext<T>, dialogService: IEntityDynamicCreateDialogService<T>): Promise<T | undefined>;
}