/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {
    BaseValidationService, IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import { IMdcContrChartEntity } from '../model/entities/mdc-contr-chart-entity.interface';
import { Inject, Injectable } from '@angular/core';
import { ControllingConfigurationChartDataService } from './controlling-configuration-chart-data.service';

@Injectable({
    providedIn: 'root'
})
export class ControllingConfigurationChartValidateService extends BaseValidationService<IMdcContrChartEntity>{

    private readonly dataServie = Inject(ControllingConfigurationChartDataService);

    protected generateValidationFunctions(): IValidationFunctions<IMdcContrChartEntity> {
        return {
            IsDefault1: this.validateIsDefault1,
            IsDefault2: this.validateIsDefault2,
        };
    }

    private validateIsDefault1(info: ValidationInfo<IMdcContrChartEntity>): ValidationResult{
        return new ValidationResult();
    }

    private validateIsDefault2(info: ValidationInfo<IMdcContrChartEntity>): ValidationResult{
        return new ValidationResult();
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcContrChartEntity> {
        return this.dataServie;
    }
}