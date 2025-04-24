/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IEntitySchema,
	IValidationFunctions,
    PlatformSchemaService,
    ValidationServiceFactory,
} from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { IRequisitionEntity } from '@libs/resource/interfaces';
import { ResourceRequisitionDataService } from './resource-requisition-data.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceRequisitionValidationService extends BaseValidationService<IRequisitionEntity>{
	private resourceRequisitionDataService = inject(ResourceRequisitionDataService);
	private validators: IValidationFunctions<IRequisitionEntity> | null = null;
	public constructor(){
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IRequisitionEntity>> = PlatformSchemaService<IRequisitionEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Requisition', typeName: 'RequisitionDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IRequisitionEntity>){
		this.validators = new ValidationServiceFactory<IRequisitionEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IRequisitionEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRequisitionEntity> {
		return this.resourceRequisitionDataService;
	}
}