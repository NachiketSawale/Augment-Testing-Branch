/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {includes} from 'lodash';
import {IEstRuleEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root',
})
export class EstimateCommonRuleMasterDataFilterService{
    private filterItemIds: number[] = [];

    // filter rule trees by project ratebook
    //TODO wait estimateProjectRateBookConfigDataService
    public filterRuleByMasterData(rules: IEstRuleEntity[], filterField: keyof IEstRuleEntity) {
        // let filterIds = estimateProjectRateBookConfigDataService.getFilterIds(5);
        const filterIds: number[] = [];
        let filteredRules: IEstRuleEntity[] = [];

        if(!filterField){
            filterField = 'Id';
        }

        if(filterIds && filterIds.length >0) {
            rules.forEach(rule => {
                if (includes(filterIds, rule[filterField])) {
                    filteredRules.push(rule);
                }
            });
        }else{
            filteredRules = rules;
        }

        return filteredRules;
    }

    public filterRuleItemsByMasterData(rules: IEstRuleEntity[], filterField: keyof IEstRuleEntity) {
        const filteredRules: IEstRuleEntity[] = [];

        if(!filterField){
            filterField = 'Id';
        }

        if(this.filterItemIds.length >0) {
            rules.forEach(rule => {
                if (includes(this.filterItemIds, rule[filterField])) {
                    filteredRules.push(rule);
                }
            });
        }

        return filteredRules;
    }

    public setRuleFilterIds(ruleIds: number[]): void{
        this.filterItemIds = ruleIds;
    }
}