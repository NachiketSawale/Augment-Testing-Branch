/*
 * Copyright(c) RIB Software GmbH
*/

import {inject, Injectable} from '@angular/core';
import { each } from 'lodash';
import {GridApiService, PopupService} from '@libs/ui/common';
import {EstimateMainService} from '@libs/estimate/main';
import {PlatformHttpService} from '@libs/platform/common';
import { EstimateParameterFormatterService } from './estimate-parameter-formatter.service';
import { EstimateParameterUpdateService } from '../../estimate-parameter-update.service';
import { EstimateAssembliesService } from '@libs/estimate/assemblies';
import { IEstimateParameter, IEstParamLookupCreationData } from '../../../model/estimate-parameter.interface';
//import { EstimateParameterComplexLookupValidationService } from "../../validations/estimate-parameter-complex-lookup-validation-service";

@Injectable({
    providedIn: 'root'
})

/**
 * EstimateParameterComplexInputGroupLookupService is the data service for estimate parameter item related functionality.
 */
export class EstimateParameterComplexInputGroupLookupService {
    protected readonly estimateMainService = inject(EstimateMainService);
    protected readonly estimateAssembliesService = inject(EstimateAssembliesService);
    protected readonly popupService = inject(PopupService);
    protected readonly estimateParameterFormatterService = inject(EstimateParameterFormatterService);
    protected readonly estimateParamUpdateService = inject(EstimateParameterUpdateService);
    private http = inject(PlatformHttpService);
    private gridApi = inject(GridApiService);
    //protected readonly estimateParameterComplexLookupValidationService = inject(EstimateParameterComplexLookupValidationService);

    public formatterOptions ={};
    public mainEntity:IEstimateParameter = {
        IsRoot: '',
        IsEstHeaderRoot: '',
        EstHeaderFk: 0,
        Code: '',
        Id: 0,
        LineItemType: 0,
        EstAssemblyCatFk: 0,
        PrjProjectFk: 0,
        ProjectFk: 0,
        EstLineItemFk: 0
    };

    /**
     * @name refreshRootParam
     * @methodOf EstimateParameterComplexInputGroupLookupService
     * @description refresh root parameter item
     */
    public refreshRootParam<PT extends object>(entity:IEstimateParameter, param:IEstimateParameter, rootServices:PT){
        if(entity.IsRoot || entity.IsEstHeaderRoot){
            each(rootServices, function(serv){
                if(serv){
                    //TODO injector get service
                    /*let rootService = $injector.get(serv);
                    let affectedRoot = find(rootService.getList(), {IsRoot : true});
                    if(!affectedRoot){
                        affectedRoot = find(rootService.getList(), {IsEstHeaderRoot : true});
                    }
                    if(affectedRoot){
                        affectedRoot.Param = param;
                        rootService.fireItemModified(affectedRoot);
                    }*/
                }
            });
        }
    }

    public gridGuid (){
        return '2191e2cd8adb48dc81b2150ca2cf5c53';
    }

