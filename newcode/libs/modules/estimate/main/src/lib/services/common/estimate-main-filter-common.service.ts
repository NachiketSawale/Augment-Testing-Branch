/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { EstimateCommonFilterService } from '@libs/estimate/common';


@Injectable({
    providedIn: 'root'
})

/**
 * @name EstimateMainFilterCommonService
 * @description
 * service for all common filter structure services functions and tasks.
 */

export class EstimateMainFilterCommonService extends EstimateCommonFilterService{

    /**
     * @name collectItems
     * @methodOf EstimateMainFilterCommonService
     * @description collect items from parent and child entities
     * @param {string} item parent item
     * @param {string} childProp children item properties
     * @param {string} resultArr result attributes
     */
       public  collectItems<T>(item: T, childProp: keyof T, resultArr: T[] = []): T[] {
        resultArr.push(item);
    
        const children = item[childProp] as unknown as T[];
        if (Array.isArray(children)) {
            children.forEach((childItem) => {
                this.collectItems(childItem, childProp, resultArr);
            });
        }
    
        return resultArr;
    }
    

    /**
     * @name getRestrictedIds
     * @methodOf EstimateMainFilterCommonService
     * @description get restrict ids
     * @param {string} markedItems parent item
     * @param {string} childProp children item properties
     */
      private getRestrictedIds<T>(markedItems: T[], childProp: keyof T): string[] {
        let treeIds: string[] = [];
    
        markedItems.forEach((item) => {
            const collectedItems = this.collectItems(item, childProp);
            const ids = collectedItems.map((collectedItem) => (collectedItem as { Id: string }).Id);
            treeIds = treeIds.concat(ids);
        });
    
        return treeIds;
    }
    

    /**
     * @name getActivityRestrictedIds
     * @methodOf EstimateMainFilterCommonService
     * @description get Activity Restricted Ids
     * @param {string} markedItems parent item
     * @param {string} childProp children item properties
     */
     public getActivityRestrictedIds<T extends { ActivityTypeFk?: number; Id: string }>(
        markedItems: T[],
        childProp: keyof T = 'Activities' as keyof T
    ): string[] {
        let allIds: string[] = [];
    
        markedItems.forEach((item) => {
            // ActivityTypes: 1=(Regular)Activity, 2=SummaryActivity, 3=Milestone, 4=SubSchedule
            if (item.ActivityTypeFk === 1) { // (Regular)Activity
                allIds.push(item.Id);
            } else if (item.ActivityTypeFk === 2 || item.ActivityTypeFk === undefined) { // SummaryActivity
                // Get all child activities
                const items = this.collectItems(item, childProp);
                const ids = items
                    .filter((i) => i.ActivityTypeFk === 1)
                    .map((i) => i.Id);
                allIds = allIds.concat(ids);
            }
        });
    
        return allIds;
    }
    

    /**
     * @name getCondition
     * @methodOf EstimateMainFilterCommonService
     * @description get Condition
     * @param {string} filterMarker marker filter
     */
    // private getCondition(filterMarker) {
    //   //  let cond = {};
    //     //TODO needs to check how to add handle here
    //     /* let dataService = $injector.get(filterMarker.dataServiceName),
    //          fnGetRestrictedIds = filterMarker.fnGetRestrictedIds || this.getRestrictedIds,
    //          markedItems = filter(dataService.getList(), {IsMarked: true});

    //      cond[filterMarker.lineItemField] = fnGetRestrictedIds(markedItems, filterMarker.childProp);*/
    //    // return cond;
    // };

    //TODO need to change all controllers and services
    private filterMarkerData = [
        {
            filterId: 'costGroupStructureController',
            dataServiceName: 'costGroupStructureDataServiceFactory',
            childProp: 'CostGroupChildren',
            lineItemField: 'CostGroupFk'
        },
        {
            filterId: 'estimateMainActivityListController',
            dataServiceName: 'estimateMainActivityService',
            childProp: 'Activities',
            lineItemField: 'PsdActivityFk',
            fnGetRestrictedIds: this.getActivityRestrictedIds
        },
        {
            filterId: 'estimateMainAssemblyCategoryTreeController',
            dataServiceName: 'estimateMainAssembliesCategoryService',
            childProp: 'AssemblyCatChildren',
            lineItemField: 'EstAssemblyCatFk'
        },
        {
            filterId: 'estimateMainBoqListController',
            dataServiceName: 'estimateMainBoqService',
            childProp: 'BoqItems',
            lineItemField: 'BoqItemFk'
        },
        {
            filterId: 'estimateMainWicBoqListController',
            dataServiceName: 'estimateMainWicBoqService',
            childProp: 'BoqItems',
            lineItemField: 'WicBoqItemFk'
        },
        {
            filterId: 'estimateMainControllingListController',
            dataServiceName: 'estimateMainControllingService',
            childProp: 'ControllingUnits',
            lineItemField: 'MdcControllingUnitFk'
        },
        {
            filterId: 'estimateMainLocationListController',
            dataServiceName: 'estimateMainLocationService',
            childProp: 'Locations',
            lineItemField: 'PrjLocationFk'
        },
        {
            filterId: 'estimateMainProcurementStructureService',
            dataServiceName: 'estimateMainProcurementStructureService',
            childProp: 'ChildItems',
            lineItemField: 'PrcStructureFk'
        },
        {
            filterId: 'estimateMainConfidenceCheckController',
            dataServiceName: 'estimateMainConfidenceCheckService',
            childProp: 'EstConfidenceCheckChildrens',
            lineItemField: 'Id'
        },
    ];

    /**
     * @name getAllFilterConditions
     * @methodOf EstimateMainFilterCommonService
     * @description get All Filter Conditions
     */
    public getAllFilterConditions() {

        const conditions = {};

        //TODO need to check how to add angular extend
        /*this.filterMarkerData.map(function (filterMarker) {
            conditions = angular.extend(conditions, this.getCondition(filterMarker));
        });*/

        return conditions;
    }
}