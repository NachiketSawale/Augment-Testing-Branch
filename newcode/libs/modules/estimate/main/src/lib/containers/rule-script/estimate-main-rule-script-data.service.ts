/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {EstimateRuleScriptBaseDataService, EstimateRuleScriptBaseEntity} from '@libs/estimate/shared';
import {IEstimateMainRuleComplete} from '../../model/complete/est-main-rule-complete.class';
import {EstimateMainRuleDataService} from '../rule/est-main-rule-data.service';
import {IEstMainRuleEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainRuleScriptDataService extends EstimateRuleScriptBaseDataService<EstimateRuleScriptBaseEntity,IEstMainRuleEntity,IEstimateMainRuleComplete>{
    public constructor() {
        super(inject(EstimateMainRuleDataService),{
            itemNam: 'PrjEstRuleScript'
        });
    }
}