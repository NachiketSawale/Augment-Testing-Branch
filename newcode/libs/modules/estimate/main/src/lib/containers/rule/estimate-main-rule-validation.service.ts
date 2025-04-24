/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEstMainRuleEntity} from '@libs/estimate/interfaces';
import {EstimateMainRuleDataService} from './est-main-rule-data.service';
import {EstimateRuleBaseValidationService} from '@libs/estimate/shared';
import {IValidationFunctions} from '@libs/platform/data-access';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainRuleValidationService extends EstimateRuleBaseValidationService{

    protected generateCustomizeValidationFunctions(): IValidationFunctions<IEstMainRuleEntity> | null {
        return null;
    }

   public constructor(protected estimateMainRuleDataService: EstimateMainRuleDataService) {
        super(estimateMainRuleDataService);
    }
}