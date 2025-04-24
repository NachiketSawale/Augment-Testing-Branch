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

import {BasicsProcurementStructureTaxCodeDataService} from './basics-procurement-structure-tax-code-data.service';
import { IPrcStructureTaxEntity } from '@libs/basics/interfaces';



/**
 * The validation service for ProcurementStructure tax code
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureTaxCodeValidationService extends BaseValidationService<IPrcStructureTaxEntity> {
    private dataService = inject(BasicsProcurementStructureTaxCodeDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcStructureTaxEntity> {
        return {
            validateMdcLedgerContextFk: this.validateMdcLedgerContextFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcStructureTaxEntity> {
        return this.dataService;
    }

    protected validateMdcLedgerContextFk(info: ValidationInfo<IPrcStructureTaxEntity>): ValidationResult {
        info.entity.MdcTaxCodeFk = null;
        info.entity.MdcSalesTaxGroupFk = null;
        return this.validationUtils.isMandatory(info);
    }
}
