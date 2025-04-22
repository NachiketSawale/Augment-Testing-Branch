import {Inject, Injectable} from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { IEvaluationItemEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerEvaluationschemaHeaderService } from '../schema-data.service';
import { BusinessPartnerEvaluationSchemaItemService } from '../items-data.service';

@Injectable({
	providedIn: 'root'
})
export class BusinessPartnerEvaluationSchemaItemValidationService extends BaseValidationService<IEvaluationItemEntity> {
	private readonly itemService = Inject(BusinessPartnerEvaluationSchemaItemService);
	private readonly schemaHeaderService = Inject(BusinesspartnerEvaluationschemaHeaderService);

	protected generateValidationFunctions(): IValidationFunctions<IEvaluationItemEntity> {
		return {
			FormFieldFk: this.ValidateFormFieldFk
		};
	}

	protected ValidateFormFieldFk(info: ValidationInfo<IEvaluationItemEntity>):ValidationResult {
		const validationResult: ValidationResult = {apply: true, valid: true};
		if (!this.schemaHeaderService.oldFormFieldId) {
			this.schemaHeaderService.oldFormFieldId = info.entity.FormFieldFk;
		}
		return validationResult;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEvaluationItemEntity> {
		return this.itemService;
	}
}
