/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, DataServiceFlatRoot, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { IEstimateProjectHeader2ClerkEntity } from '../model/entities/estimate-project-header-2clerk-entity.interface';
import { EstimateProjectClerkComplete } from '../model/estimate-project-clerk-complete.class';

/**
 * @name estimateProjectClerkValidationService
 * @description provides validation methods for estimate project clerk entities
 */

export const ESTIMATE_PROJECT_CLERK_VALIDATION_TOKEN = new InjectionToken<EstimateProjectClerkValidationService>('estimateProjectClerkValidationService');
export class EstimateProjectClerkValidationService extends BaseValidationService<IEstimateProjectHeader2ClerkEntity> {
	private estProjectclerkValidators: IValidationFunctions<IEstimateProjectHeader2ClerkEntity> | null = null;

	public constructor(protected dataService: DataServiceFlatRoot<IEstimateProjectHeader2ClerkEntity, EstimateProjectClerkComplete>) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEstimateProjectHeader2ClerkEntity>> = PlatformSchemaService<IEstimateProjectHeader2ClerkEntity>;
		const platformSchemaService = inject(schemaSvcToken);
		platformSchemaService.getSchema({ moduleSubModule: 'Estimate.Project', typeName: 'EstimateProjectHeader2ClerkDto' }).then(scheme => {
			this.estProjectclerkValidators = new ValidationServiceFactory<IEstimateProjectHeader2ClerkEntity>().provideValidationFunctionsFromScheme(scheme, this);
		});
		
	}
	
	/**
	 * Generates the validation functions for Estimate Project Clerk entities.
	 * @returns An object containing validation functions.
	 */
	public generateValidationFunctions(): IValidationFunctions<IEstimateProjectHeader2ClerkEntity> {
		if (this.estProjectclerkValidators !== null) {
			return this.estProjectclerkValidators;
		}
		return {};
	}

	/**
	 * Retrieves the runtime data for the entity.
	 * @returns The runtime data registry for Estimate Project Clerk entities.
	 */
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstimateProjectHeader2ClerkEntity> {
		return this.dataService;
	}
}
