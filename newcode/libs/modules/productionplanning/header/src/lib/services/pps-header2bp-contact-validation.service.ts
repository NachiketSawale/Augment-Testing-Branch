/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
/* it's useless, to be deleted in the future
import { inject, Injectable } from '@angular/core';
import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PpsHeader2BpContactDataService } from './pps-header2bp-contact-data.service';
import { PpsHeaderMandatoryAndUniqueBaseValidationService } from './pps-header-mandatoryandunique-base-validation.service';
import { IPpsCommonBizPartnerContactEntity } from '@libs/productionplanning/common';

@Injectable({
	providedIn: 'root'
})
export class PpsHeader2BpContactValidationService extends PpsHeaderMandatoryAndUniqueBaseValidationService<IPpsCommonBizPartnerContactEntity> {

	private dataService = inject(PpsHeader2BpContactDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPpsCommonBizPartnerContactEntity> {
		return {
			ContactFk: this.validateContactFk,
			RoleTypeFk: this.validateRoleTypeFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsCommonBizPartnerContactEntity> {
		return this.dataService;
	}

	private validateContactFk(info: ValidationInfo<IPpsCommonBizPartnerContactEntity>): ValidationResult {
		const validateIsUniqueFn = (info: ValidationInfo<IPpsCommonBizPartnerContactEntity>) => !this.dataService.getList().some(item => {
			return item.ContactFk === info.value
				&& item.RoleTypeFk === info.entity.RoleTypeFk
				&& item.Id !== info.entity.Id;
		});
		return this.validateIsMandatoryAndUnique(info, validateIsUniqueFn, 'productionplanning.header.errors.uniqContactFk');
	}

	private validateRoleTypeFk(info: ValidationInfo<IPpsCommonBizPartnerContactEntity>): ValidationResult {
		const validateIsUniqueFn = (info: ValidationInfo<IPpsCommonBizPartnerContactEntity>) => !this.dataService.getList().some(item => {
			return item.RoleTypeFk === info.value
				&& item.ContactFk === info.entity.ContactFk
				&& item.Id !== info.entity.Id;
		});
		return this.validateIsMandatoryAndUnique(info, validateIsUniqueFn, 'productionplanning.header.errors.uniqContactRoleTypeFk');
	}

}
*/