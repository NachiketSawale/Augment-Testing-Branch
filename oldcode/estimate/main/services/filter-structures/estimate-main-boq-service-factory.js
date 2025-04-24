/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ , Platform */

(function () {
	'use strict';
    let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

    /**
	 * @ngdoc service
	 * @name estimateMainBoqServiceFactory
	 * @function
	 *
	 * @description
	 * estimateMainBoqServiceFactory is the data service for all boq data functions.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection

	estimateMainModule.factory('lookupZeroToNullProcessor', [function () {
		let service = {};
        service.processItem = function processItem(item) {
            if (angular.isDefined(item.BasUomFk)) {
                item.BasUomFk = (item.BasUomFk === 0) ? null : item.BasUomFk;
            }
            if(angular.isDefined(item.BoqItemFlagFk)){
                item.BoqItemFlagFk = (item.BoqItemFlagFk === 0) ? null : item.BoqItemFlagFk;
            }
        };
        return service;
    }]);

    estimateMainModule.factory('estimateMainBoqServiceFactory',  ['$injector','$timeout', 'PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'boqMainImageProcessor', 'lookupZeroToNullProcessor',
		'estimateMainCreationService', 'estimateMainFilterService', 'estimateMainService', 'estimateMainFilterCommon', 'estMainRuleParamIconProcess','boqMainCommonService','boqMainItemTypes','boqMainItemTypes2','platformGridAPI','cloudCommonGridService', 'basicsCommonDynamicConfigurationServiceFactory','estimateMainBoqProcessService',
		function ($injector, $timeout,PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension, boqMainImageProcessor, lookupZeroToNullProcessor,estimateMainCreationService, estimateMainFilterService, estimateMainService, estimateMainFilterCommon, estMainRuleParamIconProcess, boqMainCommonService,boqMainItemTypes, boqMainItemTypes2,platformGridAPI,cloudCommonGridService, basicsCommonDynamicConfigurationServiceFactory,estimateMainBoqProcessService){
                let factoryService = {};
                factoryService.createEstimateMainBoqService = function createEstimateMainBoqService(){

                    let projectId = estimateMainService.getSelectedProjectId(),
                    isReadData = false, // already send xhr to service
                     service = {},
                    serviceContainer = {},
                    lineItemFk,
                    isEdit= false,
                    lastSelectedFilterKey = null,
                    filterToolIsInitialized = false,
                    tabChanged = false;

	                let canCreateBoq = function() {
		                let selectedBoqItem = service.getSelected();
		                return selectedBoqItem && selectedBoqItem.Id !== -1 && getIsBoqDrivenFlag();
	                };

                    let canDeleteBoq = function canDeleteBoq() {
	                    let selectedBoqs = service.getSelectedEntities();
	                    if (selectedBoqs.length !== 1) {
		                    return false;
	                    }
	                    let isPositionType = boqMainCommonService.isPositionType(selectedBoqs[0].BoqLineTypeFk);
	                    return isPositionType && getIsBoqDrivenFlag();
                    };

	                let createBoqFunction = function createBoqFunction(data, creationData, onCreateSucceeded){
		                function onBoqItemCreated(newBoqItem) {
			                updateBoqItems(newBoqItem);
			                if (onCreateSucceeded) {
									 return onCreateSucceeded(newBoqItem, data, creationData);
			                }
			                return newBoqItem;
		                }
		                let rootBoqItem = service.getCurrentRootItem();
		                let selectedBoqItem = service.getSelected();
		                let projectId = service.getSelectedProjectId();
		                updateBoqItems(rootBoqItem);
		                if (selectedBoqItem.Id > 0 && rootBoqItem && Object.keys(rootBoqItem).length > 0) {
			                return $injector.get('boqMainBoqDrivenEstimateService').createBoqPositionAsync(projectId,rootBoqItem,selectedBoqItem,onBoqItemCreated);
		                }
	                };

                    let boqServiceOption = {
                        hierarchicalRootItem: {
                            module: estimateMainModule,
                            serviceName: 'estimateMainBoqService',
                            entityInformation: { module: 'Estimate.Main', entity: 'EstBoq', specialTreatmentService: null},
	                         httpCreate: {
		                         useLocalResource: true,
		                         resourceFunction: createBoqFunction,
		                         resourceFunctionParameters: []
	                         },
                            httpRead: {
                                route: globals.webApiBaseUrl + 'boq/project/',
                                endRead: 'getboqcompositelist',
                                initReadData: function (readData) {
                                    projectId = estimateMainService.getSelectedProjectId();
                                    if (projectId) {
                                        readData.filter = '?projectId=' + projectId;
                                    }
                                    isReadData = true; // mark sended xhr to service
                                    return readData;
                                }
                            },
                            httpUpdate: {
                                route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
                            },
                            dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor, lookupZeroToNullProcessor, estMainRuleParamIconProcess,estimateMainBoqProcessService],
                            presenter: {
                                tree: {
                                    parentProp: 'BoqItemFk',
                                    childProp: 'BoqItems',
                                    incorporateDataRead: function (returnValue, data) {

                                        if(!returnValue){
                                            return data.handleReadSucceeded([], data);
                                        }

                                        // For only Parent Boq Header Items, set ParentFk has Root Boq Item Id
                                        _.each(returnValue.dtos, function (item) {
                                            item.BoqItemFk = -1;
                                        });

                                        loadBoqDynamicColumns(returnValue, data);

                                        service.setBoqHeaderEntities([]);
                                        let readData = returnValue.dtos;
                                        if(returnValue.BoqHeaderEntities){
                                            service.setBoqHeaderEntities(returnValue.BoqHeaderEntities);
                                        }

                                        if (readData === null) {
                                            return data.handleReadSucceeded([], data);
                                        } else {
                                            let boqList =[];
                                            $injector.get('cloudCommonGridService').flatten(readData, boqList, 'BoqItems');
                                            _.forEach(boqList,function(boqItem){
                                                boqItem.DeltaUnit = boqItem.Delta/boqItem.Quantity;

                                                if(boqItem.BoqLineTypeFk === 0 && boqItem.BoqItems && boqItem.BoqItems.length > 0){
                                                    _.forEach(boqItem.BoqItems, function (item){
                                                        if(item.BoqLineTypeFk === 11){
                                                            item.DescriptionInfo = angular.copy(boqItem.BriefInfo);
                                                            if(item.DescriptionInfo){
                                                                item.DescriptionInfo.DescriptionTr = null;
                                                            }
                                                        }
                                                    });
                                                }
                                            });

                                            let filterIds = estimateMainFilterService.getAllFilterIds();

                                            let multiSelect = false; // default single mode
                                            if (data.usingContainer && data.usingContainer[0]) {
                                                let existedGrid = platformGridAPI.grids.exist(data.usingContainer[0]);
                                                if (existedGrid) {
                                                    let columns = platformGridAPI.columns.getColumns(data.usingContainer[0]);
                                                    let markerColumn = _.find(columns, {'field': 'IsMarked'});
                                                    if (markerColumn && markerColumn.editorOptions) {
                                                        multiSelect = markerColumn.editorOptions.multiSelect;
                                                    }
                                                }
                                            }

                                            if (filterIds.BOQ_ITEM && _.isArray(filterIds.BOQ_ITEM)) {
                                                let flatList = cloudCommonGridService.flatten(readData, [], 'BoqItems');
                                                let filterItem = _.filter(flatList, function (item) {
                                                    return (multiSelect ? _.includes(filterIds.BOQ_ITEM, item.Id) : item.Id === filterIds.BOQ_ITEM[0]);
                                                });

                                                if (filterItem && _.isArray(filterItem) && filterItem[0]) {
                                                    // IsMarked used by the UI config service as filter field
                                                    _.each(filterItem, function (item) {
                                                        item.IsMarked = true;
                                                    });

                                                    let grids = serviceContainer.data.usingContainer;
                                                    _.each(grids, function (gridId) {
                                                        if (gridId) {
                                                            $timeout(function () {
                                                                platformGridAPI.rows.scrollIntoViewByItem(gridId, filterItem[0]);
                                                                service.setSelected(filterItem[0]);
                                                            });
                                                        }
                                                    });
                                                }
                                            }

                                            // add virtual root item containing all boqs
                                            let vRoot = {
                                                Id: -1,
                                                BoqItems: readData,
                                                BoqItemFk: null,
                                                BoqHeaderFk : null,
                                                HasChildren: readData.length > 0,
                                                image: 'ico-folder-estimate',
	                                             EstHeaderFk : estimateMainService.getSelectedEstHeaderId(),
	                                             IsRoot : true
                                            };
                                            let estHeader = estimateMainService.getSelectedEstHeaderItem();
                                            if (estHeader) {
                                                vRoot.Reference = estHeader.Code;
                                                vRoot.BriefInfo = {
                                                    Description: estHeader.DescriptionInfo.Description,
                                                    Translated: estHeader.DescriptionInfo.Translated
                                                };
                                                vRoot.EstHeaderFk = estHeader.Id;
                                                vRoot.IsRoot = true;
                                            }

                                            estimateMainCreationService.removeCreationProcessor('estimateMainBoqListController');
                                            isReadData = false; // mark done xhr

                                            data.handleReadSucceeded([vRoot], data);
                                            platformGridAPI.rows.expandAllSubNodes('ecaf41be6cc045588297d5efb9745fe4',vRoot);

                                            if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
                                                if (data.itemList.length > 0) {
                                                    _.forEach(data.itemList, function (item) {
                                                        $injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
                                                    });
                                                }
                                            }

	                                        if(Object.hasOwnProperty.call(returnValue, 'IsEstimateBoqDriven')){
		                                        let isBoqDriven = _.get(returnValue, 'IsEstimateBoqDriven');
		                                        $injector.get('basicsLookupdataLookupDescriptorService').removeData('isBoqDrivenFlag');
		                                        $injector.get('basicsLookupdataLookupDescriptorService').updateData('isBoqDrivenFlag',[isBoqDriven]);
		                                        service.onBoqItemsLoaded.fire(isBoqDriven);
	                                        }

                                            return data.itemList;
                                        }
                                    },
	                                initCreationData: function initCreationData(creationData) {
		                                creationData.parent = null;
	                                }
                                }
                            },
                            entityRole: {
                                root: {
                                    rootForModule: moduleName,
                                    addToLastObject: true,
                                    lastObjectModuleName: moduleName,
                                    codeField: 'Reference',
                                    descField: 'BriefInfo.Translated',
                                    itemName: 'EstBoq',
                                    moduleName: 'Estimate Main',
                                    handleUpdateDone:function (updateData, response) {
                                      service.handleUpdateDone(updateData, response, true);
                                    }
                            }},
                            entitySelection: {supportsMultiSelection: true},
                            actions: {
                                create: 'hierarchical',
                                canCreateCallBackFunc: canCreateBoq,
                                delete: {},
                                canDeleteCallBackFunc: canDeleteBoq
                            }
                        }
                    };

                    serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);
                    service = serviceContainer.service;
	                 serviceContainer.data.hasToReduceTreeStructures = true;
                    let allFilterIds = [];
                    let boqHeaderEntities =[];
                    let dynamicUserDefinedColumnsService = null;
                    let commonDynamicConfigurationService = null;

                    service.handleUpdateDone = handleUpdateDone;

                    service.deleteEntities = function(selectedItems) {

	                    _.forEach(selectedItems, function(selectedItem){

                            function onBoqItemDeleted(){
                                return serviceContainer.data.onDeleteDone({entity:selectedItem, service: serviceContainer.service}, serviceContainer.data);
                            }

		                    let rootItem = service.getCurrentRootItem(selectedItem);
		                    updateBoqItems(selectedItem);

                            return $injector.get('boqMainBoqDrivenEstimateService').deleteBoqPositionAsync(rootItem, selectedItem, onBoqItemDeleted);
	                    });
					};

                    service.getIsBoqDrivenFlag = getIsBoqDrivenFlag;
                    // Function to get isBoqDriven value
                    function getIsBoqDrivenFlag() {
                        let isBoqDriven = $injector.get('basicsLookupdataLookupDescriptorService').getData('isBoqDrivenFlag');
                        return isBoqDriven ? Object.values(isBoqDriven)[0] || false : false;
                    }

						  //ToDo: need to check why lookupZeroToNullProcessor is required which causes make use of "updateBoqItems". This function should not be required
                    function updateBoqItems(item) {
                        // Base case: update the current item if BasUomFk is null
                        if (item.BasUomFk === null) {
                            item.BasUomFk = 0;
                        }

                        if (item.BoqItemFk === -1) {
                            item.BoqItemFk = null;
                        }

                        // If the item has child BoqItems, recursively process them
                        if (item.BoqItems && item.BoqItems.length > 0) {
                            item.BoqItems.forEach(function (childItem) {
                                updateBoqItems(childItem); // Recursively call the function for each child item
                            });
                        }
                    }

                    service.setButtonEditValue = function setButtonEditValue(isEditable) {
                        isEdit = isEditable;
                    };

                    service.getButtonEditValue = function getButtonEditValue() {
                        return isEdit;
                    };
                    service.getCurrentRootItem = function(selectedItem){
                        let list = service.getList();
                        if(!selectedItem){
                            selectedItem = service.getSelected();
                        }
                        if(!list || !selectedItem){
                            return;
                        }

                        let root = {};
                        _.forEach(list, function(item){
                            if(boqMainCommonService.isRoot(item) && item.BoqHeaderFk === selectedItem.BoqHeaderFk){
                                root = item;
                            }
                        });

                        return root;
                    };

                    service.getContainerData =  function getContainerData() {
                        return serviceContainer.data;
                    };

                    let ruleToDelete =[];

                    service.setRuleToDelete =  function setRuleToDelete(value) {
                        ruleToDelete = value;
                    };

                    service.getRuleToDelete =  function getRuleToDelete() {
                        return ruleToDelete;
                    };

                    service.onCostGroupCatalogsLoaded = new PlatformMessenger();

                    service.onBoqDynamicColumnsLoaded = new PlatformMessenger();

                    service.onBoqItemsLoaded = new PlatformMessenger();

                    service.setFilter('projectId=' + projectId + '&filterValue=');

                    serviceContainer.data.showHeaderAfterSelectionChanged = null;

                    service.creatorItemChanged = function creatorItemChanged(e, item) {
                        if (!_.isEmpty(item)) {
                            estimateMainCreationService.addCreationProcessor('estimateMainBoqListController', function (creationItem) {
                                // BoqLineTypeFk, only assign:
                                // Position = 0, Sub-Description = 110, Surcharge Item = 200
                                let canAdd = true;
                                if (item && item.Id && item.BoqLineTypeFk === 0) {
                                    // if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
                                    if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
                                        let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
                                        if(crbChildrens && crbChildrens.length){
                                            canAdd = false;
                                        }
                                    }
                                }

                                let boqLineTypes = [0, 11, 200, 201, 202, 203];
                                if (boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
                                    canAdd = false;
                                }

                                if (canAdd) {
                                    creationItem.BoqItemFk = item.Id;
                                    creationItem.BoqHeaderFk = item.BoqHeaderFk;
                                    creationItem.IsDaywork = item.IsDaywork;
                                    creationItem.IsIncluded = item.Included;
                                    creationItem.ExternalCode = item.ExternalCode;

                                    if(creationItem.DescStructure === 1 || !creationItem.validStructure || !creationItem.DescAssigned){
                                        creationItem.DescriptionInfo = angular.copy(item.BoqLineTypeFk !== 11 ? item.BriefInfo : item.DescriptionInfo);
                                        if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
                                        creationItem.DescAssigned = creationItem.DescStructure === 1;
                                    }

                                    // from structure
                                    if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 1){

                                        if(creationItem.QtyRelFk === 1){
                                            creationItem.Quantity = item.QuantityAdj;  // AQ
                                            creationItem.QuantityDetail = item.QuantityAdjDetail;
                                        }

                                        creationItem.WqQuantityTarget = item.Quantity; // WQ
                                        creationItem.WqQuantityTargetDetail = item.QuantityDetail;

                                        creationItem.QuantityTarget  = item.QuantityAdj;
                                        creationItem.QuantityTargetDetail= item.QuantityAdjDetail;


                                        creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
                                        creationItem.validStructure = true;
                                        creationItem.QtyTakeOverStructFk = 1;
                                    }

                                    creationItem.IsOptional = service.IsLineItemOptional(item);
                                    creationItem.IsOptionalIT = service.IsLineItemOptionalIt(item);
                                    creationItem.IsFixedPrice = item.IsFixedPrice;
                                    creationItem.ActualFinlPricOc = item.FinalpriceOc - item.FinaldiscountOc;

                                }else if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 1){
                                    creationItem.WqQuantityTarget = 1; // WQ
                                    creationItem.WqQuantityTargetDetail = 1;

                                    creationItem.Quantity = 1;  // AQ
                                    creationItem.QuantityDetail = 1;
                                }
                            });

                            // focus on assembly structure, to load assembly
                            let estimateMainWicRelateAssemblyService = $injector.get('estimateMainWicRelateAssemblyService');
                            if(estimateMainWicRelateAssemblyService.getCurrentFilterType() === 'filterByBoQ') {
                                if (item && item.Id) {
                                    estimateMainWicRelateAssemblyService.load();
                                    // $injector.get('estimateMainWicRelateAssemblyService').activateStrLayout();
                                }
                                else {
                                    estimateMainWicRelateAssemblyService.updateList([]);
                                }
                            }


                        } else {
                            estimateMainCreationService.removeCreationProcessor('estimateMainBoqListController');
                        }
                    };

                    service.getDynamicUserDefinedColumnsService = function (){
                        return dynamicUserDefinedColumnsService;
                    };

                    service.setDynamicUserDefinedColumnsService = function (value){
                        dynamicUserDefinedColumnsService = value;
                    };

                    service.getCommonDynamicConfigurationService = function (){
                        if(!commonDynamicConfigurationService){
                            commonDynamicConfigurationService = basicsCommonDynamicConfigurationServiceFactory.createService();
                        }
                        return commonDynamicConfigurationService;
                    };

                    service.setBoqHeaderEntities = function setBoqHeaderEntities(value){
                        boqHeaderEntities  =value;
                    };

                    service.getBoqHeaderEntities = function getBoqHeaderEntities(){
                        return boqHeaderEntities;
                    };

                    service.filterBoqItem = new Platform.Messenger();
                    service.registerFilterBoqItem = function (callBackFn) {
                        service.filterBoqItem.register(callBackFn);
                    };
                    service.unregisterFilterBoqItem = function (callBackFn) {
                        service.filterBoqItem.unregister(callBackFn);
                    };

                    // event: masker the boq Ids.
                    service.onMarkerchagnedBoqItemIds = new Platform.Messenger();

                    service.markersChanged = function markersChanged(itemList) {

                        let filterKey = 'BOQ_ITEM';

                        if (_.isArray(itemList) && _.size(itemList) > 0) {
                            allFilterIds = [];

                            // get all child boqs (for each item)
                            _.each(itemList, function (item) {
                                lineItemFk =item.BoqLineTypeFk;

                                let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'BoqItems'), 'Id');
                                allFilterIds = allFilterIds.concat(Ids);
                            });
                            estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
                            estimateMainFilterService.addFilter('estimateMainBoqListController', service, function (lineItem) {
                                return allFilterIds.indexOf(lineItem.BoqItemFk) >= 0;
                            }, {id: filterKey, iconClass: 'tlb-icons ico-filter-boq', captionId: 'filterBoq'}, 'BoqItemFk');
                            // This function called to clear previous selected item in the grid, to avoid selection issue of line item.
                            estimateMainService.clearSelectedItemOnBoqFilter();
                            service.onMarkerchagnedBoqItemIds.fire(allFilterIds);
                        } else {
                            estimateMainFilterService.setFilterIds(filterKey, []);
                            estimateMainFilterService.removeFilter('estimateMainBoqListController');
                        }

                        service.filterBoqItem.fire();
                    };

                    service.getLineItem= function(){
                        return lineItemFk;
                    };

                    service.provideUpdateData = function (updateData) {
                        if(updateData && !updateData.MainItemId){
                            updateData.MainItemId = service.getIfSelectedIdElse(-1);
                        }
                        return estimateMainService.getUpdateData(updateData);
                    };

                    serviceContainer.data.provideUpdateData = service.provideUpdateData;

                    service.loadBoq = function (isFromNavigator) {
                        let selectedPrjId = estimateMainService.getSelectedProjectId();
                        if(selectedPrjId === -1){
                            return;
                        }

                        // if project id change, then reload leading structure
                        let boqList = service.getList();
                        // go to estimate or sidebar favorites
                        let isDoRefresh = estimateMainService.getDoRefreshLS();
                        if (projectId !== selectedPrjId || boqList.length <= 0 || isDoRefresh) {
                            projectId = selectedPrjId;
                            service.setFilter('projectId=' + projectId);
                            if (projectId && !isReadData) {
                                service.load();
                                estimateMainService.setDoRefreshLS(false);
                            }
                        }else{
                            let rootItem = _.find(boqList, {IsRoot : true});
                            if(rootItem){
                                let estHeader = estimateMainService.getSelectedEstHeaderItem();
                                if (estHeader) {
                                    rootItem.Reference = estHeader.Code;
                                    rootItem.BriefInfo = {
                                        Description: estHeader.DescriptionInfo.Description,
                                        Translated: estHeader.DescriptionInfo.Translated
                                    };
                                    rootItem.EstHeaderFk = estHeader.Id;
                                }
                                service.fireItemModified(rootItem);
                            }

                            if(isFromNavigator === 'isForNagvitor'){
                                service.load();
                            }

                        }
                    };

                    service.clearSelectedItem = function(){
                        serviceContainer.data.selectedItem = null;
                    };

                    /**
                     * @ngdoc function
                     * @name addList
                     * @function
                     * @methodOf estimateMainBoqService
                     * @description
                     * @param {Array} data items to be added
                     *
                     */
                    service.addList = function addList(data) {
                        let list = serviceContainer.data.itemList;
                        serviceContainer.data.itemList = !list || !list.length ? [] : list;

                        if (data && data.length) {
                            angular.forEach(data, function (d) {
                                let item = _.find(list, {Id: d.Id});
                                if (item) {
                                    angular.extend(list[list.indexOf(item)], d);
                                } else {
                                    serviceContainer.data.itemList.push(d);
                                }
                            });
                        }
                    };

                    service.isItemFilterEnabled = function(){
                        $injector.get('estimateMainWicRelateAssemblyService').setList([]);
                        return serviceContainer.data.itemFilterEnabled;
                    };

                    // when do this action, will reload data when 'onContextUpdated' event trigger
                    service.resetProjectId = function () {
                        projectId = null;
                    };

                    service.getCallingContextType = function (){
                        return 'Estimate';
                    };

                    service.registerLookupFilters = function () {

                    };

                    service.getCallingContext = function (){
                        return null;
                    };

                    service.isCrbBoq = function (){
                        let boqStructureServiceState = {};
                        let boqStructureService = $injector.get('boqMainBoqStructureServiceFactory').createBoqStructureService(boqStructureServiceState);
                        return $injector.get('boqMainCommonService').isCrbBoqType(boqStructureService.getStructure());
                    };

                    service.getSelectedProjectId = function (){
                        return projectId;
                    };

                    service.IsLineItemOptional = function (boqItem){
                        return angular.isDefined(boqItem) && boqItem !== null &&
                            (boqMainCommonService.isItem(boqItem) || boqMainCommonService.isSurchargeItem(boqItem)) &&
                            (boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithIT ||
                                boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithoutIT ||
                                (boqItem.BasItemTypeFk === boqMainItemTypes.standard &&
                                    boqItem.BasItemType2Fk !== boqMainItemTypes2.normal &&
                                    boqItem.BasItemType2Fk !== boqMainItemTypes2.base &&
                                    boqItem.BasItemType2Fk !== boqMainItemTypes2.alternativeAwarded));
                    };

                    service.IsLineItemOptionalIt = function (boqItem){
                        return angular.isDefined(boqItem) && boqItem !== null &&
                            (boqMainCommonService.isItem(boqItem) || boqMainCommonService.isSurchargeItem(boqItem)) &&
                            (boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithIT) &&
                            (boqItem.BasItemType2Fk === boqMainItemTypes2.normal ||
                                boqItem.BasItemType2Fk === boqMainItemTypes2.base ||
                                boqItem.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded);
                    };

                    service.lastSelectedFilterKey = function (filterKey){
                        if(_.isString(filterKey)){
                            lastSelectedFilterKey = filterKey;
                        }

                        return lastSelectedFilterKey;
                    };

                    service.filterToolIsAdded = function (value){
                        if(_.isBoolean(value)){
                            filterToolIsInitialized = value;
                        }

                        return filterToolIsInitialized;
                    };

                    service.ExecuteFilter = function(filterKey){
                        let filter = null;
                        let ids = _.uniq(_.compact(_.map(estimateMainService.getList(), 'BoqItemFk')));

                        if(filterKey === 'boqWithLinkedLI') {
                            filter = function (item) {
                                return ids.indexOf(item.Id) >= 0;
                            };
                        }
                        else if(filterKey === 'boqWithoutLinkedLI') {
                            filter = function (item) {
                                return ids.indexOf(item.Id) < 0;
                            };
                        }

                        service.lastSelectedFilterKey(filterKey);
                        serviceContainer.data.itemFilterEnabled = filterKey !== 'allBoqs';
                        serviceContainer.data.itemFilter = filter;
                        serviceContainer.data.listLoaded.fire();
                    };

                    service.ExecuteFilter('allBoqs');

                    function loadBoqDynamicColumns(readData) {
                        let dySer = service.getCommonDynamicConfigurationService();

                        if(dySer){
                            // 1.cost group
                            //   1).Bind CostGroup data to entity
                            let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
                            basicsCostGroupAssignmentService.attach(readData, {
                                mainDataName: 'dtos',
                                attachDataName: 'ProjectBoQ2CostGroups',
                                dataLookupType: 'ProjectBoQ2CostGroups',
                                isTreeStructure: true,
                                isReadonly: true,
                                childrenName: 'BoqItems',
                                identityGetter: function identityGetter(entity){
                                    return {
                                        BoqHeaderFk: entity.RootItemId,
                                        Id: entity.MainItemId
                                    };
                                }
                            });

                            //   2).Provide CostGroup column config for list and detail.
                            let costGroupOption = {
                                costGroupName: 'Assignments'
                            };
                            dySer.attachCostGroup(readData.CostGroupCats, service.costGroupService, costGroupOption);

                            // 3.UDP
                            let dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
                            if (dynamicUserDefinedColumnsService) {
                                let UDPCongif = readData.boqUserDefinedCostConfig;
                                dynamicUserDefinedColumnsService.processColConfig(UDPCongif);
                                dynamicUserDefinedColumnsService.clearValueService();

                                // 1). Bind UDP data to entity
                                let output = [];
                                let cloudCommonGridService = $injector.get('cloudCommonGridService');
                                cloudCommonGridService.flatten(readData.dtos, output, 'BoqItems');
                                dynamicUserDefinedColumnsService.attachDataToColumnFromColVal(output, readData.BoqUserDefinedCostValue);

                                // 2).Provide upd column config for list.
                                let udpColumns = dynamicUserDefinedColumnsService.getDynamicColumnsForList();
                                dySer.attachDynColConfigForList({'userDefinedConfig': udpColumns});
                                // 3).Provide upd column config for detail.
                                let udpRows = dynamicUserDefinedColumnsService.getDynamicColumnsForDetail();
                                dySer.attachDynColConfigForDetail({userDefinedDetailConfig: udpRows});
                            }

                            service.onBoqDynamicColumnsLoaded.fire();
                        }
                    }

                    function handleUpdateDone(updateData, response, isLoadResources) {
                        if(getIsBoqDrivenFlag()){
                            serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
                            if(isLoadResources){
                                $injector.get('estimateMainResourceService').load();
                            }
                        }
                        // for readonly boq container to save rule and param
                        updateData.MainItemId = updateData.MainItemId < 0 ? null : updateData.MainItemId;
                        estimateMainService.updateList(updateData, response);
                    }

                    $injector.get('mainViewService').registerListener('onTabChanged', function (e, args) {
                        if(args.fromTab !== args.toTab){
                            tabChanged = true;
                        } else {
                            tabChanged = false;
                        }
                    });

                    service.isTabChanged = function isTabChanged(){
                        return tabChanged;
                    };

                    return serviceContainer;
                };

            return factoryService;
        }
    ]);

})();