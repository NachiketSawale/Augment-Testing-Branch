/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { IPpsUserFormDataEntity } from '../../model/entities/pps-formdata-entity.interface';

export class PpsCommonFormdataValidationService extends BaseValidationService<IPpsUserFormDataEntity> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly errorMsgKey: string = 'cloud.common.emptyOrNullValueErrorMessage';

	public constructor(private dataService: IEntityRuntimeDataRegistry<IPpsUserFormDataEntity>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPpsUserFormDataEntity> {
		return {
			FormFk: this.validateFormFk,
		};
	}

	protected validateFormFk(info: ValidationInfo<IPpsUserFormDataEntity>) {
		const fieldName = this.translateService.instant('cloud.common.entityUserForm').text;
		let result = this.validateIsMandatory(info);
		if (!info.value) {
			result = this.validationUtils.createErrorObject({ key: this.errorMsgKey, params: { fieldName: fieldName } });
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsUserFormDataEntity> {
		return this.dataService;
	}
}
