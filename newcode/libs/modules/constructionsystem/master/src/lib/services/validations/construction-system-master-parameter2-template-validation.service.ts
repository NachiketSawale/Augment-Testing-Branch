/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ICosParameter2TemplateEntity } from '../../model/entities/cos-parameter-2-template-entity.interface';
import { inject, Injectable } from '@angular/core';
import { ConstructionSystemMasterParameter2TemplateGridDataService } from '../construction-system-master-parameter2-template-grid-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ConstructionSystemMasterParameter2TemplateReadonlyProcessorService } from '../processors/construction-system-master-parameter2-template-readonly-processor.service';
import { CosDefaultType } from '@libs/constructionsystem/common';
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameter2TemplateValidationService extends BaseValidationService<ICosParameter2TemplateEntity> {
	private readonly dataService = inject(ConstructionSystemMasterParameter2TemplateGridDataService);
	private readonly readonlyProcessor = inject(ConstructionSystemMasterParameter2TemplateReadonlyProcessorService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosParameter2TemplateEntity> {
		return {
			CosDefaultTypeFk: this.validateCosDefaultTypeFk,
		};
	}

	public validateCosDefaultTypeFk(info: ValidationInfo<ICosParameter2TemplateEntity>) {
		const entity = info.entity;
		if (!(info.value === CosDefaultType.PropertyOrQuantityQuery || info.value === CosDefaultType.QuantityQuery)) {
			if (entity.QuantityQueryInfo) {
				entity.QuantityQueryInfo.Description = '';
				if (entity.QuantityQueryInfo.DescriptionTr) {
					entity.TranslationTrToDelete = info.entity.QuantityQueryInfo?.DescriptionTr ?? 0;
					entity.QuantityQueryInfo.DescriptionModified = true;
					entity.QuantityQueryInfo.DescriptionTr = 0;
					entity.QuantityQueryInfo.Modified = true;
					entity.QuantityQueryInfo.Translated = '';
					entity.QuantityQueryTranslationList = [];
				}
			}
		}
		this.readonlyProcessor.process(info.entity);
		this.dataService.defaultTypeChanged.next(null);
		return this.validationUtils.createSuccessObject();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosParameter2TemplateEntity> {
		return this.dataService;
	}
}
