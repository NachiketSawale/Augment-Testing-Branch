/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfigConfiguration2ConApprovalDataService } from '../basics-procurement-config-configuration-2conapproval-data.service';
import { IPrcConfig2ConApprovalEntity } from '../../model/entities/prc-config-2-con-approval-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration  2Contract Approvals
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfigConfiguration2ConApprovalValidationService extends BaseValidationService<IPrcConfig2ConApprovalEntity> {
    private dataService = inject(BasicsProcurementConfigConfiguration2ConApprovalDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfig2ConApprovalEntity> {
        return {
            ClerkRoleFk: this.validateClerkRoleFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfig2ConApprovalEntity> {
        return this.dataService;
    }


    protected validateClerkRoleFk(info: ValidationInfo<IPrcConfig2ConApprovalEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }
}
