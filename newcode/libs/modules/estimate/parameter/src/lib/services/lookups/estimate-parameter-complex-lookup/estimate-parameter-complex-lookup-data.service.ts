/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {find,size,map,each,uniqBy, countBy, minBy} from 'lodash';
import { HttpClient } from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {Observable} from 'rxjs';
import {EstimateMainService} from '@libs/estimate/main';
import {EstimateMainContextService} from '@libs/estimate/shared';
import { IBasicsCustomizeEstParameterEntity } from '@libs/basics/interfaces';
import { IEstRuleEntity, IPrjEstRuleParamEntity} from '@libs/estimate/interfaces';
import {IEstLineItemEntity} from '@libs/estimate/assemblies';
import { LookupDataCache } from '@libs/ui/common';
import {IEstimateParameter,IEstParamComplexLookupApiEntity} from '../../../model/estimate-parameter.interface';
import { LookupData } from './estimate-parameter-formatter.service';
import { DataServiceFlatNode} from '@libs/platform/data-access';
import { MainDataDto } from '@libs/basics/shared';

@Injectable({
    providedIn: 'root'
})

/**
 * estimateParamComplexLookupDataService provides all lookup data for estimate Parameters complex lookup
 */

export class EstimateParamComplexLookupDataService extends DataServiceFlatNode<IEstimateParameter, IEstimateParameter[], MainDataDto<IEstimateParameter>,IEstimateParameter> {
    protected readonly estimateMainService = inject(EstimateMainService);
    private readonly estimateMainContextService = inject(EstimateMainContextService);
    private http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    protected readonly lookupData = inject(LookupData);

    //TODO lookupDataLookupDictionary is required or not

    //private lookupData : new LookupData();

    /* let lookupData = new BasicsLookupdataLookupDictionary(true);
    lookupData.isActive= false;*/

    /**
     * @name getEstParamItems
     * @methodOf EstimateParamComplexLookupDataService
     * @description get estimate parameter items
     */
    private getEstParamItems(currentItemName : string,currentEntity:IEstLineItemEntity) { //: Observable<IEstimateParameter[]>{
        const mainItemId = currentEntity.Id;
        const ruleAssignment : IEstRuleEntity[]=[];

        //TODO RuleAssignment
    //     if(currentEntity.RuleAssignment){
    //        ruleAssignment = ruleAssignment.concat(currentEntity.RuleAssignment);
    //    }

        let ruleIds = map(ruleAssignment, 'Id');
        if(currentItemName === 'Boq'){
            ruleIds = map(ruleAssignment, 'PrjEstRuleFk');
        }
        const params = {
            mainItemId: mainItemId,
            currentItemName:currentItemName,
            ruleIdsOfCurrentEntity: ruleIds,
            projectFk:this.estimateMainContextService.getProjectId(),
            estHeaderFk:this.estimateMainContextService.getSelectedEstHeaderId()
        };

        return new Observable(observer => {
            this.http.post<IEstParamComplexLookupApiEntity>(this.configService.webApiBaseUrl + 'estimate/parameter/prjparam/GetLookupParamOfRuleByCondition', params).subscribe((response: IEstParamComplexLookupApiEntity) => {
                let params : IBasicsCustomizeEstParameterEntity[] | IPrjEstRuleParamEntity[] = [];
                if(response){

                   // observer.next(response.data);
                    if(response?.BasicCustomizeEstParams) {
                        each(response?.BasicCustomizeEstParams, function (d :IBasicsCustomizeEstParameterEntity) {
                           // d.Islookup = d.Islookup; // assigning itself is not allowed
                            if(d.ParamvaluetypeFk ===1 ){
                                d.ParameterValue = d.DefaultValue;
                                d.ValueDetail = d.ParameterValue as unknown as string;
                            }else if(d.ParamvaluetypeFk === 2){
                                d.ParameterValue = d.DefaultValue;
                            }else if(d.ParamvaluetypeFk === 3){
                                d.ValueDetail =  d.ValueText;
                                d.ParameterText =  d.ValueText;
                            }
                            d.SourceId = 3002; // GlobalParam:3002
                        });
                       //TODO params.push(response.Data.BasicCustomizeEstParams);
                    }

                    if(response?.PrjEstRuleParamEntities){

                        const estRuleParms : IPrjEstRuleParamEntity[]= [];
                        const paramCodes1 = countBy(response?.PrjEstRuleParamEntities,'Code');

                        each(response?.PrjEstRuleParamEntities, function (d :IPrjEstRuleParamEntity) {
                            if(d.IsLookup){
                                d.ParameterValue = d.DefaultValue;
                            }
                            d.SourceId = 3003; // RuleParameter:3003

                            if(paramCodes1[String(d.Code)] > 1){
                                const params = response?.PrjEstRuleParamEntities.filter(item => item.Code === d.Code);
                                const param = minBy(params,'Id');
                                if(param){
                                    const hasAddedParam = find(estRuleParms,{'Id':param.Id});
                                    if(!hasAddedParam ) {
                                        estRuleParms.push (d);
                                    }
                                }
                            }else{
                                estRuleParms.push(d);
                            }
                        });
                        params= params.concat(estRuleParms);
                    }

                    if(response?.ProjectParamEntities){
                        each(response?.ProjectParamEntities, function (d) {
                            d.SourceId = 3001; // ProjectParam:3001
                        });
                        params = params.concat(response?.ProjectParamEntities);
                    }
                }

                return params;
            });
        });
    }

