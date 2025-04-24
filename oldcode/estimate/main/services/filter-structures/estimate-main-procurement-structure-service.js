/**
 * Created by janas on 17.11.2015.
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainProcurementStructureService',
		['$injector','platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'estimateMainCreationService', 'estimateMainFilterService', 'estimateMainService',
			'estimateMainFilterCommon', 'estMainRuleParamIconProcess', 'platformGridAPI', '$timeout', 'cloudCommonGridService',
			function ($injector,platformDataServiceFactory, ServiceDataProcessArraysExtension, estimateMainCreationService, estimateMainFilterService, estimateMainService,
				estimateMainFilterCommon, estMainRuleParamIconProcess, platformGridAPI, $timeout, cloudCommonGridService) {

				let projectId = estimateMainService.getSelectedProjectId();
				let isReadData = false; // already send xhr to service
				let filterKey = 'PRC_STRUCTURE';

				let prcStructureServiceInfo = {
					hierarchicalRootItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainProcurementStructureService',
						httpRead: {
							route: globals.webApiBaseUrl + 'basics/procurementstructure/', endRead: 'tree',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.filter = '';
								isReadData = true; // mark sended xhr to service
								return readData;
							}
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), estMainRuleParamIconProcess],
						useItemFilter: true,
						presenter: {
							tree: {
								parentProp: 'PrcStructureFk',
								childProp: 'ChildItems',
								incorporateDataRead: function (readData, data) {
									data.isRoot = false;
									estimateMainFilterService.handleMarkStatus(filterKey, serviceContainer, readData.Main, 'ChildItems');
									let result = {
										FilterResult: readData.FilterResult,
										dtos: readData.Main || []
									};
									isReadData = false; // mark done xhr
									serviceContainer.data.handleReadSucceeded(result, data);
									if (estimateMainService.getHeaderStatus() || !estimateMainService.hasCreateUpdatePermission()) {
										if (data.itemList.length > 0) {
											_.forEach(data.itemList, function (item) {
												$injector.get('platformRuntimeDataService').readonly(item, [{ field: 'Rule', readonly: false }, { field: 'Param', readonly: false }]);
											});
										}
									}
									return serviceContainer.data.itemList;
								}
							}
						},
						entityRole: {root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							moduleName: 'Estimate Main',
							itemName: 'EstPrcStructure',
							handleUpdateDone: function (updateData, response) {
								estimateMainService.updateList(updateData, response);
							}
						}},
						actions: {} // no create/delete actions
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(prcStructureServiceInfo),
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

				// filter leading structure by line items
				estimateMainFilterService.addLeadingStructureFilterSupport(service, 'PrcStructureFk');

				serviceContainer.data.provideUpdateData = function (updateData) {
					return estimateMainService.getUpdateData(updateData);
				};

				service.creatorItemChanged = function creatorItemChanged(e, item) {
					if (!_.isEmpty(item)) {
						estimateMainCreationService.addCreationProcessor('estimateMainProcurementStructureService', function (creationItem) {
							creationItem.PrcStructureFk = item.Id;

							if(creationItem.DescStructure === 5 || !creationItem.validStructure || !creationItem.DescAssigned){
								creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
								if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
								creationItem.DescAssigned = creationItem.DescStructure === 5;
							}

							// from structure
							if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 5){
								// creationItem.DescriptionInfo = item.DescriptionInfo;
								creationItem.Quantity = item.Quantity;

								creationItem.WqQuantityTarget = item.Quantity;
								creationItem.WqQuantityTargetDetail = item.Quantity;

								creationItem.QuantityTarget  = item.Quantity;
								creationItem.QuantityTargetDetail= item.Quantity;

								creationItem.BasUomTargetFk = creationItem.BasUomFk = item.BasUomFk;
								creationItem.validStructure = true;
								creationItem.QtyTakeOverStructFk = 5;
							}
						});
					} else {
						estimateMainCreationService.removeCreationProcessor('estimateMainProcurementStructureService');
					}
				};

				service.markersChanged = function markersChanged(itemList) {
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allFilterIds = [];

						// get all childs (for each item)
						_.each(itemList, function (item) {
							let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'ChildItems'), 'Id');
							allFilterIds = allFilterIds.concat(Ids);
						});
						estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
						estimateMainFilterService.addFilter('estimateMainProcurementStructureTreeController', service, function (lineItem) {
							return allFilterIds.indexOf(lineItem.PrcStructureFk) >= 0;
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-prcstructure', captionId: 'filterPrcStucture'});
					} else {
						allFilterIds = [];
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.removeFilter('estimateMainProcurementStructureTreeController');
					}
				};

				service.loadPrcStructure = function (isFromNavigator) {
					// if project id change, then reload leading structure
					if (projectId !== estimateMainService.getSelectedProjectId() || service.getList().length <= 0) {
						projectId = estimateMainService.getSelectedProjectId();
						if (projectId && !isReadData) {
							service.load();
						}
					} else if(isFromNavigator === 'isForNagvitor'){
						service.load();
					}
				};

				return service;
			}]);
})();
