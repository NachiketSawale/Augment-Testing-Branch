/**
 * Created by janas on 12.03.2015.
 */

(function () {
	/* global globals, _, Platform */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainLocationService',
		['$injector','$timeout','platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'estimateMainCreationService', 'estimateMainFilterService', 'estimateMainService', 'projectLocationMainImageProcessor',
			'estimateMainFilterCommon', 'estMainRuleParamIconProcess','platformGridAPI','cloudCommonGridService',
			function ($injector,$timeout,platformDataServiceFactory, ServiceDataProcessArraysExtension, estimateMainCreationService, estimateMainFilterService, estimateMainService, projectLocationMainImageProcessor,
				estimateMainFilterCommon, estMainRuleParamIconProcess,platformGridAPI,cloudCommonGridService) {

				let projectId = estimateMainService.getSelectedProjectId();
				let isReadData = false; // already send xhr to service

				let locationServiceInfo = {
					hierarchicalRootItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainLocationService',
						httpRead: {
							route: globals.webApiBaseUrl + 'project/location/',
							endRead: 'tree',
							initReadData: function (readData) {
								let projectId = estimateMainService.getSelectedProjectId();
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
						dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor, estMainRuleParamIconProcess],
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'LocationParentFk', childProp: 'Locations',
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

									if (filterIds.PRJ_LOCATION && _.isArray(filterIds.PRJ_LOCATION)) {
										let flatList = cloudCommonGridService.flatten(readData, [], 'Locations');
										let filterItem = _.filter(flatList, function (item) {
											return (multiSelect ? _.includes(filterIds.PRJ_LOCATION, item.Id) : item.Id === filterIds.PRJ_LOCATION[0]);
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
							itemName: 'EstPrjLocation',
							handleUpdateDone: function (updateData, response) {
								estimateMainService.updateList(updateData, response);
							}}},
						actions: {} // no create/delete actions
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(locationServiceInfo),
					service = serviceContainer.service,
					allFilterIds = [];

				service.setFilter('projectId=' + (projectId ? projectId : -1));

				// filter leading structure by line items
				estimateMainFilterService.addLeadingStructureFilterSupport(service, 'PrjLocationFk');

				serviceContainer.data.provideUpdateData = function (updateData) {
					return estimateMainService.getUpdateData(updateData);
				};

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

				service.creatorItemChanged = function creatorItemChanged(e, item) {
					if (!_.isEmpty(item)) {
						estimateMainCreationService.addCreationProcessor('estimateMainLocationListController', function (creationItem) {
							creationItem.PrjLocationFk = item.Id;

							if(creationItem.DescStructure === 3 || !creationItem.validStructure || !creationItem.DescAssigned){
								creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
								if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
								creationItem.DescAssigned = creationItem.DescStructure === 3;
							}

							// from structure
							if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 3){
								// creationItem.DescriptionInfo = item.DescriptionInfo;
								creationItem.Quantity = item.Quantity;

								creationItem.WqQuantityTarget = item.Quantity;
								creationItem.WqQuantityTargetDetail = item.Quantity;

								creationItem.QuantityTarget  = item.Quantity;
								creationItem.QuantityTargetDetail= item.Quantity;

								creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
								creationItem.validStructure = true;
								creationItem.QtyTakeOverStructFk = 3;
							}
						});
					} else {
						estimateMainCreationService.removeCreationProcessor('estimateMainLocationListController');
					}
				};

				service.filterLocationItem = new Platform.Messenger();
				service.registerFilterLocationItem = function (callBackFn) {
					service.filterLocationItem.register(callBackFn);
				};
				service.unregisterFilterLocationItem = function (callBackFn) {
					service.filterLocationItem.unregister(callBackFn);
				};

				service.markersChanged = function markersChanged(itemList) {
					let filterKey = 'PRJ_LOCATION';

					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allFilterIds = [];

						// get all child locations (for each item)
						_.each(itemList, function (item) {
							let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'Locations'), 'Id');
							allFilterIds = allFilterIds.concat(Ids);
						});
						estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
						estimateMainFilterService.addFilter('estimateMainLocationListController', service, function (lineItem) {
							return allFilterIds.indexOf(lineItem.PrjLocationFk) >= 0;
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-location', captionId: 'filterLocation'});
					} else {
						allFilterIds = [];
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.removeFilter('estimateMainLocationListController');
					}

					service.filterLocationItem.fire();
				};

				service.loadLocation = function (isFromNavigator) {
					// if project id change, then reload leading structure
					if (projectId !== estimateMainService.getSelectedProjectId() ||  service.getList().length <= 0) {
						projectId = estimateMainService.getSelectedProjectId();
						service.setFilter('projectId=' + projectId);
						if (projectId && !isReadData) {
							service.load();
						}
					}
					else{
						if(isFromNavigator === 'isForNagvitor'){
							service.load();
						}
					}
				};

				return service;
			}]);
})();
