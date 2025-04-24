import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IHsqCheckList2ActivityEntity } from '@libs/hsqe/interfaces';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { HsqeChecklistActivityDataService } from '../hsqe-checklist-activity-data.service';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistActivityValidationService extends BaseValidationService<IHsqCheckList2ActivityEntity> {
	private readonly dataService: HsqeChecklistActivityDataService = inject(HsqeChecklistActivityDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IHsqCheckList2ActivityEntity> {
		return {
			PsdScheduleFk: this.validatePsdScheduleFk,
			PsdActivityFk: this.validatePsdActivityFk,
		};
	}

	protected validatePsdScheduleFk(info: ValidationInfo<IHsqCheckList2ActivityEntity>) {
		return this.isMandatory(info, this.translateService.instant('hsqe.CheckList.activity.entitySchedule').text);
	}

	protected validatePsdActivityFk(info: ValidationInfo<IHsqCheckList2ActivityEntity>) {
		return this.isMandatory(info, this.translateService.instant('hsqe.CheckList.activity.entityActivity').text);
	}

	private isMandatory(info: ValidationInfo<IHsqCheckList2ActivityEntity>, fieldName: string) {
		let result = this.validateIsMandatory(info);
		if (!result.valid) {
			result = this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { fieldName: fieldName },
			});
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqCheckList2ActivityEntity> {
		return this.dataService;
	}
}
