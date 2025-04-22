/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityDataCreationContext } from './entity-data-creation-context.interface';

/**
 * Interface for a service that handles the dynamic creation of entities through a dialog.
 *
 * @template T The type of the entity being created.
 */
export interface IEntityDynamicCreateDialogService<T extends object> {

	/**
	 * Displays a dialog for creating a new entity.
	 * @param context The configuration context containing entity schema, validation service, and layout details.
	 * @returns A promise that resolves to the created entity if the dialog was confirmed, or undefined.
	 */
	showCreateDialog(context: IEntityDataCreationContext<T>): Promise<T | undefined>
}
