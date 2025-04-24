/*
 * Copyright(c) RIB Software GmbH
 */
import {
    BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
    ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {inject, Injectable} from '@angular/core';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {IPpsFormulaInstanceEntity} from '../model/models';
import {PpsFormulaInstanceDataService} from './pps-formula-instance-data.service';

@Injectable({
    providedIn: 'root',
})
export class PpsFormulaInstanceValidationService extends BaseValidationService<IPpsFormulaInstanceEntity> {
    private validateUtils = inject(BasicsSharedDataValidationService);
    private dateService = inject(PpsFormulaInstanceDataService);

    protected generateValidationFunctions(): IValidationFunctions<IPpsFormulaInstanceEntity> {
        return {
            Code: this.validateCode,
        };
    }

    protected validateCode(info: ValidationInfo<IPpsFormulaInstanceEntity>): ValidationResult {
        return this.validateUtils.isMandatory(info);
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsFormulaInstanceEntity> {
        return this.dateService;
    }
}