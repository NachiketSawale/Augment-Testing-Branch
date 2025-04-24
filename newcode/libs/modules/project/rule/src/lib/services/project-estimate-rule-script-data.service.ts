/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {ProjectEstimateRuleDataService} from './project-estimate-rule-data.service';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';
import {ProjectEstimateRulesComplete} from '../model/project-estimate-rule-complete.class';
import { EstimateRuleScriptBaseEntity} from '@libs/estimate/shared';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {get} from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ProjectEstimateRuleScriptDataService extends  DataServiceFlatLeaf<EstimateRuleScriptBaseEntity,IProjectEstimateRuleEntity,ProjectEstimateRulesComplete>{
    public constructor() {
        const parentService = inject(ProjectEstimateRuleDataService);
        const dataServiceOptions: IDataServiceOptions<EstimateRuleScriptBaseEntity> = {
            apiUrl: '',
            roleInfo: <IDataServiceChildRoleOptions<EstimateRuleScriptBaseEntity, IProjectEstimateRuleEntity, ProjectEstimateRulesComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PrjEstRuleScript',
                parent: parentService,
            }
        };
        super(dataServiceOptions);
    }

    /**
     * to set EstimateRuleScriptEntity to save
     * @param item
     */
    public setItemAsModified(item: EstimateRuleScriptBaseEntity){
        this.setModified(item);
    }

    /**
     * get estimate rule script request body
     * @param parentItem
     * @param mainItemIdField
     */
    public getPostRequestBody(parentItem: IProjectEstimateRuleEntity, mainItemIdField: string): object{
        return {PrjEstRuleFk: get(parentItem, mainItemIdField)};
    }
}