/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/* jslint nomen:true */


	/**
	 * @ngdoc service
	 * @name estimateMainControllingService
	 * @function
	 *
	 * @description
	 * estimateMainControllingService is the data service for all structure related functionality in Estimate.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainControllingService', ['$http','$injector','$timeout','platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'controllingStructureImageProcessor', 'estimateMainCreationService',
		'estimateMainFilterService', 'estimateMainService', 'estimateMainFilterCommon', 'estMainRuleParamIconProcess','platformGridAPI','cloudCommonGridService',
		function ($http,$injector,$timeout,platformDataServiceFactory, ServiceDataProcessArraysExtension, controllingStructureImageProcessor, estimateMainCreationService,
			estimateMainFilterService, estimateMainService, estimateMainFilterCommon, estMainRuleParamIconProcess,platformGridAPI,cloudCommonGridService) {

			let projectId = estimateMainService.getSelectedProjectId(),
				isReadData = false; // already send xhr to service

			let controllingStructureServiceOption = {
					hierarchicalRootItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainControllingService',
						httpRead: {
							route: globals.webApiBaseUrl + 'controlling/structure/',
							endRead: 'tree',
							initReadData: function (readData) {
								let projectId = estimateMainService.getSelectedProjectId();
								if (projectId) {
									readData.filter = '?mainItemId=' + projectId;
								}
								isReadData = true; // mark sended xhr to service
								return readData;
							}
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
						},
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'ControllingunitFk',
								childProp: 'ControllingUnits',
								incorporateDataRead: function (readData, data) {
									data.isRoot = false;
									isReadData = false; // mark done xhr
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

									if (filterIds.MDC_CONTROLLINGUNIT && _.isArray(filterIds.MDC_CONTROLLINGUNIT)) {
										let flatList = cloudCommonGridService.flatten(readData, [], 'ControllingUnits');
										let filterItem = _.filter(flatList, function (item) {
											return (multiSelect ? _.includes(filterIds.MDC_CONTROLLINGUNIT, item.Id) : item.Id === filterIds.MDC_CONTROLLINGUNIT[0]);
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

									data.handleReadSucceeded(readData ? readData : [], data);
									if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
										if (data.itemList.length > 0) {
											_.forEach(data.itemList, function (item) {
												$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
											});
										}
									}
									return data.itemList;
								}
							}
						},
						entityRole: {root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							moduleName: 'Estimate Main',
							itemName: 'EstCtu',
							handleUpdateDone: function (updateData, response) {
								estimateMainService.updateList(updateData, response);
							}
						}},
						actions: {}, // no create/delete actions
						dataProcessor: [
							new ServiceDataProcessArraysExtension(['ControllingUnits']), controllingStructureImageProcessor, estMainRuleParamIconProcess],
						translation: {
							uid: 'controllingStructureMainService',
							title: 'Translation',
							columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }]
						}
					}
				},

				serviceContainer = platformDataServiceFactory.createNewComplete(controllingStructureServiceOption),
				service = serviceContainer.service,
				allFilterIds = [];

			serviceContainer.data.doUpdate = null;
			service.addEntityToModified = function (){};

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
			service.setFilter('mainItemId=' + projectId);

			// filter leading structure by line items
			estimateMainFilterService.addLeadingStructureFilterSupport(service, 'MdcControllingUnitFk');

			serviceContainer.data.provideUpdateData = function (updateData) {
				return estimateMainService.getUpdateData(updateData);
			};

			service.creatorItemChanged = function creatorItemChanged(e, item) {
				if (!_.isEmpty(item)) {
					estimateMainCreationService.addCreationProcessor('estimateMainControllingListController', function (creationItem) {
						creationItem.MdcControllingUnitFk = item.Id;

						if(creationItem.DescStructure === 4 || !creationItem.validStructure || !creationItem.DescAssigned){
							creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
							if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
							creationItem.DescAssigned = creationItem.DescStructure === 4;
						}

						// from structure
						if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 4){

							creationItem.Quantity = item.Quantity;

							creationItem.WqQuantityTarget = item.Quantity;
							creationItem.WqQuantityTargetDetail = item.Quantity;

							creationItem.QuantityTarget  = item.Quantity;
							creationItem.QuantityTargetDetail= item.Quantity;

							creationItem.BasUomTargetFk = creationItem.BasUomFk = item.UomFk;
							creationItem.validStructure = true;
							creationItem.QtyTakeOverStructFk = 4;
						}
					});
				} else {
					estimateMainCreationService.removeCreationProcessor('estimateMainControllingListController');
				}
			};

			service.markersChanged = function markersChanged(itemList) {
				let filterKey = 'MDC_CONTROLLINGUNIT';

				if (_.isArray(itemList) && _.size(itemList) > 0) {
					allFilterIds = [];

					// get all child controlling units (for each item)
					_.each(itemList, function (item) {
						let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'ControllingUnits'), 'Id');
						allFilterIds = allFilterIds.concat(Ids);
					});
					estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
					estimateMainFilterService.addFilter('estimateMainControllingListController', service, function (lineItem) {
						return allFilterIds.indexOf(lineItem.MdcControllingUnitFk) >= 0;
					}, { id: filterKey, iconClass: 'tlb-icons ico-filter-controlling', captionId: 'filterControlling'}, 'MdcControllingUnitFk');
				} else {
					estimateMainFilterService.setFilterIds(filterKey, []);
					estimateMainFilterService.removeFilter('estimateMainControllingListController');
				}
			};

			service.loadControlling = function () {
				// if project id change, then reload leading structure
				if (projectId !== estimateMainService.getSelectedProjectId() || service.getList().length <= 0) {
					projectId = estimateMainService.getSelectedProjectId();
					service.setFilter('mainItemId=' + projectId);
					if (projectId && !isReadData) {
						service.load();
					}
				}
			};

			service.getControllingUnitById = function getControllingUnitById(mainItemId){
				return $http.post(globals.webApiBaseUrl + 'controlling/structure/getcontrollingunit?Id=' + mainItemId).then(function(response){
					if(response && response.data  ){
						return response.data;
					}else{
						return '';
					}
				});
			};

			return service;
		}]);
})();
