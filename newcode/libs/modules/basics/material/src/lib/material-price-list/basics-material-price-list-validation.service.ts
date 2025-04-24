/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {BasicsMaterialPriceListDataService} from './basics-material-price-list-data.service';
import { IMaterialPriceListEntity } from '../model/entities/material-price-list-entity.interface';


/**
 * Material Price List validation service
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsMaterialPriceListValidationService extends BaseValidationService<IMaterialPriceListEntity> {
    private dataService = inject(BasicsMaterialPriceListDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IMaterialPriceListEntity> {
        return {
            validateMaterialPriceVersionFk: this.validateMaterialPriceVersionFk,
            validateTaxCodeFk: this.validateTaxCodeFk,
            validateCostPriceGross: this.validateCostPriceGross
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterialPriceListEntity> {
        return this.dataService;
    }

    protected validateMaterialPriceVersionFk(info: ValidationInfo<IMaterialPriceListEntity>): ValidationResult {
        //todo need set CurrencyFk
        return this.validationUtils.isUnique(this.dataService,info, this.dataService.getList(),true);
    }

    protected validateCostPriceGross(info: ValidationInfo<IMaterialPriceListEntity>): ValidationResult {
        //todo set recalculatePriceByPriceGross fn
        return this.validationUtils.createSuccessObject();
    }

    protected validateTaxCodeFk(info: ValidationInfo<IMaterialPriceListEntity>): ValidationResult {
        //todo set setCostPriceGross fn
        return this.validationUtils.createSuccessObject();
    }
}
