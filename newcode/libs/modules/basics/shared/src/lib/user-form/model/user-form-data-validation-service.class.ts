/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { CompleteIdentification, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedUserFormDataService } from './user-form-data-service.class';
import { BasicsSharedDataValidationService } from '../../services/basics-shared-data-validation.service';
import { IUserFormDataEntity } from './entities/user-form-data-entity.interface';

export class BasicsSharedUserFormDataValidationService<PT extends object, PU extends CompleteIdentification<PT>> extends BaseValidationService<IUserFormDataEntity> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly errorMsgKey: string = 'cloud.common.emptyOrNullValueErrorMessage';

	public constructor(private dataService: BasicsSharedUserFormDataService<PT, PU>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IUserFormDataEntity> {
		return {
			FormFk: this.validateFormFk,
		};
	}

	protected validateFormFk(info: ValidationInfo<IUserFormDataEntity>) {
		const fieldName = this.translateService.instant('cloud.common.entityUserForm').text;
		let result = this.validateIsMandatory(info);
		if (!info.value) {
			result = this.validationUtils.createErrorObject({key: this.errorMsgKey, params: {fieldName: fieldName}});
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IUserFormDataEntity> {
		return this.dataService;
	}
}
