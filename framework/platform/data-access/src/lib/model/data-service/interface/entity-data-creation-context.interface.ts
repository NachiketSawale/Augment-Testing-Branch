/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySchema } from '../../entity-schema/entity-schema.interface';
import { BaseValidationService } from '../../validation/base-validation.service';

/**
 * Provides contextual information required for creating a dialog.
 * @typeParam T The type of the entity being created in the dialog.
 */
export interface IEntityDataCreationContext<T extends object> {
	schema: IEntitySchema<T>,
	validationService: BaseValidationService<T>,
	layout: object
}