/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfiguration2BSchemaDataService } from '../basics-procurement-configuration-2bschema-data.service';
import { IPrcConfiguration2BSchemaEntity } from '../../model/entities/prc-configuration-2-bschema-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration 2BSchema
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfiguration2BSchemaValidationService extends BaseValidationService<IPrcConfiguration2BSchemaEntity> {
    private dataService = inject(BasicsProcurementConfiguration2BSchemaDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfiguration2BSchemaEntity> {
        return {
            IsDefault: this.validateIsDefault,
            BillingSchemaFk: this.validateBillingSchemaFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfiguration2BSchemaEntity> {
        return this.dataService;
    }

    protected validateBillingSchemaFk(info: ValidationInfo<IPrcConfiguration2BSchemaEntity>): ValidationResult {
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            LedgerContextFk: info.entity.LedgerContextFk,
            BillingSchemaFk: <number>info.value
        }, {
            key: 'cloud.common.towFiledUniqueValueErrorMessage',
            params: {field1: 'ledger context', field2: 'billing schema'}
        });
    }

    /**
     * validate IsDefault
     * @param info
     * @protected
     */
    protected validateIsDefault(info: ValidationInfo<IPrcConfiguration2BSchemaEntity>): ValidationResult {
        return this.validationUtils.validateIsDefault(info,this.dataService);
    }
}
