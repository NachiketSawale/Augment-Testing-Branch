/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IValidationService, ISchemaProperty, NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator } from '@libs/platform/data-access';
import { inject, ProviderToken } from '@angular/core';
import { IBasicsClerkEntity, ICostcodePriceVerEntity } from '@libs/basics/interfaces';
import { BASICS_COSTCODES_PRICE_VERSION_VALIDATION_TOKEN } from './basics-cost-codes-price-version-validation.service';

/**
 * BasicsCostCodesPriceVesrionkNewEntityValidationProcessorService
 */
export class BasicsCostCodesPriceVesrionkNewEntityValidationProcessorService extends NewEntityValidationProcessor<ICostcodePriceVerEntity> {
	protected override getValidator(): IValidationService<ICostcodePriceVerEntity> | null {
		return inject(BASICS_COSTCODES_PRICE_VERSION_VALIDATION_TOKEN);
	}

	/**
	 * @brief Asynchronously retrieves and evaluates the schema for `ICostcodePriceVerEntity`.
	 * @return A `Promise` that resolves to an array of `ISchemaProperty` objects for `ICostcodePriceVerEntity`.
	 */
	protected override async getSchema(): Promise<ISchemaProperty<ICostcodePriceVerEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<ICostcodePriceVerEntity>> = PlatformSchemaService<IBasicsClerkEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({ moduleSubModule: 'Basics.CostCodes', typeName: 'CostcodePriceVerDto' }).then(function (scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}