    //TODO should be moved to custom component
   /* public initController (scope, lookupControllerFactory, opt, popupInstance, columns) {
        // fix defect 85022,when delete Item record in Items container,the Line Item record disappear
      //TODO hidePopup,estimateMainParameterValueLookupService,estimateParamDataService
        //let tempHidePopup = this.popupService.hidePopup;
        //this.popupService.hidePopup = function temp(){};

        let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
        estimateMainParameterValueLookupService.clear();

        let displayData = this.estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
        displayData = sortBy(displayData, 'Code');
        let setParameterDataService = $injector.get('estimateParamDataService');
        setParameterDataService.setProjectIdNModule(opt.itemName,null);

        if(displayData.length === 0){
            let paramPromise = this.estimateParameterFormatterService.getItemsByParamEx(scope.entity, opt);
            $q.all([paramPromise]).then(function () {
                displayData = paramPromise.$$state.value;
                setParameterDataService.setParams(displayData);
                setParameterDataService.setParamsCache(cloneDeep(displayData));

                $injector.get('estimateMainDeatailsParamListProcessor').processItems(displayData);
                //calculateParamValueFristLoad(displayData);
                dataService.updateData(displayData);
            });
        }

        setParameterDataService.setParams(displayData);
        setParameterDataService.setParamsCache(cloneDeep(displayData));
        let gridId =  this.gridGuid(); // platformCreateUuid();
        scope.displayItem=displayData;
        let gridOptions = {
            gridId: gridId,
            columns: columns,
            idProperty : 'Id',
            lazyInit: true,
            grouping: true,
            enableDraggableGroupBy: true
        };

        service.dataService = lookupControllerFactory.create({grid: true,dialog: true}, scope, gridOptions);

        let dataService = service.dataService;

        dataService.getList = function getList(){
            return displayData;
        };

        dataService.setformatterOptions = function setformatterOptions(opt){
            this.formatterOptions = opt;
        };

        dataService.getformatterOptions = function getformatterOptions(){
            return this.formatterOptions;
        };

        dataService.setMainEntity = function setMainEntity(entity){
            this.mainEntity = entity;
        };

        dataService.getMainEntity = function getMainEntity(){
            return this.mainEntity;
        };

        dataService.setformatterOptions(opt);
        dataService.setMainEntity(scope.entity);

        function calculateParamValueFristLoad(/!* paramItems *!/){
           each(paramItems, function(patamItem){
                if(patamItem.ValueType === estimateRuleParameterConstant.Text ){
                    //patamItem.ParameterText = patamItem.ValueDetail;
                }else if(patamItem.ValueType === estimateRuleParameterConstant.Decimal2){
                    //patamItem.ParameterValue = parseInt(patamItem.ValueDetail);
                }//else{
                    //$injector.get('estimateRuleCommonService').calculateDetails(patamItem, 'ValueDetail', 'ParameterValue', dataService);
                //}
            });
        }

        $injector.get('estimateMainDeatailsParamListProcessor').processItems(displayData);

        this.checkCodeConflict(displayData,true);

        //calculateParamValueFristLoad(displayData);
        dataService.updateData(displayData);
        // inputGroupService = self;
        dataService.scope = scope;
        dataService.opt = opt;

        // resize the content by interaction
        popupInstance.onResizeStop.register(function () {
            this.gridApi.grids.resize(gridOptions.gridId);
        });

        let updateDisplayData = function updateDisplayData(displayData){
            scope.displayItem = displayData;

            // this make the user's created item whose code validation error
            scope.ngModel = map(displayData, 'Code');
            scope.entity.Param = scope.ngModel;
            $injector.get('estimateMainDeatailsParamListProcessor').processItems(displayData);
            dataService.updateData(displayData);

            // fix defect 93277, The lookup type parameter is not get the values from Assembly parameter.
            // handle Assembly's parameter
            // if it's from Aseembly module, item.AssignedStructureId === null
            // handle Assembly module's parameter changes
            if(this.estimateAssembliesService && this.estimateAssembliesService.isAssemblyParameterActived)
            {
                this.estimateAssembliesService.fireItemModified(scope.entity);
            }
            else
            {
                let itemService = $injector.get(opt.itemServiceName);
                itemService.fireItemModified(scope.entity);
                this.refreshRootParam(scope.entity, scope.ngModel, opt.RootServices);
            }
        };

        dataService.gridRefresh = function () {
            let displayData = this.estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
            updateDisplayData(displayData);
            this.gridApi.grids.invalidate(gridId);
        };

        // refresh lookup displaydata and formatter after create and adding the data
        dataService.addData = function addData(params){
            if(! isArray(params)) {return;}
            each(params, function(param){
                param.MainId = cloneDeep(param.Id);
                param.Version = param.Version === -1 ? 0 : param.Version;

                this.estimateParameterComplexLookupValidationService.validateCode(param, param.Code, 'Code');
            });

            // fix defect 88659, The unnamed parameter still could be saved in Estimate
            // fix defect 93277, The lookup type parameter is not get the values from Assembly parameter.
            this.estimateParamUpdateService.setParamToSave(params, scope.entity, opt.itemServiceName, opt.itemName);

            let displayData = this.estimateParameterFormatterService.getItemsByParam(scope.entity, opt);
            updateDisplayData(displayData);
            this.gridApi.grids.invalidate(gridId);
        };

        dataService.getEstLeadingStructContext = function getEstLeadingStructContext(){
            let item = cloneDeep(scope.entity);
            item = this.estimateParamUpdateService.getLeadingStructureContext(item, scope.entity, opt.itemServiceName, opt.itemName);
            return {item : item, itemName: opt.itemName};
        };

        dataService.getEstLeadingStructureContext = function getEstLeadingStructureContext(){
            let item = {};
            let selectItem = $injector.get(opt.itemServiceName).getSelected();

            if(!selectItem){
                selectItem = cloneDeep(scope.entity);
            }
            if(selectItem) {
                item = this.estimateParamUpdateService.getLeadingStructureContext(item, selectItem, opt.itemServiceName, opt.itemName);
            }
            return {item : item, itemName: opt.itemName};
        };

        dataService.createItem = function(){

            let creationData = {
                itemName: scope.entity.IsRoot ? ['EstHeader'] : [opt.itemName],
                // item : scope.entity,  useless property while creating Parameter
                itemServiceName : opt.itemServiceName
            };

            return this.createLookupItem(creationData).then(function(data){
                let newParam = data[(scope.entity.IsRoot ? 'EstHeader' : opt.itemName)+'Param'];
                newParam.Code = '...';
                newParam.ItemName = opt.itemName;
                dataService.addData([newParam], scope, opt, dataService);
                setParameterDataService.addParam(newParam);
                return newParam;
            });
        };

        function deleteItem(selectedItems){
            let entity = scope.entity;
            let items = selectedItems || dataService.getSelectedItems();

            this.estimateParamUpdateService.setParamToDelete(items, entity, opt.itemServiceName, opt.itemName);

            // remove the Issues which container the deleteItem
            let complexLookupService = this.estimateParameterComplexLookupValidationService;
            each(items, function (item) {
                remove(complexLookupService.getValidationIssues(), function(issue){
                    //TODO
                    //return issue.entity.Code === item.Code;
                });
            });

            if(this.estimateAssembliesService.isAssemblyParameterActived){
                this.estimateAssembliesService.update().then(function () {
                    // service.onCloseOverlayDialog.fire();
                    this.estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
                    let displayData = this.estimateParameterFormatterService.getItemsByParam(scope.entity, opt);

                    // validate
                    let complexLookupService = this.estimateParameterComplexLookupValidationService;
                    each(displayData, function(para){
                        complexLookupService.validateCode(para, para.Code, 'Code');
                    });

                    updateDisplayData(displayData);
                });
            }else if(opt.itemName === 'Boq'){
                //TODO Boq Main Service
               let boqMainService = $injector.get('boqMainService');
                boqMainService.update().then(function () {
                    if(entity && entity.ParamAssignment){

                        let displayData = sortBy(entity.ParamAssignment, 'Code');

                        this.estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);

                        // validate
                        let complexLookupService = this.estimateParameterComplexLookupValidationService;
                        each(displayData, function(para){
                            complexLookupService.validateCode(para, para.Code, 'Code',displayData);
                        });
                        updateDisplayData(displayData);

                    }
                });
            }
            else{
                this.estimateMainService.update().then(function () {
                    // service.onCloseOverlayDialog.fire();
                    this.estimateParameterFormatterService.clearParamNotDeleted(opt.itemName);
                    let displayData = this.estimateParameterFormatterService.getItemsByParam(scope.entity, opt);

                    // validate
                    let complexLookupService = this.estimateParameterComplexLookupValidationService;
                    each(displayData, function(para){
                        complexLookupService.validateCode(para, para.Code, 'Code');
                    });

                    // displayData = _.filter(displayData, function(pa){return pa.Version !== 0;});
                    updateDisplayData(displayData);
                });
            }
        }

        dataService.deleteItem = function(){
            let items = dataService.getSelectedItems();
            let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
            platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: this.gridGuid()}).then(result => {
                if (result.yes || result.ok) {
                    deleteItem(items);
                }
            });
        };

        dataService.getGridId = function () {
            return gridId;
        };

        dataService.UpdateParameter = function UpdateParameter(parameter, colName) {
            onCellChangeAction(parameter, colName);
        };

        scope.toggleFilter = function (active, clearFilter) {
            this.gridApi.filters.showSearch(gridId, active, clearFilter);
        };

        scope.toggleColumnFilter = function (active, clearFilter) {
            this.gridApi.filters.showColumnSearch(gridId, active, clearFilter);
        };

        let searchAllToggle = {
            id: 'gridSearchAll',
            sort: 150,
            caption: 'cloud.common.taskBarSearch',
            type: 'check',
            iconClass: 'tlb-icons ico-search-all',
            fn: function () {
                scope.toggleFilter(this.value);

                if (this.value) {
                    searchColumnToggle.value = false;
                    scope.toggleColumnFilter(false, true);
                }
            },
            disabled: function () {
                return scope.showInfoOverlay;
            }
        };

        let searchColumnToggle = {
            id: 'gridSearchColumn',
            sort: 160,
            caption: 'cloud.common.taskBarColumnFilter',
            type: 'check',
            iconClass: 'tlb-icons ico-search-column',
            fn: function () {
                scope.toggleColumnFilter(this.value);

                if (this.value) {
                    searchAllToggle.value = false;
                    scope.toggleFilter(false, true);
                }
            },
            disabled: function () {
                return scope.showInfoOverlay;
            }
        };

        // Define standard toolbar Icons and their function on the scope
        if (scope.tools) {
            // show the system and role level configuratio
            each(scope.tools.items, function (item) {
                if (item.type === 'dropdown-btn') {
                    item.list.level = 1;
                    overloadItem(item.list.level, function (level) {
                        each(item.list.items, function (subItem) {
                            let tempFn = subItem.fn;
                            subItem.fn = function () {
                                if (item.list.level !== level) {
                                    item.list.level = level;
                                }
                                tempHidePopup(level);
                                tempFn();
                            };
                        });
                    });
                }
            });
            let toolItems = [
                {
                    id: 't1',
                    sort: 0,
                    caption: 'cloud.common.taskBarNewRecord',
                    type: 'item',
                    iconClass: 'tlb-icons ico-rec-new',
                    fn: dataService.createItem,
                    disabled: false
                },
                {
                    id: 't2',
                    sort: 11,
                    caption: 'cloud.common.taskBarDeleteRecord',
                    type: 'item',
                    iconClass: 'tlb-icons ico-rec-delete',
                    fn: dataService.deleteItem,
                    disabled: true
                },
                searchAllToggle,
                searchColumnToggle,
                {
                    id: 't4',
                    sort: 110,
                    caption: 'cloud.common.print',
                    iconClass: 'tlb-icons ico-print-preview',
                    type: 'item',
                    fn: function () {
                        $injector.get('reportingPrintService').printGrid(gridId);
                    }
                }
            ];
            scope.tools.items = toolItems.concat(scope.tools.items);
        }
        function overloadItem(level, func) {
            func(level);
        }
        function onCellChange(e, args) {
            onCellChangeAction(args.item, args.grid.getColumns()[args.cell].field);
        }

        function onCellChangeAction(item, col){
            let referenceParams = {params: []};
            if (col === 'ValueDetail') {
                if(item.ValueType === EstimateRuleParameterConstant.Text){
                    item.ParameterText = item.ValueDetail;
                }else{
                    if(!item.isCalculateByParamReference){
                        estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', dataService, referenceParams);
                    }else{
                        if(dataService &&  isFunction(dataService.getList)) {
                            estimateRuleCommonService.calculateReferenceParams(item, dataService, referenceParams);
                        }
                    }
                }

            }else if(col === 'ParameterText'){
                if(item.ValueType !== EstimateRuleParameterConstant.TextFormula){
                    item.ValueDetail = item.ParameterText;
                }

            }else if (col === 'ParameterValue'){
                item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
                estimateRuleCommonService.calculateDetails(item, col, undefined, dataService, referenceParams);
            }
            else if (item.ValueType === 1 && col === 'Code') {
                let fields = [];
                let itemsCache = setParameterDataService.getParamsCache();
                let paramItem = find(itemsCache, {'Id': item.Id});
                if (paramItem && item.Code === paramItem.Code) {
                    item.IsLookup = paramItem.IsLookup;
                    item.EstRuleParamValueFk = paramItem.EstRuleParamValueFk;
                    item.ParameterValue = paramItem.ParameterValue;
                    item.ValueDetail = paramItem.ValueDetail;

                    fields.push({field: 'ValueDetail', readonly: true});
                    fields.push({field: 'ParameterValue', readonly: true});
                    fields.push({field: 'EstRuleParamValueFk', readonly: false});
                }
                else {
                    item.IsLookup = false;
                    item.EstRuleParamValueFk = null;

                    $injector.get('estimateMainParameterValueLookupService').forceReload().then(function (response) {
                        let data = response.data;
                        let paramValues = filter(data,{'Code': item.Code});
                        if(paramValues && paramValues.length > 0){
                            fields.push({field: 'ValueDetail', readonly: false});
                            fields.push({field: 'ParameterValue', readonly: false});
                            fields.push({field: 'EstRuleParamValueFk', readonly: true});
                            fields.push({field: 'IsLookup', readonly: false});
                        }
                        else {
                            fields.push({field: 'ValueDetail', readonly: false});
                            fields.push({field: 'ParameterValue', readonly: false});
                            fields.push({field: 'EstRuleParamValueFk', readonly: true});
                            fields.push({field: 'IsLookup', readonly: true});
                        }

                        if (fields.length > 0) {
                            $injector.get('platformRuntimeDataService').readonly(item, fields);
                            this.gridApi.items.invalidate(gridId, item);
                        }
                    });
                }

                if (fields.length > 0) {
                    $injector.get('platformRuntimeDataService').readonly(item, fields);
                }
            }
            else if(item.ValueType === 1 && col === 'EstRuleParamValueFk'){
                estimateRuleCommonService.calculateDetails(item, 'ParameterValue', undefined, dataService, referenceParams);
            }

            estimateMainCommonFeaturesService.fieldChanged(col,item);

            this.gridApi.items.invalidate(gridId, item);

            // check it here
            this.checkCodeConflict(scope.entity.ParamAssignment);
            // checkCodeConflict(scope.entity.Param);
            this.checkCodeConflict(scope.displayItem);

            let params = displayData.concat(this.estimateParameterFormatterService.getLookupList(opt.itemName));
            params = uniqBy(params, 'Id');

            // todo : add server call here to get value detail parameters and then update grid here..check
            this.estimateParamUpdateService.markParamAsModified(item, scope.entity, opt.itemServiceName, opt.itemName,params);
            each(referenceParams.params, function(param){
                this.estimateParamUpdateService.markParamAsModified(param, scope.entity, opt.itemServiceName, opt.itemName,params);
            });

            if(col === 'Code'){
                setTimeout(() => {
                    // checkCodeConflict(scope.displayItem);
                    scope.entity.Param = map(scope.displayItem,'Code');
                    this.gridApi.grids.invalidate(gridId);
                });
            }

            if(referenceParams.params && referenceParams.params.length){
                dataService.gridRefresh();
            }
        }

        // set/reset toolbar items readonly
        function updateTools(readOnly) {
            let currentDataService = this.formatterOptions.realDataService ? $injector.get(this.formatterOptions.realDataService): $injector.get(this.formatterOptions.itemServiceName);
            each(scope.tools.items, function (item) {
                if(item.id === 't2') {
                    if (Object.prototype.hasOwnProperty.call(currentDataService, 'getHeaderStatus') && Object.prototype.hasOwnProperty.call(currentDataService, 'hasCreateUpdatePermission')) {
                        if (currentDataService.getHeaderStatus() || !currentDataService.hasCreateUpdatePermission()) {
                            item.disabled = true;
                        } else {
                            item.disabled = !readOnly;
                        }
                    }else{
                        item.disabled = !readOnly;
                    }
                }
            });
            setTimeout(() => {
                scope.tools.update();
            });
        }

        // set initialized dialog buttons view here
        setTimeout(() => {
            scope.tools.update();
        });

        function onChangeGridContent(e, args) {
            updateTools(args && isArray(args.rows) && args.rows.length>0);
            // Get the parameter select item
            if(args && isArray(args.rows) && args.rows.length>0) {
                setParameterDataService.setSelectParam(args.grid.getData().getItem(args.rows[0]));
            }
        }

        this.gridApi.events.register(gridOptions.gridId, 'onCellChange', onCellChange);
        this.gridApi.events.register(gridOptions.gridId, 'onSelectedRowsChanged', onChangeGridContent);

        scope.$on('$destroy', function () {
            this.gridApi.events.unregister(gridOptions.gridId, 'onCellChange', onCellChange);
            this.gridApi.events.unregister(gridOptions.gridId, 'onSelectedRowsChanged', onChangeGridContent);
            setParameterDataService.clear();

            this.poupService.hidePopup = tempHidePopup;
        });

    }
*/

    /**
     * @name createLookupItem
     * @methodOf EstimateParameterComplexInputGroupLookupService
     * @description creates param complex lookup item.
     */
    private createLookupItem(data:IEstParamLookupCreationData) {
        return this.http.post$( 'estimate/parameter/lookup/create', data).subscribe(response => {
         //TODO response data
          //  return response.data;

        });
    }

    /**
     * @name checkCodeConflict
     * @methodOf EstimateParameterComplexInputGroupLookupService
     * @description check param code is conflict is already in use
     */
    private checkCodeConflict(displayData:IEstimateParameter[],isCheckRedIcon:boolean) {
        displayData.forEach((param: IEstimateParameter) => {
            param.IsRoot = this.mainEntity.IsRoot || this.mainEntity.IsEstHeaderRoot;
            //this.estimateParameterComplexLookupValidationService.validateCode(param, param.Code, 'Code',displayData,isCheckRedIcon);
        });
    }
}
