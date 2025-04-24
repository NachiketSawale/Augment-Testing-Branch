/* eslint-disable no-mixed-spaces-and-tabs */
/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProjectCostcodesPriceListForJobDataService } from './project-costcodes-price-list-for-job-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PrjCostCodesEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostcodePriceListForJobValidationService {

	private validationUtils = inject(BasicsSharedDataValidationService);
	private messengerService = inject(ProjectCostcodesPriceListForJobDataService);
	private dataService = inject(ProjectCostcodesPriceListForJobDataService);

	public validateIsChecked(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		info.entity['IsChecked'] = info.value == 'isChecked';
		this.setChecked(info);
		if (info.entity.ProjectCostCodes && info.entity.ProjectCostCodes.length > 0) {
			// TODO this.dataService.refreshAllLoaded();
		}
		return new ValidationResult();
	}
	public setChecked(info: ValidationInfo<PrjCostCodesEntity>) {
		if (info.entity.ProjectCostCodes && info.entity.ProjectCostCodes.length > 0) {
			info.entity.ProjectCostCodes.forEach((item) => {
				item['IsChecked'] = info.value == 'IsChecked';
				return this.setChecked(info);
			});
		}

		//public validateJobCostCodePriceVersionFk(entity:IEntity, value:boolean){
		//entity.JobCostCodePriceVersionFk = value ? 1:0;
		// if (value) {
		//   let lookupItem = basicsLookupdataLookupDescriptorService.getItemByIdSync(value, {lookupType: 'CostCodePriceVersion'});   // TODO : dependancy basicsLookupdataLookupDescriptorService
		//   entity.MdcPriceListFk = lookupItem.PriceListFk;
		// } else {
		//   entity.MdcPriceListFk = null;
		// }
		// if (entity.isJob) {
		//   messengerService.JobPriceVersionSelectedChanged.fire(null, {
		//     job: entity,
		//     priceVersionFk: value
		//   });
		// } else {
		//   messengerService.PrjCostCodesPriceVersionSelectedChanged.fire(null, {
		//     prjCostCodes: entity,
		//     priceVersionFk: value
		//   });
		//}
	}

	public validateNewRate(info: ValidationInfo<PrjCostCodesEntity>) {
		info.entity['NewRate'] = info.value ? 1 : 0;
		info.entity['MdcPriceListFk'] = null;
		info.entity['JobCostCodePriceVersionFk'] = null;
		// messengerService.PrjCostCodesPriceVersionSelectedChanged.fire(null, {        // TODO:
		//   prjCostCodes: entity,
		//   priceVersionFk: null,
		//   needCompute: false
		// });
	}

	public validateNewDayWorkRate(info: ValidationInfo<PrjCostCodesEntity>) {
		info.entity['NewRate'] = info.value ? 1 : 0;
		info.entity['MdcPriceListFk'] = null;
		info.entity['JobCostCodePriceVersionFk'] = null;
		// messengerService.PrjCostCodesPriceVersionSelectedChanged.fire(null, {
		//   prjCostCodes: entity, // TODO: projectCostCodesPriceListForJobMessengerService not ready dependancy PlatformMessenger
		//   priceVersionFk: null,
		//   needCompute: false
		// });
	}

	public validateNewFactorCosts(info: ValidationInfo<PrjCostCodesEntity[]>) {
		// const entity = info.entity;
		// const model = info.field;
		// const value = info.value;
		// if (value !== undefined && typeof value === 'string') {
		// 	this.dataService.calcRealFactors(entity, model, value);
		// }
	}

	public validateNewCurrencyFk(info: ValidationInfo<PrjCostCodesEntity[]>) {
		//  const entity=info.entity.NewCurrencyFk;
		//  const model=info.field;
		// const value=info.value;
	 	// this.dataService.calcRealFactors(info);
	}
}
