/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.common';

	/**
     * @ngdoc service
     * @name estimateCommonDynamicConfigurationServiceFactory
     * @function
     *
     * @description
     * service factory for all module specific dynamic column layout service
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateCommonDynamicConfigurationServiceFactory', [
		'$injector', 'PlatformMessenger', 'mainViewService', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCostGroupAssignmentService', 'basicsCommonChangeColumnConfigService',
		function ($injector, PlatformMessenger, mainViewService, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCostGroupAssignmentService, basicsCommonChangeColumnConfigService) {

			function createNewComplete(standardConfigurationService, validationService, options) {
				let data = {
					parentScope: {},
					isInitialized: false,

					// Unique identifier for current container
					uuid: null,

					groupName: 'assignments',

					onConfigLayoutChange: new PlatformMessenger(),

					allColumns: [],

					// dynamic columns dictionary for list
					dynamicColDictionaryForList: {},

					dynamicColDictionaryForDetail: {}
				};

				angular.extend(data, options);

				let baseCongigurationService = angular.isString(standardConfigurationService) ? $injector.get(standardConfigurationService) : standardConfigurationService;

				let baseValidationService = angular.isString(validationService) ? $injector.get(validationService) : validationService;

				let service = { isExtendService : true };

				angular.extend(service, {
					registerSetConfigLayout: registerSetConfigLayout,
					unregisterSetConfigLayout: unregisterSetConfigLayout,
					// For grid
					fireRefreshConfigLayout: fireRefreshConfigLayout,
					// For container data
					fireRefreshConfigData: fireRefreshConfigData,

					applyToScope: applyToGridId,

					// basic ui configurationservice
					baseCongigurationService : baseCongigurationService,

					// Do not attach all dynamic columns in a single object, better separate by types
					// e.g: attach({costGroups:[]}); attach({estConfig:[]})
					// for list view
					attachData: attachDataForList,
					detachData: detachDataForList,
					detachDataItemByKey: detachDataItemByKey,

					// for detail form
					attachDataForDetail: attachDataForDetail,
					detachDataForDetail: detachDataForDetail,

					appendData: appendDataForList,
					getDynamicCols: getDynamicCols,

					// for cost group both list and detail
					attachCostGroup: attachCostGroup,
					attachCostGroupColumnsForList: attachCostGroupColumnsForList,

					getDtoScheme: getDtoScheme,
					getStandardConfigForListView: getStandardConfigForListView,
					getStandardConfigForDetailView: getStandardConfigForDetailView,
					getStandardConfigForLineItemStructure: getStandardConfigForLineItemStructure,
					showLoadingOverlay: showLoadingOverlay,
					hideLoadingOverlay: hideLoadingOverlay,
					resolveColumns: resolveColumns,

					setIsDynamicColumnConfigChanged: setIsDynamicColumnConfigChanged
				});

				return service;

				// Attach column as object
				// e.g: {costGroups: [{id:1,...}]}
				function attachData(dataDictionary, dataObject) {
					if (!angular.isObject(dataObject)) {
						return;
					}

					for (let prop in dataObject) {
						// eslint-disable-next-line no-prototype-builtins
						if (dataObject.hasOwnProperty(prop)) {
							let dataObjectList = dataObject[prop];
							_.forEach(dataObjectList, function(dataObjectItem){
								// Flag as dynamic column
								dataObjectItem.isCustomDynamicCol = true;
							});
							dataDictionary[prop] = dataObjectList;
						}
					}
				}

				function attachDataForList(dataObject) {
					attachData(data.dynamicColDictionaryForList, dataObject);
				}

				function attachDataForDetail(dataObject) {
					attachData(data.dynamicColDictionaryForDetail, dataObject);
				}

				function appendData(dataDictionary, dataObject){
					if (!angular.isObject(dataObject)) {
						return;
					}

					for (let prop in dataObject) {
						// eslint-disable-next-line no-prototype-builtins
						if (dataObject.hasOwnProperty(prop)) {
							// eslint-disable-next-line no-prototype-builtins
							if (dataDictionary.hasOwnProperty(prop)===false){
								dataDictionary[prop]=[];
							}
							_.forEach(dataObject[prop],  function (propDataObject) {
								if (_.findIndex(dataDictionary[prop], {id: propDataObject.id}) === -1){
									// Flag as dynamic column
									propDataObject.isCustomDynamicCol = true;
									dataDictionary[prop].push(propDataObject);
								}
							});
						}
					}
				}

				function appendDataForList(dataObject){
					appendData(data.dynamicColDictionaryForList, dataObject);
				}

				function getDynamicCols(){

					// the version 1 retrun cost group cols.
					let cols = [];
					if (data.dynamicColDictionaryForList.costGroup){
						cols = cols.concat(data.dynamicColDictionaryForList.costGroup);
					}

					return cols;
				}

				// detach columns
				function detachData(dataDictionary, dataObjectKey) {
					// eslint-disable-next-line no-prototype-builtins
					if (dataDictionary.hasOwnProperty(dataObjectKey)) {
						delete dataDictionary[dataObjectKey];
					}
				}

				// detach column by key
				function detachDataByKey(dataDictionary, dataObjectKey, dataItemKey) {
					// eslint-disable-next-line no-prototype-builtins
					if (dataDictionary.hasOwnProperty(dataObjectKey)) {
						if (_.findIndex(dataDictionary[dataObjectKey], {id: dataItemKey}) > -1){
							_.remove(dataDictionary[dataObjectKey], {id: dataItemKey});
						}
					}
				}

				function showLoadingOverlay() {
					data.parentScope.isLoading = true;
				}

				function hideLoadingOverlay() {
					data.parentScope.isLoading = false;
				}

				function detachDataForList(dataObjectKey) {
					detachData(data.dynamicColDictionaryForList, dataObjectKey);
				}

				function detachDataForDetail(dataObjectKey) {
					detachData(data.dynamicColDictionaryForDetail, dataObjectKey);
				}

				function detachDataItemByKey(dataObjectKey, dataItemKey){
					detachDataByKey(data.dynamicColDictionaryForList, dataObjectKey, dataItemKey);
				}

				function attachCostGroup(costGroupCats, costGroupDataService) {
					let costGroupColumnsForList = basicsCostGroupAssignmentService.createCostGroupColumns(costGroupCats, false);
					if (costGroupColumnsForList && angular.isArray(costGroupColumnsForList) && costGroupColumnsForList.length > 0) {
						attachDataForList({costGroup: costGroupColumnsForList});
					}

					let costGroupColumnsForDetail = basicsCostGroupAssignmentService.createCostGroupColumnsForDetail(costGroupCats, costGroupDataService);
					if (costGroupColumnsForDetail && angular.isArray(costGroupColumnsForDetail) && costGroupColumnsForDetail.length > 0) {
						initializeCostGroupForDetail(costGroupColumnsForDetail);
						attachDataForDetail({costGroup: costGroupColumnsForDetail});
					}
					return {
						costGroupColumnsForList : costGroupColumnsForList,
						costGroupColumnsForDetail : costGroupColumnsForDetail
					};
				}

				function attachCostGroupColumnsForList(costGroupColumnsForList){
					attachDataForList({costGroup: costGroupColumnsForList});
				}

				function initializeCostGroupForDetail(cloums) {
					let sortOrder = 1000;
					_.forEach(cloums, function (costGroupColumn) {
						angular.extend(costGroupColumn, {
							gid: data.groupName, // Add to assignments group
							sortOrder: sortOrder++
						});
					});
				}

				function getExtendColumns(dataDictionary) {
					let columnsToAttachForList = [];

					for (let prop in dataDictionary) {
						// eslint-disable-next-line no-prototype-builtins
						if (dataDictionary.hasOwnProperty(prop)) {
							columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
						}
					}

					return columnsToAttachForList;
				}

				function getCostGroupColumns(){
					if(!data || !data.dynamicColDictionaryForList || !data.dynamicColDictionaryForList.costGroup){
						return [];
					}

					return data.dynamicColDictionaryForList.costGroup;
				}

				function getDtoScheme() {
					let baseDtoScheme = baseCongigurationService.getDtoScheme();

					let extendColumns = getExtendColumns(data.dynamicColDictionaryForList);

					_.forEach(extendColumns, function(column){
						if(column.costGroupCatId){
							baseDtoScheme[column.field] = {domain: 'integer',
								groupings: [{groupcolid: 'Basics.CostGroups.CostGroup:'+ column.costGroupCatCode + ':' + column.costGroupCatId}]};
						}
					});

					return baseDtoScheme;
				}

				function getStandardConfigForListView(gridId) {
					// add the extend columns to config for list
					let columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForList);

					let configForListCopy = {};
					if (gridId) {
						configForListCopy.columns = angular.copy(platformGridAPI.columns.configuration(gridId).current);
					}
					else {
						configForListCopy = angular.copy(baseCongigurationService.getStandardConfigForListView());
					}

					// fixed #130161,#132534: It show PROJECT CG CLASS column in boq/qto containor which project donot exist this cost group catalog.
					configForListCopy.columns = mergeDynamicCol(configForListCopy.columns,columnsToAttachForList);

					if (configForListCopy.addValidationAutomatically && baseValidationService) {
						platformGridControllerService.addValidationAutomatically(configForListCopy.columns, baseValidationService);
					}

					if (!configForListCopy.isTranslated) {
						platformTranslateService.translateGridConfig(configForListCopy.columns);
						configForListCopy.isTranslated = true;
					}

					return configForListCopy;
				}

				function mergeDynamicCol(cols,dyCols) {
					if (dyCols && angular.isArray(dyCols)) {
						let copyCols = angular.copy(cols);
						// remove the old Dynamic column
						_.remove(copyCols, function (e) {
							return e.isCustomDynamicCol;
						});
						cols = copyCols.concat(dyCols);
					}
					return cols;
				}

				function getStandardConfigForLineItemStructure(){
					let costGroupColumns = getCostGroupColumns();

					if(!costGroupColumns){
						return baseCongigurationService.getStandardConfigForListView();
					}

					// UDP columns
					let updColumns = data.dynamicColDictionaryForList.userDefinedConfig || [];

					let configForListCopy = angular.copy(baseCongigurationService.getStandardConfigForListView());

					configForListCopy.columns = configForListCopy.columns.concat(costGroupColumns).concat(updColumns);

					configForListCopy.columns =_.filter(configForListCopy.columns, function(column) {return column.id !== 'assemblytype';});

					if (configForListCopy.addValidationAutomatically && baseValidationService) {
						platformGridControllerService.addValidationAutomatically(configForListCopy.columns, baseValidationService);
					}

					if (!configForListCopy.isTranslated) {
						platformTranslateService.translateGridConfig(configForListCopy.columns);
						configForListCopy.isTranslated = true;
					}

					return configForListCopy;
				}

				function getStandardConfigForDetailView() {
					// add the extend columns to config for detail
					let columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForDetail);

					initializeCostGroupForDetail(columnsToAttachForList);

					let configForDetailCopy = angular.copy(baseCongigurationService.getStandardConfigForDetailView());

					configForDetailCopy.rows = configForDetailCopy.rows.concat(columnsToAttachForList);

					return configForDetailCopy;
				}

				function registerSetConfigLayout(callBackFn) {
					data.onConfigLayoutChange.register(callBackFn);
				}

				function unregisterSetConfigLayout(callBackFn) {
					data.onConfigLayoutChange.unregister(callBackFn);
				}

				function fireRefreshConfigLayout() {
					data.onConfigLayoutChange.fire(arguments);

					refreshGridLayout();
				}

				function fireRefreshConfigData() {
					data.onConfigLayoutChange.fire(arguments);
				}

				function applyToGridId(scope) {
					data.parentScope = scope;
					data.uuid = scope.gridId;
				}

				function refreshGridLayout() {
					if (data) {
						if (data.uuid) {
							let gridId = data.uuid;
							let grid = platformGridAPI.grids.element('id', gridId);
							if (grid && grid.instance) {
								data.allColumns = resolveColumns(gridId);

								if (data.isInitialized){
									// Columns from server
									let requestCols = service.getStandardConfigForListView().columns;
									let requestColDyn = _.filter(requestCols, {isCustomDynamicCol: true});

									// Columns from current grid
									let gridColConfig = platformGridAPI.columns.configuration(gridId);
									let gridColDyn = _.filter(gridColConfig.current, {isCustomDynamicCol: true});

									// Flag to change grid columns or not
									let isDynamicColumnConfigChanged = false;
									if (requestColDyn.length !== gridColDyn.length){
										isDynamicColumnConfigChanged = true;
									}

									if(data.isDynamicColumnConfigChanged) {
										isDynamicColumnConfigChanged = true;
									}

									// if resource container view config using old short key field ('estresourcetypefkextend','estresourcetypefkextendbrief'), refresh the container.
									if (gridId === 'bedd392f0e2a44c8a294df34b1f9ce44' && _.findIndex(data.allColumns, function(column) { return column.isOldResourceShortKeyField; }) > -1 ){
										isDynamicColumnConfigChanged = true;
									}



									if (isDynamicColumnConfigChanged===false){
										for (let requestColDynIdx=0; requestColDynIdx<requestColDyn.length-1; requestColDynIdx++){
											let requestColDynamic = requestColDyn[requestColDynIdx];

											// Check in current grid columns
											let gridColumnIdx = _.findIndex(gridColDyn, {id: requestColDynamic.id});
											if (gridColumnIdx === -1){
												isDynamicColumnConfigChanged = true;
												break;
											}
											let gridColDynamic = gridColDyn[gridColumnIdx];

											// Check fields changes
											if ((requestColDynamic.name!==gridColDynamic.name) ||
												(requestColDynamic.userLabelName!==gridColDynamic.userLabelName)){
												isDynamicColumnConfigChanged = true;
												break;
											}
										}
									}

									if (isDynamicColumnConfigChanged){
										platformGridAPI.columns.configuration(gridId, angular.copy(data.allColumns));
										// platformGridAPI.grids.resize(gridId); // persist scroll bars
									}
								}else{
									data.isInitialized = true;

									// Set dynamic columns first time load
									platformGridAPI.columns.configuration(gridId, angular.copy(data.allColumns));
									// platformGridAPI.grids.resize(gridId); // persist scroll bars
								}

								// platformGridAPI.grids.resize(gridId); // persist scroll bars
								platformGridAPI.grids.refresh(gridId);
								platformGridAPI.grids.invalidate(gridId);
							}
						}
					}
				}

				// Resolve column order, visible, hidden status
				function resolveColumns(gridId, dynamicColumns) {
					// Take all columns again and map it with the cached grid's column configuration for sorting and hide/show status
					let columns = dynamicColumns ? dynamicColumns : service.getStandardConfigForListView(gridId).columns; // grid.columns.current;

					let cols = basicsCommonChangeColumnConfigService.mergeWithViewConfig(gridId, columns);

					// bre:
					// The tree column (among others in BOQ tree) is a fix column which cannot be configured.
					// But in context with the "dynamic columns" the property 'treeColumn.hidden' sometimes is set to true,
					// then in the later call of function 'platformGridAPI.columns.configuration' the tree column disappears.
					// The following code repairs this defect.
					let treeColumn = _.find(cols, {id: 'tree'});
					if (treeColumn && treeColumn.hidden) {
						treeColumn.hidden = false;
					}

					return _.filter(cols, function (col) {
						return !_.isNil(col);
					});
				}

				function setIsDynamicColumnConfigChanged(value){
					data.isDynamicColumnConfigChanged = value;
				}
			}

			return {
				getService: function (estimateMainStandardConfigurationService, validationService, options) {
					return createNewComplete(estimateMainStandardConfigurationService, validationService, options);
				},
				createService: function (estimateMainStandardConfigurationService, validationService, options) {
					return createNewComplete(estimateMainStandardConfigurationService, validationService, options);
				}
			};

		}]);
})(angular);
