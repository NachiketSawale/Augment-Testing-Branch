/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.assemblies';
	let estimateAssembliesModule = angular.module(moduleName);

	// TODO: ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	estimateAssembliesModule.factory('estimateAssembliesResourceServiceFactory',
		['$q', '$http', '$injector', '$translate', '$timeout', 'PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'estimateMainResourceImageProcessor',
			'estimateMainResourceProcessor', 'cloudCommonGridService', 'basicsLookupdataLookupFilterService', 'estimateAssembliesResourceValidationProcessService', 'estimateMainResourceType', 'estimateAssembliesCalculationService','estimateMainGenerateSortingService', 'estimateCommonAssemblyType', 'estimateMainPlantAssemblyHandlerService',
			function ($q, $http, $injector, $translate, $timeout, PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension, estimateMainResourceImageProcessor,
				estimateMainResourceProcessor, cloudCommonGridService, basicsLookupdataLookupFilterService, estimateAssembliesResourceValidationProcessService, estimateMainResourceType, estimateAssembliesCalculationService,estimateMainGenerateSortingService, estimateCommonAssemblyType, estimateMainPlantAssemblyHandlerService) {

				let factoryService = {};

				factoryService.createNewEstAssembliesResourceService = function createNewEstAssembliesResourceService(option) {

					let assemblyResourceDynamicUserDefinedColumnService = option && option.assemblyResourceDynamicUserDefinedColumnService ? option.assemblyResourceDynamicUserDefinedColumnService : null;
					let estimateAssembliesService = option && _.isObject(option.parent) ? option.parent : $injector.get('estimateAssembliesService');

					let canResource = function canResource() {
						let selectedAssembly = estimateAssembliesService.getSelected();
						let selectedRes = service.getSelected();

						//if resource type is Equipment Assembly, then it should not be editable
						var parentResource = selectedRes != null ? service.getItemById(selectedRes.EstResourceFk) : null;
						if(parentResource && parentResource.EstResourceTypeFk === estimateMainResourceType.EquipmentAssembly) {
							return false;
						}

						return (selectedAssembly && selectedAssembly.Id > 0 && !selectedAssembly.readOnlyByJob);
					};

					let canChildResource = function canChildResource() {
						let selectedRes = service.getSelected();
						return !selectedRes ? false : canResource() && (selectedRes.EstResourceTypeFk === estimateMainResourceType.Plant || selectedRes.EstResourceTypeFk === estimateMainResourceType.SubItem || selectedRes.EstResourceTypeFk === estimateMainResourceType.PlantDissolved);
					};

					let getParentSelect = function getParentSelect() {
						if (option.isPrjAssembly) {
							// return the empty object if no row is selected in the grid
							var girdId = estimateAssembliesService.getGridId();
							if ($injector.get('platformGridAPI').grids.exist(girdId)) {
								var grid = $injector.get('platformGridAPI').grids.element('id', girdId).instance;
								if (grid && grid.getSelectedRows().length === 0) {
									return {};
								}
							}
						}
						return estimateAssembliesService.getSelected();
					};

					let parentItem = null;
					let isLoading = false;
					let materialLookupSelectedItems = null;
					let costCodeLookuopSelectedItems = null;
					let parentScope = null;

					// The instance of the main service - to be filled with functionality below
					let estimateAssembliesResourceServiceOption = {
						hierarchicalNodeItem: {
							module: option.module,
							serviceName: option.serviceName,
							entityNameTranslationID: 'estimate.assemblies.containers.assemblyResources',
							httpCreate: {route: globals.webApiBaseUrl + 'estimate/main/resource/'},
							httpRead: {
								route: globals.webApiBaseUrl + 'estimate/main/resource/',
								endRead: 'tree',
								initReadData: function initReadData(readData) {
									let selectedItem = getParentSelect();

									parentItem = selectedItem;
									isLoading = true;

									readData.estHeaderFk = selectedItem.EstHeaderFk;
									readData.estLineItemFk = selectedItem.Id;
									if (option && (option.isPrjAssembly||option.isPrjPlantAssembly)){
										let project = $injector.get('projectMainService').getSelected();
										readData.projectId = project ? project.Id : null;
									}
								},
								usePostForRead: true
							},
							httpUpdate: {route: globals.webApiBaseUrl + 'estimate/main/lineitem/'},

							actions: {
								create: 'hierarchical',
								canCreateCallBackFunc: canResource,
								canCreateChildCallBackFunc: canChildResource,
								delete: {},
								canDeleteCallBackFunc: canResource
							},
							presenter: {
								tree: {
									parentProp: 'EstResourceFk', childProp: 'EstResources', childSort: true,
									isInitialSorted: true,
									sortOptions: {initialSortColumn: {field: 'Sorting', id: 'sorting'}, isAsc: true, doNumericComparison: true},
									initCreationData: function initCreationData(creationData) {
										let selectedItem = estimateAssembliesService.getSelected();
										let selectedResourceItem = serviceContainer.service.getSelected();
										if (selectedResourceItem && selectedResourceItem.Id > 0) {
											creationData.resourceItemId = creationData.parentId ? creationData.parentId : 0;
											creationData.estHeaderFk = selectedResourceItem.EstHeaderFk;
											creationData.estLineItemFk = selectedResourceItem.EstLineItemFk;
										} else if (selectedItem && selectedItem.Id > 0) {
											creationData.estHeaderFk = selectedItem.EstHeaderFk;
											creationData.estLineItemFk = selectedItem.Id;
										}
										creationData.sortNo = estimateMainGenerateSortingService.generateSorting(selectedResourceItem, service.getList(), creationData);
									},
									incorporateDataRead: function incorporateDataRead(readItems, data) {

										isLoading = false;
										setDataOriginal(readItems);

										estimateAssembliesService.setIsUpdateDataByParameter(false);
										// we add default characteristics and existing characteristics to the result list and update the grid columns
										if (option && (!option.isPlantAssembly && !option.isPrjPlantAssembly)) {
											let assemblyResourceCharacteristicsService = option.isPrjAssembly
												? $injector.get('projectAssembliesResourceCharacteristicsService')
												: $injector.get('estimateAssembliesResourceCharacteristicsService');

											assemblyResourceCharacteristicsService.setDynamicColumnsLayout(readItems);
										}

										$injector.invoke(['basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDescriptorService) {
											basicsLookupdataLookupDescriptorService.updateData('estassemblyfk', readItems.LookupAssemblies);
											basicsLookupdataLookupDescriptorService.updateData('estmdccostcodes', readItems.LookupCostCodes);

											if (readItems.LookupMaterials && readItems.LookupMaterials.length) {
												_.forEach(readItems.LookupMaterials, function (lookupMaterial) {
													lookupMaterial.DescriptionInfo = lookupMaterial.DescriptionInfo1;
												});
												basicsLookupdataLookupDescriptorService.updateData('AssemblyMaterialRecord', readItems.LookupMaterials);
											}
										}]);

										serviceContainer.data.sortByColumn(readItems.dtos || readItems || []);
										// set LineTypeReadOnly while code is not null
										service.setLineTypeReadOnly(readItems.dtos || readItems || []);

										let result = serviceContainer.data.handleReadSucceeded(readItems.dtos || readItems || [], data);

										// load user defined column value
										if(assemblyResourceDynamicUserDefinedColumnService){
											let resoruceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);

											resoruceUserDefinedColumnService.attachDataToColumn(data.getList()).then(function() {
												if (arg) {
													estimateAssembliesService.onCellChange.apply(estimateAssembliesService, arg);
													arg = null;
												}
											});
											resoruceUserDefinedColumnService.updateColumnsReadOnlyStats(data.getList());
										}

										estimateMainResourceProcessor.setDisabledChildrenReadOnly(serviceContainer.service.getList());

										if(service.onPrjAssemlyChanged){
											service.onPrjAssemlyChanged.fire();
										}

										return result;
									},
									handleCreateSucceeded : function(newData){
										// add empty user defined column value to new item.
										if(assemblyResourceDynamicUserDefinedColumnService){
											let resoruceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);
											resoruceUserDefinedColumnService.attachEmptyDataToColumn(newData);
										}

										doSetShortKeyReadOnly(newData, service);

										return newData;
									}
								}
							},
							translation: {
								uid: 'estimateAssembliesResourceService',
								title: 'estimate.assemblies.containers.assemblyResources',
								columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
							},
							dataProcessor: [new ServiceDataProcessArraysExtension(['EstResources']), estimateMainResourceImageProcessor, estimateMainResourceProcessor],
							entityRole: {
								node: {
									codeField: 'Code',
									itemName: option.itemName,
									moduleName: 'Estimate Assemblies',
									parentService: estimateAssembliesService
								}
							}
						}
					};

					let serviceContainer = platformDataServiceFactory.createNewComplete(estimateAssembliesResourceServiceOption);

					let baseOnDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function(deleteParams, data, response){
						// Remove dynamic columns
						// This should be places here, it will throw error to delete resource columns
						let assemblyResourceCharacteristicsService = option.isPrjAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
						assemblyResourceCharacteristicsService.deleteDynColumns(deleteParams.entities);

						baseOnDeleteDone(deleteParams, data, response); // remove the deleted item form list

						let selectedAssembly = estimateAssembliesService.getSelected();

						// remove the user defined column value of deleted resource
						if(assemblyResourceDynamicUserDefinedColumnService){
							$injector.get(assemblyResourceDynamicUserDefinedColumnService).handleEntitiesDeleted(deleteParams.entities, selectedAssembly, service.getTree());
						}

						if(!selectedAssembly){
							return;
						}

						estimateAssembliesCalculationService.loadCompositeAssemblyResources(service.getList()).then(function(){
							calculateAssemblyResource(selectedAssembly, service.getTree());
							estimateAssembliesService.fireItemModified(selectedAssembly);
							estimateAssembliesService.gridRefresh();
						});
					};

					let service = serviceContainer.service;
					let resList = [];

					serviceContainer.data.newEntityValidator = estimateAssembliesResourceValidationProcessService;

					let baseOnCreateItem = service.createItem;
					service.createItem = function(){
						let defer = $q.defer();

						let assemblyResourceCharacteristicsService = option.isPrjAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
						assemblyResourceCharacteristicsService.setDefaultColsToGrid().then(function(){
							defer.resolve(baseOnCreateItem(null, serviceContainer.data));
						});
						return defer.promise;
					};

					service.setDoNotLoadOnSelectionChange = function(value){
						serviceContainer.data.doNotLoadOnSelectionChange = value;
					};

					service.setScope = function (scope) {
						parentScope = scope;
					};

					service.isResourcesLoaded = function isResourcesLoaded(lineItem) {
						if (lineItem && parentItem && lineItem.Id === parentItem.Id && !isLoading) {
							return true;
						}
						return false;
					};

					let arg = null;

					service.setParentCellChangeArg = function setParentCellChangeArg(){
						arg = arguments;
					};

					service.setList = function setList(data, isReadOnly) {
						data = data ? data : [];

						cloudCommonGridService.sortTree(data, 'Sorting', 'EstResources');
						serviceContainer.data.itemTree = _.filter(data, function (item) {
							return item.EstResourceFk === null;
						});
						let flatResList = [];
						cloudCommonGridService.flatten(data, flatResList, 'EstResources');
						flatResList = _.uniq(flatResList, 'Id');
						serviceContainer.data.itemList = flatResList;
					};

					service.fireListLoaded = function fireListLoaded() {
						serviceContainer.data.listLoaded.fire();
					};

					// Bulk editor.
					service.refresh = function(){
					};

					service.setLineTypeReadOnly = function setLineTypeReadOnly(readItems){
						angular.forEach(readItems, function (item) {
							if(!_.isEmpty(item.Code)){
								estimateMainResourceProcessor.setLineTypeReadOnly(item, true);
							}

							if(!_.isEmpty(item.EstResources)){
								setLineTypeReadOnly(item.EstResources);
							}
						});
					};

					function calculateAssemblyResource(assemblyItem, assemblyResources){
						if(!assemblyItem || !assemblyResources){
							return;
						}
						estimateAssembliesCalculationService.calculateLineItemAndResourcesOfAssembly(assemblyItem, assemblyResources, service.getAssemblyType());
						angular.forEach(assemblyResources, function(res){
							fireResourceAsModified(true, res);
						});
					}

					service.getAssemblyType = function(){
						if(option && option.isPrjPlantAssembly){
							return estimateCommonAssemblyType.ProjectPlantAssembly;
						}else if(option && option.isPrjAssembly){
							return estimateCommonAssemblyType.ProjectAssembly;
						}else if(option && option.isPlantAssembly){
							return estimateCommonAssemblyType.PlantAssembly;
						}else {
							return estimateCommonAssemblyType.MasterAssembly;
						}
					};

					function markChildrenAsModified(parent) {
						let children = cloudCommonGridService.getAllChildren(parent, 'EstResources');
						angular.forEach(children, function (res) {
							fireResourceModified(res);
						});
					}

					function doSetShortKeyReadOnly(resItem, service) {
						estimateMainResourceProcessor.doSetShortKeyReadOnly(resItem, service);
					}

					function fireResourceAsModified(isPrjUpdate, res) {
						if (res.EstResourceFk > 0) {
							// get parent item and mark as modified
							let rootParent = cloudCommonGridService.getRootParentItem(res, service.getList(), 'EstResourceFk');// todo: flatten n test
							if (rootParent) {
								fireResourceModified(rootParent);
								markChildrenAsModified(rootParent, res);
							}
						}
						else if (res.HasChildren && res.EstResources.length > 0) {
							// get all children and mark as modified
							fireResourceModified(res);
							markChildrenAsModified(res, {});
						}
						else {
							if (isPrjUpdate) {
								fireResourceModified(res);
							}
						}
					}

					function fireResourceModified(resource) {
						service.fireItemModified(resource);
					}

					service.estimateAssemblyResources = function estimateAssemblyResources(arg) {
						let estimateMainCommonCalculationService = $injector.get('estimateMainCommonCalculationService');
						let estimateMainCommonService = $injector.get('estimateMainCommonService');

						$injector.get('projectAssemblyMainService').setIsPrjPlantAssembly(option && option.isPrjPlantAssembly);
						$injector.get('projectAssemblyMainService').setIsPrjAssembly(option && option.isPrjAssembly ? option.isPrjAssembly : false);

						resList = service.getList();
						let parentAssembly = estimateAssembliesService.getSelected();
						estimateMainCommonService.calQuantityUnitTarget(parentAssembly);

						// SubItem
						if (arg && arg.field && arg.field === 'EstResourceTypeShortKey' && arg.item.EstResourceTypeFk === estimateMainResourceType.SubItem) {
							arg.item.BasCurrencyFk = estimateAssembliesService.getCompanyCurrency();
							$injector.get('estimateMainSubItemCodeGenerator').getSubItemCode(arg.item, resList);
						}

						return $injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resList).then(function(){
							if (arg) {
								let promises = [];
								let col = arg.field;
								if(col === 'Code') {
									promises.push($injector.get('estimateAssembliesService').setAssemblyResources(service.getList()));
								}

								if (col === 'EstResourceTypeFkExtend' || col === 'EstResourceTypeShortKey') {
									arg.item.BasCurrencyFk = parentAssembly.BasCurrencyFk;
									arg.item.Code = arg.item.DescriptionInfo.Translated = arg.item.DescriptionInfo.Description = '';
									estimateMainResourceImageProcessor.processItem(arg.item);

									fireResourceModified(arg.item);

									if(arg.item.EstResourceTypeFk === estimateMainResourceType.Assembly) {
										estimateMainResourceProcessor.setByEditableFlag(arg.item,null);
									}
									// SubItem
									if (arg.item.EstResourceTypeFk === estimateMainResourceType.SubItem) {
										arg.item.BasCurrencyFk = estimateAssembliesService.getCompanyCurrency();
										$injector.get('estimateMainSubItemCodeGenerator').getSubItemCode(arg.item, resList);
										estimateMainResourceProcessor.setLineTypeReadOnly(arg.item, true);
										estimateMainResourceProcessor.setCostUnitReadOnly(arg.item, true);
									}
									else if(arg.item.EstResourceTypeFk === estimateMainResourceType.InternalTextLine || arg.item.EstResourceTypeFk === estimateMainResourceType.TextLine) {
										arg.item.BasCurrencyFk = null;
										estimateMainResourceProcessor.processItem(arg.item, null);
										estimateMainResourceProcessor.setCostUnitReadOnly(arg.item, true);
										estimateMainResourceProcessor.setLineTypeReadOnly(arg.item, true);
									} else {
										if(assemblyResourceDynamicUserDefinedColumnService) {
											$injector.get(assemblyResourceDynamicUserDefinedColumnService).fieldChange(arg.item, col);
										}
										return $q.when(true);
									}
								}
								if (col === 'CommentText') {
									return $q.when(true);
								}
								else if (col === 'IsDisabled') {
									if (arg.item && arg.item.Id) {
										let resourcesChanged = estimateAssembliesCalculationService.updateResourceOfAssembly(arg.item, parentAssembly, resList);
										estimateMainCommonCalculationService.markResAsModified(resourcesChanged);
										estimateMainResourceProcessor.processItems(resList, true);
									}
								}
								else if(col === 'Sorting') {
									estimateMainGenerateSortingService.sortOnEdit(resList, arg.item, service);
									return $q.when(true);
								}
								else {
									let info = {
										'projectInfo': null,
										'selectedResourceItem': service.getSelected(),
										'parentLineItem': parentAssembly,
										'resList': resList,
										'lineItemList': estimateAssembliesService.getList()
									};
									if (arg.item.EstResourceTypeFk === estimateMainResourceType.Assembly && (col === 'Code' || col === 'DescriptionInfo')) {

										let assembly = estimateMainCommonService.getSelectedLookupItem();
										if (assembly && assembly.Id) {

											arg.item.Code = assembly.Code;
											arg.item.DescriptionInfo = assembly.DescriptionInfo;

											estimateMainCommonService.extractSelectedItemProp(assembly, arg.item, true);
											let isCompositeAssemblyPromise = $http.get(globals.webApiBaseUrl + 'estimate/assemblies/assemblytype/iscompositeassembly?assemblyId=' + assembly.Id).then(function (response) {
												if (response.data.isComposite) {
													estimateMainCommonService.getResourceTypeByAssemblyType(response.data.assemblyType).then(function (resourceType) {
														if (resourceType) {
															arg.item.EstResourceTypeFk = 4;
															arg.item.EstResourceTypeFkExtend = resourceType.Id;
															arg.item.EstAssemblyTypeFk = resourceType.EstAssemblyTypeFk;
															let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(arg, service.getList(), parentAssembly, null, service.getAssemblyType());
															estimateMainCommonCalculationService.markResAsModified(resourcesChanged);
															service.gridRefresh();
															estimateAssembliesService.gridRefresh();
														}
													});
												}
											});
											promises.push(isCompositeAssemblyPromise);
										}
									}

									estimateMainCommonCalculationService.setInfo(info);

									let project = $injector.get('projectMainService').getSelected();
									let isProjectAssembly = option.isPrjAssembly || option.isPrjPlantAssembly;
									let projectId = isProjectAssembly && project ? project.Id : 0;

									let exchangePromise = $injector.get('estimateMainExchangeRateService').loadData(projectId).then(
										function () {
											let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(arg, resList, parentAssembly, null);
											if (parentAssembly) {
												estimateAssembliesService.fireItemModified(parentAssembly);
											}
											estimateMainCommonCalculationService.markResAsModified(resourcesChanged);
											estimateMainCommonCalculationService.refreshData.fire(parentAssembly);
										}
									);

									promises.push(exchangePromise);
								}

								let resourceList = service.getList();
								let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(arg, resourceList, parentAssembly, null, service.getAssemblyType());
								if(assemblyResourceDynamicUserDefinedColumnService) {
									let udpPromise = $injector.get(assemblyResourceDynamicUserDefinedColumnService).fieldChange(arg.item, col, parentAssembly, resourceList);
									promises.push(udpPromise);
								}

								return $q.all(promises).then(function (){
									estimateMainCommonCalculationService.markResAsModified(resourcesChanged);
									service.gridRefresh();
									estimateAssembliesService.gridRefresh();
								});
							}
						});
					};

					let oldNewResourceMapping = {};
					// Resolve function to process resource, returns processed resource(Assembly validated, Cost code, Material processed) in tree structure
					service.resolveResourcesAndAssign = function resolveResourcesAndAssign(assemblyItem, assemblyIds, resourceType, prjCostCodeIds,plantAssemblyDictionary){
						let selectedResource = service.getSelected();
						let selectedResourceParent = service.getItemById(selectedResource.EstResourceFk);
						let subItemToAssign = selectedResourceParent ? selectedResourceParent : null;

						let postData = {
							MainItemId: assemblyItem.Id,
							ItemIds: assemblyIds,
							ResourceType: resourceType,
							ParentResourceFk: subItemToAssign ? subItemToAssign.Id : null,
							IsTakeOverFromMasterAssembly: service.getAssemblyType() === estimateCommonAssemblyType.MasterAssembly
						};

						if(plantAssemblyDictionary){
							postData.PlantAssemblyDictionary = plantAssemblyDictionary;
						}

						if (option && (option.isPrjAssembly)) {
							postData.IsProjectAssembly = option.isPrjAssembly;
							postData.LgmJobFk = assemblyItem.LgmJobFk;

							let project = $injector.get('projectMainService').getSelected();
							postData.ProjectId = project.Id;

							if (prjCostCodeIds && _.isArray(prjCostCodeIds)) {
								postData.PrjItemIds = prjCostCodeIds;
							}
						}

						if (option && (option.isPrjPlantAssembly)) {
							postData.IsPrjPlantAssembly = option.isPrjPlantAssembly;
							postData.LgmJobFk = assemblyItem.LgmJobFk;

							let project = $injector.get('projectMainService').getSelected();
							postData.ProjectId = project.Id;

							if(plantAssemblyDictionary){
								postData.PlantAssemblyDictionary = plantAssemblyDictionary;
							}
						}

						postData.IsPlantAssembly = option && option.isPlantAssembly;
						const translationKey = {
							1: 'estimate.main.addCostCode',
							2: 'estimate.main.addMaterial',
							4: 'estimate.main.addAssembly',
						}[resourceType];
						parentScope.loadingText = translationKey ? $translate.instant(translationKey) : parentScope.loadingText;
						parentScope.isLoading = true;

						return getAssemblyResourcesRequest(postData).then(function(data){
							let resourceTrees = data.resources || []; // Array of list resources
							let userDefinedCostValueList = data.UserDefinedcolsOfResource;
							clearValidationFromCurrentResource(selectedResource);

							if(resourceTrees.length > 0) {
								// Follow this order to process list
								if (resourceType === estimateMainResourceType.Plant) {
									estimateMainPlantAssemblyHandlerService.setPlantAssemblyResourcesTreeNodeInfo(resourceTrees, selectedResource,service);
								} else {
									setAssemblyResourcesTreeNodeInfo(selectedResource, resourceTrees,subItemToAssign);
								}
								mergeCurrentResource(selectedResource, resourceTrees, _.first(assemblyIds), resourceType,resourceType === 1 ? _.first(resourceTrees).ProjectCostCodeFk:null,_.first(resourceTrees).EtmPlantFk);

								if (resourceType === estimateMainResourceType.Plant) {
									estimateMainPlantAssemblyHandlerService.setPlantAssemblyResourcesTreeToContainerData(resourceTrees, selectedResource, serviceContainer, service);
								} else {
									setAssemblyResourcesTreeToContainerData(resourceTrees, subItemToAssign, null, selectedResource);
								}
								setResourceCharacteristics(data.resourcesCharacteristics || []);

								if (!option.isPrjPlantAssembly) {
									estimateAssembliesCalculationService.loadCompositeAssemblyResources(service.getList()).then(function(data){
										// multi select assemblies to create resources.
										let resList = service.getList();
										_.each(resList, function (resItem){
											if (resItem.EstAssemblyFk) {
												let findItem = _.find(resourceTrees, {'Id': resItem.Id});
												if (findItem) {
													let lineItem = _.find(data, {'Id': resItem.EstAssemblyFk});
													if (lineItem) {
														$injector.get('estimateMainCommonService').extractSelectedItemProp(lineItem, resItem, true);
													}
												}
											}
										});
									});
								}

								// Attach user defined price value to resoruce
								if(angular.isArray(userDefinedCostValueList)){
									// update merged resource id to UserDefinedcolsOfResource
									userDefinedCostValueList.forEach(function(item){
										var newId = oldNewResourceMapping[item.Pk3];
										if(newId && newId > 0){
											item.Pk3 = newId;
										}
									});

									setUserDefinedColToResource(assemblyItem, resourceTrees, userDefinedCostValueList);
									clearOldNewResourceMapping();
								}

								// Lastly calculate totals and validate sub items
								calculateAssemblyResource(assemblyItem, service.getTree());

								// Refresh views
								estimateAssembliesService.gridRefresh();
								service.loadData(); // it is replace with gridRefresh() because sorting was not in order
								parentScope.isLoading = false;
								return $q.when(true);
							} else {
								// Refresh views
								let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
								modTrackServ.clearModificationsInRoot(estimateAssembliesService);
								service.gridRefresh();
								parentScope.isLoading = false;
								estimateAssembliesService.gridRefresh();
								return $q.when(null);
							}
						}, function(err){
							// eslint-disable-next-line no-console
							console.error(err);
							return $q.when(true);
						});
					};

					service.loadData = function loadData(){
						cloudCommonGridService.sortTree(serviceContainer.data.itemList, 'Sorting', 'EstResources');
						cloudCommonGridService.sortTree(serviceContainer.data.itemTree, 'Sorting', 'EstResources');
						service.gridRefresh();
					}

					service.getAssemblyLookupSelectedItems = function getAssemblyLookupSelectedItems(entity, assemblySelectedItems){
						if (!_.isEmpty(assemblySelectedItems) && _.size(assemblySelectedItems) > 1){
							let assemblyIds = _.map(assemblySelectedItems, 'Id');
							let assemblyItem = estimateAssembliesService.getSelected();
							let resourceTypeAssembly = 4;

							service.resolveResourcesAndAssign(assemblyItem, assemblyIds, resourceTypeAssembly);
						}
					};

					service.getPlantAssemblyLookupSelectedItems = function getPlantAssemblyLookupSelectedItems(entity, plantAssemblySelectedItems) {
						if (!_.isEmpty(plantAssemblySelectedItems) && _.size(plantAssemblySelectedItems) > 1) {
							let plantAssemblyDictionary = {};
							for (let i = 0; i < plantAssemblySelectedItems.length; i++) {
								const entity = plantAssemblySelectedItems[i];
								const entityId = entity.Id;
								if (!plantAssemblyDictionary[entityId]) {
									plantAssemblyDictionary[entityId] = [];
								}
								plantAssemblyDictionary[entityId] = entity.PlantFk;
							}

							let plantAssemblyIds = _.map(plantAssemblySelectedItems, 'Id');
							let lineItem = estimateAssembliesService.getSelected();
							let resourceTypeAssembly = 3;
							let validationService = $injector.get('estimateMainResourceValidationService');
							let dataService = $injector.get(option.serviceName);

							// when system option is false only then
							if(!option.isPlantAssembly) {
								return validationService.validateEquipmentAssembly(plantAssemblySelectedItems, entity, dataService, option.isMasterAssembly, option.isPrjPlantAssembly, option.isPrjAssembly).then(function (response) {

									if(!response.valid){
										// remove matching code from dictionary and pass it to backend
										plantAssemblyDictionary = _.omit(plantAssemblyDictionary, response.matchingIds);
										plantAssemblyIds = plantAssemblyIds.filter(id => !response.matchingIds.includes(id));
									}
									if (_.isEmpty(plantAssemblyDictionary)) {
										$injector.get('platformDataServiceModificationTrackingExtension').clearModificationsInRoot(serviceContainer.service, serviceContainer.data, plantAssemblySelectedItems);
										return;
									}
									return service.resolveResourcesAndAssign(lineItem, plantAssemblyIds, resourceTypeAssembly, null, plantAssemblyDictionary);
								});
							} else {
								return service.resolveResourcesAndAssign(lineItem, plantAssemblyIds, resourceTypeAssembly, null, plantAssemblyDictionary);
							}

						}
					};

					service.getCostCodeLookupSelectedItems = function getCostCodeLookupSelectedItems(entity, costCodeSelectedItems){
						if (!_.isEmpty(costCodeSelectedItems) && _.size(costCodeSelectedItems) > 1){
							let costCodeIds = _.map(costCodeSelectedItems, 'Id');
							let prjCostCodeIds =  null;
							if(option && (option.isPrjAssembly || option.isPrjPlantAssembly)) {
								costCodeIds = _.map(_.filter(costCodeSelectedItems, e => !e.IsOnlyProjectCostCode), 'OriginalId');
								prjCostCodeIds = _.map(_.filter(costCodeSelectedItems, e => !!e.IsOnlyProjectCostCode), 'OriginalId');
							}
							let assemblyItem = estimateAssembliesService.getSelected();
							let resourceTypeCostCode = 1;
							costCodeLookuopSelectedItems = costCodeSelectedItems;

							service.resolveResourcesAndAssign(assemblyItem, costCodeIds, resourceTypeCostCode, prjCostCodeIds);
						}
					};

					service.getMaterialLookupSelectedItems = function getMaterialLookupSelectedItems(entity, materialSelectedItems){
						if (!_.isEmpty(materialSelectedItems) && _.size(materialSelectedItems) > 1){
							let materialIds = _.map(materialSelectedItems, 'Id');
							let assemblyItem = estimateAssembliesService.getSelected();
							let resourceTypeMaterial = 2;
							materialLookupSelectedItems = materialSelectedItems;

							service.resolveResourcesAndAssign(assemblyItem, materialIds, resourceTypeMaterial);
						}
					};

					let filters = [
						{
							key: 'estimate-assemblies-resources-assembly-type-filter',
							fn: function (item, entity) { // item = assembly categor
								if (entity.EstResourceTypeFk === estimateMainResourceType.Assembly && entity.EstAssemblyTypeFk) { // only assembly and composite assemblies

									let getMapTypeAssemblyCats = function(assemblyCatChildren, childContainsAssemblyType) {
										let catalogs = _.filter(assemblyCatChildren, {EstAssemblyTypeFk: entity.EstAssemblyTypeFk});

										if (!_.size(catalogs)) {
											let ids = [];
											_.each(assemblyCatChildren, function (assemblyCat) {
												if (assemblyCat) {
													if (assemblyCat.AssemblyCatChildren && assemblyCat.AssemblyCatChildren.length > 0) {
														getMapTypeAssemblyCats(assemblyCat.AssemblyCatChildren, childContainsAssemblyType);
													} else {
														ids.push(assemblyCat.Id);
													}
												}
											});

											_.each(ids, function (id) {
												_.remove(assemblyCatChildren, {'Id': id});
											});
										} else {
											let ids = [];
											_.each(assemblyCatChildren, function (assemblyCat) {
												if (assemblyCat !== null) {
													if (assemblyCat.EstAssemblyTypeFk === entity.EstAssemblyTypeFk) {
														childContainsAssemblyType.push(assemblyCat);
													} else {
														ids.push(assemblyCat.Id);
													}
												}

											});

											_.each(ids, function (id) {
												_.remove(assemblyCatChildren, {'Id': id});
											});
										}
									};

									if (item.nodeInfo.level === 0 ) {
										let childContainsAssemblyType = [];
										if (item.AssemblyCatChildren) {
											item.IsTemp = true;
											// Item is added only for reference, but not used in search filters
											getMapTypeAssemblyCats(item.AssemblyCatChildren, childContainsAssemblyType);
										} else {
											if (entity.EstResourceTypeFk === estimateMainResourceType.Assembly && entity.EstAssemblyTypeFk && item.EstAssemblyTypeFk === entity.EstAssemblyTypeFk) {
												return true;
											}
										}

										return _.size(childContainsAssemblyType);
									}

									// Assembly type does not match
									return false;
								}
								// General assemblies : A
								return true;
							}
						},
						{
							key: 'estimate-assemblies-resources-self-assignment-filter',
							fn: function (item) {
								let assembly = estimateAssembliesService.getSelected() || {};
								return assembly.Id !== item.Id;
							}
						}
					];

					service.handleUpdateDone =  function handleUpdateDone(data) {
						let itemListResponse = angular.copy(_.map(data, 'EstResource'));

						let updateTree = function updateTree(list){
							_.forEach(list, function(oldItem){
								let updatedItem = _.find(itemListResponse,{ Id: oldItem.Id });
								if (updatedItem){
									updatedItem.EstResources = oldItem.EstResources;
									angular.extend(oldItem, updatedItem);
								}
								if (oldItem.HasChildren){
									updateTree(oldItem.EstResources);
								}
							});
						};

						updateTree(serviceContainer.data.itemTree);

						let itemListOriginal = [];
						serviceContainer.data.flatten(serviceContainer.data.itemTree, itemListOriginal, serviceContainer.data.treePresOpt.childProp);
						estimateMainResourceImageProcessor.processItems(itemListOriginal);

						serviceContainer.data.itemListOriginal = angular.copy(itemListOriginal);
					};

					service.registerFilters = function registerFilters(){
						basicsLookupdataLookupFilterService.registerFilter(filters);
					};

					service.unregisterFilters = function unregisterFilters() {
						basicsLookupdataLookupFilterService.unregisterFilter(filters);
					};

					// bulk editor changes
					service.valueChangeCallBack = function valueChangeCallBack(item,field) {
						let projectMainServ = $injector.get('projectAssemblyMainService');
						let isPrjPlantAssembly = option && option.isPrjPlantAssembly;

						projectMainServ.setIsPrjAssembly(!isPrjPlantAssembly);
						projectMainServ.setIsPrjPlantAssembly(isPrjPlantAssembly);

						if(isPrjPlantAssembly || (option && option.isMasterAssembly)){
							return prjPlantAssemblyValuechangeCallBack(item, field);
						}
						else if($injector.get('platformGridAPI').grids.element('id', '20c0401f80e546e1bf12b97c69949f5b')){
							return prjAssemlyvalueChangeCallBack(item,field);
						}else {
							let resourceList = service.getList();
							if (field === 'IsGc') {
								if (item && item.Id) {
									service.setIndirectCost(resourceList, item.IsGc);
								}
							}
							let argData = {item: item, colName: field};
							let parentAssembly = estimateAssembliesService.getSelected();
							let estimateMainCommonService = $injector.get('estimateMainCommonService');
							return $injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resourceList).then(function(){
								let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(argData, resourceList, parentAssembly, null, service.getAssemblyType());
								$injector.get('estimateMainCommonCalculationService').markResAsModified(resourcesChanged);
								service.gridRefresh();
								estimateAssembliesService.gridRefresh();

								return true;
							});
						}
					};

					function prjPlantAssemblyValuechangeCallBack(item, field) {
						let mainService = estimateAssembliesService;
						let resourceService = option && _.isString(option.serviceName) ? $injector.get(option.serviceName) : null;
						if(!resourceService || !mainService){
							return $q.when(true);
						}
						let estimateMainCommonService = $injector.get('estimateMainCommonService');
						let calculationService = $injector.get('estimateMainCommonCalculationService');
						let argData = {item: item, colName: field};
						let parentAssembly = mainService.getSelected();
						let resourceList = resourceService.getList();

						if (field === 'WorkOperationTypeFk') {
							let selectedProjectId = $injector.get('projectMainService').getIfSelectedIdElse(0);
							return $injector.get('estimateMainPlantEstimateMultiplierService').updateMultipliersFrmEquipmentEstimate(item, selectedProjectId).then(function () {
								resourceService.markItemAsModified(item);
								let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(argData, resourceList, parentAssembly, null, estimateCommonAssemblyType.ProjectPlantAssembly);
								calculationService.markResAsModified(resourcesChanged);
								resourceService.gridRefresh();
								mainService.gridRefresh();
								estimateMainResourceProcessor.processItems(resourceList);
								return true;
							});
						} else {
							return $injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resourceList).then(function(){
								let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(argData, resourceList, parentAssembly, null, estimateCommonAssemblyType.ProjectPlantAssembly);
								calculationService.markResAsModified(resourcesChanged);
								resourceService.gridRefresh();
								mainService.gridRefresh();
								estimateMainResourceProcessor.processItems(resourceList);
								return true;
							});
						}
					}

					function prjAssemlyvalueChangeCallBack(item,field) {
						let projectAssemblyResourceService = $injector.get('projectAssemblyResourceService');
						let resourceList = projectAssemblyResourceService.getList();
						if (field === 'IsGc') {
							if (item && item.Id) {
								service.setIndirectCost(resourceList, item.IsGc);
							}
						}
						let argData = {item: item, colName: field};
						let projectAssemblyMainService = $injector.get('projectAssemblyMainService');
						let parentAssembly = projectAssemblyMainService.getSelected();

						let estimateMainCommonService = $injector.get('estimateMainCommonService');
						return $injector.get('estimateAssembliesCalculationService').loadCompositeAssemblyResources(resourceList).then(function(){
							let resourcesChanged = estimateMainCommonService.calculateDetailAndCostTotalOfAssembly(argData, resourceList, parentAssembly, null, estimateCommonAssemblyType.ProjectAssembly);
							$injector.get('estimateMainCommonCalculationService').markResAsModified(resourcesChanged);
							projectAssemblyResourceService.gridRefresh();
							projectAssemblyMainService.gridRefresh();

							return true;
						});
					}

					let calculateFields = [
						'Quantity', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4',
						'ProductivityFactor', 'EfficiencyFactor1', 'EfficiencyFactor2', 'CostUnit', 'CostFactor1',
						'CostFactor2', 'HoursUnit'
					];

					service.reactOnChangeOfItem = function reactOnChangeOfItem(entity, propertyName, isFromBulkEditor) {
						if (isFromBulkEditor && _.some(calculateFields, function (field) {return field === propertyName;})) {
							this.valueChangeCallBack(entity, propertyName);
						}
					};

					service.setIndirectCost = function setIndirectCost(resources, isIndirectCost){
						angular.forEach(resources, function(res){
							res.IsIndirectCost = res && res.EstRuleSourceFk ? res.IsIndirectCost  : !!isIndirectCost;
						});
					};

					service.calculateAssemblyResource = calculateAssemblyResource;

					let assemblyGridId;
					service.getGridId = function getAssemblyGridId() {
						return assemblyGridId;
					};

					service.setGridId = function setAssemblyGridId(gridId) {
						assemblyGridId = gridId;
					};

					return serviceContainer;


					function setDataOriginal(readData) {
						let itemTree = readData.dtos || [];

						let itemListOriginal = [];
						serviceContainer.data.flatten(itemTree, itemListOriginal, serviceContainer.data.treePresOpt.childProp);
						estimateMainResourceImageProcessor.processItems(itemListOriginal);
						_.forEach(itemListOriginal, function (item) {
							item.parentJobFk = readData.parentJobFk;
						});

						serviceContainer.data.itemListOriginal = angular.copy(itemListOriginal);
					}

					// Resolve assembly function
					function getAssemblyResourcesRequest(customPostData){
						let defer = $q.defer();
						let postData = {};

						angular.extend(postData, customPostData);
						let selectedResourceItem = service.getSelected();
						let allItems = service.getList()
						let unsavedResources = _.filter(allItems, item => item.Id !== selectedResourceItem.Id && item.Version === 0);
						postData.UnsavedResourceTree = unsavedResources;
						let processResolvedItems = function processResolvedItems(resources){
							let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
							let estimateMainCommonService = $injector.get('estimateMainCommonService');
							_.forEach(resources, function(item){
								platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);
								if (item.HasChildren){
									processResolvedItems(item.EstResources);
								}

								// set the search costcodes to resource
								if (item.EstResourceTypeFk === estimateMainResourceType.CostCode && costCodeLookuopSelectedItems) {
									let costCode = item.MdcCostCodeFk ? _.find(costCodeLookuopSelectedItems, {'OriginalId': item.MdcCostCodeFk}) :
										_.find(costCodeLookuopSelectedItems, {'OriginalId': item.ProjectCostCodeFk});

									if (costCode) {
										estimateMainCommonService.setSelectedCodeItem(null, item, true, costCode, true);
									}
								}

								// set the search materials to resouce
								if (item.EstResourceTypeFk === estimateMainResourceType.Material && materialLookupSelectedItems) {
									let material = _.find(materialLookupSelectedItems, {'Id': item.MdcMaterialFk});
									if (material) {
										estimateMainCommonService.setSelectedCodeItem(null, item, true, material, true);
									}
								}
							});

							materialLookupSelectedItems = null;
							costCodeLookuopSelectedItems = null;
						};

						$http.post(globals.webApiBaseUrl + 'estimate/main/resource/getresourcestoassembly', postData)
							.then(function(response) {

								let resources = response.data.resources;

								if(resources && resources.length) {
									processResolvedItems(response.data.resources);

									let itemList = service.getList();
									let selectedItem = service.getSelected();

									if (selectedItem !== null && selectedItem !== undefined) {
										let filteredList = _.filter(itemList, {'EstResourceFk': selectedItem.EstResourceFk});
										let maxItem = _.maxBy(filteredList, 'Sorting');
										let newSortingNumber = selectedItem.Sorting === maxItem.Sorting ? selectedItem.Sorting : maxItem.Sorting + 1;
										estimateMainGenerateSortingService.assignSorting(resources, newSortingNumber.toString(), true, true);
									}
								}
								defer.resolve(response.data);
							}, function(err){
								// eslint-disable-next-line no-console
								console.error(err);
								defer.resolve(err);
							});

						return defer.promise;
					}

					// Resolve assembly function
					function clearValidationFromCurrentResource(resource){
						if (resource){
							let estimateAssembliesResourceValidationService = $injector.get('estimateAssembliesResourceValidationService');

							$injector.get('platformRuntimeDataService').applyValidationResult(true, resource, 'Code');
							$injector.get('platformDataValidationService').removeFromErrorList(resource, 'Code', estimateAssembliesResourceValidationService, service);
						}
					}

					// Resolve assembly function
					function mergeCurrentResource(resource, items, mainResourceId, resTypeId, prjCostCodeFk, plantFk){
						// items : Array of treeItems
						if (resource){
							// Pick the first assembly and merged it to the selected resource
							let resDefaultFilter = {};
							switch (resTypeId){
								case estimateMainResourceType.CostCode: // CostCode
									if(prjCostCodeFk) {
										resDefaultFilter.ProjectCostCodeFk = prjCostCodeFk;
									}else {
										resDefaultFilter.MdcCostCodeFk = mainResourceId;
									}
									break;
								case estimateMainResourceType.Material: // Material
									resDefaultFilter.MdcMaterialFk = mainResourceId;
									break;
								case estimateMainResourceType.Plant: // Plant Assembly
									if(plantFk){
										resDefaultFilter.EtmPlantFk = plantFk;
									}
									else{
										resDefaultFilter.EstAssemblyFk = mainResourceId;
									}
									break;
								case estimateMainResourceType.Assembly: // Assembly
									resDefaultFilter.EstAssemblyFk = mainResourceId;
									break;
							}
							let resToUpdate = _.find(items, resDefaultFilter);

							if (resToUpdate){
								// Keep the id and relation id
								oldNewResourceMapping[resToUpdate.Id] = resource.Id;

								if (resTypeId === estimateMainResourceType.Plant) {
									// to identify the old EA parent
									resToUpdate.OldEstResourceFk = resource.EstResourceFk;
								}
								else{
									resToUpdate.EstResourceFk = resource.EstResourceFk;
								}

								resToUpdate.Id = resource.Id;

								if (resToUpdate.HasChildren){
									_.forEach(resToUpdate.EstResources, function(rUpdate){
										rUpdate.EstResourceFk = resource.Id;
									});
								}
								angular.extend(resource, resToUpdate);
							}
						}
					}

					// Resolve assembly function
					function setAssemblyResourcesTreeNodeInfo(resource, items, subItemToAssign){
						let selectedResourceLevel = resource && resource.nodeInfo && resource.nodeInfo.level ? resource.nodeInfo.level : 0;

						let iterateResources = function iterateResources(items, level){
							_.forEach(items, function (item){
								let collapsed = level > 0;
								item.nodeInfo = { collapsed: collapsed, level: level, children: item.HasChildren };

								if (item.HasChildren){
									iterateResources(item.EstResources, level + 1);
								}
							});
						};

						// move
						if (subItemToAssign){
							subItemToAssign.nodeInfo.collapsed = false;
							subItemToAssign.nodeInfo.children = true;
							selectedResourceLevel = selectedResourceLevel + 1;
						}

						// revert step
						if (selectedResourceLevel && resource && resource.EstResourceTypeFk !== 5){
							selectedResourceLevel = selectedResourceLevel - 1;
						}

						iterateResources(items, selectedResourceLevel);
					}

					// Resolve assembly function
					function setAssemblyResourcesTreeToContainerData(items, subItemToAssign, itemLevelToAssign,selectedResource){
						let res = selectedResource;

						_.forEach(items, function (item){

							if (res && res.Id === item.Id){ // resolve
								// we do not add this item to data.itemList, because by default it already was added.
								serviceContainer.data.markItemAsModified(item, serviceContainer.data);
							}else{
								// add item to save
								serviceContainer.data.itemList.push(item);
								serviceContainer.data.addEntityToCache(item, serviceContainer.data);
								serviceContainer.data.markItemAsModified(item, serviceContainer.data);

								// add parent resource to itemTree
								if (!_.isNumber(item.EstResourceFk)){

									if (subItemToAssign) { // move
										item.EstResourceFk = subItemToAssign.Id;
										subItemToAssign.HasChildren = true;
										subItemToAssign.EstResources.push(item);
										serviceContainer.data.markItemAsModified(item, serviceContainer.data);

									} else if (itemLevelToAssign){ // copy
										let parent = _.find(service.getList(), { Id: itemLevelToAssign.EstResourceFk });
										if (parent){
											// let index = _.findIndex(parent.EstResources, { Id: itemLevelToAssign.Id });
											// parent.EstResources.splice(index, 0, item);
											parent.EstResources.push(item);
										}else{
											// we check index from the tree list
											// let indexTree = _.findIndex(service.getTree(), { Id: itemLevelToAssign.Id });
											// serviceContainer.data.itemTree.splice(indexTree, 0, item);
											serviceContainer.data.itemTree.push(item);
										}

									}else{
										serviceContainer.data.itemTree.push(item);
									}
								}
							}

							if (item.HasChildren){
								setAssemblyResourcesTreeToContainerData(item.EstResources);
							}
						});
					}

					function setUserDefinedColToResource(lineItem, resourceTrees, newUserDefinedCols){
						if(angular.isArray(newUserDefinedCols) && assemblyResourceDynamicUserDefinedColumnService) {
							let resoruceUserDefinedColumnService = $injector.get(assemblyResourceDynamicUserDefinedColumnService);

							resoruceUserDefinedColumnService.resolveResourcesFromAssembly(lineItem, resourceTrees, newUserDefinedCols);
							// will refresh later
							// service.gridRefresh();
						}
					}

					function clearOldNewResourceMapping(){
						oldNewResourceMapping = {};
					}

					function setResourceCharacteristics(resCharacteristics) {
						// Characteristics
						// Group chars by resources
						let resObjectGroups = _.groupBy(resCharacteristics, 'ObjectFk');
						let assemblyResourceCharacteristicsService = option.isPrjAssembly || option.isPrjPlantAssembly ? $injector.get('projectAssembliesResourceCharacteristicsService') : $injector.get('estimateAssembliesResourceCharacteristicsService');
						_.forEach(resObjectGroups, function (chars, entityId) {
							let entity = service.getItemById(parseInt(entityId));
							if(oldNewResourceMapping[parseInt(entityId)] && !entity){
								entity = service.getItemById(parseInt(oldNewResourceMapping[parseInt(entityId)]));
								_.forEach(chars, function(charEntity){
									charEntity.ObjectFk = parseInt(oldNewResourceMapping[parseInt(entityId)]);
								});
							}
							assemblyResourceCharacteristicsService.assignCharsToEntity(chars, entity);
						});
					}
				};

				return factoryService;
			}]);
})();
