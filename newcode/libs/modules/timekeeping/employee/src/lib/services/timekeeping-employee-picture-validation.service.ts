/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { IEmployeePictureEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeePictureDataService } from './timekeeping-employee-picture-data.service';
import { filter } from 'lodash';
@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeePictureValidationService extends  BaseValidationService<IEmployeePictureEntity>{
	private validators: IValidationFunctions<IEmployeePictureEntity> | null = null;

	public constructor(protected dataService: TimekeepingEmployeePictureDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEmployeePictureEntity>> = PlatformSchemaService<IEmployeePictureEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeePictureDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IEmployeePictureEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected generateValidationFunctions(): IValidationFunctions<IEmployeePictureEntity> {
		return {
			IsDefault: [this.asyncValidateIsDefault]
		};
	}

	private async asyncValidateIsDefault(info: ValidationInfo<IEmployeePictureEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const value = info.value as number;
		if (value) {
			const items = filter(this.dataService.getList(), { IsDefault: true });
			items.forEach((item: IEmployeePictureEntity) => {
				item.IsDefault = false;
				this.dataService.setModified(item);
			});
			this.dataService.setModified(entity);
			//TODO grid refresh //timekeepingEmployeePictureDataService.gridRefresh();
		}
		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEmployeePictureEntity> {
		return this.dataService;
	}
}

