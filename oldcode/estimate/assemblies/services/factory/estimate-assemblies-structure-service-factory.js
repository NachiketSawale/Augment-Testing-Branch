/**
 * Created by lnt on 08.25.2021.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';
	let estimateAssembliesModule = angular.module('estimate.assemblies');

	/**
	 * @ngdoc service
	 * @name estimateAssembliesContainerInformationService
	 * @function
	 * @description
	 */
	estimateAssembliesModule.factory('estimateAssembliesStructureServiceFactory',
		['$translate', '_', '$timeout', 'platformGridAPI',
			'$injector',
			'platformDataServiceFactory',
			'estimateAssembliesCreationService',
			'estimateAssembliesAssemblyLookupDataService',
			'cloudCommonGridService',
			function ($translate, _, $timeout, platformGridAPI,
				$injector,
				platformDataServiceFactory,
				estimateAssembliesCreationService,
				estimateAssembliesAssemblyLookupDataService,
				cloudCommonGridService) {

				let factoryService = {};

				factoryService.createNewEstAssembliesStructureService = function createNewEstAssembliesStructureService(option) {
					let estimateAssembliesStructureProcessor = option.structureProcessor || {};

					let estimateAssembliesFilterService = $injector.get(option.assemblyFilterService);

					let serviceContainer = {};
					let service = {};
					// options
					let vRootEnabled = false; // TODO: disabled -> causes problems when creating new items

					let winEstassemblyCatId = null,
						catgridId = '';

					// The instance of the main service - to be filled with functionality below
					let estimateMainServiceOptions = {
						hierarchicalRootItem: {
							module: estimateAssembliesModule,
							serviceName: 'estimateAssembliesAssembliesStructureService',
							httpRead: {
								route: globals.webApiBaseUrl + 'estimate/assemblies/structure/',
								endRead: 'filtertree',
								usePostForRead: true,
								initReadData: function initReadData(filterRequest) {
									if (option && option.isPrjAssembly){
										let project = option.parent.getSelected();
										filterRequest.ProjectId = project && project.Version > 0 ? project.Id : null;
										filterRequest.IsPrjAssembly = true;
									}
									filterRequest.IsShowInLeading = 0;
									return filterRequest;
								}
							},
							httpCreate: {
								route: globals.webApiBaseUrl + 'estimate/assemblies/structure/'
							},
							httpDelete: {
								route: globals.webApiBaseUrl + 'estimate/assemblies/structure/'
							},
							httpUpdate: {
								route: globals.webApiBaseUrl + 'estimate/main/lineitem/'
							},
							presenter: {
								tree: {
									parentProp: 'EstAssemblyCatFk',
									childProp: 'AssemblyCatChildren',
									initCreationData: function initCreationData(creationData) {
										creationData.EstAssemblyCatFk = creationData.parentId;
										let list = service.getList();
										creationData.CodeItems = _.uniq(_.map(_.filter(list, {'Version': 0}), 'Code'));
									},
									incorporateDataRead: function (readData, data) {
										// expand the filter item and make it selected
										let filterIds = estimateAssembliesFilterService.getAllFilterIds();
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

										if (filterIds.ASSEMBLYCAT && _.isArray(filterIds.ASSEMBLYCAT)) {
											let flatList = cloudCommonGridService.flatten(readData, [], 'AssemblyCatChildren');
											let filterItem = _.filter(flatList, function (item) {
												return (multiSelect ? _.includes(filterIds.ASSEMBLYCAT, item.Id) : item.Id === filterIds.ASSEMBLYCAT[0]);
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

										let vRoot = readData;
										if (vRootEnabled) {
											// add virtual root item containing all activities
											vRoot = [{
												Id: 0,
												AssemblyCatChildren: readData,
												EstAssemblyCatFk: null,
												HasChildren: readData.length > 0,
												image: 'ico-folder-estimate'
											}];
										}

										// return data.handleReadSucceeded(vRoot, data);

										let estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
										let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
										// project assembly
										if (option && option.isPrjAssembly) {
											let project = option.parent.getSelected();
											let projectId = project ? project.Id : null;
											estimateRuleFormatterService.setSelectedProject(projectId);
											estimateParameterFormatterService.setSelectedProject(projectId);
										}

										return loadExtraDataAsync(readData).then(function () {
											data.handleReadSucceeded(vRoot, data);
											if (option.navigateAssemblyCategoryId) {
												winEstassemblyCatId = option.navigateAssemblyCategoryId;
												option.navigateAssemblyCategoryId = null;
											}
											return selectAssemblyCatItem();
										});

									},
									// add the rules information for new created items
									handleCreateSucceeded: function (newItem) {

										// the estHeaderFk should be loaded the first time the container is shown, so we have it here
										newItem.EstHeaderFk = $injector.get('estimateAssembliesRuleFormatterService').getAssemblyCategoryEstHeaderFk();
										newItem.Rule = [];
										newItem.RuleRelationServiceNames = {
											m: 'estimateAssembliesAssembliesStructureService',
											r: 'estimateAssembliesCategoryMdcRuleRelationService',
											mainEntityIsNew: true
										};

										return newItem;
									}
								}
							},
							dataProcessor: option.dataProcessor,
							entityRole: {
								root: {
									codeField: 'Code',
									descField: 'Description',
									itemName: 'EstAssemblyCat',
									moduleName: 'estimate.assemblies.containers.assemblyStructure',
									handleUpdateDone: function (updateData, response, data) {
										if (updateData.EstAssemblyCat) {
											service.refreshAssemblyCategoryLookup({updated: updateData.EstAssemblyCat});
										}
										$injector.get('estimateAssembliesService').updateList(updateData, response);
										data.handleOnUpdateSucceeded(updateData, response, data, true);
										service.gridRefresh();
									}
								}
							},
							translation: {
								uid: 'estimateAssembliesAssembliesStructureService',
								title: 'estimate.assemblies.containers.assemblyStructure',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
								dtoScheme: {
									typeName: 'EstAssemblyCatDto',
									moduleSubModule: 'Estimate.Assemblies'
								}
							}
						}
					};

					if (option && option.isPrjAssembly) {
						if (_.isObject(option.parent)) {
							// Change the role from 'root' to 'node'
							// Shift to hierarchicalNodeItem
							estimateMainServiceOptions.hierarchicalNodeItem = estimateMainServiceOptions.hierarchicalRootItem;
							delete estimateMainServiceOptions.hierarchicalRootItem; // Delete old property

							// Shift entityRole from 'root' to 'node'
							estimateMainServiceOptions.hierarchicalNodeItem.entityRole.node = estimateMainServiceOptions.hierarchicalNodeItem.entityRole.root;
							estimateMainServiceOptions.hierarchicalNodeItem.entityRole.node.parentService = option.parent; // Hand over the nodes parent service.
							delete estimateMainServiceOptions.hierarchicalNodeItem.entityRole.root;  // Delete old property
							estimateMainServiceOptions.hierarchicalNodeItem.entitySelection = {supportsMultiSelection: false}; // Enable multiple selection
						}

						if (option.serviceName) {
							estimateMainServiceOptions.hierarchicalNodeItem.serviceName = option.serviceName;
						}
					}

					serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainServiceOptions);
					serviceContainer.data.fireSelectionChangedEventAlways = false;
					if (!option.isPrjAssembly) {
						serviceContainer.data.provideUpdateData = $injector.get('estimateAssembliesService').provideUpdateData;
					}

					service = serviceContainer.service;
					service.getContainerData = function getContainerData() {
						return serviceContainer.data;
					};
					let allFilterIds = [];

					let collectAssemblyCatIds = function (assemblyItem, resultArr) {
						resultArr.push(assemblyItem.Id);
						_.each(assemblyItem.AssemblyCatChildren, function (item) {
							collectAssemblyCatIds(item, resultArr);
						});
					};

					service.creatorItemChanged = function creatorItemChanged(e, item) {
						if (!_.isEmpty(item)) {
							if (option.isPrjAssembly){
								estimateAssembliesCreationService.addCreationProcessor('projectAssemblyStructureService', function (creationItem) {
									creationItem.EstAssemblyCatFk = item.Id;
									creationItem.CodePrefix = item.Code;
								});
							} else {
								estimateAssembliesCreationService.addCreationProcessor('estimateAssembliesAssembliesStructureService', function (creationItem) {
									creationItem.EstAssemblyCatFk = item.Id;
									creationItem.CodePrefix = item.Code;
								});
							}
						} else {
							if (option.isPrjAssembly){
								estimateAssembliesCreationService.removeCreationProcessor('projectAssemblyStructureService');
							} else {
								estimateAssembliesCreationService.removeCreationProcessor('estimateAssembliesAssembliesStructureService');
							}
						}
					};
					service.markersChanged = function markersChanged(itemList) {
						if (_.isArray(itemList) && _.size(itemList) > 0) {
							allFilterIds = [];
							// get all child controlling units (for each item)
							_.each(itemList, function (item) {
								let Ids = [];
								collectAssemblyCatIds(item, Ids); // get all child assemblies categories
								allFilterIds = allFilterIds.concat(Ids);
							});
							estimateAssembliesFilterService.setFilterIds('ASSEMBLYCAT', allFilterIds);
							estimateAssembliesFilterService.addFilter('estimateAssembliesAssembliesStructureService', service, function (lineItem) {
								return allFilterIds.indexOf(lineItem.EstAssemblyCatFk) >= 0;
							}, {
								id: 'filterAssemblyCat',
								iconClass: 'tlb-icons ico-filter-assembly-cat'
							}, 'EstAssemblyCatFk');
						} else {
							allFilterIds = [];
							estimateAssembliesFilterService.setFilterIds('ASSEMBLYCAT', []);
							estimateAssembliesFilterService.removeFilter('estimateAssembliesAssembliesStructureService');
						}
					};

					service.updateList = function updateList(updateData, response) {
						serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
					};

					let onDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function onDeleteDoneSucceeded(data) {
						onDeleteDone.apply(serviceContainer.data, arguments);
						service.refreshAssemblyCategoryLookup({deleted: data.entity});
					};

					service.refreshAssemblyCategoryLookup = function refreshAssemblyCategoryLookup(data) {
						if (data.deleted || data.updated) {
							$injector.get('estimateAssembliesCategoryLookupDataService').reload(); // Reload assembly category lookup
							estimateAssembliesAssemblyLookupDataService.getList({lookupType: 'estimateAssembliesAssemblyLookupDataService'}).then(function (list) {
								let index = -1;
								if (data.deleted) {
									index = getIndex(data.deleted.Id);
									if (index > -1) {
										list.splice(index, 1);
									}
								}
								if (data.updated) {
									index = getIndex(data.updated.Id);
									if (index === -1) {
										list.push(data.updated);
									} else {
										list[index].Code = data.updated.Code;
										list[index].DescriptionInfo.Translated = data.updated.DescriptionInfo.Translated;
									}
								}

								function getIndex(id) {
									return _.findIndex(list, function (item) {
										return item.Id === id;
									});
								}
							});
						}
						$injector.get('estimateAssembliesService').gridRefresh();
					};

					if (option && !option.isPrjAssembly) {
						service.load();
					}

					// cell change event
					service.onCellChange = function onCellChange( arg ) {
						// estimateAssembliesStructureProcessor.processItem(service.getSelected());
						let item = arg.item,
							col = arg.grid.getColumns()[arg.cell].field;
						if(option && option.isPrjAssembly && col ==='Rule') {
							let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
							let projectId = option.parent.getSelected() ? option.parent.getSelected().Id : 0;
							let estHeaderFk = item.EstHeaderFk;
							let ruleToDelete = estimateRuleFormatterService.getRuleToDelete('EstAssemblyCatRuleToDelete');
							if (ruleToDelete && ruleToDelete.length > 0) {
								let delOption = {
									entity: item,
									itemName: 'EstAssemblyCat',
									mainServiceName: option.serviceName,
									isPrjAssembly: option.isPrjAssembly,
									projectId: projectId,
									estHeaderFk: estHeaderFk,
									ruleToDelete: ruleToDelete
								};
								estimateRuleFormatterService.deleteParamByRule(delOption);
							}
						}
					};

					// check if it is readonly
					let isReadOnlyForAssemblyType = function isReadOnlyForAssemblyType(assemblyTypeLogic) {
						return assemblyTypeLogic !== 2;
					};

					// find parent assembly type
					let checkParentAssemblyType = function checkParentAssemblyType(item, treedata) {
						if (item && item.EstAssemblyCatFk) {
							let parent = _.find(treedata, {Id: item.EstAssemblyCatFk});
							return checkParentAssemblyType(parent, treedata);
						}
						return item;
					};

					service.onRowChange = function onRowChange(entity) {
						let list = service.getTree();
						let flatlist = cloudCommonGridService.flatten(list, [], 'AssemblyCatChildren');
						let parent = checkParentAssemblyType(entity, flatlist);
						if (parent) {
							let isReadOnly = isReadOnlyForAssemblyType(parent.EstAssemblyTypeLogicFk);
							estimateAssembliesStructureProcessor.setColumnReadOnly(entity, 'MaxValue', isReadOnly);
							estimateAssembliesStructureProcessor.setColumnReadOnly(entity, 'MinValue', isReadOnly);
						}
					};

					service.setWinEstAssemblyItem = function setWinEstAssemblyItem(catId) {
						winEstassemblyCatId = catId;
					};

					// promise
					function loadExtraDataAsync(treeList) {
						let promises = [];

						let promiseRules = $injector.get('estimateAssembliesRuleFormatterService').loadRuleRelationsTreeAsync(
							treeList,
							'estimateAssembliesAssembliesStructureService',
							'estimateAssembliesCategoryMdcRuleRelationService',
							{childProp: 'AssemblyCatChildren'}
						);

						promises.push(promiseRules);

						return $injector.get('$q').all(promises);
					}

					function selectAssemblyCatItem() {
						$timeout(function () {
							if (_.isNumber(winEstassemblyCatId)) {
								let item = service.getItemById(winEstassemblyCatId);
								if (_.isObject(item)) {
									service.setSelected(item);
								}
							}
						});
					}

					service.navigateToAssemblyCategory = function (item, triggerField) {
						if (_.isNumber(item[triggerField])) {
							let category = service.getItemById(item[triggerField]);
							if (_.isObject(category)) {
								service.setSelected(category);
							} else {
								winEstassemblyCatId = item[triggerField];
							}
						}
					};

					service.getGridId = function getGridId() {
						return catgridId;
					};

					service.setGridId = function setGridId(gridId) {
						catgridId = gridId;
					};

					service.getItemName = function(){
						return 'EstAssemblyCat';
					};

					service.fireListLoaded = function fireListLoaded() {
						serviceContainer.data.listLoaded.fire();
					};

					service.updateList = function updateList(data) {

						let itemListResponse = angular.copy(data)

						let updateTree = function updateTree(list) {
							_.forEach(list, function (oldItem) {
								if (oldItem) {
									let updatedItem = _.find(itemListResponse, { Id: oldItem.Id });
									if (updatedItem) {
										updatedItem.AssemblyCatChildren = oldItem.AssemblyCatChildren;
										angular.extend(oldItem, updatedItem);
									}
									if (oldItem.HasChildren) {
										updateTree(oldItem.AssemblyCatChildren);
									}
								}
							});
						};

						updateTree(serviceContainer.data.itemTree);

						service.fireListLoaded();
					};

					return serviceContainer;
				};

				return factoryService;

			}]);
})();
