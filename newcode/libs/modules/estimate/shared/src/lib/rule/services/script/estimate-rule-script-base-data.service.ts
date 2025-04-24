/*
 * Copyright(c) RIB Software GmbH
 */

import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';
import {EstimateRuleBaseComplete, IEstRuleEntity} from '@libs/estimate/interfaces';
import {EstimateRuleBaseDataService} from '../estimate-rule-base-data-service.interface';
import {EstimateRuleScriptBaseEntity} from '../model/estimate-rule-script-base-entity.interface';
import {get} from 'lodash';


export class EstimateRuleScriptBaseDataService<
    T extends EstimateRuleScriptBaseEntity,
    PT extends IEstRuleEntity,
    PU extends EstimateRuleBaseComplete
> extends DataServiceFlatLeaf<T, PT, PU>{

    protected constructor(private parentDataService: EstimateRuleBaseDataService<PT, PU>,
                          option: {itemNam: string}){
        const dataServiceOptions: IDataServiceOptions<T> = {
            apiUrl: '',
            roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
                role: ServiceRole.Leaf,
                itemName: option.itemNam,
                parent: parentDataService,
            }
        };
        super(dataServiceOptions);
    }

    /**
     * to set EstimateRuleScriptEntity to save
     * @param item
     */
    public setItemAsModified(item: T){
        this.setModified(item);
    }

    /**
     * clear data
     * @protected
     */
    protected clear(){
        // service.currentItem = {
        //     ScriptData: ''
        // };
        // service.readonly = 'nocursor';
        // currentScriptItems = [];
        // initialScriptData = '';
    }

    protected mergeInUpdateData(updateData: T){
        // if(updateData.EstRuleScriptToSave){
        //     service.currentItem = updateData.EstRuleScriptToSave[0];
        //     let temp = _.find(currentScriptItems, {PrjEstRuleFk:service.mainItem.Id});
        //     if(temp){
        //         currentScriptItems.pop(temp);
        //     }
        //     currentScriptItems.push(service.currentItem);
        //     initialScriptData = service.currentItem.ScriptData;
        // }
    }

    /**
     * get estimate rule script url
     * @param parentItem
     */
    public getUrl(parentItem: PT): string{
        if(parentItem.IsPrjRule){
            return 'estimate/rule/projectestrulescript/listorcreate';
        }else {
            return 'estimate/rule/script/listorcreate';
        }
    }

    /**
     * get estimate rule script request body
     * @param parentItem
     * @param mainItemIdField
     */
    public getPostRequestBody(parentItem: PT, mainItemIdField: string): object{
        if(parentItem.IsPrjRule){
            return {PrjEstRuleFk: get(parentItem, mainItemIdField)};
        }else {
            return {EstRuleFk: get(parentItem, mainItemIdField)};
        }
    }
}