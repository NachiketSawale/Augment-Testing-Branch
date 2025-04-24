/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfig2TabDataService } from '../basics-procurement-config-2tab-data.service';
import { IPrcConfiguration2TabEntity } from '../../model/entities/prc-configuration-2-tab-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration 2tab
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfiguration2TabValidationService extends BaseValidationService<IPrcConfiguration2TabEntity> {
    private dataService = inject(BasicsProcurementConfig2TabDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfiguration2TabEntity> {
        return {
            ModuleTabFk: this.validateModuleTabFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfiguration2TabEntity> {
        return this.dataService;
    }

    /**
     * validate ModuleTabFk
     * @param info
     * @protected
     */
    protected validateModuleTabFk(info: ValidationInfo<IPrcConfiguration2TabEntity>): ValidationResult {
        return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());
    }
}
