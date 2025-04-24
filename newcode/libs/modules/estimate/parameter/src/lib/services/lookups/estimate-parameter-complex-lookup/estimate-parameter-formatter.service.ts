/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {filter,find,isString,map,isObject, cloneDeep,each,isArray,uniqBy} from 'lodash';
import { HttpClient } from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import { EstimateParameterUpdateService } from '../../estimate-parameter-update.service';
import {IEstimateParameter, IEstimateParameterUpdateData} from '../../../model/estimate-parameter.interface';
import { IEstLineItem2EstRuleEntity } from '@libs/estimate/interfaces';
import {Observable, of, tap} from 'rxjs';
import { IBoqItemEntity, IBoqItemParamEntity } from '@libs/boq/interfaces';

export class LookupData {
    public estParams!: IEstimateParameter[];
    public sourceProjectParam!:[];
    public EstLineItemsLoaded: boolean= false;
    public EstLineItemsParam!:[];
    public PrjEstAssemblyCatLoaded:boolean = false;
    public EstAssemblyCatParam!:[];
    public EstLineItems2EstRules!:IEstLineItem2EstRuleEntity[];
    public estParamPromise!:Observable<IEstimateParameter[]>;
    public EstLineItemsPromise!:Observable<IEstimateParameter[]>;
    public projectFk:number =0;
    public sourceProjectId:number= 0;
    public sourceEstHeaderFk:number= 0;
    public BoqParam!:IBoqItemParamEntity[];
    public sourceProjectParamPromise!:  Observable<IEstimateParameter[]>;
    public estParamItems!:IEstimateParameter[];
    public estParamItemsPromise!: Observable<[]>;
    // TODO: Need to implement the below methods, cretaed this because of the typedoc compilation issues.
    public get(key) {
        return key;
    }
    public remove (key: string) {
        return key;
    }
    [key: string]: boolean | number | IEstimateParameter[] | Observable<IEstimateParameter[]> | IEstLineItem2EstRuleEntity[] | ((key: string) => string | object) | [];
}

export class PostData {
    public validItemName !: string;
    public isSourceLineItem !: boolean;
    public itemName !: string[];
    public itemServiceName !: string;
    public filterKey !: string;
    public id !: number;
    public headerKey !: string;
    public boqHeaderFk !: number;
    public currentItemName !: string;
    public estHeaderFk !: number;
    public projectFk !: number;
    public sourceEstHeaderFk !: number;
    public sourceProjectId !: number;
    public isPrjAssembly !: boolean;
    [key: string]: string | boolean | number | string[];
}

@Injectable({
    providedIn: 'root'
})

/**
 * EstimateParameterFormatterService provides list of parameter formatter data for estimate main filter structures and line item
 */

export class EstimateParameterFormatterService {
    private http = inject(HttpClient);
    private readonly configService = inject(PlatformConfigurationService);
    private estimateParamUpdateService = inject(EstimateParameterUpdateService);

    private itemName : string[] = [];
    private lookupData !: LookupData;
    public postData !: PostData;

    private backupLookupData = new LookupData();
    private isRestoreLookupData = false;

    /**
     * @name isCss
     * @methodOf EstimateParameterFormatterService
     * @description check isCss
     */
    private isCss() {
        return true;
    }

     /**
     * @name refresh
     * @methodOf EstimateParameterFormatterService
     * @description clears all local variable used in this service
     */
    private refresh(isPrjAssembly: boolean) {
        this.lookupData.estParams = [];
        this.lookupData.sourceProjectParam = [];

        if (isPrjAssembly){
            this.lookupData.EstLineItemsLoaded = false;
            this.lookupData.EstLineItemsParam = [];
            this.lookupData.PrjEstAssemblyCatLoaded = false;
            this.lookupData.EstAssemblyCatParam = [];
        } else {
            this.lookupData = new LookupData();
            this.postData = new PostData();
        }
    }

    /**
     * @name refreshParams
     * @methodOf EstimateParameterFormatterService
     * @description clears all local variables
     */
    private refreshParams() {
        this.lookupData.estParams = [];
        this.lookupData.EstLineItems2EstRules = [];
        this.lookupData.EstLineItemsLoaded = false;
        this.lookupData.estParamPromise =new Observable<IEstimateParameter[]>;
        this.lookupData.EstLineItemsParam = [];
        this.lookupData.EstLineItemsPromise = new Observable<IEstimateParameter[]>;
    }

