/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IHsqChkListTemplate2FormEntity } from '@libs/hsqe/interfaces';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ChecklistTemplateFormDataService } from '../checklist-template-form-data.service';

@Injectable({ providedIn: 'root' })
export class ChecklistTemplateFormValidationService extends BaseValidationService<IHsqChkListTemplate2FormEntity> {
	private readonly dataService = inject(ChecklistTemplateFormDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly errorMsgKey: string = 'cloud.common.emptyOrNullValueErrorMessage';

	protected generateValidationFunctions(): IValidationFunctions<IHsqChkListTemplate2FormEntity> {
		return { Code: this.validateCode, BasFormFk: this.validateBasFormFk };
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IHsqChkListTemplate2FormEntity>): IHsqChkListTemplate2FormEntity[] => {
		const itemList = this.dataService.getList();
		return itemList.filter((item) => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
	};

	protected validateCode(info: ValidationInfo<IHsqChkListTemplate2FormEntity>) {
		let result = this.validateIsUnique(info);
		if (!result.valid) {
			const fieldName = this.translateService.instant('hsqe.checklist.header.Code').text;
			result = this.validationUtils.createErrorObject({ key: this.errorMsgKey, params: { fieldName: fieldName } });
		}
		return result;
	}

	protected validateBasFormFk(info: ValidationInfo<IHsqChkListTemplate2FormEntity>) {
		let result = new ValidationResult();
		if (<number>info.value <= 0) {
			const fieldName = this.translateService.instant('hsqe.checklisttemplate.entityBasForm').text;
			result = this.validationUtils.createErrorObject({ key: this.errorMsgKey, params: { fieldName: fieldName } });
		}
		return result;
	}

	// TODO-allen: Wait 'platformModuleStateService' to be implemented. Or this method is no longer needed.
	// protected validateTemporaryCheckListId(info: ValidationInfo<IHsqChkListTemplate2FormEntity>) {
	// 	var modState = platformModuleStateService.state(moduleName);
	// 	if (modState.validation && modState.validation.asyncCalls && modState.validation.asyncCalls.length) {
	// 		modState.validation.asyncCalls = _.filter(modState.validation.asyncCalls, function (c) {
	// 			return !(c.filed === model);
	// 		});
	// 	}
	// 	return true;
	// }

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqChkListTemplate2FormEntity> {
		return this.dataService;
	}
}
