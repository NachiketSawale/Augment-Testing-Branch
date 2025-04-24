/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEmployeeSkillEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeSkillDataService } from './timekeeping-employee-skill-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeSkillValidationService extends  BaseValidationService<IEmployeeSkillEntity>{
	private validators: IValidationFunctions<IEmployeeSkillEntity> | null = null;

	public constructor(protected dataService: TimekeepingEmployeeSkillDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeeSkillEntity>> = PlatformSchemaService<IEmployeeSkillEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Skill', typeName: 'ResourceSkillDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeeSkillEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	//TODO Make Skill Mandatory

	protected generateValidationFunctions(): IValidationFunctions<IEmployeeSkillEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeeSkillEntity> {
		return this.dataService;
	}
}

