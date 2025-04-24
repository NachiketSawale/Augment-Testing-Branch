import { Injectable } from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {IEstPriceAdjustmentItemData, IEstPriceAdjustmentTotalEntity} from '@libs/estimate/interfaces';
import { EstimatePriceAdjustmentTotalDataService } from './estimate-price-adjustment-total.data.service';

@Injectable({
    providedIn: 'root'
})

export class EstimatePriceAdjustmentTotalValidationService extends BaseValidationService<IEstPriceAdjustmentTotalEntity> {
    public constructor(private dataService: EstimatePriceAdjustmentTotalDataService) {
        super();
    }
    public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstPriceAdjustmentTotalEntity> {
        return this.dataService;
    }
    protected override generateValidationFunctions(): IValidationFunctions<IEstPriceAdjustmentTotalEntity> {
        return {
            Quantity:this.asyncValidateField,
            AdjustmentPrice:this.asyncValidateField,
            TenderPrice:this.asyncValidateField,
            DeltaA:this.asyncValidateField,
            DeltaB:this.asyncValidateField
        };
    }

    private asyncValidateField(info: ValidationInfo<IEstPriceAdjustmentTotalEntity>):Promise<ValidationResult> {
        const adjustmentTotalEntity = this.dataService.getAdjustmentTotalEntity();
        if (adjustmentTotalEntity) {
            const newField = adjustmentTotalEntity.getMappingField(info.entity, info.field);
            if (newField) {
                const newInfo = new ValidationInfo<IEstPriceAdjustmentItemData>(adjustmentTotalEntity.entity, info.value, newField);
                return this.dataService.recalculate(newInfo);
            } else {
                if (info.field === 'DeltaB') {
                    const result = adjustmentTotalEntity.calculateDeltaB(info.entity, info.value as number);
                    const newInfo = new ValidationInfo<IEstPriceAdjustmentItemData>(adjustmentTotalEntity.entity, result.newValue, result.newField);
                    return this.dataService.recalculate(newInfo);
                }
            }
        }
        return Promise.resolve({valid: true, apply: true});
    }
}