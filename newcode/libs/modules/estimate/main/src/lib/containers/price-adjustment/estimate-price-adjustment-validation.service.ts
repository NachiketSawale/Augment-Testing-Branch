import { Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { EstimatePriceAdjustmentDataService } from './estimate-price-adjustment.data.service';
import { IEstPriceAdjustmentItemData } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EstimatePriceAdjustmentValidationService extends BaseValidationService<IEstPriceAdjustmentItemData> {
	public constructor(private dataService: EstimatePriceAdjustmentDataService) {
		super();
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstPriceAdjustmentItemData> {
		return this.dataService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IEstPriceAdjustmentItemData> {
		return {
			UrDelta: this.asyncValidateField,
			UrAdjustment: this.asyncValidateField,
			UrTender: this.asyncValidateField,
			Urb1Delta: this.asyncValidateField,
			Urb1Adjustment: this.asyncValidateField,
			Urb1Tender: this.asyncValidateField,
			Urb2Delta: this.asyncValidateField,
			Urb2Adjustment: this.asyncValidateField,
			Urb2Tender: this.asyncValidateField,
			Urb3Delta: this.asyncValidateField,
			Urb3Adjustment: this.asyncValidateField,
			Urb3Tender: this.asyncValidateField,
			Urb4Delta: this.asyncValidateField,
			Urb4Adjustment: this.asyncValidateField,
			Urb4Tender: this.asyncValidateField,
			Urb5Delta: this.asyncValidateField,
			Urb5Adjustment: this.asyncValidateField,
			Urb5Tender: this.asyncValidateField,
			Urb6Delta: this.asyncValidateField,
			Urb6Adjustment: this.asyncValidateField,
			Urb6Tender: this.asyncValidateField,
			WqAdjustmentPrice: this.asyncValidateField,
			WqTenderPrice: this.asyncValidateField,
			WqDeltaPrice: this.asyncValidateField,
			AqQuantity: this.asyncValidateField,
			AqAdjustmentPrice: this.asyncValidateField,
			AqTenderPrice: this.asyncValidateField,
			AqDeltaPrice: this.asyncValidateField
		};
	}

	private asyncValidateField(info: ValidationInfo<IEstPriceAdjustmentItemData>): Promise<ValidationResult> {
		return this.dataService.recalculate(info);
	}
}
