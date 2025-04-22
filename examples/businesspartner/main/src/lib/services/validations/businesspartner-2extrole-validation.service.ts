/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BusinessPartner2ExtRoleDataService } from '../businesspartner-2extrole-data.service';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { IBusinessPartner2ExtRoleEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainExtRoleValidationService extends BaseValidationService<IBusinessPartner2ExtRoleEntity> {

	/// region basic
	private dataService: BusinessPartner2ExtRoleDataService = inject(BusinessPartner2ExtRoleDataService);
	protected translateService = inject(PlatformTranslateService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	protected override generateValidationFunctions(): IValidationFunctions<IBusinessPartner2ExtRoleEntity> {
		return {
			ExternalRoleFk: this.validateExternalRoleFk
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBusinessPartner2ExtRoleEntity> {
		return this.dataService;
	}
	/// endregion
   // region  validate
	protected validateExternalRoleFk(info: ValidationInfo<IBusinessPartner2ExtRoleEntity>): ValidationResult {
		const list = this.dataService.getList();
		const tempInfo: ValidationInfo<IBusinessPartner2ExtRoleEntity> = {
			entity: info.entity,
			value: !info.value ? undefined : info.value,
			field: info.field
		};
		const fieldName: Translatable = {
					text: this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.ExternalRoleFk').text,
				};
		return this.validationService.isUniqueAndMandatory(tempInfo, list, fieldName);
	}
}