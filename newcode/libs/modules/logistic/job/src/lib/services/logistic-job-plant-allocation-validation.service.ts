/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IJobPlantAllocationEntity } from '@libs/logistic/interfaces';
import { LogisticJobPlantAllocationDataService } from './logistic-job-plant-allocation-data.service';


/**
 * Logistic Job Material Rate Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobPlantAllocationValidationService extends BaseValidationService<IJobPlantAllocationEntity> {


	private dataService = inject(LogisticJobPlantAllocationDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IJobPlantAllocationEntity> {
		return {
			MaterialFk:this.validateIsMandatory,
			AllocatedFrom:this.validateAllocatedFrom,
			AllocatedTo:this.validateAllocatedTo

		};
	}

/*
	private asyncValidatePlantFk (info: ValidationInfo<IJobPlantAllocationEntity>):Promise<ValidationResult> {
		 TODO: const lookupService = ServiceLocator.injector.get(BasicsSharedPlantLookupService);
		const role = await firstValueFrom(lookupService.getItemByKey({ id: equipmentplant.value as number}));
		if(role && role.IsUnique){
			const plantList = this.dataService.getList();
			const samePlants = plantList.filter(item => {
				return item.PlankFk === info.value as number;
				isSuccess = false;
			});
			if(!isSuccess){
				applyPlantValue(info.entity, plantList )
				result.apply = true;
				result.valid = false;
				result.error = 'basics.common.PlantMustBeUnique';
			}
		}

	}
*/

	 private applyPlantValue(oldPlant:IJobPlantAllocationEntity, newPlant:IJobPlantAllocationEntity){
		 oldPlant.PlantTypeFk = newPlant.PlantTypeFk;
		 oldPlant.PlantCode = newPlant.PlantCode;
		 oldPlant.PlantDescription = newPlant.PlantDescription;
		 oldPlant.PlantStatusFk = newPlant.PlantStatusFk;
	 }



	private validateAllocatedFrom(info: ValidationInfo<IJobPlantAllocationEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateAllocatedTo(info: ValidationInfo<IJobPlantAllocationEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}


	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IJobPlantAllocationEntity> {
		return this.dataService;
	}
}