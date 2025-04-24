/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { PlatformTranslateService, PropertyType, Translatable } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartner2ExternalDataService } from '../businesspartner-2external-data.service';
import { IBp2externalEntity } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainExtRoleValidationService extends BaseValidationService<IBp2externalEntity> {

	/// region basic
	private dataService: BusinessPartner2ExternalDataService = inject(BusinessPartner2ExternalDataService);
	protected translateService = inject(PlatformTranslateService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	protected override generateValidationFunctions(): IValidationFunctions<IBp2externalEntity> {
		return {
			ExternalRoleFk: this.validateExternalFk
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBp2externalEntity> {
		return this.dataService;
	}
	/// endregion
   // region  validate
	protected validateExternalFk(info: ValidationInfo<IBp2externalEntity>): ValidationResult {
		const list = this.dataService.getList();
		let tempValue:PropertyType | undefined=info.value;
		if (info.value===-1) {
			 tempValue=undefined;
		}
		const tempInfo: ValidationInfo<IBp2externalEntity> = {
			entity: info.entity,
			value: tempValue,
			field: info.field
		};
		const fieldName: Translatable = {
			text: this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.ExternalFk').text,
		};
		return this.validationService.isUniqueAndMandatory(tempInfo,list, fieldName);
		
	}
}