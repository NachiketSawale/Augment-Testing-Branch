/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { EntitySchemaEvaluator, ISchemaProperty, IValidationService, NewEntityValidationProcessor, PlatformSchemaService } from '@libs/platform/data-access';
import { IEstLineitem2CtrlGrpEntity } from '../model/entities/est-lineitem-2ctrl-grp-entity.interface';
import { InjectionToken, ProviderToken, inject } from '@angular/core';
import { ESTIMATE_ASSEMBLIES_CTRL_GROUP_VALIDATION_TOKEN } from './estimate-assemblies-ctrl-group-validation.service';

export const RESOURCE_CATALOG_PRICEINDEX_VALIDATION_TOKEN = new InjectionToken<EstimateAssembliesCtrlNewEntityValidationProcessor>('estimateAssembliesCtrlNewEntityEntityValidationProcessor');
export class EstimateAssembliesCtrlNewEntityValidationProcessor extends NewEntityValidationProcessor<IEstLineitem2CtrlGrpEntity> {
	/**
	 * @brief Retrieves the validation service for IEstLineitem2CtrlGrpEntity.
	 *
	 * @return The validation service for IEstLineitem2CtrlGrpEntity, or null if the injection fails.
	 */
	protected override getValidator(): IValidationService<IEstLineitem2CtrlGrpEntity> | null {
		return inject(ESTIMATE_ASSEMBLIES_CTRL_GROUP_VALIDATION_TOKEN);
	}

	/**
	 * @brief Retrieves and evaluates the schema for IEstLineitem2CtrlGrpEntity.
	 *
	 * @return A promise that resolves to an array of ISchemaProperty<IEstLineitem2CtrlGrpEntity> objects.
	 */
	protected override async getSchema(): Promise<ISchemaProperty<IEstLineitem2CtrlGrpEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEstLineitem2CtrlGrpEntity>> = PlatformSchemaService<IEstLineitem2CtrlGrpEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({ moduleSubModule: 'Estimate.Assemblies', typeName: 'EstLineitem2CtrlGrpDto' }).then(function (scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}
