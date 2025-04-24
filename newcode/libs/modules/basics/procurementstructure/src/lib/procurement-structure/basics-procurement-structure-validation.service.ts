/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementStructureDataService } from './basics-procurement-structure-data.service';
import { IPrcStructureEntity } from '@libs/basics/interfaces';

/**
 * Procurement structure validation service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureValidationService extends BaseValidationService<IPrcStructureEntity> {
    private validationUtils = inject(BasicsSharedDataValidationService);
    private dataService = inject(BasicsProcurementStructureDataService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcStructureEntity> {
        return {
            Code: this.validateCode
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcStructureEntity> {
        return this.dataService;
    }

    protected async validateCode(info: ValidationInfo<IPrcStructureEntity>): Promise<ValidationResult> {
        return this.validationUtils.isSynAndAsyncUnique(info, this.dataService.getList(), 'basics/procurementstructure/isunique');
    }
}