/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfiguration2StrategyDataService } from '../basics-procurement-configuration-2strategy-data.service';
import { IPrcConfiguration2StrategyEntity } from '../../model/entities/prc-configuration-2-strategy-entity.interface';


/**
 * The basic validation service for ProcurementConfiguration 2Strategy
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementConfiguration2StrategyValidationService extends BaseValidationService<IPrcConfiguration2StrategyEntity> {
    private dataService = inject(BasicsProcurementConfiguration2StrategyDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcConfiguration2StrategyEntity> {
        return {
            PrcStrategyFk: this.validatePrcStrategyFk,
            PrcCommunicationChannelFk: this.validatePrcCommunicationChannelFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcConfiguration2StrategyEntity> {
        return this.dataService;
    }

    /**
     * validate PrcStrategyFk
     * @param info
     * @protected
     */
    protected validatePrcStrategyFk(info: ValidationInfo<IPrcConfiguration2StrategyEntity>): ValidationResult {
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            PrcStrategyFk: <number>info.value,
            PrcCommunicationChannelFk: info.entity.PrcCommunicationChannelFk
        }, {
            key: 'cloud.common.towFiledUniqueValueErrorMessage',
            params: {field1: 'strategy', field2: 'communication channel'}
        });
    }

    /**
     * validate PrcCommunicationChannelFk
     * @param info
     * @protected
     */
    protected validatePrcCommunicationChannelFk(info: ValidationInfo<IPrcConfiguration2StrategyEntity>): ValidationResult {
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            PrcStrategyFk: info.entity.PrcStrategyFk,
            PrcCommunicationChannelFk: <number>info.value
        }, {
            key: 'cloud.common.towFiledUniqueValueErrorMessage',
            params: {field1: 'strategy', field2: 'communication channel'}
        });
    }
}