    /**
     * @name getList
     * @methodOf EstimateParamComplexLookupDataService
     * @description get data list of the estimate ParamCode items
     */
    public override getList() : IEstimateParameter[] {
        if(this.lookupData.estParamItems.length >0){
            return this.lookupData.estParamItems;
        }

        // If the array is empty or doesn't meet the condition, return an empty array
        return [];

        //TODO getEstParamItems() empty parameters method doesn't exist
       /*  else {
           this.getEstParamItems().then(function(data){
                this.lookupData.estParamItems = data;
                return this.lookupData.estParamItems;
            });
        }*/
    }

    /**
     * @name getListAsync
     * @methodOf EstimateParamComplexLookupDataService
     * @description get data list of the estimate ParamCode items
     */
    public getListAsync(mainItemName: string, currentEntity: IEstLineItemEntity,cache: LookupDataCache<IEstimateParameter> ): Observable<IEstimateParameter[]> {
        return new Observable(observer => {
          //  if (cache[mainItemName]) {
              //  observer.next(cache[mainItemName]);
                observer.complete();
            //} else {
                /*this.getEstParamItems(mainItemName,currentEntity).subscribe((res : IEstimateParameter[]) => {
                    const items = res as IEstimateParameter[];
                    this.lookupData.estParamItems = items;
                    //this.updateLookupData(mainItemName,items);
                    observer.next(items);
                    observer.complete();
                });*/
            //}
        });
    }

    /**
     * @name getListAsync
     * @methodOf EstimateParamComplexLookupDataService
     * @description get list of the estimate ParamCode item by Id
     */
    public getItemById(value: string[],mainItemName : string) {
        const items : IEstimateParameter[] = [];
        const list = this.lookupData.get(mainItemName);
        if(list && size(list)>0){
            each(value, function(val){
                const item = find(list, {'Code':val});
                if(item && item.Id){
                    items.push(item);
                }
            });
        }
        return uniqBy(items,'Id');
    }

    /**
     * @name getListAsync
     * @methodOf EstimateParamComplexLookupDataService
     * @description get list of the estimate ParamCode item by Id Async
     */
    public getItemByIdAsync(value : string, mainItemName : string, currentEntity : IEstLineItemEntity) {
        const cacheData = this.lookupData.get(mainItemName);
        if(cacheData && size(cacheData) >0) {
            //TODO $q when
            //return $q.when(this.getItemById(value,mainItemName));
        } else {
            if(!this.lookupData.estParamItemsPromise) {
                //this.lookupData.estParamItemsPromise = this.getListAsync(mainItemName,currentEntity);
            }
            /*return this.lookupData.estParamItemsPromise.then(function(data: IEstimateParameter[]){
                this.lookupData.estParamItemsPromise = null;
              //  this.updateLookupData(mainItemName,data);
                return this.getItemById(value,mainItemName);
            });*/
        }
    }

    /**
     * @name loadLookupData
     * @methodOf EstimateParamComplexLookupDataService
     * @description load est parameter complex lookup data
     */
    public loadLookupData(mainItemName:string, currentEntity: IEstLineItemEntity){
        return this.getEstParamItems(mainItemName,currentEntity);//TODO .then
        /*.then(function(data){
            this.updateLookupData(mainItemName,data);
            return data;
        })*/
    }

    /**
     * @name reLoad
     * @methodOf EstimateParamComplexLookupDataService
     * @description reload est parameter complex lookup
     */
    // General stuff
    public reLoad(){
        //TODO loadLookupData without parameters
        //this.loadLookupData();
    }

   /* /!**
     * @name updateLookupData
     * @methodOf EstimateParamComplexLookupDataService
     * @description update est parameter complex lookup data
     *!/
    private updateLookupData(mainItemName : string,data : IEstimateParameter) {
        if(mainItemName) {
            let idIndex = 1;
            each(data, function (d : IEstimateParameter) {
                d.Id = idIndex;
                idIndex++;
            });
            if (!this.lookupData.has(mainItemName)) {
                this.lookupData.add(mainItemName, data);
            } else {
                this.lookupData.remove(mainItemName);
                this.lookupData.add(mainItemName, data);
            }
        }
    }
*/
    /**
     * @name clearCacheData
     * @methodOf EstimateParamComplexLookupDataService
     * @description clear cache data for est parameter complex lookup
     */
    public clearCacheData(mainItemName: string){
        this.lookupData.remove(mainItemName);
    }
}