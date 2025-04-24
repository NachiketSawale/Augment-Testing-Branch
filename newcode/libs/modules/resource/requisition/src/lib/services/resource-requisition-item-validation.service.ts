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
import { IRequisitionitemEntity } from '@libs/resource/interfaces';
import { ResourceRequisitionItemDataService } from './resource-requisition-item-data.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceRequisitionItemValidationService extends BaseValidationService<IRequisitionitemEntity>{
	private resourceRequisitionItemDataService = inject(ResourceRequisitionItemDataService);
	private validators: IValidationFunctions<IRequisitionitemEntity> | null = null;
	public constructor(){
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IRequisitionitemEntity>> = PlatformSchemaService<IRequisitionitemEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Requisition', typeName: 'RequisitionitemDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IRequisitionitemEntity>){
		this.validators = new ValidationServiceFactory<IRequisitionitemEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IRequisitionitemEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRequisitionitemEntity> {
		return this.resourceRequisitionItemDataService;
	}
}