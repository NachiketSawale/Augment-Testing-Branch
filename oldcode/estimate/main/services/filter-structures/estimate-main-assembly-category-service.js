/**
 * Created by janas on 23.07.2015.
 */

/* global globals */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	let estimateMainModule = angular.module(moduleName);
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainAssembliesCategoryService',
		['_', '$translate','$injector', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'estimateAssembliesStructureImageProcessor', 'estimateMainFilterService', 'estimateMainFilterCommon',
			'estimateMainService', 'estimateMainCreationService', 'estimateProjectRateBookConfigDataService', 'estMainRuleParamIconProcess',
			function (_, $translate,$injector, platformDataServiceFactory, ServiceDataProcessArraysExtension, estimateAssembliesStructureImageProcessor, estimateMainFilterService, estimateMainFilterCommon,
				estimateMainService, estimateMainCreationService, estimateProjectRateBookConfigDataService, estMainRuleParamIconProcess) {

				// options
				let vRootEnabled = false,
					isReadData = false; // already send xhr to service
				let filterKey = 'EST_ASSEMBLY_CAT';


				// The instance of the main service - to be filled with functionality below
				let assemblyCategoryServiceOptions = {
					hierarchicalRootItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainAssembliesCategoryService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/assemblies/structure/',
							endRead: 'treeForLookup', // 'filtertree',
							usePostForRead: true,
							initReadData: function initReadData(filterRequest) {
								// master data filter
								let projectId = estimateProjectRateBookConfigDataService.getProjectId();
								if(projectId && projectId > 0) {
									filterRequest.ProjectId = projectId;
								}
								filterRequest.IsShowInLeading = 1;
								isReadData = true; // mark sended xhr to service
								return filterRequest;
							}
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
						},
						presenter: {
							tree: {
								parentProp: 'EstAssemblyCatFk',
								childProp: 'AssemblyCatChildren',
								incorporateDataRead: function (readData, data) {
									data.isRoot = false;
									isReadData = false; // mark done xhr
									if (vRootEnabled) {
										// add virtual root item containing all activities
										let vRoot = {
											Id: 0,
											AssemblyCatChildren: readData,
											EstAssemblyCatFk: null,
											HasChildren: readData.length > 0,
											image: 'ico-folder-estimate'
										};
										return data.handleReadSucceeded([vRoot], data);
									} else {
										estimateMainFilterService.handleMarkStatus(filterKey, serviceContainer, readData, 'AssemblyCatChildren');
										data.handleReadSucceeded(readData, data);
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
							}
						},
						useItemFilter: true,
						entityRole: {root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							itemName: 'EstAssemblyCat',
							handleUpdateDone: function (updateData, response) {
								estimateMainService.updateList(updateData, response);
							}}},
						actions: {}, // no create/delete actions
						entitySelection: {},
						dataProcessor: [new ServiceDataProcessArraysExtension(['AssemblyCatChildren']), estimateAssembliesStructureImageProcessor, estMainRuleParamIconProcess],
						translation: {
							uid: 'estimateMainAssembliesCategoryService',
							title: 'estimate.main.assemblyCategoryContainer',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(assemblyCategoryServiceOptions);
				let service = serviceContainer.service,
					allFilterIds = [];


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
				estimateMainFilterService.addLeadingStructureFilterSupport(service, 'EstAssemblyCatFk');

				serviceContainer.data.provideUpdateData = function (updateData) {
					// get estimate assembly rules to save
					return estimateMainService.getUpdateData(updateData);
				};

				serviceContainer.data.showHeaderAfterSelectionChanged = null; // disable hint text updating the main heading title

				service.creatorItemChanged = function creatorItemChanged(e, item) {
					if (!_.isEmpty(item)) {
						estimateMainCreationService.addCreationProcessor('estimateMainAssemblyCategoryTreeController', function (creationItem) {
							creationItem.EstAssemblyCatFk = item.Id;

							if(creationItem.DescStructure === 16 || !creationItem.validStructure || !creationItem.DescAssigned){
								creationItem.DescriptionInfo = angular.copy(item.DescriptionInfo);
								if(creationItem.DescriptionInfo){ creationItem.DescriptionInfo.DescriptionTr = null;}
								creationItem.DescAssigned = creationItem.DescStructure === 16;
							}

							if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 16){
								// creationItem.DescriptionInfo = item.DescriptionInfo;
								creationItem.Quantity = item.Quantity;

								creationItem.WqQuantityTarget = item.Quantity;
								creationItem.WqQuantityTargetDetail = item.Quantity;

								creationItem.QuantityTarget  = item.Quantity;
								creationItem.QuantityTargetDetail= item.Quantity;

								creationItem.BasUomTargetFk = creationItem.BasUomFk = item.UomFk;
								creationItem.validStructure = true;
								creationItem.QtyTakeOverStructFk = 16;
							}
						});

						// focus on assembly structure, to load assembly
						let estimateMainWicRelateAssemblyService = $injector.get('estimateMainWicRelateAssemblyService');
						if(estimateMainWicRelateAssemblyService.getCurrentFilterType() === 'filterByAssemblyCat') {
							if (item && item.Id) {
								estimateMainWicRelateAssemblyService.load();
							}
							else {
								estimateMainWicRelateAssemblyService.updateList([]);
							}
						}

					} else {
						estimateMainCreationService.removeCreationProcessor('estimateMainAssemblyCategoryTreeController');
					}
				};

				service.markersChanged = function markersChanged(itemList) {
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						allFilterIds = [];

						// get all child assemblies (for each item)
						_.each(itemList, function (item) {
							let Ids = _.map(estimateMainFilterCommon.collectItems(item, 'AssemblyCatChildren'), 'Id');
							allFilterIds = allFilterIds.concat(Ids);
						});
						allFilterIds = _.uniq(allFilterIds);
						estimateMainFilterService.setFilterIds(filterKey, allFilterIds);
						estimateMainFilterService.addFilter('estimateMainAssemblyCategoryTreeController', service, function (lineItem) {
							return allFilterIds.indexOf(lineItem.EstAssemblyCatFk) >= 0;
						}, {id: filterKey, iconClass: 'tlb-icons ico-filter-assembly-cat', captionId: 'filterAssemblyCat' }, 'EstAssemblyCatFk');
					} else {
						estimateMainFilterService.setFilterIds(filterKey, []);
						estimateMainFilterService.removeFilter('estimateMainAssemblyCategoryTreeController');
					}
				};

				let estHeaderId = estimateMainService.getSelectedEstHeaderId();

				service.loadAssemblyCatalog = function (isFromNavigator) {
					// if estHeaderId id change, then reload leading structure
					// estHeader change, should reload for the rule and param
					if (estHeaderId !== estimateMainService.getSelectedEstHeaderId() || service.getList().length <= 0) {
						estHeaderId = estimateMainService.getSelectedEstHeaderId();
						if (estHeaderId && !isReadData) {
							service.load();
						}
					} else if(isFromNavigator === 'isForNagvitor'){
						service.load();
					}
				};

				// when do this action, will reload data when 'onContextUpdated' event trigger
				service.resetEstHeaderId = function () {
					estHeaderId = null;
				};

				return service;
			}]);
})();
