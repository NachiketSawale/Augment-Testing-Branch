/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEmployeeSkillDocumentEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeSkillDocumentService } from './timekeeping-employee-skill-document.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeSkillDocumentValidationService extends  BaseValidationService<IEmployeeSkillDocumentEntity>{
	private validators: IValidationFunctions<IEmployeeSkillDocumentEntity> | null = null;

	public constructor(protected dataService: TimekeepingEmployeeSkillDocumentService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeeSkillDocumentEntity>> = PlatformSchemaService<IEmployeeSkillDocumentEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeSkillDocumentDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeeSkillDocumentEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	//TODO Make DocumentTypeFk', 'EmployeesSkillDocTypefk' Mandatory

	protected generateValidationFunctions(): IValidationFunctions<IEmployeeSkillDocumentEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeeSkillDocumentEntity> {
		return this.dataService;
	}
}

