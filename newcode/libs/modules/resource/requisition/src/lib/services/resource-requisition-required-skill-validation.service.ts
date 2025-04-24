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
import { IRequisitionRequiredSkillEntity } from '@libs/resource/interfaces';
import { ResourceRequisitionRequiredSkillDataService } from './resource-requisition-required-skill-data.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceRequisitionRequiredSkillValidationService extends BaseValidationService<IRequisitionRequiredSkillEntity>{
	private resourceRequisitionRequiredSkillDataService = inject(ResourceRequisitionRequiredSkillDataService);
	private validators: IValidationFunctions<IRequisitionRequiredSkillEntity> | null = null;
	public constructor(){
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IRequisitionRequiredSkillEntity>> = PlatformSchemaService<IRequisitionRequiredSkillEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Requisition', typeName: 'RequisitionRequiredSkillDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IRequisitionRequiredSkillEntity>){
		this.validators = new ValidationServiceFactory<IRequisitionRequiredSkillEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IRequisitionRequiredSkillEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRequisitionRequiredSkillEntity> {
		return this.resourceRequisitionRequiredSkillDataService;
	}
}