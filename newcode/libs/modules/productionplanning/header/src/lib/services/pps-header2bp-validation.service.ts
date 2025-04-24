/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
/* it's useless, to be deleted in the future
import { inject, Injectable } from '@angular/core';
import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PpsHeader2BpDataService } from './pps-header2bp-data.service';
import { PpsHeaderMandatoryAndUniqueBaseValidationService } from './pps-header-mandatoryandunique-base-validation.service';
import { IPpsCommonBizPartnerEntity } from '@libs/productionplanning/common';

@Injectable({
	providedIn: 'root'
})
export class PpsHeader2BpValidationService extends PpsHeaderMandatoryAndUniqueBaseValidationService<IPpsCommonBizPartnerEntity> {

	private dataService = inject(PpsHeader2BpDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPpsCommonBizPartnerEntity> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			RoleFk: this.validateRoleFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsCommonBizPartnerEntity> {
		return this.dataService;
	}

	private validateBusinessPartnerFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): ValidationResult {
		const validateIsUniqueFn = (info: ValidationInfo<IPpsCommonBizPartnerEntity>) => !this.dataService.getList().some(item => {
			return item.BusinessPartnerFk === info.value
				&& item.RoleFk === info.entity.RoleFk
				&& item.SubsidiaryFk === info.entity.SubsidiaryFk
				&& item.Id !== info.entity.Id;
		});
		return this.validateIsMandatoryAndUnique(info, validateIsUniqueFn, 'productionplanning.header.errors.uniqBusinessPartnerFk');
	}

	private validateRoleFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): ValidationResult {
		const validateIsUniqueFn = (info: ValidationInfo<IPpsCommonBizPartnerEntity>) => !this.dataService.getList().some(item => {
			return item.RoleFk === info.value
				&& item.BusinessPartnerFk === info.entity.BusinessPartnerFk
				&& item.SubsidiaryFk === info.entity.SubsidiaryFk
				&& item.Id !== info.entity.Id;
		});
		return this.validateIsMandatoryAndUnique(info, validateIsUniqueFn, 'productionplanning.header.errors.uniqRoleFk');
	}

	private validateSubsidiaryFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): ValidationResult {
		const validateIsUniqueFn = (info: ValidationInfo<IPpsCommonBizPartnerEntity>) => !this.dataService.getList().some(item => {
			return item.SubsidiaryFk === info.value
				&& item.BusinessPartnerFk === info.entity.BusinessPartnerFk
				&& item.RoleFk === info.entity.RoleFk
				&& item.Id !== info.entity.Id;
		});
		return this.validateIsMandatoryAndUnique(info, validateIsUniqueFn, 'productionplanning.header.errors.uniqSubsidiaryFk');
	}

}
*/