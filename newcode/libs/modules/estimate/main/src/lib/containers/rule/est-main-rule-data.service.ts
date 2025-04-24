/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEstMainRuleEntity} from '@libs/estimate/interfaces';
import {IEstimateMainRuleComplete} from '../../model/complete/est-main-rule-complete.class';
import {get} from 'lodash';
import {
    EstimateCommonRuleService,
    EstimateMainContextService,
    EstimateRuleBaseDataService
} from '@libs/estimate/shared';
import {ISearchResult} from '@libs/platform/common';
import {Subject} from 'rxjs';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';
@Injectable({
    providedIn: 'root'
})
export class EstimateMainRuleDataService extends EstimateRuleBaseDataService<IEstMainRuleEntity,IEstimateMainRuleComplete>{
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private readonly estimateCommonRuleService = inject(EstimateCommonRuleService);

    // private projectId = this.estimateMainContextService.getSelectedProjectId();

    //event
    public onUpdateData = new Subject<object>();

    public constructor() {
        super({
            itemName: 'EstRuleComplete',
            apiUrl:'estimate/rule/projectestimaterule',
            readEndPoint: 'compositelist'
        });
    }

    public override createUpdateEntity(modified: IEstMainRuleEntity | null): IEstimateMainRuleComplete {
        const complete = new IEstimateMainRuleComplete();
        if (modified !== null) {
            complete.Id = modified.Id;
        }
        return complete;
    }

    /**
     * Convert http response of searching to standard search result
     * @param loaded
     * @protected
     */
    protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstMainRuleEntity> {
        // todo wait estimateRuleComplexLookupService
        // data.isRoot = false;
        // this data can be used in lookup estimateRuleComplexLookupService
        const estRulesEntities: IEstMainRuleEntity[] =  get(loaded, 'EstRulesEntities', []);
        const prjEstRulesEntities: IProjectEstimateRuleEntity[] =  get(loaded, 'PrjEstRulesEntities', []);
        const ruleCompositeItems = this.estimateCommonRuleService.generateRuleCompositeList(estRulesEntities, prjEstRulesEntities,'isForEstimate', true);
        // let estimateRuleComplexLookupService = $injector.get('estimateRuleComplexLookupService');
        // if (estimateRuleComplexLookupService) {
        //     estimateRuleComplexLookupService.setCompositeRuleItems(ruleCompositeItems);
        // }

        const fr = get(loaded, 'FilterResult')!;
        return {
            FilterResult: fr,
            dtos: ruleCompositeItems! as IEstMainRuleEntity[]
        };
    }

    public override childrenOf(element: IEstMainRuleEntity): IEstMainRuleEntity[] {
        if(element && element.CustomEstRules){
            return element.CustomEstRules as IEstMainRuleEntity[];
        }
        return [];
    }

    public override parentOf(element: IEstMainRuleEntity): IEstMainRuleEntity | null {
        if (element.CustomEstRuleFk == null) {
            return null;
        }

        const parentId = element.CustomEstRuleFk;
        const parent = this.flatList().find(candidate => candidate.Id === parentId);
        return parent === undefined ? null : parent;
    }

    // TODO
    // data.doNotLoadOnSelectionChange = true;
    // data.usesCache = true;
    //
    // angular.extend(data, {
    //     showHeaderAfterSelectionChanged: null
    // });

    public unloadSubEntities(){

    }

    public provideUpdateData(updateData:object){
        this.onUpdateData.next(updateData);
        return updateData;
    }

    public init(){
        const projectId = this.estimateMainContextService.getSelectedProjectId();
        if (projectId) {
            this.refreshAll();
            // TODO Wait estimateProjectRateBookConfigDataService
            // return estimateProjectRateBookConfigDataService.initData().then(function(/* response */){
            //     service.load();
            // });
        }
    }

    public initEx(projectFk: number | null){
        if (projectFk) {
           //  this.projectId = projectFk;
            const list = this.getList();
            if (!list || list.length < 1) {
                this.refreshAllLoaded();
                // service.load();
            }
        }
    }

    //protected setList(items: IEstMainRuleEntity[]){
        // TODO should check again
        // data.selectedItem = null;
        // data.itemList.length = 0;
        // data.itemTree.length = 0;
        // _.forEach(items, function (item) {
        //     data.itemList.push(item);
        //     data.itemTree.push(item);
        // });
        // data.listLoaded.fire();
    //}

    public updateItemList(rules: IEstMainRuleEntity[]){
        if(!rules){
            return;
        }
        // TODO should check again
        // setList(rules);
        // if(_.isFunction(service.refresh)){
        //     service.refresh();
        // }
    }

    public isProjectRuleSelected(){
        const selectedItem = this.getSelectedEntity();
        return selectedItem && selectedItem.IsPrjRule;
    }
}