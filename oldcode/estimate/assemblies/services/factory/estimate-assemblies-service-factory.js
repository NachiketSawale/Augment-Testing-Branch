/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _, Platform */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);

	estimateAssembliesModule.factory('estimateAssembliesServiceFactory', ['$http', '$injector', 'platformGridAPI', 'cloudCommonGridService', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateAssembliesCreationService',
		'estimateMainExchangeRateService', '$timeout', 'basicsLookupdataLookupFilterService',
		'estimateParameterFormatterService', 'estimateParamUpdateService', 'estimateAssembliesRuleUpdateService', 'platformModalService', '$translate', 'estAssemblyRuleParamIconProcess',
		function (
			$http, $injector, platformGridAPI, cloudCommonGridService, PlatformMessenger, platformDataServiceFactory, estimateAssembliesCreationService,
			estimateMainExchangeRateService, $timeout, basicsLookupdataLookupFilterService,
			estimateParameterFormatterService, estimateParamUpdateService, estimateAssembliesRuleUpdateService, platformModalService, $translate, estAssemblyRuleParamIconProcess) {

			let factoryService = {};
			factoryService.createNewEstAssemblyListService = function createNewEstAssemblyListService(option) {

				let estimateAssembliesFilterService = !option.isPlantAssembly || !option.isPrjPlantAssembly ? $injector.get(option.assemblyFilterService) : null;
				let assemblyDynamicUserDefinedColumnService = option && option.assemblyDynamicUserDefinedColumnService ? option.assemblyDynamicUserDefinedColumnService : null;
				let assemblyResourceDynamicUserDefinedColumnService = option && option.assemblyResourceDynamicUserDefinedColumnService ? option.assemblyResourceDynamicUserDefinedColumnService : null;

				let estimateAssembliesProcessor = option && option.estimateAssembliesProcessor ? option.estimateAssembliesProcessor:null;

				// use to filter cost group or others
				let lineItemContext = null,
					winEstassemblyItem = {};
				let isUpdateDataByParameter = false; // if update data by function updatedetailsparameters ,no need update again,the value is false
				let selectedEstHeaderFk = null,
					assemblyIdToSelect,
					detailsParamAlwaysSave = '',
					// the top category which assembly belong to
					assemblyCategory = {Id: 0},
					isAssembly = false,
					isPrjAssembly = false,
					assemblyGridId = '',
					companyCurrency = null,
					assemblyResources = [],
					isPlantAssembly = false,
					isPrjPlantAssembly = false,
					considerDisabledDirect = false,
					cacheExchangeProjectId = -1,
					lazyLoadCostCodeSystemOption = false;

				// The instance of the main service - to be filled with functionality below
				let estimateMainServiceOptions = {
					flatRootItem: {
						module: option.module,
						serviceName: option ? option.serviceName : 'estimateAssembliesService',
						entityNameTranslationID: 'estimate.assemblies.containers.assemblies',
						httpCreate: {route: globals.webApiBaseUrl + 'estimate/assemblies/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/assemblies/',
							endRead: 'listfiltered',
							usePostForRead: true,
							extendSearchFilter: function extendSearchFilter(filterRequest) {
								// init furtherFilters - add filter IDs from filter structures
								if (_.isNumber(assemblyIdToSelect)) {
									filterRequest.PKeys = [assemblyIdToSelect];
								}

								let filterType = estimateAssembliesFilterService.getFilterFunctionType();
								let allFilterIds = estimateAssembliesFilterService.getAllFilterIds();
								filterRequest.furtherFilters = _.filter(_.map(allFilterIds, function (v, k) {
									if (_.size(v) === 0) {
										return undefined;
									}
									// type 0 - assigned;
									// -> no change needed

									// type 1 - assigned and not assigned
									if (filterType === 1) {
										v.push('null');
									}
									// type 2 - not assigned
									else if (filterType === 2) {
										v = ['null'];
									}
									let value = v.join(',');
									return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
								}), angular.isDefined);

								estimateAssembliesFilterService.setFilterRequest(filterRequest);
							}
						},
						httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/'},
						httpDelete: {route: globals.webApiBaseUrl + 'estimate/assemblies/'},
						entityRole: {
							root: {
								codeField: 'Code',
								descField: 'Description',
								itemName: 'EstLineItems',
								moduleName: 'cloud.desktop.moduleDisplayNameEstimateAssemblies',
								handleUpdateDone: function (updateData, response, data) {
									estimateParamUpdateService.clear();
									estimateAssembliesRuleUpdateService.clear();
									estimateParameterFormatterService.handleUpdateDone(response);

									// handle updated lineitem and resource user defined price column value
									if(assemblyDynamicUserDefinedColumnService){
										let userDefinedColumnService = $injector.get(assemblyDynamicUserDefinedColumnService);

										if(angular.isArray(response.UserDefinedcolsOfLineItemModified)){
											userDefinedColumnService.attachUpdatedValueToColumn(response.EstLineItems, response.UserDefinedcolsOfLineItemModified, true);
										}

										if(response.UserDefinedcolsOfLineItemToUpdate){
											userDefinedColumnService.handleUpdateDone(response.UserDefinedcolsOfLineItemToUpdate);
										}
									}

									if(assemblyResourceDynamicUserDefinedColumnService){
										let resourceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);

										if(angular.isArray(response.UserDefinedcolsOfResourceModified) && response.UserDefinedcolsOfResourceModified.length > 0 && angular.isArray(response.EstResourceToSave)){
											let resourceEntities = _.map(response.EstResourceToSave,'EstResource');
											resourceUserDefinedColumnService.attachUpdatedValueToColumn(resourceEntities, response.UserDefinedcolsOfResourceModified, true);
										}
									}

									if(response.UserDefinedcolsOfResourceToUpdate && assemblyResourceDynamicUserDefinedColumnService){
										let resourceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);
										resourceUserDefinedColumnService.handleUpdateDone(response.UserDefinedcolsOfResourceToUpdate);
									}

									data.handleOnUpdateSucceeded(updateData, response, data, true);

									if (!option.isPlantAssembly && !option.isPrjPlantAssembly && option.serviceName) {
										serviceContainer.data.listLoaded.fire();
										let selectedItem = serviceContainer.service.getSelected();
										serviceContainer.service.setSelected({}).then(function(){
											serviceContainer.service.setSelected(selectedItem);
										});

									}

									if(!option.isPlantAssembly && !option.isPrjPlantAssembly && option.structureServiceName){
										let isAssemblyStructureContianerExist = platformGridAPI.grids.exist('179D44D751834DABB06EF4BA1F425D3C');
										if (!isAssemblyStructureContianerExist) {
											if (updateData.EstAssemblyCat) {
												$injector.get(option.structureServiceName).refreshAssemblyCategoryLookup({updated: updateData.EstAssemblyCat});
											}
											$injector.get(option.structureServiceName).updateList(updateData, response);
											$injector.get(option.structureServiceName).gridRefresh();
										}
										service.onUpdated.fire(updateData, response);
										if (response.EstAssemblyCat) {
											$injector.get(option.structureServiceName).gridRefresh();
										}
									}

									if (response.EstResourceToSave && response.EstResourceToSave.length > 0) {
										let estimateAssembliesResourceService = $injector.get('estimateAssembliesResourceService');
										estimateAssembliesResourceService.handleUpdateDone(response.EstResourceToSave);
										let selectedItem = serviceContainer.service.getSelected();
										serviceContainer.service.setSelected({}).then(function(){
											serviceContainer.service.setSelected(selectedItem);
										});
									}
								}
							}
						},
						entitySelection: {supportsMultiSelection: true},
						useItemFilter: true,
						dataProcessor: [estimateAssembliesProcessor, estAssemblyRuleParamIconProcess],
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									estimateAssembliesCreationService.processItem(creationData);
									if (option.structureServiceName) {
										let catalogSelected = $injector.get(option.structureServiceName).getSelected();
										creationData.EstAssemblyCatFk = catalogSelected ? catalogSelected.Id : null;
									}

									if (option && (option.isPrjAssembly || option.isPrjPlantAssembly)) {
										creationData.IsPrjAssembly = option.isPrjAssembly;
										creationData.IsPrjPlantAssembly = option.isPrjPlantAssembly;
										creationData.ProjectId = option.parent.getSelected().Id;
									}

									if (option && option.isPlantAssembly) {
										creationData.IsPlantAssembly = option.isPlantAssembly;
										let selected = option.parent.getSelected();
										let rootParentSelected = option.rootParentService ? option.rootParentService.getSelected() : null;
										creationData.EstHeaderFk = selected.PlantEstimationHeaderFk;
										creationData.UomFk = selected.UomFk;
										creationData.DescriptionInfo = rootParentSelected ? rootParentSelected.DescriptionInfo : null;
									}
									let selectedItem = serviceContainer.service.getSelected();
									if (selectedItem && selectedItem.Id > 0) {
										creationData.estHeaderFk = selectedItem.EstHeaderFk;
										creationData.selectedItem = selectedItem;
									}
								},
								incorporateDataRead: function (readData, data) {
									let estResourceTypeLookupService = $injector.get('estimateMainResourceTypeLookupService');
									if (estResourceTypeLookupService) {
										estResourceTypeLookupService.loadLookupData();
									}

									$injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
										basicsCostGroupAssignmentService.process(readData, service, {
											mainDataName: 'dtos',
											attachDataName: 'Assembly2CostGroups',
											dataLookupType: 'Assembly2CostGroups',
											identityGetter: function identityGetter(entity) {
												return {
													EstHeaderFk: entity.RootItemId,
													Id: entity.MainItemId
												};
											}
										});
									}]);

									service.setIsUpdateDataByParameter(false);
									service.setCompanyCurrency(readData.CompanyCurrency);

									if (option && !(option.isPrjAssembly || option.isPlantAssembly || option.isPrjPlantAssembly)) {
										let estimateRuleService = $injector.get('estimateAssembliesRuleService');
										if (estimateRuleService) {
											estimateRuleService.refresh();
										}

									}

									// fix defect 88659, The unnamed parameter still could be saved in Estimate
									let estimateMainRuleUpdateService = $injector.get('estimateMainRuleUpdateService');
									if (estimateMainRuleUpdateService) {
										estimateMainRuleUpdateService.clear();
									}

									let estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
									estimateMainParameterValueLookupService.clear();

									estimateParamUpdateService.clear();

									// refresh the rule and parameter for formatter
									let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
									if (estimateRuleFormatterService) {
										estimateRuleFormatterService.refresh();
									}
									estimateParameterFormatterService.refresh(option && (option.isPrjAssembly || option.isPlantAssembly || option.isPrjPlantAssembly));

									$injector.get('estimateMainResourceAssemblyLookupService').clear();

									// Todo, below code to build assembly's rule is not good, adn the code is hard to understand
									// the right solution can accord the boq module,
									// both rule and parameter assignment refreshed and used the response data
									$injector.get('estimateAssembliesRuleFormatterService')
										.loadRuleRelationsAsync(readData.dtos, 'estimateAssembliesService', 'estimateAssembliesMdcRuleRelationService')
										.then(function () {
											let result = serviceContainer.data.handleReadSucceeded(readData, data);
											if(option.navigateAssemblyId) {
												assemblyIdToSelect = option.navigateAssemblyId;
												option.navigateAssemblyId = null;
											}
											selectAssembly();
											service.setContext(readData.lineItemContext);

											if(service.setReadOnlyByVersionJob && _.isFunction(service.setReadOnlyByVersionJob)){
												service.setReadOnlyByVersionJob(readData.dtos);
											}

											if(assemblyDynamicUserDefinedColumnService){
												let userDefinedColumnService = $injector.get(assemblyDynamicUserDefinedColumnService);

												userDefinedColumnService.attachDataToColumn(data.getList());
											}

											return result;
										});

									// project assembly
									if (option && (option.isPrjAssembly || option.isPrjPlantAssembly )) {
										let project = option.parent.getSelected();
										let projectId = project ? project.Id : null;
										estimateRuleFormatterService.setSelectedProject(projectId);
										$injector.get('estimateMainJobCostcodesLookupService').setSelectedProjectId(projectId);
									}

									// set system option Consider Disabled Direct
									if(Object.hasOwnProperty.call(readData,'DoConsiderDisabledDirect')){
										considerDisabledDirect = _.get(readData, 'DoConsiderDisabledDirect');
									}

									if (Object.hasOwnProperty.call(readData, 'lazyLoadCostCode')){
										lazyLoadCostCodeSystemOption = _.get(readData, 'lazyLoadCostCode');
									}

									// set assembly rounding configuration data
									if(Object.hasOwnProperty.call(readData,'AssemblyRoundingConfigDetails')){
										let assemblyRoundingConfigDetails = _.get(readData, 'AssemblyRoundingConfigDetails');
										$injector.get('estimateMainRoundingDataService').setEstRoundingConfigData(assemblyRoundingConfigDetails);
									}

									if(service.loadFilterMenu && _.isFunction(service.loadFilterMenu)){
										service.loadFilterMenu(readData.highlightJobIds).then(function () {
											if(service.setReadOnlyByVersionJob && _.isFunction(service.setReadOnlyByVersionJob)){
												service.setReadOnlyByVersionJob(readData.dtos);
											}
										});
									}

									// clear cacheids
									$injector.get('estimateAssembliesCalculationService').clearCacheIds();

									// load the exchange rate
									if (!option.isPlantAssembly) {
										service.clearOldRates();
									}
								},

								// add the rule's information for new created items
								handleCreateSucceeded: function (newItem) {
									newItem.Rule = [];
									newItem.RuleRelationServiceNames = {
										m: 'estimateAssembliesService',
										r: 'estimateAssembliesMdcRuleRelationService',
										mainEntityIsNew: true
									};

									// create the cost group reference to the lineitem
									let costGroupsStructureMainDataServiceFactory = $injector.get('costGroupsStructureMainDataServiceFactory');
									let costGroupsStructureMainDataService = costGroupsStructureMainDataServiceFactory.getService();
									if (costGroupsStructureMainDataService && costGroupsStructureMainDataService.assignCostGrpSturcutre2LineItem) {
										costGroupsStructureMainDataService.assignCostGrpSturcutre2LineItem(newItem);
									}

									if(assemblyDynamicUserDefinedColumnService){
										let userDefinedColumnService = $injector.get(assemblyDynamicUserDefinedColumnService);

										userDefinedColumnService.attachEmptyDataToColumn(newItem);
									}

									return newItem;
								}
							}
						},
						translation: {
							uid: 'estimateAssembliesService',
							title: 'estimate.assemblies.containers.assemblies',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo',maxLength : 255}],
							dtoScheme: {
								typeName: 'EstLineItemDto',
								moduleSubModule: 'Estimate.Assemblies'
							}
						},
						sidebarSearch: {
							options: {
								moduleName: moduleName,
								enhancedSearchEnabled: true,
								enhancedSearchVersion: '2.0',
								pattern: '',
								pageSize: 100,
								useCurrentClient: false,
								includeNonActiveItems: false,
								showOptions: true,
								showProjectContext: false,
								withExecutionHints: false
							}
						},
						// sidebarWatchList: {active: true}, // enable watchlist for this module
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName,
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						}
					}
				};

				if (option && option.isPrjAssembly) {
					if (_.isObject(option.parent)) {
						// Change the role from 'root' to 'node'
						// Shift to hierarchicalNodeItem
						estimateMainServiceOptions.flatNodeItem = estimateMainServiceOptions.flatRootItem;
						delete estimateMainServiceOptions.flatRootItem; // Delete old property

						// Shift entityRole from 'root' to 'node'
						estimateMainServiceOptions.flatNodeItem.entityRole.node = estimateMainServiceOptions.flatNodeItem.entityRole.root;
						estimateMainServiceOptions.flatNodeItem.entityRole.node.parentService = option.parent; // Hand over the nodes parent service.
						estimateMainServiceOptions.flatNodeItem.entityRole.node.itemName = 'PrjEstLineItem';
						delete estimateMainServiceOptions.flatNodeItem.entityRole.root;  // Delete old property
						estimateMainServiceOptions.flatNodeItem.entitySelection = {supportsMultiSelection: true}; // Enable multiple selection
					}

					if (option.serviceName) {
						estimateMainServiceOptions.flatNodeItem.serviceName = option.serviceName;
					}

					if (option.httpRead) {
						estimateMainServiceOptions.flatNodeItem.httpRead.initReadData = option.httpRead.initReadData;
					}
				}

				//Master Plant Assemblies in Plant Estimation Module
				if (option && option.isPlantAssembly) {
					if (_.isObject(option.parent)) {
						// Change the role from 'root' to 'node'
						// Shift to hierarchicalNodeItem
						estimateMainServiceOptions.flatNodeItem = estimateMainServiceOptions.flatRootItem;
						delete estimateMainServiceOptions.flatRootItem; // Delete old property

						// Shift entityRole from 'root' to 'node'
						estimateMainServiceOptions.flatNodeItem.entityRole.node = estimateMainServiceOptions.flatNodeItem.entityRole.root;
						estimateMainServiceOptions.flatNodeItem.entityRole.node.parentService = option.parent; // Hand over the nodes parent service.
						estimateMainServiceOptions.flatNodeItem.entityRole.node.itemName = 'PlantEstimationLineItem';
						delete estimateMainServiceOptions.flatNodeItem.entityRole.root;  // Delete old property
						estimateMainServiceOptions.flatNodeItem.entitySelection = {supportsMultiSelection: true}; // Enable multiple selection
					}
					estimateMainServiceOptions.flatNodeItem.serviceName = option.serviceName ? option.serviceName : estimateMainServiceOptions.flatNodeItem.serviceName;
					estimateMainServiceOptions.flatNodeItem.module = option.module ? option.module : estimateMainServiceOptions.flatNodeItem.module;

					estimateMainServiceOptions.flatNodeItem.httpRead = option.httpRead;
					delete estimateMainServiceOptions.flatNodeItem.sidebarSearch;
					delete estimateMainServiceOptions.flatNodeItem.sidebarInquiry;
				}

				if (option && option.isPrjPlantAssembly) {
					if (_.isObject(option.parent)) {
						// Change the role from 'root' to 'node'
						// Shift to hierarchicalNodeItem
						estimateMainServiceOptions.flatNodeItem = estimateMainServiceOptions.flatRootItem;
						delete estimateMainServiceOptions.flatRootItem; // Delete old property

						// Shift entityRole from 'root' to 'node'
						estimateMainServiceOptions.flatNodeItem.entityRole.node = estimateMainServiceOptions.flatNodeItem.entityRole.root;
						estimateMainServiceOptions.flatNodeItem.entityRole.node.parentService = option.parent; // Hand over the nodes parent service.
						estimateMainServiceOptions.flatNodeItem.entityRole.node.itemName = 'PrjPlantAssembly';
						delete estimateMainServiceOptions.flatNodeItem.entityRole.root;  // Delete old property
						estimateMainServiceOptions.flatNodeItem.entitySelection = {supportsMultiSelection: true}; // Enable multiple selection
					}

					if (option.serviceName) {
						estimateMainServiceOptions.flatNodeItem.serviceName = option.serviceName;
					}

					if (option.httpRead) {
						estimateMainServiceOptions.flatNodeItem.httpRead.initReadData = option.httpRead.initReadData;
					}
				}

				/* jshint -W003 */
				let serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainServiceOptions);
				let service = serviceContainer.service ? serviceContainer.service : {};

				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				function updateResourcesToSaveAndToDelete(estResourcesToSave, estResourcesToDelete){
					estResourcesToSave = estResourcesToSave || [];
					estResourcesToDelete = estResourcesToDelete || [];

					// Prepare //This is used for Assemblies module
					let estimateMainResourceService = $injector.get('estimateAssembliesResourceService');
					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					let estimateMainCompleteCalculationService = $injector.get('estimateMainCompleteCalculationService');
					let cloudCommonGridService = $injector.get('cloudCommonGridService');
					let itemName = 'EstResource';

					let resources = angular.copy(estResourcesToSave);
					let resTypesToValidate = [1, 2, 4, 5]; // CostCode, Material, Assembly and SubItem
					let resFieldToValidate = 'Code';

					let resourcesToRemoveFromCache = _.filter(resources, function(res){
						let resDto = res[itemName];
						// Created Items without Code assignment will be removed
						return resDto && resTypesToValidate.indexOf(resDto.EstResourceTypeFk) > -1 && (_.isEmpty(resDto[resFieldToValidate]) || platformRuntimeDataService.hasError(resDto, resFieldToValidate)) && resDto.Version === 0;
					});
					let resourcesToRevertFromCache = _.filter(resources, function(res){
						let resDto = res[itemName];
						return resDto && resTypesToValidate.indexOf(resDto.EstResourceTypeFk) > -1 && platformRuntimeDataService.hasError(resDto, resFieldToValidate) && resDto.Version > 0;
					});

					// Case 1: New resources with validation error(empty Code) will not be saved and will be removed here
					_.forEach(resourcesToRemoveFromCache, function(r){

						let resToSave = _.map(estResourcesToSave, itemName);
						let childrenRelationIds = [];
						let childRelated = _.find(resToSave, { EstResourceFk: r.MainItemId, Version: 0 });

						while (childRelated !== undefined){
							childrenRelationIds.push(childRelated.Id);
							childRelated = _.find(resToSave, { EstResourceFk: childRelated.Id, Version: 0 });
						}
						// Remove children relation
						_.forEach(childrenRelationIds, function(id){
							_.remove(estResourcesToSave,{ MainItemId: id });
						});
						// Remove resource with error
						_.remove(estResourcesToSave,{ MainItemId: r.MainItemId });
					});

					// Case 2: Existing resources were updated and were left with errors
					let resDataOriginal = estimateMainResourceService.getDataOriginal();
					let resDataToUpdate = [];

					_.forEach(resourcesToRevertFromCache, function(r){

						// Revert changes from UI
						let resOriginal = _.find(resDataOriginal, { Id: r.MainItemId });
						let resItemToRevert = estimateMainResourceService.getItemById(r.MainItemId);
						if (resItemToRevert.__rt$data && resItemToRevert.__rt$data.errors) {
							resItemToRevert.__rt$data.errors = null;
						}

						// Keep current resources items and do not revert from original otherwise will mismatch will occur
						if (resOriginal.EstAssemblyFk > 0){
							// Restore composite resources
							let itemCompositeList = [];
							cloudCommonGridService.flatten([resOriginal], itemCompositeList, 'EstResources');
							_.forEach(itemCompositeList, function(c){
								let itemComposite = _.find(estResourcesToDelete,{ Id: c.Id} );
								if (itemComposite){
									_.remove(estResourcesToDelete,{ Id: c.Id });
									// estResourcesToSave.push({ MainItemId: c.Id, EstResource: itemComposite });
									let estResourceToSaveItem = {};
									estResourceToSaveItem.MainItemId = c.Id;
									estResourceToSaveItem[itemName] = itemComposite;
									estResourcesToSave.push(estResourceToSaveItem);
									estimateMainResourceService.getList().push(itemComposite);
								}
							});
						}else{
							delete resOriginal.EstResources;
						}
						// Restore
						angular.extend(resItemToRevert, resOriginal);

						while (resOriginal !== undefined){
							resDataToUpdate.push(resOriginal);
							resOriginal = _.find(resDataOriginal, { Id: resOriginal.EstResourceFk || 0 });
						}
					});

					// Re-Calculate resources
					if (resDataToUpdate.length > 0){
						let r = resourcesToRevertFromCache[0][itemName];
						let lineItem = $injector.get('estimateAssembliesService').getItemById(r.EstLineItemFk);
						let resourceTree = estimateMainResourceService.getTree();
						estimateMainCompleteCalculationService.updateResourcesNew(lineItem, resourceTree);

						// Update to Save
						let resourceList = estimateMainResourceService.getList();
						_.forEach(resDataToUpdate, function(r){
							let resToSave = _.find(estResourcesToSave, { MainItemId: r.Id });
							let resCalculated = _.find(resourceList, { Id: r.Id });

							angular.extend(resToSave[itemName], resCalculated);
						});
					}

					// Refresh UI for current line item
					if (resourcesToRemoveFromCache.length > 0 || resourcesToRevertFromCache.length > 0){
						let selectedLineItem = $injector.get('estimateAssembliesService').getSelected() || {};
						let lineItemId = (resourcesToRemoveFromCache.concat(resourcesToRevertFromCache))[0][itemName].EstLineItemFk;

						// eslint-disable-next-line no-prototype-builtins
						if (selectedLineItem && selectedLineItem.hasOwnProperty('Id') && selectedLineItem.Id === lineItemId){

							// Remove errors from UI
							let resourcesToDelete = _.map(resourcesToRemoveFromCache, itemName);

							let selectedResource = estimateMainResourceService.getSelected() || {};
							estimateMainResourceService.deleteEntities(resourcesToDelete, true);

							// highlight the selected resource if it is reverted
							estimateMainResourceService.setSelected(selectedResource);
						}
					}
				}

				let estHeaderFk = -1;
				service.provideUpdateData = function (updateData) {
					if (updateData && updateData.EstResourceToSave && updateData.EstResourceToSave.length > 0){
						updateResourcesToSaveAndToDelete(updateData.EstResourceToSave, updateData.EstResourceToDelete);
					}

					if (updateData.PrjPlantAssemblyToSave && updateData.PrjPlantAssemblyToSave.length) {
						angular.forEach(updateData.PrjPlantAssemblyToSave, function (d) {
							if(d.PrjPlantAssembly && d.PrjPlantAssembly.Id){
								d.PrjPlantAssembly.Budget = 0;
								d.PrjPlantAssembly.BudgetUnit = 0;
								d.PrjPlantAssembly.QuantityTotalBudget = 0;
								d.PrjPlantAssembly.AdvancedAll = 0;
								d.PrjPlantAssembly.ManualMarkup = 0;
								d.PrjPlantAssembly.AdvancedAllUnitItem = 0;
								d.PrjPlantAssembly.ManualMarkupUnitItem = 0;
							}
						});
					}

					if (option.isPrjAssembly && option.parent) {
						let parentEntity = option.parent.getSelected();
						if(!parentEntity) {
							return;
						}
						let projectSelectedId = parentEntity.Id;
						let prjAssemblyHeaderId = 0; // This will be set in back-end

						// get project assembly rules to save and delete
						$injector.get('estimateMainRuleUpdateService').updateRuleToSave(updateData, prjAssemblyHeaderId, projectSelectedId, true);

						// get project assembly parameters to save and delete
						estimateParamUpdateService.updateParamToSave(updateData, prjAssemblyHeaderId);

						if (updateData.PrjAssemblyRuleToSave && updateData.PrjAssemblyRuleToSave.length > 0) {
							updateData.PrjAssemblyRuleToSave = _.map(updateData.PrjAssemblyRuleToSave, function(prjEstRule){
								return {Id: prjEstRule.Id, PrjEstRule: prjEstRule};
							});
						}

						// updateData.EstLeadingStuctureContext = estimateParamUpdateService.getLeadingStructureContext(updateData.EstLeadingStuctureContext, mainService.getSelected(), 'estimateAssembliesService');
						updateData.EstLeadingStuctureContext = {};

						// updateData.PrjEstRule = updateData.PrjEstRuleToSave || [];
						// updateData.PrjEstRuleToSave.push(updateData.PrjEstRuleToSave)

						// get estimate parameters to save and delete
						// estimateParamUpdateService.updateParamToSave(updateData, 0);

						return;
					}

					if(assemblyDynamicUserDefinedColumnService){
						let userDefinedColumnService = $injector.get(assemblyDynamicUserDefinedColumnService);

						if(userDefinedColumnService && userDefinedColumnService.isNeedUpdate()){
							updateData.UserDefinedcolsOfLineItemToUpdate = userDefinedColumnService.getUpdateData();
						}
					}

					if(assemblyResourceDynamicUserDefinedColumnService){
						let resourceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);

						if(resourceUserDefinedColumnService && resourceUserDefinedColumnService.isNeedUpdate()){
							updateData.UserDefinedcolsOfResourceToUpdate = resourceUserDefinedColumnService.getUpdateData();
						}
					}

					if (service.getIsUpdateDataByParameter()) {
						updateData.EntitiesCount = 0;
						return;
					}

					if (option.isPlantAssembly){
						return;
					}

					updateData.EstHeaderId = estHeaderFk;
					estimateParamUpdateService.updateParamToSave(updateData, updateData.EstHeaderId);

					if(option.isPrjPlantAssembly && option.parent){
						updateData.MainItemId = updateData.EntitiesCount > 0 ? updateData.ProjectId : 0;
						if(!updateData.MainItemId){
							let parentEntity = option.parent.getSelected();
							if(!parentEntity) {
								return;
							}
							updateData.MainItemId = parentEntity.Id;
						}
					} else {
						updateData.MainItemId = updateData.EntitiesCount > 0 ? service.getIfSelectedIdElse(-1) : updateData.MainItemId;
					}

					if (updateData.EntitiesCount > 0) {
						let complexLookupService = $injector.get('estimateParameterComplexInputgroupLookupService');
						if (complexLookupService.dataService.getEstLeadingStructureContext) {
							let leadingStructureInfo = complexLookupService.dataService.getEstLeadingStructureContext();
							updateData.EstLeadingStuctureContext = leadingStructureInfo.item;
							updateData.EstLeadingStructureContext = leadingStructureInfo.item;
						}

						if (updateData.EstLineItems && updateData.EstLineItems.length) {
							angular.forEach(updateData.EstLineItems, function (d) {
								if (!d.BudgetUnit) {
									d.BudgetUnit = 0;
								}

								if (!d.DayWorkRateTotal) {
									d.DayWorkRateTotal = 0;
								}
								if(!d.AdvancedAll){
									d.AdvancedAll = 0;
								}
								if(!d.AdvancedAllUnitItem){
									d.AdvancedAllUnitItem = 0;
								}
								if(!d.ManualMarkup){
									d.ManualMarkup = 0;
								}
								if(!d.ManualMarkupUnitItem){
									d.ManualMarkupUnitItem = 0;
								}
							});
						}

						if(updateData.EstAssemblyCat){
							updateData.EstAssemblyCat = angular.copy(updateData.EstAssemblyCat);
							updateData.EstAssemblyCat.AssemblyCatChildren = [];
						}
					}

					if (!updateData.EstLeadingStuctureContext) {
						if (service.getSelected()) {
							updateData.EstLeadingStuctureContext = {
								Id: service.getSelected().Id,
								EstLineItemFk: service.getSelected().Id
							};
						} else {
							updateData.EstLeadingStuctureContext = {EstLineItemFk: -1};
						}
					}
				};

				service.getContainerData = function getContainerData() {
					return serviceContainer.data;
				};

				service.setIsUpdateDataByParameter = function setIsUpdateDataByParameter(value) {
					isUpdateDataByParameter = value;
				};

				service.getIsUpdateDataByParameter = function getIsUpdateDataByParameter() {
					return isUpdateDataByParameter;
				};

				service.getLazyLoadCostCodeSystemOption = function getLazyLoadCostCodeSystemOption() {
					return lazyLoadCostCodeSystemOption;
				};

				serviceContainer.data.provideUpdateData = service.provideUpdateData;

				service.fireListLoaded = function fireListLoaded() {
					serviceContainer.data.listLoaded.fire();
				};

				let originalOnDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = function onDeleteDone(deleteParams, data, response) {
					originalOnDeleteDone(deleteParams, data, response);
					$injector.get('estimateAssembliesValidationService').validateAssemblyItemsUniqueCode(deleteParams.entities);
				};

				// events
				service.onUpdated = new Platform.Messenger();
				service.onToggleCreateButton = new Platform.Messenger();

				service.updateList = function updateList(updateData, response) {
					estimateParamUpdateService.clear();
					estimateParameterFormatterService.handleUpdateDoneEx(response, 'EstAssemblyCat');
					if (response[serviceContainer.data.itemName]) {
						serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
					}
				};

				service.addList = function addList(response, isDragResource) {
					let list = serviceContainer.data.itemList;
					let items = isDragResource ? [response] : response[serviceContainer.data.itemName];

					if (items && items.length) {
						items.forEach(d => {
							let item = _.find(list, {Id: d.Id, EstHeaderFk: d.EstHeaderFk});
							if (item) {
								angular.extend(list[list.indexOf(item)], d);
							} else {
								list.push(d);
							}
						});
					}

					serviceContainer.data.itemList = _.sortBy(list, ['Code']);
					return items;
				};

				service.handleDeepCopy = function handleDeepCopy(response) {
					let items = service.addList(response);
					$injector.get('estimateAssembliesRuleFormatterService')
						.loadRuleRelationsAsync(items, 'estimateAssembliesService', 'estimateAssembliesMdcRuleRelationService');
				};

				service.getSelectedEstHeaderId = function getSelectedEstHeaderId() {
					return (selectedEstHeaderFk !== null) ? selectedEstHeaderFk : estHeaderFk;
				};

				service.setDetailsParamReminder = function setDetailsParamReminder(selectedLevel) {
					detailsParamAlwaysSave = selectedLevel;
				};

				service.getDetailsParamReminder = function getDetailsParamReminder() {
					return detailsParamAlwaysSave;
				};

				let createAssembly = service.createItem;
				service.createItem = function () {
					service.onToggleCreateButton.fire(true);
					createAssembly().then(function () {
						service.onToggleCreateButton.fire(false);
					});
				};

				service.onCellChange = function cellChangeCallBack(arg, resourceService, estimateMainCommonService) {
					let resourceList = resourceService.getList(),
						item = arg.item,
						column = arg.grid.getColumns()[arg.cell],
						col = arg.grid.getColumns()[arg.cell].field,
						selectedLineItem = service.getSelected();

					let projectAssemblyMainServ = $injector.get('projectAssemblyMainService');
					let isPrjPlantAssembly = option && option.isPrjPlantAssembly ? option.isPrjPlantAssembly : false;
					let isPrjAssembly = option && option.isPrjAssembly ? option.isPrjAssembly : false;

					projectAssemblyMainServ.setIsPrjPlantAssembly(isPrjPlantAssembly);
					projectAssemblyMainServ.setIsPrjAssembly(isPrjAssembly);

					if (col === 'Param') {
						return;
					}

					if(col==='IsGc' || col==='IsDisabled') {
						if (_.isFunction(resourceService.isResourcesLoaded) && !resourceService.isResourcesLoaded(item)) {
							if (option && option.isPrjAssembly) {
								if(_.isFunction(resourceService.setParentCellChangeArg)) {
									resourceService.setParentCellChangeArg(arg, resourceService, estimateMainCommonService);
								}
							}
						}
						return;
					}

					if(option && option.isPrjAssembly && col ==='Rule') {
						let estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
						let projectId = option.parent.getSelected() ? option.parent.getSelected().Id : 0;
						let estHeaderFk = item.EstHeaderFk;
						let ruleToDelete = estimateRuleFormatterService.getRuleToDelete('EstLineItemsRuleToDelete');
						if (ruleToDelete && ruleToDelete.length > 0) {
							let delOption = {
								entity: item,
								itemName: 'EstLineItems',
								mainServiceName: option.serviceName,
								isPrjAssembly: option.isPrjAssembly,
								projectId: projectId,
								estHeaderFk: estHeaderFk,
								ruleToDelete: ruleToDelete
							};
							estimateRuleFormatterService.deleteParamByRule(delOption);
						}
					}


					/* calculate detail of lineItem */
					estimateMainCommonService.calculateDetails(item, col, null, true);

					$injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resourceList).then(function () {
						/* calculate quantity and cost of lineItem and resources */
						$injector.get('estimateAssembliesCalculationService').calculateLineItemAndResourcesOfAssembly(item, resourceList, resourceService.getAssemblyType());

						if (selectedLineItem && selectedLineItem.Id && selectedLineItem.EstLineItemFk === null && resourceList.length > 0) {
							angular.forEach(resourceList, function (res) {
								resourceService.fireItemModified(res);
							});
						}

						switch (col) {
							case 'MdcCostCodeFk':
								selectedLineItem.MdcMaterialFk = null;
								break;
							case 'MdcMaterialFk':
								selectedLineItem.MdcCostCodeFk = null;
								break;

						}

						if (col === 'MdcCostCodeFk' || col === 'MdcMaterialFk') {
							estimateAssembliesProcessor.processItem(selectedLineItem);
						}

						// To DO: update or add characteristic
						if (estimateMainCommonService.isCharacteristicCulumn(column)) { // characteristic culomn
							let lineItem = item;
							let colArray = _.split(col, '.');
							if (lineItem[col] === undefined) {
								lineItem[col] = estimateMainCommonService.getCharacteristicColValue(angular.copy(lineItem), colArray);
							}
							// service.fireLineItemValueUpdate(col, lineItem);
							// TODO: when update character value in estResource, sync update character.
							let characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(service, 30);
							let contextId = parseInt(_.replace(characteristicDataService.getFilter(), 'mainItemId=', ''));
							let currentContextId = item.Id;
							if (contextId === currentContextId) {
								characteristicDataService.syncUpdateCharacteristic(col, lineItem);
							} else {
								characteristicDataService.setUpdateCharOnListLoaded(col, lineItem);
							}
						}

						resourceService.gridRefresh();
						service.gridRefresh();
					});
				};

				// the event of line item cell change, then update or add characteristic
				let onLineItemChanged = new PlatformMessenger(); // line item is changed

				service.registerLineItemValueUpdate = function registerLineItemValueUpdate(func) {
					onLineItemChanged.register(func);
				};

				service.unregisterLineItemValueUpdate = function unregisterLineItemValueUpdate(func) {
					onLineItemChanged.unregister(func);
				};

				service.fireLineItemValueUpdate = function (col, item) {
					onLineItemChanged.fire(col, item);
				};

				service.setCacheExchangePrjId = function (prjId){
					cacheExchangeProjectId = prjId;
				};

				service.getCacheExchangePrjId = function (){
					return cacheExchangeProjectId;
				};

				// clear and reload the exchangerate for assembly
				service.clearOldRates = function clearOldRates() {
					let project = $injector.get('projectMainService').getSelected();
					let projectId = option.isPrjAssembly ? (project ? project.Id : -1) : 0;
					if (projectId !== service.getCacheExchangePrjId()) {
						service.setCacheExchangePrjId(projectId);
						estimateMainExchangeRateService.loadData(projectId, true);
					}
				};

				service.setContext = function setContext(context) {
					lineItemContext = context;
				};

				service.getContext = function getContext() {
					return lineItemContext;
				};

				let lookupFilter = [
					{
						key: 'costgroupfk-for-line-item',
						serverSide: true,
						fn: function () {
							let currentItem = service.getContext();
							return 'LineItemContextFk=' + (currentItem ? currentItem.Id : '-1');
						}
					}
				];

				service.setAssemblyResources = function setAssemblyResources(_assemblyResources/* , selectedItem */) {
					assemblyResources = _assemblyResources;
					let estimateMainResourceType = $injector.get('estimateMainResourceType');

					if(service.getLazyLoadCostCodeSystemOption()) {
						let costCodeIds = _.map(assemblyResources, function(resource) {
							return resource && resource.EstResourceTypeFk === estimateMainResourceType.CostCode && resource.MdcCostCodeFk ? resource.MdcCostCodeFk : -1;
						});
						if(costCodeIds.length > 0)
						{
							return $http.post(globals.webApiBaseUrl + 'basics/costcodes/getbyids', costCodeIds).then(function (response) {
								let costCodes = response && response.data && response.data.length > 0 ? response.data : [];
								if(costCodes.length > 0){
									_.each(assemblyResources, function (res) {
										if (res.EstResourceTypeFk === estimateMainResourceType.CostCode) {
											let mdcCostCode = _.find(costCodes, {'Id': res.MdcCostCodeFk});
											if (mdcCostCode) {
												res.IsLabour = mdcCostCode.IsLabour;
											}
										}
									});
								}
								return true;
							});
						}
					}else {
						return $injector.get('estimateMainLookupService').getMdcCostCodesTree().then(function (mdccostcode) {
							let list = [];
							cloudCommonGridService.flatten(mdccostcode, list, 'CostCodes');
							_.each(assemblyResources, function (res) {
								if (res.EstResourceTypeFk === estimateMainResourceType.CostCode) {
									let mdcCostCode = _.find(list, {'Id': res.MdcCostCodeFk});
									if (mdcCostCode) {
										res.IsLabour = mdcCostCode.IsLabour;
									}
								}
							});
						});
					}
				};

				service.registerLookupFilter = function registerLookupFilter() {
					basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
				};

				service.unregisterLookupFilter = function unregisterLookupFilter() {
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
				};


				service.navigateToAssembly = function (item, triggerField) {
					if (triggerField === 'EstAssemblyFk' && _.isNumber(item[triggerField])) {
						assemblyIdToSelect = item[triggerField];
					} else if (triggerField === 'EstLineItemFk' && _.isNumber(item[triggerField])) {
						assemblyIdToSelect = item[triggerField];
					}
				};

				service.internalNavigateToAssembly = function (item, triggerField) {
					this.navigateToAssembly(item, triggerField);
					// reset old category
					if (assemblyCategory) {
						assemblyCategory.IsMarked = false;
					}
					service.setAssemblyCategoryForDiffCat(item.EstAssemblyFk);

				};

				service.setAssemblyCategoryForDiffCat = function setAssemblyCategoryForDiffCat(id){
					if(!option.structureServiceName){
						return;
					}
					$injector.get('estimateMainCommonService').getAssemblyById(id).then(function (response) {
						let assembly = response.data;
						let categoriesList = $injector.get(option.structureServiceName).getList();
						if (assembly && _.isArray(categoriesList) || assembly.EstAssemblyCatFk) {
							if (categoriesList.length === 0) {
								// try once more to get data
								categoriesList = $injector.get(option.structureServiceName).getList();
							}
							if (assembly && _.isArray(categoriesList)) {
								assemblyCategory = getAssemblyCategoryForDiffCat(assembly.EstAssemblyCatFk, categoriesList);
								assemblyCategory.IsMarked = true;
								let assemblyArr = [];
								assemblyArr.push(assemblyCategory);
								let gridId = $injector.get(option.structureServiceName).getGridId();
								$injector.get(option.structureServiceName).markersChanged(assemblyArr);
								platformGridAPI.rows.refreshRow({gridId:gridId, item: assemblyCategory});
								$injector.get(option.structureServiceName).setSelected(assemblyCategory);
							}
						}
						// the assembly resource container exist
						let isResourceContainerExist = platformGridAPI.grids.exist(option.resourceContainerId);
						if (!isResourceContainerExist) {
							service.setAssemblyResources([], assembly);
						}
					});
				};

				// set selected item's assembly category(assembly type->resource container)
				service.setAssemblyCategory = function setAssemblyCategory(item) {
					if(!option.structureServiceName){
						return;
					}
					let selectedItem = service.getSelected();
					let categoriesList = $injector.get(option.structureServiceName).getList();

					// item has value, mean changed the assembly type.
					if (selectedItem && _.isArray(categoriesList) || item) {
						if (categoriesList.length === 0) {
							// try once more to get data
							categoriesList = $injector.get(option.structureServiceName).getList();
						}

						if (selectedItem && _.isArray(categoriesList)) {
							assemblyCategory = getTopAssemblyCategory(selectedItem.EstAssemblyCatFk, categoriesList, item);
						}
					}
					// the assembly resource container exist
					let isResourceContainerExist = platformGridAPI.grids.exist(option.resourceContainerId);
					if (!isResourceContainerExist) {
						service.setAssemblyResources([], selectedItem);
					}
				};

				service.getStructureService = function() {
					if (!option.structureServiceName) {
						return;
					}
					return $injector.get(option.structureServiceName);
				};

				service.getAssemblyCategory = function getAssemblyCategory() {
					return assemblyCategory;
				};

				service.resetAssemblyCategory = function resetAssemblyCategory() {
					assemblyCategory = {Id: 0};
				};

				// get top assembly category(not go to the top, if it finds assembly type in the sub category, then return)
				function getTopAssemblyCategory(estAssemblyCatFk, categoriesList, item) {
					let category = _.find(categoriesList, {Id: estAssemblyCatFk});

					// if item has value, mean the category assembly type will change with the item value.
					if (item && category && item.Id === category.Id){
						category.EstAssemblyTypeFk = item.EstAssemblyTypeFk;
					}

					if (category && category.EstAssemblyCatFk && !category.EstAssemblyTypeFk) {
						return getTopAssemblyCategory(category.EstAssemblyCatFk, categoriesList, item);
					}
					return category;
				}

				function getAssemblyCategoryForDiffCat(estAssemblyCatFk, categoriesList) {
					let category = _.find(categoriesList, {Id: estAssemblyCatFk});
					return !_.isEmpty(category) ? category : [];
				}

				service.setEstHeaderFkToEstimateParameterFormatter = function setEstHeaderFkToEstimateParameterFormatter() {
					let estHeaderFkUrl = 'estimate/assemblies/getestheaderfk';
					if (option && option.isPrjAssembly ){
						let projectId = option.parent.getSelected() ? option.parent.getSelected().Id : 0;
						estHeaderFkUrl = 'estimate/assemblies/getprjheaderfk?projectId=' + projectId;

						if (projectId === 0){
							return $injector.get('$q').when(0);
						}
					}
					return $http.get(globals.webApiBaseUrl + estHeaderFkUrl).then(function (response) {
						estHeaderFk = response.data;
						estimateParameterFormatterService.setSelectedEstHeaderNProject(estHeaderFk);
						return estHeaderFk;
					});
				};


				// could be 0, depends on setEstHeaderFkToEstimateParameterFormatter is finished loading or not
				service.getHeaderFkAsync = function () {
					let promise = $injector.get('$q').when(estHeaderFk);
					if (estHeaderFk === 0) {
						promise = service.setEstHeaderFkToEstimateParameterFormatter();
					}
					return promise;
				};

				service.isAssemblyParameterActived = false;

				service.getIsAssembly = function getIsAssembly() {
					return isAssembly;
				};

				service.setIsAssembly = function setIsAssembly(value) {
					isAssembly = value;
				};

				service.setIsPrjAssembly = function setIsPrjAssembly(value) {
					isPrjAssembly = value;
				};

				service.getIsPrjAssembly = function getIsPrjAssembly() {
					return isPrjAssembly;
				};

				service.setIsPlantAssembly = function setIsPlantAssembly(value) {
					isPlantAssembly = value;
				};

				service.getIsPlantAssembly = function getIsPlantAssembly() {
					return isPlantAssembly;
				};

				service.setIsPrjPlantAssembly = function setIsPrjPlantAssembly(value) {
					isPrjPlantAssembly = value;
				};

				service.getIsPrjPlantAssembly = function getIsPrjPlantAssembly() {
					return isPrjPlantAssembly;
				};

				let originalDeleteEntities = serviceContainer.data.deleteEntities;
				serviceContainer.data.deleteEntities = function deleteChildEntities(entities, data) {
					if (angular.isArray(entities)) {
						entities = _.clone(entities);
						if (entities.length > 0) {
							let postData = {AssemblyIds: _.map(entities, 'Id')};
							let assembliesIdsReferenced = [];
							return $http.post(globals.webApiBaseUrl + 'estimate/assemblies/candelete', postData).then(function (response) {
								let responseData = response.data;
								let assemblyCodesWithBoqWicRef = [];
								// let assemblyCodesWithAssemblyWicRef = [];
								let assemblyCodesWithCosRef = [];
								let assemblyReferencedMessage = '';
								let assemblyWithBoqWicMessage = '';
								let assemblyWithAssemblyWicMessage = '';
								let assemblyWithCosMessage = '';

								assembliesIdsReferenced = _.isEmpty(responseData) ? [] : _.map(responseData, function (v, k) {
									return (_.toNumber(k));
								});
								if (angular.isArray(assembliesIdsReferenced) && assembliesIdsReferenced.length > 0) {
									_.forEach(entities, function (entity) {
										let assemblyWithReference = responseData[entity.Id];
										if (!_.isEmpty(assemblyWithReference)) {
											if (assemblyWithReference.indexOf(1) !== -1) {
												assemblyCodesWithBoqWicRef.push(entity.Code);
											}

											if (assemblyWithReference.indexOf(3) !== -1) {
												assemblyCodesWithCosRef.push(entity.Code);
											}
										}
									});
									if (_.size(assembliesIdsReferenced) === _.size(entities) && (_.size(assemblyCodesWithBoqWicRef) === _.size(entities) || _.size(assemblyCodesWithCosRef) === _.size(entities))) {
										if (_.size(assemblyCodesWithBoqWicRef) === _.size(entities)) {
											return platformModalService.showErrorBox('estimate.assemblies.dialog.allAssembliesAssignedToBoqWicMessage', 'cloud.common.errorMessage');
										}

										if (_.size(assemblyCodesWithCosRef) === _.size(entities)) {
											return platformModalService.showErrorBox('estimate.assemblies.dialog.WarningAssignedAssembliesCosMessage', 'cloud.common.errorMessage');
										}
									} else {
										if (!_.isEmpty(assemblyCodesWithBoqWicRef)) {
											assemblyCodesWithBoqWicRef = _.join(assemblyCodesWithBoqWicRef, ', ');
											assemblyWithBoqWicMessage = $translate.instant('estimate.assemblies.dialog.WarningAssignedAssembliesBoqWicMessage', {codes: assemblyCodesWithBoqWicRef}) + '\n';
										}

										if (!_.isEmpty(assemblyCodesWithCosRef)) {
											assemblyCodesWithCosRef = _.join(assemblyCodesWithCosRef, ', ');
											assemblyWithCosMessage = $translate.instant('estimate.assemblies.dialog.WarningAssignedAssembliesCosMessage', {codes: assemblyCodesWithCosRef}) + '\n';
										}

										assemblyReferencedMessage = assemblyWithBoqWicMessage + assemblyWithAssemblyWicMessage + assemblyWithCosMessage;
										if (_.size(assembliesIdsReferenced) === _.size(entities)) {
											return platformModalService.showErrorBox(assemblyReferencedMessage, 'cloud.common.errorMessage');
										}

										assemblyReferencedMessage = assemblyReferencedMessage + $translate.instant('estimate.assemblies.dialog.deleteUnAssignedAssembliesMessage');
										return platformModalService.showYesNoDialog(assemblyReferencedMessage, 'estimate.assemblies.dialog.confirmAssemblyDelete', 'no');
									}
								} else {
									return originalDeleteEntities(entities, data);
								}
							}).then(function (result) {
								if (result && result.yes) {
									let filteredEntities = _.filter(entities, function (entity) {
										return _.indexOf(assembliesIdsReferenced, entity.Id) === -1;
									});
									originalDeleteEntities(filteredEntities, data);
								}
							});
						}
					}
				};

				// make the rule controller
				let oldClear = service.clear;
				service.clear = function () {
					oldClear();
					let estimateRuleService = $injector.get('estimateAssembliesRuleService');
					if (estimateRuleService) {
						estimateRuleService.clear();
					}
				};

				service.getAssemblyGridId = function getAssemblyGridId() {
					return assemblyGridId;
				};

				service.setAssemblyGridId = function setAssemblyGridId(gridId) {
					assemblyGridId = gridId;
				};

				service.getGridId = service.getAssemblyGridId;

				service.setCompanyCurrency = function setCompanyCurrency(currencyId) {
					companyCurrency = currencyId;
				};

				service.getCompanyCurrency = function getCompanyCurrency() {
					return companyCurrency;
				};

				// bulk editor changes
				service.valueChangeCallBack = function valueChangeCallBack(item) {
					let estimateAssembliesResourceService = option.resourceServiceName ? $injector.get(option.resourceServiceName) : $injector.get('estimateAssembliesResourceService');
					estimateAssembliesResourceService.calculateAssemblyResource(item, estimateAssembliesResourceService.getList());
				};

				service.deepCopy = function deepCopy() {
					function deepCopyAssemblies() {
						let selectedAssemblies = service.getSelectedEntities();
						if (selectedAssemblies && selectedAssemblies.length) {
							let assemblyStructServ = option.structureServiceName ? $injector.get(option.structureServiceName) : null;
							let data = {
								EstAssemblyCat: assemblyStructServ ? angular.copy(assemblyStructServ.getSelected()) : null,
								AssemblyIds: _.map(selectedAssemblies, 'Id'),
								IsCopyToSameAssemblyCat: true
							};
							if (option && option.isPrjAssembly){
								data.IsPrjectAssembly = true;
								data.ProjectId = service.parentService().getSelected().Id;
							}

							let rootService = service;
							let containerData = serviceContainer.data;

							if (option && option.isPrjAssembly){
								rootService = service.parentService();
								containerData = service.parentService().getContainerData();
							}

							let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
							let updateData = modTrackServ.getModifications(service);
							$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/deepcopyassembly', data).then(function (response) {
								let result = response.data;
								service.handleDeepCopy(result);

								// CostGroups
								let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
								basicsCostGroupAssignmentService.attachCostGroupValueToEntity(result.EstLineItems, result.EstLineItem2CostGroups, function identityGetter(entity) {
									return {
										EstHeaderFk: entity.RootItemId,
										Id: entity.MainItemId
									};
								},
								'EstLineItem2CostGroups'
								);

								// Update lineitem and resoruce user defined column value
								if(result && angular.isArray(result.UserDefinedcolsOfLineItemModified)){
									let userDefinedColumnService = option && (option.isPrjAssembly || option.isPrjPlantAssembly) ? $injector.get('projectAssemblyDynamicUserDefinedColumnService')
										: option && option.isPlantAssembly ? $injector.get(option.userDefinedColumServiceName)
											: $injector.get('estimateAssembliesDynamicUserDefinedColumnService');

									userDefinedColumnService.attachUpdatedValueToColumn(result.EstLineItems, result.UserDefinedcolsOfLineItemModified);
									userDefinedColumnService.updateValueList(result.UserDefinedcolsOfLineItemModified);
								}

								if (result && result.EstLineItems && result.EstLineItems.length > 0){
									if (containerData.processor) {
										let platformDataProcessExtensionHistoryCreator = $injector.get('platformDataProcessExtensionHistoryCreator');
										_.forEach(result.EstLineItems, function(estLineItem){
											platformDataProcessExtensionHistoryCreator.processItem(estLineItem);
										});
									}
								}

								service.addList(option && (option.isPrjAssembly || option.isPrjPlantAssembly) ? {PrjEstLineItem: result.EstLineItems}: result.EstLineItems);
								containerData.onUpdateSucceeded(result, containerData, updateData);
								// clear updateData
								modTrackServ.clearModificationsInRoot(rootService);
								updateData = {};

								serviceContainer.data.listLoaded.fire();
								serviceContainer.service.setSelected({}).then(function(){
									serviceContainer.service.setSelected(serviceContainer.service.getItemById(_.first(result.EstLineItems).Id));
								});

							});
						}
					}

					if (option && (option.isPrjAssembly|| option.isPrjPlantAssembly)){
						service.parentService().updateAndExecute(deepCopyAssemblies);
					}else{
						service.updateAndExecute(deepCopyAssemblies);
					}
				};

				service.setWinEstAssemblyItem = function setWinEstAssemblyItem(item) {
					winEstassemblyItem = item;
					if (winEstassemblyItem && winEstassemblyItem.Id) {
						assemblyIdToSelect = winEstassemblyItem.Id;
					}
				};

				service.registerRefreshRequested($injector.get('basicsCommonUserDefinedColumnConfigService').reLoad);

				service.getConsiderDisabledDirect = function getConsiderDisabledDirect(){
					return considerDisabledDirect;
				};

				service.getDynamicUserDefinedColumnsService = function(){
					return assemblyDynamicUserDefinedColumnService ? $injector.get(assemblyDynamicUserDefinedColumnService) : null;
				};

				if(option.serviceName === 'estimateAssembliesService'){
					service.deleteEntities = function deleteEntities(entities, skipDialog){
						if(!skipDialog){
							let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
							platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: service.getAssemblyGridId()}).then(result => {
								if (result.ok || result.delete) {
									serviceContainer.data.deleteEntities(entities, serviceContainer.data);
								}
							});
						}else{
							serviceContainer.data.deleteEntities(entities, serviceContainer.data);
						}
					};
				}

				service.getItemName = function(){
					return 'EstLineItems';
				};
				return service;

				function selectAssembly() {
					$timeout(function () {
						if (winEstassemblyItem && winEstassemblyItem.Id) {
							assemblyIdToSelect = winEstassemblyItem.Id;
						}
						if (_.isNumber(assemblyIdToSelect)) {
							let item = service.getItemById(assemblyIdToSelect);
							if (_.isObject(item)) {
								service.setSelected(item);
								assemblyIdToSelect = null;
							}
						}
					});
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getSelectedItems() {
					let resultSet = service.getSelectedEntities();
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getResultsSet() {
					let filteredSet = platformGridAPI.filters.items(assemblyGridId);
					let resultSet = filteredSet && filteredSet.length ? filteredSet : service.getList();
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * This function creates an Inquiry Resultset from input resultset (busniness partner specific)
				 *
				 * {InquiryItem} containing:
				 *     {  id:   {integer} unique id of type integer
				 *        name: {string}  name of item, will be displayed in inquiry sidebar as name
				 *        description: {string}  description  of item, will be displayed in inquiry sidebar as description
				 *     });
				 *
				 * @param resultSet
				 * @returns {Array} see above
				 */
				function createInquiryResultSet(resultSet) {
					let resultArr = [];
					_.forEach(resultSet, function (item) {
						if (item && item.Id) { // check for valid object
							resultArr.push({
								id: item.Id,
								name: item.Code,
								description: item.DescriptionInfo && item.DescriptionInfo.Description ? item.DescriptionInfo.Description : '',
								estHeaderId: item.EstHeaderFk
							});
						}
					});

					return resultArr;
				}
			};

			return factoryService;
		}]);
})();
