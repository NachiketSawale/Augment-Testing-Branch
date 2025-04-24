/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesDetailsParamListDataService
	 * @function
	 *
	 * @description
	 * This service provides details formula parameter list Data Service for dialog.
	 */
	angular.module(moduleName).service('estimateAssembliesDetailsParamListDataService',
		['$q', '$http', '$injector', 'PlatformMessenger', '_','estimateAssembliesDetailsParamListValidationService','platformDataServiceFactory','estimateRuleParameterConstant','estimateRuleCommonService',
			function ($q, $http, $injector, PlatformMessenger, _,estimateAssembliesDetailsParamListValidationService,platformDataServiceFactory, estimateRuleParameterConstant,estimateRuleCommonService) {

				let service = {},
					data = [],
					itemsToSave = [],
					itemsToDelete = [],
					selectedItem = null,
					itemsTOCache = [];

				angular.extend(service, {
					getModule:getModule,
					getList: getList,
					clear : clear,
					clearCache: clearCache,
					addItems:addItems,
					createItem : createItem,
					deleteItem: deleteItem,
					setDataList: setDataList,
					getSelected: getSelected,
					setSelected: setSelected,
					refreshGrid: refreshGrid,
					gridRefresh: refreshGrid,
					markItemAsModified: markItemAsModified,
					getItemsToSave : getItemsToSave,
					getItemsToDelete : getItemsToDelete,
					getItemsTOCache: getItemsTOCache,
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					registerSelectionChanged: registerSelectionChanged,
					unregisterSelectionChanged: unregisterSelectionChanged,
					listLoaded: new PlatformMessenger(),
					selectionChanged : new PlatformMessenger(),
					onUpdateList: new PlatformMessenger(),
					hasSelection:hasSelection,
					onItemChange : new PlatformMessenger(),
					getGridId : getGridId,
					setGridId: setGridId,
					UpdateParameter: updateParameter
				});


				// TODO:   Move implementation of setSelected and remove this serviceOption configuration
				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateAssembliesDetailsParamListDataService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				container.data.itemList = [];
				angular.extend(service, container.service);

				let _gridId = null;

				return service;

				function createItem(code) {

					let paramDialogService = $injector.get('estimateAssembliesDetailsParamDialogService');
					let config = paramDialogService.getConfigulation();
					// server create
					let httpRoute = globals.webApiBaseUrl + 'estimate/parameter/lookup/create',
						creationData = {
							itemName: [config.MainItemName],
							item : config.entity
						};

					return $http.post(httpRoute, creationData).then(function(response){
						let item = response.data[config.MainItemName + 'Param'];
						if(item && item.Id){
							item.Code = code;
							item.Sorting = data.length+1;
							item.AssignedStructureId = config.MainItemName === 'EstLineItems' ? 1001 : 16;
							// checkWithLevelParams(item.AssignedStructureId, item);
							addItems([item]);
							item.AssignedStructureId = config.MainItemName === 'EstLineItems' ? 1001 : 16;
							setSelected(item);
							updateSelection();
							service.onUpdateList.fire(data);
						}
						return item;
					});
				}

				function deleteItem() {
					let selectedParams = service.getSelectedEntities();

					if (selectedParams && selectedParams.length ) {
						itemsToDelete = itemsToDelete.concat(selectedParams);
					}

					let ids = _.map(selectedParams,'Id');
					data = _.filter(service.getList(), function (d) {
						return ids.indexOf(d.Id)<=-1;
					});

					let item = data.length > 0 ? data[data.length - 1] : null;
					service.setSelected(item);

					refreshGrid();
					updateSelection();
					service.onUpdateList.fire(data);

					angular.forEach(data,function (item) {
						estimateAssembliesDetailsParamListValidationService.validateCode(item, item.Code, 'Code');
					});
				}

				function getModule() {
					return 'estimate.assemblies';
				}

				function getList() {
					return data;
				}

				function updateSelection() {
					service.selectionChanged.fire();
				}

				function setDataList(items) {
					if (Array.isArray(items)) {
						data = items;
					} else {
						data = [];
					}

					$injector.get('estimateMainDeatailsParamListProcessor').processItems(data);

					angular.forEach(data,function (item) {
						estimateAssembliesDetailsParamListValidationService.validateCode(item, item.Code, 'Code','listLoad');
					});

					// get the first time load data.
					if(itemsTOCache.length === 0){
						itemsTOCache = angular.copy(data);
					}
				}

				function addItems(items) {
					data = data ? data : [];
					angular.forEach(items, function(item){
						let matchItem = _.find(data, {Code : item.Code});
						if(!matchItem){
							let dialogService = $injector.get('estimateAssembliesDetailsParamDialogService');
							dialogService.checkAssignedStructure([item]);
							data.push(item);
						}
					});
					service.refreshGrid();
				}

				function getSelected() {
					return selectedItem;
				}

				function setSelected(item) {
					let qDefer = $q.defer();
					selectedItem = item;
					qDefer.resolve(selectedItem);
					return qDefer.promise;
				}

				function hasSelection(){
					return !!selectedItem;
				}

				function refreshGrid() {
					service.listLoaded.fire();
				}


				function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				}

				function unregisterListLoaded(callBackFn) {
					service.listLoaded.unregister(callBackFn);
				}

				function registerSelectionChanged(callBackFn) {
					service.selectionChanged.register(callBackFn);
				}

				function unregisterSelectionChanged(callBackFn) {
					service.selectionChanged.unregister(callBackFn);
				}

				function markItemAsModified(item) {
					let modified = _.find(itemsToSave, {Id : item.Id});
					if(!modified){
						itemsToSave.push(item);
					}
				}

				function getItemsToSave(){
					return itemsToSave.length ? itemsToSave : null;
				}

				function getItemsToDelete(){
					return itemsToDelete.length ? itemsToDelete : null;
				}

				function  getItemsTOCache(){
					return itemsTOCache;
				}

				function clear(){
					itemsToSave = [];
					itemsToDelete = [];
					selectedItem = null;
				}

				function clearCache(){
					itemsTOCache = [];
				}

				function getGridId(){
					return _gridId;
				}

				function setGridId(gridId){
					_gridId = gridId;
				}

				function updateParameter(item, col){
					if (col === 'ValueDetail') {
						if(item.ValueType === estimateRuleParameterConstant.Text){
							item.ParameterText = item.ValueDetail;
						}else{
							estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', service);
						}

					}else if(col === 'ParameterText'){
						if(item.ValueType !== estimateRuleParameterConstant.TextFormula){
							item.ValueDetail = item.ParameterText;
						}

					}else if (col === 'ParameterValue'){
						item.ParameterValue = (item.ParameterValue === '') ? 0 : item.ParameterValue;
						estimateRuleCommonService.calculateDetails(item, col);
					}

					// check it here
					let currentEntity = $injector.get('estimateAssembliesDetailsParamDialogService').getCurrentEntity();
					if(currentEntity && currentEntity.ParamAssignment){
						checkCodeConflict(currentEntity.ParamAssignment);
					}
				}

				function checkCodeConflict(displayData) {
					_.forEach(displayData,function (param) {
						$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code',displayData);
					});
				}

			}]);
})(angular);
