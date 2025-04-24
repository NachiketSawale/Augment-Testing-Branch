/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { IRfqBusinessPartner2ContactEntity } from '../../model/entities/rfq-businesspartner-2contact-entity.interface';
import { ProcurementRfqHeaderMainDataService } from '../procurement-rfq-header-main-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementRfqBusinessPartnerContactDataService } from '../rfq-businesspartner-contact-data.service';

@Injectable({
	providedIn: 'root'
})
export class RfqRequisitionValidationService extends BaseValidationService<IRfqBusinessPartner2ContactEntity> {

	private readonly headerDataService: ProcurementRfqHeaderMainDataService = inject(ProcurementRfqHeaderMainDataService);
	private readonly rfqBusinessPartnerContactDataService: ProcurementRfqBusinessPartnerContactDataService = inject(ProcurementRfqBusinessPartnerContactDataService);
	private readonly validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRfqBusinessPartner2ContactEntity> {
		return this.rfqBusinessPartnerContactDataService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IRfqBusinessPartner2ContactEntity> {
		return {
			ContactFk: [this.validateContactFk],
		};
	}

	public validateContactFk(info: ValidationInfo<IRfqBusinessPartner2ContactEntity>, apply?: boolean): ValidationResult {
		// TODO: validate ReqHeaderFk
		const list = this.rfqBusinessPartnerContactDataService.getList();
		const result = this.validationService.isUniqueAndMandatory(info, list, this.translationService.instant('cloud.common.code'));
		if (apply) {
			result.apply = true;
		}
		return result;
	}
}