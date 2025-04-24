/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo
} from '@libs/platform/data-access';
import {IEstAllowanceAreaEntity} from '@libs/estimate/interfaces';
import {inject, Injectable} from '@angular/core';
import {EstimateMainAllowanceAreaDataService} from './estimate-main-allowance-area-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {some} from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainAllowanceAreaValidationService extends BaseValidationService<IEstAllowanceAreaEntity>{
    private readonly dataService: EstimateMainAllowanceAreaDataService = inject(EstimateMainAllowanceAreaDataService);
    private readonly validationUtils = inject(BasicsSharedDataValidationService);


    protected generateValidationFunctions(): IValidationFunctions<IEstAllowanceAreaEntity> {
        return {
            Code: this.validateCode
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IEstAllowanceAreaEntity> {
        return this.dataService;
    }

    protected validateCode(info: ValidationInfo<IEstAllowanceAreaEntity>) {
        const entity = info.entity;
        const value = info.value as string;
        const areas = this.dataService.getList();
        let result= this.validationUtils.isMandatory(info);

        if(result.valid && some(areas, { Code : value})){
            result = this.validationUtils.createErrorObject('cloud.common.uniqueValueErrorMessage');
        }
        entity.Code = value;
        // todo wait estimateMainAllowanceAreaValueColumnGenerator
        // $injector.get('estimateMainAllowanceAreaValueColumnGenerator').refreshColumns();

        return result;
    }
}