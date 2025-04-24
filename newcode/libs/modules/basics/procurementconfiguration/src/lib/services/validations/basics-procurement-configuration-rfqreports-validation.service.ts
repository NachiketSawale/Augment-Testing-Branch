/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';

import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfigurationRfqReportsDataService } from '../basics-procurement-configuration-rfqreports-data.service';
import { IPrcConfig2ReportEntity } from '../../model/entities/prc-config-2-report-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration RfqReports
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfigurationRfqReportsValidationService extends BaseValidationService<IPrcConfig2ReportEntity> {
    private dataService = inject(BasicsProcurementConfigurationRfqReportsDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfig2ReportEntity> {
        return {
            IsDefault: this.validateIsDefault,
            BasReportFk: this.validateBasReportFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfig2ReportEntity> {
        return this.dataService;
    }

    /**
     * validate IsDefault
     * @param info
     * @protected
     */
    protected validateIsDefault(info: ValidationInfo<IPrcConfig2ReportEntity>): ValidationResult {
        return this.validationUtils.validateIsDefault(info,this.dataService);
    }

    protected validateBasReportFk(info: ValidationInfo<IPrcConfig2ReportEntity>): ValidationResult {
        return this.validationUtils.isMandatory(info);
    }
}
