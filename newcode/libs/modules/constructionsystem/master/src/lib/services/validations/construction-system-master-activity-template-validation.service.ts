/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemMasterActivityTemplateDataService } from '../construction-system-master-activity-template-data.service';
import { ICosActivityTemplateEntity, ITemplateActivityTemplateEntity } from '../../model/models';

/**
 * Activity Template validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterActivityTemplateValidationService extends BaseValidationService<ICosActivityTemplateEntity> {
	private readonly dataService = inject(ConstructionSystemMasterActivityTemplateDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosActivityTemplateEntity> {
		return {
			Code: this.validateCode,
			ActivityTemplateFk: this.validateActivityTemplateFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosActivityTemplateEntity> {
		return this.dataService;
	}

	private validationFk(value: string | number | undefined | null) {
		return typeof value === 'undefined' || value === null || value === '' || value === -1 || value === 0;
	}

	private validateCode(info: ValidationInfo<ICosActivityTemplateEntity>) {
		if (this.validationFk(info.value as string)) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } });
		} else {
			const list = this.dataService.getList();

			const valid = !list.some(function (item) {
				return item.Code === info.value && item.Id !== info.entity.Id;
			});
			if (!valid) {
				return this.validationUtils.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage', params: { object: info.field } });
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	private async validateActivityTemplateFk(info: ValidationInfo<ICosActivityTemplateEntity>) {
		const activityTemplateId = (info.value as number) ?? 0;
		const activityTemplateLookup = await this.dataService.getActivityTemplateLookup();
		const activityTemplate = await firstValueFrom(activityTemplateLookup.getItemByKey({ id: activityTemplateId }));
		info.entity.ActivityTemplateFk = activityTemplateId;
		info.entity.ActivityTemplate = activityTemplate as ITemplateActivityTemplateEntity;
		if (this.validationFk(activityTemplateId)) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } });
		}

		return this.validationUtils.createSuccessObject();
	}
}