    /**
     * @name setSelectedProject
     * @methodOf EstimateParameterFormatterService
     * @description sets Selected Project
     */
    public setSelectedProject(prjId: number) {
        this.lookupData.projectFk = this.postData.projectFk = prjId;
    }

    /**
     * @name setSourceSelectedProject
     * @methodOf EstimateParameterFormatterService
     * @description sets Source Selected Project
     */
    public setSourceSelectedProject(prjId:number,headerId:number) {
        if(this.lookupData.sourceProjectId === prjId && this.postData.sourceEstHeaderFk !== headerId){
            this.postData.sourceEstHeaderFk = headerId;
            const sourceProjectParam = cloneDeep(this.lookupData.sourceProjectParam);
            this.lookupData.sourceProjectParam = sourceProjectParam;
        } else {
            this.lookupData.sourceProjectParam = [];
            this.lookupData.sourceProjectId = this.postData.sourceProjectId = prjId;
        }
    }

    /**
     * @name setEstLineItems2EstRules
     * @methodOf EstimateParameterFormatterService
     * @description set Est LineItems 2 EstRules
     */
   public setEstLineItems2EstRules(paramList: IEstimateParameter[]) {
        if (this.lookupData.EstLineItems2EstRules) {
           this.lookupData.EstLineItems2EstRules = paramList;
        }
    }

    /**
     * @name setSelectedEstHeaderNProject
     * @methodOf EstimateParameterFormatterService
     * @description  set selected Estimate Header and ProjectId for selected Item
     */
    public setSelectedEstHeaderNProject(headerId : number) {
        if (this.postData.estHeaderFk !== headerId) {
            this.postData.estHeaderFk = headerId;
            const estParams = cloneDeep(this.lookupData.estParams);
            this.lookupData = new LookupData();
            this.lookupData.estParams = estParams;
        }
    }

    /**
     * @name getCompleteLookup
     * @methodOf EstimateParameterFormatterService
     * @description get complete lookup
     */
    private getCompleteLookup() : Observable<IEstimateParameter[]> {
        return this.http.post<IEstimateParameter[]>(`${this.configService.webApiBaseUrl}'basics/customize/estparameter/list'`, null);
    }

