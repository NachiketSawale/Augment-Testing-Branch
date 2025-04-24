/**
 * Created by joshi on 14.11.2016.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _, $ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamlistDataService
	 * @function
	 *
	 * @description
	 * This service provides details formula parameter list Data Service for dialog.
	 */
	angular.module(moduleName).service('estimateMainDetailsParamListDataService',
		['$q', '$http', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateMainCommonFeaturesService',
			'estimateMainDetailsParamListValidationService', 'estimateMainDetailsParamDialogService','estimateRuleParameterConstant','estimateRuleCommonService','estimateMainParamStructureConstant',
			function ($q, $http, $injector, PlatformMessenger, platformDataServiceFactory, estimateMainCommonFeaturesService,
				estimateMainDetailsParamListValidationService, detailsParamDialogService, estimateRuleParameterConstant,estimateRuleCommonService,estimateMainParamStructureConstant) {

				var _callbackFun;
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
					setDataList: setDataList,
					getSelected: getSelected,
					setSelected: setSelected,
					refreshGrid: refreshGrid,
					gridRefresh: refreshGrid,
					createItem : createItem,
					deleteItem: deleteItem,
					// markItemAsModified: markItemAsModified,
					setItemTOSave: setItemTOSave,
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
					showSameCodeWarning:showSameCodeWarning,
					checkConflictParam: checkConflictParam,
					checkWithLevelParams: checkWithLevelParams,
					getGridId : getGridId,
					setGridId: setGridId,
					UpdateParameter: updateParameter,
					syncParametersFromUserForm: syncParametersFromUserForm,
					syncParametersFinished:syncParametersFinished,
					isPupopUpParameterWin: isPupopUpParameterWin,
					clearCallBackFun: clearCallBackFun,
					asyncValidateCode: estimateMainDetailsParamListValidationService.asyncValidateCode
				});

				// TODO:   Move implementation of setSelected and remove this serviceOption configuration
				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainDetailsParamListDataService',
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

				function getModule() {
					return 'estimate.main';
				}

				function getList() {
					return data;
				}

				function showSameCodeWarning(entity,code){
					let params = service.getList();
					let  assignedStructure =  [];


					_.forEach(params, function(param) {
						if(param.Code.toUpperCase() === code.toUpperCase() && param.Id !== entity.Id){
							assignedStructure.push(param);
						}
					});

					let sameCodeResult =_.filter(assignedStructure,function(item){
						if(item.AssignedStructureId !== entity.AssignedStructureId){
							return item;
						}
					});

					if(sameCodeResult  && sameCodeResult.length>0){
						entity.SameCodeButNoConlict = true;
						_.forEach(sameCodeResult,function(item){
							item.SameCodeButNoConlict = true;
						});
					}else{
						entity.SameCodeButNoConlict = false;
						_.forEach(assignedStructure,function(item){
							item.SameCodeButNoConlict = false;
						});
					}
				}

				function createItem(code) {

					let paramDialogService = $injector.get('estimateMainDetailsParamDialogService');
					let config = paramDialogService.getConfigulation();
					// server create
					let httpRoute = globals.webApiBaseUrl + 'estimate/parameter/lookup/create',
						creationData = {
							itemName: [config.options.itemName],
							// item : config.entity, useless property
							itemServiceName : config.options.itemServiceName
						};

					return $http.post(httpRoute, creationData).then(function(response){
						let item = response.data[config.options.itemName+'Param'];
						if(item && item.Id){
							item.originId = item.Id;
							item.Code = code;
							item.Sorting = data.length+1;
							item.AssignedStructureId = paramDialogService.getSelectedStructureId() || paramDialogService.getLeadingStructureId();
							checkWithLevelParams(item.AssignedStructureId, item);
							addItems([item]);
							setSelected(item);
							updateSelection();
							service.onUpdateList.fire(data);
						}
						return item;
					});
				}

				function deleteItem() {

					let selectedParams = service.getSelectedEntities();

					let index;
					let matchItem =  _.filter(selectedParams, function (d) {
						return d.Version > 0;
					});

					if (matchItem && matchItem.length) {

						// get the delete items
						let itemToDelete;
						_.forEach(matchItem,function(d){
							if(itemsToDelete && itemsToDelete.length > 0) {
								index =  _.findIndex(itemsToDelete, {'assignedStructureId': d.AssignedStructureId});
								if(index === -1){
									itemToDelete = {assignedStructureId: 0, toDelete: []};
									itemToDelete.assignedStructureId = d.AssignedStructureId;
									itemToDelete.toDelete.push(d);
									itemsToDelete.push(itemToDelete);
								}
								else {
									itemsToDelete[index].toDelete.push(d);
								}
							}
							else {
								itemToDelete = {assignedStructureId: 0, toDelete: []};
								itemToDelete.assignedStructureId = d.AssignedStructureId;
								itemToDelete.toDelete.push(d);
								itemsToDelete.push(itemToDelete);
							}
						});
					}

					let ids = _.map(selectedParams,'Id');
					data = _.filter(data, function (d) {
						return ids.indexOf(d.Id)<=-1;
					});

					let item = data.length > 0 ? data[data.length - 1] : null;
					service.setSelected(item);

					refreshGrid();
					updateSelection();
					service.onUpdateList.fire(data);

					angular.forEach(data,function (item) {
						estimateMainDetailsParamListValidationService.validateCode(item, item.Code, 'Code');
					});
				}

				function setDataList(items) {
					if (Array.isArray(items)) {
						data =  _.sortBy(items, 'Code');
					} else {
						data = [];
					}

					$injector.get('estimateMainDeatailsParamListProcessor').processItems(data);

					angular.forEach(data,function (item) {
						estimateMainDetailsParamListValidationService.validateCode(item, item.Code, 'Code','listLoad');
						item.originId = item.originId || item.Id;
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
							if(item.Version <= 0){$injector.get('estimateMainDetailsParamListDataService').setItemTOSave(item);}
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
					return selectedItem;
				}

				function refreshGrid() {
					service.listLoaded.fire();
				}

				function updateSelection() {
					service.selectionChanged.fire();
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

				function  setItemTOSave(item) {
					let modified = _.find(itemsToSave, {Id : item.Id});
					if(!modified){
						itemsToSave.push(item);
					}
				}

				function  getItemsTOCache(){
					return itemsTOCache;
				}

				function getItemsToSave(){
					return itemsToSave.length ? itemsToSave : null;
				}

				function getItemsToDelete(){
					return itemsToDelete.length ? itemsToDelete : null;
				}

				function checkConflictParam(item, isAssignedStructure){
					let params = checkWithLevelParams(item.AssignedStructureId, item, isAssignedStructure);
					service.onUpdateList.fire(params);
				}

				function checkWithLevelParams(assignedStructureId, paramItem, isAssignedStructure){
					function mapConflictParams(paramItem, isAssignedStructure, parameterEntities, params){
						let index = null;
						if(parameterEntities){
							_.forEach(data, function(param){
								let item = _.find(parameterEntities, {Code: param.Code, AssignedStructureId: param.AssignedStructureId});
								if(item && item.ValueType !== param.ValueType){
									index = _.findIndex(params, {'Id': item.Id});
									if(index === -1) {
										params.push(item);
									}
								}
								else if(isAssignedStructure && paramItem.Id === param.Id && item && item.ValueType === param.ValueType){
									index = _.findIndex(params, {'Id': param.Id});
									if(index !== -1){
										params[index].Id = item.Id;
										params[index].Version = item.Version;
									}
								}else if(isAssignedStructure) {
									index = _.findIndex(params, {'Id': paramItem.Id});
									if(index !== -1){
										params[index].Version = -1;
									}
								}
								else if (item && item.ValueType === param.ValueType){
									switch (assignedStructureId) {
										case 1011:
											index = _.findIndex(params, {'Code': item.Code});
											break;
										case 1010:
											index = _.findIndex(params, {'Code': item.Code, 'EstHeaderFk': item.EstHeaderFk});
											break;
										case 1001:
											index = _.findIndex(params, {'Code': item.Code, 'EstHeaderFk': item.EstHeaderFk, 'EstLineItemFk': item.EstLineItemFk});
											break;
										case 1000:
											index = _.findIndex(params, {'Code': item.Code, 'EstLineItemFk': item.EstLineItemFk});
											break;
										case 1:
											index = _.findIndex(params, {'Code': item.Code, 'BoqHeaderFk': item.BoqHeaderFk, 'BoqItemFk': item.BoqItemFk});
											break;
										case 2:
										{
											// activity Schedule
											index = _.findIndex(params, {'Code': item.Code, 'PsdActivityFk': item.PsdActivityFk});
											break;
										}
										case 3:
										{
											// Location
											index = _.findIndex(params, {'Code': item.Code, 'PrjLocationFk': item.PrjLocationFk});
											break;
										}
										case 4:
										{
											// Controllingunits
											index = _.findIndex(params, {'Code': item.Code, 'MdcControllingUnitFk': item.MdcControllingUnitFk});
											break;
										}
										case 5:
										{
											// ProcurementStructure
											index = _.findIndex(params, {'Code': item.Code, 'PrcStructureFk': item.PrcStructureFk});
											break;
										}
										case 6:
										{
											// CostGroup1
											index = _.findIndex(params, {'Code': item.Code, 'LicCostGrp1Fk': item.LicCostGrp1Fk});
											break;
										}
										case 7:
										{
											// CostGroup2
											index = _.findIndex(params, {'Code': item.Code, 'LicCostGrp2Fk': item.LicCostGrp2Fk});
											break;
										}
										case 8:
										{
											// CostGroup3
											index = _.findIndex(params, {'Code': item.Code, 'LicCostGrp3Fk': item.LicCostGrp3Fk});
											break;
										}
										case 9:
										{
											// CostGroup4
											index = _.findIndex(params, {'Code': item.Code, 'LicCostGrp4Fk': item.LicCostGrp4Fk});
											break;
										}
										case 10:
										{
											// CostGroup5
											index = _.findIndex(params, {'Code': item.Code, 'LicCostGrp5Fk': item.LicCostGrp5Fk});
											break;
										}
										case 11:
										{
											// ProjectCostGroup1
											index = _.findIndex(params, {'Code': item.Code, 'PrjCostGrp1Fk': item.PrjCostGrp1Fk});
											break;
										}
										case 12:
										{
											// ProjectCostGroup2
											index = _.findIndex(params, {'Code': item.Code, 'PrjCostGrp2Fk': item.PrjCostGrp2Fk});
											break;
										}
										case 13:
										{
											// ProjectCostGroup3
											index = _.findIndex(params, {'Code': item.Code, 'PrjCostGrp3Fk': item.PrjCostGrp3Fk});
											break;
										}
										case 14:
										{
											// ProjectCostGroup4
											index = _.findIndex(params, {'Code': item.Code, 'PrjCostGrp4Fk': item.PrjCostGrp4Fk});
											break;
										}
										case 15:
										{
											// ProjectCostGroup5
											index = _.findIndex(params, {'Code': item.Code, 'PrjCostGrp5Fk': item.PrjCostGrp5Fk});
											break;
										}
										case 16:
										{
											// Assembly category Structure
											index = _.findIndex(params, {'Code': item.Code, 'EstAssemblyCatFk': item.EstAssemblyCatFk});
											break;
										}
										case 20:
										{
											// costGroup
											index = _.findIndex(params, {'Code': item.Code, 'CostGroupFk': item.CostGroupFk});
											break;
										}
									}
									let indexParamter = _.findIndex(params, {'Code': item.Code});
									if(index !== -1){
										params[index].Id = item.Id;
										params[index].Version = item.Version;
									} else if(indexParamter !== -1){
										params[indexParamter].Version = -1;
									}
								}
							});
						}else if(isAssignedStructure){
							index = _.findIndex(params, {'Id': paramItem.Id});
							if(index !== -1){
								params[index].Version = -1;
							}
						}
					}

					let params = angular.copy(data);
					if(params && params.length) {
						let currentItem = detailsParamDialogService.getCurrentItem();
						switch (assignedStructureId) {
							case estimateMainParamStructureConstant.EstHeader:
								mapConflictParams(paramItem, isAssignedStructure, currentItem.EstHeaderParameterEntities, params);
								break;
							case estimateMainParamStructureConstant.LineItem:
								mapConflictParams(paramItem, isAssignedStructure, currentItem.CurrentParameterEntities, params);
								break;
							case estimateMainParamStructureConstant.Project:
								mapConflictParams(paramItem, isAssignedStructure, currentItem.PrjParameterEntities, params);
								break;
							default:
								mapConflictParams(paramItem, isAssignedStructure, currentItem.CurrentParameterEntities, params);
								break;
						}
					}
					return params;
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
					let currentEntity = $injector.get('estimateMainDetailsParamDialogService').getCurrentEntity();
					if(currentEntity && currentEntity.ParamAssignment){
						checkCodeConflict(currentEntity.ParamAssignment);
					}
				}

				function syncParametersFromUserForm(callbackFun) {
					let entity = detailsParamDialogService.getCurrentEntity();
					if (entity && entity.RuleAssignment && _.find(entity.RuleAssignment,function (item) { return  !!item.FormFk; })) {
						let jframe = $('#user_form_assign_parameter_frame_Pop');
						let btn = jframe.contents().find('button[name=\'SaveButton\']');

						if (btn && btn.length > 0 && btn.click) {
							_callbackFun = callbackFun;
							btn.click();
							return;
						}
					}

					if(angular.isFunction(callbackFun)){
						callbackFun();
					}
				}

				// this var can't be chenged to let, cause function syncParametersFromUserForm will be invoked async, and it will used this var.
				_callbackFun = null;

				function clearCallBackFun (){
					_callbackFun = null;
				}

				function syncParametersFinished() {
					if(angular.isFunction(_callbackFun)){
						_callbackFun();
					}
				}

				function checkCodeConflict(displayData) {
					_.forEach(displayData,function (param) {
						$injector.get('estimateParameterComplexLookupValidationService').validateCode(param, param.Code, 'Code',displayData);
					});
				}

				function isPupopUpParameterWin(){
					return true;
				}

				return service;

			}]);
})(angular);
