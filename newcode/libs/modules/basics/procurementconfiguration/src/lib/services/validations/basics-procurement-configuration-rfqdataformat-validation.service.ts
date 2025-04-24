/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsProcurementConfigurationRfqDataFormatDataService } from '../basics-procurement-configuration-rfqdataformat-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IPrcConfig2dataformatEntity } from '../../model/entities/prc-config-2-dataformat-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration RfqDataFormat
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfigurationRfqDataFormatValidationService extends BaseValidationService<IPrcConfig2dataformatEntity> {
    private dataService = inject(BasicsProcurementConfigurationRfqDataFormatDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfig2dataformatEntity> {
        return {
            IsDefault: this.validateIsDefault
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfig2dataformatEntity> {
        return this.dataService;
    }

    /**
     * validate IsDefault
     * @param info
     * @protected
     */
    protected validateIsDefault(info: ValidationInfo<IPrcConfig2dataformatEntity>): ValidationResult {
        return this.validationUtils.validateIsDefault(info, this.dataService);
    }
}
