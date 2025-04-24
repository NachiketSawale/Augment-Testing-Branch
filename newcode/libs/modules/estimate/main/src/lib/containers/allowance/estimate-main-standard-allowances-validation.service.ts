/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {cloneDeep, filter} from 'lodash';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo
} from '@libs/platform/data-access';
import {EstimateMainStandardAllowancesDataService} from './estimate-main-standard-allowances-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { IEstAllowanceEntity } from '@libs/estimate/interfaces';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';

@Injectable({
    providedIn: 'root'
})export class EstimateMainStandardAllowancesValidationService extends BaseValidationService<IEstAllowanceEntity>{
    private readonly dataService: EstimateMainStandardAllowancesDataService = inject(EstimateMainStandardAllowancesDataService);
    private readonly estimateMainService: EstimateMainService = inject(EstimateMainService);
    private readonly validationUtils = inject(BasicsSharedDataValidationService);


    protected generateValidationFunctions(): IValidationFunctions<IEstAllowanceEntity> {
        return {
            Code: this.validateCode,
            IsActive: this.validateIsActive,
            IsOneStep: this.validateIsOneStep
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstAllowanceEntity> {
        return this.dataService;
    }

    protected validateCode(info: ValidationInfo<IEstAllowanceEntity>) {
        const entity = info.entity;
        let value = info.value as string;
        const oldEstAllowance = cloneDeep(entity);
        entity.oldCode = oldEstAllowance.Code;
        entity.isUniq = true;
        if (value.length > 0) {
            value = value.toUpperCase();
        }
        const result = this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList());

        if (!result.valid) {
            entity.isUniq = false;
        }

        return result;
    }

    protected validateIsActive(info: ValidationInfo<IEstAllowanceEntity>) {
        const entity = info.entity;
        const value = info.value as boolean;
        const activeAllowance = filter(this.dataService.getList(),{IsActive:true});
        if(activeAllowance.length === 1){
            if(value){
                this.dataService.setActiveAllowanceChange(activeAllowance[0].Id);
            } else {
                this.dataService.setActiveAllowanceChange(entity.Id);
            }
        }

        this.dataService.setIsActiveChange(true);
        if (value) {
            this.dataService.setUniqueIsActive(entity);
            // todo wait handleOldAllowance
            // this.estimateMainService.handleOldAllowance();
        }
        return this.validationUtils.createSuccessObject();
    }

    protected validateIsOneStep(info: ValidationInfo<IEstAllowanceEntity>) {
        info.entity.IsOneStep = info.value as boolean;
        // todo wait estStandardAllowancesCostCodeDetailDataService
        // estStandardAllowancesCostCodeDetailDataService.refreshColumns('e4a0ca6ff2214378afdc543646e6b079',entity);
        return this.validationUtils.createSuccessObject();
    }
}