   /**
     * @name mergeOptions
     * @methodOf EstimateParameterFormatterService
     * @description merge Options
    */
    private mergeOptions(options : PostData, item : IEstimateParameter) {
        options.validItemName = item.IsRoot || item.IsEstHeaderRoot ? 'EstHeader' : options.isSourceLineItem ? 'SourceLineItems' : options.itemName[0];

        const filteredName = this.itemName.find((item) => item === options.validItemName);
        if(filteredName){
            this.itemName.push(options.validItemName);
        }

        this.postData.id = item.IsRoot || item.IsEstHeaderRoot ? item.EstHeaderFk as number :item.Id as number;
        this.postData.currentItemName = options.validItemName;
        this.postData.headerKey = '';

        if (item.IsRoot || item.IsEstHeaderRoot ) {
            this.postData.filterKey = 'EstHeaderFk';
            this.postData.estHeaderFk = this.postData.id;
        } else {
            // share the code with construction system
            switch (options.itemServiceName) {
                case'estimateMainRootService':
                    this.postData.filterKey = 'EstHeaderFk';
                    break;
                case'estimateMainService':
                case'estimateMainCopySourceLineItemLookupService':
                    this.postData.filterKey = 'EstLineItemFk';
                    this.postData.headerKey = 'EstHeaderFk';
                    this.postData.estHeaderFk = item.EstHeaderFk as number;
                    if(options.itemServiceName === 'estimateMainCopySourceLineItemLookupService'){
                        this.postData.sourceEstHeaderFk = item.EstHeaderFk as number;
                    }else{
                        this.postData.estHeaderFk = item.EstHeaderFk as number;
                    }
                    break;
                case'constructionSystemMainBoqService':
                case'estimateMainBoqService':
                    this.postData.boqHeaderFk = -1;
                    if(item.BoqHeaderFk){
                        this.postData.boqHeaderFk = item.BoqHeaderFk;
                    }//TODO else if(item.BoqItems && item.BoqItems.length){
                      //  this.postData.boqHeaderFk = item.BoqItems[0].BoqHeaderFk;
                  //  }
                    this.postData.estHeaderFk = item.EstHeaderFk? item.EstHeaderFk: this.postData.estHeaderFk;
                    this.postData.filterKey = 'BoqItemFk';
                    this.postData.headerKey = 'BoqHeaderFk';
                    break;
                case'boqMainService':
                    this.postData.boqHeaderFk = item.BoqHeaderFk as number;
                    this.postData.filterKey = 'BoqItemFk';
                    this.postData.headerKey = 'BoqHeaderFk';
                    break;
                case'estimateMainActivityService':
                    this.postData.filterKey = 'PsdActivityFk';
                    break;
                case'estimateMainAssembliesCategoryService':
                    this.postData.filterKey = 'EstAssemblyCatFk';
                    //Todo: once service ready inject here
                   // this.postData.estHeaderFk = item.EstHeaderFk ? item.EstHeaderFk : $injector.get('estimateMainService').getSelectedEstHeaderId();
                    break;
                case'projectAssemblyStructureService':
                    this.postData.filterKey = 'EstAssemblyCatFk';
                    this.postData.isPrjAssembly = true;
                    this.postData.projectFk = item.PrjProjectFk as number;
                    this.postData.estHeaderFk = item.EstHeaderFk as number;

                    break;
                case 'projectAssemblyMainService':
                    this.postData.isPrjAssembly = true;
                    this.postData.filterKey = 'EstLineItemFk';
                    this.postData.headerKey = 'EstHeaderFk';
                    this.postData.estHeaderFk = item.EstHeaderFk as number;
                    break;
                case'constructionSystemMainLocationService':
                case'estimateMainLocationService':
                    this.postData.filterKey = 'PrjLocationFk';
                    //Todo: once service ready inject here
                    //this.postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
                    break;
                case'constructionSystemMainControllingService':
                case'estimateMainControllingService':
                    this.postData.filterKey = 'MdcControllingUnitFk';
                    //Todo: once service ready inject here
                    //this.postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
                    break;
                case'estimateMainProcurementStructureService':
                    this.postData.filterKey = 'PrcStructureFk';
                    //Todo: once service ready inject here
                   // this.postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
                    break;
                case 'costGroupStructureDataServiceFactory':
                    this.postData.filterKey = 'CostGroupFk';
                    //Todo: once service ready inject here
                    //this.postData.estHeaderFk = $injector.get('estimateMainService').getSelectedEstHeaderId();
                    break;
            }
        }

        return this.postData;
    }

   /**
     * @name getParamsById
     * @methodOf EstimateParameterFormatterService
     * @description get Params By Id
    */
    private getParamsById(opt: PostData) :IEstimateParameter[] {
       //TODO later it will be used
       // const key = opt.filterKey;
        const value = opt.id,
            headerValue = opt.boqHeaderFk,
            currentItemName = opt.currentItemName;

        let headerKey :  keyof IEstimateParameter = 'BoqHeaderFk'; //TODO Need to check how to handle here, run time property access
        if( opt.headerKey === 'BoqHeaderFk'){
            headerKey= opt.headerKey;
        }
        let itemParams = ((this.lookupData[currentItemName + 'Param']) as IEstimateParameter[])
                                        .filter(e=>e.Id === value && e.Action !== 'ToDelete');
                                        //TODO above Need to check how to handle here, run time property access

        if (headerKey) {
            itemParams = filter(itemParams, function (item) {
                //TODO Need to check how to handle here, run time property access
                //return item[headerKey] === headerValue;
                return item.BoqHeaderFk  === headerValue;
            });
        }
        return itemParams;
    }

