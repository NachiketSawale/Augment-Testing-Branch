/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { HsqeChecklistFormDataService } from '../hsqe-checklist-form-data.service';

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistFormValidationService extends BaseValidationService<IHsqCheckList2FormEntity> {
	private readonly dataService = inject(HsqeChecklistFormDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translateService = inject(PlatformTranslateService);

	private readonly errorMsgKey: string = 'cloud.common.emptyOrNullValueErrorMessage';

	protected generateValidationFunctions(): IValidationFunctions<IHsqCheckList2FormEntity> {
		return {
			Code: this.validateCode,
			FormFk: this.validateFormFk,
		};
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IHsqCheckList2FormEntity>): IHsqCheckList2FormEntity[] => {
		const itemList = this.dataService.getList();
		return itemList.filter((item) => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});
	};

	protected validateCode(info: ValidationInfo<IHsqCheckList2FormEntity>) {
		let result = this.validateIsUnique(info);
		if (!result.valid) {
			const fieldName = this.translateService.instant('hsqe.checklist.header.Code').text;
			result = this.validationUtils.createErrorObject({ key: this.errorMsgKey, params: { fieldName: fieldName } });
		}
		return result;
	}

	protected validateFormFk(info: ValidationInfo<IHsqCheckList2FormEntity>) {
		const fieldName = this.translateService.instant('hsqe.checklist.form.userForm').text;
		let result = this.validateIsMandatory(info);
		if ((info.value as number) <= 0) {
			result = this.validationUtils.createErrorObject({ key: this.errorMsgKey, params: { fieldName: fieldName } });
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqCheckList2FormEntity> {
		console.warn('getEntityRuntimeData');
		return this.dataService;
	}
}
