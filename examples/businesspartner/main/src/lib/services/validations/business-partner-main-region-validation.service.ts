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
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { BusinessPartnerMainRegionDataService } from '../business-partner-main-region-data.service';
import { IRegionEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerMainRegionValidationService extends BaseValidationService<IRegionEntity> {

	private readonly headerDataService: BusinessPartnerMainRegionDataService = inject(BusinessPartnerMainRegionDataService);
	private readonly validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRegionEntity> {
		return this.headerDataService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IRegionEntity> {
		return {
			Code: [this.validateCode],
		};
	}

	public validateCode(info: ValidationInfo<IRegionEntity>, apply?: boolean): ValidationResult {
		const result = this.validationService.isMandatory(info, 'cloud.common.code');
		if (apply) {
			result.apply = true;
		}
		return result;
	}
}