   /**
     * @name getFilteredParams
     * @methodOf EstimateParameterFormatterService
     * @description get list of filtered Params including saved and deleted items
    */
    private getFilteredParams(list :IEstimateParameter[], item : IEstimateParameter) {
        list = list ? list : [];
        const itemId = item.IsRoot || item.IsEstHeaderRoot ? item.EstHeaderFk : item.Id;
        const paramToSave = filter(this.estimateParamUpdateService.getParamToSave(), (prm) => {
            if(item.IsRoot || item.IsEstHeaderRoot) {
                // filter out parameters of lineItem
                //TODO need to check filterKey is string type, now using id parameter
                // prm[this.postData.id] === itemId &&
                return  prm.ItemName === 'EstHeader';
            } else {
                return prm.Id === itemId;
            }
        });
        list = list.concat(paramToSave);
        const delItems : IEstimateParameter[] = filter(this.estimateParamUpdateService.getParamToDelete(), (prm) => {
            //TODO need to check filterKey is string type, now using id parameter
            return prm.Id === itemId;
        });
        if (delItems.length) {
            list = filter(list, (li) => {
                return delItems.indexOf(find(delItems, { MainId: li.MainId })!) === -1;
            });
        }
        return uniqBy(list, 'MainId');
    }

   /**
     * @name getItemById
     * @methodOf EstimateParameterFormatterService
     * @description get list of the estimate Parameter Code by Id
    */
    private getItemById(value :  string | IEstimateParameter) {
        let iconItem = {};
        if (isString(value) && value === 'default') {
            iconItem = {css: true, res: 'tlb-icons ico-menu', text: ''};
        } else if (value && (value as IEstimateParameter).Param) {
            let conflict = false;

            let params : string[] = ((value as IEstimateParameter).Param) as string[];
            if (params.sort) {
                params = params.sort();
            }

            for (let i = 0; i < params.length; i++) {
                const code1 = params[i] ? params[i].toLowerCase() : null;
                const code2 = params[i + 1] ? params[i + 1].toLowerCase() : null;
                if ((code1 === code2 && !!params[i + 1]) || params[i] === '...' || params[i] === '') {
                    conflict = true;
                    break;
                }
            }
            if (conflict) {
                iconItem = {css: true, res: 'control-icons  ico-parameter-warning', text: ''};
            } else {
                iconItem = {css: true, res: 'control-icons ico-parameter', text: ''};
            }
        }
        return iconItem;
    }

   /**
     * @name getItemParamById
     * @methodOf EstimateParameterFormatterService
     * @description get list of the estimate Parameter Code by Id
    */
    public getItemParamById(value: string[], options : PostData, item : IEstimateParameter) {
        this.mergeOptions(options, item);
        let paramCodes = this.getParamsById(this.postData);
        const filterId = this.postData.id = item.IsRoot || item.IsEstHeaderRoot ? item.EstHeaderFk as number :item.Id;
        const paramToSave = filter(this.estimateParamUpdateService.getParamToSave(), (prm : IEstimateParameter) => {
           let prmCode:string ='';
           //TODO need to check how to handle prm[this.postData.filterKey]
            if (prm.Id === filterId) {
                prmCode = prm.Code;
            }
            return prmCode;
        });

        paramToSave.forEach((pItem) => {
            //TODO need to check
           // if (paramCodes.indexOf(pItem) === -1) {
             //   paramCodes = paramCodes.concat(pItem);
            //}
        });

        const delItems = filter(this.estimateParamUpdateService.getParamToDelete(), (prm : IEstimateParameter) => {
            //TODO need to check how to handle prm[this.postData.filterKey]
            return prm.Id === filterId;
        });
        const paramToDelete = map(delItems, 'Code');
        if (paramToDelete.length) {
            paramCodes = filter(paramCodes, function (li : IEstimateParameter) {
                return paramToDelete.indexOf(li.Code) === -1;
            });
        }
        //TODO need to check how to handle this
        item.Param = map(paramCodes, 'Code');
        value = item.Param;
        return item.Param;
    }

