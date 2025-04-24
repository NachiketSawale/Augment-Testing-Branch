/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEmployeeDefaultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDefaultDataService } from './timekeeping-employee-default-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeDefaultValidationService extends  BaseValidationService<IEmployeeDefaultEntity>{
	private validators: IValidationFunctions<IEmployeeDefaultEntity> | null = null;

	public constructor(protected dataService: TimekeepingEmployeeDefaultDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeeDefaultEntity>> = PlatformSchemaService<IEmployeeDefaultEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeDefaultDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeeDefaultEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IEmployeeDefaultEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeeDefaultEntity> {
		return this.dataService;
	}
}

