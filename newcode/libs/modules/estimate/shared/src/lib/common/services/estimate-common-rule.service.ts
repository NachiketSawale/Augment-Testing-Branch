/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEstRuleEntity} from '@libs/estimate/interfaces';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';
import {filter, isNull, map, sortBy, uniq} from 'lodash';
import {CollectionHelper} from '@libs/platform/common';
import {EstimateCommonRuleMasterDataFilterService} from './estimate-common-rule-master-data-filter.service';

@Injectable({
    providedIn: 'root',
})
export class EstimateCommonRuleService {
    private readonly estimateRuleMasterDataFilterService = inject(EstimateCommonRuleMasterDataFilterService);

    public generateRuleCompositeList(estRulesEntities: IEstRuleEntity[], prjEstRulesEntities: IProjectEstimateRuleEntity[], isForBoqOrEstimate: string, filterByMasterData: boolean){
        // fix defect 88659, The unnamed parameter still could be saved in Estimate
        // all rule combo data is from this function, use the argument isForBoqOrEstimate to judge it is for Boq or Estimate
        // if isForBoqOrEstimate === undefined no filter for the data here;
        const isForBoq = isForBoqOrEstimate === 'isForBoq';
        const isForEstimate = isForBoqOrEstimate === 'isForEstimate';

        let result: IProjectEstimateRuleEntity[] = [];
        this.setValueForRule(estRulesEntities,false);
        this.setValueForRule(prjEstRulesEntities, true);

        if(filterByMasterData) {

            let ruleTrees = this.buildTree(estRulesEntities);

            // filter rules by project ratebook
            ruleTrees = this.estimateRuleMasterDataFilterService.filterRuleByMasterData(ruleTrees, 'MainId');

            result = prjEstRulesEntities.concat(CollectionHelper.Flatten(ruleTrees, (item) => {
                return item.CustomEstRules || [];
            }));

            // fix alm 134610:Rules lookup is empty on surcharge 4 item in boq
            const prjRuleList = filter(estRulesEntities,'IsPrjRule');
            result = uniq(prjRuleList.concat(result));
        } else {
            result = estRulesEntities;
            result = prjEstRulesEntities && prjEstRulesEntities.length ? result.concat(prjEstRulesEntities) : result;
        }

        // filter it whether isForBoq or IsForEstimate
        if(isForBoq){
            result = filter(result, item => item.IsForBoq === isForBoq);
        } else if(isForEstimate){
            result = filter(result, item => item.IsForEstimate === isForEstimate);
        }

        if(filterByMasterData) {
            this.estimateRuleMasterDataFilterService.setRuleFilterIds(map(result, 'MainId') as number[]);
        }

        sortBy(result, ['Sorting', 'Code']);
        return this.buildTree(result);
    }

    private attachProp(item: IProjectEstimateRuleEntity, list: IProjectEstimateRuleEntity[], parentProps: keyof IProjectEstimateRuleEntity){
        if(this.hasProperty(item, parentProps)){
            const matchedItem = list.find(e =>  e.MainId === item[parentProps]);
            if(matchedItem){
                if(isNull(matchedItem.CustomEstRules)){
                    matchedItem.CustomEstRules = [];
                }
                // matchedItem.CustomEstRules.push(item);

                item.CustomEstRuleFk = matchedItem.Id;
                item.ParentCode = matchedItem.Code;
            }
        }
    }

    private hasProperty(obj: object, prop: PropertyKey): boolean {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    private buildTree(items: IProjectEstimateRuleEntity[]) {
        const firstItem: IProjectEstimateRuleEntity[] = [];
        items.forEach(item => {
            const parent = items.find(e => e.Id === item.CustomEstRuleFk);
            if (parent) {
                if(!isNull(parent.CustomEstRules) && !parent.CustomEstRules.find(e => e.Id === item.Id)){
                    parent.CustomEstRules?.push(item);
                }
                parent.HasChildren = true;
            } else {
                firstItem.push(item);
            }
        });
        return firstItem.filter(item => isNull(item.CustomEstRuleFk));
    }

    private setValueForRule(rules: IEstRuleEntity[] | IProjectEstimateRuleEntity[], isPrjRules: boolean){
        let cnt = 0;
        rules.forEach(item => {
            item.OriginalMainId = item.MainId;
            item.MainId = item.Id;
            item.Id = ++cnt;
            item.CustomEstRuleFk = null;
            item.ParentCode = null;
            item.CustomEstRules = [];
        });

        rules.forEach(item => {
            // eslint-disable-next-line no-prototype-builtins
            if(isPrjRules){
                this.attachProp(item, rules, 'PrjEstRuleFk');
            } else {
                this.attachProp(item, rules, 'EstRuleFk');
            }
        });
    }
}