   /**
     * @name getItemsByParam
     * @methodOf EstimateParameterFormatterService
     * @description get list of the estimate Param items by code(for immediate window)
    */
    public getItemsByParam(this:EstimateParameterFormatterService, mainItem: IEstimateParameter, opt: PostData) {
        let items :IEstimateParameter[] = [];
        this.mergeOptions(opt, mainItem);
        let list = this.lookupData[this.postData.currentItemName + 'Param'] as IEstimateParameter[];

        const itemId = mainItem.IsRoot || mainItem.IsEstHeaderRoot  ? mainItem.EstHeaderFk : mainItem.Id;
        let filteredItems = filter(list,  (item) => {
            //TODO need to check how to handle prm[this.postData.filterKey]
            return item.Id === itemId;
        });
        if (this.postData.headerKey) {
            filteredItems = filter(filteredItems,  (item) => {
                //TODO need to check host handle this.postData.headerKey dynamic access of property
                //return item[this.postData.headerKey] === mainItem[this.postData.headerKey];
                return item.EstHeaderFk === mainItem.Id;
            });
        }
        list = this.getFilteredParams(filteredItems, mainItem);

        // here I think it make problem, the new item with the same code will be filtered
       //TODO need to map string[] array
        // mainItem.Param = map(list, 'Code');

        items = list;
        let cnt = 0;
        const newItemsIndex = map(filter(items, {Version: 0}), 'Id');
        items.forEach(item=>{
            cnt++;
            if (item && item.Version !== 0) {
                while (newItemsIndex.length && newItemsIndex.indexOf(cnt) !== -1) {
                    cnt++;
                }
                item.Id = cnt;
            }
        });
        return uniqBy(items,'Id');
    }

   /**
     * @name getItemsByParamEx
     * @methodOf EstimateParameterFormatterService
     * @description get Item sBy Param Ex
    */
    public getItemsByParamEx(mainItem: IEstimateParameter, opt : PostData) {
        const validItemName = mainItem.IsRoot || mainItem.IsEstHeaderRoot ? 'EstHeader' : opt.itemName;
        const data = {
            currentItemName: validItemName,
            estHeaderFk: this.postData.estHeaderFk,
            filterKey: this.postData.filterKey,
            headerKey: this.postData.headerKey,
            id: mainItem.Id,
            itemName: [validItemName]
        };

        return this.http.post<IEstimateParameter[]>(`${this.configService.webApiBaseUrl}'estimate/parameter/lookup/list'`, data).subscribe(response => {
            //Todo check how to get response.data
            this.processData(response);
            //Todo check how to get response.data
            //this.lookupData[data.currentItemName + 'Param'] = response.data[data.currentItemName + 'Param'];
            this.getItemsByParam(mainItem, opt);
            this.backupLookupData = this.lookupData;
            //TODO: needs to check here
            //return $q.when(displayData);
        });
    }

