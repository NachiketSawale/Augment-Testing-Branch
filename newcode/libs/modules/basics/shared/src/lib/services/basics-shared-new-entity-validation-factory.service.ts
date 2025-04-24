/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken } from '@angular/core';
import { EntitySchemaEvaluator, IEntitySchemaId, ISchemaProperty, IValidationService, NewEntityValidationProcessor, PlatformSchemaService } from '@libs/platform/data-access';
import { IEntityBase, ServiceLocator } from '@libs/platform/common';

/**
 * Factory for creating instances of BasicsSharedNewEntityValidationProcessor.
 * Provides a method to create a new validation processor with the specified validation service, entity schema ID, and options.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedNewEntityValidationProcessorFactory {
	/**
	 * Creates a new instance of BasicsSharedNewEntityValidationProcessor.
	 *
	 * @param validationToken - The token for the validation service.
	 * @param entitySchemaId - The ID of the entity schema.
	 * @param options - Optional settings for the validation processor.
	 * @returns A new instance of BasicsSharedNewEntityValidationProcessor.
	 */
	public createProcessor<T extends IEntityBase>(validationToken: ProviderToken<IValidationService<T>>, entitySchemaId: IEntitySchemaId, options?: INewEntityValidationOptions<T>) {
		return new BasicsSharedNewEntityValidationProcessor(validationToken, entitySchemaId, options);
	}
}

/**
 * Processor for validating new entities.
 * Extends the NewEntityValidationProcessor class to provide custom validation logic.
 */
class BasicsSharedNewEntityValidationProcessor<T extends IEntityBase> extends NewEntityValidationProcessor<T> {
	/**
	 * Constructs a new BasicsSharedNewEntityValidationProcessor.
	 *
	 * @param validationToken - The token for the validation service.
	 * @param entitySchemaId - The ID of the entity schema.
	 * @param options - Optional settings for the validation processor.
	 */
	public constructor(
		private validationToken: ProviderToken<IValidationService<T>>,
		private entitySchemaId: IEntitySchemaId,
		private options?: INewEntityValidationOptions<T>,
	) {
		super();
	}

	/**
	 * Retrieves the validation service.
	 *
	 * @returns The validation service instance, or null if not found.
	 */
	protected override getValidator(): IValidationService<T> | null {
		return ServiceLocator.injector.get(this.validationToken);
	}

	/**
	 * Retrieves the schema properties for the entity.
	 *
	 * @returns A promise that resolves to an array of schema properties.
	 */
	protected override async getSchema(): Promise<ISchemaProperty<T>[]> {
		const platformSchemaService = ServiceLocator.injector.get(PlatformSchemaService<T>);
		const scheme = await platformSchemaService.getSchema(this.entitySchemaId);
		let fields = EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);

		if (this.options?.includeDateFields) {
			fields.push(...EntitySchemaEvaluator.EvaluateDateAndTimeFields(scheme));
		}

		if (this.options?.additionalFields) {
			fields.push(...this.options.additionalFields);
		}

		if (this.options?.excludeFields) {
			fields = fields.filter(f => !this.options?.excludeFields?.includes(f.name as keyof T));
		}

		return fields;
	}
}

/**
 * Options for configuring the new entity validation processor.
 */
interface INewEntityValidationOptions<T extends IEntityBase> {
	/** Whether to include date fields in the validation. */
	includeDateFields?: boolean;
	/** Additional fields to include in the validation. */
	additionalFields?: ISchemaProperty<T>[];
	/** fields to exclude in the validation. */
	excludeFields?: Array<keyof T>;
}
