import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IReqVariantEntity } from '../../model/entities/req-variant-entity.interface';
import { ProcurementRequisitionRequisitionVariantDataService } from '../requisition-variant-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionRequisitionVariantValidationService extends BaseValidationService<IReqVariantEntity> {
	private readonly reqVariantService = inject(ProcurementRequisitionRequisitionVariantDataService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IReqVariantEntity> {
		return this.reqVariantService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IReqVariantEntity> {
		return {
			Code: this.validateCode,
		};
	}

	protected validateCode(info: ValidationInfo<IReqVariantEntity>): ValidationResult {
		const list = this.reqVariantService.getList();
		const validateResult = this.validationService.isUnique(this.reqVariantService, info, list);
		if (!validateResult.valid) {
			validateResult.error = this.translationService.instant('procurement.requisition.variant.variantCodeUniqueError').text;
		}
		return validateResult;
	}
}