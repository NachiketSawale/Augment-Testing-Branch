/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { inject, Inject, Injectable } from '@angular/core';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainObjectTemplateDataService } from '../construction-system-main-object-template-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceValidationService extends BaseValidationService<ICosInstanceEntity> {
	private readonly dataService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly http = inject(PlatformHttpService);
	private readonly objectTemplateDataService = Inject(ConstructionSystemMainObjectTemplateDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICosInstanceEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			IsChecked: this.validateIsChecked,
			IsUserModified: this.validateIsUserModified,
			CosTemplateFk: this.validateCosTemplateFk,
		};
	}

	protected async validateCode(info: ValidationInfo<ICosInstanceEntity>): Promise<ValidationResult> {
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
	}

	/**
	 * use promise??? do not understand the senario now
	 * @param info
	 * @protected
	 */
	protected asyncValidateCode(info: ValidationInfo<ICosInstanceEntity>): Promise<ValidationResult> {
		const validataCompleteDto = {
			ValidateDto: info.entity,
			Value: info.value,
			Model: 'Code',
		};
		return this.http.post<boolean | null>('constructionsystem/main/instance/validate', validataCompleteDto).then((result) => {
			if (!result) {
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.uniqueValueErrorMessage',
					params: { fieldName: info.field.toLowerCase() },
				});
			} else {
				return this.validationUtils.createSuccessObject();
			}
		});
	}

	protected validateIsUserModified(info: ValidationInfo<ICosInstanceEntity>) {
		//todo
		//$injector.get('constructionsystemMainLineItemService').canDelete();
		return new ValidationResult();
	}

	protected validateIsChecked(info: ValidationInfo<ICosInstanceEntity>) {
		//todo
		//dataService.syncModelViewWithCheckedInstances();
		return new ValidationResult();
	}

	protected validateCosTemplateFk(info: ValidationInfo<ICosInstanceEntity>) {
		const updateData = {
			MasterTemplateId: -1,
			InstanceId: info.entity.Id,
			MasterId: info.entity.HeaderFk,
			InsHeaderId: info.entity.InstanceHeaderFk,
		};
		if (info.value) {
			updateData.MasterTemplateId = info.value as number;
		}
		this.objectTemplateDataService.updateObjectTemplateByInsTemplateId(updateData);
		//todo: this.dataService.templateChangedMessenger.fire(null, {entity: entity, templateId: value});
		return this.validationUtils.createSuccessObject();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosInstanceEntity> {
		return this.dataService;
	}
}

///todo common validationService constructionSystemMainValidationEnhanceService
