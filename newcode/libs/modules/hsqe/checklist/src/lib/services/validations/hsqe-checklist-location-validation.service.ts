/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IHsqCheckList2LocationEntity } from '@libs/hsqe/interfaces';
import { inject, Injectable } from '@angular/core';
import { HsqeChecklistLocationDataService } from '../hsqe-checklist-location-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistLocationValidationService extends BaseValidationService<IHsqCheckList2LocationEntity> {
	private readonly dataService: HsqeChecklistLocationDataService = inject(HsqeChecklistLocationDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IHsqCheckList2LocationEntity> {
		return {
			PrjLocationFk: this.validatePrjLocationFk,
		};
	}

	protected validatePrjLocationFk(info: ValidationInfo<IHsqCheckList2LocationEntity>) {
		return this.isMandatory(info, this.translateService.instant('hsqe.CheckList.activity.entityLocation').text);
	}

	private isMandatory(info: ValidationInfo<IHsqCheckList2LocationEntity>, fieldName: string) {
		let result = this.validateIsMandatory(info);
		if (!result.valid) {
			result = this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { fieldName: fieldName },
			});
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqCheckList2LocationEntity> {
		return this.dataService;
	}
}
