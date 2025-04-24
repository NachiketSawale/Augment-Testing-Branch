/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { CommunityDataService } from '../community-data.service';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { ICommunityEntity } from '@libs/businesspartner/interfaces';



@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainExtRoleValidationService extends BaseValidationService<ICommunityEntity> {

	/// region basic
	private dataService: CommunityDataService = inject(CommunityDataService);
	protected translateService = inject(PlatformTranslateService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);

	protected override generateValidationFunctions(): IValidationFunctions<ICommunityEntity> {
		return {
			BidderFk: this.validateBidderFk,
			Percentage: this.validatePercentage,
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICommunityEntity> {
		return this.dataService;
	}
	/// endregion
   // region  validate

	protected async validateBidderFk(info: ValidationInfo<ICommunityEntity>) {
		let tempValue = info.value;
		if (info.value === 0 || info.value === -1) {
			tempValue = undefined;
		}

		const list = this.dataService.getList();
		const tempInfo: ValidationInfo<ICommunityEntity> = {
			entity: info.entity,
			value: tempValue,
			field: info.field
		};
		const fieldName: Translatable = {
					text: this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.BidderFk').text,
				};
		const validationResult = this.validationService.isUniqueAndMandatory(tempInfo, list, fieldName);

		if (validationResult.valid) {
			const parentItem = this.dataService.getParentData();
			if (parentItem && parentItem.Id === info.value) {
				validationResult.valid = false;
				validationResult.apply = true;
				validationResult.error = 'businesspartner.main.community.error.bpSelfForbidden';
			}
		}

		if (validationResult.valid) {
			const bpValidatorService = inject(BusinessPartnerLogicalValidatorFactoryService).create({
				dataService: this.dataService,
				needLoadDefaultSupplier: false
			});
			await  bpValidatorService.businessPartnerValidator({entity: info.entity, value: info.value as number});
		}
		return validationResult;
	}
	protected validatePercentage(info: ValidationInfo<ICommunityEntity>): ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		const nowShowData = this.dataService.getList();
		if (nowShowData && nowShowData.length > 0 && typeof info.value === 'number') {
			let countPercent = 0;

			for (const data of nowShowData) {
				if (data.Id === info.entity.Id) {
					countPercent += info.value;
				} else if (data.Percentage) {
					countPercent += data.Percentage;
				}
			}
			// region count no equal 100
			if (countPercent !== 100 && countPercent !== 0) {
				validationResult.valid = false;
				validationResult.error = this.translateService.instant('businesspartner.main.PercentageCountError').text;
				return validationResult;
			}
			// endregion
			//todo full logic
			// region clean other row error
			// 	_.forEach(nowShowData, function (item) {
			// 		platformRuntimeDataService.applyValidationResult(result, item, model);
			// 		platformDataValidationService.finishValidation(result, item, value, model, service, dataService);
			// 	});
			// 	dataService.gridRefresh();
			// 	// endregion
			// }
		}
		// platformRuntimeDataService.applyValidationResult(result, entity, model);
		// platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
		// return result;
		return validationResult;
	}
}