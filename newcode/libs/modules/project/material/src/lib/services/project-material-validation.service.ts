/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationResult
} from '@libs/platform/data-access';
import {IPrjMaterialEntity} from '@libs/project/interfaces';
import {Inject, Injectable} from '@angular/core';
import { ProjectMaterialDataService } from './project-material-data.service';
import {FieldValidationInfo} from '@libs/ui/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialValidationService extends BaseValidationService<IPrjMaterialEntity>{
    
    private readonly dataService = Inject(ProjectMaterialDataService);
    
    protected generateValidationFunctions(): IValidationFunctions<IPrjMaterialEntity> {
        return {
            ListPrice: this.costListPriceValidator,
            Discount: this.discountValidator,
            Charges:this.chargesValidator,
            PriceExtra:this.priceExtraValidator,
            PriceconditionFk: this.validatePrcPriceconditionFk
        };
    }

    private costListPriceValidator(info:FieldValidationInfo<IPrjMaterialEntity>): ValidationResult{
        info.entity.ListPrice = info.value ? info.value as number : 0;
        this.dataService.recalculateCost(info.entity,null, 'ListPrice');
        return new ValidationResult();
    }

    private discountValidator(info:FieldValidationInfo<IPrjMaterialEntity>): ValidationResult{
        info.entity.Discount = info.value ? info.value as number : 0;
        this.dataService.recalculateCost(info.entity,null, 'Discount');
        return new ValidationResult();
    }

    private chargesValidator(info:FieldValidationInfo<IPrjMaterialEntity>): ValidationResult{
        info.entity.Charges = info.value ? info.value as number : 0;
        this.dataService.recalculateCost(info.entity,null, 'Charges');
        return new ValidationResult();
    }

    private priceExtraValidator(info:FieldValidationInfo<IPrjMaterialEntity>): ValidationResult{
        info.entity.PriceExtra = info.value ? info.value as number : 0;
        this.dataService.recalculateCost(info.entity,null, 'PriceExtra');
        return new ValidationResult();
    }

    private validatePrcPriceconditionFk(info:FieldValidationInfo<IPrjMaterialEntity>): ValidationResult {
	    const value = info.value ? (info.value as number) : null;
	    this.dataService.priceConditionChanged$.next(value);
	    return new ValidationResult();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrjMaterialEntity> {
        return this.dataService;
    }

}

