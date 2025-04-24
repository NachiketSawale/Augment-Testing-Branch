/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { CheckListTemplateHeaderDataService } from '../checklist-template-header-data.service';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

/**
 * CheckList Template validation service
 */
@Injectable({
	providedIn: 'root'
})
export class CheckListTemplateHeaderValidationService extends BaseValidationService<IHsqChkListTemplateEntity> {

	private readonly dataService = inject(CheckListTemplateHeaderDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly checkCodeUniqueUrl: string = 'hsqe/checklisttemplate/header/isunique';

	protected generateValidationFunctions(): IValidationFunctions<IHsqChkListTemplateEntity> {
		return {
			Code: this.validateCode,
			HsqCheckListGroupFk: this.validateHsqCheckListGroupFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqChkListTemplateEntity> {
		return this.dataService;
	}

	private validateCode(info: ValidationInfo<IHsqChkListTemplateEntity>): Promise<ValidationResult> {
		return this.validationUtils.isSynAndAsyncUnique(info, this.dataService.getList(), this.checkCodeUniqueUrl);
	}

	protected validateHsqCheckListGroupFk(info: ValidationInfo<IHsqChkListTemplateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}
}