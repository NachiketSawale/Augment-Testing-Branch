/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEmployeeDocumentEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDocumentDataService } from './timekeeping-employee-document-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeDocumentValidationService extends  BaseValidationService<IEmployeeDocumentEntity>{
	private validators: IValidationFunctions<IEmployeeDocumentEntity> | null = null;

	public constructor(protected dataService: TimekeepingEmployeeDocumentDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeeDocumentEntity>> = PlatformSchemaService<IEmployeeDocumentEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeDocumentDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeeDocumentEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IEmployeeDocumentEntity> {
		if (!this.validators){
			return {};
		}
		return this.validators;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeeDocumentEntity> {
		return this.dataService;
	}
}