   /**
     * @name getLookupList
     * @methodOf EstimateParameterFormatterService
     * @description get list of Parameters Lookup Items
    */
    public getLookupList (itemName: string) : IEstimateParameter[] | null {
        if (itemName) {
            return (this.lookupData[itemName + 'Param']) as IEstimateParameter[];
        }
        return null;
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    public processData(data:IEstimateParameter[] | IBoqItemParamEntity[]) {
        if (!data) {
            return;
        }

        const processItems = function (items :IEstimateParameter[]  | IBoqItemParamEntity[]) {
            items.forEach(item=>{
                if (!isObject(item)) {
                    return;
                }
                //TODO item.MainId = item.Id;
            });
        };
        if (isArray(data)) {
            processItems(data);
        } else if (isObject(data)) {
            each(data, function (items :IEstimateParameter[]  | IBoqItemParamEntity[], key : string) {
                if (key !== 'itemName') {
                    processItems(items);
                }
            });
        }
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
   public removeLineItemParam(validItemName: string, key:string, value:number) {
        this.lookupData[validItemName + 'Param'] = filter((this.lookupData[validItemName + 'Param']) as IEstimateParameter[],  (item) => {
            return item.Id !== value;
        });
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
   public addLineItemParam(this:EstimateParameterFormatterService, validItemName: string, key:string, paramList:IEstimateParameter[]) {
        if (isArray(paramList)) {
            each(paramList,  (param) => {
                const paramFind = find((this.lookupData[validItemName + 'Param']) as IEstimateParameter[],  (item) => {
                    return item.Id === param.Id;
                });
                if (!paramFind) {
                    ((this.lookupData[validItemName + 'Param']) as IEstimateParameter[]).push(param);
                }
            });
        }
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // load Parameter Data as per item
   private loadItemData(name:string) : Observable<IEstimateParameter[]> {
        if (name) {
            const data = cloneDeep(this.postData);
            data.itemName = [name];

            if(name === 'SourceLineItems'){
                data.projectFk = this.postData.sourceProjectId;
                data.estHeaderFk = this.postData.sourceEstHeaderFk;
            }

            // Return the observable and handle side effects in the subscribe block externally
            return this.http.post<IEstimateParameter[]>(`${this.configService.webApiBaseUrl}estimate/parameter/lookup/list`, data).pipe(
                tap((response) => {
                    this.processData(response);
                    this.lookupData[name + 'Param'] = response;
                    this.backupLookupData = this.lookupData;
                })
            );
        }
       return of([]); // Return an observable of an empty array if `name` is falsy
    }

    // get param from list of the Parameters
   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    private getParam(params : string[]) {
        const tempparam = {params: params};
        return params && params.length ? tempparam : 'default';
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // get list of the Parameters as per item async
    private getListAsync(item : IEstimateParameter, options: PostData) {
        this.mergeOptions(options, item);
        const value : string[] = item.Param as string[];
        if ((this.lookupData[options.validItemName + 'Param'] && ((this.lookupData[options.validItemName + 'Param']) as IEstimateParameter[]).length) || this.lookupData[options.validItemName + 'Loaded']) {
            const params = this.getItemParamById(value, options, item);
            return this.getParam(params);
        } else {
            if (!(this.lookupData[options.validItemName + 'Promise'])){
                this.lookupData[options.validItemName + 'Promise'] = this.loadItemData(options.validItemName) as Observable<IEstimateParameter[]>;
            }
            return ((this.lookupData[options.validItemName + 'Promise']) as Observable<IEstimateParameter[]>).subscribe( (data : IEstimateParameter[]) => {
                this.lookupData[options.validItemName + 'Promise'] =new Observable<IEstimateParameter[]>();
                this.lookupData[options.validItemName + 'Loaded'] = true;
                //Todo need to check how to handle this
                //angular.extend(this.lookupData, data);
                const params = this.getItemParamById(value, options, item);
                return this.getParam(params);
            });
        }
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // get list of the estimate Parameter Code item by Id Async
    public getItemByParamAsync(item: IEstimateParameter, options : PostData) {
        if (!item) {
            return;
        }
        if(!item.Param){
            item.Param = [];
        }
        if(options.isSourceLineItem){
            // use lookupData.sourceProjectRules if list is already loaded otherwise load from server
            if(this.lookupData.sourceProjectParam && this.lookupData.sourceProjectParam.length){
                //Todo need to check how to handle this
                //return $q.when(this.getListAsync(item, options));
            } else {
                if(!this.lookupData.sourceProjectParamPromise) {
                    this.lookupData.sourceProjectParamPromise = this.getCompleteLookup();
                }
                //Todo need to check how to handle this
              /*  return this.lookupData.sourceProjectParamPromise(function (response) {
                    this.lookupData.sourceProjectParamPromise = null;
                    each(response.data, function (pitem) {
                        pitem.ValueType = pitem.ParamvaluetypeFk;
                    });
                    this.lookupData.sourceProjectParam = response.data;
                    //Todo need to check how to handle this
                    //return $q.when(getListAsync(item, options));
                });*/
            }
        } else {
            // load est param
            if (this.lookupData.estParams && this.lookupData.estParams.length) {
                //Todo need to check how to handle this
               // return $q.when(this.getListAsync(item, options));
            } else {
                if (!this.lookupData.estParamPromise) {
                    this.lookupData.estParamPromise = this.getCompleteLookup();
                }
                return this.lookupData.estParamPromise?.subscribe( (response :  IEstimateParameter[]) => {
                    this.lookupData.estParamPromise = new Observable<IEstimateParameter[]>();
                    each(response,  (pitem) => {
                        //TODO need to check  ValueType doesn't exist on IBasicsCustomizeEstParameterEntity
                        // pitem.ValueType = pitem.ParamvaluetypeFk;
                    });
                    this.lookupData.estParams = response;
                    //Todo need to check how to handle this
                    //return $q.when(getListAsync(item, options));
                });
            }
        }
       return;
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    public handleUpdateDone (data: IEstimateParameterUpdateData[]) {
        const itemNames = ['EstBoq', 'EstActivity', 'EstPrjLocation', 'EstCtu', 'EstPrcStructure', 'EstAssemblyCat', 'EstCostGrp', 'EstLineItems', 'EstHeader'];
        each(itemNames,(name) =>{
            // Assuming 'name' is a value from the ParamKey union
            //TODO Need to check how to handle here, run time property access
            //if(data[name + 'ParamToSave'] || data[name + 'ParamToDelete']){
                this.handleUpdateDoneInternal(data, name);
            //}
        });
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // merge item after update
    private handleUpdateDoneInternal(data : IEstimateParameterUpdateData[]  , name:string) {
        const filterItems = (filter(data, function (value :IEstimateParameterUpdateData, key :string) {
            return key === name + 'ParamToSave';
        })) as IEstimateParameterUpdateData[];

        const filteredParamItems = filterItems.map(e=>e.EstLineItemsParamToSave);

        if (this.isRestoreLookupData) {
            this.lookupData = this.backupLookupData;
        }

        let list: IEstimateParameter[] = this.lookupData[name + 'Param'] as IEstimateParameter[];

        if (filteredParamItems && filteredParamItems[0]) {
            this.processData(filteredParamItems[0]);
        }

        if (isArray(list)) {
            filteredParamItems[0].forEach(item=>{
                if (item) {
                    let oldItem = find(list, {MainId: item.Id});

                    if (name === 'Boq') { // this case just for project boq.dont delete
                        oldItem = find(list, {
                            BoqHeaderFk: item.BoqHeaderFk,
                            BoqItemFk: item.BoqItemFk,
                            Code: item.Code,
                            MainId: item.MainId
                        });
                    }
                    if (oldItem) {
                        //Todo: need to check how to handle this
                        //angular.extend(list[list.indexOf(oldItem)], item);
                    } else {
                        list.push(item);
                    }
                }
            });
        } else {
            list = filteredParamItems[0];
        }

        const deletedItems = (filter(data, function (value : IEstimateParameterUpdateData,key : string) {
            return key === name + 'ParamToDelete';
        })) as IEstimateParameterUpdateData[];

       const deletedParamItems = deletedItems.map(e=>e.EstLineItemsParamToSave);

        const result = filter(list, function (li: IEstimateParameter) {
            let item = find(deletedParamItems[0], {Id: li.MainId});

            if (name === 'Boq') {  // this case just for project boq.dont delete
                item = find(deletedParamItems[0], {
                    BoqHeaderFk: li.BoqHeaderFk,
                    BoqItemFk: li.BoqItemFk,
                    Code: li.Code,
                    Id: li.MainId
                });
            }

            if (!item) {
                return li;
            }
            return null;
        });

        this.lookupData[name + 'Param']  = result as IEstimateParameter[];
        //TODO need to check how to handle this
       // this.lookupData[name + 'ParamNotDeleted'] = data.ParamsNotDeleted && data.ParamsNotDeleted.length ? data.ParamsNotDeleted : [];
        return this.lookupData[name + 'Param'];
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    public handleUpdateDoneEx(data:IEstimateParameterUpdateData[], currentItemName:string) {
        const name = this.postData.currentItemName;
        this.postData.currentItemName = currentItemName;
        this.handleUpdateDone(data);
        this.postData.currentItemName = name;
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // merge parameters
    public mergeParams(result:IEstimateParameter[]) {
        this.processData(result);
        //Todo need to check how to handle this
        //angular.extend(this.lookupData, result);
    }

    /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // load lookup data
    public loadLookupItemData(data : PostData) {
        if (!data || !data.itemName) {
            //Todo: need to check how to handle this
            //return $q.when([]);
        }
        data.itemName = isArray(data.itemName) ? data.itemName : [data.itemName];
        return this.http.post(`${this.configService.webApiBaseUrl}'estimate/parameter/lookup/list'`, data).subscribe(response => {
            //Todo need to check how to handle this
            //this.lookupData[data.itemName + 'Param'] = response.data;
            this.backupLookupData = this.lookupData;
            //Todo need to check how to handle this
            //this.processData(response.data);
            //Todo need to check how to handle this
            //angular.extend(this.lookupData, data);
            //Todo need to check how to handle this
           // return response.data;
        });
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // clear lookup data
   public clear() {
        this.backupLookupData = this.lookupData;
        //Todo need to check make object empty
        //this.lookupData = {};
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    public getParamNotDeleted (itemName:string) {
        return this.lookupData[itemName + 'ParamNotDeleted'];
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    public clearParamNotDeleted(itemName:string) {
        this. lookupData[itemName + 'ParamNotDeleted'] = [];
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    public isRestoreParam(isRestore:boolean) {
        this.isRestoreLookupData = isRestore;
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    private setParamAssignment4BoqItems(boqItems : IBoqItemEntity[], boqParamItems : IBoqItemParamEntity[]) {
        boqItems.forEach(boqItem=>{
            boqItem.BoqItemParamEntities = filter(boqParamItems, function (boqParamItem) {
                return boqParamItem.BoqHeaderFk === boqItem.BoqHeaderFk && boqParamItem.BoqItemFk === boqItem.Id;
            });

            const childBoqItems = boqItem.BoqItems;
            if (childBoqItems && childBoqItems.length) {
                this.setParamAssignment4BoqItems(childBoqItems, boqParamItems);
            }
        });
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
    // after drag/drop wic boq to proejct boq,need update the UI to show parameters
    public buildParamAssignment (boqTreeItems : IBoqItemEntity[], boqParamItems : IBoqItemParamEntity[]) {
        if (boqParamItems && boqParamItems.length && boqTreeItems && boqTreeItems.length) {
            this.processData(boqParamItems);
            this.lookupData.BoqParam = boqParamItems;
            // as the boqTreeItems has a hirachical structure, so a recursion function here to handler it
            this.setParamAssignment4BoqItems(boqTreeItems, boqParamItems);
        }
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
   public getEstParams() {
        return this.lookupData.estParams;
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
   public getItemByIdNew (item : IEstimateParameter) {
        if (!item) {
            return;
        }

        //Todo: once service is ready inject here
        //return _.map(boqRuleComplexLookupService.getItemById(item.RuleAssignment), 'Icon');
    }

   /**
     * @name processData
     * @methodOf EstimateParameterFormatterService
     * @description process Data
    */
   public updateCacheParam(currentItemName:string,prjRuleIds: number[],currentEntityId:number) {
       const itemParams :IEstimateParameter[] = [];
       const paramKey = currentItemName + 'Param';

       const allParams: IEstimateParameter[] = ((<LookupData>this.lookupData)[paramKey]) as IEstimateParameter[];

        switch (currentItemName) {
            case 'EstBoq':
                each(allParams, function (item: IEstimateParameter) {
                    if (prjRuleIds.indexOf(item.ProjectEstRuleFk as number) < 0) {
                        itemParams.push(item);
                    } else if (prjRuleIds.indexOf(item.ProjectEstRuleFk as number) >= 0 && item.BoqItemFk !== currentEntityId) {
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstActivity':
                each(allParams, function (item: IEstimateParameter) {
                    if (prjRuleIds.indexOf(item.ProjectEstRuleFk as number) < 0) {
                        itemParams.push(item);
                    } else if (prjRuleIds.indexOf(item.ProjectEstRuleFk as number) >= 0 && item.PsdActivityFk !== currentEntityId) {
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstPrjLocation':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.PrjLocationFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstCtu':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.MdcControllingUnitFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstPrcStructure':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.PrcStructureFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstAssemblyCat':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.EstAssemblyCatFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
            case  'EstCostGrp':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.CostGroupFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstLineItems':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.EstLineItemFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
            case 'EstHeader':
                each(allParams, function(item : IEstimateParameter){
                    if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)<0){
                        itemParams.push(item);
                    }else if(prjRuleIds.indexOf(item.ProjectEstRuleFk as number)>=0 && item.EstHeaderFk !== currentEntityId){
                        itemParams.push(item);
                    }
                });
                break;
        }

        this.lookupData[currentItemName + 'Param']  = itemParams;
    }
}
