/* global globals, Platform:false, math */
(function () {
	'use strict';
	var boqMainModule = angular.module('boq.main');

	/**
	 * @ngdoc service
	 * @name boq.service.boqMainService
	 * @function
	 *
	 * @description
	 * boqMainService is the data service for all boq data functions.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	boqMainModule.factory('boqMainServiceFactory', ['platformDataServiceFactory', 'cloudDesktopInfoService', '$q', '$http', '$log', 'boqMainLineTypes', 'boqMainStructureDetailDataType',
		'boqMainItemTypes', 'boqMainItemTypes2', 'basicsLookupdataLookupDescriptorService', 'boqMainImageProcessor',
		'boqMainReadonlyProcessor', 'boqMainCommonService', 'boqMainBoqStructureServiceFactory', 'platformDialogService', 'platformGridAPI', '$injector', 'cloudDesktopSidebarService', 'boqMainBaseBoqServiceFactory', '$translate',
		'$timeout', 'platformDataServiceDataProcessorExtension', '$rootScope', 'platformPermissionService', 'permissions', 'platformModalService', 'basicsLookupdataLookupFilterService', '_', 'estimateProjectRateBookConfigDataService',
		'boqMainSplitQuantityServiceFactory', 'boqMainTextComplementServiceFactory', 'boqMainCrbService', 'boqMainOenService', 'platformDataServiceProcessDatesBySchemeExtension', 'basicCustomizeSystemoptionLookupDataService', 'PlatformMessenger', 'boqMainProject2CostCodeProcessor',
		'cloudCommonGridService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataSimpleLookupService', 'basicsCommonDynamicConfigurationServiceFactory',
		function (platformDataServiceFactory, cloudDesktopInfoService, $q, $http, $log, boqMainLineTypes, boqMainStructureDetailDataType, boqMainItemTypes, boqMainItemTypes2,
			basicsLookupdataLookupDescriptorService, boqMainImageProcessor, boqMainReadonlyProcessor, boqMainCommonService, boqMainBoqStructureServiceFactory,
			platformDialogService, platformGridAPI, $injector, cloudDesktopSidebarService, boqMainBaseBoqServiceFactory, $translate, $timeout, platformDataServiceDataProcessorExtension, $rootScope,
			platformPermissionService, permissions, platformModalService, basicsLookupdataLookupFilterService, _, estimateProjectRateBookConfigDataService,
			splitQuantityServiceFactory, boqMainTextComplementServiceFactory, crbService, oenService, platformDataServiceProcessDatesBySchemeExtension, basicCustomizeSystemoptionLookupDataService, PlatformMessenger, boqMainProject2CostCodeProcessor, cloudCommonGridService, basicsLookupdataConfigGenerator, basicsLookupdataSimpleLookupService,basicsCommonDynamicConfigurationServiceFactory) {

			var factoryService = {};
			var counterService = 1;

			var _calculationOfExpectedRevenueSysOpt = true;
			basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(10061).then(function(value) {
				_calculationOfExpectedRevenueSysOpt = value==='1';
			});

			var _fixedBudgetTotal = false;
			basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(12).then(function(value) {
				_fixedBudgetTotal = value ==='1';
			});

			var boqMainRoundingService          = $injector.get('boqMainRoundingService');
			var boqMainRoundingConfigDetailType = $injector.get('boqMainRoundingConfigDetailType');
			var boqMainOenLvHeaderLookupService = $injector.get('boqMainOenLvHeaderLookupService');
			var platformContextService          = $injector.get('platformContextService');

			var selectedBoqId;

			/**
			 * @ngdoc function
			 * @name createNewBoqMainService
			 * @function
			 * @methodOf boqMainServiceFactory
			 * @description Core function to create a new boqMainService object
			 * @param {Object} option : options to configure the created boqMainService
			 * @returns {Object} container holding local data and new created service object
			 */
			/* jshint -W071 */ // I know that this function has many statements, but I cannot refactor it at the moment
			factoryService.createNewBoqMainService = function createNewBoqMainService(option) {
				var dynamicUserDefinedColumnsService = null;
				var commonDynamicConfigurationService = null;
				var detailsParamAlwaysSave = '';
				var serviceContainer = {};
				var myCreationData = {};
				var boqStructureServiceState = {};
				var service = {};
				var localData = {};
				var boqStructureService = boqMainBoqStructureServiceFactory.createBoqStructureService(boqStructureServiceState);
				var boqServiceOption = {
					hierarchicalRootItem: {
						module: boqMainModule,
						serviceName: 'boqMainServiceFactory' + (counterService++),
						httpCRUD: { route: globals.webApiBaseUrl + 'boq/main/', endRead: option.isLookup ? 'boqitemsforlookup' : 'getCompositeBoqItems' },
						dataProcessor: [boqMainImageProcessor, boqMainReadonlyProcessor, boqMainProject2CostCodeProcessor, platformDataServiceProcessDatesBySchemeExtension.createProcessor({typeName:'BoqItemDto', moduleSubModule:'Boq.Main'})],
						presenter: {
							tree: {
								parentProp: 'BoqItemFk', childProp: 'BoqItems',
								childSort: function compareBoqItemsByReferences(firstBoqItem, secondBoqItem) {
									return service.compareBoqItemsByReferences(firstBoqItem, secondBoqItem);
								},
								incorporateDataRead: function (readData, data) {
									// Handle all dynamic column and data
									loadBoqDynamicColumns(readData);

									localData.isCalculateOverGross = readData.IsCalculateOverGross;

									// build boqItem's ruleAssignment here
									// refresh the leadingStructure2Rule for formatter
									var boqRuleFormatterService = $injector.get('boqRuleFormatterService');
									if (boqRuleFormatterService) {
										if (readData && readData.dtos && readData.dtos[0] && readData.dtos[0].IsWicItem) {
											boqRuleFormatterService.buildRuleAndRuleAssignment(readData.dtos, readData.boq2MdcRules, readData.estRules);
										} else {
											boqRuleFormatterService.buildRuleAndRuleAssignment(readData.dtos, readData.boq2PrjRules, readData.prjEstRules);
										}
									}

									if (readData && readData.dtos && readData.dtos[0]) {
										localData.setIsGCBoq(_.isBoolean(readData.dtos[0].IsGCBoq) && readData.dtos[0].IsGCBoq);

										if(_.has(readData.dtos[0], 'PermissionObjectInfo') && localData.isRoot) {
											platformContextService.setPermissionObjectInfo(readData.dtos[0].PermissionObjectInfo || null);
										}
									}

									basicsLookupdataLookupDescriptorService.updateData('TaxCodeMatrix', readData.TaxCodeMatrix);
									if(service.isOenBoq()) {
										boqMainOenLvHeaderLookupService.setFilter(service.getSelectedHeaderFk());
										boqMainOenLvHeaderLookupService.loadLookupData(data);
									}
									crbService.setIsUsingFullLicence(service, readData.IsUsingCrbFullLicence);

									// Attach the divisionType assingment to boqItem
									var boqDivisionTypeAssignmentFormatterService = $injector.get('boqDivisionTypeAssignmentFormatterService');
									if (boqDivisionTypeAssignmentFormatterService) {
										boqDivisionTypeAssignmentFormatterService.attachDivisionTypeAssignmentToBoqItem(readData.dtos, readData.boqItem2boqDivisionTypes, readData.boqDivisionTypes);
									}

									var estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
									if (estimateParameterFormatterService) {
										estimateParameterFormatterService.refresh();
									}

									var estimateParamUpdateService = $injector.get('estimateParamUpdateService');
									estimateParamUpdateService.clear();

									var estimateMainParameterValueLookupService = $injector.get('estimateMainParameterValueLookupService');
									estimateMainParameterValueLookupService.clear();

									var boqRuleSequenceLookupService = $injector.get('boqRuleSequenceLookupService');
									if (boqRuleSequenceLookupService) {
										boqRuleSequenceLookupService.loadLookupData();
									}

									if (estimateParameterFormatterService) {
										estimateParameterFormatterService.buildParamAssignment(readData.dtos, readData.boqParams);
									}

									var result = serviceContainer.data.handleReadSucceeded(readData.dtos, data);

									if (!_.isEmpty(service.getModuleName())) // empty for the UI container "Source BoQ"
									{
										$injector.get('boqMainLookupFilterService').filterCrbBoqs(service.isCrbBoq());  // Used in the copysource context
									}

									return result;
								},
								initCreationData: function initCreationData(creationData) {
									var successor = null;
									var previousNextContainer = {};

									if (_.isEmpty(myCreationData)) {
										// This indicates that the creation was not triggered by a given creation function of this service.
										// Maybe it was triggered hitting the enter key which leads the grid to demand a new item to be created.
										// In this case we start a creation by context, but simply reinitialize the myCreationData, because the creation
										// process itself has already been started.
										service.createNewByContext(false, true); // Flag true forces the creation to be skipped and only reinitializes the myCreationData.
									}

									if (creationData && !_.isEmpty(myCreationData)) {
										// TODO-BRE:
										// Defined when called from function 'doPrepareCreate' but not by 'doPrepareCreateChild'.
										// Because of 'hasToReduceTreeStructures===true' it never should be defined.
										delete creationData.parent;

										// Get next possible reference
										var isTypeWithReference = boqMainCommonService.isPositionType(myCreationData.lineType) || boqMainCommonService.isDivisionType(myCreationData.lineType) || boqMainCommonService.isSurchargeItemType(myCreationData.lineType) || myCreationData.lineType===boqMainLineTypes.crbSubQuantity;
										var parentBoqItem = service.getBoqItemById(myCreationData.parentItemId);
										var nextReference = isTypeWithReference ? localData.generateBoqReference(parentBoqItem, myCreationData.selectedItem, myCreationData, myCreationData.insertAtEnd) : '';

										if(isTypeWithReference && _.isEmpty(nextReference) || _.isObject(service.getBoqItemByReference(nextReference))) {
											throw new Error('The reference number could not be created properly');
										}

										creationData.boqHeaderFk         = localData.selectedBoqHeader;
										creationData.DivisionType        = localData.getNextChildDivisionType(parentBoqItem, myCreationData.lineType);
										creationData.MaxReferenceBoqItem = localData.MaxReferenceBoqItem;
										creationData.parentItemId     = myCreationData.parentItemId;
										creationData.parentId         = myCreationData.parentItemId;
										creationData[localData.treePresOpt.parentProp] = creationData.parentId;
										creationData.selectedItemId   = myCreationData.selectedItem ? myCreationData.selectedItem.Id : -1;
										creationData.lineType         = myCreationData.lineType;
										creationData.DoSave           = myCreationData.doSave;
										creationData.IsCrbPreliminary = myCreationData.IsCrbPreliminary;
										creationData.BoqItemPrjBoqFk = parentBoqItem.BoqItemPrjBoqFk;
										creationData.refCode         = nextReference;
										creationData.BoqItemType     = service.isCrbBoq() ? 'CrbBoqItemEntity' : service.isOenBoq() ? 'OenBoqItemEntity' : null;
										if (myCreationData.predecessor !== null) {
											creationData.predecessor = myCreationData.predecessor.Id;

											// Here we remember the successor of the new item
											localData.getPreviousAndNextItem(myCreationData.selectedItem, previousNextContainer, false, false);
											successor = previousNextContainer.nextItem;
											if (angular.isDefined(successor) && (successor !== null) && boqMainCommonService.isTextElementWithoutReference(successor)) {
												myCreationData.successor = successor;
											}
										}

										// Call externally given creationDataProcessor
										if (angular.isDefined(option.creationDataProcessor) && _.isFunction(option.creationDataProcessor)) {
											// Here an overwritten callback can provide context specific information for the creation process.
											option.creationDataProcessor(creationData);
										}

										if(_.isObject(creationData.MaxReferenceBoqItem) && boqMainCommonService.isDivisionOrRoot(creationData.MaxReferenceBoqItem)) {
											// Make sure to set the proper parent of the new created hierarchy that was missing
											creationData.parentId = creationData.MaxReferenceBoqItem.Id;
											creationData[localData.treePresOpt.parentProp] = creationData.parentId;
										}
									}

								},
								handleCreateSucceeded: function (newItem/* , data */) {
									if (service.isOenBoq()) {
										oenService.handleCreateSucceeded(service, newItem);
									}
									else if (service.isCrbBoq()) {
										$injector.get('boqMainCrbBoqItemService').handleCreateSucceeded(service, newItem);
									}

									var parentBoqItem = null;
									// var selectedItem = null;
									var boqRootItem = service.getRootBoqItem();
									var boqRootItemPermissionObjectInfo = (angular.isDefined(boqRootItem) && boqRootItem !== null) ? boqRootItem.PermissionObjectInfo : null;

									// get priceconditionFk from parent
									var isCopyPriceConditionFromBoqDivision = true;
									service.setPriceConditionFk(newItem, isCopyPriceConditionFromBoqDivision);

									// Use the new created item as template for a default object that can be used to reset items to a default state.
									// Setting the default object is only done once.
									localData.setDefaultBoqItemObject(newItem, false);

									if (newItem && newItem.CostGroupAssignments) {
										// basicsLookupdataLookupDescriptorService.updateData('BoqItem2CostGroups', newItem.CostGroupAssignments);
										$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity([newItem], newItem.CostGroupAssignments, function identityGetter(entity) {
											return {
												BoqHeaderFk: entity.RootItemId,
												Id: entity.MainItemId
											};
										},
										'BoqItem2CostGroups');
									}

									localData.notYetSavedBoqItems.push(newItem.Id);

									// Currently we have a timing problem when subsequent creation calls are done very fast or the server response is so slow that the answer of
									// the server to the creation call is too slow to fit inbetween the two creation calls. This means the new created item isn't inserted into
									// the item list yet when the next creation call is triggered leading to the creation of an item with the same reference as the afore created item.
									// To assure having unique references we do a check here if the returned items reference is unique. If not, a new reference is created and assigned.
									if (!_.isEmpty(newItem.Reference) && service.getBoqItemByReference(newItem.Reference)) {
										// The given reference is already in use
										// -> create a new one.
										parentBoqItem = service.getBoqItemById(newItem.BoqItemFk);
										newItem.Reference = localData.generateBoqReference(parentBoqItem, newItem, {lineType: newItem.BoqLineTypeFk}, true);
									}

									service.getCachedRevenueTypeAsync({'isDefault':true}).then(function(defaultRevenueType) {
										if (defaultRevenueType && newItem.BoqLineTypeFk!==boqMainLineTypes.crbSubQuantity) {
											newItem.BoqRevenueTypeFk = defaultRevenueType.Id;
											service.updateRevenuePercentage(newItem, defaultRevenueType);
										}
									});

									// Call externally given handleCreateSucceeded
									if (angular.isDefined(option.handleCreateSucceeded) && _.isFunction(option.handleCreateSucceeded)) {
										option.handleCreateSucceeded(newItem);
									}

									// Patch PermissionObjectInfo of boqRootItem to corresponding newItem
									service.patchPermissionObjectInfo(newItem, boqRootItemPermissionObjectInfo);

									if (newItem.MdcTaxCodeFk) {
										service.calcItemsPriceHoursNew(newItem, true);
									}

									let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
									if(_dynamicUserDefinedColumnsService && _.isFunction(_dynamicUserDefinedColumnsService.attachEmptyDataToColumn)) {
										_dynamicUserDefinedColumnsService.attachEmptyDataToColumn(newItem);
									}

									// bre:
									// The setting of 'boqMainService.fireSelectionChangedEventAlways=false' prevents the firing of 'data.selectionChanged.fire' in function
									// 'platformDataServiceSelectionExtension.finishSelectionChange' when a new item is created.
									// As workaround this event is fired.
									service.boqItemCreateSucceeded.fire(newItem);
								}
							}
						},
						actions: {
							delete: true,
							canDeleteCallBackFunc: function (selectedItem) {
								return service.canDeleteBoqItem(selectedItem);
							},
							create: 'hierarchical'
						},
						entityRole: {
							root: {
								itemName: 'BoqItem',
								moduleName: 'BoQ',
								codeField: 'Reference',
								descField: 'BriefInfo.Translated',
								addToLastObject: true,
								lastObjectModuleName: 'boq.main',
								handleUpdateDone: function (updateData, response, data) {
									if(response.timeStr && response.timeStr.m_StringValue){
										console.log(response.timeStr.m_StringValue);
									}

									if (data.itemList) {
										var boqRuleUpdateService = $injector.get('boqRuleUpdateService');
										var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
										if (boqRuleComplexLookupService.isNavFromBoqProject()) {
											boqRuleUpdateService.handleOnRuleAssignUpdateSucceeded(response.MainItemId, data.itemList, response.PrjBoqRuleToSave);
										} else if (boqRuleComplexLookupService.isNavFromBoqWic()) {
											boqRuleUpdateService.handleOnRuleAssignUpdateSucceeded(response.MainItemId, data.itemList, response.WicBoqRuleToSave);
										}

										boqRuleUpdateService.clear();

										/* var boqParamUpdateService =  $injector.get('boqParamUpdateService');
										boqParamUpdateService.handleOnParamAssignUpdateSucceeded(response.MainItemId, data.itemList,response.BoqParamToSave);
										boqParamUpdateService.clear(); */

										var estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
										var boqParamList = estimateParameterFormatterService.handleUpdateDone(response, response.BoqParamToDelete);

										var estimateParamUpdateService = $injector.get('estimateParamUpdateService');
										estimateParamUpdateService.handleOnParamAssignUpdateSucceeded(response.MainItemId, data.itemList, boqParamList, response.BoqParamToDelete);
										estimateParamUpdateService.clear();

										var boqDivisionTypeAssignmentUpdateService = $injector.get('boqDivisionTypeAssignmentUpdateService');
										boqDivisionTypeAssignmentUpdateService.clear();

										service.syncItemsAfterUpdate(response);
										localData.clearTransaction();

										// set the cost group
										if (response && response.QtoDetailToSave && response.QtoDetailToSave.length > 0) {
											_.each(response.QtoDetailToSave, function (item) {
												if (item.QtoDetail) {
													if (item.CostGroupToSave && item.CostGroupToSave.length > 0) {
														$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity([item.QtoDetail], item.CostGroupToSave, function identityGetter(entity) {
															return {
																Id: entity.MainItemId
															};
														},
														'QtoDetail2CostGroups'
														);
													}
												}
											});

											// set the boq split quantity
											if (response.BoqSplitQuantityToSave && response.BoqSplitQuantityToSave.length > 0) {
												var items = _.map(response.BoqSplitQuantityToSave, 'BoqSplitQuantity');
												$injector.get('boqMainSplitQuantityServiceFactory').getService(service, 'boq.main').synBoqSplitQuantity(items);
											}
										}

										if(response.UserDefinedcolsToUpdate){
											let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
											if(_dynamicUserDefinedColumnsService  && angular.isFunction(_dynamicUserDefinedColumnsService.handleUpdateDone)) {
												_dynamicUserDefinedColumnsService.handleUpdateDone(response.UserDefinedcolsToUpdate);
											}
										}

										localData.normalizeOenExtension(response);

										data.handleOnUpdateSucceeded(updateData, response, data, false);

										// after save the rule, hanlder the assigned prjEstRuleParam or estRuleParam here
										var result = response;
										if (result.FormulaParameterEntities && result.FormulaParameterEntities.length > 0) {
											var mainItemId = updateData.MainItemId;
											var destItem = _.find(data.getList(), {Id: mainItemId});

											result.containerData = localData;
											result.isFormula = false;
											result.entity = destItem;
											result.BoqItem = angular.copy(destItem);
											result.ProjectId = service.getSelectedProjectId();

											var boqMainDetailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
											boqMainDetailsParamListDataService.setAssignedBoqItemEntity(destItem);

											var paramDialogService = $injector.get('boqMainDetailsParamDialogService');
											paramDialogService.showDialog(result, service.getDetailsParamReminder(), service);
										}
									}

									// service.gridRefresh();
								},
								mergeAffectedItems: function (response) {
									service.syncItemsAfterUpdate(response);
								}
							}
						},
						entitySelection: {supportsMultiSelection: true},
						translation: {
							uid: 'boqMainServiceFactory',
							title: 'boq.main.boqTranslation',
							columns: [{header: 'boq.main.Brief', field: 'BriefInfo'}],
							dtoScheme: { moduleSubModule: 'Boq.Main', typeName: 'BoqItemDto' }
						},
						sidebarSearch: {
							options: null// sidebarSearchOptions
						},
						filterByViewer: option.filterByViewer ? option.filterByViewer : false
					}
				};

				//  region The data service  ==ts==>
				//         To be moved to the existing data service 'boq-main-boq-item-data.service.ts'. Probably too big for one data service, see sub regions.
				//         Separate FreeBoq code if there is enough time. Usages annd extensions in procurement and sales must be considered.
				// #region

				//  region Basics
				// #region

				if (_.isObject(option.parent)) {
					// Change the role from 'root' to 'node'

					// Shift to hierarchicalNodeItem
					boqServiceOption.hierarchicalNodeItem = boqServiceOption.hierarchicalRootItem;
					delete boqServiceOption.hierarchicalRootItem; // Delete old property

					// Shift entityRole from 'root' to 'node'
					boqServiceOption.hierarchicalNodeItem.entityRole.node = boqServiceOption.hierarchicalNodeItem.entityRole.root;
					boqServiceOption.hierarchicalNodeItem.entityRole.node.parentService = option.parent; // Hand over the nodes parent service.
					delete boqServiceOption.hierarchicalNodeItem.entityRole.root;  // Delete old property
					boqServiceOption.hierarchicalNodeItem.entitySelection = {supportsMultiSelection: true}; // Enable multiple selection

					// option for pes boq previous period calculation
					if (option.incorporateDataRead) {
						boqServiceOption.hierarchicalNodeItem.presenter.tree.incorporateDataRead = option.incorporateDataRead;
					}

					// procurement model filter service require service name
					if (option.serviceName) {
						boqServiceOption.hierarchicalNodeItem.serviceName = option.serviceName;
					}

					// add filter radio/check for boq
					if (option.toolBar) {
						boqServiceOption.hierarchicalNodeItem.toolBar = option.toolBar;
					}

					if (_.isArray(option.additionalDataProcessors)) {
						if (_.isArray(boqServiceOption.hierarchicalNodeItem.dataProcessor)) {
							boqServiceOption.hierarchicalNodeItem.dataProcessor = boqServiceOption.hierarchicalNodeItem.dataProcessor.concat(option.additionalDataProcessors);
						} else {
							boqServiceOption.hierarchicalNodeItem.dataProcessor = option.additionalDataProcessors;
						}
					}
				}

				serviceContainer = platformDataServiceFactory.createNewComplete(boqServiceOption);

				service = serviceContainer.service;
				localData = serviceContainer.data;

				service.priceConditionSelectionChanged = new PlatformMessenger();
				service.priceConditionChanged = new PlatformMessenger();
				service.onCostGroupCatalogsLoaded = new PlatformMessenger();

				service.addItemCssClass(1, 'textcomplement_owner');

				service.getServiceContainer = function getServiceContainer() {
					return serviceContainer;
				};

				localData.getServiceContainer = function getServiceContainer() {
					return serviceContainer;
				};

				localData.registerAsyncCall = function registerAsyncCall(asyncCall) {
					// New routine to register async calls that need to be resolved before an update can be carried out
					if (!localData.asyncCalls) {
						localData.asyncCalls = [];
					}
					localData.asyncCalls.push(asyncCall);
				};

				localData.waitForOutstandingDataTransfer = function waitForOutstandingDataTransfer() {
					// This overwritten call is executed before an update is triggered ensuring that the registrered async calls are resolved
					// befrore the update can proceed.
					return $q.all(_.map(localData.asyncCalls, function (call) {
						return call;
					}));
				};

				service.setPriceConditionFk = function setPriceConditionFk(currentBoqItem, isCopyPriceConditionFromBoqDivision) {
					if (!currentBoqItem || !currentBoqItem.BoqItemFk) {
						return;
					}

					var parentItem = service.getItemById(currentBoqItem.BoqItemFk);

					while (parentItem) {
						if (parentItem.PrcPriceConditionFk) {
							currentBoqItem.PrcPriceConditionFk = parentItem.PrcPriceConditionFk;
							currentBoqItem.IsCopyPriceConditionFromBoqDivision = isCopyPriceConditionFromBoqDivision;
							service.priceConditionSelectionChanged.fire(currentBoqItem.PrcPriceConditionFk, currentBoqItem);
							break;
						}

						parentItem = service.getItemById(parentItem.BoqItemFk);
					}
				};

				// Cerate and add base boq service to local data
				localData.baseBoqServiceState = {};
				localData.baseBoqMainService = boqMainBaseBoqServiceFactory.createBaseBoqService(localData.baseBoqServiceState, service);

				service.getBoqServiceOption = function getBoqServiceOption() {
					return boqServiceOption;
				};

				service.getContainerData = function getContainerData() {
					return serviceContainer.data;
				};


				service.setDynamicUserDefinedColumnsService = function (value){
					dynamicUserDefinedColumnsService = value;
				};

				service.getDynamicUserDefinedColumnsService = function (){
					return dynamicUserDefinedColumnsService;
				};

				service.getCommonDynamicConfigurationService = function (){
					if (!commonDynamicConfigurationService){
						commonDynamicConfigurationService = basicsCommonDynamicConfigurationServiceFactory.createService();
					}
					return commonDynamicConfigurationService;
				};

				localData.getChangedRootEntitiesAsArray = function getChangedRootEntitiesAsArray(updateData/* , data, service, isBeforeUpdate */) {
					return updateData.BoqItems;
				};

				/******************************
				 * PRIVATE SECTION OF SERVICE  *
				 *******************************/

				localData.fireSelectionChangedEventAlways = false; // Prevents an unexpected reset of the grid selection which is triggered by default when the saving is completed
				localData.useIdForIndexIdentification = true;      // Ensures the reselection after the deletion (reason was the value of 'localData.fireSelectionChangedEventAlways')

				localData.hasToReduceTreeStructures = true;

				// Private variables
				localData.readOnly = false;
				localData.dragAndDropAllowed = true;
				localData.sendOnlyRootEntities = true; // To avoid huge complete entities being sent to server when deleting big sub entity trees.

				localData.selectedBoqHeader = 0; //  -1; // done inside boqMainHeaderSelectionController
				localData.creationErrorContainer = {errorString: ''};
				localData.affectedItems = []; // Array to hold boq items that where affected by changing/updating the current item.
				localData.defaultBoqItem = null; // Carries the default values of certain properties to be able to reset a boq item to an inital state. Is filled by the return value of a create call to a boq item.
				localData.notYetSavedBoqItems = []; // Array that holds the id's of the items that have just been created but not saved yet.
				localData.selectedProjectId = null;
				localData.boqCharacterContentItems = [];
				localData.containerUUID = null;
				localData.currentExchangeRate = 1.0; // Currently set exchange rate from original currency (i.e. currency of the currently loaded boq) to the home currency (usually the current company currency)
				localData.isGCBoq = false;
				localData.isCalculateOverGross = false;

				localData.lastFilterParams = {
					startId: 0,
					depth: 0,
					recalc: false,
					isPes: false,
					isWip: false,
					isBil: false
				};

				localData.boqRoundedColumns2DetailTypes = null;
				localData.loadedBoqItemDictionary = null;

				/**
				 * @ngdoc function
				 * @name handleCreationError
				 * @function
				 * @methodOf
				 * @description Handles error strings gathered while creating an item by firing the creationError event with the error string as parameter
				 * @param {Boolean} skipError prevents error event from being fired, i.e. error message being shown.
				 */
				localData.handleCreationError = function handleCreationError(skipError) {
					if (localData.creationErrorContainer && localData.creationErrorContainer.errorString && !_.isEmpty(localData.creationErrorContainer.errorString)) {

						if (!skipError) {
							service.creationError.fire(localData.creationErrorContainer.errorString);
						}

						// After the error description has been notified it can be deleted
						localData.creationErrorContainer.errorString = '';
					}
				};

				// Variable for context the service is called in
				localData.callingContext = null;

				/**
				 * @ngdoc function
				 * @name findBoqItemByProperty
				 * @function
				 * @description Recursively traverse all boqItems and find the boqItem having the given value at the given property
				 * @param {String} property : of the boqItem to be looked up
				 * @param {Number | String} propertyValue : of the boqItem to be compared against
				 * @param {Object} boqItem : where the search and traversal starts
				 * @param {Array} excludedItems : items to be excluded from the search
				 * @param {Array} parentPath : assembles all items in the parent path from the starting item to the matching item
				 * @returns {Object} Object : that meets the given criteria
				 */
				/* jshint -W074 */ // cyclomatic complexity
				localData.findBoqItemByPropertyValue = function findBoqItemByPropertyValue(property, propertyValue, boqItem, excludedItems, parentPath) {

					if (!angular.isString(property) || angular.isUndefined(propertyValue) || (propertyValue === null) || angular.isUndefined(boqItem) || (boqItem === null)) {
						return null;
					}

					if (!angular.isNumber(propertyValue) && !angular.isString(propertyValue)) {
						$log.log('boqMainServiceFactory -> findBoqItemByPropertyValue: the given property value has to be a number or a string at the moment');
						return null;
					}

					var children = boqItem.BoqItems;
					var isItemExcluded = angular.isArray(excludedItems) ? excludedItems.indexOf(boqItem) !== -1 : false;

					var matchingBoqItem = null;
					// Check if this boqItem meets the given criteria, i.e. has the given property with the given propertyValue
					if (!isItemExcluded && boqItem[property] && ((property === 'Reference' && localData.compareReferences(boqItem[property], propertyValue) === 0) || (boqItem[property] === propertyValue))) {
						matchingBoqItem = boqItem;
					} else if (children && children.length > 0) {
						// Recursively search the child hierarchy
						for (var i = 0; i < children.length; i++) {
							matchingBoqItem = localData.findBoqItemByPropertyValue(property, propertyValue, children[i], excludedItems, parentPath);
							if (matchingBoqItem) {
								if (_.isArray(parentPath)) {
									parentPath.push(children[i]);
								}
								break;
							}
						}
					}

					return matchingBoqItem;
				};

				/**
				 * @ngdoc function
				 * @name findBoqItemByPropertyValueInList
				 * @function
				 * @description Traverse all boqItems in the flat list and find the boqItem having the given value at the given property
				 * @param {String} property : of the boqItem to be looked up
				 * @param {Number | String} propertyValue : of the boqItem to be compared against
				 * @returns {Object} Object : that meets the given criteria
				 */
				/* jshint -W074 */ // cyclomatic complexity
				localData.findBoqItemByPropertyValueInList = function findBoqItemByPropertyValueInList(property, propertyValue) {

					var flatItemList = service.getUnfilteredList();

					if (!angular.isString(property) || angular.isUndefined(propertyValue) || (propertyValue === null) || angular.isUndefined(flatItemList) || (flatItemList === null) || _.isEmpty(flatItemList)) {
						return null;
					}

					if (!angular.isNumber(propertyValue) && !angular.isString(propertyValue)) {
						$log.log('boqMainServiceFactory -> findBoqItemByPropertyInList: the given property value has to be a number or a string at the moment');
						return null;
					}

					var matchingBoqItem = _.find(flatItemList, function (item) {
						return (item[property] && item[property] === propertyValue);
					});

					return matchingBoqItem;
				};

				localData.addBoqCharacterContentItems = function addBoqCharacterContentItems(items) {
					if (items && items.length > 0) {
						angular.forEach(items, function (item) {
							localData.boqCharacterContentItems.push(item);
						});
					}
				};

				localData.clearBoqCharacterContentItems = function clearBoqCharacterContentItems() {
					localData.boqCharacterContentItems = [];
				};

				localData.getParentBoqItem = function getParentBoqItem(boqItem) {
					if (angular.isUndefined(boqItem) || (boqItem === null)) {
						$log.log('getParentBoqItem: boqItem not defined');
						return null;
					}

					if(!boqItem.BoqItemFk) {
						return null;
					}

					let parentBoqItem = localData.getLoadedBoqItemByDictionary(boqItem.BoqItemFk);

					if(!parentBoqItem) {
						// As a fallback recursively iterate over hierarchical item array and find corresponding boqItem
						parentBoqItem = service.getBoqItemById(boqItem.BoqItemFk);// return parentBoqItem
					}

					return parentBoqItem;
				};

				/**
				 * @ngdoc function
				 * @name checkAgainstBoqStructure
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Based on the boq structure information we check if the given line type can be created on the requested level
				 * @param {Object} selectedItem which is the parent or sibling of the item to be created
				 * @param {Object} boqStructure to be checked against
				 * @param {Number} lineType to be checked
				 * @param {Number} level on which the line type should to be created
				 * @returns {Boolean} indicates, if the given line type can be created on the requested level
				 */
				localData.checkAgainstBoqStructure = function checkAgainstBoqStructure(selectedItem, boqStructure, lineType, level) {

					var siblingsWithReference = null;
					var siblingDivisions = null;
					var siblingPositions = null;
					var currentParent = null;
					// var levelOfSelectedItem = localData.getLevelOfBoqItem(selectedItem);

					if (!boqStructure) {
						return false;
					}

					if (!boqStructure.EnforceStructure || boqMainCommonService.isFreeBoqType(boqStructure)) {
						// We don't enforce the structure or we have a free boq so we can skip further checks
						return true;
					}

					// First check if the line type exists in the boq mask
					var lineTypeAsString = '';

					if ((lineType >= 0) && (lineType <= 9) || boqMainCommonService.isSurchargeItemType(lineType)) {

						// Special case: Surcharge items are positions, so we set the line type to position to do the following tests
						if (boqMainCommonService.isSurchargeItemType(lineType)) {
							lineType = boqMainLineTypes.position;
						}

						lineTypeAsString = (lineType === boqMainLineTypes.position) ? 'P' : lineType.toString();
					} else {
						localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorTypeMissing');
						return false;
					}

					if (boqStructure.Boqmask.length === 0 || boqStructure.Boqmask.indexOf(lineTypeAsString) === -1) {
						// There is no detail information for the desired LineType so we cannot create this type.
						localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorTypeMissing');
					} else {
						var structureDetail = boqStructureService.getStructureDetailByLineType(lineType);
						if (structureDetail === null) {
							// There is no detail information for the desired LineType so we cannot create this type.
							localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorTypeMissing');
						} else {

							if (!boqMainCommonService.isTextElementWithoutReferenceType(lineType) && boqStructure.SkippedHierarchiesAllowed) {
								// Here we handle skipped divisions and their behaviour related to the creation of items.
								currentParent = selectedItem;

								if (!_.isObject(currentParent)) {
									return false;
								}

								siblingsWithReference = _.filter(currentParent.BoqItems, function (siblingItem) {
									return !boqMainCommonService.isTextElementWithoutReference(siblingItem);
								});

								if (!boqMainCommonService.isDivisionType(lineType)) {
									// Here we want to create a position or a similar item, but no division.
									// So we have to check if there are already sibling divisions.
									siblingDivisions = _.filter(siblingsWithReference, function (siblingItem) {
										return boqMainCommonService.isDivision(siblingItem);
									});

									return !(_.isArray(siblingDivisions) && siblingDivisions.length > 0);
								} else {
									// Here we want to create a division but have to check first if there a already sibling positions
									siblingPositions = _.filter(siblingsWithReference, function (siblingItem) {
										return !boqMainCommonService.isDivision(siblingItem) && !boqMainCommonService.isTextElementWithoutReference(siblingItem);
									});

									if (_.isArray(siblingPositions) && siblingPositions.length > 0) {
										return false; // There are already positions -> no creation of division allowed.
									}
								}
							}

							// Also check if the requested level is correct
							if (structureDetail.level === level) {
								return true;
							} else {
								localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorLevelMismatch');
							}
						}
					}

					return false;
				};

				/**
				 * @ngdoc function
				 * @name getPreviousAndNextItem
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Determine the previous and next item according to the given selected item
				 * @param {Object} selectedItem : item that's currently selected
				 * @param {Object} previousNextContainer : Object holding references to the previous and next item
				 * @param {Boolean} ignoreItemsWithoutReference : triggers ignoring of items without a reference
				 * @param {Boolean} doResortChildren : triggers resorting of child array before determining previous and next item
				 */
				localData.getPreviousAndNextItem = function getPreviousAndNextItem(selectedItem, previousNextContainer, ignoreItemsWithoutReference, doResortChildren) {
					var parentFolder = _.isObject(selectedItem) ? localData.getParentBoqItem(selectedItem) : null;
					var children;

					if (previousNextContainer && angular.isObject(previousNextContainer)) {
						// Initialize with empty references to the previous and next object
						previousNextContainer.previousItem = null;
						previousNextContainer.nextItem = null;
					}

					if (!parentFolder) {
						return;
					}

					// We search the sibling items of selected item for previous and next items
					children = parentFolder ? ((_.isBoolean(ignoreItemsWithoutReference) && ignoreItemsWithoutReference) ? _.filter(parentFolder.BoqItems, function (item) {
						return !boqMainCommonService.isTextElementWithoutReference(item);
					}) : parentFolder.BoqItems) : null;

					// For safety reasons resort the children array
					if (_.isBoolean(doResortChildren) && doResortChildren) {
						service.resortChildren(parentFolder, false); // Doing this may be safe but is not always necessary, therefore it's triggered by a flag
					}

					if (!children) {
						return;
					}

					if (selectedItem !== null) {
						// Determine previous and next item
						var selectedItemIndex = children.indexOf(selectedItem);
						if (selectedItemIndex !== -1) {
							previousNextContainer.previousItem = (selectedItemIndex - 1) >= 0 ? children[selectedItemIndex - 1] : null;
							previousNextContainer.nextItem = (selectedItemIndex + 1) <= children.length - 1 ? children[selectedItemIndex + 1] : null;
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name getSurchargedItemsTotal
				 * @function
				 * @methodOf
				 * @description Calculate the surcharge item total
				 * @param {Object} boqItem : boq item entity
				 * @param {Array} boqItemList boq item tree.
				 * @param {Boolean} basedOnOcValue: flag telling function to retrieve total based on home currency or original currency values.
				 *
				 */
				localData.getSurchargedItemsTotal = function getSurchargedItemsTotal(boqItem, boqItemList, basedOnOcValue, isVatInclude) {
					var total = 0;
					var totalVatInclude = 0;

					if (boqMainCommonService.isSurchargeItem1(boqItem) || boqMainCommonService.isSurchargeItem2(boqItem)) {

						if (!basedOnOcValue) {
							boqItem.Quantity = 0;
						}

						var hasItem = false;
						var afterSi = false;

						if (boqItem.BoqItemFk === null) {
							return isVatInclude ? totalVatInclude : total; // No parent -> no siblings
						}

						var parentBoqItem;
						// Find the parent of the given boqItem
						if (!boqItemList) {
							parentBoqItem = service.getBoqItemById(boqItem.BoqItemFk);
						} else {
							parentBoqItem = localData.findBoqItemByPropertyValue('Id', boqItem.BoqItemFk, boqItemList[0]);
						}

						service.resortChildren(parentBoqItem, false);

						var surcharedItems = parentBoqItem.BoqItems;

						var si = null;
						for (var i = surcharedItems.length - 1; i >= 0; i--) { // Traverse the siblings in reversse order
							si = surcharedItems[i];

							if (!afterSi) {
								if (si.Reference === boqItem.Reference) {
									afterSi = true;
								}
							} else {
								if (boqMainCommonService.isItem(si)) {

									hasItem = true;
									if (boqMainCommonService.isSurchargeItem2(boqItem) || (boqMainCommonService.isSurchargeItem1(boqItem) && si.IsSurcharged)) {
										localData.calcFinalPriceHoursNew(si);
										total += basedOnOcValue ? si.FinalpriceOc : si.Finalprice;
										totalVatInclude += basedOnOcValue ? si.FinalgrossOc : si.Finalgross;
									}
								}

								if ((boqMainCommonService.isSurchargeItem(si)) && hasItem) {
									break;
								}
							}
						}
					} else // SurchargeItemType3
					{
						if (angular.isDefined(boqItem.BoqSurchardedItemEntities) && _.isArray(boqItem.BoqSurchardedItemEntities) && boqItem.BoqSurchardedItemEntities.length > 0) {
							let allBoqItems = service.getList();
							boqItem.BoqSurchardedItemEntities.forEach(function (siEntity) {
								// var si = siEntity.BoqSurchargedItem;
								var si = _.find(allBoqItems, {Id: siEntity.BoqSurcharedItemFk});
								if (si && si.Quantity !== 0) {
									if(boqMainCommonService.isSurchargeItem3(boqItem)){
										localData.calcFinalPriceHoursNew(si);
									}
									total += ((basedOnOcValue ? si.FinalpriceOc : si.Finalprice) * siEntity.QuantitySplit / si.Quantity);
									totalVatInclude += ((basedOnOcValue ? si.FinalgrossOc : si.Finalgross) * siEntity.QuantitySplit / si.Quantity);
								}
							});
						} else {// call from surcharge on
							total = boqItem.Quantity;
							totalVatInclude = boqItem.Quantity;
						}
					}

					return isVatInclude ? totalVatInclude : total;
				};

				/**
				 * @ngdoc function
				 * @name getSubdescriptionsTotal
				 * @function
				 * @methodOf
				 * @description Calculate the subdescription total
				 * @param {Object} boqItem : boq item entity
				 * @param {Boolean} basedOnOcValue: flag telling function to retrieve total based on home currency or original currency values.
				 */
				localData.getSubdescriptionsTotal = function getSubdescriptionsTotal(item, basedOnOcValue) {
					var total = 0;

					if (item.IsLeadDescription) {
						// First get all subdescriptions of this lead description
						var subdescriptions = item.BoqItems;
						var subdescription = null;

						for (var i = subdescriptions.length - 1; i >= 0; i--) { // Traverse the siblings in reversse order
							subdescription = subdescriptions[i];

							total += subdescription.Quantity * (basedOnOcValue ? subdescription.PriceOc : subdescription.Price);
						}
					}

					return total;
				};

				/**
				 * @ngdoc function
				 * @name visitBoqItemsRecursively
				 * @function
				 * @methodOf
				 * @description Visits a complete boq item hierarchy recursively and calls a visit function given by a visitor object that can do specific tasks.
				 * @param {Object} parentItem es entry point of recursion
				 * @param {Object} current child item to be visited
				 * @param {Number} hierarchical level of the child item
				 * @param {Object} visitorObject holding a visitor function that's to be called. The object can gather information when iterating over the hierarchy
				 * @returns {Boolean} indicating if the recursion is successful (in a context that's given by the visitor function) or should be broken
				 */
				localData.visitBoqItemsRecursively = function visitBoqItemsRecursively(parentItem, childItem, level, visitorObject) {

					if (!angular.isDefined(childItem) || childItem === null) {
						return false;
					}

					// Determine the child item line type. If it's a division we adapt the line type to the level.
					var lineType = (boqMainCommonService.isDivision(childItem)) ? Math.min(9, level) : childItem.BoqLineTypeFk;

					// Call visit function which is only done when the creation check was successful
					if (angular.isDefined(visitorObject) && (visitorObject !== null) && angular.isDefined(visitorObject.visitBoqItemFn) && (visitorObject.visitBoqItemFn !== null)) {
						if (visitorObject.visitBoqItemFn(parentItem, childItem, lineType, level, visitorObject)) {

							// Dig recursively deeper into the boq item hierarchy
							var hasChildren = Object.prototype.hasOwnProperty.call(childItem, 'BoqItems') && (childItem.BoqItems !== null);
							var visitedChild = null;
							var digDeeper = true;
							if (hasChildren) {
								for (var i = 0; i < childItem.BoqItems.length; i++) {
									visitedChild = childItem.BoqItems[i];
									if (visitedChild !== null) {
										if (!visitBoqItemsRecursively(childItem, visitedChild, level + 1, visitorObject)) {
											digDeeper = false;
											break;
										}
									}
								}
							}

							if(_.isFunction(visitorObject.postVisitBoqItemFn)) {
								visitorObject.postVisitBoqItemFn(parentItem, childItem, lineType, level, visitorObject);
							}

							return digDeeper;
						}
					} else {
						return false;
					}
				};

				localData.getCurrentlyRelevantQuantityForBudget = function getCurrentlyRelevantQuantityForBudget(boqItem) {
					var relevantQuantity = 0;

					if(_.isObject(boqItem)) {
						return boqItem.Quantity;
					}

					return relevantQuantity;
				};

				localData.reset = function reset() {
					localData.clearTransaction();
					localData.selectedBoqHeader = 0;
					localData.currentExchangeRate = 1.0;

					// Clears all loaded items and related states from the service
					// Only temporary solution until clear function is implemented in platformDataServiceFactory
					localData.doClearModifications(null, localData);
					localData.selectedItem = {};
					localData.itemTree.length = 0;

					// Because the specification controllers use references to the current specification objects
					// we reset them by using the functions below.
					localData.currentSpecification = {
						Content: null,
						Id: 0,
						Version: 0
					};

					localData.notYetSavedBoqItems.length = 0; // Clear not yet saved items list
					localData.selectedProjectId = null; // Clear last set projectId

					localData.loadedBoqItemDictionary = null;

					service.gridRefresh();
				};

				localData.init = function init() {
					localData.reset();
					service.loadBoqRoundedColumns2DetailTypes();
					var promises = basicsLookupdataLookupDescriptorService.loadData(['uom']);
					let basicsCustomWicTypeLookupDataService = $injector.get('basicsCustomWicTypeLookupDataService');
					let loadWicTypePromise = basicsCustomWicTypeLookupDataService.getLookupData({lookupType:'basicsCustomWicTypeLookupDataService'}).then(function(response){
						basicsLookupdataLookupDescriptorService.updateData('WicType', response);
					});

					if(_.isArray(promises)) {
						promises.push(loadWicTypePromise);
					}

					$q.all(promises).then();
					// localData.loadBoqItems(0, 99);
				};

				/**
				 * @ngdoc function
				 * @name getCallingContextText
				 * @function
				 * @methodOf
				 * @description Get the specially formatted text representing the calling context
				 * @returns {String} represents the calling context as specially formatted text
				 */
				localData.getCallingContextText = function getCallingContextText() {
					var callingContext = service.getCallingContext();
					var callingContextText = '';
					var callingContextObject = {};
					var deferredResult = $q.defer();
					var wicGroup = null;

					if (angular.isObject(callingContext) && !_.isEmpty(callingContext)) {
						if (_.isString(callingContext.ProjectNo) && _.isString(callingContext.ProjectName)) {

							// if Navigator from wic boq item of the lineitem,the header info should be show :wic groups + wic boq item
							if ((callingContext.NavigatorFrom === 'WicBoqItemNavigator' && callingContext.BoqWicCatFk)) {
								wicGroup = basicsLookupdataLookupDescriptorService.getLookupItem('wicCatFk', callingContext.BoqWicCatFk);

								if (wicGroup) {
									callingContextText = wicGroup.Code;

									if ((wicGroup.Code.length > 0) && wicGroup.DescriptionInfo && wicGroup.DescriptionInfo.Translated && (wicGroup.DescriptionInfo.Translated.length > 0)) {
										callingContextText += ' - ' + wicGroup.DescriptionInfo.Translated;
									}
								}
							} else {
								callingContextText = callingContext.ProjectNo + ' - ' + callingContext.ProjectName;
							}

							callingContextObject = {
								project: {
									description: callingContextText
								}
							};

							deferredResult.resolve(callingContextObject);
						} else if (angular.isDefined(callingContext.Boq) && (callingContext.Boq !== null) && angular.isDefined(callingContext.Boq.PrjProjectFk) && (callingContext.Boq.PrjProjectFk !== null)) {
							// Look for the project object corresponding to the PrjProjectFk
							var estimateMainService = $injector.get('estimateMainService');
							estimateMainService.setSelectedProjectId({PrjProjectFk: callingContext.Boq.PrjProjectFk});

							basicsLookupdataLookupDescriptorService.loadItemByKey('Project', callingContext.Boq.PrjProjectFk).then(function (project) {
								if (angular.isDefined(project) && (project !== null)) {
									callingContextText = project.ProjectLongNo + ' - ' + project.ProjectName;

									callingContextObject = {
										project: {
											description: callingContextText,
											id: project.Id
										}
									};

									// set project to estimateRuleFormatterService
									var estimateRuleFormatterService = $injector.get('estimateRuleFormatterService');
									estimateRuleFormatterService.setSelectedProject(project.Id);

									// set project to estimateParameterFormatterService
									var estimateParameterFormatterService = $injector.get('estimateParameterFormatterService');
									estimateParameterFormatterService.setSelectedProject(project.Id);

									var estimateRuleComboService = $injector.get('estimateRuleComboService');
									estimateRuleComboService.initEx(project.Id);

									estimateMainService.setSelectedProjectId({PrjProjectFk: project.Id});
								}

								deferredResult.resolve(callingContextObject);
							},
							function () {
								// Error case
								deferredResult.resolve('');
							});
						} else if (callingContext.WicBoq && callingContext.WicBoq.WicGroupFk) {
							// Look for the wic cat group object corresponding to the WicGroupFk
							var boqWicGroupService = $injector.get('boqWicGroupService');
							wicGroup = boqWicGroupService.getItemById(callingContext.WicBoq.WicGroupFk);

							if (wicGroup) {
								callingContextText = wicGroup.Code;

								if ((wicGroup.Code.length > 0) && wicGroup.DescriptionInfo && wicGroup.DescriptionInfo.Translated && (wicGroup.DescriptionInfo.Translated.length > 0)) {
									callingContextText += ' - ' + wicGroup.DescriptionInfo.Translated;
								}
							}

							callingContextObject = {
								project: {
									description: callingContextText
								}
							};

							deferredResult.resolve(callingContextObject);
						}
					}

					return deferredResult.promise;
				};

				/**
				 * @ngdoc function
				 * @name getCallingContextForFilter
				 * @function
				 * @methodOf
				 * @description Get the relevant informations of the calling context for setting the filter for loading boq items
				 * @returns {Object} with properties holding the relevant informations
				 */
				localData.getCallingContextForFilter = function getCallingContextForFilter() {
					var callingContext = service.getCallingContext();
					var callingContextForFilter = {};

					if (angular.isObject(callingContext) && !_.isEmpty(callingContext)) {
						if (angular.isDefined(callingContext.Boq) && (callingContext.Boq !== null) && angular.isDefined(callingContext.Boq.PrjProjectFk) && (callingContext.Boq.PrjProjectFk !== null)) {
							callingContextForFilter.callingContextType = 'Project';
							callingContextForFilter.callingContextId = callingContext.Boq.PrjProjectFk;
						} else if (angular.isDefined(callingContext.WicBoq) && (callingContext.WicBoq !== null) && angular.isDefined(callingContext.WicBoq.WicGroupFk) && (callingContext.WicBoq.WicGroupFk !== null)) {
							callingContextForFilter.callingContextType = 'Wic';
							callingContextForFilter.callingContextId = callingContext.WicBoq.WicGroupFk;
						} else if (angular.isDefined(callingContext.QtoHeader) && (callingContext.QtoHeader !== null)) {
							var conHeaderFk = callingContext.QtoHeader.ConHeaderFk === null ? 0 : callingContext.QtoHeader.ConHeaderFk;
							var ordHeaderFk = callingContext.QtoHeader.OrdHeaderFk === null ? 0 : callingContext.QtoHeader.OrdHeaderFk;
							var qtoTargetType = callingContext.QtoHeader.QtoTargetType;
							callingContextForFilter.callingContextType = (qtoTargetType === 1 || qtoTargetType === 3) ?
								'Qto' + qtoTargetType + '-con:' + conHeaderFk : 'Qto' + qtoTargetType + '-ord:' + ordHeaderFk;
							callingContextForFilter.callingContextId = callingContext.QtoHeader.Id;
						} else if (angular.isDefined(callingContext.PrcPackageHeader) && (callingContext.PrcPackageHeader !== null)) {
							callingContextForFilter.callingContextType = 'PrcPackage';
							callingContextForFilter.callingContextId = callingContext.PrcPackageHeader.Id;
						} else if (angular.isDefined(callingContext.PrcRequisitionHeader) && (callingContext.PrcRequisitionHeader !== null)) {
							callingContextForFilter.callingContextType = 'PrcRequisition';
							callingContextForFilter.callingContextId = callingContext.PrcRequisitionHeader.Id;
						} else if (angular.isDefined(callingContext.PrcQuoteHeader) && (callingContext.PrcQuoteHeader !== null)) {
							callingContextForFilter.callingContextType = 'PrcQuote';
							callingContextForFilter.callingContextId = callingContext.PrcQuoteHeader.Id;
						} else if (angular.isDefined(callingContext.PrcContractHeader) && (callingContext.PrcContractHeader !== null)) {
							callingContextForFilter.callingContextType = 'PrcContract';
							callingContextForFilter.callingContextId = callingContext.PrcContractHeader.Id;
						} else if (angular.isDefined(callingContext.PrcPesHeader) && (callingContext.PrcPesHeader !== null)) {
							callingContextForFilter.callingContextType = 'PrcPes';
							callingContextForFilter.callingContextId = callingContext.PrcPesHeader.Id;
						} else if (_.isObject(callingContext.SalesBidHeader)) {
							callingContextForFilter.callingContextType = 'SalesBid';
							callingContextForFilter.callingContextId = callingContext.SalesBidHeader.Id;
						} else if (_.isObject(callingContext.SalesOrdHeader)) {
							callingContextForFilter.callingContextType = 'SalesContract';
							callingContextForFilter.callingContextId = callingContext.SalesOrdHeader.Id;
						} else if (_.isObject(callingContext.SalesWipHeader)) {
							callingContextForFilter.callingContextType = 'SalesWip';
							callingContextForFilter.callingContextId = callingContext.SalesWipHeader.Id;
						} else if (_.isObject(callingContext.SalesBilHeader)) {
							callingContextForFilter.callingContextType = 'SalesBilling';
							callingContextForFilter.callingContextId = callingContext.SalesBilHeader.Id;
						} else if(angular.isDefined(callingContext.leadingStructureToProjectBoq)){
							callingContextForFilter.callingContextType = 'LeadingStructureToProjectBoq';
							callingContextForFilter.callingContextId = 0;
						}
					}

					return callingContextForFilter;
				};

				/**
				 * @ngdoc function
				 * @name getNextDesignDescriptionNo
				 * @function
				 * @methodOf
				 * @description Get the next free design description number
				 * @returns {String} next free design description number
				 */
				localData.getNextDesignDescriptionNo = function getNextDesignDescriptionNo() {
					// First get the list of all design description items
					var designDescriptionItems = _.filter(service.getList(), function (item) {
						return item.BoqLineTypeFk === boqMainLineTypes.designDescription;
					});

					// Check if the design description number of the given item is a valid positive integer
					var testDesignDescriptionNo = function (item) {
						return /^\d+$/.test(item.DesignDescriptionNo);
					};

					var foundDesignDesciption = _.maxBy(designDescriptionItems.filter(testDesignDescriptionNo), 'DesignDescriptionNo');
					var maxDesignDescriptionNo = (angular.isDefined(foundDesignDesciption) && foundDesignDesciption !== null) ? foundDesignDesciption.DesignDescriptionNo : null;
					if (maxDesignDescriptionNo) {
						maxDesignDescriptionNo = (parseInt(maxDesignDescriptionNo, 10) + 1).toString();
					}

					return maxDesignDescriptionNo || '1';
				};

				/**
				 * @ngdoc function
				 * @name getNextSubdescriptionNo
				 * @function
				 * @methodOf
				 * @description Get the next free subdescription number
				 * @param {Object} parentBoqItem whose children are searched for the next free subdescription number
				 * @returns {String} next free subdescription description number
				 */
				localData.getNextSubdescriptionNo = function getNextSubdescriptionNo(parentBoqItem) {

					if (angular.isUndefined(parentBoqItem) || parentBoqItem === null) {
						return '';
					}

					// First get the list of all subdescription items
					var subDescriptionItems = _.filter(parentBoqItem.BoqItems, function (item) {
						return item.BoqLineTypeFk === boqMainLineTypes.subDescription;
					});

					// Check if the subdescription number of the given item is a valid positive integer
					var testDesignDescriptionNo = function (item) {
						return /^\d+$/.test(item.DesignDescriptionNo);
					};

					var foundSubDescription = _.maxBy(subDescriptionItems.filter(testDesignDescriptionNo), 'DesignDescriptionNo');
					var maxSubDescriptionNo = (angular.isDefined(foundSubDescription) && foundSubDescription !== null) ? foundSubDescription.DesignDescriptionNo : null;
					if (maxSubDescriptionNo) {
						maxSubDescriptionNo = (parseInt(maxSubDescriptionNo, 10) + 1).toString();
						maxSubDescriptionNo = (maxSubDescriptionNo.length === 1) ? '0' + maxSubDescriptionNo : maxSubDescriptionNo;
					}

					return maxSubDescriptionNo || '01';
				};

				/**
				 * @ngdoc function
				 * @name setDefaultBoqItemObject
				 * @function
				 * @methodOf
				 * @description Set the values of the given boq item to be the values of the default object.
				 * Skip navigational and state properties to avoid changing in type and relation to other objects.
				 * @param {Object} boqItem whose properties and related values serve as template for the default object
				 * @param {Boolean} overwrite : forces an already existing default object to be overwritten
				 */
				localData.setDefaultBoqItemObject = function setDefaultBoqItemObject(boqItem, overwrite) {

					// Do some checks first
					if (angular.isUndefined(boqItem) || !_.isObject(boqItem) || angular.isUndefined(boqItem.BoqHeaderFk) || angular.isUndefined(boqItem.BoqItemFk) || angular.isUndefined(boqItem.Reference)) {
						// The given boqItem doesn't seem to be a valid boq item object.
						// No need to continue...
						return;
					}

					if ((localData.defaultBoqItem === null) || overwrite) {

						// Take a copy of the given boqItem to be the template for the default values object
						localData.defaultBoqItem = angular.copy(boqItem);

						// Fill the following object with property names and flags indicating that the related boq item properties are skipped.
						var skippedProperty = {
							BoqHeaderFk: true,
							BoqItemFk: true,
							BoqItemParent: true,
							BoqLineTypeFk: true,
							BoqDivisionTypeFk: true,
							BoqItemBasisFk: true,
							BoqItemBasisParent: true,
							BoqItems: true,
							BoqItemChildren: true,
							BoqItemReferenceFk: true,
							BoqItemReferenceParent: true,
							BoqSurcharedEntities: true, // Todo: Typo in dto: surchar(g)ed !!
							BoqSurcharedItemFk: true, // Todo: Typo in dto: surchar(g)ed !!
							HasChildren: true,
							BasBlobsSpecificationFk: true,
							BoqItemWicBoqFk: true,
							BoqItemWicItemFk: true,
							BoqItemPrjBoqFk: true,
							BoqItemPrjItemFk: true,
							BoqItemBidBoqFk: true,
							BoqItemBidItemFk: true,
							BoqItemOrdBoqFk: true,
							BoqItemOrdItemFk: true,
							BoqItemBilBoqFk: true,
							BoqItemBilItemFk: true,
							Id: true,
							InsertedAt: true,
							InsertedBy: true,
							UpdatedAt: true,
							UpdatedBy: true,
							PrcItemEvaluationFk: true,
							PrcStructureFk: true,
							LevelIndex: true,
							Reference: true,
							Version: true,
							WicChildren: true,
							WicParent: true,
							__rt$data: true,
							image: true,
							nodeInfo: true
						};

						// Iterate over the default object and remove properties that should not be considered when setting a boq item back to an initial state
						for (var property in boqItem) {
							if (Object.prototype.hasOwnProperty.call(boqItem, property) && skippedProperty[property]) {
								// Remove this property from default object
								delete localData.defaultBoqItem[property];
							}
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name getNextDivisionType
				 * @function
				 * @methodOf
				 * @description Get the next division type for a child item beneath the given parent boq item
				 * @param {Object} parentBoqItem whose properties and related values serve as template for the default object
				 * @returns {Number} next division type
				 */
				localData.getNextChildDivisionType = function getNextChildDivisionType(parentBoqItem, childLineType) {

					if (angular.isUndefined(parentBoqItem) || (parentBoqItem === null) || !boqMainCommonService.isDivisionType(childLineType)) {
						return null;
					}

					if (boqMainCommonService.isDivision(parentBoqItem) && parentBoqItem.BoqLineTypeFk >= 1) {
						// All divisions below the first level inherit the division type from the division type of the first level
						// i.e. all division types on the lower levels are the same and inherit from their parent.
						return parentBoqItem.BoqDivisionTypeFk;
					}

					// Due to ALM task #75087 presetting the division type on the level 1 divisions is no longer wanted.
				};

				/**
				 * @ngdoc function
				 * @description Currently we set the QuantityMax to the current value of the Quantity if it is zero or Quantity is smaller
				 * than the last set QuantityMax value
				 * @param {Object} boqItem: whose quantity has been changed
				 */
				localData.adjustQuantityMax2Quantity = function adjustQuantityMax2Quantity(boqItem) {

					if (!_.isObject(boqItem)) {
						return;
					}

					// Special case: when being in Sales.Wip or Sales.Billing module the following logic doesn't make sense, so we leave here.
					let callingContextType = service.getCallingContextType();
					if(['SalesWip','SalesBilling'].includes(callingContextType)) {
						return;
					}


					if (boqItem.QuantityMax === 0 || boqItem.Quantity < boqItem.QuantityMax) {
						boqItem.QuantityMax = boqItem.Quantity;
					}
				};

				/******************************
				 * PUBLIC SECTION OF SERVICE   *
				 *******************************/

				// public variables
				/**
				 * @property {array} elements.
				 */

				// Public events

				service.selectedBoqHeaderChanged = new Platform.Messenger();

				service.boqItemsUpdated = new Platform.Messenger();

				service.onPostError = new Platform.Messenger();
				service.creationError = new Platform.Messenger();
				service.boqItemPriceChanged = new Platform.Messenger();
				service.boqItemQuantityChanged = new Platform.Messenger();
				service.boqItemStateChanged = new Platform.Messenger();
				service.boqItemCreateSucceeded = new Platform.Messenger();
				service.boqStructureReloaded = new Platform.Messenger();
				service.startActionEvent = new Platform.Messenger();
				service.endActionEvent = new Platform.Messenger();
				service.onImportSucceeded = new Platform.Messenger();
				service.onRenumberBoqSucceeded = new Platform.Messenger();
				service.requestReadOnlyState = new Platform.Messenger();
				service.divisionTypeAssignmentChanged = new Platform.Messenger();
				service.boqItemEdited = new Platform.Messenger();
				service.boqItemBriefChanged = new Platform.Messenger();

				service.boqItemQuantityChanged.register(localData.adjustQuantityMax2Quantity);

				/**
				 * @ngdoc function
				 * @name setContainerUUID
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description sets the container UUID of the underlying boq container
				 * @param {String} containerUUID identifying the container UUID of the underlying boq container
				 */
				service.setContainerUUID = function setContainerUUID(containerUUID) {

					if ((containerUUID !== localData.containerUUID) && angular.isDefined(localData.containerUUID) && _.isString(localData.containerUUID) && !_.isEmpty(localData.containerUUID)) {
						platformPermissionService.restrict(localData.containerUUID, false); // Reset possible restrictions
					}

					localData.containerUUID = containerUUID;
				};

				/**
				 * @ngdoc function
				 * @name getContainerUUID
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description gets the container UUID of the underlying boq container
				 * @returns {String} containerUUID identifying the container UUID of the underlying boq container
				 */
				service.getContainerUUID = function getContainerUUID() {
					return localData.containerUUID;
				};

				/**
				 * @ngdoc function
				 * @name setReadOnly
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description sets the read only mode of the service
				 * @param {Boolean} flag telling if read only is active or not
				 */
				service.setReadOnly = function setReadOnly(flag) {

					var oldValue = localData.readOnly;

					if (localData.readOnly === flag) {
						return; // Nothing has changed -> nothing to be done
					}

					localData.readOnly = flag;

					// !!! Temporary workaround to fix ALM 127974 (-> Boq Sturcture Container cannot show data on contract sale Module).
					// !!! There currently is a timing issue when restricting the permission to the boq structure container in the way that the data is loaded into the
					// !!! grid although reinitializing the container with new permissions isn't finished yet. This leads to calling the grid tree formatter with scope = null
					// !!! which in turn prevents the grid from properly loading the data.
					$timeout(function () {
						if (angular.isDefined(service.getContainerUUID()) && _.isString(service.getContainerUUID()) && !_.isEmpty(service.getContainerUUID())) {

							if (flag) {
								platformPermissionService.restrict(service.getContainerUUID().toLowerCase(), permissions.read);
							} else if (oldValue) { // Only do this if readonly was set before
								platformPermissionService.restrict(service.getContainerUUID().toLowerCase(), false); // Reset restriction
							}
						}
					}, 300);
				};

				/**
				 * @ngdoc function
				 * @name getReadOnly
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description gets the read only mode of the service
				 * @returns {Boolean} flag telling if read only is active or not
				 */
				service.getReadOnly = function getReadOnly() {
					return localData.readOnly;
				};

				// public boqItem code

				/**
				 * @ngdoc function
				 * @name getSelectedBoqHeader
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description return the currently selected boq header
				 * @returns {Number} the currently selected boq header
				 */
				service.getSelectedBoqHeader = function getSelectedBoqHeader() {
					return localData.selectedBoqHeader;
				};

				/**
				 * @ngdoc function
				 * @name getParentOf
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description determine the parent of the given boqItem
				 * @param {Object} boqItem : item whose parent has to be determined
				 * @returns {Object} parent of given boqItem
				 */
				service.getParentOf = function getParentOf(boqItem) {
					return localData.getParentBoqItem(boqItem);
				};

				/**
				 * @ngdoc function
				 * @name getParentItemAndLevelForPaste
				 * @function
				 * @methodOf
				 * @description With the given selectedItem on which the pasted item is to be pasted we determine according to
				 * special rules the parent item of the pasted item in the target hierarchy and its target hierarchy level. Also
				 * we return if the pasted item is inserted as child according to the selected item or as sibling item.
				 * @param {Object} selectedItem in target boq on which the pasted item from source hierarchy is to be pasted
				 * @param {Object} pastedItem that's to be pasted on selectedItem
				 * @returns {Object} with properties 'parentItem', 'level' and 'pasteAsChild'
				 */
				service.getParentItemAndLevelForPaste = function getParentItemAndLevelForPaste(selectedItem, pastedItem) {

					var boqStructure = boqStructureService.getStructure();
					var result = {
						parentItem: selectedItem,
						level: localData.getLevelOfBoqItem(selectedItem),
						pasteAsChild: false
					};

					if (!selectedItem || !pastedItem || _.isEmpty(boqStructure)) {
						return result;
					}

					// Depending on the boq structure settings and on which type of item the pasted item is dropped we can determine the
					// new level of the item to be pasted.
					if (boqMainCommonService.isRoot(selectedItem)) {
						// Dropping on a root item should generate a child item
						// -> level is increased by one
						result.parentItem = selectedItem;
						result.level++;
						result.pasteAsChild = true;
					} else if (selectedItem.IsLeadDescription && boqMainCommonService.isItem(pastedItem)) {
						// Special case wanted by Bosch.
						// In this case dropping positions onto a lead description should move the positions as children to the lead description and turn them into sub descriptions.
						result.parentItem = selectedItem;
						result.level++;
						result.pasteAsChild = true;
					} else if (boqStructure.EnforceStructure && service.isGaebBoq()) {
						// In this restricted more or less GAEB like boq structure we check on which type of boq item the pasted item is dropped.
						if (boqMainCommonService.isDivision(selectedItem)) {
							if (boqMainCommonService.isItem(pastedItem) || boqMainCommonService.isSurchargeItem(pastedItem)) {
								// Dropping an item on a division should generate a child item
								// -> level is increased by one
								result.parentItem = selectedItem;
								result.level++;
								result.pasteAsChild = true;
							} else {
								// In all other cases we're creating sibling items
								// -> move the parent item one level up
								result.parentItem = localData.getParentBoqItem(selectedItem);
								result.pasteAsChild = false;
							}
						} else {
							if ((boqMainCommonService.isItem(selectedItem) && boqMainCommonService.isSubDescription(pastedItem)) ||
								(boqMainCommonService.isDesignDescription(selectedItem) && boqMainCommonService.isTextElement(pastedItem))) {
								// The following cases are handled here:
								// - Dropping a subdescription on an item should generate a child subdescription
								// - Dropping a text element on a design description should generate a child text element
								// -> level is increased by one
								result.parentItem = selectedItem;
								result.level++;
								result.pasteAsChild = true;
							} else {
								// In all other cases we're creating sibling items
								// -> move the parent item one level up
								result.parentItem = localData.getParentBoqItem(selectedItem);
								result.pasteAsChild = false;
							}
						}
					} else {
						// This is the non enforced or free mode where we create a sibling item to the item on which the pasted item was dropped
						// The level is the one of the selected item and the new selected item is the parent of the selected item so we move the parent item one level up
						result.parentItem = localData.getParentBoqItem(selectedItem);
						result.pasteAsChild = false;
					}

					return result;
				};

				/**
				 * @ngdoc function
				 * @name getParentChainOf
				 * @function
				 * @methodOf
				 * @description Starting with the given boqItem we climb up the parent chain by
				 * determining the parent items and each parent item only holds the one boq item as child
				 * where the traversal came from. The chain ends with the uppermost parent item whose parent
				 * is the root item.
				 * @param {Object} boqItem whose parent chain is to be determined
				 * @param {Array} clonedParentChain holding the cloned items of the determined parent chain odered by their hierachical order
				 * @param {Boolean} insertBoqItem: flag, triggering the insertion of the boq item at the end of the chain
				 * @returns {Object} the uppermost parent item of the parent chain holding the direct path to the starting boqItem by the single entries in the BoqItems array
				 */
				service.getParentChainOf = function getParentChainOf(boqItem, clonedParentChain, insertBoqItem) {

					var parentPath = [];
					var upperMostParent = null;
					var parentItem = null;
					var clonedParentItem = null;
					var previousClonedParent = null;
					// var clonedBoqItem = null;

					if (!_.isObject(boqItem) || boqMainCommonService.isRoot(boqItem)) {
						return null;
					}

					var foundBoqItem = service.getBoqItemById(boqItem.Id, parentPath);

					if (_.isObject(foundBoqItem) && foundBoqItem.Id === boqItem.Id) {
						// Iterate over parentPath array and create a new hierarchy of boq items
						// representing the parent path of the given boqItem and the boqItem itself,
						// by cloning those parent items and forming the parent path by connecting the parent items
						// via the corresponding BoqItems children array.
						for (var i = parentPath.length - 1; i >= 0; i--) {
							parentItem = parentPath[i];
							if (_.isObject(parentItem) && !boqMainCommonService.isRoot(parentItem)) {
								clonedParentItem = _.clone(parentItem);
								if (!_.isObject(upperMostParent)) {
									upperMostParent = clonedParentItem;
								}

								if (_.isArray(clonedParentChain)) {
									clonedParentChain.push(clonedParentItem);
								}

								if (_.isObject(previousClonedParent)) {
									previousClonedParent.BoqItems = [];
									if (clonedParentItem.BoqItemFk === previousClonedParent.Id) {
										previousClonedParent.BoqItems.push(clonedParentItem);
									} else {
										console.log('boqMainServiceFactor.getParentChainOf -> abort because of wrong parent child link (1)');
										return null;
									}
								}

								previousClonedParent = clonedParentItem;
							} else if ((previousClonedParent === null) && (parentItem.Id === boqItem.Id)) {
								upperMostParent = boqItem;
							}
						}

						if(_.isBoolean(insertBoqItem) && insertBoqItem && _.isObject(previousClonedParent)) {
							let clonedBoqItem = _.clone(boqItem);
							if(clonedBoqItem.BoqItemFk === previousClonedParent.Id) {
								previousClonedParent.BoqItems.push(clonedBoqItem);
							}
							else {
								console.log('boqMainServiceFactor.getParentChainOf -> abort because of wrong parent child link (2)');
								return null;
							}
						}
					}

					return upperMostParent;
				};

				/**
				 * @ngdoc function
				 * @name adjustPastedAndSelectedItem
				 * @function
				 * @methodOf
				 * @description Depending in the current copy options settings we possibly have to readjust the given selected and pasted item
				 * @param {Object} selectedItem
				 * @param {Object} pastedItem
				 * @param {Object} sourceBoqMainService holds the boqMainService that loaded the source boq items where the pastedItems belong to
				 * @returns {Object} holding two properties (selectedItem and pastedItem) that carry the possibly readjusted items
				 */
				service.adjustPastedAndSelectedItem = function adjustPastedAndSelectedItem(selectedItem, pastedItem, sourceBoqMainService) {

					var readjustedItems = {selectedItem: selectedItem, pastedItem: pastedItem};
					var boqStructure = boqStructureService.getStructure();
					var upperMostParent = null;
					var foundTargetBoqItem = null;
					var clonedParentChain = [];

					if(service.isOenBoq()) {
						let boqMainOenService = $injector.get('boqMainOenService');
						return boqMainOenService.adjustPastedAndSelectedItem(readjustedItems, selectedItem, pastedItem, sourceBoqMainService, service);
					}

					if (_.isObject(boqStructure) && (selectedItem.BoqHeaderFk !== pastedItem.BoqHeaderFk) && boqStructure.AutoAtCopy) {
						// In this case the parent hierarchy elements of the pasted item are also to be inserted.
						// To be able to do this we have to check, if the item and its parent items can be pasted into the target boq.
						// In this case we ignore the selected item and assume the paste is done on the root level and the pasted item
						// and its direct parent items (-> the parent chain) is to be pasted.
						// -> so we shift the pastedItem from the given item to its uppermost parent item which becomes the new parent item
						// holding the other parent items down to the pastedItem (-> only the direct path, no other potential path in the underlying tree)

						// All this only makes sense if the pasted item isn't already in the target hierarchy, i.e. there is no target item having the same reference number than this one.
						if(boqStructure.KeepRefNo) {
							foundTargetBoqItem = service.getBoqItemByReference(pastedItem.Reference);
							if (_.isObject(foundTargetBoqItem)) {
								return null;
							}
						}

						// Determine parent chain and uppermost parent item.
						upperMostParent = sourceBoqMainService.getParentChainOf(pastedItem, clonedParentChain);

						if (_.isObject(upperMostParent)) {

							if(boqStructure.KeepRefNo) {
								readjustedItems.pastedItem = upperMostParent; // In this case we assume that the pasted item is the originally given item and its whole parent hierarchy starting at upperMostParent
								readjustedItems.selectedItem = service.getRootBoqItem(); // For we want to insert the whole hierarchy of the originally given pasted item we assume it to be pasted onto the root item.
							}
							else {
								// For we don't want to keep the reference number we have a new scenario.
								// Here we can't assume to have identical structure definitions in the source and target boq we have to adjust the parent path of the copied source item
								// so that it can be copied into the target boq. This means adding as much hierarchical source items to the pasted, so it fits into the target hierarchy.
								let levelOfTargetItem = localData.getLevelOfBoqItem(selectedItem);
								let targetPositionLevel = localData.getLineTypeLevel(boqMainLineTypes.position);
								let doesPastedItemIncludePositions = pastedItem.BoqLineTypeFk === boqMainLineTypes.position || _.isObject(localData.findBoqItemByPropertyValue('BoqLineTypeFk', 0, pastedItem));

								if(doesPastedItemIncludePositions) {
									// Only in this case we add possibly missing divisions to enable inserting the including positions
									let insertedTargetLevels = targetPositionLevel - levelOfTargetItem - 1;

									if(insertedTargetLevels > 0 && !_.isEmpty(clonedParentChain) && (insertedTargetLevels <= clonedParentChain.length - 1)) {
										// Here we have the number of source divisions that have to be inserted.
										// So we check how much of the given pasted source hierarchy we need to get the source positions inserted properly into the target hierarchy.
										readjustedItems.pastedItem = clonedParentChain[clonedParentChain.length - 1 - insertedTargetLevels];
									}
								}
							}
						}
					}

					return readjustedItems;
				};

				/**
				 * @ngdoc function
				 * @description Take the given array of selected boq items look for double entries caused by selection over hierarchical borders
				 * (i.e. parent and child items selected simultaneously) and prepare the list of selected items
				 * @param {Array} selectedBoqItems: to be prepared
				 * @param {Array} flatListArray: holding all prepared boq items and its children in a flat list
				 * @returns {Array} accordingly prepared list boq items
				 */
				service.prepareSelectedBoqItems = function perpareSelectedBoqItems(selectedBoqItems, flatListArray) {
					var preparedBoqItems = [];
					var flatDictionary = {}; // Dictionary holding the list of flat items with boqItem Id as key

					if (!_.isArray(selectedBoqItems) || selectedBoqItems.length === 0) {
						return [];
					}

					// At first sort the selected boq items according to their hierarchical level,
					// i.e. parent items should be listed before child items.
					selectedBoqItems.sort(function (boqItem1, boqItem2) {

						var level1 = -1;
						var level2 = -1;

						if (_.isObject(boqItem1) && !_.isObject(boqItem2)) {
							return -1;
						} else if (!_.isObject(boqItem1) && _.isObject(boqItem2)) {
							return 1;
						} else if (!_.isObject(boqItem1) && !_.isObject(boqItem2)) {
							return 0;
						}

						level1 = localData.getLevelOfBoqItem(boqItem1);
						level2 = localData.getLevelOfBoqItem(boqItem2);

						return level1 - level2;
					});

					// Prepare the list of given boq items according to special rules
					angular.forEach(selectedBoqItems, function (boqItem) {
						var flatList = [];
						var boqItemArray = [];
						if (boqMainCommonService.isDivision(boqItem) || boqItem.IsLeadDescription) {
							// Flatten this subtree
							boqItemArray.push(boqItem);
							localData.flatten(boqItemArray, flatList, localData.treePresOpt.childProp);

							// ...and add to preparedBoqItems list if not already in it
							if (!_.isObject(flatDictionary[boqItem.Id])) {
								flatDictionary[boqItem.Id] = boqItem;
								preparedBoqItems.push(boqItem);
							}

							angular.forEach(flatList, function (item) {
								if (!_.isObject(flatDictionary[item.Id])) {
									flatDictionary[item.Id] = item;
								}
							});
						} else {
							// Add to preparedBoqItems list if not already in it
							if (!_.isObject(flatDictionary[boqItem.Id])) {
								flatDictionary[boqItem.Id] = boqItem;
								preparedBoqItems.push(boqItem);
							}
						}
					});

					// Return all collected items in the flat list dictionary as an array
					if (_.isArray(flatListArray)) {
						flatListArray.length = 0;

						angular.forEach(Object.values(flatDictionary), function (item) {
							flatListArray.push(item);
						});
					}

					// Return prepared boqItem list.
					return preparedBoqItems;
				};

				/**
				 * @ngdoc function
				 * @name getGroupedSelectedBoqTypes
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description groups the list of selectedBoqItems by their BoqLineTypFks
				 * @param {Array} selectedItems
				 * @returns {Boolean} returns the list of selectedBoqItems grouped by their BoqLineTypFks
				 */
				service.getGroupedSelectedBoqTypes = function getGroupedSelectedBoqTypes(selectedBoqItems) {
					var groupedSelectedBoqTypes = _.groupBy(selectedBoqItems, function (boqItem) {
						if (!_.isObject(boqItem)) {
							return -1;
						}

						if (boqMainCommonService.isPositionType(boqItem.BoqLineTypeFk) || boqMainCommonService.isSurchargeItemType(boqItem.BoqLineTypeFk)) {
							return 0;
						} else {
							return boqItem.BoqLineTypeFk;
						}
					});

					return groupedSelectedBoqTypes;
				};

				service.getCachedRevenueTypeAsync = function(findObject) {
					var lookUpOptions = basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.boqrevenuetypefk', 'Description', { customBoolProperty:'IS_PERCENTAGE' });
					return basicsLookupdataSimpleLookupService.getList(lookUpOptions.detail.options).then(function(result) { // gets boqRevenueTypeList from cache
						return _.find(result, findObject);
					});
				};

				service.updateRevenuePercentage = function(boqItem, revenueType) {
					if (!boqItem || !revenueType) {
						return;
					}

					if (revenueType.IsPercentage && boqItem.RevenuePercentage===null) {
						boqItem.RevenuePercentage = 100;
					}
					else if (!revenueType.IsPercentage) {
						boqItem.RevenuePercentage = null;
					}

					service.gridRefresh();
				};

				/**
				 * @ngdoc function
				 * @name resortChildren
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Resort the child boqItems of the given parentBoqItem
				 * @param {Object} parentBoqItem whose children are to be resorted
				 */
				service.resortChildren = function resortChildren(parentBoqItem, doRefresh) {

					if (!parentBoqItem || !parentBoqItem.BoqItems) {
						return; // no parent item or no children -> nothing happens
					}

					// Resort the children according to a given compare function which is currently based on sorting the reference numbers of the boqItems
					parentBoqItem.BoqItems.sort(service.compareBoqItemsByReferences);

					if (_.isBoolean(doRefresh) && doRefresh) {
						serviceContainer.service.gridRefresh(); // Refresh grid to show new sort order
					}
				};

				/**
				 * @ngdoc function
				 * @name resortSiblings
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Resort the sibling boqItems of the given childBoqItem
				 * @param {Object} childBoqItem whose siblings are to be resorted
				 * @param {Boolean} doSetSelected indicates if the selected item has to be set to the given childBoqItem
				 */
				service.resortSiblings = function resortSiblings(childBoqItem, doSetSelected) {

					if (!childBoqItem) {
						return; // no child item -> nothing happens
					}

					// First determine the parent of the given childBoqItem
					if (childBoqItem.BoqItemFk) {
						// Find the parent of the given childBoqItem
						var parentBoqItem = service.getBoqItemById(childBoqItem.BoqItemFk);
						service.resortChildren(parentBoqItem, true);

						if (doSetSelected) {
							service.setSelected(childBoqItem); // Set the current item to the given childItem
						}
					}
				};

				service.resolveMasterAndProjectCostCode = function resolveMasterAndProjectCostCode(boqItem){
					boqMainProject2CostCodeProcessor.processItem(boqItem);
				};

				/**
				 * @ngdoc function
				 * @name refreshBoqData
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Refreshs the current BOQ data
				 * @param {bool} notifyGaebImportSucceeded
				 */
				service.refreshBoqData = function refreshBoqData(notifyGaebImportSucceeded) {

					service.reloadStructureForCurrentHeader().then(function () {
						localData.loadBoqItems(0, 99, 0, true).then(function() {
							if(_.isObject(localData.lastFilterParams) && (localData.lastFilterParams.isPes || localData.lastFilterParams.isWip || localData.lastFilterParams.isBil)) {
								// Calculate whole boq according to TotalPrice and TotalHours
								service.calcTotalPriceAndHoursForBoq();
							}
						});

						if (notifyGaebImportSucceeded) {
							service.onImportSucceeded.fire(); // Notify observers that import has succeeded (In the bid module the current BOQ is changed after this call !!!)
						}
					});
				};

				/**
				 * @ngdoc function
				 * @name isRootBoqItemLoaded
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description checks if a root boqItem is loaded
				 * @returns {Boolean} indicates if root boq item is loaded
				 */
				service.isRootBoqItemLoaded = function isRootBoqItemLoaded() {
					return (service.getTree() && angular.isArray(service.getTree()) && service.getTree().length > 0 && angular.isDefined(service.getTree()[0].BoqItemFk));
				};

				/**
				 * @ngdoc function
				 * @name getRootBoqItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description returns the currently loaded rootBoqItem
				 * @returns {Object} the currently loaded rootBoqItem
				 */
				service.getRootBoqItem = function getRootBoqItem() {
					return service.isRootBoqItemLoaded() ? service.getTree()[0] : null;
				};

				/**
				 * @ngdoc function
				 * @name getBoqItemById
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description returns the boq item given by its id
				 * @param {Number} id of the boq item searched and returned
				 * @param {Array} parentPath : assembles all items in the parent path from the root item to the matching item
				 * @returns {Object} found boq item
				 */
				service.getBoqItemById = function getBoqItemById(id, parentPath) {
					var boqRootItem = service.getRootBoqItem();

					if (angular.isUndefined(boqRootItem) || boqRootItem === null) {
						return null;
					}

					if (boqRootItem.Id === id) {
						// We looked for the root item and found it
						return boqRootItem;
					}

					return localData.findBoqItemByPropertyValue('Id', id, boqRootItem, null, parentPath); // Dig deeper in the children hierarchy of boqRootItem and look for the corresponding item
				};

				/**
				 * @ngdoc function
				 * @name getBoqItemByReference
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description returns the boq item given by its reference.
				 * The root item is excluded from this search, because its reference number can freely be set and lead to ambigious results.
				 * @param {String} reference of the boq item searched and returned
				 * @returns {Object} found boq item
				 */
				service.getBoqItemByReference = function getBoqItemByReference(reference) {
					var excludedItems = [];
					var foundItem = null;
					excludedItems.push(service.getRootBoqItem()); // Exclude the root item from the search.
					foundItem = localData.findBoqItemByPropertyValue('Reference', reference, service.getRootBoqItem(), excludedItems);

					if (foundItem === null && !_.isEmpty(reference)) {
						// Special case with the final dot in reference. We see the same reference number with and witout final dot as equal.
						// So we check against this here, too.

						// Add or remove final dot depending on what is neccessary
						if (service.isGaebBoq()) {
							if (reference.lastIndexOf(localData.getReferenceNumberDelimiter()) === reference.length - 1) {
								// Remove final dot
								reference = reference.substring(0, reference.length - 1);
							} else {
								// There's no final dot -> add one
								reference += localData.getReferenceNumberDelimiter(true);
							}
						}

						foundItem = localData.findBoqItemByPropertyValue('Reference', reference, service.getRootBoqItem(), excludedItems);
					}

					return foundItem;
				};

				/**
				 * @ngdoc function
				 * @name getSelectedHeaderFk (AngularMigration => BoqItemDataService.getCurrentBoqHeaderId)
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description returns the boq header fk of the currently loaded boq
				 * @returns {Number} currently selected boq header
				 */
				service.getSelectedHeaderFk = function getSelectedHeaderFk() {
					return localData.selectedBoqHeader;
				};

				/**
				 * @ngdoc function
				 * @name setSelectedHeaderFk
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description sets a new boq header fk and loads the corresponding boq
				 * @param {Number} headerFk to be set
				 * @param {Boolean} doRefresh triggers a refresh of the already loaded data in case the given boq header is already set
				 */
				service.setSelectedHeaderFk = function setSelectedHeaderFk(headerFk, doRefresh, isPes, isWip, isBil, callingContext, isCompleteCrb) {
					var resultPromise = $q.when(false);

					if (localData.endRead==='boqitemsforlookup' && headerFk>0) {
						localData.selectedBoqHeader = headerFk;
						service.setFilter('boqHeaderId='+localData.selectedBoqHeader + '&includeCostGroups='+(option.includeCostGroups===true));
						resultPromise = boqStructureService.loadStructure(headerFk).then(function () {
							// Loading of boqStructure succeeded
							return service.load().then(function () {
								service.selectedBoqHeaderChanged.fire();
							});
						});
					}
					else if (localData.selectedBoqHeader !== headerFk) {

						// Reset state of service to initial values to avoid having an intermediate state when loading the new boq
						localData.reset();

						localData.selectedBoqHeader = headerFk;
						callingContext = angular.isDefined(callingContext) ? callingContext : null;
						service.setCallingContext(callingContext);
						if (headerFk > 0) {
							// We want the boq structure to be loaded first, because we need it to be able to create new items properly
							// and afterwards we load the boq items.
							resultPromise = boqStructureService.loadStructure(headerFk).then(function () {
								// Loading of boqStructure succeeded
								return localData.loadBoqItems(0, 99, 0, false, isPes, isWip, isBil).then(function () {
									service.selectedBoqHeaderChanged.fire();
								});
							},
							function () {
								// Loading of boqStructure failed, but we still load the boq item and notify the change of the boq header
								return localData.loadBoqItems(0, 99, 0, false, isPes, isWip, isBil).then(function () {
									service.selectedBoqHeaderChanged.fire();
								});
							});
						}
						else { // there is no current BOQ
							service.selectedBoqHeaderChanged.fire();
						}
					}
					else if (doRefresh && (headerFk !== 0)) {
						// service.refresh(); // .refresh() is currently only present in case the service is a root service. Alternatively we do a simple load.
						resultPromise = boqStructureService.loadStructure(headerFk).then(function () {
							return localData.loadBoqItems(localData.lastFilterParams.startId, localData.lastFilterParams.depth, localData.lastFilterParams.recalc, true, null, null, null, isCompleteCrb);
						});
					}

					return resultPromise;
				};

				/**
				 * @ngdoc function
				 * @name setSelectedHeaderFkByHeader
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description sets boq structure to boqStructureService
				 * @param {boqHeader} boq header include boq structure and boq structure details
				 */
				service.setSelectedHeaderFkByHeader = function setSelectedHeaderFkByHeader(boqHeader) {
					if (localData.selectedBoqHeader !== boqHeader.Id) {

						// Reset state of service to initial values to avoid having an intermediate state when loading the new boq
						localData.reset();

						localData.selectedBoqHeader = boqHeader.Id;
						service.setCallingContext(null);
						if (boqHeader && boqHeader.BoqStructureEntity) {
							boqStructureService.setStructureEntity(boqHeader);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name reloadStructureForCurrentHeader
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description reload the structure of the currently selected boq header
				 */
				service.reloadStructureForCurrentHeader = function reloadStructureForCurrentHeader() {

					var deferred = $q.defer();

					if (localData.selectedBoqHeader > 0) {
						// Show wait overlay to suppress use interaction until the reload is done.
						service.startActionEvent.fire();
						boqStructureService.loadStructure(localData.selectedBoqHeader).then(function () {
							service.boqStructureReloaded.fire();
							service.endActionEvent.fire();
							deferred.resolve();
						}, function () {
							service.endActionEvent.fire();
							deferred.reject();
						});
					}

					return deferred.promise;
				};

				/**
				 * @ngdoc function
				 * @name isItemWithIT
				 * @function
				 * @methodOf oqMainServiceFactory.service
				 * @description Check if the given boqItem is an item with an item total
				 * @param {Object} boqItem to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isItemWithIT = function isItemWithIT(boqItem) {
					if(angular.isDefined(boqItem) && boqItem !== null &&
						(boqMainCommonService.isItem(boqItem) || boqMainCommonService.isSurchargeItem(boqItem)) &&
						(boqItem.BasItemTypeFk === 0 || // todo tmp for old boqs
							boqItem.BasItemTypeFk === boqMainItemTypes.standard ||
							boqItem.BasItemTypeFk === boqMainItemTypes.optionalWithIT) &&
						(boqItem.BasItemType2Fk === null || // todo tmp for old boqs
							boqItem.BasItemType2Fk === boqMainItemTypes2.normal ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.base ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.crbPrimaryVariant) && !service.isDisabledOrNA(boqItem)
					) {
						return true;
					}

					return false;
				};

				/**
				 * @ngdoc function
				 * @name isDivisionOrRootWithIT
				 * @function
				 * @methodOf oqMainServiceFactory.service
				 * @description Check if the given boqItem is a division or root with an item total
				 * @param {Object} boqItem to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDivisionOrRootWithIT = function isDivisionOrRootWithIT(boqItem) {
					if (angular.isDefined(boqItem) && boqItem !== null &&
						boqMainCommonService.isDivisionOrRoot(boqItem) &&
						(boqItem.BasItemType2Fk === null || // todo tmp for old boqs
							boqItem.BasItemType2Fk === boqMainItemTypes2.normal ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.base ||
							boqItem.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded) && !service.isDisabledOrNA(boqItem)
					) {
						return true;
					}

					return false;
				};

				/**
				 * @ngdoc function
				 * @name isDisabledOrNA
				 * @function
				 * @methodOf oqMainServiceFactory.service
				 * @description Check if the given boqItem is disabled or not applicable.
				 * This check climbs up the parent chain to even check the parents for this properties.
				 * @param {Object} boqItem to be checked
				 * @returns {Boolean} returns result of check
				 */
				service.isDisabledOrNA = function isDisabledOrNA(boqItem) {

					if (angular.isUndefined(boqItem) || boqItem === null) {
						return false;
					}

					var b = boqItem.IsDisabled || boqItem.IsNotApplicable;

					if (!b) {
						var parent = localData.getParentBoqItem(boqItem);

						while (parent !== null) {
							b = parent.IsDisabled || parent.IsNotApplicable;
							if (b) {
								break;
							}

							parent = localData.getParentBoqItem(parent);
						}
					}

					return b;
				};

				/**
				 * @ngdoc function
				 * @name updateSiblingSurchargeItems
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description trigger the calculation of of the sibling surcharge items
				 * @param {Object} item to whose sibling surcharge items have to be calculated
				 * @param {Boolean} notifyPriceChanged triggers firing of price changed event
				 */
				service.updateSiblingSurchargeItems = function updateSiblingSurchargeItems(item, notifyPriceChanged) {

					var parentItem = null;
					var updated = false;

					// First check if there are sibling surcharge items.
					// Only if there are some the triggered calculation makes sense
					if (service.hasSiblingSurchargeItems(item)) {
						parentItem = service.getParentOf(item);
						// We hand over the parentItem, because we have to make sure the sibling items are recalculated.
						service.calcParentChain(parentItem, true); // By giving the flag true, we assure that the children of boqItem are calculated first, before calculating up the parent chain.
						// As we can assume that boqItem is marked as modified we take care that it is not added to the affected item list when calculating the parent chain.
						service.removeFromAffectedItems(item);

						updated = true;
					}

					if (notifyPriceChanged) {
						service.boqItemPriceChanged.fire(item);
					}

					return updated;
				};

				/**
				 * @ngdoc function
				 * @name hasSiblingSurchargeItems
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Check if the given item has siblings that are surcharge items
				 * @param {Object} item whose siblings are to be checked
				 * @returns {Boolean} result of check
				 */
				service.hasSiblingSurchargeItems = function hasSiblingSurchargeItems(item) {

					if (angular.isUndefined(item) || item === null) {
						return false;
					}

					// First determine the parent item
					var parentItem = localData.getParentBoqItem(item);

					if (angular.isUndefined(parentItem) || parentItem === null) {
						return false;
					}

					var siblingSurchargeItem = _.find(parentItem.BoqItems, function (siblingItem) {
						return boqMainCommonService.isSurchargeItem(siblingItem);
					});

					return (angular.isDefined(siblingSurchargeItem) && siblingSurchargeItem !== null);
				};

				service.clear = function clear() {
					localData.reset();
					service.selectedBoqHeaderChanged.fire();  // enforce subscriber to update grid
				};

				/**
				 * @ngdoc function
				 * @name getCellEditable
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Check if the given field in the currentItem should be editable
				 * @param {Object} currItem whose field is to be checked
				 * @param {String} field that is checked
				 * @returns {Boolean} result of check
				 */
				service.getCellEditable = function getCellEditable(currItem, field) {

					// Various fields have to be set readonly according to the state of the current item
					return boqMainReadonlyProcessor.isFieldEditable(currItem, field, service);
				};

				/**
				 * @ngdoc function
				 * @name updateReadonlyStatus
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Update the readonly status of the given boqItem
				 * @param {Object} boqItem whose readonly status has to be maintained
				 */
				service.updateReadonlyStatus = function updateReadonlyStatus(boqItem) {
					boqMainReadonlyProcessor.processItem(boqItem, localData);
				};

				/**
				 * @ngdoc function
				 * @name setCallingContext
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Set the context that's given when the service is called or loaded
				 * @param {Object} callingContext given by external call of service
				 * @returns {}
				 */
				service.setCallingContext = function setCallingContext(callingContext) {
					localData.callingContext = callingContext;
				};

				/**
				 * @ngdoc function
				 * @name getCallingContext
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Get the context that's given when the service is called or loaded
				 * @returns {Object} callingContext given by external call of service
				 */
				service.getCallingContext = function getCallingContext() {
					return localData.callingContext;
				};

				/**
				 * @ngdoc function
				 * @name getCallingContextType
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Get the type of context that's given when the service is called or loaded
				 * @returns {String} tpye of the callingContext given by external call of service
				 */
				service.getCallingContextType = function getCallingContextType() {
					var callingContextForFilter = localData.getCallingContextForFilter(localData.callingContext);

					return _.isString(callingContextForFilter.callingContextType) ? callingContextForFilter.callingContextType : '';
				};

				$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
					if (toState.name !== fromState.name) {
						service.requestReadOnlyState.fire(service.getCallingContext()); // Request calling contexts to set the readOnly state of this service instance properly.
					}
				});

				// type:BoqItem, WicBoqItem
				service.setBoq = function setBoq(item, triggerField) {
					// todo, sai, how  enter in the first way
					var resultPromise = $q.when(false);
					if (triggerField === 'BoqItemFk' && Object.prototype.hasOwnProperty.call(item, 'BoqHeaderFk')) {
						resultPromise = service.setSelectedHeaderFk(_.get(item, 'BoqHeaderFk'), true, false, false, false, item); // Composite object serves as calling context
						selectedBoqId = _.get(item, 'BoqItemFk');

					} if (triggerField === 'Ids' && typeof item.Ids === 'string'){
						const ids = item.Ids.split(',').map(e => parseInt(e));
						item = { BoqHeaderFk: ids[0], PrjProjectFk: item.projectContextId};
						resultPromise = service.setSelectedHeaderFk(item.BoqHeaderFk, true, false, false, false, item);
						if (item.PrjProjectFk > 0) {
							service.setSelectedProjectId(item.PrjProjectFk);
						}
					} else {

						var boqHeaderFk = item.BoqHeaderFk;
						if (triggerField.NavigatorFrom === 'WicBoqItemNavigator') {
							boqHeaderFk = item.WicBoqHeaderFk;
						}
						if (item && (triggerField.NavigatorFrom === 'BoqItemNavigator' || triggerField.NavigatorFrom === 'EstBoqItemNavigator')) {
							boqHeaderFk = item.BoqHeaderFk;
						}

						if (item.BoqRootItem && item.BoqRootItem.BoqHeaderFk > 0) {
							resultPromise = service.setSelectedHeaderFk(item.BoqRootItem.BoqHeaderFk, true, false, false, false, item); // Composite object serves as calling context
						} else if (boqHeaderFk > 0) {
							resultPromise = service.setSelectedHeaderFk(boqHeaderFk, true, false, false, false, item); // Composite object serves as calling context
							selectedBoqId = _.get(item, 'BoqItemFk');
						}

						if (item.ProjectFk > 0) {
							service.setSelectedProjectId(item.ProjectFk);
						} else if (angular.isDefined(item.Boq) && item.Boq !== null && angular.isDefined(item.Boq.PrjProjectFk) && item.Boq.PrjProjectFk !== null) {
							// When being called from the project boq list we can determine the project id here and set it to the service.
							service.setSelectedProjectId(item.Boq.PrjProjectFk);
						}

						if (_.isObject(item.BoqHeader)) {
							localData.setIsGCBoq(_.isBoolean(item.BoqHeader.IsGCBoq) && item.BoqHeader.IsGCBoq);
						}
					}

					return resultPromise;
				};

				service.checkIsWicTypeFramework = function checkIsWicTypeFramework(item)
				{
					var wicTypes = basicsLookupdataLookupDescriptorService.getData('WicType');

					let foundWicType = _.find(wicTypes,{Id: item.WicBoq.MdcWicTypeFk});

					if(_.isObject(foundWicType)) {
						return foundWicType.IsFramework;
					}

					return false;
				};

				localData.getStructure = function getStructure() {
					return boqStructureService.getStructure();
				};

				/**
				 * @ngdoc function
				 * @name getStructure (AngularMigration => BoqItemDataService.getCurrentBoqStructure)
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Returns the currently loaded boq structure information
				 * @returns {Object} currently loaded boq structure
				 */
				service.getStructure = function getStructure() {
					return localData.getStructure();
				};

				service.updateItemList = function updateItemList() {
					localData.itemList.length = 0;
					localData.flatten(localData.itemTree, localData.itemList, localData.treePresOpt.childProp);
				};

				if (!option.parent) {

					// In case we have no parent service set we have the role of a root service and only in this case
					// we have the functionality set to handle and display header information, i.e. information about the selected
					// item in the module header area.

					if (angular.isUndefined(option.doUpdateHeaderInfo) || option.doUpdateHeaderInfo === null || option.doUpdateHeaderInfo) {

						localData.updateHeaderInfo = function updateHeaderInfo(entity, data) { // jshint ignore:line

							// In case of the service being called by external modul context (i.e. boq being called from within the context of a selected project)
							// we have to do some special handling to show this external context together with the currently selected boq item information.
							if (angular.isObject(service.getCallingContext()) && !_.isEmpty(service.getCallingContext())) {
								// First get the text of the calling context
								localData.getCallingContextText().then(function (headerObject) {
									// Now we get the root item and use its code and description field
									var rootItem = service.getRootBoqItem();
									if (angular.isObject(rootItem)) {
										headerObject.module = {
											description: rootItem.Reference + ' - ' + rootItem.BriefInfo.Translated || rootItem.BriefInfo.Description,
											moduleName: service.getModuleName(),
											id: rootItem.BoqHeaderFk
										};
									}

									// Then we determine the selected item and add its codefield
									var selectedItem = service.getSelected();

									if(service.isSelection(selectedItem)) {
										headerObject.lineItem = {
											description: selectedItem.Reference
										};
									}

									cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameBoqMain', headerObject);
								});
							} else if (!_.isEmpty(entity) && _.isObject(entity)) {
								// In case we have no calling context we simply call the standard impelemtation
								localData.originalShowHeaderAfterSelectionChanged(entity, data);
							}
						};

						// Adjust header info when list was loaded
						service.registerListLoaded(function () {
							localData.updateHeaderInfo(service.getSelected(), localData);
							$timeout(function () {
								if (_.isNumber(selectedBoqId)) {
									var item = service.getItemById(selectedBoqId);
									if (item) {
										service.setSelected(item);
									}
									selectedBoqId = null;
								}
							});
						});

						// Only if there is a calling header info we currently replace the built-in handler for showing the header information.
						// So we have to save the original callback in a separate variable.
						localData.originalShowHeaderAfterSelectionChanged = localData.showHeaderAfterSelectionChanged;
						service.setShowHeaderAfterSelectionChanged(function (entity, data) {
							localData.updateHeaderInfo(entity, data);
						});
					} else {
						// When not being a root service or if updating the header info is supressed we skip updating the header information
						service.setShowHeaderAfterSelectionChanged(null);
					}
				}

				/**
				 * @functoin  executeSearchFilter
				 * this method handles the executeFilter event, fired while navigation from project favorites
				 * @param e
				 * @param filterParam
				 * rei@25.8.2015
				 */
				service.executeSearchFilter = function (e, filterParam) {
					console.log('executeSearchFilter called', e, filterParam);
					var isBoqHeaderStatusReadOnlyPromise = $q.when(false);
					var isProjectLoadedPromise = $q.when(true);

					// first key contains item key to be opened
					if (filterParam && filterParam.PKeys[0]) {
						// if projectContext changed, reload master data filter data
						if (localData.selectedProjectId !== filterParam.ProjectContextId) {
							estimateProjectRateBookConfigDataService.clearData();
							estimateProjectRateBookConfigDataService.initData(filterParam.ProjectContextId);

							// Make sure the fitting project boq list is loaded to support proper validation of boq number (i.e. reference number of boq root item)
							let boqProjectService = $injector.get('boqProjectService');
							if(_.isObject(boqProjectService)) {
								boqProjectService.setFilter('projectId=' + filterParam.ProjectContextId);
								isProjectLoadedPromise = boqProjectService.load();
							}
						}

						// Hint: also add a calling context object as last parameter.
						service.setSelectedHeaderFk(filterParam.PKeys[0], true, false, false, false, {
							Boq: {
								PrjProjectFk: filterParam.ProjectContextId,
								BoqHeaderFk: filterParam.PKeys[0]
							}
						});
						service.setSelectedProjectId(filterParam.ProjectContextId);

						isProjectLoadedPromise.then(function () {
							if (filterParam.ProjectContextId) {

								isBoqHeaderStatusReadOnlyPromise = $http.get(globals.webApiBaseUrl + 'boq/main/header/isreadonly?boqHeaderId=' + filterParam.PKeys[0]).then(function (result) {
									// In this case we assume an project boq to be opened.
									// Make sure it is opened in fitting mode.
									var isBoqHaderStausReadOnly = result.data;
									service.setReadOnly(isBoqHaderStausReadOnly);
								});
							}

							isBoqHeaderStatusReadOnlyPromise.then(function () {
								cloudDesktopSidebarService.updateFilterResult({  // confirm loading done...
									isPending: false, filterRequest: filterParam, filterResult: null
								});
							});
						});
					}
				};

				/**
				 * @ngdoc function
				 * @name getSurchargeTotal
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Calculate final price and surcharge item total price
				 * @param {Object} sItem surcharge item whose total is to be calculated
				 * @returns {Number} calculated surcharge total
				 */
				service.getSurchargeTotal = function getSurchargeTotal(sItem) {
					var list = localData.itemList,
						total = 0,
						id = sItem.BoqSurcharedItemFk ? sItem.BoqSurcharedItemFk : sItem.Id;
					if (!list) {
						list = service.getList();
					}

					var boqItem = _.find(list, {Id: id, BoqHeaderFk: sItem.BoqHeaderFk});// check if BoqSurcharedItemFk thr or not then sItem.Id
					if (boqItem) {
						localData.calcFinalPriceHoursNew(boqItem);
						total = boqItem.Finalprice * sItem.QuantitySplit / boqItem.Quantity;
					}
					return total > 0 ? total : 0;
				};

				/**
				 * @ngdoc function
				 * @name getSiblingBaseBoqItemsOfSelectedItem
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the siblings of the base boq item that is related to the given selected version boq item
				 * @param {Object} selectedItem
				 * @returns {Object} : a promise that will be resolved holding the above mentioned base boq siblings
				 */
				service.getSiblingBaseBoqItemsOfSelectedItem = function getSiblingBaseBoqItemsOfSelectedItem(selectedItem) {

					if (service.hasItemBeenSavedYet(selectedItem)) {
						return $q.when(null); // We don't do the lookup if the item has been saved yet.
					}

					return localData.baseBoqMainService.getBaseBoqItems(selectedItem, localData.baseBoqMainService.getIndicator.SIBLING, true);
				};

				/**
				 * @ngdoc function
				 * @name getBaseBoqItemByReferenceNumber
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the base boq item given by the headerId and the reference number
				 * @param {Object} boqItem: version boq item whose foreign key BoqItemPrjBoqFk leads the way to the looked up base boq
				 * @param {String} referenceNumber: that serves as criteria to look up the corresponding base boq item
				 * @returns {Object} : a promise that will be resolved, finally holding the found base boq item
				 */
				service.getBaseBoqItemByReferenceNumber = function getBaseBoqItemByReferenceNumber(boqItem, referenceNumber) {

					var resultPromise = $q.when(null);

					if (angular.isUndefined(boqItem) || boqItem === null || _.isEmpty(referenceNumber)) {
						return $q.when(null);
					}

					// Show wait overlay to suppress use interaction until the link is done.
					service.startActionEvent.fire();

					if (boqItem.BoqItemPrjBoqFk > 0) {
						// We have a base boq link -> try to locate a corresponding base boq item with the created reference number
						resultPromise = localData.baseBoqMainService.getBaseBoqItemByReferenceNumber(boqItem.BoqItemPrjBoqFk, referenceNumber).then(function (response) {
							var foundBaseBoqItem = (angular.isDefined(response) && (response !== null)) ? response.data : null;

							// Hide wait overlay
							service.endActionEvent.fire();

							return foundBaseBoqItem;
						},
						function () {
							service.endActionEvent.fire();

							return null;
						});
					} else {
						service.endActionEvent.fire();
					}

					return resultPromise;
				};

				/**
				 * @ngdoc function
				 * @name setBaseBoqLinkViaReferenceNumber
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Set the base boq link as proper foreign key value based on the given reference number
				 * @param {Object} boqItem: version boq item that't to be linked to a base boq item
				 * @param {String} referenceNumber: that serves as criteria to look up the corresponding base boq item
				 * @returns {Object} : a promise object that returns a Boolean when being resolved indicating if setting the link was successful
				 */
				service.setBaseBoqLinkViaReferenceNumber = function setBaseBoqLinkViaReferenceNumber(boqItem, referenceNumber) {

					var resultPromise = $q.when(false);
					var syncBaseBoqQuantity = (!!option && !!option.syncBaseBoqOptions && !!option.syncBaseBoqOptions.syncQuantity) || !option || !option.syncBaseBoqOptions ? true : false;

					if (angular.isUndefined(boqItem) || boqItem === null || _.isEmpty(referenceNumber)) {
						return $q.when(false);
					}

					// Show wait overlay to suppress use interaction until the link is done.
					service.startActionEvent.fire();

					let additionalInfo = {};
					let useWicToSyncVersionBoq = false;
					let wicBoqHeaderFkPromise = $q.when(null);
					if(_.isFunction(service.getFrameworkBoqHeaderFk)) {
						wicBoqHeaderFkPromise = service.getFrameworkBoqHeaderFk(additionalInfo); // additionalInfo returns proper value of useWicToSyncVersionBoq
						useWicToSyncVersionBoq = additionalInfo.useWicToSyncVersionBoq;
					}

					resultPromise = wicBoqHeaderFkPromise.then(function(wicBoqHeaderFk) {
						if (boqItem.BoqItemPrjBoqFk) {

							// We have a base boq link -> try to locate a corresponding base boq item with the created reference number
							let baseBoqPromise = localData.baseBoqMainService.getBaseBoqItemByReferenceNumber(boqItem.BoqItemPrjBoqFk, referenceNumber);
							let wicBoqPromise = useWicToSyncVersionBoq ? localData.baseBoqMainService.getBaseBoqItemByReferenceNumber(wicBoqHeaderFk, referenceNumber) : $q.when(null);
							$q.all([baseBoqPromise, wicBoqPromise]).then(function (response) {
								let foundBaseBoqItem = (angular.isDefined(response) && (response !== null) && _.isArray(response) && response.length > 0) ? response[0].data : null;
								if (angular.isDefined(foundBaseBoqItem) && foundBaseBoqItem !== null) {
									// Set the link of the boqItem to the found base boq item via it's BoqItemPrjItemFk property
									boqItem.BoqItemPrjItemFk = foundBaseBoqItem.Id;

									// Sync version boq item with base boq item
									if(!useWicToSyncVersionBoq) {
										boqMainCommonService.syncBoqItem(foundBaseBoqItem, boqItem, syncBaseBoqQuantity, syncBaseBoqQuantity && service.isItemWithIT(boqItem));

										// copy cost group assignments
										if (service.costGroupService && foundBaseBoqItem.CostGroupAssignments) {
											_.forEach(foundBaseBoqItem.CostGroupAssignments, function (costGroupAssignment) {
												var costGroupCol = {
													'field': 'costgroup_' + costGroupAssignment.CostGroupCatFk,
													'costGroupCatId': costGroupAssignment.CostGroupCatFk
												};

												boqItem['costgroup_' + costGroupAssignment.CostGroupCatFk] = costGroupAssignment.CostGroupFk;
												service.costGroupService.createCostGroup2Save(boqItem, costGroupCol);
											});
										}
									}
								} else {
									// There's no corresponding base boq item found, so we set the BoqItemPrjItemFk (BoqItemWicItemFk) to null to force an update of the base boq based on the new created item.
									boqItem.BoqItemPrjItemFk = null;

									// Reset the property values of the boq back to default values
									boqMainCommonService.syncBoqItem(localData.defaultBoqItem, boqItem, syncBaseBoqQuantity, syncBaseBoqQuantity && service.isItemWithIT(boqItem));
								}

								if(useWicToSyncVersionBoq && _.isNumber(wicBoqHeaderFk)) {
									let foundWicBoqItem = (angular.isDefined(response) && (response !== null) && _.isArray(response) && response.length > 1) ? response[1].data : null;
									if (angular.isDefined(foundWicBoqItem) && foundWicBoqItem !== null) {
										// Sync version boq item with base boq item
										boqMainCommonService.syncBoqItem(foundWicBoqItem, boqItem, syncBaseBoqQuantity, syncBaseBoqQuantity && service.isItemWithIT(boqItem));

										// Set the link of the boqItem to the found wic boq item via it's BoqItemWicItemFk property
										boqItem.BoqItemWicBoqFk = wicBoqHeaderFk;
										boqItem.BoqItemWicItemFk = foundWicBoqItem.Id;

									} else {
										// Reset the property values of the boq back to default values
										boqMainCommonService.syncBoqItem(localData.defaultBoqItem, boqItem, syncBaseBoqQuantity, syncBaseBoqQuantity && service.isItemWithIT(boqItem));

										// There's no corresponding wic boq item found, so we set the BoqItemWicBoqFk/BoqItemWicItemFk to null.
										boqItem.BoqItemWicBoqFk = null;
										boqItem.BoqItemWicItemFk = null;
									}
								}

								service.markItemAsModified(boqItem);
								service.fireItemModified(boqItem);

								// Hide wait overlay
								service.endActionEvent.fire();

								return true;
							},
							function () {

								service.endActionEvent.fire();

								return false;
							});
						} else {
							service.endActionEvent.fire();
						}
					});

					return resultPromise;
				};

				/**
				 * @ngdoc function
				 * @name getDecoupledVersionBoqItems
				 * @function
				 * @description Determine and return decoupled version boq items, i.e. boqItems having a valid BoqItemPrjBoqFk set without a corresponding valid BoqItemPrjItemFk
				 * @returns {array} of decoupled version boq items
				 */
				service.getDecoupledVersionBoqItems = function getDecoupledVersionBoqItems(rootBoqItem) {
					if(!_.isObject(rootBoqItem) || !rootBoqItem.BoqItemPrjBoqFk) {
						return null;
					}

					// Get a flat list of all boqItems attached to boqRootItem
					let flatBoqItemList = [];
					localData.flatten([rootBoqItem], flatBoqItemList, localData.treePresOpt.childProp);

					return _.filter(flatBoqItemList, function (boqItem) {
						return _.isNumber(boqItem.BoqItemPrjBoqFk) && !_.isNumber(boqItem.BoqItemPrjItemFk);
					});
				};

				/**
				 * @ngdoc function
				 * @name isFreeBoq
				 * @function
				 * @description Check if the document property settings allow the loaded boq to be free
				 * @returns {Boolean}
				 */
				service.isFreeBoq = function isFreeBoq() {
					return boqMainCommonService.isFreeBoqType(boqStructureService.getStructure());
				};

				/**
				 * @ngdoc function
				 * @name isGaebBoq
				 * @function
				 * @description Check if the given BOQ is compliant to the GAEB standard
				 * @returns {Boolean}
				 */
				service.isGaebBoq = function isGaebBoq() {
					return boqMainCommonService.isGaebBoqType(boqStructureService.getStructure());
				};

				/**
				 * @ngdoc function
				 * @name isCrbBoq
				 * @function
				 * @description Check if the current BOQ is compliant to the swiss CRB standard
				 * @returns {Boolean}
				 */
				service.isCrbBoq = function isCrbBoq() {
					return boqMainCommonService.isCrbBoqType(boqStructureService.getStructure());
				};

				// Checks if the current BOQ is compliant to the Austrian OENORM
				service.isOenBoq = function isOenBoq() {
					return boqMainCommonService.isOenBoqType(boqStructureService.getStructure());
				};

				/**
				 * @ngdoc function
				 * @name isWicBoq
				 * @function
				 * @description Check if the current BOQ belongs to a WIC
				 * @returns {Boolean}
				 */
				service.isWicBoq = function isWicBoq() {
					return _.isObject(service.getRootBoqItem()) && service.getRootBoqItem().IsWicItem;
				};

				/**
				 * @ngdoc function
				 * @name isCrbNpk
				 * @function
				 * @description Check if the given BOQ is compliant to a NPK of the swiss CRB standard
				 * @returns {Boolean}
				 */
				service.isCrbNpk = function isCrbNpk() {
					return service.isCrbBoq() && service.isWicBoq();
				};

				/**
				 * @ngdoc function
				 * @name processBoqItem
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description call the registered processors for the given boqItem
				 * @param {Object} boqItem to be processed
				 * @returns
				 */
				service.processBoqItem = function processBoqItem(boqItem) {
					var processItemVisitor = {
						visitBoqItemFn: function processBoqItem(parentItem, boqItem/* , lineType, level, visitorObject */) {

							platformDataServiceDataProcessorExtension.doProcessItem(boqItem, localData);

							return true;
						}
					};

					localData.visitBoqItemsRecursively(null, boqItem, service.getBoqItemLevel(boqItem), processItemVisitor);
				};

				/**
				 * @ngdoc function
				 * @name findFittingItem
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Find the fitting item according to the given selected item. If neccessary recursively climb up the
				 * parent hierarchy to find it.
				 * @param {Object} selectedItem : item that's currently selected
				 * @param {Number} lineType : line type of the item that's to be searched
				 * @param {Object} searchConfig : configuration object setting special search criteria
				 * @param {Boolean} doResortChildren : triggers resorting of sibling item array before searching
				 * @returns {Object} returning the hopefully found fitting item
				 */
				service.findFittingItem = function findFittingItem(selectedItem, lineType, searchConfig, doResortChildren) {
					var parentFolder = localData.getParentBoqItem(selectedItem);
					var siblings;
					var fittingItem = null;
					var filteredSiblings = null;
					var defaultSearchConfig = {
						searchPreviousOnly: false,    // according to the selected item only the previous items are searched not the following ones
						searchSameLevelOnly: false,   // limit the search to the level given by the selected item
						includeSelectedItem: true     // also look for fitting item by investigating the selectedItem
					};

					// Check if there is a searchConfig given...
					if (angular.isUndefined(searchConfig) || (searchConfig === null)) {
						// ...if not, use the defaultSearchConfig
						searchConfig = defaultSearchConfig;
					}

					// We search the sibling items
					siblings = (parentFolder !== null) ? parentFolder.BoqItems : null;

					// For safety reasons resort the children array
					if (_.isBoolean(doResortChildren) && doResortChildren) {
						service.resortChildren(parentFolder, false); // Doing this may be safe but is not always necessary, therefore it's triggered by a flag
					}

					if (selectedItem !== null) {

						if (searchConfig.includeSelectedItem && ((boqMainCommonService.isDivisionType(lineType) && boqMainCommonService.isDivision(selectedItem)) || selectedItem.BoqLineTypeFk === lineType)) {
							fittingItem = selectedItem;
						} else {
							// First filter all siblings and also add the selectedItem to the result set.
							filteredSiblings = _.filter(siblings, function (sibling) {
								return ((sibling === selectedItem) || (sibling.BoqLineTypeFk === lineType));
							});

							// Find the index of the selected item
							var selectedItemIndex = filteredSiblings.indexOf(selectedItem);
							if (selectedItemIndex !== -1) {
								// First look for the fitting item before the selected item
								fittingItem = (selectedItemIndex - 1) >= 0 ? filteredSiblings[selectedItemIndex - 1] : null;
								if ((fittingItem === null) && !searchConfig.searchPreviousOnly) {
									// Now try to find it afterwards
									fittingItem = (selectedItemIndex + 1) <= filteredSiblings.length - 1 ? filteredSiblings[selectedItemIndex + 1] : null;
								}
							}
						}

						if ((fittingItem === null) && !searchConfig.searchSameLevelOnly) {
							// No fitting item could be found on this hierarchy level.
							// Climb up to the parent level and look there...
							fittingItem = service.findFittingItem(parentFolder, lineType, searchConfig, doResortChildren);
						}
					}

					return fittingItem;
				};

				/**
				 * @ngdoc function
				 * @name setSelectedProjectId
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Set the project id for the context in which the boq is currently loaded
				 * @param {Number} selectedProjectId : to be set
				 */
				service.setSelectedProjectId = function setSelectedProjectId(selectedProjectId) {
					localData.selectedProjectId = selectedProjectId;

					// To support possibly needed access to related project entity preload it in the current call.
					if(_.isNumber(selectedProjectId) && selectedProjectId > 0) {
						basicsLookupdataLookupDescriptorService.loadItemByKey('Project',selectedProjectId);
					}
				};

				/**
				 * @ngdoc function
				 * @name getSelectedProjectId
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Get the project id for the context in which the boq is currently loaded
				 * @returns {Number} : returns the currently selected project id
				 */
				service.getSelectedProjectId = function getSelectedProjectId() {
					return localData.selectedProjectId;
				};

				service.getSplitQuantityService = function () {
					return splitQuantityServiceFactory.getService(this, this.getModuleName());
				};

				service.addBoqCharacterContentItems = function (items) {
					localData.addBoqCharacterContentItems(items);
				};

				/**
				 * @ngdoc function
				 * @name setCurrentExchangeRate
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Set the currenty exchange rate
				 * @param {Number} exchangeRate: to be set
				 */
				service.setCurrentExchangeRate = function setCurrentExchangeRate(currentExchangeRate) {
					localData.currentExchangeRate = currentExchangeRate;
				};

				/**
				 * @ngdoc function
				 * @name getCurrentExchangeRate
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Get the currenty exchange rate
				 * @returns  {Number} currently set exchange rate
				 */
				service.getCurrentExchangeRate = function getCurrentExchangeRate() {
					return localData.currentExchangeRate;
				};

				/**
				 * @ngdoc function
				 * @name setIsGCBoq
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Set flag indicating if loaded boq is a GC boq
				 * @param {Boolean} isGCBoq: to be set
				 */
				localData.setIsGCBoq = function setIsGCBoq(isGCBoq) {
					localData.isGCBoq = isGCBoq;
				};

				/**
				 * @ngdoc function
				 * @name getIsGCBoq
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Get flag indicating if loaded boq is a GC boq
				 * @returns  {Boolean} indicating if loaded boq is a GC boq
				 */
				service.getIsGCBoq = function getIsGCBoq() {
					return localData.isGCBoq;
				};

				/**
				 * @ngdoc function
				 * @name getBoqItemLevel
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the hierarchical level of the given boqItem
				 * @param {Object} boqItem: whose level is to be determined
				 * @returns  {Number} level of given boq item
				 */
				service.getBoqItemLevel = function getBoqItemLevel(boqItem) {
					return localData.getLevelOfBoqItem(boqItem);
				};

				service.setInitReadData = function (pattern) {
					boqServiceOption.hierarchicalRootItem.httpRead.initReadData = function (readData) {
						if (pattern) {
							readData.Pattern = pattern;
						}
					};
				};

				service.removeInitReadData = function () {
					boqServiceOption.hierarchicalRootItem.httpRead.initReadData = {};
				};

				/**
				 * @ngdoc function
				 * @name patchPermissionObjectInfo
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Patch the permissionObjectInfo of the given boqItem and its children to permissionObjectInfo
				 * @param {Object} boqItem: whose PermissionObjectInfo is to be patched
				 * @param {String} permissionObjetInfo: that should be patched to the given boqItem and its possible children
				 * @returns  {Boolean} telling if patching worked
				 */
				service.patchPermissionObjectInfo = function patchPermissionObjectInfo(boqItem, permissionObjectInfo) {

					var patchPermissionObjectInfoVisitor = {
						visitBoqItemFn: function patchPermissionObjectInfo(parentItem, boqItem/* , lineType, level, visitorObject */) {

							if (_.isEmpty(permissionObjectInfo)) {
								return false;
							}

							if (_.isEmpty(boqItem.PermissionObjectInfo) && !_.isEmpty(permissionObjectInfo)) {
								boqItem.PermissionObjectInfo = permissionObjectInfo;
							}

							return true;
						}
					};

					localData.visitBoqItemsRecursively(null, boqItem, service.getBoqItemLevel(boqItem), patchPermissionObjectInfoVisitor);
				};

				/**
				 * @ngdoc function
				 * @name getModuleName
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the module name of the module the instance of this service is used in
				 * @returns  {String} module name of the module the instance of this service is used in
				 */
				service.getModuleName = function getModuleName() {
					return !!option && !!option.moduleContext && _.isString(option.moduleContext.moduleName) ? option.moduleContext.moduleName : '';
				};

				/**
				 * @ngdoc function
				 * @name registerLookupFilters
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Register the above given lookup filters
				 */
				service.registerLookupFilters = function registerLookupFiltersForBoqMainSerivce() {

					// Add filter for lookups
					// ******************************************************************************************
					// * !! HINT: Also maintain lookupFilters array in below unregisterLookupFilters function !!*
					// ******************************************************************************************
					var lookupFilters = [
						{
							key: 'prc.con.controllingunit.by.prj.filterkey',
							serverSide: true,
							fn: function () {
								return {
									ByStructure: true,
									ExtraFilter: false,
									PrjProjectFk: service.getSelectedProjectId(),
									CompanyFk: $injector.get('platformContextService').getContext().clientId,
								};
							}
						},
						{
							key: 'boq-main-division-type-filter',
							serverSide: false,
							fn: function (/* item */) {
								// Determine if the given division type (item) is already in use.
								// If so remove it from the list.
								return true; // Todo: Do the filtering
							}
						},
						{
							key: 'boq-main-controlling-unit-filter',
							serverSide: true,
							serverKey: 'prc.con.controllingunit.by.prj.filterkey',
							fn: function () {
								var moduleName = service.getModuleName();
								var extraFilter = false;
								if (moduleName === 'procurement.pes' || moduleName === 'procurement.invoice') {
									extraFilter = true;
								}
								return {
									ByStructure: true,
									ExtraFilter: extraFilter,
									PrjProjectFk: service.getSelectedProjectId(),
									CompanyFk: null
								};
							}
						},
						{
							key: 'boq-item-flag-filter',
							serverSide: false,
							fn: function (item) {
								return item.IsLive === true;
							}
						},
						{
							key: 'bas-item-type-filter',
							serverSide: false,
							fn: function(itemType) {
								const oenItemTypes = [boqMainItemTypes.standard,boqMainItemTypes.optionalWithoutIT];
								var ret = !service.isOenBoq() || oenItemTypes.includes(itemType.Id);
								return ret;
							}
						},
						{
							key: 'bas-item-type2-filter',
							serverSide: false,
							fn: function(itemType2) {
								const crbExclusiveItemTypes = [boqMainItemTypes2.crbPrimaryVariant,boqMainItemTypes2.crbEventualVariant];
								const oenItemTypes          = [boqMainItemTypes2.normal,boqMainItemTypes2.base,boqMainItemTypes2.alternative];
								var ret;
								if      (service.isOenBoq()) { ret =  oenItemTypes.         includes(itemType2.Id); }
								else if (service.isCrbBoq()) { ret =  crbExclusiveItemTypes.includes(itemType2.Id); }
								else                         { ret = !crbExclusiveItemTypes.includes(itemType2.Id); }
								return ret;
							}
						},
						{
							key: 'boq-ref-item-filter',
							serverSide: false,
							fn: function (item) {
								var showItem = false;
								var selectedItem = service.getSelected();
								var itemList = service.getList();
								if ((!boqMainCommonService.isTextElementWithoutReference(item) || boqMainCommonService.isDesignDescription(item))) {

									// Find out if the item is before or after the currently selected item
									if (selectedItem && _.findIndex(itemList, {Id: item.Id}) < _.findIndex(itemList, {Id: selectedItem.Id})) {
										showItem = true;
									}
								}

								return showItem;
							}
						},
						{
							key: 'boq-line-type-filter',
							serverSide: false,
							fn: function (item) {
								var result = true;
								var isRootDivisionOrPos = boqMainCommonService.isRootType(item.Id) || boqMainCommonService.isDivisionType(item.Id) || boqMainCommonService.isPositionType(item.Id);
								var selectedBoqItem = service.getSelected();
								var previousNextContainer = {};
								result = item.Islive === true || isRootDivisionOrPos; // Only display those line types being marked as Islive and always display division and position line types.

								if (result && boqMainCommonService.isTextElementType(item.Id) && selectedBoqItem && boqMainCommonService.isDivision(selectedBoqItem) && service.getBoqItemLevel(selectedBoqItem) === 1) {
									// Do a specific check for divisions on first level.
									// A change to a text element is only allowed under certain conditions.
									localData.getPreviousAndNextItem(selectedBoqItem, previousNextContainer, false, false);

									if (previousNextContainer.previousItem === null || boqMainCommonService.isTextElement(previousNextContainer.previousItem) ||
										previousNextContainer.nextItem === null || boqMainCommonService.isTextElement(previousNextContainer.nextItem)) {
										result = true;
									} else {
										result = false;
									}

								}
								return result;
							}
						},
						{
							key: 'boqSaleTaxCodeByLedgerContext-filter',
							serverSide: false,
							fn: function (item) {
								var loginCompanyFk = $injector.get('platformContextService').getContext().clientId;
								var ContextFk;
								if (loginCompanyFk) {
									var companies = basicsLookupdataLookupDescriptorService.getData('Company');
									let company = _.find(companies, {Id: loginCompanyFk});
									if (company) {
										ContextFk = company.ContextFk;
									}
								}
								return (item.LedgerContextFk === ContextFk) && item.IsLive;
							}
						},
						{
							key: 'boq-main-project-change-common-filter',
							serverSide: true,
							serverKey: $injector.get('boqMainProjectChangeService').getServerSideFilterKeyForProjectChanges(service),
							fn: function() {
								return {
									ProjectFk: service.getSelectedProjectId()
								};
							}
						}
					];

					// First unregister previous filter definitions to avoid them holding wrong currentBoqMainService.
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilters);

					lookupFilters.forEach(function (filter) {
						if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
							basicsLookupdataLookupFilterService.registerFilter(filter);
						}
					});
				};

				/**
				 * @ngdoc function
				 * @name unregisterLookupFilters
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Unregister the above given lookup filters
				 */
				service.unregisterLookupFilters = function unregisterLookupFilters() {

					var lookupFilters = [
						{key: 'boq-main-division-type-filter'},
						{key: 'boq-main-controlling-unit-filter'},
						{key: 'boq-item-flag-filter'},
						{key: 'bas-item-type-filter'},
						{key: 'bas-item-type2-filter'},
						{key: 'boq-ref-item-filter'}
					];
					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilters);
				};

				/**
				 * @ngdoc function
				 * @name reactOnChangeOfItem
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Hook to corresponding function in boqMainChangeService
				 * @param {Object} boqItem: that has been changed
				 * @param {String} propertyName: of the property that has been changed
				 */
				service.reactOnChangeOfItem = function reactOnChangeOfItem(boqItem, propertyName, isFromBulkEditor) {
					var boqMainChangeService = $injector.get('boqMainChangeService');
					boqMainChangeService.reactOnChangeOfBoqItem(boqItem, propertyName, service, boqMainCommonService, false, isFromBulkEditor);
				};

				service.onlySetSelectedHeaderFk = function onlySetSelectedHeaderFk(headerFk) {
					if (localData.selectedBoqHeader !== headerFk) {

						// Reset state of service to initial values to avoid having an intermediate state when loading the new boq
						localData.reset();

						localData.selectedBoqHeader = headerFk;
					}
				};

				function getTaxCode(taxCodeFk) {
					var taxCodeMatrix = basicsLookupdataLookupDescriptorService.getData('TaxCodeMatrix');
					var parentService = service.parentService();
					var taxCode = null;
					var vatGroupFk = null;
					if (parentService) {
						if (taxCodeMatrix) {
							vatGroupFk = service.getVatGroupFk();

							taxCode = _.find(taxCodeMatrix, function (item) {
								return item.VatGroupFk === vatGroupFk && item.TaxCodeFk === taxCodeFk;
							});
						}
					}

					if (!taxCode) {
						var taxCodes = basicsLookupdataLookupDescriptorService.getData('TaxCode');
						taxCode = _.find(taxCodes, {Id: taxCodeFk});
					}

					return taxCode;
				}

				function getDefaultTaxCodeFk() {
					var defaultTaxCodeFk = null;
					var parentService = service.parentService();

					if (parentService) {
						var headerSelected = parentService.getSelected();
						if (headerSelected) {
							defaultTaxCodeFk = headerSelected.TaxCodeFk ? headerSelected.TaxCodeFk : headerSelected.MdcTaxCodeFk;
						}
					}

					return defaultTaxCodeFk;
				}

				function getValidTaxCodeFk(boqItem) {
					var validTaxCodeFk = boqItem ? boqItem.MdcTaxCodeFk : null;
					var parentItem = null;

					if (!boqItem) {
						return null;
					}

					if (!validTaxCodeFk) {
						// No valid tax code on item level
						// -> look in for valid tax code in parent items
						parentItem = localData.getParentBoqItem(boqItem);
						if (parentItem) {
							if (parentItem.MdcTaxCodeFk) {
								validTaxCodeFk = parentItem.MdcTaxCodeFk;
							} else {
								validTaxCodeFk = getValidTaxCodeFk(parentItem); // Walk the parent chain to get a valid taxCodeFk
							}
						}
					}

					if (!validTaxCodeFk && boqMainCommonService.isRoot(boqItem)) {
						// When reaching the root item and still haven't found a valid tax code fk we search the header entity for a valid tax code fk
						validTaxCodeFk = getDefaultTaxCodeFk();
					}

					return validTaxCodeFk;
				}

				/**
				 * @ngdoc function
				 * @name getVatPercentForBoqItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Determines the valid TaxCodeFk for the given boqItem and returns the related percentage for VAT
				 * @returns {number} returns the determined vat percentage
				 */
				service.getVatPercentForBoqItem = function getVatPercentForBoqItem(boqItem) {

					var vatPercent = 0;
					var taxCodeFk = null;
					var taxCode = null;

					if (!_.isObject(boqItem)) {
						return vatPercent;
					}

					taxCodeFk = getValidTaxCodeFk(boqItem);
					if (taxCodeFk) {
						taxCode = getTaxCode(taxCodeFk);
						vatPercent = taxCode ? taxCode.VatPercent : 0;
					}

					return vatPercent;
				};

				/**
				 * @ngdoc function
				 * @name getVatGroupFk
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Determine and return the vat group assignment
				 * @returns {number} returns foreign key of vat group assignment
				 */
				service.getVatGroupFk = function getVatGroupFk() {

					var vatGroupFk = null;
					var parentService = service.parentService();

					if (parentService) {
						if (_.isFunction(parentService.getVatGroupFk)) {
							vatGroupFk = parentService.getVatGroupFk();
						} else {
							var headerSelected = parentService.getSelected();
							if (headerSelected) {
								vatGroupFk = headerSelected.BpdVatGroupFk ? headerSelected.BpdVatGroupFk : headerSelected.VatGroupFk;
							}
						}
					}

					return vatGroupFk;
				};

				/**
				 * @ngdoc function
				 * @name
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description
				 * @returns {Object} returns object representing the current structure
				 */
				service.getBoqStructure = function getBoqStructure() {

					var boqStructure = boqStructureService.getStructure();
					return boqStructure;
				};

				// reminder always save parameters to
				service.setDetailsParamReminder = function setDetailsParamReminder(selectedLevel) {
					detailsParamAlwaysSave = selectedLevel;
				};

				// reminder always save details formula parameters to selected level
				service.getDetailsParamReminder = function getDetailsParamReminder() {
					return detailsParamAlwaysSave;
				};

				/**
				 * @ngdoc function
				 * @name initInstalledValues
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Initialize the given boqItem with the corresponding installed values
				 * @param {Object} boqItem : item whose corresponding installed values are to be initialized
				 */
				service.initInstalledValues = function initInstalledValues(boqItem) {
					service.calcDependantValues(boqItem);
				};

				/**
				 * @ngdoc function
				 * @name dispatchOnInstalledChildValues
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Dispatch the value of the given property of the parent items over the corresponding child installed values.
				 * If the children are positions determine the related installed quantities and calculate the dependant values
				 * @param {Object} boqItem : parent item whose corresponding whose ItemTotal or TotalPrice has been changed and in consequence the installed values of its
				 * child items have to be adjusted.
				 * @param {String} propertyName : indicating the property that has been changed on parent level
				 */
				service.dispatchOnInstalledChildValues = function dispatchOnInstalledChildValues(boqItem, propertyName) {
					var list = _.isObject(boqItem) && _.isArray(boqItem.BoqItems) ? boqItem.BoqItems : [];
					// var len = list ? list.length : 0;
					// var sum = 0;
					// var fraction = null;
					var newValue = _.isObject(boqItem) ? boqItem[propertyName] : 0;

					_.forEach(list, function (item) {
						item[propertyName] = newValue;
						service['calc' + propertyName](item, true);
						service.calcDependantValues(item, propertyName);
					});

					serviceContainer.service.markEntitiesAsModified(list);
				};

				/**
				 * @ngdoc function
				 * @name resetServiceCatalogNoForBoqItems
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Based on the current selection in the boq or for the whole boq reset the service catalog no fields
				 * @param {Array} selectedBoqItems: that have been selected in the boq tree
				 */
				service.resetServiceCatalogNoForBoqItems = function resetServiceCatalogNoForBoqItems(selectedBoqItems) {
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'boq/main/resetservicecatalogno',
						data: {
							BoqHeaderFk: localData.selectedBoqHeader,
							SelectedBoqItems: selectedBoqItems
						}
					}).then(
						function (response) {
							$log.log(response);

							if (response.data) {
								// fire event for refresh
								localData.loadBoqItems(0, 99, 0);
							}

							return response.data;
						},
						function (failure) {
							$log.log(failure);

							return false;
						}
					);
				};

				/**
				 * @ngdoc function
				 * @name getPrjChangeId
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Determine and return the corresponding project change Id coming from the main item entity
				 * @returns {Number} returns the determined project change Id
				 */
				/* TODO-ALM132705: To be used for the root BOQ item
				function getPrjChangeId() {
					const currentCallingContext = service.getCallingContext();
					var prjChangeId = null;

					if (currentCallingContext) {
						if (currentCallingContext.PrcRequisitionHeader) {
							prjChangeId = currentCallingContext.PrcRequisitionHeader.ProjectChangeFk;
						}
						else if (currentCallingContext.PrcContractHeader) {
							prjChangeId = currentCallingContext.PrcContractHeader.ProjectChangeFk;
						}
					}

					return prjChangeId;
				}
				*/

				/**
				 * @ngdoc function
				 * @name visitBoqItemRecursively
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description vist the given boqItem recursivly by applying the visitorFunction of the given visitorObject
				 * @param {Object} boqItem to be visited
				 * @param {Object} visitorObject holding the visitBoqItemFn be applied
				 */
				service.visitBoqItemRecursively = function visitBoqItemRecursively(boqItem, visitorObject) {
					localData.visitBoqItemsRecursively(null, boqItem, service.getBoqItemLevel(boqItem), visitorObject);
				};

				/**
				 * @ngdoc function
				 * @name registerForBoqChanged
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Register given function with events indicating that the loaded boq has changed
				 * @param {Object} scope of controller who reacts to change of loaded boq
				 * @param {Function} functionToRegister
				 */
				service.registerForBoqChanged = function registerForBoqChanged(scope, functionToRegister) {
					service.selectedBoqHeaderChanged.register(functionToRegister);
					service.boqStructureReloaded.register(functionToRegister);
					scope.$on('$destroy', function () {
						service.selectedBoqHeaderChanged.unregister(functionToRegister);
						service.boqStructureReloaded.unregister(functionToRegister);
					});
				};

				/**
				 * @ngdoc function
				 * @name loadBoqRoundedColumns2DetailTypes
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Load the mapping between the boq item colums to be rounded and the related boq rounding config detail type
				 * @returns  {Object} the promise and when being resolved the loaded mapping
				 */
				service.loadBoqRoundedColumns2DetailTypes = function loadBoqRoundedColumns2DetailTypes() {

					let resultPromise = $q.when(localData.boqRoundedColumns2DetailTypes);

					if(_.isArray(localData.boqRoundedColumns2DetailTypes)) {
						return resultPromise;
					}

					resultPromise = $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqroundedcolumns2detailtypes').then(function(response) {
						localData.boqRoundedColumns2DetailTypes = response.data;
						return response.data || [];
					});

					return resultPromise;
				};

				// #endregion
				//  endregion


				//  region Create/Delete
				// #region

				/**
				 * @ngdoc function
				 * @name createNewBoqItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Creates a new boqItem with the given parent and lineType
				 * @param {Number} parentItemId of item to be created
				 * @param {Object} selectedBoqItem
				 * @param {Number} lineType of item to be created
				 * @param {Number} level of item to be created
				 * @param {Boolean} createChild flag triggering the creation of an item or child item
				 * @param {Boolean} insertAtEnd indicates that the new item has to be placed at the of all sibling items on the given level
				 * @param {Boolean} setSelectedItemAsPredecessor triggers setting of the currently selected item as predecessor of the new created item
				 * @param {Boolean} reinitCreationData triggers skipping the creation of the boq item. This is done in order to reinitialize the creationData information.
				 * @param {Boolean} doSave flag for whether to do save when creating.
				 */
				service.createNewBoqItem = function createNewBoqItem(parentItemId, selectedBoqItem, lineType, level, createChild, insertAtEnd, setSelectedItemAsPredecessor, reinitCreationData, doSave, isCrbPreliminary) {
					// Check for valid parameters
					if (!parentItemId && !selectedBoqItem) {
						return;
					}

					// Set myCreationData
					myCreationData = {
						parentItemId: parentItemId,
						selectedItem: selectedBoqItem,
						lineType: lineType,
						level: level,
						insertAtEnd: insertAtEnd,
						predecessor: (_.isBoolean(setSelectedItemAsPredecessor) && setSelectedItemAsPredecessor) ? selectedBoqItem : null,
						doSave: (doSave === null || angular.isUndefined(doSave) || !_.isBoolean(doSave)) ? true : doSave,
						IsCrbPreliminary: isCrbPreliminary
					};

					if (service.isOenBoq()) {
						myCreationData.lineType = oenService.getBoqLineType(service, myCreationData.lineType, myCreationData.level);
					}
					else if (service.isCrbBoq()) {
						myCreationData.lineType = crbService.getBoqLineType(service, myCreationData.lineType, myCreationData.level, isCrbPreliminary);
					}

					if (reinitCreationData) {
						return; // In the mode we only reinitialize myCreationData
					}

					$injector.get('platformGridAPI').grids.commitAllEdits(); // Prevents the lost of data when creating a new BOQ item (ALM task 124919)

					localData.clearSpecification();

					try {
						if (createChild) {
							service.createChildItem();
						} else {
							service.createItem();
						}
					}
					catch (e) {
						let reason = '<unknown>';
						if(_.isObject(e)) {
							reason = e.message;
						}

						console.error('Creation of boqItem failed due to following reason: ' + reason);
					}
				};

				/**
				 * @ngdoc function
				 * @name canCreateDivisionBoqItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Checks if a BOQ item of the given BOQ line type can be created at the requested level
				 * @param {Object} selectedBoqItem
				 * @param {Boolean} isCreatingSubDevision
				 * @param {Boolean} restrainErrorHandling
				 * @returns {Boolean}
				 */
				service.canCreateDivisionBoqItem = function canCreateDivisionBoqItem(selectedBoqItem, isCreatingSubDevision, restrainErrorHandling) {
					var level;

					level = localData.getLevelOfBoqItem(selectedBoqItem);
					if (boqMainCommonService.isRoot(selectedBoqItem)) {
						level = boqMainLineTypes.level1;
					} else if (isCreatingSubDevision) {
						level++;
					}

					return service.canCreateBoqItem(selectedBoqItem, localData.getDivisionLineTypeByLevel(level), level, restrainErrorHandling);
				};

				/**
				 * @ngdoc function
				 * @name canCreateBoqItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Checks if a BOQ item of the given BOQ line type can be created at the requested level
				 * @param {Object} selectedBoqItem
				 * @param {Number} boqLineType
				 * @param {Number} level
				 * @param {Boolean} restrainErrorHandling
				 * @returns {Boolean}
				 */
				service.canCreateBoqItem = function canCreateBoqItem(selectedBoqItem, boqLineType, level, restrainErrorHandling, skipCanLineTypeBeCreatedAtGivenLevel) {
					var ret = false;

					if (_.isFunction(localData.canCreateBoqItemSpecific) && !localData.canCreateBoqItemSpecific(selectedBoqItem, boqLineType, level)) {
						return false; // A specific implementation of canCreateBoqItem does not allow creation of boq item.
					}

					if (!selectedBoqItem || boqLineType < 0 || level < 0) {
						return false;
					}

					if (service.isOenBoq() || service.isCrbBoq()) {
						ret = true; // in context of OENORM the 'canCreate*' functions are implemented in 'oenService/crbService' and called directly
					}
					else if (skipCanLineTypeBeCreatedAtGivenLevel) {
						ret = true;
					}
					else {
						ret = localData.canLineTypeBeCreatedAtGivenLevel(selectedBoqItem, null, boqLineType, level, null);
					}

					if (!ret && !restrainErrorHandling) {
						localData.handleCreationError();
					}

					return ret;
				};

				/**
				 * @ngdoc function
				 * @name canDeleteBoqItem
				 * @returns {Boolean}
				 */
				service.canDeleteBoqItem = function canDeleteBoqItem(selectedBoqItem) {
					var ret;

					ret = !service.getReadOnly() && selectedBoqItem && selectedBoqItem.BoqLineTypeFk!==boqMainLineTypes.root;
					if (ret && service.isCrbBoq()) {
						ret = crbService.canDeleteBoqItem(service, selectedBoqItem);
					}

					return ret;
				};

				/**
				 * @ngdoc function
				 * @name createNewItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Creates a new boqItem of type position
				 * @param {Boolean/String} firstParam
				 * @returns {Boolean} returns if can be created according to the given selectedItem and given rules.
				 */
				service.createNewItem = function createNewItem(firstParam) {

					// Depending on the currently selected item (folder or item) we create a new item.
					var selectedBoqItem = service.getSelected();
					var canCreateResult = false;
					var skipCreation = _.isUndefined(firstParam) ? false : !firstParam;
					var fittingItem = null;
					localData.MaxReferenceBoqItem = null;

					if (!selectedBoqItem || service.getReadOnly()) {
						return false;
					}

					if (skipCreation) {
						if      (service.isOenBoq()) { return oenService.canCreateNewPosition(service, selectedBoqItem); }
						else if (service.isCrbBoq()) { return crbService.canCreateNewPosition(service, selectedBoqItem); }
					}
					else {
						platformGridAPI.grids.commitAllEdits();
						if (!service.createNewItem(false)) {
							return false;
						}
					}

					var level = localData.getLevelOfBoqItem(selectedBoqItem);

					if (boqMainCommonService.isItem(selectedBoqItem) || boqMainCommonService.isSurchargeItem(selectedBoqItem)) {
						// Having an item selected we create a sibling item on the same level
						canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level, skipCreation);
						if (canCreateResult && !skipCreation) {
							service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, boqMainLineTypes.position, level, false, true);
						}
					}
					else if (boqMainCommonService.isRoot(selectedBoqItem) || boqMainCommonService.isDivision(selectedBoqItem)) {
						// Having the root or a division selected we currently create a sub item
						// According to ALM:105037, it should be possible to insert a Position directly from root, enable only for gaeb boq's
						canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level+1, skipCreation, service.isGaebBoq());

						if (canCreateResult && !skipCreation) {
							var doSave = angular.isString(firstParam) ? firstParam.indexOf('withoutsave') === -1 : true;
							if (service.isGaebBoq()) {
								var maxReferenceBoqItem = localData.getMaxReferenceBoqItem(selectedBoqItem.Id);
								if (maxReferenceBoqItem.BoqLineTypeFk === boqMainLineTypes.position) {
									level = localData.getLevelOfBoqItem(maxReferenceBoqItem);
									service.createNewBoqItem(maxReferenceBoqItem.BoqItemFk, maxReferenceBoqItem, boqMainLineTypes.position, level, false, true);
								}
								else {
									if (!service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level+1, true)) {
										localData.MaxReferenceBoqItem = maxReferenceBoqItem;
									}
									service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.position, level + 1, true, true, false, false, doSave);
								}
							}
							else {
								service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.position, level + 1, true, true, false, false, doSave);
							}
						}
					} else {
						// The selected item doesn't fit into the above expected items. Try to find a fitting item in the hierarchy and try to create a new item from there
						fittingItem = service.findFittingItem(selectedBoqItem, boqMainLineTypes.position);

						if (!fittingItem) {
							// No sibling poosition to the selectedItem could be found
							// -> look for division to create a new position beneath
							selectedBoqItem = service.findFittingItem(selectedBoqItem, localData.getDivisionLineTypeByLevel(level - 1));
						} else {
							selectedBoqItem = fittingItem;
						}

						if (boqMainCommonService.isItem(selectedBoqItem)) {
							level = localData.getLevelOfBoqItem(selectedBoqItem);
							// Having an item selected we create a sibling item on the same level
							canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level, skipCreation);
							if (canCreateResult && !skipCreation) {
								service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, boqMainLineTypes.position, level, false, true);
							}
						} else if (boqMainCommonService.isRoot(selectedBoqItem) || boqMainCommonService.isDivision(selectedBoqItem)) {
							// Having the root or a division selected we currently create a sub item
							canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level, skipCreation);
							if (canCreateResult && !skipCreation) {
								service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.position, level, true, true);
							}
						}
					}

					return canCreateResult;
				};

				/**
				 * @ngdoc function
				 * @name createNewDivision
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Creates a new boqItem of type division
				 * @param {Boolean} skipCreation triggers skipping the creation of the boq item.
				 * @returns {Boolean} returns if can be created according to the given selectedItem and given rules.
				 */
				service.createNewDivision = function createNewDivision(firstParam) {
					// Depending on the currently selected item (folder or item) we create a new folder.
					var selectedBoqItem = service.getSelected();
					var parentOfSelectedItem = !_.isEmpty(selectedBoqItem) ? localData.getParentBoqItem(selectedBoqItem) : null;
					var canCreateResult = false;
					var skipCreation = _.isUndefined(firstParam) ? false : !firstParam;

					if (!selectedBoqItem || service.getReadOnly()) {
						return false;
					}

					if (skipCreation) {
						if      (service.isOenBoq()) { return oenService.canCreateNewSiblingDivision(service, selectedBoqItem); }
						else if (service.isCrbBoq()) { return crbService.canCreateNewSiblingDivision(service, selectedBoqItem); }
					}
					else {
						platformGridAPI.grids.commitAllEdits();
						if (!service.createNewDivision(false)) {
							return false;
						}
					}

					var level = localData.getLevelOfBoqItem(selectedBoqItem);

					if (boqMainCommonService.isItem(selectedBoqItem) || boqMainCommonService.isSurchargeItem(selectedBoqItem)) {
						// Having an item selected we create a sibling folder on the same level
						canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, false, true);
						if (canCreateResult && (parentOfSelectedItem !== null) && !skipCreation) {
							service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, localData.getDivisionLineTypeByLevel(level), level, false);
						} else {
							// If the creation on the item level is not allowed we try to create a new division on the parent level as sibling the the parent of the selected item
							canCreateResult = !service.isCrbBoq() && service.canCreateDivisionBoqItem(parentOfSelectedItem, false, skipCreation); // In a CRB BOQ this special rule would result in a BOQ item with an empty and defect reference.
							if ((level > 1) && canCreateResult && !skipCreation) {
								service.createNewBoqItem(parentOfSelectedItem.BoqItemFk, parentOfSelectedItem, localData.getDivisionLineTypeByLevel(level - 1), level - 1, false);
							}
						}

						if (!canCreateResult) {
							localData.handleCreationError(skipCreation);
						}
					} else if (boqMainCommonService.isDivision(selectedBoqItem)) {
						// Having a division selected we create a sibling division on the same level
						canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, false, skipCreation);
						if (canCreateResult && !skipCreation) {
							service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, localData.getDivisionLineTypeByLevel(level), level, false);
						}
					} else if (boqMainCommonService.isRoot(selectedBoqItem)) {
						// Having the root selected we create a child division on the first level
						canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, false, skipCreation);
						if (canCreateResult && !skipCreation) {
							service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.level1, level + 1, true);
						}
					} else {
						// The selected item doesn't fit into the above expected items. Try to find a fitting item in the hierarchy and try to create a new item from there
						selectedBoqItem = service.findFittingItem(selectedBoqItem, boqMainLineTypes.level1);

						if (boqMainCommonService.isDivision(selectedBoqItem)) {
							level = localData.getLevelOfBoqItem(selectedBoqItem);
							// Having a division selected we create a sibling division on the same level
							canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, false, skipCreation);
							if (canCreateResult && !skipCreation) {
								service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, localData.getDivisionLineTypeByLevel(level), level, false);
							}
						}
					}

					return canCreateResult;
				};

				/**
				 * @ngdoc function
				 * @name createNewSubDivision
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Creates a new boqItem of type sub division
				 * @param {Boolean} skipCreation triggers skipping the creation of the boq item.
				 * @returns {Boolean} returns if can be created according to the given selectedItem and given rules.
				 */
				service.createNewSubDivision = function createNewSubDivision(firstParam) {
					// Depending on the currently selected item (folder of item) we create a new sub folder.
					var selectedBoqItem = service.getSelected();
					var canCreateResult = false;
					var skipCreation = _.isUndefined(firstParam) ? false : !firstParam;

					if (!selectedBoqItem || service.getReadOnly()) {
						return false;
					}

					if (skipCreation) {
						if      (service.isOenBoq()) { return oenService.canCreateNewSubDivision(service, selectedBoqItem); }
						else if (service.isCrbBoq()) { return crbService.canCreateNewSubDivision(service, selectedBoqItem); }
					}
					else {
						platformGridAPI.grids.commitAllEdits();
						if (!service.createNewSubDivision(false)) {
							return false;
						}
					}

					var level = localData.getLevelOfBoqItem(selectedBoqItem);

					if ((boqMainCommonService.isItem(selectedBoqItem) || boqMainCommonService.isSurchargeItem(selectedBoqItem)) && !skipCreation) {
						// Having an item selected nothing happens, because we have no folder as child of an item
						localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorDivisionIsSubOfPosition');
					} else if (boqMainCommonService.isDivision(selectedBoqItem)) {
						// Having a division selected we create a sub division on the next level
						canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, true, skipCreation);
						if (canCreateResult && !skipCreation) {
							service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, localData.getDivisionLineTypeByLevel(level + 1), level + 1, true);
						}
					} else if (boqMainCommonService.isRoot(selectedBoqItem)) {
						// Having the root selected we create a child division on the first level
						canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, true, skipCreation);
						if (canCreateResult && !skipCreation) {
							service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.level1, level + 1, true);
						}
					} else {
						// The selected item doesn't fit into the above expected items. Try to find a fitting item in the hierarchy and try to create a new item from there
						selectedBoqItem = service.findFittingItem(selectedBoqItem, boqMainLineTypes.level1);

						if (boqMainCommonService.isDivision(selectedBoqItem)) {
							level = localData.getLevelOfBoqItem(selectedBoqItem);
							// Having a division selected we create a sub division on the next level
							canCreateResult = service.canCreateDivisionBoqItem(selectedBoqItem, true, skipCreation);
							if (canCreateResult && !skipCreation) {
								service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, localData.getDivisionLineTypeByLevel(level + 1), level + 1, true);
							}
						}
					}

					localData.handleCreationError(skipCreation);

					return canCreateResult;
				};

				/**
				 * @ngdoc function
				 * @name createNewByContext
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Creates a new boqItem whose line type depends on the context (currently selected selectedBoqItem)
				 * @param {Boolean} skipCreation triggers skipping the creation of the boq item. This is done in order to reinitialize the creationData information.
				 * @returns {Boolean} returns if the new created item is created as child or as sibling
				 *
				 */
				service.createNewByContext = function createNewByContext(firstParam, secondParam) {

					// Depending on the type of the currently selected element (i.e. the context), we create a sibling element (folder or item)
					var selectedBoqItem = service.getSelected();
					var canCreateResult = false;
					var skipCreation = _.isUndefined(firstParam) ? false : !firstParam;
					var reintializeCreationData = _.isBoolean(secondParam) ? secondParam : false;

					if (_.isEmpty(selectedBoqItem)) {
						return canCreateResult; // no selection -> nothing happens
					}

					var level = localData.getLevelOfBoqItem(selectedBoqItem);

					if (service.isCrbBoq()) {
						canCreateResult = crbService.canCreateNewSubQuantity(service, selectedBoqItem);
						if (!skipCreation && canCreateResult) {
							crbService.createNewSubQuantity(service, selectedBoqItem);
						}
					}
					else if (boqMainCommonService.isItem(selectedBoqItem)) {
						// Having an item selected we create a sibling item on the same level
						canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level, skipCreation);
						if (canCreateResult && (!skipCreation || reintializeCreationData)) {
							service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, boqMainLineTypes.position, level, false, false, false, reintializeCreationData);
						}
					} else if (boqMainCommonService.isDivision(selectedBoqItem)) {
						// Having a division selected we create a sibling division on the same level
						canCreateResult = service.canCreateBoqItem(selectedBoqItem, localData.getDivisionLineTypeByLevel(level), level, skipCreation);
						if (canCreateResult && (!skipCreation || reintializeCreationData)) {
							service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, localData.getDivisionLineTypeByLevel(level), level, false, false, false, reintializeCreationData);
						}
					} else if (boqMainCommonService.isRoot(selectedBoqItem)) {
						// Having the root selected we create a child division on the first level
						canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.level1, level+1, skipCreation);
						if (canCreateResult && (!skipCreation || reintializeCreationData)) {
							service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.level1, level + 1, true, false, false, reintializeCreationData);
						}
					} else if (boqMainCommonService.isTextElementWithoutReference(selectedBoqItem)) {
						// In this case we create a new text element without reference of the same line type as the selected one and make the selected boq item
						// the predecessor of the new created item.
						canCreateResult = true;
						if ((!skipCreation || reintializeCreationData)) {
							service.createNewItemByLineType(selectedBoqItem.BoqLineTypeFk, false, true, reintializeCreationData);
						}
					} else if (boqMainCommonService.isSurchargeItem(selectedBoqItem)) {
						// In this case we create a new surcharge item as the selected on the same level
						canCreateResult = true;
						if ((!skipCreation || reintializeCreationData)) {
							service.createNewItemByLineType(selectedBoqItem.BoqLineTypeFk, false, false, reintializeCreationData);
						}
					}

					return canCreateResult;
				};

				/**
				 * @ngdoc function
				 * @name createNewItemByLineType
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Creates a new boqItem of the given line type, as child or as sibling to the currently selected item
				 * @param {Number} lineType of the new created item
				 * @param {Boolean} asChild indicates if a child or a sibling item to the currently selected item is to be created
				 * @param {Boolean} setSelectedItemAsPredecessor triggers setting of the currently selected item as predecessor of the new created item
				 * @param {Boolean} skipCreation triggers skipping the creation of the boq item. This is done in order to reinitialize the creationData information.
				 */
				service.createNewItemByLineType = function createNewItemByLineType(lineType, asChild, setSelectedItemAsPredecessor, skipCreation) {

					// Depending on the currently selected item (folder or item) we create a new item.
					var selectedBoqItem = service.getSelected();

					if (_.isEmpty(selectedBoqItem)) {
						return; // no selection -> nothing happens
					}

					var level = localData.getLevelOfBoqItem(selectedBoqItem);

					if (asChild) {
						// Create a child item to the currently selected item with the given lineType
						service.createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, lineType, level + 1, true, true, setSelectedItemAsPredecessor, skipCreation);
					}
					else {
						// Create a sibling item on the same level with the given lineType
						service.createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, lineType, level, false, true, setSelectedItemAsPredecessor, skipCreation);
					}
				};

				function crbCreateNewBoqItem(lineType) {
					var currentBoqItem = service.getSelected();

					if (!_.isObject(currentBoqItem)) {
						return;
					}

					service.createNewBoqItem(currentBoqItem.Id, currentBoqItem, lineType, localData.getLevelOfBoqItem(currentBoqItem) + 1, true, undefined, undefined, undefined, undefined, true);
				}

				service.crbCreateNewPosGroup = function crbCreateNewPosGroup() {
					crbCreateNewBoqItem(5);
				};

				service.crbCreateNewPosSubGroup = function crbCreateNewPosSubGroup() {
					crbCreateNewBoqItem(6);
				};

				service.detachDependentEstimateItems = function(boqItem, dependentEstimateItems) {
					if (!(dependentEstimateItems && _.some(dependentEstimateItems))) {
						return $q.when(true);
					}

					function execute() {
						$http.post(globals.webApiBaseUrl + 'boq/main/detachboqitemreferencingestimateitems' + '?boqHeaderId='+boqItem.BoqHeaderFk + '&boqItemId='+boqItem.Id);
					}

					// #region modal options
					var estimateItems = _.uniq(_.map(dependentEstimateItems,'EstCode'));
					var labels = [];
					estimateItems.forEach((estimateItem) => {
						labels.push('<br/> <label class="platform-form-label">' + estimateItem + '</label>');
					});

					var bodyTemplate = [];
					bodyTemplate += '<section class="modal-body">';
					bodyTemplate +=    '<div data-ng-controller="boqMainEstimateItemsDetachController">';
					bodyTemplate +=       '<div class="platform-form-group">';
					bodyTemplate +=          '<label class="platform-form-label">{{"boq.main.boqItemWithDependentEstimateInfo1"|translate}}</label>';
					bodyTemplate +=          '</br> <label class="platform-form-label">{{"boq.main.boqItemWithDependentEstimateInfo2"|translate}}</label>';
					bodyTemplate +=           labels;
					bodyTemplate +=          '</div>';
					bodyTemplate +=       '</div>';
					bodyTemplate +=       '<div class="platform-form-row"></div>';
					bodyTemplate +=       '<div class="platform-form-row"></div>';
					bodyTemplate +=       '<div class="modal-wrapper" style="margin-top:10px">';

					bodyTemplate +=       '</div>';
					bodyTemplate +=    '</div>';
					bodyTemplate += '</section>';

					// Dialogbox to decide what should happen with the dependent estimate items
					var modalOptions = {
						headerText$tr$: 'boq.main.boqItemWithDependentEstimateHeader',
						bodyTemplate: bodyTemplate,
						showOkButton: true,
						showCancelButton: true,
						resizeable: true,
						minHeight: '400px',
						minWidth: '400px',
						executeFunc: execute
					};
					// #endregion

					return platformDialogService.showDialog(modalOptions).then(function(response) {
						return response.ok;
					}, function() {
						return false;
					});
				};

				service.getDependentEstimateItems = function(boqItem) {
					return $http.get(globals.webApiBaseUrl + 'boq/main/getboqitemreferencingestimateitems' + '?boqHeaderId='+boqItem.BoqHeaderFk + '&boqItemId='+boqItem.Id).then(function(response) {
						return response.data || [];
					});
				};

				// Remember original onDeleteDone
				localData.originalOnDeleteDone = localData.onDeleteDone;

				// Overwrite onDeleteDone
				localData.onDeleteDone = function onDeleteDone(deleteParams, data, response) {
					if (response) { // Could not be deleted ?
						if (_.some(response.DependentEstimateItems) || _.some(response.DependentQtoDetails)) {
							// #region template
							var radioItemCount = 0;
							var estRadioItems = [$translate.instant('boq.main.deleteBoqItemsWithDependantEstimateItemsOption1'), $translate.instant('boq.main.deleteBoqItemsWithDependantEstimateItemsOption2')];
							var bodyTemplate = [];
							bodyTemplate += '<section class="modal-body">';
							bodyTemplate +=    '<div data-ng-controller="boqMainEstimateDeleteController">';
							bodyTemplate +=       '<label class="platform-form-label">{{"boq.main.deleteBoqItemsWithDependantItemsInfo1"|translate}}</label>';
							bodyTemplate +=       '<label class="platform-form-label">{{"boq.main.deleteBoqItemsWithDependantItemsInfo2"|translate}}</label>';
							if (_.some(response.DependentEstimateItems)) {
								bodyTemplate +=    '<div style="margin-top:10px"></div>';
								bodyTemplate +=    '<div class="platform-form-group">';
								_.forEach(estRadioItems, function(radioItem) {
									bodyTemplate +=    '<div class="radio spaceToUp">';
									bodyTemplate +=       '<label>';
									bodyTemplate +=          '<input type="radio" name="radioGroupA" ng-model="selectedOption" ng-value="' + (++radioItemCount) + '">';
									bodyTemplate +=          radioItem;
									bodyTemplate +=       '</label>';
								});
								bodyTemplate +=       '</div>';
								bodyTemplate +=    '</div>';
								bodyTemplate +=    '<div class="modal-wrapper" style="margin-top:5px">';
								bodyTemplate +=       '<label class="platform-form-label">{{"boq.main.deleteBoqItemsWithDependantEstimateItems"|translate}}</label>';
								bodyTemplate +=       '<div class="modal-wrapper grid-wrapper_ subview-container" style="margin-top:5px">';
								bodyTemplate +=          '<platform-Grid data="estGridData"/>';
								bodyTemplate +=       '</div>';
								bodyTemplate +=    '</div>';
							}
							if (_.some(response.DependentQtoDetails)) {
								bodyTemplate +=    '<div class="modal-wrapper" style="margin-top:20px">';
								bodyTemplate +=       '<label class="platform-form-label">{{"boq.main.deleteBoqItemsWithDependantQtoDetails"|translate}}</label>';
								bodyTemplate +=       '<div class="modal-wrapper grid-wrapper_ subview-container" style="margin-top:5px">';
								bodyTemplate +=          '<platform-Grid data="qtoGridData"/>';
								bodyTemplate +=       '</div>';
								bodyTemplate +=    '</div>';
							}
							bodyTemplate +=    '</div>';
							bodyTemplate += '</section>';
							// #endregion

							// Dialogbox to decide what should happen with the dependent estimate items
							var modalOptions =
							{
								headerText$tr$: 'boq.main.deleteBoqItemsHeader',
								bodyTemplate: bodyTemplate,
								showOkButton: true,
								showCancelButton: true,
								resizeable: true,
								minHeight: '400px',
								minWidth: '400px',
								deletedBoqItems: deleteParams.entities,
								dependentEstimateItems: response.DependentEstimateItems,
								dependentQtoDetails: response.DependentQtoDetails,
								onDeleteDoneFunc: localData.originalOnDeleteDone,
								onDeleteDoneParam1: deleteParams,
								onDeleteDoneParam2: data
							};
							platformDialogService.showDialog(modalOptions);
						}
						else { // todo-bre: The dependency check currently only is executed for single selected BOQ positions (solution before the implementation of ALM task 123771)
							var singleEntity = deleteParams.entities[0];
							var postData = {
								mainItemId: singleEntity.Id,
								moduleIdentifer: singleEntity.IsWicItem ? 'boq.main.wicitem' : 'boq.main.item',
								projectId: service.getSelectedProjectId() || 0,
								headerId: singleEntity.BoqHeaderFk
							};

							var countCannotDelete = 0;
							return $http.get(globals.webApiBaseUrl + 'basics/common/dependent/gettotalcount?mainItemId=' + postData.mainItemId + '&moduleIdentifer=' + postData.moduleIdentifer + '&projectId=' + postData.projectId + '&headerId=' + postData.headerId, postData).then(function (response) {
								countCannotDelete = response.data;

								if (countCannotDelete > 0) {
									var modalOptions = { headerTextKey:'cloud.common.informationDialogHeader', bodyTextKey:'boq.main.dialogDelete.bodyMessage', iconClass:'ico-info', width:'800px' };
									if (deleteParams.entities.length === 1) {
										modalOptions.mainItemId      = postData.mainItemId;
										modalOptions.headerId        = postData.headerId;
										modalOptions.moduleIdentifer = postData.moduleIdentifer;
										modalOptions.prjectId        = postData.projectId;
										modalOptions.showNoButton = false;
										modalOptions.yesBtnText = 'OK';
										return $injector.get('basicsCommonDependentService').showDependentDialog(modalOptions);
									}
								} else {
									localData.deleteEntities(deleteParams.entities, data);
								}
							});
						}
					}
					else {
						let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
						if(_dynamicUserDefinedColumnsService  && angular.isFunction(_dynamicUserDefinedColumnsService.handleEntitiesDeleted)) {
							_dynamicUserDefinedColumnsService.handleEntitiesDeleted(deleteParams.entities);
						}

						var deletedBoqItems = null;
						var multiSelectionEnabled = _.isFunction(service.supportsMultiSelection) && service.supportsMultiSelection();

						// First call the original onDeleteDone
						localData.originalOnDeleteDone(deleteParams, data, response);

						if (multiSelectionEnabled) {
							deletedBoqItems = deleteParams.entities;
						} else {
							deletedBoqItems = [];
							deletedBoqItems.push(deleteParams.entity);
						}

						angular.forEach(deletedBoqItems, function (deletedBoqItem) {
							// Then do whatever needs to be done after the entity has been deleted.
							if (angular.isDefined(deletedBoqItem) && (deletedBoqItem !== null)) {

								var parentItem = localData.getParentBoqItem(deletedBoqItem);

								if (angular.isUndefined(parentItem) || (parentItem === null)) {
									return;
								}

								if (service.isCrbBoq()) {
									$injector.get('boqMainCrbBoqItemService').onDeleteDone(service, parentItem, deletedBoqItem);
								}

								// Deleting an item forces its parent chain to be recalculated.
								// This is currently also done on the server, but in case we're not a root service the updated values will not be displayed.
								// So currently we do the job twice (on client and on server), but the result of the calculation is displayed faster.
								service.calcParentChain(deletedBoqItem);
								if (angular.isFunction(localData.doClearModifications)) {
									// Remove possible modifications that might have been done by calcParentChain, for currently the server
									// does the final calculation.
									localData.doClearModifications(deletedBoqItem, data);
								}

								// After the deletion of an item without reference take care to maintain the chain of predecessing items
								var siblings = parentItem.BoqItems;
								var siblingsCount = (angular.isDefined(siblings) && (siblings !== null)) ? siblings.length : 0;
								var isDeletedItemPredecessor = (siblingsCount > 0) ? _.isObject(_.find(siblings, {BoqItemBasisFk: deletedBoqItem.Id})) : false;

								if (isDeletedItemPredecessor) {

									// The deletion if items usually doesn't change the hopefully proper odering of the items,
									// so we can traverse the line of sibling items and check the linking of the predecessor chain
									// and fix problems if they occur.
									var currentSibling = null;
									var previousSibling = null;
									service.processBoqItem(parentItem);

									// Traverse siblings from end to beginning
									for (var i = siblingsCount - 1; i >= 0; i--) {
										currentSibling = siblings[i];

										if (boqMainCommonService.isTextElementWithoutReference(currentSibling)) {
											// We have a text element without reference that must be linked to its predecessor by BoqItemBasisFk
											previousSibling = (i > 0) ? siblings[i - 1] : null;
											if (previousSibling !== null) {
												// Check the predecessor link.
												// If it's not correct set it and mark the item as modified.
												if (currentSibling.BoqItemBasisFk !== previousSibling.Id) {
													// Predecessor link wrong -> correct it
													currentSibling.BoqItemBasisFk = previousSibling.Id;
													service.markItemAsModified(currentSibling);
												}
											} else {
												// Here we have the first sibling in the order in hand.
												// This one should link to the parent item as predecessor.
												if (currentSibling.BoqItemBasisFk !== parentItem.Id) {
													// Predecessor link wrong -> correct it
													currentSibling.BoqItemBasisFk = parentItem.Id;
													service.markItemAsModified(currentSibling);
												}
											}
										}
									}
								}

								var childBoqItemsOfDeleted = parentItem.BoqItems;
								var childBoqItemsOfDeletedCount = (angular.isDefined(childBoqItemsOfDeleted) && (childBoqItemsOfDeleted !== null)) ? childBoqItemsOfDeleted.length : 0;
								var subDescriptionItems = (childBoqItemsOfDeletedCount > 0) ?  _.filter(childBoqItemsOfDeleted, {'BoqLineTypeFk': boqMainLineTypes.subDescription}) : null;
								if((angular.isDefined(subDescriptionItems) && (subDescriptionItems === null))){
									parentItem.IsLeadDescription = false;
									service.markItemAsModified(parentItem);
								}

								// We don't handle the HasChildren property here for this might lead to the situation
								// where the children of the root item have been deleted on client side, but not yet saved to the server (-> service is a child service)
								// If the user does a refresh of the current header entity the deletion is not carried out but the root item might end up having the HasChildren property set to false
								// which could cause trouble by allowing to edit the specific document properties, although the underlying boq structure stays as before.

								// Update related lookups
								var boqRefItemLookupDataService = $injector.get('boqRefItemLookupDataService');
								var boqHeaderFk = deletedBoqItem.BoqHeaderFk;
								boqRefItemLookupDataService.resetCacheAt(boqHeaderFk);

								service.gridRefresh();
							}
						});
					}
				};

				// Overwrite deleteSelection
				service.deleteSelection = function boqMainDeleteSelection() {
					// One purpose of overwriting this function is to avoid the root item being deleted by this service.
					// The other purpose is to prepare the list of selected entities in 'multi-selection' mode and avoid double entries.
					// Also, a special handling of this mode is supported by calling a possibly existing function handleDeleteMultiSelection
					// that can be overwritten by related specific boqMainServices (i.e. prcBoqMainService).

					var selectedEntities;
					var preparedBoqItems;
					var preparedBoqItemsWithChildren = [];
					var handleDeleteMultiSelectionPromise = $q.when(true);

					selectedEntities = service.getSelectedEntities();

					selectedEntities = _.filter(selectedEntities, function (item) {
						var isRoot = boqMainCommonService.isRoot(item);

						if (isRoot) {
							// Someone requested the deletion of the root item -> log this
							console.log('boqMainServiceFactory.deleteSelection: Someone requested the deletion of the root item -> deletion of root item skipped !');
						}

						return !isRoot; // The root item may not be deleted here
					});

					if (service.isCrbBoq())
					{
						selectedEntities = crbService.filterDeletedBoqItems(service, selectedEntities);
					}

					preparedBoqItems = service.prepareSelectedBoqItems(selectedEntities, preparedBoqItemsWithChildren);
					if(_.isArray(preparedBoqItemsWithChildren) && preparedBoqItemsWithChildren.length > 0) {

						var isSubItemPresent = false;
						if (preparedBoqItemsWithChildren.some(e => e.BoqItems !== null && e.BoqItems.length > 0)) {
							isSubItemPresent = true;
						}

						if(_.isFunction(service.handleDeleteMultiSelection)) {
							handleDeleteMultiSelectionPromise = service.handleDeleteMultiSelection(preparedBoqItems, preparedBoqItemsWithChildren);
						}

						handleDeleteMultiSelectionPromise.then(function(result) {
							if(!_.isBoolean(result) || (_.isBoolean(result) && result)) {

								// Cuts the subtrees ('BoqItems') which are unused in the delete service and in order to reduce the size of the posted object
								var deletedBoqItem;
								var deletedBoqItems = [];
								_.forEach(preparedBoqItems, function(boqItem) {
									deletedBoqItem = _.clone(boqItem);
									deletedBoqItem.BoqItems = null;
									deletedBoqItems.push(deletedBoqItem);
								});

								if(isSubItemPresent === true) {
									let platformDeleteSelectionDialogService = $injector.get('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog({dontShowAgain : true, id: 'ff66fdd63db341568baafa5c1ae13508'}).then(result => {
										if (result.ok || result.delete) {
											service.deleteEntities(deletedBoqItems);
										}
									});
								}
								else {
									service.deleteEntities(deletedBoqItems);
								}
							}
						});
					}
				};

				var onEntityCreated = function onEntityCreated(e, item) {

					var parentBoqItem = null;
					var oldPredecessor = null;
					var predecessor = null;
					var previousNextContainer = {};
					var siblingCount = 0;
					var index = -1;
					var boqStructure = service.getStructure();

					// React on the creation of items
					if ((angular.isDefined(item)) && (item !== null)) {

						parentBoqItem = localData.getParentBoqItem(item);


						if(localData.MaxReferenceBoqItem){
							// Marks as modified the whole children-tree of the created 'item'
							var boqItemArray = [];
							var flatBoqItemList = [];
							boqItemArray.push(item);
							localData.flatten(boqItemArray, flatBoqItemList, localData.treePresOpt.childProp);
							_.forEach(flatBoqItemList, function (item) {
								if (flatBoqItemList) {
									service.markItemAsModified(item);
								}
							});
						} else {
							// Marks as modified the children (only 1 hierarchy level) of the created 'item'
							if (_.isArray(item.BoqItems)) {
								_.forEach(item.BoqItems, function (child) {
									service.markItemAsModified(child);
								});
							}
						}

						if (boqMainCommonService.isTextElementWithoutReference(item)) {

							// Here we make sure that the new created item doesn't break the chain of predecessors/successors
							// by making the new created item the predecessor of the succeeding item.
							var successor = myCreationData.successor;
							var parentFolder = null;

							if (angular.isDefined(successor) && (successor !== null) && boqMainCommonService.isTextElementWithoutReference(successor)) {
								successor.BoqItemBasisFk = item.Id;
								service.markItemAsModified(successor);

								// Resort the children hierarchy
								parentFolder = localData.getParentBoqItem(item);
								service.resortChildren(parentFolder, true);
							}

							if (boqMainCommonService.isDesignDescription(item)) {
								// When we create a design description we also have to determine a number for it.
								item.DesignDescriptionNo = localData.getNextDesignDescriptionNo();
								service.markItemAsModified(item);

								service.setSelected(item); // To ensure that the new created textElement is corretly bound to the design description

								// Create a text element as first child.
								// The first text element in a row gets the parent design description as predecessor.
								// This is triggered by the last flag set to true.
								service.createNewItemByLineType(boqMainLineTypes.textElement, true, true);
							}

							if (boqMainCommonService.isSubDescription(item)) {
								// When we create a sub description we also have to determine a number for it.
								parentFolder = (parentFolder === null) ? localData.getParentBoqItem(item) : parentFolder;
								item.DesignDescriptionNo = localData.getNextSubdescriptionNo(parentFolder);
								// Special case for updating readonly state of parent of subdescription
								if (_.isObject(parentFolder)) {
									service.processBoqItem(parentFolder);
								}
								service.markItemAsModified(item);
							}
						} else if ((boqMainCommonService.isItem(item) || boqMainCommonService.isDivision(item)) && localData.getLevelOfBoqItem(item) === 1) {
							localData.getPreviousAndNextItem(item, previousNextContainer, false, false);
							predecessor = previousNextContainer.previousItem;
							oldPredecessor = predecessor;

							if (angular.isDefined(predecessor) && predecessor !== null && boqMainCommonService.isTextElement(predecessor)) {
								// Look in sibling list for possibly predecessing item or division.
								siblingCount = (parentBoqItem !== null) && (parentBoqItem.BoqItems !== null) ? parentBoqItem.BoqItems.length : 0;
								index = siblingCount > 0 ? parentBoqItem.BoqItems.indexOf(predecessor) : -1;

								while (index > 0 && boqMainCommonService.isTextElement(predecessor)) {
									oldPredecessor = predecessor;
									predecessor = parentBoqItem.BoqItems[--index];

									if (boqMainCommonService.isItem(predecessor) || boqMainCommonService.isDivision(predecessor) && oldPredecessor.BoqItemBasisFk === predecessor.Id) {
										// Move this list of text elements to the new created item
										oldPredecessor.BoqItemBasisFk = item.Id;
										service.markItemAsModified(oldPredecessor);

										// Resort the children hierarchy
										service.resortChildren(parentBoqItem, true);

										break;
									}
								}
							}
						}
					}

					if (boqMainCommonService.isItem(item) || boqMainCommonService.isDivision(item)) {
						if (boqMainCommonService.isItem(item) && _.isObject(boqStructure) && boqStructure.CalcFromUrb) {
							// Automatically set IsUrb flag and do recalc of Urbs
							item.IsUrb = true;
							service.recalcUrbs(item);
							service.processBoqItem(item); // Update readonly state
						}

						item.RecordingLevel = _.isObject(parentBoqItem) ? parentBoqItem.RecordingLevel : 0;
					}

					if (service.isItemWithIT(item) && item.Finalprice !== 0) {
						service.calcItemsPriceHoursNew(item, true);
					}

					// Reset myCreationData
					myCreationData = {};
				};

				service.registerEntityCreated(onEntityCreated);

				service.createBoqPositionFromPriceComparison = function(creationData) {
					var defaultData = {
						lineType: boqMainLineTypes.position,
						doSave: false
					};

					creationData = angular.extend(defaultData, creationData);

					return $http.post(globals.webApiBaseUrl + 'boq/main/createboqpositionfrompricecopmparison', creationData).then(function(response) {
						if (!response || !response.data) {
							platformDialogService.showInfoBox('boq.main.creationOfBoqPositionImpossible');
							return null;
						}
						return serviceContainer.data.onCreateSucceeded(response.data, serviceContainer.data, creationData);
					});
				};

				// #endregion
				//  endregion


				//  region Load/Save
				// #region

				// fixed #81215 add this to stop the default data loading action 'boq/main/tree?mainItemId=209' which will make the boq structure container empty
				// we load the boq item structure data by manual
				localData.doNotLoadOnSelectionChange = true;

				// The upper setting of the doNotLoadOnSelectionChange flag causes problems with the caching of sub entities as split quantities or text complements.
				// So we set the following flag to true to force the child service unload which initializes the child service caching.
				localData.forceChildServiceUnload = true;

				// Called just before the saving is executed
				localData.reduceOwnTreeStructuresInUpdateData = function reduceOwnTreeStructuresInUpdateData(updateData) { // TODO-AutoSave, data, isTriggeredBySelectionOrContainerChange) {
					let deletedBoqItemsList=[], upsertedBoqItemsList=[];

					function getChangedBoqItems(obj, changeProperties, ret) {
						const dtoProperties = _.filter(Object.getOwnPropertyNames(obj), function(prop) { return /[A-Z]/.test(prop.charAt(0)); }); // Filters the properties to those of the DTO classes
						_.forEach(dtoProperties, function(prop) {
							if (changeProperties.includes(prop)) {
								_.forEach(obj[prop], function(boqItemComplete) {
									ret.push(boqItemComplete.BoqItems);
								});
							}
							else if (_.isArray(obj[prop])) {
								_.forEach(obj[prop], function(arrayItem) {
									ret = getChangedBoqItems(arrayItem, changeProperties, ret);
								});
							}
							else if (_.isObject(obj[prop]) && !_.isFunction(obj[prop])) {
								ret = getChangedBoqItems(obj[prop], changeProperties, ret);
							}
						});

						return ret;
					}

					function getDeletedBoqItems(obj) {
						return getChangedBoqItems(obj, ['BoqItemToDelete','BoqItemCompleteToDelete'], []);
					}

					function getUpsertedBoqItems(obj) {
						return getChangedBoqItems(obj, ['BoqItemToSave','BoqItemCompleteToSave'], []);
					}

					if (updateData.MainModuleName && _.some(updateData.BoqItems)) { // Is the boqItems UI container the main container in the current module?
						upsertedBoqItemsList = [updateData.BoqItems];
					}
					else {
						deletedBoqItemsList  = getDeletedBoqItems( updateData);
						upsertedBoqItemsList = getUpsertedBoqItems(updateData);
					}

					// TODO-AutoSave (see backend code too)
					/*
					const rootBoqItem = service.getRootBoqItem();
					_.forEach(upsertedBoqItemsList, function(upsertedBoqItems) {
						_.remove(upsertedBoqItems, function(bi) { return bi.Id===rootBoqItem.Id; } );
					});
					if (isTriggeredBySelectionOrContainerChange) {
						service.markItemAsModified(rootBoqItem);
					}
					else if (_.some(upsertedBoqItemsList) && !_.some(upsertedBoqItemsList, function(bi) { return bi.Id===rootBoqItem.Id; })) {
						upsertedBoqItemsList[0].push(_.clone(rootBoqItem));
					}
					*/

					// Sets the children of the changed BOQ items (property 'BoqItems') to null to prevent that unnecessarily complete parts of the BOQ tree are posted to the server
					_.forEach(upsertedBoqItemsList.concat(deletedBoqItemsList), function(changedBoqItems) {
						_.forEach(changedBoqItems, function(changedBoqItem) {
							changedBoqItem.BoqItems = null;
						});
					});


					if (service.isCrbBoq()) {
						crbService.validateUniqueSubquantityKeys(service);
					}

					return updateData;
				};

				service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
					localData.asyncCalls = [];
					if (updateData && updateData.boqTextConfigGroupToSave && updateData.boqTextConfigGroupToSave.length > 0) {
						_.forEach(updateData.boqTextConfigGroupToSave, function (item) {
							if (item.Remark) {
								item.Remark = $injector.get('projectStructuresSortCodeLookupService').getCode(item.Remark);
							}
						});
					}

					// the cost group to save
					if (updateData.QtoDetailToSave && updateData.QtoDetailToSave.length > 0) {
						_.each(updateData.QtoDetailToSave, function (item) {
							if (item.QtoDetail) {
								if (item.QtoDetail.CostGroupsToCopy && item.QtoDetail.IsCopy) {
									item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
								}
							}
						});
					}

					// get user defined cost(price) value to update
					let _dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
					if(_dynamicUserDefinedColumnsService  && angular.isFunction(_dynamicUserDefinedColumnsService.isNeedUpdate) && _dynamicUserDefinedColumnsService.isNeedUpdate()) {
						updateData.UserDefinedcolsToUpdate = _dynamicUserDefinedColumnsService.getUpdateData();
					}
				};

				// Normalizes the OENORM arrays back from common object
				localData.normalizeOenExtension = function(boqItemComplete) {
					if (boqItemComplete.OenExtension) {
						for (var field in boqItemComplete.OenExtension) {
							boqItemComplete[field] = boqItemComplete.OenExtension[field];
						}
					}
					delete boqItemComplete.OenExtension;
				};

				localData.provideUpdateData = function (updateData/* , data */) {
					// Changes done to the boq items are already detected by the underlying modification tracker
					// mechanism and are delivered with the given updateData object so we currently should find here
					// an entry like updateData.BoqItem. But this is only the case when being a root service. When being a
					// child service we will find an array under the property updateData.BoqItemToSave which in turn holds the
					// complete data that is stored in updateData.BoqItem when being in root mode.

					// So we have to distinguish between root mode und child mode
					var completeEntityArray = [updateData];
					var platformDataServiceModificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
					var parentState = null;
					if (_.isObject(option.parent)) {
						// When being in child mode we have an array of complete entities that have to be visited
						var serviceRoleNode = boqServiceOption.hierarchicalNodeItem.entityRole.node;
						parentState = platformDataServiceModificationTrackingExtension.tryGetPath(updateData, service.parentService());

						var itemName = 'BoqItem'; // Fallback for the item name in this service. Usually this is the name but who can know this for certain ?!
						if (angular.isDefined(serviceRoleNode) && (serviceRoleNode !== null) && !_.isEmpty(serviceRoleNode.itemName)) {
							// Detect the name by the entry in the service role.
							itemName = serviceRoleNode.itemName;
						}

						// By convention of the platform data service factory we must append the ending 'ToSave'
						var itemNameToSave = itemName + 'ToSave';

						completeEntityArray = updateData[itemNameToSave];

						if (angular.isDefined(updateData[itemName])) {
							// This is a hack for the procurement implementation of this functionality, because there is a hack in this functionality too.
							completeEntityArray = [updateData];
						}
						else if (parentState) {
							if (_.isArray(parentState[itemNameToSave])) {
								completeEntityArray = parentState[itemNameToSave];
							}
							else {
								var procurementBoqCompleteToSave = parentState['PrcBoqCompleteToSave'];
								if (procurementBoqCompleteToSave) {
									completeEntityArray = procurementBoqCompleteToSave['BoqItemCompleteToSave'];
								}
							}
						}

						if (!_.isArray(completeEntityArray)) {
							return updateData;
						}

						angular.forEach(completeEntityArray, function (completeEntity) {
							// In this case the BoqItem property carries the changed boq item
							// -> wrap this into an array and assign it to the BoqItems property
							if(completeEntity.BoqItem){
								completeEntity.BoqItems = [completeEntity.BoqItem];
							}
						});
					}
					else {
						// When being in root mode we get a complete entity with an array of possibly changed boq items
						// -> map this to fit into the complete entity
						if (_.isArray(updateData.BoqItem)) {
							updateData.BoqItems = updateData.BoqItem;
							updateData.BoqItem = updateData.BoqItem.length > 0 ? updateData.BoqItem[0] : null;
						}
					}

					// So we now only add our own special cases of additionally updated data.
					angular.forEach(completeEntityArray, function (completeEntity) {
						var boqItem = completeEntity.BoqItem;
						var parentService = service.parentService();
						if (!boqItem) {
							boqItem = service.getSelected();
						}

						// Add affected items
						if (angular.isDefined(localData.affectedItems) && localData.affectedItems !== null) {
							completeEntity.AffectedItems = angular.copy(localData.affectedItems);
							completeEntity.EntitiesCount += localData.affectedItems.length;
						}

						// Add modified blob specification
						var modifiedBlobSpecification = localData.getModifiedSpecificationFor(boqItem);
						if (modifiedBlobSpecification) {
							completeEntity.BlobToSave = modifiedBlobSpecification;
							completeEntity.EntitiesCount += 1;
						}

						// Add boqCharacterContent items
						if (angular.isDefined(localData.boqCharacterContentItems) && localData.boqCharacterContentItems !== null) {
							completeEntity.boqCharacterContentItems = angular.copy(localData.boqCharacterContentItems);
							completeEntity.EntitiesCount += localData.boqCharacterContentItems.length;
						}

						// Add current exchange rate to complete entity so update can handle rate conversions on server side appropriately
						completeEntity.CurrentExchangeRate = service.getCurrentExchangeRate();

						const rootTaxCode   = service.getRootBoqItem() && service.getRootBoqItem().MdcTaxCodeFk || getDefaultTaxCodeFk(); // TODO: There should be always a root BOQ item. But it is not when service.getServiceName()==='boqMainServiceFactory*'. Why?
						const otherTaxCodes = _.remove(_.map(service.getList(), 'MdcTaxCodeFk'), tc => ![null,rootTaxCode].includes(tc));
						completeEntity.HasSingleValueInMdcTaxCodeFk = !_.some(otherTaxCodes);
						completeEntity.HasAnyDiscount               = _.some(service.getList(), bi => bi.Discount!==0 || bi.DiscountPercentIt!==0 || bi.LumpsumPrice!==0);

						// Add currently related main module name to complete entity
						completeEntity.MainModuleName = service.getModuleName();

						if (_.isObject(option.parent)) {
							completeEntity.HeaderId = updateData.MainItemId;
						} else {
							completeEntity.HeaderId = service.getSelectedProjectId();
						}

						if (parentService) {
							completeEntity.VatGroupId = service.getVatGroupFk();
							completeEntity.DefaultTaxCodeFk = getDefaultTaxCodeFk();
						}

						if (service.isOenBoq()) {
							// Collects/Moves the OENORM arrays to a common object
							completeEntity.OenExtension = {};
							for (var field in completeEntity) {
								if (_.startsWith(field, 'Oen') && !_.startsWith(field, 'OenExtension')) {
									completeEntity.OenExtension[field] = completeEntity[field];
									delete completeEntity[field];
								}
							}

							if (service.getModifiedOenBlobSpecifications) {
								service.getModifiedOenBlobSpecifications(completeEntity);
							}
						}
					});

					// collect the rule to save and to delete
					var boqRuleUpdateService = $injector.get('boqRuleUpdateService');
					boqRuleUpdateService.updateRuleToSave(updateData, service.getSelectedProjectId());

					// collect the param to save and to delete
					var estimateParamUpdateService = $injector.get('estimateParamUpdateService');
					estimateParamUpdateService.updateParamToSave(updateData);

					// collect the divisionType to save and to delete
					var boqDivisionTypeAssignmentUpdateService = $injector.get('boqDivisionTypeAssignmentUpdateService');
					boqDivisionTypeAssignmentUpdateService.updateDivisionTypeAssignmentToSave(updateData, updateData.EstHeaderId);

					var boqMainCommonFeaturesService = $injector.get('boqMainCommonFeaturesService');

					// the boqitem saved by detail parameters change,no need save again
					var savedBoqItemsByDetailParamsChange = boqMainCommonFeaturesService.getBoqItemSavedByDetailParamsChange();

					if (savedBoqItemsByDetailParamsChange) {
						if (updateData.BoqItem && updateData.BoqItem.Id === savedBoqItemsByDetailParamsChange.Id) {
							updateData.BoqItem = null;
						}

						if (updateData.BoqItems && updateData.BoqItems.length) {
							updateData.BoqItems = _.filter(updateData.BoqItems, function (item) {
								if (item.Id !== savedBoqItemsByDetailParamsChange.Id) {
									return item;
								}
							});
						}

						boqMainCommonFeaturesService.clearBoqItemSavedByDetailParamsChange();
					}

					// Handle MasterCostCode and ProjectCostCode Child Only here
					var boqItemProcessMasterAndProjectCC = function (boqItem) {
						// if (boqItem.IsCustomProjectCostCode === true){ //Not working for detail form
						if (boqItem.MdcCostCodeFk < 0) {
							boqItem.ProjectCostCodeFk = boqItem.MdcCostCodeFk * -1;
							boqItem.MdcCostCodeFk = null;
						}

						$timeout(function(){$injector.get('boqMainProject2CostCodeProcessor').processItem(boqItem);});
					};
					if (updateData.BoqItem) {
						boqItemProcessMasterAndProjectCC(updateData.BoqItem);
					}
					if (updateData.BoqItems && updateData.BoqItems.length) {
						_.forEach(updateData.BoqItems, function (boqItem) {
							boqItemProcessMasterAndProjectCC(boqItem);
						});
					}

					return updateData;
				};

				if (_.isObject(option.parent)) {
					// In child mode we have to redirect the merging of the updated items so all properties of the returned complete dto are merged
					var mergeInUpdateDataBack = service.mergeInUpdateData;
					serviceContainer.service.mergeInUpdateData = function mergeInUpdateData(updateData) {

						function removePropertiesBeforeMerge(boqItem) {
							// Remove the child array property, because an empty property might delete the child hierarchy on the client side
							if (angular.isDefined(boqItem.BoqItems)) {
								delete boqItem.BoqItems;
							}

							if (angular.isDefined(boqItem.BoqSurchardedItemEntities)) {
								delete boqItem.BoqSurchardedItemEntities; // In case of an update we ignore the server side given navigation property to the surcharge on items
							}
						}

						if (_.isObject(updateData[localData.itemName + 'ToSave']) && _.isArray(updateData[localData.itemName + 'ToSave'])) {
							var boqItemCompleteArray = updateData[localData.itemName + 'ToSave'];
							_.forEach(boqItemCompleteArray, function(boqItemComplete) {
								if (_.isObject(boqItemComplete.BoqItem)) {
									removePropertiesBeforeMerge(boqItemComplete.BoqItem);
								}

								if (_.isObject(boqItemComplete.BoqItems) && _.isArray(boqItemComplete.BoqItems)) {
									_.forEach(boqItemComplete.BoqItems, function (serverSideBoqItem) {
										removePropertiesBeforeMerge(serverSideBoqItem);
									});
								}

								localData.normalizeOenExtension(boqItemComplete);
							});
						}

						mergeInUpdateDataBack(updateData);

						_.forEach(updateData[serviceContainer.data.itemName + 'ToSave'], function (boqItem) {
							service.syncItemsAfterUpdate(boqItem);
						});
						localData.clearTransaction();
					};
				}

				localData.clearTransaction = function() {
					localData.modifiedSpecifications = [];

					// Enforces the refresh of the blob specification (Id, Version) as preparation step for a comming save
					var currentBoqItem = service.getSelected();
					if (currentBoqItem && currentBoqItem.BasBlobsSpecificationFk) {
						localData.loadSpecificationById(currentBoqItem.BasBlobsSpecificationFk);
					}

					localData.clearAffectedItems();
				};

				localData.addAffectedItem = function addAffectedItem(item) {
					var affectedItem = _.find(localData.affectedItems, {Id: item.Id});

					if (!option.parent) {
						// We're in root service mode, so we can properly work with the affected item list, because a modified item and its affected items are saved immediately.
						if (!affectedItem) {
							localData.affectedItems.push(item);
						}
					} else {
						// As we are in child service mode, all updates are postponed until the main entity requests the update for its child entities.
						// In this mode working with the affected item list can lead to complex maintanance work so we simply add this items as modified
						// and do not use the affected items list.
						service.markItemAsModified(item);
					}
				};

				localData.isAnAffectedItem = function isAnAffectedItem(item) {
					// Look if given item is already added to affected list.
					var i = localData.affectedItems.indexOf(item);
					var isThere = false;
					if (i !== -1) {
						isThere = true;
					}

					return isThere;
				};

				localData.removeFromAffectedItems = function removeFromAffectedItems(item) {
					// Look if given item is already added to affected list.
					var i = localData.affectedItems.indexOf(item);
					var removed = false;
					if (i !== -1) {
						localData.affectedItems.splice(i, 1);
						removed = true;
					}

					return removed;
				};

				localData.clearAffectedItems = function clearAffectedItems() {
					localData.affectedItems.length = 0;
				};

				/**
				 * @ngdoc function
				 * @name loadBoqItems
				 * @function
				 * @description Loads all boqItems belonging to the currently localData.selectedBoqHeader starting with startID down to a level of depth
				 * @param {Number} id at which the load starts from
				 * @param {Number} depth number of levels the loads fetches
				 * @param {Boolean} recalc triggering the recalculation of the boq
				 * @param {Boolean} doRefresh triggers a refresh
				 */
				localData.loadBoqItems = function loadBoqItems(id, depth, recalc, doRefresh, isPes, isWip, isBil, isCompleteCrb) {

					var callingContextForFilter = localData.getCallingContextForFilter();
					var callingContextType = _.isString(callingContextForFilter.callingContextType) ? callingContextForFilter.callingContextType : '';
					var callingContextId = _.isNumber(callingContextForFilter.callingContextId) ? callingContextForFilter.callingContextId : null;

					if (doRefresh) {
						// The following construct shall help to remember the last set filter parameters in case a refresh is wanted and not all parameters are in access any more.
						// So if one of the above parameters is undefined or null we use the last valid value of it stored in localData.lastFilterParams
						id     = angular.isDefined(id)     && (id !== null)     ? id     : localData.lastFilterParams.startId;
						depth  = angular.isDefined(depth)  && (depth !== null)  ? depth  : localData.lastFilterParams.depth;
						recalc = angular.isDefined(recalc) && (recalc !== null) ? recalc : localData.lastFilterParams.recalc;
						isPes  = angular.isDefined(isPes)  && (isPes !== null)  ? isPes  : localData.lastFilterParams.isPes;
						isWip  = angular.isDefined(isWip)  && (isWip !== null)  ? isWip  : localData.lastFilterParams.isWip;
						isBil  = angular.isDefined(isBil)  && (isBil !== null)  ? isBil  : localData.lastFilterParams.isBil;
					}

					// Due to problems with resolving parameters being undefined handed over to a web api call we precautiously check them and skip adding them so their default
					// value given on the server side web api entry point is used.
					// This has to be done due to a more restrictive behavior in ASP .NET Core when resolving parameters compared to ASP .NET.
					let filter = '';
					filter += _.isNumber(localData.selectedBoqHeader) ? 'headerid=' + localData.selectedBoqHeader : '';
					filter += _.isString(callingContextType) ? '&callingContextType=' + callingContextType : '';
					filter += _.isNumber(callingContextId) ? '&callingContextId=' + callingContextId : '';
					filter += _.isNumber(localData.selectedProjectId) ? '&projectid=' + localData.selectedProjectId : '';
					filter += _.isNumber(id) ? '&startID=' + id : '';
					filter += _.isNumber(depth) ? '&depth=' + depth : '';
					filter += _.isNumber(recalc) ? '&recalc=' + recalc : '';
					filter += _.isBoolean(isPes) ? '&isPes=' + isPes : '';
					filter += _.isBoolean(isWip) ? '&isWip=' + isWip : '';
					filter += _.isBoolean(isBil) ? '&isBil=' + isBil : '';
					filter += _.isNumber(service.getCurrentExchangeRate()) ? '&exchangeRate=' + service.getCurrentExchangeRate() : '';
					filter += _.isBoolean(isCompleteCrb) ? '&isCompleteCrb=' + isCompleteCrb : '';

					service.setFilter(filter);

					// Remember the last set filter parameters
					localData.lastFilterParams.startId = id;
					localData.lastFilterParams.depth = depth;
					localData.lastFilterParams.recalc = recalc;
					localData.lastFilterParams.isPes = isPes;
					localData.lastFilterParams.isWip = isWip;
					localData.lastFilterParams.isBil = isBil;

					return service.load(); // Return promise to be able to react on it being resolved.
				};

				/**
				 * @ngdoc function
				 * @name getLoadedBoqItemByDictionary
				 * @function
				 * @description The loaded boq items are saved into a dictionary (boqItemId -> boqItem) and can easily be accessed now
				 * @param {Number} boqItemId : id of the boqItem that is requested
				 * @returns {Object} boqItem : with the given boqItemId
				 */
				localData.getLoadedBoqItemByDictionary = function getLoadedBoqItemByDictionary(boqItemId) {

					let loadedBoqItem = null;

					if(_.isNumber(boqItemId) && _.isArray(localData.itemList) && localData.itemList.length > 0) {

						if(!localData.loadedBoqItemDictionary) {
							// The dictionary hasn't been loaded yet or has been emptied before, so load it now
							localData.loadedBoqItemDictionary = {};
							_.forEach(localData.itemList, function(boqItem) {
								if (_.isObject(boqItem) && !_.isObject(localData.loadedBoqItemDictionary[boqItem.Id])) {
									localData.loadedBoqItemDictionary[boqItem.Id] = boqItem;
								}
							});

							if(Object.prototype.hasOwnProperty.call(localData.loadedBoqItemDictionary, boqItemId.toString())) {
								loadedBoqItem = localData.loadedBoqItemDictionary[boqItemId];
							}
						}
					}

					return loadedBoqItem;
				};

				/**
				 * @ngdoc function
				 * @name reloadBasedOnNewRoot
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Resets all relevant internal state properties and reinitializes them with the new root item.
				 * If no root item is passed this functions simply acts as a reset.
				 * @param {Object} newRootBoqItem : root boqItem to be set as new root
				 */
				service.reloadBasedOnNewRoot = function reloadBasedOnNewRoot(newRootBoqItem) {
					localData.selectedBoqHeader = 0;

					if (newRootBoqItem) {
						service.setSelectedHeaderFk(newRootBoqItem.BoqHeaderFk, false, newRootBoqItem.isPes, newRootBoqItem.isWip, newRootBoqItem.isBil);
					}
				};

				/**
				 * @ngdoc function
				 * @name saveBoqItems
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Save the modified elements that are held in the internal modification tracking variables.
				 * Currently we only delegate the call to the underlying data service factory function
				 */
				service.saveBoqItems = function saveBoqItems() {
					if (_.isObject(option.parent)) {
						// When being a child service the upate is triggered by the root service of the module.
						// Currently we cannot reach the root service, because we dont't know the exact aggregation of this service.
						return $q.when(false);
					} else {
						// When being a root service we can directly do the update
						return service.update();
					}
				};

				/**
				 * @ngdoc function
				 * @name syncItemsAfterUpdate
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description This function updates all client side objects with the new state that's returned by a successful update call from the server
				 * @param {Object} responseData : Object holding all items that have been updated by the last update call to the server
				 */
				service.syncItemsAfterUpdate = function syncItemsAfterUpdate(responseData) {
					if (!responseData) {
						return;
					}

					var updatedBoqItems = [];
					var notYetSavedBoqItemIndex = -1;
					var boqRootItem = null;
					var boqRootItemPermissionObjectInfo = null;

					// We have to update the state of the client side boqItems according to the state coming from the corresponding objects being returned by the response object.
					// Especially the version property will have changed according to a successful update.
					if (_.isArray(responseData.BoqItems)) {

						_.forEach(responseData.BoqItems, function (serverSideBoqItem) {
							// Find the client side reference of the updated boqItem
							var clientSideBoqItem = service.getBoqItemById(serverSideBoqItem.Id);
							// service.resolveMasterAndProjectCostCode(clientSideBoqItem);

							boqRootItem = service.getRootBoqItem();
							boqRootItemPermissionObjectInfo = (angular.isDefined(boqRootItem) && boqRootItem !== null) ? boqRootItem.PermissionObjectInfo : null;
							if (clientSideBoqItem) {
								// Update the client side version with the server side version of this boqItem.
								// Remove the child array property, because an empty property might delete the child hierarchy on the client side
								if (angular.isDefined(serverSideBoqItem.BoqItems)) {
									delete serverSideBoqItem.BoqItems;
								}

								if (angular.isDefined(serverSideBoqItem.BoqSurchardedItemEntities)) {
									delete serverSideBoqItem.BoqSurchardedItemEntities; // In case of an update we ignore the server side given navigation property to the surcharge on items
								}
								angular.extend(clientSideBoqItem, serverSideBoqItem);

								if (_.isArray(clientSideBoqItem.BoqItems)) {
									clientSideBoqItem.HasChildren = clientSideBoqItem.BoqItems.length > 0;
								}

								// Patch PermissionObjectInfo of boqRootItem to corresponding boqItem
								service.patchPermissionObjectInfo(clientSideBoqItem, boqRootItemPermissionObjectInfo);

								// If this item has just been created, remove it form the notYetSavedBoqItems list
								if (localData.notYetSavedBoqItems.length > 0) {
									notYetSavedBoqItemIndex = localData.notYetSavedBoqItems.indexOf(serverSideBoqItem.Id);

									if (notYetSavedBoqItemIndex >= 0) {
										// Remove this id because the item has just been saved after it had been created
										localData.notYetSavedBoqItems.splice(notYetSavedBoqItemIndex, 1);
									}
								}

								updatedBoqItems.push(clientSideBoqItem);
							}
						});
					}

					var currentItem = (responseData.BoqItem !== null) ? responseData.BoqItem : service.getSelected();

					// must update tc flags
					var tcService = service.getTextComplementService();
					if (tcService && _.isObject(currentItem) && _.isEmpty(currentItem.BoqTextComplementEntities)) {
						tcService.updateTcIndicator(currentItem);
					}

					if (_.isObject(responseData.BoqItem) && _.isObject(currentItem) && angular.isDefined(currentItem.BoqSurchardedItemEntities)) {
						delete currentItem.BoqSurchardedItemEntities; // In case of an update we ignore the server side given navigation property to the surcharge on items
					}

					// We also get the objects in the parent chain of the updated items returned, because may have also been changed on the server side
					// due to some calculations that had to be performed for example
					if (responseData.AffectedItems) {
						boqRootItem = service.getRootBoqItem();
						boqRootItemPermissionObjectInfo = (angular.isDefined(boqRootItem) && boqRootItem !== null) ? boqRootItem.PermissionObjectInfo : null;
						for (var i = 0; i < responseData.AffectedItems.length; i++) {
							// Find the client side reference of the updated boqItem
							var parentBoqItem = service.getBoqItemById(responseData.AffectedItems[i].Id);
							if (parentBoqItem) {
								// Update the client side version with the server side version of this boqItem.
								// Remove the child array property, because an empty property might delete the child hierarchy on the client side
								if (responseData.AffectedItems[i] && angular.isDefined(responseData.AffectedItems[i].BoqItems)) {
									delete responseData.AffectedItems[i].BoqItems;
								}

								const briefInfo = parentBoqItem.BriefInfo; // The brief is not translated (to reduce database accesses) and also not changed on the server. After the copy it has to be repaired.
								angular.extend(parentBoqItem, responseData.AffectedItems[i]);
								parentBoqItem.BriefInfo = briefInfo;

								if (_.isArray(parentBoqItem.BoqItems)) {
									parentBoqItem.HasChildren = parentBoqItem.BoqItems.length > 0;
								}

								// Patch PermissionObjectInfo of boqRootItem to corresponding parentBoqItem/affectedItem
								service.patchPermissionObjectInfo(parentBoqItem, boqRootItemPermissionObjectInfo);

								updatedBoqItems.push(parentBoqItem);
							}
						}
					}

					// Force updated items to be refreshed in grid
					_.forEach(updatedBoqItems, function (boqItem) {
						service.resolveMasterAndProjectCostCode(boqItem);
						service.calcTotalPrice(boqItem);
						service.fireItemModified(boqItem);
					});

					if (localData.boqCharacterContentItems && localData.boqCharacterContentItems.length > 0) {
						localData.clearBoqCharacterContentItems();
					}
				};

				/**
				 * @ngdoc function
				 * @name cancelUpdate
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description does specific tasks when an update call is cancelled
				 */
				service.cancelUpdate = function cancelUpdate() {
					localData.clearTransaction();
				};

				service.fireListLoaded = function fireListLoaded(isDragAndDrop) {
					localData.listLoaded.fire({setTreeGridLevel: !isDragAndDrop});
				};

				/**
				 * @ngdoc function
				 * @name isAnAffectedItem
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Checks if the given item is included in the affected item list
				 * @param {Object} item to be checked
				 * @returns {Boolean} indicating if the item included
				 */
				service.isAnAffectedItem = function isAnAffectedItemServiceFunction(item) {
					return localData.isAnAffectedItem(item);
				};

				/**
				 * @ngdoc function
				 * @name removeFromAffectedItems
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Remove the given item if its included in the affected item list
				 * @param {Object} item to be removed
				 * @returns {Boolean} indicating if the item was found and removed
				 */
				service.removeFromAffectedItems = function removeFromAffectedItemsServiceFunction(item) {
					localData.removeFromAffectedItems(item);
				};

				/**
				 * @ngdoc function
				 * @name hasItemBeenSavedYet
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description For currently the version nunmber of the boqItems can not tell clearly if the item has just been created or already saved
				 * we need some special functionality to do the check. Currently an array is maintained with the ids of the created but not yet saved items.
				 * This array serves as base for the following function.
				 * @param {Object} boqItem: boq item to be checked
				 * @returns {Booelan} : returns if the given boq item hase been saved yet by an update or it it is only in just created state
				 */
				service.hasItemBeenSavedYet = function hasItemBeenSavedYet(boqItem) {

					if (angular.isUndefined(boqItem) || boqItem === null) {
						return false;
					}

					var notYetSavedBoqItemIndex = localData.notYetSavedBoqItems.indexOf(boqItem.Id);

					return (notYetSavedBoqItemIndex === -1);
				};

				/**
				 * @ngdoc function
				 * @name clearModifications
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Give access to doClearModifications of underlying data service factory
				 * @param {Object} entity : to be cleared from modified list
				 * @param {Boolean} clearDeletedItems : forces the delete items list also to be cleared
				 */
				service.clearModifications = function clearModifications(entity, clearDeletedItems) {
					localData.doClearModifications(entity, localData);

					if (_.isObject(option.parent)) {
						var platformDataServiceModificationTrackingExtension = $injector.get('platformDataServiceModificationTrackingExtension');
						var platformModuleStateService = $injector.get('platformModuleStateService');
						var parentState = null;

						// When being in child mode we have an array of complete entities that have to be visited
						var modState = platformModuleStateService.state(service.getModule());
						parentState = platformDataServiceModificationTrackingExtension.tryGetPath(modState.modifications, service.parentService());

						if (clearDeletedItems && parentState && _.isArray(parentState[localData.itemName + 'ToDelete'])) {
							parentState[localData.itemName + 'ToDelete'].length = 0;
						}
					}
				};

				// #endregion
				//  endregion


				//  region Reference/LineType
				// #region

				/* jshint -W074 */ // cyclomatic complexity
				localData.getDivisionLineTypeByLevel = function getDivisionLineTypeByLevel(level) {
					if (!level && (level < 1 || level > 9)) {
						return; // Currently only levels between 1 and 9 are supported
					}

					return boqMainLineTypes['level' + level]; // return divisionLineType
				};

				localData.getLevelOfBoqItem = function getLevelOfBoqItem(boqItem) {
					// Determine the hierarchical level of the given boqItem
					if (!boqItem) {
						return -1; // no level
					}

					// Usually the boqItem objects maintain a so called node info when used inside of slickgrid.
					// This node info holds the level of the corresponding item. So first, try to find the level of
					// the item via this node info.
					// TODO: Is it appropriate to use node info as coming from UI element here?
					// TODO: NO !!! Because this information is linked to slickgrid which we can not assume to always be the gird in use !!!
					if (boqItem.nodeInfo && angular.isObject(boqItem.nodeInfo)) {
						return boqItem.nodeInfo.level;
					} else {
						// There exists no node info so we have to go the hard way and find the level of the item by iterating through the parent hierarchy
						var boqItemParent = localData.getParentBoqItem(boqItem);
						var level = 0; // If the given boqIem has no parent it's the root item and is assigned to level 0.

						while (boqItemParent !== null) {
							level++;
							boqItemParent = localData.getParentBoqItem(boqItemParent); // TODO: Climbing up the hierarchy this way is not very fast. Have to look for better ways.
						}
						return level;
					}
				};

				/**
				 * @ngdoc function
				 * @name isSpecialLine
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Determine if the given boqItem is a so called special line
				 * @param {Object} boqItem : to be investigated
				 * @returns {Boolean} indicating if the given boqItem is a so called special line
				 */
				localData.isSpecialLine = function isSpecialLine(boqItem) {
					if (!boqItem) {
						return false;
					} else {
						return (
							boqItem.BoqLineTypeFk === boqMainLineTypes.root ||
							boqItem.BoqLineTypeFk === boqMainLineTypes.chapterSeparator ||
							boqItem.BoqLineTypeFk === boqMainLineTypes.mediaLine);// ||
						// boqItem.BoqLineTypeFk === boqMainLineTypes.leadingLine); // the leading line has a reference so it has to be considered, too.
					}
				};

				/**
				 * @ngdoc function
				 * @name getReferenceNumberDelimiter
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Determine the currently active delimiter for reference numbers.
				 * This depends on the currently active boq standard.
				 * @param {Boolean} returnStringWhenFree triggers the return of an emtpy string when being a free boq else it returns null
				 * @returns {String} representing the current boq reference number delimiter
				 */
				localData.getReferenceNumberDelimiter = function getReferenceNumberDelimiter(returnStringWhenFree) {
					var ret;

					if (service.isFreeBoq()) {
						if (angular.isDefined(returnStringWhenFree) && (returnStringWhenFree !== null) && returnStringWhenFree) {
							ret = '';
						} else {
							ret = null;
						}
					} else // GAEB and CRB
					{
						ret = '.';
					}

					return ret;
				};

				/**
				 * @ngdoc function
				 * @name removeDotAtEnd
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Remove the dot in the given reference string if it is at the end
				 * @param {String} reference: whose final dot is to be removed
				 * @returns {String} reference without final dot
				 */
				localData.removeDotAtEnd = function removeDotAtEnd(reference) {
					var referenceWithoutFinalDot = reference;
					var dotIndex = -1;

					if (!_.isEmpty(reference) && service.isGaebBoq()) {

						dotIndex = reference.indexOf(localData.getReferenceNumberDelimiter());

						if (dotIndex !== -1) {

							// Check if dot is at end of string
							dotIndex = reference.lastIndexOf(localData.getReferenceNumberDelimiter());
							if (dotIndex === reference.length - 1) {
								// Remove last dot to better be able to extract last reference part
								referenceWithoutFinalDot = reference.substring(0, reference.length - 1);

							}
						}
					}

					return referenceWithoutFinalDot;
				};

				/**
				 * @ngdoc function
				 * @name extractReferencePartOnLevel
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Extract reference part of the given boqItem reference on the given level
				 * @param {Object} boqItem: with related reference number
				 * @param {String} reference: whose reference part is to be extracted
				 * @param {Number} level: on which the reference part is to be extracted
				 * @returns {String} extracted reference part of given reference
				 */
				localData.extractReferencePartOnLevel = function extractReferencePartOnLevel(boqItem, reference, level) {
					var referencePart = '';
					var levelOfBoqItem = localData.getLevelOfBoqItem(boqItem);

					if (boqItem && !_.isEmpty(reference)) {

						if (service.isFreeBoq()) {
							// In this mode there is no specific reference part related to a level
							return reference;
						} else if (service.isGaebBoq()) {
							if (level === -1) {
								// Seems there was a problem determining the level by getLineTypeLevel
								// Maybe comes from a "Non Enforced" setting in the boq document property settings.
								// As a workaround in this situation we use another function to determine the level of the
								// reference part to be extracted.
								level = levelOfBoqItem;
							}

							var refParts = reference.trim().split(localData.getReferenceNumberDelimiter());

							if (angular.isDefined(refParts) && _.isArray(refParts) && refParts.length > 0 && level > 0) {

								if (level > refParts.length - 1) {
									level = refParts.length - 1;
								}

								referencePart = level - 1 < 0 ? refParts[0].trim() : refParts[level - 1].trim();
							}
						}
					}

					return referencePart;
				};

				/**
				 * @ngdoc function
				 * @name getLineTypeLevel
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Determine the hierarchical level of the given lineType
				 * @param {Number} lineType: whose level is to be determined
				 * @returns {Number} determined level of given lineTpye
				 */
				localData.getLineTypeLevel = function getLineTypeLevel(lineType) {
					var level = -1;
					var structureDetail = null;

					if (service.isFreeBoq()) {
						// In this mode there is no level related to a specific lineType
						return level;
					} else // GAEB and CRB
					{
						structureDetail = boqStructureService.getStructureDetailByLineType(lineType);

						if (angular.isDefined(structureDetail) && (structureDetail !== null) && _.isNumber(structureDetail.level)) {
							level = structureDetail.level;
						} else {
							console.log('boqMainServiceFactory: getLineTypeLevel -> no fitting structure detail or level found !!');
						}
					}

					return level;
				};

				/**
				 * @ngdoc function
				 * @name findReference
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Find a new reference for the current item based on various parameters given
				 * @param {Object} currentItem : the currently selected item
				 * @param {Object} previousItem : to the current item. The order is given by the sequence of references of the sibling items
				 * @param {Object} nextItem : to the current item. The order is given by the sequence of references of the sibling items
				 * @param {Number} lineType : of the item for which a reference is searched
				 * @param {Boolean} doAppend : item is appended to the current item (true) or inserted before (false)
				 * @param {Object} newReferenceContainer : container object holding two properties, 'newReference' and 'numberOfReferences', can be initialized with empty object
				 * @param {Boolean} ignoreNextItem : forces to ignore the next item in the reference creation logic
				 * @param {String} alreadyUsedReference: the reference that is already in use although it has just been created by a findReference call
				 * @returns {Boolean} indicating if a new reference number could be found
				 */
				localData.findReference = function findReference(currentItem, previousItem, nextItem, lineType, doAppend, newReferenceContainer, ignoreNextItem, alreadyUsedReference) {
					var result = false;
					var canCreateAlphanumerical = true;
					var neighborItem = null;
					var s1 = '';
					var s2 = '';
					var createNewAtEnd = false;
					var currentParent = angular.isDefined(currentItem) && (currentItem !== null) ? localData.getParentBoqItem(currentItem) : null;
					var lastSiblingItem = null;
					var siblingsWithReference = null;

					if (angular.isDefined(currentParent) && (currentParent !== null)) {
						if (currentParent && currentParent.BoqItems && currentParent.BoqItems.length > 0) {
							siblingsWithReference = _.filter(currentParent.BoqItems, function (siblingItem) {
								return !boqMainCommonService.isTextElementWithoutReference(siblingItem);
							});
							lastSiblingItem = (_.isArray(siblingsWithReference) && siblingsWithReference.length > 0) ? siblingsWithReference[siblingsWithReference.length - 1] : null;
						}
					}

					var structureDetail = boqStructureService.getStructureDetailByLineType(lineType);

					if (!currentItem && (angular.isUndefined(alreadyUsedReference) || !_.isString(alreadyUsedReference) || _.isEmpty(alreadyUsedReference))) {
						// In this case we assume that we create the first child element of the hierarchy
						newReferenceContainer.newReference = structureDetail.StartValue.toString();
						return true;
					} else if (localData.isSpecialLine(currentItem)) {
						if (currentParent && currentParent.BoqItems && currentParent.BoqItems.length > 0) {
							s1 = '0';

							var currentChild = currentParent.BoqItems[0];
							if (!currentChild) {/* Workaround for bad data. Sometimes first child is of type BoqDetailVM */
								s2 = currentChild.Reference;
								structureDetail = boqStructureService.getStructureDetailByLineType(currentChild.BoqLineTypeFk);
							}
						} else if (doAppend) {
							result = true;
						}
					} else {
						if (structureDetail !== null && structureDetail !== undefined) {
							if (angular.isDefined(alreadyUsedReference) && _.isString(alreadyUsedReference) && !_.isEmpty(alreadyUsedReference)) {
								// We use the already used reference as new start value for finding a new free reference number
								s1 = localData.extractReferencePartOnLevel(currentItem, alreadyUsedReference, localData.getLineTypeLevel(lineType));
							} else if (!_.isEmpty(currentItem.Reference)) {
								s1 = localData.extractReferencePartOnLevel(currentItem, currentItem.Reference, localData.getLineTypeLevel(lineType));
							} else {
								if (structureDetail.DataType === boqMainStructureDetailDataType.numeric) {
									s1 = structureDetail.StartValue.toString();
								} else {
									// s1 = "A";
									// s1 = Convert.ToString((char)(((int)s1.ToCharArray()[s1.Length - 1]) - 1));
									canCreateAlphanumerical = false;
								}
							}
							if (doAppend) {
								if (ignoreNextItem || nextItem === null) {
									createNewAtEnd = true;
									if (structureDetail.DataType === boqMainStructureDetailDataType.numeric) {
										s2 = '0';
									} else {
										var asciiCode;
										switch (s1.length) {
											case 0:
												canCreateAlphanumerical = false;
												break;
											case 1:
												asciiCode = s1.charCodeAt(0) + 2;
												s2 = String.fromCharCode(asciiCode);
												// s2 = Convert.ToString((char)(((int)s1.ToCharArray()[s1.Length - 1]) + 2));
												break;
											default:
												asciiCode = s1.charCodeAt(s1.length - 1) + 2;
												s2 = s1.substring(0, s1.length - 1) + String.fromCharCode(asciiCode);
												// s2 = s1.Substring(0, s1.Length - 1) + Convert.ToString((char)(((int)s1.ToCharArray()[s1.Length - 1]) + 2));
												break;
										}
									}
								} else {
									neighborItem = nextItem;
								}
							} else {
								if (previousItem === null) {
									if (structureDetail.DataType === boqMainStructureDetailDataType.numeric) {
										// numerical
										s2 = '0';
									} else {
										canCreateAlphanumerical = false;
									}
								} else {
									neighborItem = previousItem;
								}
							}

							if (neighborItem !== null) {
								if (!_.isEmpty(neighborItem.Reference)) {
									s2 = localData.extractReferencePartOnLevel(neighborItem, neighborItem.Reference, localData.getLineTypeLevel(lineType));
								} else {
									if (structureDetail.DataType === boqMainStructureDetailDataType.numeric) {
										// numerical
										s2 = '0';
									} else {
										canCreateAlphanumerical = false;
									}
								}
							}
						}
					}

					if (structureDetail) {
						result = boqMainCommonService.generateReference(s1, s2, doAppend, canCreateAlphanumerical, createNewAtEnd, structureDetail.DataType, structureDetail.Stepincrement, structureDetail.LengthReference, false, newReferenceContainer, localData.compareReferences);

						if (!result && doAppend && (lastSiblingItem !== null)) {
							// Finding a new reference via append didn't work so we try to add the new item at the end
							createNewAtEnd = true;
							doAppend = false;
							s1 = localData.extractReferencePartOnLevel(lastSiblingItem, lastSiblingItem.Reference, localData.getLineTypeLevel(lineType));
							s2 = '0';
							result = boqMainCommonService.generateReference(s1, s2, doAppend, canCreateAlphanumerical, createNewAtEnd, structureDetail.DataType, structureDetail.Stepincrement, structureDetail.LengthReference, false, newReferenceContainer, localData.compareReferences);
						}
					}

					return result;
				};

				/**
				 * @ngdoc function
				 * @name canFindReference
				 * @function
				 * @methodOf
				 * @description Determines if reference number can be generated at current item position
				 * @param {Object} currentItem for which a reference is searched
				 * @param {Object} boqStructure needed structure information
				 * @param {Number} lineType : of the item for which a reference is searched
				 * @param {Number} level of the boqItem for which a referenced number is looked up
				 * @param {Object} visitorObject tells if the paste mode is active
				 * @returns {Boolean} indicating if the reference number can be generated at current item position
				 */
				localData.canFindReference = function canFindReference(currentItem, boqStructure, lineType, level, visitorObject) {

					if (!currentItem || !boqStructure && !level) {
						return false;
					}

					var currentItemLevel = localData.getLevelOfBoqItem(currentItem);

					if (angular.isDefined(visitorObject) && (visitorObject !== null) && visitorObject.paste) {
						// When doing a paste of an item hierarchy we set the currentItemLevel always one level higher than the requested level.
						// This fixed setting is necessary, because the level of the pasted elements can't generally be determined by a call to
						// getLevelOfBoqItem, because they may arise from a different boq item hierarchy, but when pasting we always want to add the new
						// elements at this level.
						currentItemLevel = level - 1;
					}

					// Determine previous and next item
					var previousNextContainer = {};
					var previousItem = null;
					var nextItem = null;
					var siblingsWithReference = null;

					if (currentItemLevel === level) {
						localData.getPreviousAndNextItem(currentItem, previousNextContainer, true);
						previousItem = previousNextContainer.previousItem;
						nextItem = previousNextContainer.nextItem;
					} else if (currentItemLevel === (level - 1)) {
						// Now we have to investigate if there are child items
						if (currentItem.BoqItems && currentItem.BoqItems.length > 0) {
							// There are children and we set the current item to the last item in the childrens order
							// so the reference will be created at the end
							siblingsWithReference = _.filter(currentItem.BoqItems, function (siblingItem) {
								return !boqMainCommonService.isTextElementWithoutReference(siblingItem);
							});
							currentItem = (_.isArray(siblingsWithReference) && siblingsWithReference.length > 0) ? siblingsWithReference[siblingsWithReference.length - 1] : null;
							localData.getPreviousAndNextItem(currentItem, previousNextContainer, true);
							previousItem = previousNextContainer.previousItem;
							nextItem = previousNextContainer.nextItem;
						} else {
							// We have no children so there are no previous and next items
							currentItem = null;
							previousItem = null;
							nextItem = null;
						}
					} else {
						// We always expect the new item to be added on the same or on the child level
						// in relation to the currently selected item. This assumption is not met here
						// so this an error.
						$log.log('boqMainServiceFactory -> canfindReference : wrong requested level of new item');
						return false;
					}

					var tempRefContainer = {};
					var result = localData.findReference(currentItem, previousItem, nextItem, lineType, true, tempRefContainer, false);
					if (result) {
						if ((!localData.isSpecialLine(currentItem)) && (boqStructure.EnforceStructure || !boqMainCommonService.isFreeBoqType(boqStructure))) {
							var structureDetail = boqStructureService.getStructureDetailByLineType(lineType/* currentItem.BoqLineTypeFk */);
							if (structureDetail !== null) {
								var allowedLength = structureDetail.LengthReference;
								result = (tempRefContainer && tempRefContainer.newReference && !boqMainCommonService.isReferenceMaxLengthExceeded(tempRefContainer.newReference.length, allowedLength));
							}
						}
					}

					return result;
				};

				/**
				 * @ngdoc function
				 * @name determineSkippedDivisionRefPart
				 * @function
				 * @methodOf
				 * @description Determine if there is a skipped division involved with the currently selected item
				 * and create the reference parts that represent these skipped divisions by fitting blanks and dots.
				 * @param {Object} parentItem of the item that gets a new reference
				 * @param {Number} lineType of the item whose reference is created
				 * @returns {String} representing the reference parts of the skipped divisions
				 */
				/* jshint -W073 */ // nested too deeply
				localData.determineSkippedDivisionRefPart = function determineSkippedDivisionRefPart(parentItem, lineType) {

					var referencePartOfSkippedDivision = '';
					var levelOfItem = -1;
					var structureDetailOfLineType = null;
					var structureDetail = null;

					if (!_.isObject(parentItem) || !_.isNumber(lineType) || lineType < 0) {
						return '';
					}

					levelOfItem = localData.getLevelOfBoqItem(parentItem) + 1;
					structureDetailOfLineType = boqStructureService.getStructureDetailByLineType(lineType);

					if (_.isObject(structureDetailOfLineType) && levelOfItem > 0 && structureDetailOfLineType.level > levelOfItem) {
						for (var i = levelOfItem; i < structureDetailOfLineType.level; i++) {
							structureDetail = boqStructureService.getStructureDetailByLineType(i);
							if (_.isObject(structureDetail)) {
								referencePartOfSkippedDivision = _.repeat(' ', structureDetail.LengthReference) + localData.getReferenceNumberDelimiter() + referencePartOfSkippedDivision;
							} else {
								console.log('boqMainServiceFactory.determineSkippedDivisionRefPart: Determination of structure detail failed!');
								break;
							}
						}
					} else {
						return '';
					}

					return referencePartOfSkippedDivision;
				};

				/**
				 * @ngdoc function
				 * @name generateBoqReference
				 * @function
				 * @methodOf
				 * @description Generates a new reference for a boq item
				 * @param {Object} parentItem for the item whose reference is to be created
				 * @param {Object} selectedItem currently selected item
				 * @param {Object} creationData
				 * @param {Boolean} insertAtEnd indicates that the new item has to be placed at the end of all sibling items on the given level
				 * @returns {String} the new created reference
				 */
				/* jshint -W073 */ // nested too deeply
				localData.generateBoqReference = function generateBoqReference(parentItem, selectedItem, creationData, insertAtEnd) {

					var lineType = creationData.lineType;
					var boqStructure = boqStructureService.getStructure();
					var structureDetail = boqStructureService.getStructureDetailByLineType(lineType);
					var generatedReference = '';
					var startValue = 0;
					var alreadyExistingItem = null;
					var previousNextContainer = {};
					var previousItem = null;
					var nextItem = null;
					var referenceContainer = {};
					var leadingZerosPart = '';
					var leadingZerosChar = boqStructure.LeadingZeros ? '0' : ' ';
					var parentReference = angular.isDefined(parentItem) && (parentItem !== null) ? parentItem.Reference : '';
					var siblings = null;

					if (!selectedItem || !structureDetail) {
						return ''; // Without a valid structure info or incoming 'selectedItem' we can't create a reference
					}

					if (service.isCrbBoq()) {
						generatedReference = crbService.generateBoqReference(lineType===1 ? service.getRootBoqItem() : parentItem, selectedItem, lineType);
					}
					else if (service.isOenBoq()) {
						generatedReference = oenService.generateBoqReference(service, lineType);
					}
					else {
						leadingZerosPart = '';
						leadingZerosChar = leadingZerosChar = boqStructure.LeadingZeros ? '0' : ' ';
						startValue = structureDetail.StartValue;
						if (!parentItem) {
							generatedReference = startValue.toString();
						} else {
							// Exclude leading lines from sibling list
							siblings = _.filter(parentItem.BoqItems, function (item) {
								return !boqMainCommonService.isTextElementWithoutReference(item);
							});

							// Remove final dot of parent reference
							parentReference = localData.removeDotAtEnd(parentReference);

							if (siblings.length === 0) {
								if (!boqMainCommonService.isReferenceMaxLengthExceeded(startValue.toString().length, structureDetail.LengthReference)) {
									for (var i = 1; i <= (structureDetail.LengthReference - startValue.toString().length); i++) {
										leadingZerosPart += leadingZerosChar;
									}
								}
								generatedReference = localData.isSpecialLine(parentItem) ? localData.determineSkippedDivisionRefPart(parentItem, lineType) + leadingZerosPart + startValue.toString() : _.isEmpty(parentReference) ? '' : parentReference + localData.getReferenceNumberDelimiter(true) + localData.determineSkippedDivisionRefPart(parentItem, lineType) + leadingZerosPart + startValue;
							} else {
								if ((parentItem.Id === selectedItem.Id) || !!insertAtEnd) {
									// Append child element at the end of all sibling items
									selectedItem = (siblings.length > 0) ? siblings[siblings.length - 1] : parentItem; // I want to append it at the end TODO: Don't know if 'parentItem' is ok or better set null ??
								}

								localData.getPreviousAndNextItem(selectedItem, previousNextContainer, true, true);
								previousItem = previousNextContainer.previousItem;
								nextItem = previousNextContainer.nextItem;

								if (localData.findReference(selectedItem, previousItem, nextItem, lineType, true, referenceContainer, false)) {
									if (!boqMainCommonService.isReferenceMaxLengthExceeded(referenceContainer.newReference.length, structureDetail.LengthReference)) {
										for (var j = 1; j <= (structureDetail.LengthReference - referenceContainer.newReference.length); j++) {
											leadingZerosPart += leadingZerosChar;
										}
									}

									if (!_.isEmpty(referenceContainer.newReference)) {
										if (service.isFreeBoq()) {
											// In free mode we don't take the parent reference into account because it was already merged into the first created reference number for this hierarchy and will
											// now be increased by every further call of a new reference number
											generatedReference = leadingZerosPart + referenceContainer.newReference;
										} else {
											generatedReference = localData.isSpecialLine(parentItem) ? localData.determineSkippedDivisionRefPart(parentItem, lineType) + leadingZerosPart + referenceContainer.newReference : parentReference + localData.getReferenceNumberDelimiter(true) + localData.determineSkippedDivisionRefPart(parentItem, lineType) + leadingZerosPart + referenceContainer.newReference;
										}
									}
								}
							}
						}

						if (!_.isEmpty(generatedReference) && !service.isFreeBoq() && (generatedReference.lastIndexOf(localData.getReferenceNumberDelimiter()) !== generatedReference.length - 1)) {
							// Add final dot
							generatedReference += localData.getReferenceNumberDelimiter(true);
						}

						// Check if there is already an item with this reference number
						// If so start a new turn in finding a free new reference number.
						// Currently this is only neccessary in free mode for then the user can enter any reference number on any level without respect to the parent reference number.
						alreadyExistingItem = service.isFreeBoq() ? service.getBoqItemByReference(generatedReference) : null;

						var lastId = null;   // remember inspected id

						while (angular.isDefined(alreadyExistingItem) && (alreadyExistingItem !== null)) {
							if (localData.findReference(selectedItem, previousItem, nextItem, lineType, true, referenceContainer, false, generatedReference)) {
								if (!boqMainCommonService.isReferenceMaxLengthExceeded(referenceContainer.newReference.length, structureDetail.LengthReference)) {
									for (var k = 1; k <= (structureDetail.LengthReference - referenceContainer.newReference.length); k++) {
										leadingZerosPart += leadingZerosChar;
									}
								}

								if (!_.isEmpty(referenceContainer.newReference)) {
									if (service.isFreeBoq()) {
										// In free mode we don't take the parent reference into account because it was already merged into the first created reference number for this hierarchy and will
										// now be increased by every further call of a new reference number
										generatedReference = leadingZerosPart + referenceContainer.newReference;
									} else {
										generatedReference = localData.isSpecialLine(parentItem) ? localData.determineSkippedDivisionRefPart(parentItem, lineType) + leadingZerosPart + referenceContainer.newReference : parentReference + localData.getReferenceNumberDelimiter(true) + localData.determineSkippedDivisionRefPart(parentItem, lineType) + leadingZerosPart + referenceContainer.newReference;
									}
								}

								if (!_.isEmpty(generatedReference) && !service.isFreeBoq() && (generatedReference.lastIndexOf(localData.getReferenceNumberDelimiter()) !== generatedReference.length - 1)) {
									// Add final dot
									generatedReference += localData.getReferenceNumberDelimiter(true);
								}

								alreadyExistingItem = service.isFreeBoq() ? service.getBoqItemByReference(generatedReference) : null;

								// todo: workaround to avoid endless loop when entering chinese signs as reference
								if (alreadyExistingItem !== null) {
									if (lastId === alreadyExistingItem.Id) {
										alreadyExistingItem = null;
									} else {
										lastId = alreadyExistingItem.Id;
									}
								}

							} else {
								break; // No fitting reference numbe could be created
							}
						}
					}

					return generatedReference;
				};

				/**
				 * @ngdoc function
				 * @name isReferenceValidForThisItem
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description check if the given reference number is valid for this item also with respect to the currently active boq structure settings
				 * @param {String} reference to be validated against the given boq item
				 * @param {Object} item the reference is validated against
				 * @param {Object} errorMessage is an object holding the string with the error message
				 * @returns {Boolean} indicating if the given reference is valid for this boq item
				 */
				service.isReferenceValidForThisItem = function isReferenceValidForThisItem(reference, item, errorMessage) {

					var internalErrorMessage = _.isObject(errorMessage) ? errorMessage : {};

					if (!Object.prototype.hasOwnProperty.call(internalErrorMessage, 'errorMessage')) {
						internalErrorMessage.errorMessage = '';
					}

					// Do some initial checks
					if (angular.isUndefined(item) || item === null || angular.isUndefined(reference) || reference === null || _.isEmpty(reference)) {
						return false;
					}

					var parentItem = localData.getParentBoqItem(item);
					if (angular.isUndefined(parentItem) || parentItem === null) {
						// If there is no parent item (for instance in case of item being the root)
						// the reference number is always true for this is simply a number for the root element.
						return true;
					}

					if (service.isFreeBoq()) {
						return true;
					}
					else if (service.isCrbBoq()) {
						return crbService.isValidBoqReference(reference, item.BoqLineTypeFk, parentItem);
					}
					else if (service.isOenBoq()) {
						return oenService.isValidBoqReference(service, reference, item, parentItem);
					}
					else {
						// Get parent reference first because it is part of the item reference.
						// In case the parent is the root element its reference number is not taken into account.
						var parentReference = boqMainCommonService.isRoot(parentItem) ? '' : parentItem.Reference;

						// First remove a final dot
						var originalReference = reference;
						reference = localData.removeDotAtEnd(reference);
						parentReference = localData.removeDotAtEnd(parentReference);

						var splittedParentReference = _.isEmpty(parentReference) ? [] : parentReference.split(localData.getReferenceNumberDelimiter());
						var splittedReference = reference.split(localData.getReferenceNumberDelimiter());
						var itemLevel = localData.getLevelOfBoqItem(item);
						var isIndexItem = false;
						var levelLineType = -1;
						var currentItemSubLevel = 0;

						// Remove the parts of the reference that might have been inserted due to skipped divisions
						splittedReference = _.filter(splittedReference, function (value, index, collection) {
							if (index < collection.length - 1) {
								return !_.isEmpty(value.trim());
							}

							return true;
						});

						// The item reference includes the parent reference and a maximum of two other reference parts (one for the position level one for the index level),
						// i.e. on position level the reference can be 2 parts bigger then on the parent level. On the division level, the item reference should only be
						// one reference part bigger than the parent reference.
						var refDiff = splittedReference.length - splittedParentReference.length;
						if (boqMainCommonService.isDivision(item)) {
							// Division should have one reference part more then the parent
							if ((refDiff <= 0) || (refDiff > 1)) {
								internalErrorMessage.errorMessage = $translate.instant('boq.main.invalidReferenceParentPartMismatch');
								return false; // Something wrong with division reference
							}

							// Length of reference reflects hierarchical level
							if (itemLevel !== splittedReference.length) {
								// Number of reference parts doesn't fit to hierachical level
								internalErrorMessage.errorMessage = $translate.instant('boq.main.invalidReferenceParentPartMismatch');
								return false;
							}
						} else if (boqMainCommonService.isItem(item) || boqMainCommonService.isSurchargeItem(item)) {
							// Item (position) can have two reference parts more then the parent (that's supposed to be a division)
							if ((refDiff <= 0) || (refDiff > 2)) {
								return false; // Something wrong with item reference
							}

							// Length of reference reflects hierarchical level
							if (itemLevel !== splittedReference.length) {

								// Check for index item first
								if (splittedReference.length - itemLevel === 1) {
									// This happens when we have an item index
									isIndexItem = true;
								} else {
									// Number of reference parts doesn't fit to hierachical level
									return false;
								}
							}
						}

						// If we have an index item, there shouldn't be a final dot
						if (isIndexItem && (originalReference.lastIndexOf(localData.getReferenceNumberDelimiter()) === originalReference.length - 1)) {
							return false;
						}

						var structureDetails = boqStructureService.getStructureDetails();
						var parentReferencePart = '';
						var ownReferencePart = '';

						if (angular.isUndefined(structureDetails) || !_.isArray(structureDetails) || structureDetails.length <= 0) {
							// Something very strange here, because valid structure details are missing
							console.error('boqMainServiceFactory: isReferenceValidForThisItem -> structure Details are missing -> no testing of valid reference possible');
							return false;
						}

						// Go down the hierachical levels represented by the splitted reference parts and check
						// if they are valid with respect to general rules and the currently given boq structure detail settings.
						var structureDetail = null;

						for (var i = 0; i < splittedReference.length; i++) {
							parentReferencePart = i < splittedParentReference.length ? splittedParentReference[i] : null;
							ownReferencePart = splittedReference[i];
							levelLineType = Math.min(9, i + 1);

							if (((parentReferencePart !== null) && _.isEmpty(parentReferencePart)) || _.isEmpty(ownReferencePart.trim())) {
								// Malicious state where one of the two reference parts is empty.
								return false;
							}

							// When checking the parent part of the reference the reference parts of item and parent muste be identical
							if (parentReferencePart !== null) {
								// We still have a parent reference part to check against
								if (parentReferencePart.length !== ownReferencePart.length) {
									// Eventually there are leading spaces that should be trimmed first
									parentReferencePart = parentReferencePart.trim();
									ownReferencePart = ownReferencePart.trim();
								}

								if (ownReferencePart !== parentReferencePart) {
									// Mismatch of parent and item reference
									internalErrorMessage.errorMessage = $translate.instant('boq.main.invalidReferenceParentPartMismatch');
									return false;
								}
							} else {
								// Now we are on current level, so we can have a division, position or index item
								currentItemSubLevel++;

								// For position or index item we have to adjust the already set levelLineType
								if (boqMainCommonService.isItem(item) || boqMainCommonService.isSurchargeItem(item)) {
									levelLineType = isIndexItem && (currentItemSubLevel === 2) ? boqMainLineTypes.index : boqMainLineTypes.position;
								}
							}

							structureDetail = boqStructureService.getStructureDetailByLineType(levelLineType);

							if (angular.isUndefined(structureDetail) || (structureDetail === null)) {
								// No fitting structure detail can be found -> something wrong with the boq structure informations.
								// Maybe someone changed the structure informations on database side although boq has already items in it and now the current boq structure and
								// its boq structure informations don't fit anymore.
								console.error('boqMainServiceFactory: isReferenceValidForThisItem -> cannot validate reference -> check for mismatch with boq document properties !!');
								return false;
							}

							// Check for maximum reference length for this line type.
							if (boqMainCommonService.isReferenceMaxLengthExceeded(ownReferencePart.length, structureDetail.LengthReference)) {
								internalErrorMessage.errorMessage = $translate.instant('boq.main.invalidReferenceLengthExceeded');
								return false;
							}

							// Check for correct data type entered (i.e. numeric or alphanumeric)
							ownReferencePart = ownReferencePart.trim(); // Eventually there are leading spaces that should be trimmed first
							if ((structureDetail.DataType === boqMainStructureDetailDataType.numeric) && !(/^[0-9]+$/).test(ownReferencePart)) {
								return false;
							}

							if ((structureDetail.DataType === boqMainStructureDetailDataType.alphanumeric) && !(/^[a-zA-Z0-9]+$/).test(ownReferencePart)) {
								return false;
							}
						}

						// Check for final dot when having an item with a reference
						if (!isIndexItem &&
							!boqMainCommonService.isTextElementWithoutReference(item) &&
							(originalReference.lastIndexOf(localData.getReferenceNumberDelimiter()) !== originalReference.length - 1)) {
							internalErrorMessage.errorMessage = $translate.instant('boq.main.invalidReferenceFinalDot');
							return false;
						}

						// Call externally given isReferenceValidForThisItem
						if (angular.isDefined(option.isReferenceValidForThisItem) && _.isFunction(option.isReferenceValidForThisItem)) {
							return option.isReferenceValidForThisItem(originalReference, internalErrorMessage);
						}
					}

					// We can image more detailed tests, but after passing the previous checks for the moment we say the reference is valid and return true.
					return true;
				};

				/**
				 * @ngdoc function
				 * @name isIndexItemRegardingReference
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description check if the given item is an index regarding its reference or the externally given reference
				 * @param {Object} item whose reference identifies it as an index
				 * @param {String} externalReference which might be given externally and that differs from current reference at item
				 * @returns {Boolean} indicating if the given item is an index regarding its reference
				 */
				service.isIndexItemRegardingReference = function isIndexItemRegardingReference(item, externalReference) {

					// Do some initial checks
					if (angular.isUndefined(item) || item === null) {
						return false;
					}

					// First remove a final dot
					var reference = _.isEmpty(externalReference) ? item.Reference : externalReference;
					reference = localData.removeDotAtEnd(reference);

					var splittedReference = reference.split(localData.getReferenceNumberDelimiter());
					var itemLevel = localData.getLevelOfBoqItem(item);
					var isIndexItem = false;

					// Remove the parts of the reference that might have been inserted due to skipped divisions
					splittedReference = _.filter(splittedReference, function (value, index, collection) {
						if (index < collection.length - 1) {
							return !_.isEmpty(value.trim());
						}

						return true;
					});

					if (boqMainCommonService.isDivision(item)) {
						isIndexItem = false; // Divisions have no indexes
					} else if (boqMainCommonService.isItem(item) || boqMainCommonService.isSurchargeItem(item)) {
						// Length of reference reflects hierarchical level
						if (itemLevel !== splittedReference.length) {

							// Check for index item
							if (splittedReference.length - itemLevel === 1) {
								// This happens when we have an item index
								isIndexItem = true;
							}
						}
					}

					return isIndexItem;
				};

				/**
				 * @ngdoc function
				 * @name adjustToParentPartOfReference
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description starting with a given parent boqitem we recursively iterate the children's hierarchy and adjust
				 * the parent part of the children reference number to the number given by the parent.
				 * @param {Object} parentItem whose child item references have to be adjusted
				 */
				service.adjustToParentPartOfReference = function adjustToParentPartOfReference(parentItem) {

					if (service.isFreeBoq() || boqMainCommonService.isRoot(parentItem)) {
						// In case of a free BOQ or of a root BOQ itemn no adjusting of the parent part of the reference is done
						return;
					}

					// Do some initial checks
					if (angular.isUndefined(parentItem) || parentItem === null) {
						return;
					}

					var parentReference = service.isCrbBoq() ? crbService.trimBoqReference(parentItem) : parentItem.Reference;
					_.forEach(parentItem.BoqItems, function (boqItem) {
						if (_.isObject(boqItem) && (!boqMainCommonService.isRoot(boqItem) && !boqMainCommonService.isTextElementWithoutReference(boqItem))) {
							boqItem.Reference = parentReference.substring(0, parentReference.length) + boqItem.Reference.substring(parentReference.length); // overwrites the parent reference part

							localData.addAffectedItem(boqItem);
							if (!service.hasItemBeenSavedYet(boqItem)) {
								// If this boq is linked to a base boq, set a proper link to the corresponding base boq item
								service.setBaseBoqLinkViaReferenceNumber(boqItem, boqItem.Reference);
							}

							service.adjustToParentPartOfReference(boqItem); // recursion
						}
					});
				};

				/**
				 * @ngdoc function
				 * @name getFormattedReferenceNumber
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description According to the currently given boq structure definitions we format the given reference number to obey certain rules
				 * including adding missing dot if neccessary or adding leading zeros or spaces. Currently, only the part of the reference
				 * number is formatted that corresponds to the level of the given boq item for also adjusting the reference number parts of the upper levels
				 * would force the reference numbers of the related items also to being adjusted which is not wanted here.
				 * @param {Object} boqItem whose reference number has to be formatted
				 * @param {String} reference to be formatted
				 */
				service.getFormattedReferenceNumber = function getFormattedReferenceNumber(boqItem, reference) {

					// Do some initial checks
					if (angular.isUndefined(boqItem) || boqItem === null || boqMainCommonService.isRoot(boqItem) || _.isEmpty(reference)) {
						return boqMainCommonService.isRoot(boqItem) ? reference : '';
					}

					reference = _.isEmpty(reference) ? boqItem.Reference : reference;
					var formattedReferenceNumber = reference; // Keep old value to have a fallback when leaving the function due to issues.

					if (service.isFreeBoq() || service.isCrbBoq() || service.isOenBoq() || !_.isObject(localData.getParentBoqItem(boqItem))) {
						return formattedReferenceNumber; // In case of a free or CRB or OENORM BOQ no formatting of the reference is done
					}

					var isIndexItem = service.isIndexItemRegardingReference(boqItem, reference);
					reference = localData.removeDotAtEnd(reference);
					var parentItem = localData.getParentBoqItem(boqItem);
					var parentReference = !boqMainCommonService.isRoot(parentItem) ? localData.removeDotAtEnd(parentItem.Reference) : ''; // We only take the parent reference into account when being a child of a division not ot the root boq item.
					var splittedParentReference = _.isEmpty(parentReference) ? [] : parentReference.split(localData.getReferenceNumberDelimiter()); // Split reference to parts
					var splittedReference = _.isEmpty(reference) ? [] : reference.split(localData.getReferenceNumberDelimiter()); // Split reference to parts
					var itemLevel = localData.getLevelOfBoqItem(boqItem);
					var ownReferencePart = '';
					var structureDetail = boqStructureService.getStructureDetailByLineType(boqItem.BoqLineTypeFk);
					var leadingZerosChar = boqStructureService.getStructure().LeadingZeros ? '0' : ' ';
					var leadingZerosPart = '';
					var refPart = '';
					var parentRefPart = '';
					var parentReferencePartIsInSync = true;

					// Remove the parts of the reference that might have been inserted due to skipped divisions
					splittedReference = _.filter(splittedReference, function (value, index, collection) {
						if (index < collection.length - 1) {
							return !_.isEmpty(value.trim());
						}

						return true;
					});

					if (!_.isArray(splittedReference) || itemLevel > splittedReference.length) {
						console.log('boqMainServiceFactory.getFormattedReferenceNumber -> format of reference number failed due to mismatch of item level and length of reference');
						return formattedReferenceNumber;
					}

					if (!boqMainCommonService.isRoot(parentItem)) {
						// Check if the parent part of the reference is in sync with the parent reference
						for (var i = 0; i < splittedParentReference.length; i++) {
							parentRefPart = splittedParentReference[i].trim();
							if (i > splittedReference.length - 1) {
								// Something wrong with the length of the reference
								parentReferencePartIsInSync = false;
								break;
							}

							refPart = splittedReference[i].trim();

							if (refPart !== parentRefPart) {
								// The parts are not in sync
								parentReferencePartIsInSync = false;
								break;
							}
						}

						if (!parentReferencePartIsInSync) {
							console.log('boqMainServiceFactory.getFormattedReferenceNumber -> the parent part of the reference is not in sync with the parent reference');
							return formattedReferenceNumber;
						}
					}

					ownReferencePart = splittedReference[itemLevel - 1];

					if (angular.isUndefined(parentItem) || parentItem === null || splittedReference.length === 0 || itemLevel <= 0 || _.isEmpty(ownReferencePart) || !structureDetail) {
						return formattedReferenceNumber;
					}

					if (!boqMainCommonService.isReferenceMaxLengthExceeded(ownReferencePart.length, structureDetail.LengthReference)) {
						for (var j = 1; j <= (structureDetail.LengthReference - ownReferencePart.length); j++) {
							leadingZerosPart += leadingZerosChar;
						}
					}

					// Rebuild reference number after this reformatting
					if (!_.isEmpty(parentReference)) {
						parentReference += localData.getReferenceNumberDelimiter();
					}

					formattedReferenceNumber = parentReference + localData.determineSkippedDivisionRefPart(parentItem, boqItem.BoqLineTypeFk) + leadingZerosPart + ownReferencePart + localData.getReferenceNumberDelimiter();

					if (isIndexItem) {
						formattedReferenceNumber += splittedReference[splittedReference.length - 1];
					}

					return formattedReferenceNumber;
				};

				/**
				 * @ngdoc function
				 * @name adjustToParentDivisionType
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description starting with a given parent boqitem we recursively iterate the children's hierarchy and adjust
				 * the division type of the children to the division type of the parent.
				 * @param {Object} parentItem whose child item division types have to be adjusted
				 */
				service.adjustToParentDivisionType = function adjustToParentDivisionType(parentItem) {

					// Do some initial checks
					if (angular.isUndefined(parentItem) || parentItem === null || boqMainCommonService.isRoot(parentItem)) {
						return;
					}

					// Get parent divsion type because it is set to the child items as division type.
					// In case the parent is the root element its division type is not taken into account.
					var parentDivisionType = parentItem.BoqDivisionTypeFk;
					var childItems = parentItem.BoqItems;
					var childCount = (angular.isDefined(childItems) && childItems !== null) ? childItems.length : 0;
					var childItem = null;

					for (var i = 0; i < childCount; i++) {

						childItem = childItems[i];

						if (angular.isDefined(childItem) && childItem !== null && boqMainCommonService.isDivision(childItem) && childItem.BoqLineTypeFk > 1) {

							childItem.BoqDivisionTypeFk = parentDivisionType;

							// This item is affected by a parents property change. Add it to the affected items list.
							localData.addAffectedItem(childItem);

							// Recursively dig deeper into the children hierarchy
							service.adjustToParentDivisionType(childItem);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name padLeft
				 * @function
				 * @methodOf
				 * @description
				 * @param {String} initialString that is to be left padded
				 * @param {Number} padLength length of the padded string including the initialString
				 * @param {String} pad characters to be left padded
				 * @returns {String} the left padded initial string
				 */
				var padLeft = function padLeft(initialString, padLength, pad) {
					return new Array(padLength - String(initialString).length + 1).join(pad || '0') + initialString;
				};

				/**
				 * @ngdoc function
				 * @name getPredecessorWithReference
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Starting with the given boq item that's supposed to be an item with a reference to a predecessing boq item we climb the chain of predecessors
				 * to find a boq item with a reference number.
				 * @param {Object} boqItem to start the search with
				 * @returns {Object} predecessor with a reference number
				 */
				service.getPredecessorWithReference = function getPredecessorWithReference(boqItem) {
					if (angular.isUndefined(boqItem) || boqItem === null || angular.isUndefined(boqItem.BoqItemBasisFk) || boqItem.BoqItemBasisFk === null) {
						return null;
					}

					// Walk up the chain of predecessors until you get one with that has a reference number.
					// We do this search only on the current hierarchy level, i.e. the search traverses the siblings of the given boqItem.
					var parentItem = service.getBoqItemById(boqItem.BoqItemFk); // Todo BH: this call is probably done very often, so we should think of optimizations !!
					var predecessor = localData.findBoqItemByPropertyValueInList('Id', boqItem.BoqItemBasisFk);
					var visitedPredecessors = [];

					if (boqMainCommonService.isRoot(predecessor)) {
						// The root item is not a valid return value here for its reference is not used in sorting.
						return null;
					}

					while ((predecessor !== null) && (predecessor.Id !== parentItem.Id)) {
						if (!boqMainCommonService.isTextElementWithoutReference(predecessor) && !_.isEmpty(predecessor.Reference)) {
							break;
						} else {
							// Go to next predecessor
							predecessor = localData.findBoqItemByPropertyValueInList('Id', predecessor.BoqItemBasisFk);

							if (predecessor !== null) {
								if (visitedPredecessors.indexOf(predecessor.Id) !== -1) {
									// A circular reference has been detected -> exit to avoid infinite loop
									console.error('Problem in getPredecessorWithReference : BoqItem with Id: ' + predecessor.Id + ' links to successing item via BoqItemBasisFk!!');
									break;
								}

								visitedPredecessors.push(predecessor.Id); // Save visited predecessors to monitor predecessor chain
							}
						}
					}

					return predecessor;
				};

				/**
				 * @ngdoc function
				 * @name compareReferences
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description The reference number of two given boqItems is compared
				 * @param {String} firstRef to be compared
				 * @param {String} secondRef to be compared
				 * @returns {Number} 0 indicates equality, -1 indicates that first boq item is sorted before second boq item, 1 indicates that first boq item is sorted after second boq item.
				 * Null indicates that no comparison was possible.
				 */
				localData.compareReferences = function compareReferences(firstRef, secondRef) {

					// For usually a final dot is at the end of a reference number (only exception is an index position) we remove it,
					// because the following functionality dosen't expect one. This also makes it easier to handle states where we have
					// a mixture of references, i.e. ones with dot at the end and ones without a dot at the end.
					firstRef = localData.removeDotAtEnd(firstRef);
					secondRef = localData.removeDotAtEnd(secondRef);

					// Get the key parts of the reference number delimited by a dot.
					var result = null;
					var firstRefKeys = firstRef.trim().split(localData.getReferenceNumberDelimiter());
					var secondRefKeys = secondRef.trim().split(localData.getReferenceNumberDelimiter());
					var paddedLength = -1;
					var firstRefKeyLengths = null;
					var secondRefKeyLengths = null;

					// Remove the parts of the reference that might have been inserted due to skipped divisions
					firstRefKeys = _.filter(firstRefKeys, function (value, index, collection) {
						if (index < collection.length - 1) {
							return !_.isEmpty(value.trim());
						}

						return true;
					});

					secondRefKeys = _.filter(secondRefKeys, function (value, index, collection) {
						if (index < collection.length - 1) {
							return !_.isEmpty(value.trim());
						}

						return true;
					});

					if (!_.isEmpty(firstRefKeys) && !_.isEmpty(secondRefKeys) && Math.abs(firstRefKeys.length - secondRefKeys.length) <= 1) {

						// First determine the lengths of the partial keys to be able to do the fitting padding to them
						firstRefKeyLengths = _.map(firstRefKeys, function (refKey) {
							// noinspection CommaExpressionJS
							return (angular.isDefined(refKey) && _.isString(refKey) ? (refKey = refKey.trim(), refKey).length : 0);
						});

						secondRefKeyLengths = _.map(secondRefKeys, function (refKey) {
							// noinspection CommaExpressionJS
							return (angular.isDefined(refKey) && _.isString(refKey) ? (refKey = refKey.trim(), refKey.length) : 0);
						});

						// Then pad the partial keys with '0's so the alphanumeric comparison works as expected (i.e. '5' < '10', because it's transformed to '05' < '10')
						firstRefKeys.forEach(function (element, index, arr) {
							var trimmedString = '';
							if (arr[index]) {
								var diff = firstRefKeyLengths[index] - secondRefKeyLengths[index];
								paddedLength = (diff < 0) ? secondRefKeyLengths[index] : firstRefKeyLengths[index];
								trimmedString = arr[index].trim();
								arr[index] = (diff < 0) ? padLeft(trimmedString, paddedLength, '0') : trimmedString;
							}
						});

						secondRefKeys.forEach(function (element, index, arr) {
							var trimmedString = '';
							if (arr[index]) {
								var diff = secondRefKeyLengths[index] - firstRefKeyLengths[index];
								paddedLength = (diff < 0) ? firstRefKeyLengths[index] : secondRefKeyLengths[index];
								trimmedString = arr[index].trim();
								arr[index] = (diff < 0) ? padLeft(trimmedString, paddedLength, '0') : trimmedString;
							}
						});

						// Reassemble padded strings in partial key array to reference string with a dot as delimiter.
						firstRef = firstRefKeys.join(localData.getReferenceNumberDelimiter());
						secondRef = secondRefKeys.join(localData.getReferenceNumberDelimiter());

						result = firstRef.localeCompare(secondRef);
					} else {
						if (service.isFreeBoq()) {
							result = firstRefKeys.length < secondRefKeys.length;
						} else {
							// Something is wrong, i.e. we try to compare references with a different depth of partial keys
							$log.log('' + ' -> compareReferences: cloud not compare the following references ' + firstRef + ' ' + secondRef);
						}
					}

					return result;
				};

				/**
				 * @ngdoc function
				 * @name compareSpecialItems
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Compare two special items by the order in the precedecessor chain.
				 * @param {Object} firstBoqItem to be compared
				 * @param {Object} secondBoqItem to be compared
				 * @returns {Number} 0 indicates equality, -1 indicates that first boq item is sorted before second boq item, 1 indicates that first boq item is sorted after second boq item.
				 * Null indicates that no comparison was possible.
				 */
				localData.compareSpecialItems = function compareSecialItems(firstBoqItem, secondBoqItem) {
					// To compare the two items we climb the chain of predecessors and look where they are located which in turn indicates
					// the positition of the items in relation to one another.
					// !!! We assume that both items are chained with the same predecessor that has a reference. Only in this case this comparison works. !!!
					var firstIsSpecialItem = _.isObject(firstBoqItem) && boqMainCommonService.isTextElementWithoutReference(firstBoqItem);
					var secondIsSpecialItem = _.isObject(secondBoqItem) && boqMainCommonService.isTextElementWithoutReference(secondBoqItem);
					var parentItem = null;
					var predecessor = null;
					var visitedPredecessors = [];

					// If both items are equal we signal this by returning.
					if (_.isEqual(firstBoqItem, secondBoqItem)) {
						return 0;
					}

					// If not we first assume that the first item is before second item.
					var result = -1;

					if (firstIsSpecialItem && !secondIsSpecialItem) {
						result = 1; // First after second
					} else if (!firstIsSpecialItem && secondIsSpecialItem) {
						result = -1; // First before second
					} else if (!firstIsSpecialItem && !secondIsSpecialItem) {
						result = 0;  // First equals second
					} else {
						parentItem = service.getBoqItemById(firstBoqItem.BoqItemFk); // Todo BH: this call is probably done very often, so we should think of optimizations !!
						predecessor = localData.findBoqItemByPropertyValueInList('Id', firstBoqItem.BoqItemBasisFk);

						// We climb up the predecessor chain of the first boq item and look if we can find the second item there.
						// If so, the second item is a predecessor of the first item, if not it is a successor.
						while ((predecessor !== null) && (predecessor.Id !== parentItem.Id)) {
							if (_.isEqual(predecessor, secondBoqItem)) {

								// The second boq item is a predecessor if the first item
								// -> First after second
								result = 1;
								break;
							}

							// Go to next predecessor
							predecessor = localData.findBoqItemByPropertyValueInList('Id', predecessor.BoqItemBasisFk);

							if (predecessor !== null) {

								if (visitedPredecessors.indexOf(predecessor.Id) !== -1) {
									// A circular reference has been detected -> exit to avoid infinite loop
									console.error('Problem in compareSpecialItems : BoqItem with Id: ' + predecessor.Id + ' links to successing item via BoqItemBasisFk!!');
									result = 1;
									break;
								}

								visitedPredecessors.push(predecessor.Id);
							}
						}
					}

					return result;
				};

				/**
				 * @ngdoc function
				 * @name compareBoqItemsByReferences
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description The reference number of two given boqItems is compared
				 * @param {Object} firstBoqItem first boq item to be compared
				 * @param {Object} secondBoqItem second boq item to be compared
				 * @returns {Number} 0 indicates equality, -1 indicates that first boq item is sorted before second boq item, 1 indicates that first boq item is sorted after second boq item
				 */
				service.compareBoqItemsByReferences = function compareBoqItemsByReferences(firstBoqItem, secondBoqItem) {
					var result = 0;

					if (!firstBoqItem && !secondBoqItem) {
						return 0;
					} else if (firstBoqItem && !secondBoqItem) {
						return 1;
					} else if (!firstBoqItem && secondBoqItem) {
						return -1;
					}

					// There are valid boqItem objects so we get their references
					var firstRef = boqMainCommonService.isTextElementWithoutReference(firstBoqItem) ? '' : firstBoqItem.Reference;
					var secondPredecessorWithReference = null;
					var secondRef = boqMainCommonService.isTextElementWithoutReference(secondBoqItem) ? '' : secondBoqItem.Reference;
					var firstPredecessorWithReference = null;

					if(boqMainCommonService.isTextElementWithoutReference(firstBoqItem) && !firstBoqItem.BoqItemBasisFk) {
						// We have a special item that doesn't have a valid BoqItemBasisFk
						// -> we place this item at the end, same as the server side sorting of items does it
						return 1;
					}

					if (_.isEmpty(firstRef) && !_.isEmpty(secondRef)) {
						if (!boqMainCommonService.isTextElementWithoutReference(firstBoqItem)) {
							result = -1;
						} else {
							// A special item meets a regular position or division
							// To compare both we have to look for the predecessor of the special item that has a reference number to see if this predecessor
							// is sorted before or after the second item.
							firstPredecessorWithReference = service.getPredecessorWithReference(firstBoqItem);

							if ((firstPredecessorWithReference !== null) && (secondBoqItem.Id === firstPredecessorWithReference.Id)) {
								// The second boqItem is the predecessor of the first boqitem -> is sorted after second item -> 1
								result = 1;
							} else {
								// If there is no predecessor with reference or the predecessor is the parent of the second item this item is always located before all other items with reference on this hierarchy level.
								// If we have a predecessor with reference we can do a normal compare of its reference with the reference of the second item.
								result = ((firstPredecessorWithReference !== null) && (firstPredecessorWithReference.Id !== secondBoqItem.BoqItemFk)) ? localData.compareReferences(firstPredecessorWithReference.Reference, secondRef) : -1;
							}
						}
					} else if (!_.isEmpty(firstRef) && _.isEmpty(secondRef)) {
						if (!boqMainCommonService.isTextElementWithoutReference(secondBoqItem)) {
							result = 1;
						} else {
							// A special item meets a regular position or division
							// To compare both we have to look for predecessor of the special item that has a reference number to see if this predecessor
							// is sorted before or after the first item.
							secondPredecessorWithReference = service.getPredecessorWithReference(secondBoqItem);

							if ((secondPredecessorWithReference !== null) && (firstBoqItem.Id === secondPredecessorWithReference.Id)) {
								// The first boqItem is the predecessor of the second boqitem -> is sorted before second item -> -1
								result = -1;
							} else {
								// If there is no predecessor with reference or the predecessor is the parent of the first item this item is always located before all other items with reference on this hierarchy level.
								// If we have a predecessor with reference we can do a normal compare of its reference with the reference of the first item.
								result = ((secondPredecessorWithReference !== null) && (secondPredecessorWithReference.Id !== firstBoqItem.BoqItemFk)) ? localData.compareReferences(firstRef, secondPredecessorWithReference.Reference) : 1;
							}
						}
					} else if (_.isEmpty(firstRef) && _.isEmpty(secondRef)) {

						if (!boqMainCommonService.isTextElementWithoutReference(firstBoqItem) && !boqMainCommonService.isTextElementWithoutReference(secondBoqItem)) {
							result = 0;
						} else if (boqMainCommonService.isTextElementWithoutReference(firstBoqItem) && !boqMainCommonService.isTextElementWithoutReference(secondBoqItem)) {
							result = -1;
						} else if (!boqMainCommonService.isTextElementWithoutReference(firstBoqItem) && boqMainCommonService.isTextElementWithoutReference(secondBoqItem)) {
							result = 1;
						} else {
							// Two special items on the same hierarchy level meet.

							// First check if they have the same predecessor with Reference.
							firstPredecessorWithReference = service.getPredecessorWithReference(firstBoqItem);
							secondPredecessorWithReference = service.getPredecessorWithReference(secondBoqItem);

							if (!_.isEqual(firstPredecessorWithReference, secondPredecessorWithReference)) {
								// Both special items have different predecessors with reference.

								// We have to take into acount that one of the predecessors with reference could be the parent item of this hierarchy.
								if ((firstPredecessorWithReference === null) && (secondPredecessorWithReference !== null)) {
									result = -1;
								} else if ((firstPredecessorWithReference !== null) && (secondPredecessorWithReference === null)) {
									result = 1;
								} else if ((firstPredecessorWithReference === null) && (secondPredecessorWithReference === null)) {
									result = 0;
									$log.log('boqMainServiceFactory -> compareBoqItemsByReferences: both special items do not have a predecessor -> error');
								} else {
									// Here we have both predecessors with reference

									// Now we look for the parent item case
									if (firstPredecessorWithReference.Id === secondPredecessorWithReference.BoqItemFk) {
										// firstPredecessorWithReference is the parent of the secondPredecessorWithReference
										// -> first is sorted before second item
										result = -1;
									} else if (secondPredecessorWithReference.Id === firstPredecessorWithReference.BoqItemFk) {
										// secondPredecessorWithReference is the parent of the firstPredecessorWithReference
										// -> first is sorted after second item
										result = 1;
									} else {
										// Normal case, not parents involved
										// -> compare the predecessors with reference
										result = localData.compareReferences(firstPredecessorWithReference.Reference, secondPredecessorWithReference.Reference);
									}
								}
							} else {
								// Both have the same predecessor with reference.
								// -> the comparison is done by traversing the precedessor chain and finding how both items are positioned.
								result = localData.compareSpecialItems(firstBoqItem, secondBoqItem);
							}
						}
					} else {
						// Both Reference strings available
						result = localData.compareReferences(firstRef, secondRef);
					}

					return result;
				};

				/**
				 * @ngdoc function
				 * @name onLineTypeChanged
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Reacts on the change of the line type of the given boqItem
				 * @param {Object} boqItem whose line type has been changed
				 * @returns {}
				 */
				service.onLineTypeChanged = function onLineTypeChanged(boqItem) {

					var predecessor = null;
					var successor = null;
					var previousNextContainer = {};

					if (angular.isUndefined(boqItem) || boqItem === null) {
						return;
					}

					// Because of the change to the new line type the boqItem is already marked as modified,
					// the following changes do not have to mark the item as modified again.

					if (boqMainCommonService.isTextElementWithoutReference(boqItem)) {

						var resetSpecificValues = function resetSpecificValues(aBoqItem) {
							// Items of this type don't have a reference number, so we can set it to an empty string.
							aBoqItem.Reference = '';

							// Also items of this type don't have an item type assigned
							// -> assign their default values
							aBoqItem.BasItemTypeFk = 0;
							aBoqItem.BasItemType2Fk = null;

							// No Uom in this case
							aBoqItem.BasUomFk = 0;

							// Reset all float values, i.e. monetary values or quanitties.
							boqMainCommonService.resetFloatValues(aBoqItem);
						};

						if (boqMainCommonService.isSubDescription(boqItem)) {

							// A subdescription needs a lead description to be moved to it as a child.
							// So we're currently looking  for a previously positioned lead description or position on this hierarchy level to move the given subdescriptipon to.
							// If neither of these can be found on the current level we reset the line type of the boq item to
							var searchConfig = {
								searchPreviousOnly: true,
								searchSameLevelOnly: true,
								includeSelectedItem: false
							};

							var fittingItem = service.findFittingItem(boqItem, boqMainLineTypes.position, searchConfig);
							if (fittingItem !== null) {
								resetSpecificValues(boqItem);

								var boqMainClipboardService = $injector.get('boqMainClipboardService');

								// To avoid problems with inconsistent object references between server and client
								// we do an update first and then finally trigger the move
								service.saveBoqItems().then(function () {
									// Move this subdescription to the found fitting item, i.e. the pewious position
									boqMainClipboardService.cut([boqItem], 'boqItem', service);
									boqMainClipboardService.paste(fittingItem,
										'boqItem',
										function (type) {
											if (type === 'boqitem') {
												service.gridRefresh();
											}
										},
										service);
								});
							}
							else if(_.isNumber(boqItem._originBoqLineTypeFk)) {
								// As no fitting lead description could be found setting of subdescription line type is not allowed.
								// -> reset it to original value
								boqItem.BoqLineTypeFk = boqItem._originBoqLineTypeFk;

								delete boqItem._originBoqLineTypeFk; // Remove this property for it has served its purpose.
							}
						} else {
							resetSpecificValues(boqItem);

							// These items have a predecessor, so we look for it and set it.
							localData.getPreviousAndNextItem(boqItem, previousNextContainer, false, false);
							predecessor = previousNextContainer.previousItem;
							successor = previousNextContainer.nextItem;

							if (angular.isDefined(predecessor) && predecessor !== null) {
								boqItem.BoqItemBasisFk = predecessor.Id;
							} else if (predecessor === null) {
								// No predecesssor could be found so we assume to be the first item on this level and set the parent item as predecessor
								boqItem.BoqItemBasisFk = boqItem.BoqItemFk;
							}

							if (angular.isDefined(successor) && successor !== null && boqMainCommonService.isTextElementWithoutReference(successor)) {
								successor.BoqItemBasisFk = boqItem.Id;
							}

							if (boqMainCommonService.isDesignDescription(boqItem)) {
								// When we change to a design description we also have to determine a number for it.
								boqItem.DesignDescriptionNo = localData.getNextDesignDescriptionNo();

								// Create a text element as first child.
								// The first text element in a row gets the parent design description as predecessor.
								// This is triggered by the last flag set to true.
								service.createNewItemByLineType(boqMainLineTypes.textElement, true, true);
							}
						}
					} else if (boqMainCommonService.isSurchargeItem(boqItem)) {
						// When we set an item to a surcharge item we have to trigger a calculation of all sibling items and its parent chain.
						service.calcParentChain(boqItem, true);
					}
				};

				/**
				 * @ngdoc function
				 * @name canLineTypeBeCreatedAtGivenLevel
				 * @function
				 * @methodOf
				 * @description Checks if an item with the given line type can be created at the given level
				 * @param {Object} selectedItem which is the parent or sibling of the item to be created
				 * @param {Object} childItem parameter when used in recursion
				 * @param {Number} lineType to be created
				 * @param {Number} level of item to be created
				 * @param {Object} visitorObject parameter when used in recursion
				 * @returns {Boolean}
				 */
				localData.canLineTypeBeCreatedAtGivenLevel = function canLineTypeBeCreatedAtGivenLevel(selectedItem, childItem, lineType, level, visitorObject) {

					var boqStructure = boqStructureService.getStructure();
					var boqStructureDetails = boqStructureService.getStructureDetails();

					if (_.isEmpty(boqStructure) || (!boqStructureDetails || boqStructureDetails.length === 0)) {
						return true;
					}

					if (boqMainCommonService.isTextElementWithoutReferenceType(lineType)) {
						// Those kinds of items have their own set of rules that are usually checked when they are created for example by a drag and drop operation.
						// Here we only do some rudimentary checks.

						if (boqMainCommonService.isTextElementType(lineType) && level > 1 && !boqMainCommonService.isDesignDescription(selectedItem)) {
							// TextElements are only allowed no level 1 (directly as children of the root) or as children of a DesignDescription
							return false;
						}

						// For all other cases we assume the checks running when generating the did work and the item can be placed here.
						return true;
					} else if (localData.checkAgainstBoqStructure(selectedItem, boqStructure, lineType, level)) { // TODO: Currently we only append. Look for corresponding code

						if (angular.isDefined(visitorObject) && visitorObject !== null) {
							return true; // We don't do the reference number check in a recursion for it's a bit complicated to carry the changing reference numbers through the hierarchies.
						}

						// Check if the given line type can be added at the given level
						if (localData.canFindReference(selectedItem, boqStructure, lineType, level, visitorObject)) {
							return true;
						} else {
							localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorReferenceCreationFailed');
						}
					}

					return false;
				};

				/**
				 * @ngdoc function
				 * @name maxReferenceBoqItem
				 * @function
				 * @description Gets the BoqChildItem with the highest ReferenceNumber
				 * @returns {BoqItem}
				 */
				localData.getMaxReferenceBoqItem = function getMaxReferenceBoqItem(currentBoqItemId)
				{
					var allBoqItems = service.getList();
					var allBoqChildItems = null;
					var maxReferenceBoqItem = null;

					function getMaxReferenceBoqItemFromCurrentBoqItem (currentBoqItem){
						var maxReferenceBoqItem = currentBoqItem;
						if(maxReferenceBoqItem){
							if (maxReferenceBoqItem.BoqItems && maxReferenceBoqItem.BoqItems.length > 0){
								allBoqChildItems = maxReferenceBoqItem.BoqItems.filter(boqItem => !boqMainCommonService.isTextElementWithoutReference(boqItem));
								if(!_.isEmpty(allBoqChildItems)) {
									maxReferenceBoqItem = _.maxBy(allBoqChildItems, 'Reference');
									maxReferenceBoqItem = getMaxReferenceBoqItemFromCurrentBoqItem(maxReferenceBoqItem);
								}
							}
						}

						return maxReferenceBoqItem;
					}

					var currentBoqItem = service.getBoqItemById(currentBoqItemId);
					if (currentBoqItem.BoqLineTypeFk === boqMainLineTypes.root && allBoqItems.length > 1){
						allBoqItems = allBoqItems.filter(boqItem => boqItem.BoqLineTypeFk !== boqMainLineTypes.root && (!boqMainCommonService.isTextElementWithoutReference(boqItem)));
						if(!_.isEmpty(allBoqItems)) {
							maxReferenceBoqItem = _.maxBy(allBoqItems, 'Reference');
						}
					} else {
						maxReferenceBoqItem = getMaxReferenceBoqItemFromCurrentBoqItem(currentBoqItem);
					}

					// set BoqItemParent.BoqItems to empty list to avoid serialiser circular reference problems
					maxReferenceBoqItem.BoqItemParent = _.clone(service.getBoqItemById(maxReferenceBoqItem.BoqItemFk));
					if (maxReferenceBoqItem.BoqItemParent){
						maxReferenceBoqItem.BoqItemParent.BoqItems = [];
					}

					// Clone determined maxReferenceBoqItem to aviod resetting of children array in the following call causing problems in the currently displayed boq tree.
					if(_.isObject(maxReferenceBoqItem)) {
						maxReferenceBoqItem = _.clone(maxReferenceBoqItem);
					}
					if (_.isArray(maxReferenceBoqItem.BoqItems)){
						maxReferenceBoqItem.BoqItems = []; // Done to avoid serialiizer problem
					}

					return maxReferenceBoqItem;
				};

				// #endregion
				//  endregion


				//  region Copy&Paste / Drag&Drop
				// #region

				/**
				 * @ngdoc function
				 * @name setDragAndDropAllowed
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description sets the allowance for drag and drop
				 * @param {Boolean} flag telling if drag and drop is allowed
				 */
				service.setDragAndDropAllowed = function setDragAndDropAllowed(flag) {

					if (localData.dragAndDropAllowed === flag) {
						return; // Nothing has changed -> nothing to be done
					}

					localData.dragAndDropAllowed = flag;
				};

				/**
				 * @ngdoc function
				 * @name isDragAndDropAllowed
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description determines if drag and drop is allowed
				 * @returns {Boolean} flag telling if drag and drop is allowed
				 */
				service.isDragAndDropAllowed = function isDragAndDropAllowed() {
					return localData.dragAndDropAllowed;
				};

				/**
				 * @ngdoc function
				 * @name canPasteMultiple
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Checks if multiple items and their children can be pasted to the selected item
				 * @param {Object} selectedItem
				 * @param {Array} pastedItems
				 * @param {Boolean} showErrorMessages triggers if error messages are shown after canPasteMultiple has finished
				 * @param {Object} positionInfo holds the information where to position the pasted items
				 * @param {Object} sourceBoqMainService holds the boqMainService that loaded the source boq items where the pastedItems belong to
				 * @returns {Boolean} indicating if paste can be done or not
				 */
				service.canPasteMultiple = function canPasteMultiple(selectedItem, pastedItems, showErrorMessages, positionInfo, sourceBoqMainService) {

					var canBePasted = false;
					var copiedParentItem = {};
					var copiedChildItems = [];
					var parentAndItemLevelForPaste = null;
					var pastedItem = null;
					var parentDetermined = false;
					var parentLevel = -1;
					var before = _.isObject(positionInfo) ? positionInfo.before : true;
					var previousNextContainer = {};
					var originalChildItems = null;
					var clonedChildItem = null;
					var readjustedItems = null;

					if (!selectedItem || !pastedItems) {
						return false;
					}

					// Currently we only support a homogeneous list of items, i.e. the list has only items of the same BoqLineType or positions and surcharge items.
					// Do a check of how the selected list of items is built up.
					var groupedSelectedBoqTypes = service.getGroupedSelectedBoqTypes(pastedItems);

					var homogeneous = _.isObject(groupedSelectedBoqTypes) ? Object.keys(groupedSelectedBoqTypes).length <= 1 : false;

					if (!homogeneous) {
						// At the moment we only support the inhomogeneous case of notes and divisions or positions sharing the same parent.
						let groupedSelectedParents =  _.groupBy(pastedItems, function (pastedItem) {
							if (!_.isObject(pastedItem)) {
								return -1;
							}

							return pastedItem.BoqItemFk;
						});

						let haveSameParents = _.isObject(groupedSelectedParents) ? _.without(Object.keys(groupedSelectedParents), [-1]).length === 1 : false;
						let groupedSelectedBoqTypesAsNumbers = _.map(Object.keys(groupedSelectedBoqTypes), function(typeString) {
							return parseInt(typeString);
						});

						let hasNotes = _.isNumber(groupedSelectedBoqTypesAsNumbers.find(e => e === 107));
						groupedSelectedBoqTypesAsNumbers = _.without(groupedSelectedBoqTypesAsNumbers, 107);
						let minType = _.min(groupedSelectedBoqTypesAsNumbers);
						let maxType = _.max(groupedSelectedBoqTypesAsNumbers);

						// This should be the mentioned case, i.e. notes and positions or divisions and notes having the same parent.
						// Negating it should keep the unwanted cases
						if(!(haveSameParents && hasNotes && ((minType === 0 && maxType === 0) || (minType >= 1 && maxType <= 9)))) {
							return false; // Currently, a list of inhomogeneous items is not pasted for this can lead to trouble. Only the tested inhomogeneous case can pass.
						}
					}

					if (angular.isArray(pastedItems) && pastedItems.length > 0) {
						for (var i = 0; i < pastedItems.length; i++) {
							// Check if the items selected in the clipboard can be pasted according to the currently valid boq structure rules.
							pastedItem = pastedItems[i];

							if (!boqMainCommonService.isTextElementWithoutReference(pastedItem)) {

								// Readjusting the items is neccessary if the AutoAtCopy option is set forcing a possibly missing target parent hierarchy to be inserted.
								// In the standard case (AutoAtCopy = false) the selectedItem and pastedItem are simply passed through.
								readjustedItems = service.adjustPastedAndSelectedItem(selectedItem, pastedItem, sourceBoqMainService);
								if (!_.isObject(readjustedItems)) {
									// There is already a boqItem with the same reference number in the target boq.
									// This is currently not supported in the AutoAtCopy mode, i.e. inserting the parent hierarchy if it is not there
									return false;
								}

								selectedItem = readjustedItems.selectedItem;
								pastedItem = readjustedItems.pastedItem;

								// Collect all pasted items having a reference
								copiedChildItems.push(pastedItem);
							}

							if (!parentDetermined) {
								parentAndItemLevelForPaste = {}; // If parent is not yet determined hand over an object to fill it in. This is only done until a valid parent could be determined.
							}

							if (service.canPaste(selectedItem, pastedItem, showErrorMessages, parentDetermined ? null : parentAndItemLevelForPaste, positionInfo)) {
								canBePasted = true;
							} else {
								canBePasted = false;
								break; // Only if all items can be pasted we do the paste
							}

							if (parentAndItemLevelForPaste && _.isObject(parentAndItemLevelForPaste.parentItem)) {
								parentDetermined = true;
							}
						}

						if (canBePasted && !service.isCrbBoq() && !service.isOenBoq() && copiedChildItems && copiedChildItems.length > 0) {
							// Now check if references on first level of pasted items can be created.
							// To do this we create a copy of the parent item and its pasted child items (first level only) and do a renumbering of the references.
							copiedParentItem = _.cloneDeep(parentAndItemLevelForPaste.parentItem);
							originalChildItems = copiedParentItem.BoqItems;
							copiedParentItem.BoqItems = [];
							clonedChildItem = null;
							for (var k = 0; _.isArray(originalChildItems) && k < originalChildItems.length; k++) {
								clonedChildItem = _.cloneDeep(originalChildItems[k]);
								copiedParentItem.BoqItems.push(clonedChildItem);
								clonedChildItem.BoqItems = null;
							}

							copiedChildItems = _.map(copiedChildItems, function (item) {
								return _.cloneDeep(item)/* angular.extend({}, item */;
							});

							// Add copied children to copied parent and start renumbering...
							if (copiedParentItem && copiedChildItems && copiedChildItems.length > 0) {
								if (!copiedParentItem.BoqItems || !_.isArray(copiedParentItem.BoqItems)) {
									copiedParentItem.BoqItems = [];
								}

								if (!before) {
									// The user wants to add the copied items after the currently selected item so we look for the next item and set it as selected item
									// and by this forcing the copied items to be inserted after the currently selected item.
									localData.getPreviousAndNextItem(selectedItem, previousNextContainer, true);

									// Set the selectedItem on the next item
									selectedItem = previousNextContainer.nextItem;
								}

								parentLevel = localData.getLevelOfBoqItem(copiedParentItem);
								canBePasted = localData.renumberBoqItems(copiedParentItem, selectedItem, copiedChildItems, parentLevel + 1, false, true);
							}
						}

						return canBePasted;
					}
				};

				/**
				 * @ngdoc function
				 * @name canPaste
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Checks if a item and its children can be pasted to the selected item
				 * @param {Object} selectedItem
				 * @param {Object} pastedItem
				 * @param {Boolean} showErrorMessages triggers if error messages are shown after canPaste has finished
				 * @param {Object} parentAndItemLevelForPaste returning an object with the parent item for the pasted item and the level on which the item is to be pasted
				 * @param {Object} positionInfo holds the information where to position the pasted items
				 * @returns {Boolean} indicating if paste can be done or not
				 */
				service.canPaste = function canPaste(selectedItem, pastedItem, showErrorMessages, parentAndItemLevelForPaste, positionInfo) {
					if (!selectedItem || !pastedItem) {
						return false;
					}

					var boqStructure = boqStructureService.getStructure();

					if(service.isOenBoq()) {
						let boqMainOenService = $injector.get('boqMainOenService');
						return boqMainOenService.canPaste(selectedItem, pastedItem, boqStructure);
					}

					// Check if the pasted item is a boq root item.
					// Currently, we cannot paste root items, i.e. whole boqs.
					if (boqMainCommonService.isRoot(pastedItem)) {
						return false;
					}

					const boqMainStandardTypes = $injector.get('boqMainStandardTypes');
					var boqStructureDetails = boqStructureService.getStructureDetails();
					var pastedItemCopy = null;
					var parentItem = null;
					var level = -1;
					var result = service.getParentItemAndLevelForPaste(selectedItem, pastedItem);
					var previousAndNextContainer = {};
					var previousItem = null;
					var nextItem = null;
					var below = _.isObject(positionInfo) ? positionInfo.below : false;
					var before = _.isObject(positionInfo) ? positionInfo.before : true;
					var divisions = null;
					var divisionCount = 0;
					if (angular.isDefined(parentAndItemLevelForPaste) && _.isObject(parentAndItemLevelForPaste)) {
						// Hand over the determined result to the given object
						angular.extend(parentAndItemLevelForPaste, result);
					}

					if (_.isEmpty(boqStructure) || (!boqStructureDetails || boqStructureDetails.length === 0)) {
						return true;
					}

					if (service.isCrbBoq()) {
						return crbService.canPaste(service);
					}

					if(below && boqStructure.BoqStandardFk===boqMainStandardTypes.free && boqMainCommonService.isDivisionOrRoot(selectedItem) && (boqMainCommonService.isItem(pastedItem) || boqMainCommonService.isDivision(pastedItem))) {
						// In case of a free boq we allow adding items below a division
						return true;
					}

					if (below && !(boqMainCommonService.isDivisionOrRoot(selectedItem) && boqMainCommonService.isNote(pastedItem))) {
						return false;
					}

					parentItem = result.parentItem;
					level = result.level;

					// Determine division couunt of sibling items to currently selectedItem
					if (parentItem) {
						divisions = _.filter(parentItem.BoqItems, function (item) {
							return boqMainCommonService.isDivision(item);
						});
						divisionCount = _.isArray(divisions) ? divisions.length : 0;
					}

					localData.getPreviousAndNextItem(selectedItem, previousAndNextContainer);
					previousItem = previousAndNextContainer.previousItem;
					nextItem = previousAndNextContainer.nextItem;

					// Create a visitor object that checks if the visited elements can be added
					var checkAddableVisitor = {
						'visitBoqItemFn': localData.canLineTypeBeCreatedAtGivenLevel,
						'paste': true
					};

					if (boqMainCommonService.isTextElementWithoutReference(pastedItem)) {
						// Special handling for items like design descriptions, notes, text elements or sub descriptions
						// These items have no reference and are not listed in the boq structure definitions. Adding and positioning these
						// items follows its own rules.

						// Check special case first.
						// To avoid harming design descriptions by moving their needed text elements around and possibly removing the last or only text element
						// we currently don't allow pasting those text elements
						let parentOfPastedItem = localData.getParentBoqItem(pastedItem);
						if(_.isObject(parentOfPastedItem) && boqMainCommonService.isDesignDescription(parentOfPastedItem)) {
							return false;
						}

						// Currently we only handle subdescriptions.
						if (boqMainCommonService.isSubDescription(pastedItem) && (boqMainCommonService.isSubDescription(selectedItem) || boqMainCommonService.isItem(selectedItem))) {
							return true;
						} else {
							if (boqMainCommonService.isTextElement(pastedItem)) {
								// Paste a TextElement

								if (boqMainCommonService.isRoot(selectedItem)) {
									// TextElement -> Root
									return true;
								} else if (boqMainCommonService.isDivision(selectedItem) && (level === 1)) {
									// TextElement -> Division

									if (divisionCount === 1) {
										return true; // With only one division on this level the text element can be placed either before or after it.
									}

									if (_.find(parentItem.BoqItems, {BoqLineTypeFk: boqMainLineTypes.level1}) === selectedItem) {
										// This is only allowed on divisions on level 1 and only on the first division in the sorted order.
										if (divisionCount > 1 && !before) {
											return false; // Inserting a text element after the first (of many) divisions is not allowed
										} else {
											return (previousItem === null || boqMainCommonService.isTextElement(previousItem)); // Inserting the text element before the first division is allowed under certain circumstances
										}
									} else if (_.findLast(parentItem.BoqItems, {BoqLineTypeFk: boqMainLineTypes.level1}) === selectedItem) {
										// This is only allowed on divisions on level 1 and only after the last division in the sorted order.
										if (divisionCount > 1 && !before) {
											return (nextItem === null || boqMainCommonService.isTextElement(nextItem)); // Inserting a text element after the last (of many) divisions is allowed under the given circumstances
										} else {
											return false; // Inserting the text element before the last division is not allowed
										}
									}
								} else if (boqMainCommonService.isTextElement(selectedItem) &&
									(((level === 1) &&
										((boqMainCommonService.isTextElement(previousItem) ||
											previousItem === null ||
											_.findLast(parentItem.BoqItems, function (item) {
												return boqMainCommonService.isDivision(item) || boqMainCommonService.isItem(item);
											}) === previousItem) &&
											localData.getLevelOfBoqItem(previousItem) <= 1)) ||
										(boqMainCommonService.isDesignDescription(parentItem)))) {
									// TextElement -> TextElement
									return true;
								} else if (boqMainCommonService.isNote(selectedItem) &&
									(level === 1) && (boqMainCommonService.isTextElement(previousItem))) {
									// TextElement -> Note
									return true;
								} else if (boqMainCommonService.isDesignDescription(selectedItem)) {
									// TextElement -> DesignDescription
									return true;
								}
							} else if (boqMainCommonService.isNote(pastedItem) || boqMainCommonService.isDesignDescription(pastedItem)) {
								// Paste a Note/DesignDescription
								// For this items can be pasted almost everywhere it's easier to explicitly identify the cases where a paste is not possible
								// so all other cases are the ones a paste is working
								if (boqMainCommonService.isTextElement(selectedItem) &&
									(((level === 1) && (previousItem === null || (boqMainCommonService.isTextElement(previousItem) && localData.getLevelOfBoqItem(previousItem) === 1))) ||
										((_.findLast(parentItem.BoqItems, {BoqLineTypeFk: boqMainLineTypes.level1}) === previousItem) && !before) ||
										boqMainCommonService.isDesignDescription(parentItem))) {
									return false;
								} else {
									return true;
								}
							}

							// Yet unhandled types are not pasted.
							return false;
						}
					} else if (selectedItem.IsLeadDescription && boqMainCommonService.isItem(pastedItem)) {
						// Special case wanted by Bosch.
						// In this case dropping positions onto a lead description should move the positions as children to the lead description and turn them into sub descriptions.
						return true;
					} else if (boqMainCommonService.isDivisionOrRoot(pastedItem) && boqMainCommonService.isTextElement(selectedItem) && (level === 1) && (divisionCount > 1) &&
						(boqMainCommonService.isDesignDescription(parentItem) ||
							previousItem === null ||
							(boqMainCommonService.isTextElement(previousItem) && localData.getLevelOfBoqItem(previousItem) === 1) ||
							((_.findLast(parentItem.BoqItems, {BoqLineTypeFk: boqMainLineTypes.level1}) === previousItem) && !before))) {
						return false;
					} else if (localData.visitBoqItemsRecursively(parentItem, pastedItem, level, checkAddableVisitor)) { // Iterate over boq items and do the given check

						// From a structural point of view the paste can be done.

						// Now we check if the given pastedItem hierarchy can be inserted according to the reference numbers that have to be created.
						// We do this by transiently renumbering the pasted hierarchy elements as if having already being added to the target hierarchy.
						pastedItemCopy = (pastedItem !== null) ? _.cloneDeep(pastedItem) : null;

						// Do the renumbering and look if it worked. Not working could mean that some limits for the length of keys have been exceeded.
						if (service.renumberReferences(parentItem, selectedItem, pastedItemCopy, showErrorMessages)) {
							return true;
						} else {
							localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorReferenceCreationFailed');
						}

						if (showErrorMessages) {
							localData.handleCreationError();
						}
						return false;
					} else {

						// We try to do the paste one level deeper than the suggested one if the selected item is a division and the pasted item is a division
						// possibly having children, i.e. we try to drop a sub tree and didn't succeed when dropping its first item as sibling of the selectedItem,
						// so we try to drop it as a child of the selectedItem
						if (boqMainCommonService.isDivision(selectedItem) && boqMainCommonService.isDivision(pastedItem)) {

							result.parentItem = selectedItem;
							result.level++;
							result.pasteAsChild = true;

							if (angular.isDefined(parentAndItemLevelForPaste) && _.isObject(parentAndItemLevelForPaste)) {
								// Hand over the determined result to the given object
								angular.extend(parentAndItemLevelForPaste, result);
							}

							if (localData.visitBoqItemsRecursively(selectedItem, pastedItem, result.level, checkAddableVisitor)) {

								// From a structural point of view the paste can be done.

								// Now we check if the given pastedItem hierarchy can be inserted according to the reference numbers that have to be created.
								// We do this by transiently renumbering the pasted hierarchy elements as if having already being added to the target hierarchy.
								pastedItemCopy = (pastedItem !== null) ? _.cloneDeep(pastedItem) : null;

								// Do the renumbering and look if it worked. Not working could mean that some limits for the length of keys have been exceeded.
								if (service.renumberReferences(selectedItem, null, pastedItemCopy, showErrorMessages)) {
									return true;
								} else {
									localData.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorReferenceCreationFailed');
								}

								if (showErrorMessages) {
									localData.handleCreationError();
								}
								return false;
							}
						} else {
							if (showErrorMessages) {
								localData.handleCreationError();
							}

							return false;
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name renumberReferences
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Renumbers the references of the boq item hierarchy beginning with the given startItem
				 * @param {Object} selectedItem (in case of paste or drag and drop it's the item that's selected when the drop or paste is done)
				 * @param {Object} startingItem to start renumbering the references from
				 * @param {Boolean} showErrorMessages triggers if error messages are shown after renumbering has finished
				 * @returns {Boolean} indicating success of renumbering
				 */
				service.renumberReferences = function renumberReferences(parentItem, selectedItem, startingItem, showErrorMessages) {
					if (!parentItem /* || !selectedItem */ || !startingItem) {
						return false;
					}

					var boqStructure = boqStructureService.getStructure();
					var boqStructureDetails = boqStructureService.getStructureDetails();

					if (_.isEmpty(boqStructure) || (!boqStructureDetails || boqStructureDetails.length === 0)) {
						return true;
					}

					var level = localData.getLevelOfBoqItem(parentItem);
					level++; // the startingItem is currently added as child to the selectedItem, i.e. level has to be incremented by 1.
					var childItems = [];
					childItems.push(startingItem);

					// Iterate over boq items and call the given visitor function
					if (localData.renumberBoqItems(parentItem, selectedItem, childItems, level, false)) {
						return true;
					} else {
						if (showErrorMessages) {
							localData.handleCreationError();
						}

						return false;
					}
				};

				/**
				 * @ngdoc function
				 * @name renumberBoqItem
				 * @function
				 * @methodOf
				 * @description Renumber the reference of the given boqItem in accordance to the currently given structure information
				 * @param {Object} parentItem of childItem
				 * @param {Object} nextSiblingItem of childItem
				 * @param {Array} childItems whose references are to be renumbered
				 * @param {Number} lineType of childItem
				 * @param {Number} level of childItem in hierarchy of boq items
				 * @param {Boolean} addChildItemsIfNecessary indicating that the childItems to be renumbered can be added to the children array if neccessary (i.e. of they are not already added)
				 * @param {Boolean} stopRecursion stops the recursion that visits the children of the childItems
				 * @returns {Boolean} indicating if renumbering was successful
				 */
				/* jshint -W072 */ // function has too many parameters
				/* jshint -W074 */ // function's cyclomatic complexity is too high
				localData.renumberBoqItems = function renumberBoqItems(parentItem, nextSiblingItem, childItems, level, ownChildren, addChildItemsIfNecessary, stopRecursion) {

					var result = true;
					var canCreateAlphanumerical = true;

					var newReference = '';
					var s2Value = '';
					var boqStructure = boqStructureService.getStructure();
					var referenceContainer = {};
					var lastChildItem = null;
					var currentLeadingZerosPart = '';
					var leadingZerosChar = boqStructure.LeadingZeros ? '0' : ' ';
					var isFirst = true; // Flag indicacting if we start renumbering with the first sibling item (i.e. isFirst = true) or inbetween a gap of two sibling items as well as at the end of the sibling list (i.e. isFirst = false).
					var createNewAtEnd = true;
					var previousNextContainer = {};
					var currentCode = '';
					var siblingsWithReference = null;
					var currentNumberOfItemsWithReference = 0;

					if (angular.isUndefined(parentItem) || (parentItem === null) || angular.isUndefined(childItems) || (childItems === null)) {
						return false;
					}

					for (var h = 0; h < childItems.length; h++) {
						var childItem = childItems[h],
							lineType = (boqMainCommonService.isDivision(childItem)) ? Math.min(9, level) : childItem.BoqLineTypeFk,
							currentDetail = boqStructureService.getStructureDetailByLineType(lineType);

						currentNumberOfItemsWithReference = !boqMainCommonService.isTextElementWithoutReference(childItem) ? currentNumberOfItemsWithReference + 1 : currentNumberOfItemsWithReference;

						if (currentNumberOfItemsWithReference === 1) {
							if (ownChildren) {
								// When iterating over the own children we start with the first item
								isFirst = true;
							} else {
								// When there are already some children in the parent hierarchy that are not equivalent to the given childItems array
								// we start renumbering with the last already existing child item.
								if (angular.isDefined(parentItem.BoqItems) && _.isArray(parentItem.BoqItems) && parentItem.BoqItems.length > 0) {
									if (angular.isDefined(nextSiblingItem) && (nextSiblingItem !== null) && (nextSiblingItem.BoqItemFk === parentItem.Id)) {
										// If we have a sibling item given that shall follow the child item we have to do the renumbering in a way that creates a new reference
										// for the child item that sorts the child item before the given sibling item.
										createNewAtEnd = false;
										localData.getPreviousAndNextItem(nextSiblingItem, previousNextContainer, true);
										isFirst = false;
									} else {
										/* jshint -W083 */ // Intentionally adding function in small loop
										siblingsWithReference = _.filter(parentItem.BoqItems, function (siblingItem) {
											return !boqMainCommonService.isTextElementWithoutReference(siblingItem);
										});
										lastChildItem = (_.isArray(siblingsWithReference) && siblingsWithReference.length > 0) ? siblingsWithReference[siblingsWithReference.length - 1] : null;
										if (lastChildItem !== null) {
											currentCode = localData.extractReferencePartOnLevel(lastChildItem, lastChildItem.Reference, localData.getLineTypeLevel(lineType)); // Todo: DOT-TEST lastChildItem.Reference.substring(lastChildItem.Reference.lastIndexOf(localData.getReferenceNumberDelimiter()) + 1);
											isFirst = false;
										}
									}
								} else {
									isFirst = true;
								}
							}
						} else {
							isFirst = false;
						}

						// find structuredetail (exist only for "structure types", not for PerfDesc, AddText, etc.)
						if (angular.isDefined(currentDetail) && currentDetail !== null) {

							if (isFirst) {
								if (currentDetail.DataType === boqMainStructureDetailDataType.numeric) {
									currentCode = currentDetail.StartValue;
									s2Value = '0';

								}
								else if (currentDetail.DataType === boqMainStructureDetailDataType.alphanumeric) {
									currentCode = currentDetail.StartValue;
								}
							}

							if (childItem.BoqLineTypeFk !== boqMainLineTypes.chapterSeparator && childItem.BoqLineTypeFk !== boqMainLineTypes.root) {// ?? TODO: normally this types has no structuredetail
								if (isFirst) {
									currentLeadingZerosPart = '';
									if (!boqMainCommonService.isReferenceMaxLengthExceeded(currentCode.length, currentDetail.LengthReference)) {
										for (var i = 1; i <= (currentDetail.LengthReference - currentCode.length); i++) {
											currentLeadingZerosPart += leadingZerosChar;
										}
									}

									if (parentItem !== null && parentItem.BoqLineTypeFk !== boqMainLineTypes.root && parentItem.BoqLineTypeFk !== boqMainLineTypes.chapterSeparator) {
										// Removing the dot and adding it may look a little odd, but it is an easy way to test for the existance of a dot in the parent part of the reference
										newReference = localData.removeDotAtEnd(parentItem.Reference) + localData.getReferenceNumberDelimiter(true) + currentLeadingZerosPart + currentCode;
									} else {
										newReference = currentLeadingZerosPart + currentCode;
									}

									isFirst = false;
								} else {
									if (!_.isEmpty(previousNextContainer)) {
										// Here we try to add the new reference into a gap between references of given items
										if (angular.isDefined(previousNextContainer.previousItem) && (previousNextContainer.previousItem !== null) && (currentCode === '')) {
											currentCode = localData.extractReferencePartOnLevel(previousNextContainer.previousItem, previousNextContainer.previousItem.Reference, localData.getLineTypeLevel(lineType));
										} else if (currentCode === '') {
											currentCode = '0'; // We seem to be on top of the sibling list so we want to add between parent and first sibling item
										}

										if (angular.isDefined(nextSiblingItem) && (nextSiblingItem !== null)) {
											s2Value = localData.extractReferencePartOnLevel(nextSiblingItem, nextSiblingItem.Reference, localData.getLineTypeLevel(lineType));
										}
									} else {
										// Here we add the reference at the end of the sibling items if there are any
										if (currentDetail.DataType === boqMainStructureDetailDataType.numeric) {
											s2Value = '0';
										} else {
											var asciiCode;
											switch (currentCode.length) {
												case 0:
													canCreateAlphanumerical = false;
													break;
												case 1:
													asciiCode = currentCode.charCodeAt(0) + 2;
													s2Value = String.fromCharCode(asciiCode);
													break;
												default:
													asciiCode = currentCode.charCodeAt(currentCode.length - 1) + 2;
													s2Value = currentCode.substring(0, currentCode.length - 1) + String.fromCharCode(asciiCode);
													break;
											}
										}
									}

									result = boqMainCommonService.generateReference(currentCode, s2Value, true, canCreateAlphanumerical, createNewAtEnd, currentDetail.DataType, currentDetail.Stepincrement, currentDetail.LengthReference, false, referenceContainer, localData.compareReferences);
									if (result) {
										newReference = referenceContainer.newReference;
										currentCode = newReference;
										currentLeadingZerosPart = '';
										if (!boqMainCommonService.isReferenceMaxLengthExceeded(currentCode.length, currentDetail.LengthReference)) {
											for (var j = 1; j <= (currentDetail.LengthReference - currentCode.length); j++) {
												currentLeadingZerosPart += leadingZerosChar;
											}
										}

										// if Parent is set concatenate
										if (parentItem !== null && parentItem.BoqLineTypeFk !== boqMainLineTypes.root && parentItem.BoqLineTypeFk !== boqMainLineTypes.chapterSeparator) {
											// Removing the dot and adding it may look a little odd, but it is an easy way to test for the existance of a dot in the parent part of the reference
											newReference = localData.removeDotAtEnd(parentItem.Reference) + localData.getReferenceNumberDelimiter(true) + currentLeadingZerosPart + newReference;
										} else {
											// it is a first level group
											newReference = currentLeadingZerosPart + newReference;
										}
									}
								}

								if (result) {
									if (!_.isEmpty(newReference) && service.isGaebBoq() && (newReference.lastIndexOf(localData.getReferenceNumberDelimiter()) !== newReference.length - 1)) {
										newReference += localData.getReferenceNumberDelimiter(true); // Add final dot
									}

									childItem.Reference = newReference;

									if (addChildItemsIfNecessary) {
										if (!parentItem.BoqItems || !_.isArray(parentItem.BoqItems)) {
											parentItem.BoqItems = [];
										}

										if (!_.find(parentItem.BoqItems, {Reference: childItem.Reference})) {
											parentItem.BoqItems.push(childItem);
										}

										// Resort children
										service.resortChildren(parentItem);
									}
								} else if (angular.isDefined(nextSiblingItem) && (nextSiblingItem !== null) && (nextSiblingItem.BoqItemFk === parentItem.Id)) {
									// We couldn't find a reference fitting into the gap between the next sibling item and the child item
									// -> try to add the child item at the end
									result = localData.renumberBoqItems(parentItem, null, [childItem], level, ownChildren, addChildItemsIfNecessary, true);
								}
							}
						}

						if (!result) {
							return false; // No need to go further because reference generation already failed.
						}

						// Dig recursively deeper into the boq item hierarchy
						var hasChildren = Object.prototype.hasOwnProperty.call(childItem, 'BoqItems') && (childItem.BoqItems !== null) && childItem.BoqItems.length > 0;
						if (hasChildren && !stopRecursion) {
							result = localData.renumberBoqItems(childItem, null, childItem.BoqItems, level + 1, true);

							if (!result) {
								return false; // No need to go further because reference generation already failed.
							}
						}
					}

					return result;
				};

				// #endregion
				//  endregion


				//  region Dynamic Grid Columns
				// #region

				function loadBoqDynamicColumns(readData) {
					let dySer = service.getCommonDynamicConfigurationService();
					dySer.setIsCostGroupLoaded(true);

					// 1.dynamic quantity config for qto boq
					if(option && option.serviceName === 'qtoBoqStructureService' && _.isFunction(service.loadQtoBoqDynamicColumns)){
						service.loadQtoBoqDynamicColumns(dySer);
					}

					// 2.cost group
					//   1).Bind CostGroup data to entity
					let basicsCostGroupAssignmentService = $injector.get('basicsCostGroupAssignmentService');
					basicsCostGroupAssignmentService.process(readData, service, {
						mainDataName: 'dtos',
						attachDataName: 'BoqItem2CostGroups',
						dataLookupType: 'BoqItem2CostGroups',
						isTreeStructure: true,
						childrenName: 'BoqItems',
						identityGetter: function identityGetter(entity) {
							return {
								BoqHeaderFk: entity.RootItemId,
								Id: entity.MainItemId
							};
						}
					});

					//   2).Provide CostGroup column config for list and detail.
					let costGroupOption = {
						costGroupName: 'Assignments'
					};
					dySer.attachCostGroup(readData.CostGroupCats, service.costGroupService, costGroupOption);

					// 3.UDP
					let dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
					if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.processUDPDynamicColumns)) {
						let flattenList = [];
						cloudCommonGridService.flatten(readData.dtos, flattenList, 'BoqItems');
						dynamicUserDefinedColumnsService.processUDPDynamicColumns(dySer, readData.boqUserDefinedCostConfig, flattenList, readData.BoqUserDefinedCostValue);
						dynamicUserDefinedColumnsService.attachDecimalPlacesBasedOnRoundingConfig(service, boqMainRoundingService);
					}

					// 4.CRB BoQ Columns
					let crbGridColumns = $injector.get('boqMainCrbBoqItemService').getGridColumns(service);
					dySer.attachDynColConfigForList({'crbBoqConfig': crbGridColumns});
				}

				service.loadBoqDynamicColumns = loadBoqDynamicColumns;

				service.setDynamicUserDefinedColumnsService = function (value){
					dynamicUserDefinedColumnsService = value;
				};

				service.getDynamicUserDefinedColumnsService = function (){
					return dynamicUserDefinedColumnsService;
				};

				//  region Wizards/Tools
				// #region

				service.renumberBoq = function renumberBoq(selectedBoqItems, boqStructureDetails) {
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'boq/main/renumberBoq',
						data: {
							BoqHeaderFk: localData.selectedBoqHeader,
							SelectedBoqItems: selectedBoqItems,
							BoqStructureDetails: boqStructureDetails
						}
					}).then(
						function (response) {
							$log.log(response);
							if (response.data) {
								// fire event for refresh
								localData.loadBoqItems(0, 99, 0);

								// Notify that renummbering succeeded
								service.onRenumberBoqSucceeded.fire();
							}

							return response.data;
						},
						function (failure) {
							$log.log(failure);

							return false;
						}
					);
				};

				service.renumberFreeBoq = function(isRenumberCurrent, isWithinBoq) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'boq/main/renumberFreeBoq?boqId=' + localData.selectedBoqHeader + '&isRenumberCurrent=' + isRenumberCurrent + '&isWithinBoq=' + isWithinBoq
					}).then(
						function (success) {
							$log.log(success);
							localData.loadBoqItems(0, 99, 0);
						},
						function (failure) {
							$log.log(failure);
						}
					);
				};

				service.generateWicNumber = function generateWicNumber(data) {
					data.ProjectId = service.getSelectedProjectId();
					return $http.post(globals.webApiBaseUrl + 'boq/main/generatewicnumber', data).then(
						function (response) {
							var result = response.data;
							if (result) {
								if (result.IsSuccess) {
									if (result.ChangedRecords) {
										_.forEach(result.ChangedRecords, function (boqItem) {
											var wrapObj = {
												BoqItem: boqItem
											};
											service.syncItemsAfterUpdate(wrapObj);
										});

										service.updateItemList();
										// service.gridRefresh();

										_.forEach(service.getChildServices(), function (childService) {
											childService.load();
										});
										var currentlySelectedBoqItem = service.getSelected();
										if (currentlySelectedBoqItem) {
											localData.loadSpecificationById(currentlySelectedBoqItem.BasBlobsSpecificationFk);
										}
									}

									var resultInfo = {};

									resultInfo = {
										totalRecordsCount: result.TotalRecordsCount,
										changedRecordsCount: result.ChangedRecordsCount,
										unchangedRecordsCount: result.TotalRecordsCount - result.ChangedRecordsCount,
										changedRecords: result.ChangedRecords,
										unChangedRecords: result.UnChangedRecords
									};

									return platformModalService.showDialog({
										resultInfo: resultInfo,
										templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-generate-wic-number-result-template.html',
										backdrop: false,
										width: 600,
										height: 800,
										resizeable: true

									});

									// return platformModalService.showMsgBox(result.Message, $translate.instant('boq.main.generateWicNumber'));
								} else {
									return platformModalService.showErrorBox(result.Message, $translate.instant('boq.main.generateWicNumber'));
								}
							}
						},
						function () {
							$log.log('generatewicnumber failure');
						}
					);
				};

				service.updateDataFromWic = function (dataItem) {
					dataItem.ProjectId = service.getSelectedProjectId();
					return $http.post(globals.webApiBaseUrl + 'boq/main/UpdateDataFromWicBoqItem', dataItem).then(
						function (response) {
							var result = response.data;
							if (result) {
								if (result.IsSuccess) {
									if (result.ChangedRecords) {
										_.forEach(result.ChangedRecords, function (boqItem) {
											var wrapObj = {
												BoqItem: boqItem
											};
											service.syncItemsAfterUpdate(wrapObj);
										});

										service.updateItemList();
										// service.gridRefresh();

										_.forEach(service.getChildServices(), function (childService) {
											childService.load();
										});
										var currentlySelectedBoqItem = service.getSelected();
										if (currentlySelectedBoqItem) {
											localData.loadSpecificationById(currentlySelectedBoqItem.BasBlobsSpecificationFk);
										}
									}

									var resultInfo = {};

									resultInfo = {
										totalRecordsCount: result.TotalRecordsCount,
										changedRecordsCount: result.ChangedRecordsCount,
										unchangedRecordsCount: result.TotalRecordsCount - result.ChangedRecordsCount,
										changedRecords: result.ChangedRecords,
										unChangedRecords: result.UnChangedRecords
									};

									return platformModalService.showDialog({
										resultInfo: resultInfo,
										templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-generate-wic-number-result-template.html',
										backdrop: false,
										width: 600,
										height: 800,
										resizeable: true

									});

								} else {
									return platformModalService.showErrorBox(result.Message, $translate.instant('boq.main.updateDatafromWIC'));
								}
							}
						},
						function () {
							$log.log('generatewicnumber failure');
						}
					);

				};

				/**
				 * @ngdoc function
				 * @name importGaebFile
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description do a GAEB import with the given file into the currently selected boq
				 * @param {String} gaebFile name of the GAEB file
				 * @param {String} fileContent
				 */
				service.importGaebFile = function importGaebFile(gaebFile/* , fileContent */) {
					return $http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'boq/main/import/importgaeb',
						headers: {'Content-Type': undefined},
						transformRequest: function (data) {
							var fd = new FormData();
							fd.append('model', angular.toJson(data.model));

							if (data.file) {
								fd.append('file', data.file);
							}

							return fd;
						},
						data: {model: localData.selectedBoqHeader, file: gaebFile}
					}).then(
						function (success) {
							$log.log(success);

							var modalOptions = {
								headerTextKey: 'boq.main.gaebImport',
								bodyTextKey: success.data,
								showOkButton: true,
								iconClass: 'ico-info'
							};

							var platformModalService = $injector.get('platformModalService');
							platformModalService.showDialog(modalOptions);

							service.refreshBoqData();
						},
						function (failure) {
							$log.log(failure);
						}
					);
				};

				service.addBoqHeaderDeepCopyTool = function(scope, boqHeaderContextService) {
					function execute() {
						platformDialogService.showYesNoDialog('boq.main.createDeepCopy', 'cloud.common.infoBoxHeader').then(function (result) {
							if (result.yes) {
								boqHeaderContextService.createDeepCopy();
							}
						});
					}

					function isDisabled() {
						return !_.some(boqHeaderContextService.getSelected());
					}

					scope.addTools([{
						id:        'deepcopy',
						caption:   'cloud.common.taskBarDeepCopyRecord',
						type:      'item',
						iconClass: 'tlb-icons ico-copy-paste-deep',
						fn:        execute,
						disabled:  isDisabled,
						permission:'#c'
					}]);
				};

				service.addBoqBackupTools = function(scope, boqHeaderContextService, boqPropertyName, httpRoutePrefix) {
					$injector.get('boqMainBackupService').addBoqBackupTools(scope, boqHeaderContextService, boqPropertyName, httpRoutePrefix);
				};

				/**
				 * @ngdoc function
				 * @name getEstimateMargin
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the currently given estimate margin that is placed in sales wip header
				 * @returns {number} the estimate margin
				 */
				service.getEstimateMargin = function getEstimateMargin() {
					let estimateMargin = 0;

					let callingContext = service.getCallingContext();

					if (_.isObject(callingContext) && _.isObject(callingContext.SalesWipHeader) && _.isNumber(callingContext.SalesWipHeader.FactorDJC)) {
						estimateMargin = callingContext.SalesWipHeader.FactorDJC;
					}

					return estimateMargin;
				};

				/**
				 * @ngdoc function
				 * @name getCurrentBillToMode
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the currently active bill-to mode that's maintained at project level
				 * @returns {number} the currently active bill-to mode
				 */
				service.getCurrentBillToMode = function getCurrentBillToMode() {
					// Get the currently loaded project entity
					let project = basicsLookupdataLookupDescriptorService.getItemByIdSync(service.getSelectedProjectId(), {lookupType: 'Project'});
					let billToModes = $injector.get('billToModes');
					let currentBillToMode = billToModes.none;

					currentBillToMode = _.isObject(project) ? project.IsPercentageBased ? billToModes.percentageBased : billToModes.quantityOrItemBased : billToModes.none;

					return currentBillToMode;
				};

				// #endregion
				//  endregion

				// #endregion
				//  endregion


				//  region Calculation  ==ts==>  BoqItemCalculator in folder 'model' (no factoring in the first step, maybe when there is remaining time at the end of year 2024)
				// #region

				localData.isCalculateOverGross = false;

				// TODO: to be refactored by changing function name, creating calculate service, reducing redundancies, by separating 'isItemWithIT', ColVal1,2,3,4,5
				localData.calcFinalPriceHoursNew = function (item, calculatedProperties, boqItemList, changePropertyName) {
					function roundValue(boqItem, fieldName, fieldValue) {
						boqItem[fieldName] = service.roundValue(fieldValue, fieldName);
						// TODO: calculation of OC values here?
					}

					let udpColumns = ['ColVal1', 'ColVal2', 'ColVal3', 'ColVal4', 'ColVal5'];
					function calculateUDPValue(item, preEscalationForColVal, propertyName){
						let isItemWithIT = service.isItemWithIT(item);
						_.forEach(udpColumns, function(udpColumn){
							if(_.isNumber(item[udpColumn])){
								let oldValue = item[udpColumn + 'Total'];
								item[udpColumn] = service.roundValueByDetailType(item[udpColumn], boqMainRoundingConfigDetailType.UnitRate); // Before calculating the total, round the related ColVal'1-5' value.
								item[udpColumn + 'Total'] = isItemWithIT ? (service.roundValueByDetailType(item[udpColumn]  * preEscalationForColVal, boqMainRoundingConfigDetailType.Amounts)) : 0; // Rounded calculation of total value

								if(!item.isUDPChanged){
									item.isUDPChanged = (oldValue !== item[udpColumn + 'Total']);
								}
							}
						});

						if(_.isString(propertyName) && propertyName.indexOf('ColVal') !== -1){
							item.isUDPChanged = true;
						}
					}

					var taxCodeFk = getValidTaxCodeFk(item);
					var taxCode = getTaxCode(taxCodeFk);
					var vatPercent = taxCode ? taxCode.VatPercent : 0;

					if (boqMainCommonService.isItem(item)) {

						if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'TotalPrice') || _.includes(calculatedProperties, 'TotalHours'))) {
							service.initInstalledValues(item);
						}

						// Round atomic values
						roundInitialValues(item);

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {

							if (item.IsLeadDescription && item.IsUrFromSd) {
								item.Price = service.roundValue(localData.getSubdescriptionsTotal(item), 'Price'); // Here we have a lead description that gets its price from the corresponding subdescriptions total
								item.PriceOc = service.roundValue(localData.getSubdescriptionsTotal(item, true), 'PriceOc'); // Flag true indicates getting the total based on Oc values.
							}

							if (localData.isCalculateOverGross && _.isString(changePropertyName) && changePropertyName === 'MdcTaxCodeFk') {
								// Calculate the net values out of the gross values
								service.calPriceOrPriceOcByGross(item, true); // calculate Price out of PriceGross
								service.calPriceOrPriceOcByGross(item, false);  // calculate PriceOc out of PriceGrossOc
							}

							item.Correction = item.Price - item.Cost;
							item.DiscountedUnitprice = service.roundValue(item.Price - (item.Price * item.DiscountPercent / 100), 'DiscountedUnitprice'); // discount => abs (-)

							// TODO: beautify
							roundValue(item, 'DiscountedPrice', math.bignumber(item.DiscountedUnitprice).mul(item.Quantity).mul(item.Factor).toNumber()); // DiscountedPrice = DiscountedUnitprice * Quantity * Factor
							roundValue(item, 'ItemTotal',       math.bignumber(item.Price).              mul(item.Quantity).mul(item.Factor).toNumber()); // ItemTotal       = Price               * Quantity * Factor

							item.PreEscalation = service.isItemWithIT(item) ? item.ItemTotal : 0;

							item.IQPreEscalation = service.isItemWithIT(item) ? (item.DiscountedUnitprice * item.InstalledQuantity * item.Factor): 0;
							item.BQPreEscalation = service.isItemWithIT(item) ? (item.DiscountedUnitprice * item.BilledQuantity * item.Factor) : 0;

							item.Finalprice = service.isItemWithIT(item) ? service.roundValue((item.ItemTotal + item.ExtraIncrement) * (1 - item.DiscountPercent / 100), 'Finalprice') : 0;

							item.CorrectionOc = item.PriceOc - item.CostOc;
							item.ItemTotalOc = service.roundValue(item.PriceOc * item.Quantity * item.Factor, 'ItemTotalOc');
							item.DiscountedUnitpriceOc = service.roundValue(item.PriceOc - (item.PriceOc * item.DiscountPercent / 100), 'DiscountedUnitpriceOc'); // discount => abs (-)
							item.DiscountedPriceOc = service.roundValue(item.DiscountedUnitpriceOc * item.Quantity * item.Factor, 'DiscountedPriceOc');
							item.PreEscalationOc = service.isItemWithIT(item) ? item.ItemTotalOc : 0;
							item.FinalpriceOc = service.isItemWithIT(item) ? service.roundValue((item.ItemTotalOc + item.ExtraIncrementOc) * (1 - item.DiscountPercent / 100), 'FinalpriceOc') : 0;

							calculateUDPValue(item, item.Quantity * item.Factor, changePropertyName);


							/* calculate pricegross, pricocgross, finalgross and finalgrossoc */
							item.Pricegross = service.roundValue(item.DiscountedUnitprice * (100 + vatPercent) / 100, 'Pricegross');
							item.Finalgross = service.isItemWithIT(item) ? service.roundValue(item.Finalprice * (100 + vatPercent) / 100, 'Finalgross') : 0;
							item.PricegrossOc = service.roundValue(item.DiscountedUnitpriceOc * (100 + vatPercent) / 100, 'PricegrossOc');
							item.FinalgrossOc = service.isItemWithIT(item) ? service.roundValue(item.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc') : 0;


							if (!service.isItemWithIT(item)) {
								item.BudgetTotal = 0;
								item.BudgetDifference = 0;
							} else {
								let relevantQuantityForBudget = localData.getCurrentlyRelevantQuantityForBudget(item);
								let fixBudgetTotal = _fixedBudgetTotal;
								if(item.BudgetFixedTotal || item.BudgetFixedUnit) {
									fixBudgetTotal = item.BudgetFixedTotal;
								}

								if (!fixBudgetTotal) {
									item.BudgetTotal = service.roundValue(relevantQuantityForBudget * item.BudgetPerUnit, 'BudgetTotal');
								} else {
									item.BudgetPerUnit = _.isNumber(relevantQuantityForBudget) && relevantQuantityForBudget !== 0 ? service.roundValue(item.BudgetTotal / relevantQuantityForBudget, 'BudgetPerUnit') : 0;
								}
							}

							if (service.getServiceName() === 'salesContractBoqStructureService') {
								let quantity = _calculationOfExpectedRevenueSysOpt ? (item.ExWipIsFinalQuantity ? item.ExWipQuantity : item.QuantityAdj) : item.Quantity;
								item.ExWipExpectedRevenue = service.roundValueByDetailType(quantity * item.DiscountedUnitprice, boqMainRoundingConfigDetailType.amounts);
							}
						}

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
							item.Hours = service.isItemWithIT(item) ? service.roundValue(item.HoursUnit * item.Quantity * item.Factor, 'Hours') : 0;
						}
					}
					else if (boqMainCommonService.isSurchargeItem(item)) {
						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {
							item.Quantity = localData.getSurchargedItemsTotal(item, boqItemList);
							// Info: The price property carries the surcharge percentage in case the item is a surcharge item
							item.Correction = 0;
							item.ItemTotal = service.roundValue(item.Price * item.Quantity * item.Factor / 100, 'ItemTotal');
							item.DiscountedUnitprice = service.roundValue(item.ItemTotal, 'DiscountedUnitprice');
							item.DiscountedPrice = service.roundValue(item.DiscountedUnitprice - (item.DiscountedUnitprice * item.DiscountPercent / 100), 'DiscountedPrice');
							item.PreEscalation = service.isItemWithIT(item) ? service.roundValue(item.DiscountedPrice, 'PreEscalation') : 0;


							var iqUnitPrice = item.Price * item.InstalledQuantity * item.Factor / 100;
							var bqUnitPrice = item.Price * item.BilledQuantity * item.Factor / 100;

							item.IQPreEscalation = service.isItemWithIT(item) ? (iqUnitPrice - (iqUnitPrice * item.DiscountPercent / 100)): 0;
							item.BQPreEscalation = service.isItemWithIT(item) ? (bqUnitPrice - (bqUnitPrice * item.DiscountPercent / 100)) : 0;

							item.Finalprice = service.isItemWithIT(item) ? service.roundValue(item.PreEscalation + item.ExtraIncrement, 'Finalprice') : 0;

							item.CorrectionOc = 0;
							// For the Price property holds a percentage value the PriceOc value also holds the same percentage and not a derived OC value
							item.PriceOc = item.Price;
							item.ItemTotalOc = service.roundValue(item.PriceOc * localData.getSurchargedItemsTotal(item, boqItemList, true) / 100, 'ItemTotalOc');
							item.DiscountedUnitpriceOc = service.roundValue(item.ItemTotalOc, 'DiscountedUnitpriceOc');
							item.DiscountedPriceOc = service.roundValue(item.DiscountedUnitpriceOc - (item.DiscountedUnitpriceOc * item.DiscountPercent / 100), 'DiscountedPriceOc');
							item.PreEscalationOc = service.isItemWithIT(item) ? service.roundValue(item.DiscountedPriceOc, 'PreEscalationOc') : 0;
							item.FinalpriceOc = service.isItemWithIT(item) ? service.roundValue(item.PreEscalationOc + item.ExtraIncrementOc, 'FinalpriceOc') : 0;


							// user defined column calculation like Finalprice ,but do not use DiscountPercent  and ExtraIncrement
							calculateUDPValue(item, item.Quantity * item.Factor / 100, changePropertyName);

							item.Pricegross = service.roundValue(item.DiscountedUnitprice * (100 + vatPercent) / 100, 'Pricegross');
							item.Finalgross = service.isItemWithIT(item) ? service.roundValue(item.Finalprice * (100 + vatPercent) / 100, 'Finalgross') : 0;
							item.PricegrossOc = service.roundValue(item.DiscountedUnitpriceOc * (100 + vatPercent) / 100, 'PricegrossOc');
							item.FinalgrossOc = service.isItemWithIT(item) ? service.roundValue(item.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc') : 0;
						}
					}


					if(option.serviceName === 'qtoBoqStructureService'){
						service.calcQtoBoqNewFinalPrice(item);
					}
					if (service.calcTotalPrice) {
						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(item, 'TotalQuantity')) {
							service.calcTotalPrice(item);
						}
					}

					if (service.calcTotalHours) {
						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(item, 'TotalQuantity')) {
							service.calcTotalHours(item);
						}
					}

					return item;
				};

				/**
				 * @ngdoc function
				 * @name calcFinalPrice
				 * @function
				 * @methodOf
				 * @description Calculate the final price *** !! FUNCTION OBSOLETE !! ***
				 * @param {Object} dataContext : underlying boq item entity
				 */
				localData.calcFinalPrice = function calcFinalPrice(dataContext) {

					dataContext.ItemTotal = dataContext.Price * dataContext.Quantity;
					dataContext.DiscountedUnitprice = dataContext.Price + (dataContext.Price * dataContext.DiscountPercent / 100);
					dataContext.DiscountedPrice = dataContext.DiscountedUnitprice * dataContext.Quantity;
					dataContext.Finalprice = dataContext.DiscountedPrice - dataContext.Discount; // discount => abs (-)

					dataContext.ItemTotalOc = dataContext.PriceOc * dataContext.Quantity;
					dataContext.DiscountedUnitpriceOc = dataContext.PriceOc + (dataContext.PriceOc * dataContext.DiscountPercent / 100);
					dataContext.DiscountedPriceOc = dataContext.DiscountedUnitpriceOc * dataContext.Quantity;
					dataContext.FinalpriceOc = dataContext.DiscountedPriceOc - dataContext.DiscountOc; // discount => abs (-)
				};

				/**
				 * @ngdoc function
				 * @name recalculateMonetaryValuesBasedOnNewExchangeRate
				 * @function
				 * @methodOf
				 * @description Recalculate the basic monetary values of the visited boqItem (i.e. Price, LumpsumPrice or Discount)
				 * based on the new exchange rate handed over in visitorObject
				 * @param {Object} parentItem which is the parent of the boqItem
				 * @param {Object} boqItem whose monetary values are to be recalculated
				 * @param {Number} lineType of boqItem
				 * @param {Number} level of boqItem
				 * @param {Object} visitorObject parameter when used in recursion, at least holding the new exhcange rate
				 * @returns {Boolean}
				 */
				localData.recalculateMonetaryValuesBasedOnNewExchangeRate = function recalculateMonetaryValuesBasedOnNewExchangeRate(parentItem, boqItem, lineType, level, visitorObject) {

					var newExchangeRate = _.isObject(visitorObject) && Object.prototype.hasOwnProperty.call(visitorObject, 'newExchangeRate') ? visitorObject.newExchangeRate : null;
					var converted = false;

					if (newExchangeRate === null || newExchangeRate === 0) {
						return false;
					}

					if (boqMainCommonService.isItem(boqItem) && (boqItem.Price !== 0 || boqItem.PriceOc !== 0)) {
						boqItem.Price = service.roundValue(boqItem.PriceOc / newExchangeRate, 'Price');
						converted = true;
					} else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
						if (boqItem.IsLumpsum && (boqItem.LumpsumPrice !== 0 || boqItem.LumpsumPriceOc !== 0)) {
							boqItem.LumpsumPrice = service.roundValue(boqItem.LumpsumPriceOc / newExchangeRate, 'LumpsumPrice');
							converted = true;
						} else if (boqItem.Discount !== 0 || boqItem.DiscountOc !== 0) {
							boqItem.Discount = service.roundValue(boqItem.DiscountOc / newExchangeRate, 'Discount');
							converted = true;
						}
					}

					if (converted) {
						service.markItemAsModified(boqItem);
					}

					return true;
				};

				/**
				 * @ngdoc function
				 * @name calcRemQuantity
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the remaining quantity
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 */
				service.calcRemQuantity = function calcRemQuantity(boqItem) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						if (boqItem.OrdQuantity > boqItem.TotalQuantity) {
							boqItem.RemQuantity = boqItem.OrdQuantity - boqItem.TotalQuantity;
						} else {
							boqItem.RemQuantity = 0;
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcTotalQuantity
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the total quantity
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcTotalQuantity = function calcTotalQuantity(boqItem, isChanged) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						if (isChanged) {
							boqItem.Quantity = boqItem.TotalQuantity - (boqItem.PrevQuantity ? boqItem.PrevQuantity : 0);
							service.calcDependantValues(boqItem, 'TotalQuantity');
						} else {
							boqItem.TotalQuantity = boqItem.Quantity + (boqItem.PrevQuantity ? boqItem.PrevQuantity : 0);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcTotalRejectedQuantity
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the total rejected quantity
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcTotalRejectedQuantity = function calcTotalRejectedQuantity(boqItem, isChanged) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						if (isChanged) {
							boqItem.ExSalesRejectedQuantity = boqItem.TotalRejectedQuantity - (boqItem.PrevRejectedQuantity ? boqItem.PrevRejectedQuantity : 0);
							// service.calcDependantValues(boqItem, 'TotalRejectedQuantity');
						} else {
							boqItem.TotalRejectedQuantity = boqItem.ExSalesRejectedQuantity + (boqItem.PrevRejectedQuantity ? boqItem.PrevRejectedQuantity : 0);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcPercentageQuantity
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the current percentage
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcPercentageQuantity = function calcPercentageQuantity(boqItem, isChanged) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
						if (boqMainCommonService.isItem(boqItem)) {
							if (isChanged && !boqItem.IsQtoForQuantity && !boqItem.IsQtoForBillBoQQuantity) {
								boqItem.Quantity = boqItem.OrdQuantity * boqItem.PercentageQuantity / 100;
								service.calcDependantValues(boqItem, 'PercentageQuantity');
							} else {
								boqItem.PercentageQuantity = boqItem.OrdQuantity === 0 ? 0 : boqItem.Quantity / boqItem.OrdQuantity * 100;
							}
						} else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
							if (isChanged) {
								boqItem.PreEscalation = boqItem.OrdItemTotal * boqItem.PercentageQuantity / 100;
								service.calcDependantValues(boqItem, 'TotalPrice');
							} else {
								boqItem.PercentageQuantity = (!_.isNumber(boqItem.OrdItemTotal) || boqItem.OrdItemTotal === 0) ? 0 : boqItem.PreEscalation / boqItem.OrdItemTotal * 100;
							}
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcCumulativePercentage
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the cumulative percentage
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcCumulativePercentage = function calcCumulativePercentage(boqItem, isChanged) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
						if (boqMainCommonService.isItem(boqItem)) {
							if (isChanged && !boqItem.IsQtoForQuantity && !boqItem.IsQtoForBillBoQQuantity) {
								boqItem.TotalQuantity = boqItem.OrdQuantity * boqItem.CumulativePercentage / 100;
								boqItem.Quantity = boqItem.TotalQuantity - (boqItem.PrevQuantity ? boqItem.PrevQuantity : 0);
								service.calcDependantValues(boqItem, 'CumulativePercentage');
							} else {
								boqItem.CumulativePercentage = boqItem.OrdQuantity === 0 ? 0 : boqItem.TotalQuantity / boqItem.OrdQuantity * 100;
							}
						} else if (boqMainCommonService.isDivisionOrRoot(boqItem)) {
							if (isChanged) {
								boqItem.PreEscalationTotal = boqItem.OrdItemTotal * boqItem.CumulativePercentage / 100;
								service.calcDependantValues(boqItem, 'TotalPrice');
							} else {
								boqItem.CumulativePercentage = (!_.isNumber(boqItem.OrdItemTotal) || boqItem.OrdItemTotal === 0) ? 0 : boqItem.PreEscalationTotal / boqItem.OrdItemTotal * 100;
							}
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcItemTotalEditable
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the editable item total
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcItemTotalEditable = function calcItemTotalEditable(boqItem, isChanged, isOc) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						if (isChanged) {
							var itemTotal = isOc ? boqItem.ItemTotalEditableOc : boqItem.ItemTotalEditable;
							var price = isOc ? boqItem.PriceOc : boqItem.Price;
							boqItem.Quantity = (price !== 0 && boqItem.Factor !== 0) ? itemTotal / (price * boqItem.Factor) : 0;
							service.calcDependantValues(boqItem, 'ItemTotalEditable');
						} else {
							boqItem.OrdItemTotal = boqItem.DiscountedUnitprice * boqItem.OrdQuantity * boqItem.Factor;
						}
						boqItem.ItemTotalEditable   = boqItem.Price   * boqItem.Quantity * boqItem.Factor;
						boqItem.ItemTotalEditableOc = boqItem.PriceOc * boqItem.Quantity * boqItem.Factor;
					}
				};

				/**
				 * @ngdoc function
				 * @name calcItemTotalEditableOc
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the editable item total
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcItemTotalEditableOc = function calcItemTotalEditableOc(boqItem, isChanged) {
					service.calcItemTotalEditable(boqItem, isChanged ,true);
				};

				/**
				 * @ngdoc function
				 * @name calcTotalPrice
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the total price
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {Boolean} isChanged : indicating that the property has been changed itself and basic property has to be recalculated
				 */
				service.calcTotalPrice = function calcTotalPrice(boqItem, isChanged) {
					if (_.isObject(boqItem) && Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						if (isChanged) {
							boqItem.PreEscalationTotal = boqItem.TotalPrice - boqItem.ExtraTotal;
							boqItem.TotalQuantity = (boqItem.DiscountedUnitprice !== 0) ? boqItem.PreEscalationTotal / boqItem.DiscountedUnitprice : 0;
							boqItem.Quantity = boqItem.TotalQuantity - (boqItem.PrevQuantity ? boqItem.PrevQuantity : 0);
							service.calcDependantValues(boqItem, 'TotalPrice');
						} else {
							boqItem.PreEscalationTotal = boqItem.DiscountedUnitprice * boqItem.TotalQuantity * boqItem.Factor;
							boqItem.TotalPrice = boqItem.PreEscalationTotal + boqItem.ExtraTotal;
							boqItem.TotalPriceOc = boqItem.TotalPrice * localData.currentExchangeRate;
							boqItem.Performance = boqItem.Quantity * boqItem.VobDirectCostPerUnit * service.getEstimateMargin();
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcTotalHours
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the total hours
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 */
				service.calcTotalHours = function calcTotalHours(boqItem) {
					if (Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity') && boqMainCommonService.isItem(boqItem)) {
						boqItem.TotalHours = boqItem.HoursUnit * boqItem.TotalQuantity;
					}
				};

				/**
				 * @ngdoc function
				 * @name calcItemsPriceHoursNew
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description trigger the calculation of finalprice and hours
				 * @param {Object} item to whose values are to be calculated
				 * @param {Boolean} doCalcParentChain triggers calculation of parent items
				 * @param {Boolean} calcChildrenFirst indicates that the children of the given item have to be calculated first before calculating up the parent chain
				 * @param {String} changePropertyName tells if there was a special property changed that now causes the calculation.
				 */
				service.calcItemsPriceHoursNew = function calcItemsPriceHoursNew(item, doCalcParentChain, calcChildrenFirst, changePropertyName) {
					if (item.IsOenBoq) { // OENORM currently does NOT calculate on the client
						return;
					}

					var oldFinalPrice = item.Finalprice;
					var calcItem = localData.calcFinalPriceHoursNew(item, undefined, undefined, changePropertyName);
					var parentChainAlreadyCalculated = false;
					service.markItemAsModified(item);

					if ((item.Finalprice !== oldFinalPrice)) {
						// The following call determines if there are sibling surcharge items.
						// If so it triggers the calculation of all sibling items to make sure all dependent value are up-to-date
						// and finally calls the calculation of the parentChain. The return value indicates that sibling surcharge items
						// were found and the described calculations were done.
						parentChainAlreadyCalculated = service.updateSiblingSurchargeItems(item, false);
					}

					if(option.serviceName === 'qtoBoqStructureService') {
						service.initQtoBoqNewFinalPrices(item);
					}
					if (doCalcParentChain && !parentChainAlreadyCalculated) {
						service.calcParentChain(item, calcChildrenFirst, false, changePropertyName);
					}

					// mark user define price as modified
					let dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
					if(item.isUDPChanged && dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.markUdpAsModified)){
						dynamicUserDefinedColumnsService.markUdpAsModified(item);
						item.isUDPChanged = false;
					}

					service.boqItemPriceChanged.fire(calcItem);
				};

				/**
				 * @ngdoc function
				 * @name calcUrb
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description trigger the calculation of the unit rate depending on the changes in the urb's
				 * @param {Object} item whose urb values have changed
				 * @param {Boolean} skipFinalpriceCalc: flag to trigger or skip calculation of finalprice
				 */
				service.calcUrb = function calcUrb(item, skipFinalpriceCalc) {

					if (angular.isUndefined(item) || item === null) {
						return;
					}

					// The calculation with unit rate breakdowns follows certain rules.
					// If the isUrb flag is set to true the sum of the urb is set to the unit rate.

					if (item.IsUrb) {
						// Calculate the unit rate as sum of all urbs. Don't get confused for we use the price property.
						// Currently we use it as carrier of the unit rate information.
						roundInitialValues(item); // round atomic values
						item.Price = service.roundValue(item.Urb1 + item.Urb2 + item.Urb3 + item.Urb4 + item.Urb5 + item.Urb6, 'Price');
						item.PriceOc = service.roundValue(item.Urb1Oc + item.Urb2Oc + item.Urb3Oc + item.Urb4Oc + item.Urb5Oc + item.Urb6Oc, 'PriceOc');

						if (!skipFinalpriceCalc) {
							service.calcItemsPriceHoursNew(item, true);
						}

						service.markItemAsModified(item);
					}
				};

				/**
				 * @ngdoc function
				 * @name recalcUrbs
				 * @function
				 * @methodOf boqMainServiceFactory.service
				 * @description trigger the recalculation of the unit rate breakdowns in accordance of the current price value.
				 * This is only done when the flag CalcFromUrb in BoqStructure is set to true.
				 * @param {Object} item whose urb values have to be recalculated
				 */
				service.recalcUrbs = function recalcUrbs(item) {

					if (angular.isUndefined(item) || item === null) {
						return;
					}

					// The calculation with unit rate breakdowns follows certain rules.
					// If the unit rate (price) itself changes this change is reflected in a change of the corresponding urbs, but only if the flag CalcFromUrb in BoqStructure is set to true.

					var boqStructure = boqStructureService.getStructure();
					roundInitialValues(item); // round atomic values
					var fractionSum = item.Urb1 + item.Urb2 + item.Urb3 + item.Urb4 + item.Urb5 + item.Urb6;
					var firstEditableUrbIndex = -1;

					if (angular.isDefined(boqStructure) && boqStructure !== null && boqStructure.CalcFromUrb) {
						if (item.IsUrb) {
							// The urbs are adjusted in a way that the fractions remain the same but the sum equals the newly entered unit rate.

							// We don't have to adjust the item urbs if the fractionSum is equal to the current unit rate (price)
							if (item.Price === fractionSum || fractionSum === 0) {

								if (item.Urb1 === 0 && item.Urb2 === 0 && item.Urb3 === 0 && item.Urb4 === 0 && item.Urb5 === 0 && item.Urb6 === 0) {
									// In this case we set the current Price(Oc) to the first editable Urbx(Oc)
									for (var i = 1; i <= 6; i++) {
										if (!_.isEmpty(boqStructure['NameUrb' + i])) {
											firstEditableUrbIndex = i;
											break;
										}
									}

									if (firstEditableUrbIndex !== -1) {
										item['Urb' + firstEditableUrbIndex] = item.Price;
										item['Urb' + firstEditableUrbIndex + 'Oc'] = item.PriceOc;
									}
								}

								return; // No adjustments necessary
							}

							var fractions = [];
							fractions.push(item.Urb1 / fractionSum); // Fraction 1
							fractions.push(item.Urb2 / fractionSum); // Fraction 2
							fractions.push(item.Urb3 / fractionSum); // Fraction 3
							fractions.push(item.Urb4 / fractionSum); // Fraction 4
							fractions.push(item.Urb5 / fractionSum); // Fraction 5
							fractions.push(item.Urb6 / fractionSum); // Fraction 6

							// Now calculate the new urb values based on the newly entered unit rate (price)
							item.Urb1 = service.roundValue(item.Price * fractions[0], 'Urb1');
							item.Urb2 = service.roundValue(item.Price * fractions[1], 'Urb2');
							item.Urb3 = service.roundValue(item.Price * fractions[2], 'Urb3');
							item.Urb4 = service.roundValue(item.Price * fractions[3], 'Urb4');
							item.Urb5 = service.roundValue(item.Price * fractions[4], 'Urb5');
							item.Urb6 = service.roundValue(item.Price * fractions[5], 'Urb6');

							// When we round the resulting Urb1-6 values their sum might not be to given Price
							// -> add or remove a possible difference to the final urb6
							fractionSum = item.Urb1 + item.Urb2 + item.Urb3 + item.Urb4 + item.Urb5 + item.Urb6;
							let diff = item.Price - fractionSum;
							if(diff !== 0) {
								item.Urb6 += diff;
							}

							// For the Oc values we can use the same fractions for they should be identical between Hc and Oc values
							item.Urb1Oc = service.roundValue(item.PriceOc * fractions[0], 'Urb1OC');
							item.Urb2Oc = service.roundValue(item.PriceOc * fractions[1], 'Urb2OC');
							item.Urb3Oc = service.roundValue(item.PriceOc * fractions[2], 'Urb3OC');
							item.Urb4Oc = service.roundValue(item.PriceOc * fractions[3], 'Urb4OC');
							item.Urb5Oc = service.roundValue(item.PriceOc * fractions[4], 'Urb5OC');
							item.Urb6Oc = service.roundValue(item.PriceOc * fractions[5], 'Urb6OC');

							fractionSum = item.Urb1Oc + item.Urb2Oc + item.Urb3Oc + item.Urb4Oc + item.Urb5Oc + item.Urb6Oc;
							diff = item.PriceOc - fractionSum;
							if(diff !== 0) {
								item.Urb6Oc += diff;
							}
						} else {
							// Reset the Urb's

							// We don't have to adjust the item urbs if they are already reset
							if (fractionSum === 0) {
								return; // No adjustments necessary
							}

							item.Urb1 = 0;
							item.Urb2 = 0;
							item.Urb3 = 0;
							item.Urb4 = 0;
							item.Urb5 = 0;
							item.Urb6 = 0;

							item.Urb1Oc = 0;
							item.Urb2Oc = 0;
							item.Urb3Oc = 0;
							item.Urb4Oc = 0;
							item.Urb5Oc = 0;
							item.Urb6Oc = 0;
						}

						service.gridRefresh();

						service.markItemAsModified(item);
					}
				};


				service.calcUserDefinedColumnParentChain  = function calcUserDefinedColumnParentChain(item){
					if (boqMainCommonService.isDivisionOrRoot(item)) {
						service.calcUserDefinedColumncalcParentItem(item);
					}

					var parentItem = localData.getParentBoqItem(item);
					if (angular.isUndefined(parentItem) || parentItem === null) {
						return;
					}
					service.calcUserDefinedColumnParentChain(parentItem);
				};
				service.calcUserDefinedColumncalcParentItem = function calcUserDefinedColumncalcParentItem(parentItem){

					if (angular.isUndefined(parentItem) || parentItem === null) {
						return;
					}
					var childItem = null;
					var childCount = _.isArray(parentItem.BoqItems) ? parentItem.BoqItems.length : 0;
					parentItem.ColVal1Total = 0;
					parentItem.ColVal2Total = 0;
					parentItem.ColVal3Total = 0;
					parentItem.ColVal4Total = 0;
					parentItem.ColVal5Total = 0;

					for (var i = 0; i < childCount; i++) {
						childItem = parentItem.BoqItems[i];
						if (angular.isDefined(childItem) && childItem !== null) {
							if (((boqMainCommonService.isItem(childItem) || boqMainCommonService.isSurchargeItem(childItem)) && service.isItemWithIT(childItem)) || (boqMainCommonService.isDivisionOrRoot(childItem) && service.isDivisionOrRootWithIT(childItem))) {
								service.calcUserDefinedColumnOfParentItem(parentItem,childItem);
							}
						}
					}

				};

				service.calcUserDefinedColumnOfParentItem = function calcUserDefinedColumnOfParentItem (parentItem,childItem){
					let udpTotalColumns = ['ColVal1Total', 'ColVal2Total', 'ColVal3Total', 'ColVal4Total', 'ColVal5Total'];

					_.forEach(udpTotalColumns, function(udpTotalColumn){
						if(_.isNumber(childItem[udpTotalColumn])){
							let oldValue = parentItem[udpTotalColumn];
							parentItem[udpTotalColumn] += childItem[udpTotalColumn];

							if(!parentItem.isUDPChanged){
								parentItem.isUDPChanged = (oldValue !== parentItem[udpTotalColumn]);
							}
						}
					});
				};

				/**
				 * @ngdoc function
				 * @name calcParentItem
				 * @function
				 * @methodOf boq.main.boqMainServiceFactory
				 * @description Calculate the parent item by traversing its child items and summing up the according values.
				 * We don't iterate over the whole tree but only stay on the level of the parent item and its children.
				 * @param {Object} parentItem to start the calculation with
				 */
				service.calcParentItem = function calcParentItem(parentItem) {

					if (angular.isUndefined(parentItem) || parentItem === null) {
						return;
					}

					// Now look for the children of this parent and sum up the corresponding values to the parent
					var childItem = null;
					var sumBudgetTotal = 0;
					var vatPercent = service.getVatPercentForBoqItem(parentItem);
					var childCount = _.isArray(parentItem.BoqItems) ? parentItem.BoqItems.length : 0;

					roundInitialValues(parentItem);

					// Reset old values
					parentItem.ItemTotal = 0;
					parentItem.ExtraIncrement = 0;
					parentItem.ExtraIncrementOc = 0;
					parentItem.PreEscalation = 0;
					parentItem.IQPreEscalation = 0;
					parentItem.PreEscalationTotalForBQ =0;
					parentItem.PreEscalationTotalForIQ =0;
					parentItem.BQPreEscalation = 0;
					parentItem.PreEscalationOc = 0;
					parentItem.Finalprice = 0;
					parentItem.DiscountedPrice = 0;
					parentItem.ItemTotalOc = 0;
					parentItem.FinalpriceOc = 0;
					parentItem.DiscountedPriceOc = 0;
					parentItem.Hours = 0;
					parentItem.Finalgross = 0;
					parentItem.FinalgrossOc = 0;

					parentItem.ColVal1Total = 0;
					parentItem.ColVal2Total = 0;
					parentItem.ColVal3Total = 0;
					parentItem.ColVal4Total = 0;
					parentItem.ColVal5Total = 0;

					if(option.serviceName === 'qtoBoqStructureService') {
						service.reSetQtoBoqParentNewFinalPrice(parentItem);
					}

					if (!service.isDivisionOrRootWithIT(parentItem)) {
						parentItem.BudgetTotal = 0;
						parentItem.BudgetDifference = 0;
					} else {
						if (!parentItem.BudgetFixedTotal) {
							parentItem.BudgetTotal = 0;
						}
					}

					if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
						parentItem.TotalPrice = 0;
						parentItem.OrdItemTotal = 0;
						parentItem.TotalHours = 0;
						parentItem.PreEscalationTotal = 0;
						parentItem.ExtraTotal = 0;
						parentItem.PreEscalationTotalForIQ = 0;
						parentItem.PreEscalationTotalForBQ = 0;
						parentItem.IQPreEscalation = 0;
						parentItem.BQPreEscalation = 0;
						parentItem.Performance = 0;
					}

					// Iterate over children and calculate Finalprice and Hours

					for (var i = 0; i < childCount; i++) {
						childItem = parentItem.BoqItems[i];
						if (angular.isDefined(childItem) && childItem !== null) {
							if (((boqMainCommonService.isItem(childItem) || boqMainCommonService.isSurchargeItem(childItem)) && service.isItemWithIT(childItem)) || (boqMainCommonService.isDivisionOrRoot(childItem) && service.isDivisionOrRootWithIT(childItem))) {
								// The child item has an item total and therefore contributes to the parent totals
								parentItem.ItemTotal += childItem.Finalprice;
								parentItem.ItemTotalOc += childItem.FinalpriceOc;
								parentItem.ExtraIncrement += childItem.ExtraIncrement;
								parentItem.ExtraIncrementOc += childItem.ExtraIncrementOc;
								parentItem.PreEscalation += childItem.PreEscalation;

								if (childItem.IQPreEscalation) {
									parentItem.IQPreEscalation += childItem.IQPreEscalation;
								} else {
									var _iqPreEscalation = service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.InstalledQuantity * childItem.Factor) : 0;
									parentItem.IQPreEscalation += _iqPreEscalation;
								}
								if (childItem.BQPreEscalation) {
									parentItem.BQPreEscalation += childItem.BQPreEscalation;

								} else {
									var _bqPreEscalation = service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.BilledQuantity * childItem.Factor) : 0;
									parentItem.BQPreEscalation += _bqPreEscalation;
								}
								parentItem.PreEscalationOc += childItem.PreEscalationOc;
								parentItem.Finalprice += childItem.Finalprice;
								parentItem.FinalpriceOc += childItem.FinalpriceOc;
								parentItem.Finalgross += childItem.Finalgross;
								parentItem.FinalgrossOc += childItem.FinalgrossOc;
								parentItem.Hours += childItem.Hours;

								if(option.serviceName === 'qtoBoqStructureService') {
									service.sumQtoBoqParentNewFinalPrice(parentItem,childItem);
								}

								service.calcUserDefinedColumnOfParentItem(parentItem,childItem);

								if (!parentItem.BudgetFixedTotal) {
									parentItem.BudgetTotal += childItem.BudgetTotal;
								}

								sumBudgetTotal += childItem.BudgetTotal;

								if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
									parentItem.TotalPrice += childItem.TotalPrice;
									parentItem.OrdItemTotal += childItem.OrdItemTotal ? childItem.OrdItemTotal : 0;
									parentItem.TotalHours += childItem.TotalHours;
									parentItem.PreEscalationTotal += childItem.PreEscalationTotal;
									parentItem.ExtraTotal += childItem.ExtraTotal;
									parentItem.Performance += childItem.Performance;

									if(childItem.PreEscalationTotalForBQ){
										parentItem.PreEscalationTotalForBQ += childItem.PreEscalationTotalForBQ;

									}else{
										let preEscatotalForBQ = childItem.BQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
										parentItem.PreEscalationTotalForBQ += preEscatotalForBQ;
									}

									if(childItem.PreEscalationTotalForIQ){
										parentItem.PreEscalationTotalForIQ += childItem.PreEscalationTotalForIQ;
									}else {
										let preEscatotalForIQ = childItem.IQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
										parentItem.PreEscalationTotalForIQ += preEscatotalForIQ;
									}
								}
							} else if (((boqMainCommonService.isItem(childItem) || boqMainCommonService.isSurchargeItem(childItem)) && !service.isItemWithIT(childItem)) || (boqMainCommonService.isDivisionOrRoot(childItem) && !service.isDivisionOrRootWithIT(childItem))) {
								if (!service.isDisabledOrNA(childItem)) {
									if (!parentItem.BudgetFixedTotal) {
										parentItem.BudgetTotal += childItem.BudgetTotal;
									}

									sumBudgetTotal += childItem.BudgetTotal;
								}

								// That initialization seems to be not necessary in general and it would be a bug in context with the "Billing of special items" (see backend code 'BoqItemEnity.IsItemForBillingOfSpecialItems')
								// The child item doesn't have an item total so it's totals are set to zero (this is just for consistency reasons) and it doesn't contribute to the parent totals,
								/*
								childItem.ItemTotal = 0;
								childItem.PreEscalation = 0;
								childItem.IQPreEscalation = 0;
								childItem.BQPreEscalation = 0;
								childItem.Finalprice = 0;
								childItem.DiscountedPrice = 0;
								childItem.ItemTotalOc = 0;
								childItem.PreEscalationOc = 0;
								childItem.FinalpriceOc = 0;
								childItem.DiscountedPriceOc = 0;
								childItem.Hours = 0;

								if (Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
									childItem.TotalPrice = 0;
									childItem.OrdItemTotal = 0;
									childItem.TotalHours = 0;
									childItem.PreEscalationTotal = 0;
									childItem.ExtraTotal = 0;
									childItem.Performance = 0;
								}
								*/
							}
						}
					}

					parentItem.BudgetDifference = parentItem.BudgetTotal - sumBudgetTotal;

					if (service.isItemWithIT(parentItem) || service.isDivisionOrRootWithIT(parentItem)) {
						if (parentItem.IsLumpsum) {
							parentItem.Finalprice = parentItem.LumpsumPrice;
							parentItem.FinalpriceOc = parentItem.LumpsumPriceOc;
							parentItem.Finalgross = service.roundValue(parentItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
							parentItem.FinalgrossOc = service.roundValue(parentItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
						}

						var parentDiscount = parentItem.Discount, discountgross = parentDiscount;
						if (parentItem.DiscountPercentIt !== 0 && parentItem.Discount === 0) {
							parentDiscount = (parentItem.Finalprice * parentItem.DiscountPercentIt / 100);
							discountgross = (parentItem.Finalgross * parentItem.DiscountPercentIt / 100);
						} else {
							discountgross = parentDiscount * (100 + vatPercent) / 100;
						}

						var parentDiscountOc = parentItem.DiscountOc, discountOcgross = parentDiscountOc;
						if (parentItem.DiscountPercentIt !== 0 && parentItem.DiscountOc === 0) {
							parentDiscountOc = (parentItem.FinalpriceOc * parentItem.DiscountPercentIt / 100);
							discountOcgross = (parentItem.FinalgrossOc * parentItem.DiscountPercentIt / 100);
						} else {
							discountOcgross = parentDiscountOc * (100 + vatPercent) / 100;
						}

						parentItem.Finalprice -= service.roundValue(parentDiscount, 'Discount'); // discount => abs (-)
						parentItem.FinalpriceOc -= service.roundValue(parentDiscountOc, 'DiscountOc'); // discount => abs (-)
						parentItem.Finalgross -= service.roundValue(discountgross, 'Discount');
						parentItem.FinalgrossOc -= service.roundValue(discountOcgross, 'DiscountOc');

						if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
							// Calculate the discount values
							if (parentItem.DiscountPercentIt !== 0 && parentItem.Discount === 0) {
								parentDiscount = (parentItem.TotalPrice * parentItem.DiscountPercentIt / 100);
							}

							parentItem.TotalPrice  -= parentDiscount;
							parentItem.TotalPriceOc = parentItem.TotalPrice * localData.currentExchangeRate;
						}
					} else {
						parentItem.ItemTotal = 0;
						parentItem.Finalprice = 0;
						parentItem.ItemTotalOc = 0;
						parentItem.FinalpriceOc = 0;
						parentItem.Hours = 0;
					}

					if (Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
						service.calcDependantValues(parentItem, 'TotalPrice');
					}
					if(option.serviceName === 'qtoBoqStructureService') {
						service.initQtoBoqNewFinalPrices(parentItem);
					}
				};

				/**
				 * @ngdoc function
				 * @name calcParentChain
				 * @function
				 * @methodOf boq.main.boqMainServiceFactory
				 * @description Climb up the parent chain and calculate the visited items
				 * @param {Object} item to start the calculation with
				 * @param {Boolean} calcChildrenFirst indicates that the children of the given item have to be calculated first before calculating up the parent chain
				 * @param {Boolean} iAmTheFirst indicates that the given item is the first one in the recursively visited parent hierarchy
				 * @param {String} changePropertyName tells if there was a special property changed that now causes the calculation of the parent chain.
				 */
				service.calcParentChain = function calcParentChain(item, calcChildrenFirst, iAmTheFirst, changePropertyName) {
					if (item.IsOenBoq) { // OENORM currently does NOT calculate on the client
						return;
					}

					var sumValues = {
						total: 0,
						totalOc: 0,
						totalgross: 0,
						totalgrossOc: 0,
						extraIncrement: 0,
						preEscalation: 0,
						extraIncrementOc: 0,
						preEscalationOc: 0,
						hours: 0,
						preEscalationTotal: 0,
						extraTotal: 0,
						totalPrice: 0,
						ordItemTotal: 0,
						totalHours: 0,
						PreEscalationTotalForIQ: 0,
						PreEscalationTotalForBQ: 0,
						IQPreEscalation: 0,
						BQPreEscalation: 0,
						performance: 0
					};

					var vatPercent = 0;

					// This flag is not in use right now but may be useful in the future !!
					if (angular.isUndefined(iAmTheFirst)) {
						iAmTheFirst = true;
					}

					if (angular.isUndefined(item) || item === null) {
						return;
					}

					// Todo BH: I'm not really sure if 'item' has to be marked as an 'affected' item. I assume that it's already marked as a 'modified' item so also marking it as an 'affected' would do the job twice.
					if (boqMainCommonService.isItem(item) || boqMainCommonService.isSurchargeItem(item)) {
						// To be sure the item is calculated we simply perform the calculation now
						// even though the calculation may have already been done before.
						localData.calcFinalPriceHoursNew(item, undefined, undefined, changePropertyName);
					} else if (boqMainCommonService.isDivisionOrRoot(item)) {
						roundInitialValues(item);
						if (calcChildrenFirst) {
							sumValues = {
								total: 0,
								totalOc: 0,
								totalgross: 0,
								totalgrossOc: 0,
								extraIncrement: 0,
								preEscalation: 0,
								extraIncrementOc: 0,
								preEscalationOc: 0,
								hours: 0,
								preEscalationTotal: 0,
								extraTotal: 0,
								totalPrice: 0,
								ordItemTotal: 0,
								totalHours: 0,
								totalBudget: 0,
								PreEscalationTotalForBQ: 0,
								PreEscalationTotalForIQ: 0,
								IQPreEscalation: 0,
								BQPreEscalation: 0,
								performance: 0
							};

							if(option.serviceName === 'qtoBoqStructureService'){
								service.initQtoSumValues(sumValues);
							}

							let calculatedProperties = [];

							if (!_.isEmpty(changePropertyName) && (changePropertyName === 'PercentageQuantity' || changePropertyName === 'CumulativePercentage')) {
								calculatedProperties.push(changePropertyName);
								calculatedProperties = calculatedProperties.concat(['TotalPrice', 'TotalHours']);
							} else {
								calculatedProperties = undefined;
							}

							service.calcChildTree(item, sumValues, calculatedProperties, null, changePropertyName);

							// Set new item totals according to sum values in child calculation
							item.DiscountedPrice = 0; // On this level there is no accumulated discounted price
							item.DiscountedPriceOc = 0;
							item.ItemTotal = sumValues.total;
							item.ItemTotalOc = sumValues.totalOc;

							item.ExtraIncrement = sumValues.extraIncrement;
							item.ExtraIncrementOc = sumValues.extraIncrementOc;
							item.PreEscalation = sumValues.preEscalation;

							item.IQPreEscalation =  sumValues.IQPreEscalation;
							item.BQPreEscalation =  sumValues.BQPreEscalation;

							item.PreEscalationOc = sumValues.preEscalationOc;

							if (item.IsLumpsum) {
								vatPercent = service.getVatPercentForBoqItem(item);
								item.Finalprice = item.LumpsumPrice;
								item.FinalpriceOc = item.LumpsumPriceOc;
								item.Finalgross = service.roundValue(item.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
								item.FinalgrossOc = service.roundValue(item.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
							} else {
								item.Finalprice = sumValues.total;
								item.FinalpriceOc = sumValues.totalOc;
								item.Finalgross = sumValues.totalgross;
								item.FinalgrossOc = sumValues.totalgrossOc;

								if (!service.isDivisionOrRootWithIT(item)) {
									item.BudgetTotal = 0;
									item.BudgetDifference = 0;
								} else {
									if (!item.BudgetFixedTotal) {
										item.BudgetTotal = sumValues.totalBudget;
									}

									item.BudgetDifference = item.BudgetTotal - sumValues.totalBudget;
								}
							}

							// Calculate the discount values
							var discount = item.Discount, discountgross = discount;
							var discountOc = item.DiscountOc, discountgrossOc = discountOc;
							if (item.DiscountPercentIt !== 0 && item.Discount === 0) {
								discount = (item.Finalprice * item.DiscountPercentIt / 100);
								discountgross = (item.Finalgross * item.DiscountPercentIt / 100);
							} else {
								discountgross = discount * (100 + vatPercent) / 100;
							}

							if (item.DiscountPercentIt !== 0 && item.DiscountOc === 0) {
								discountOc = (item.FinalpriceOc * item.DiscountPercentIt / 100);
								discountgrossOc = (item.FinalgrossOc * item.DiscountPercentIt / 100);
							} else {
								discountgrossOc = discountOc * (100 + vatPercent) / 100;
							}

							item.Finalprice -= service.roundValue(discount, 'Discount'); // discount => abs (-)
							item.FinalpriceOc -= service.roundValue(discountOc, 'DiscountOc');
							item.Finalgross -= service.roundValue(discountgross, 'Discount');
							item.FinalgrossOc -= service.roundValue(discountgrossOc, 'DiscountOc');

							item.Hours = sumValues.hours;

							if (Object.prototype.hasOwnProperty.call(item, 'TotalQuantity')) {
								item.TotalPrice   = sumValues.totalPrice;
								item.OrdItemTotal = sumValues.ordItemTotal;

								// Calculate the discount values
								if (item.DiscountPercentIt !== 0 && item.Discount === 0) {
									discount = (item.TotalPrice * item.DiscountPercentIt / 100);
								}

								item.TotalPrice  -= discount;
								item.TotalPriceOc = item.TotalPrice * localData.currentExchangeRate;

								item.PreEscalationTotal = sumValues.preEscalationTotal;
								item.ExtraTotal = sumValues.extraTotal;

								item.TotalHours = sumValues.totalHours;

								item.PreEscalationTotalForIQ = sumValues.PreEscalationTotalForIQ;
								item.PreEscalationTotalForBQ = sumValues.PreEscalationTotalForBQ;

								item.Performance = sumValues.performance;

								service.calcDependantValues(item, 'TotalPrice');
							}
						} else {
							// For item is a parent item itself we simply sum up the values of its children without recursively calculating the whole tree.
							service.calcParentItem(item);
						}
					}

					if(option.serviceName === 'qtoBoqStructureService') {
						service.initQtoBoqNewFinalPrices(item);
					}

					// Determine the parent item
					var parentItem = localData.getParentBoqItem(item);
					service.fireItemModified(item); // Fire that the item is changed to update it in the UI.

					// mark user define price as modified
					let dynamicUserDefinedColumnsService = service.getDynamicUserDefinedColumnsService();
					if(item.isUDPChanged && dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.markUdpAsModified)){
						dynamicUserDefinedColumnsService.markUdpAsModified(item);
						item.isUDPChanged = false;
					}

					if (angular.isUndefined(parentItem) || parentItem === null) {
						return;
					}

					// Recursively climb up the parent chain
					service.calcParentChain(parentItem, false, false, changePropertyName);
				};

				/**
				 * @ngdoc function
				 * @name calcChildTree
				 * @function
				 * @methodOf boq.main.boqMainServiceFactory
				 * @description Traverse the children tree and calculate the visited items
				 * @param {Object} parentItem to start the calculation with
				 * @param {Object} sumValues to gather sums of currently visited hierarchical level and report them to the upper level
				 * @param {Array} calculatedProperties string held in an array indicating which item properties are to be summed up.
				 * @param {Array} boqItemList boq item tree.
				 * @param {String} changePropertyName tells if there was a special property changed that now causes the calculation
				 * If this value is undefined we sum up all handled summable values.
				 */
				service.calcChildTree = function calcChildTree(parentItem, sumValues, calculatedProperties, boqItemList, changePropertyName) {

					if (angular.isUndefined(parentItem) || parentItem === null) {
						return;
					}

					// If surcharge items are into play this function doesn't work if the underlying boqMainService instance has no boq loaded
					if (!service.isRootBoqItemLoaded()) {
						console.log('boqMainServiceFactory.calcChildTree -> no boq loaded to service; calculation might fail in case of surcharge items');
					}

					// Now look for the children of this parent and recursively visit the children and sum up the corresponding values to the parent
					var childItem = null;
					var mySumValues = {
						total: 0,
						totalOc: 0,
						totalgross: 0,
						totalgrossOc: 0,
						extraIncrement: 0,
						preEscalation: 0,
						extraIncrementOc: 0,
						preEscalationOc: 0,
						hours: 0,
						preEscalationTotal: 0,
						extraTotal: 0,
						totalPrice: 0,
						ordItemTotal: 0,
						totalHours: 0,
						totalBudget: 0,
						PreEscalationTotalForBQ:0,
						PreEscalationTotalForIQ:0,
						IQPreEscalation :0,
						BQPreEscalation :0,
						performance: 0
					};


					var discount = 0;
					var discountgross = 0;
					var oldItemTotal = 0;
					var oldFinalprice = 0;
					var oldFinalgross = 0;
					var oldHours = 0;
					var oldBudgetTotal = 0;
					var minDiff = 0.000001;
					var vatPercent = 0;
					var initialCalculatedProperties = calculatedProperties;

					if (_.isArray(parentItem.BoqItems) && parentItem.BoqItems.length > 0) {

						// Reset old values
						parentItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price

						roundInitialValues(parentItem);

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {
							parentItem.ItemTotal = 0;
							parentItem.ItemTotalOc = 0;
							parentItem.ExtraIncrement = 0;
							parentItem.ExtraIncrementOc = 0;
							parentItem.PreEscalation = 0;
							parentItem.IQPreEscalation = 0;
							parentItem.BQPreEscalation = 0;
							parentItem.PreEscalationOc = 0;
							parentItem.Finalprice = 0;
							parentItem.FinalpriceOc = 0;
							parentItem.Finalgross = 0;
							parentItem.FinalgrossOc = 0;

							if (!service.isDivisionOrRootWithIT(parentItem)) {
								parentItem.BudgetTotal = 0;
								parentItem.BudgetDifference = 0;
							} else {
								if (!parentItem.BudgetFixedTotal) {
									parentItem.BudgetTotal = 0;
								}
							}
						}

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
							parentItem.Hours = 0;
						}

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
							parentItem.Hours = 0;
						}

						if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'TotalPrice') || _.includes(calculatedProperties, 'TotalHours'))) {
							service.initInstalledValues(parentItem);
						}

						if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'PercentageQuantity') || _.includes(calculatedProperties, 'CumulativePercentage'))) {
							let propertyName = _.includes(calculatedProperties, 'PercentageQuantity') ? 'PercentageQuantity' : 'CumulativePercentage';
							service.dispatchOnInstalledChildValues(parentItem, propertyName);
							// Reset calculatedProperties to force complete recalculation of all values
							calculatedProperties = undefined;
						}

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
							parentItem.TotalPrice = 0;
							parentItem.OrdItemTotal = 0;
							parentItem.PreEscalationTotal = 0;
							parentItem.ExtraTotal = 0;
							parentItem.Performance = 0;
						}

						if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(parentItem, 'TotalQuantity')) {
							parentItem.TotalHours = 0;
						}

						// Recursively iterate over children and calculate Finalprice and Hours
						for (var i = 0; i < parentItem.BoqItems.length; i++) {
							childItem = parentItem.BoqItems[i];

							if (angular.isDefined(childItem) && childItem !== null) {

								oldItemTotal = childItem.ItemTotal;
								oldFinalprice = childItem.Finalprice;
								oldFinalgross = childItem.Finalgross;
								oldHours = childItem.Hours;
								oldBudgetTotal = childItem.BudgetTotal;
								vatPercent = service.getVatPercentForBoqItem(childItem);

								if (boqMainCommonService.isItem(childItem) || boqMainCommonService.isSurchargeItem(childItem)) {
									// Hint: Check if item has a total or not is done in calcFinalPriceHoursNew itself !!

									localData.calcFinalPriceHoursNew(childItem, calculatedProperties, boqItemList, changePropertyName);

									// Add the changed item to the affected item list
									if ((angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1 || calculatedProperties.indexOf('Hours') !== -1) &&
										Math.abs(childItem.ItemTotal - oldItemTotal) > minDiff ||
										Math.abs(childItem.Finalprice - oldFinalprice) > minDiff ||
										Math.abs(childItem.Finalgross - oldFinalgross) > minDiff ||
										Math.abs(childItem.Hours - oldHours) > minDiff ||
										Math.abs(childItem.BudgetTotal - oldBudgetTotal) > minDiff) {
										localData.addAffectedItem(childItem);
									}
								} else if (boqMainCommonService.isDivisionOrRoot(childItem)) {

									// Reset children sum container
									mySumValues = {
										total: 0,
										totalOc: 0,
										totalgross: 0,
										totalgrossOc: 0,
										extraIncrement: 0,
										preEscalation: 0,
										extraIncrementOc: 0,
										preEscalationOc: 0,
										hours: 0,
										preEscalationTotal: 0,
										extraTotal: 0,
										totalPrice: 0,
										ordItemTotal: 0,
										totalHours: 0,
										totalBudget: 0,
										PreEscalationTotalForIQ:0,
										PreEscalationTotalForBQ:0,
										IQPreEscalation :0,
										BQPreEscalation :0,
										performance: 0
									};

									if(option.serviceName === 'qtoBoqStructureService'){
										service.initQtoSumValues(mySumValues);
									}

									// Recursively dig deeper
									service.calcChildTree(childItem, mySumValues, initialCalculatedProperties, boqItemList, changePropertyName);

									if (service.isDivisionOrRootWithIT(childItem)) {

										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {

											roundInitialValues(childItem);

											childItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price
											childItem.DiscountedPriceOc = 0;
											childItem.ItemTotal = mySumValues.total;
											childItem.ItemTotalOc = mySumValues.totalOc;

											childItem.ExtraIncrement = mySumValues.extraIncrement;
											childItem.ExtraIncrementOc = mySumValues.extraIncrementOc;
											childItem.PreEscalation = mySumValues.preEscalation;

											childItem.PreEscalationOc = mySumValues.preEscalationOc;


											childItem.IQPreEscalation = mySumValues.IQPreEscalation;
											childItem.BQPreEscalation = mySumValues.BQPreEscalation;

											if (childItem.IsLumpsum) {
												childItem.Finalprice = childItem.LumpsumPrice;
												childItem.FinalpriceOc = childItem.LumpsumPriceOc;
												childItem.Finalgross = service.roundValue(childItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
												childItem.FinalgrossOc = service.roundValue(childItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
											} else {
												childItem.Finalprice = mySumValues.total;
												childItem.FinalpriceOc = mySumValues.totalOc;
												childItem.Finalgross = mySumValues.totalgross;
												childItem.FinalgrossOc = mySumValues.totalgrossOc;

												if (!childItem.BudgetFixedTotal) {
													childItem.BudgetTotal = mySumValues.totalBudget;
												}

												childItem.BudgetDifference = childItem.BudgetTotal - mySumValues.totalBudget;
											}

											// Calculate the discount values
											discount = childItem.Discount;
											discountgross = childItem.Discount;
											if (childItem.DiscountPercentIt !== 0 && childItem.Discount === 0) {
												discount = (childItem.Finalprice * childItem.DiscountPercentIt / 100);
												discountgross = (childItem.Finalgross * childItem.DiscountPercentIt / 100);
											} else {
												discountgross = discount * (100 + vatPercent) / 100;
											}

											var discountOc = childItem.DiscountOc;
											var discountgrossOc = childItem.DiscountOc;
											if (childItem.DiscountPercentIt !== 0 && childItem.DiscountOc === 0) {
												discountOc = (childItem.FinalpriceOc * childItem.DiscountPercentIt / 100);
												discountgrossOc = (childItem.FinalgrossOc * childItem.DiscountPercentIt / 100);
											} else {
												discountgrossOc = discountOc * (100 + vatPercent) / 100;
											}

											childItem.Finalprice -= service.roundValue(discount, 'Discount'); // discount => abs (-)
											childItem.FinalpriceOc -= service.roundValue(discountOc, 'DiscountOc');
											childItem.Finalgross -= service.roundValue(discountgross, 'Discount');
											childItem.FinalgrossOc -= service.roundValue(discountgrossOc, 'DiscountOc');
										}

										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {

											childItem.Hours = mySumValues.hours;
										}

										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
											childItem.TotalPrice   = mySumValues.totalPrice;
											childItem.OrdItemTotal = mySumValues.ordItemTotal;

											childItem.PreEscalationTotalForBQ = mySumValues.PreEscalationTotalForBQ;
											childItem.PreEscalationTotalForIQ = mySumValues.PreEscalationTotalForIQ;
											childItem.BQPreEscalation = mySumValues.BQPreEscalation;
											childItem.IQPreEscalation = mySumValues.IQPreEscalation;

											// Calculate the discount values
											discount = childItem.Discount;
											if (childItem.DiscountPercentIt !== 0 && childItem.Discount === 0) {
												discount = (childItem.TotalPrice * childItem.DiscountPercentIt / 100);
											}

											childItem.TotalPrice  -= discount;
											childItem.TotalPriceOc = childItem.TotalPrice * localData.currentExchangeRate;

											childItem.PreEscalationTotal = mySumValues.preEscalationTotal;
											childItem.ExtraTotal = mySumValues.extraTotal;

											childItem.Performance = mySumValues.performance;

											if(option.serviceName === 'qtoBoqStructureService') {
												service.calcQtoBoqRootItemNewFinalPrice(mySumValues,childItem);
											}
											service.calcDependantValues(childItem, 'TotalPrice');
										}

										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
											childItem.TotalHours = mySumValues.totalHours;
										}
									} else {
										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {
											childItem.ItemTotal = 0;
											childItem.ItemTotalOc = 0;
											childItem.PreEscalation = 0;
											childItem.IQPreEscalation = 0;
											childItem.BQPreEscalation = 0;
											childItem.PreEscalationOc = 0;
											childItem.Finalprice = 0;
											childItem.FinalpriceOc = 0;
											childItem.Finalgross = 0;
											childItem.FinalgrossOc = 0;

											if (!service.isDivisionOrRootWithIT(childItem)) {
												childItem.BudgetTotal = 0;
												childItem.BudgetDifference = 0;
											} else {
												if (!childItem.BudgetFixedTotal) {
													childItem.BudgetTotal = mySumValues.totalBudget;
												}

												childItem.BudgetDifference = childItem.BudgetTotal - mySumValues.totalBudget;
											}
										}
										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
											childItem.Hours = 0;
										}
										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
											childItem.TotalPrice = 0;
											childItem.OrdItemTotal = 0;
											childItem.PreEscalationTotal = 0;
											childItem.Performance = 0;
										}
										if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
											childItem.TotalHours = 0;
										}
									}

									// Add the changed item to the affected item list
									if ((angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1 || calculatedProperties.indexOf('Hours') !== -1) &&
										Math.abs(childItem.Finalprice - oldFinalprice) > minDiff ||
										Math.abs(childItem.Finalgross - oldFinalgross) > minDiff ||
										Math.abs(childItem.Hours - oldHours) > minDiff ||
										Math.abs(childItem.BudgetTotal - oldBudgetTotal) > minDiff) {
										localData.addAffectedItem(childItem);
									}
								}

								// Report child sum values to parent
								if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {
									sumValues.extraIncrement += childItem.ExtraIncrement;
									sumValues.extraIncrementOc += childItem.ExtraIncrementOc;
									sumValues.preEscalation += childItem.PreEscalation;
									sumValues.preEscalationOc += childItem.PreEscalationOc;
									sumValues.total += childItem.Finalprice;
									sumValues.totalOc += childItem.FinalpriceOc;
									sumValues.totalgross += childItem.Finalgross;
									sumValues.totalgrossOc += childItem.FinalgrossOc;
									sumValues.totalBudget += childItem.BudgetTotal;
								}
								if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
									sumValues.hours += childItem.Hours;
								}
								if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
									sumValues.totalPrice   += childItem.TotalPrice;
									sumValues.ordItemTotal += childItem.OrdItemTotal ? childItem.OrdItemTotal : 0;
									sumValues.preEscalationTotal += childItem.PreEscalationTotal;
									sumValues.extraTotal += childItem.ExtraTotal;

									if(option.serviceName === 'qtoBoqStructureService'){
										service.calcQtoBoqSumValues(sumValues,childItem);
									}

									if(service.isDivisionOrRootWithIT(childItem)){
										sumValues.PreEscalationTotalForIQ +=childItem.PreEscalationTotalForIQ;
										sumValues.PreEscalationTotalForBQ +=childItem.PreEscalationTotalForBQ;

										sumValues.IQPreEscalation += childItem.IQPreEscalation;
										sumValues.BQPreEscalation +=childItem.BQPreEscalation;

									}
									else {
										if (Object.prototype.hasOwnProperty.call(childItem, 'IQTotalQuantity')){
											sumValues.PreEscalationTotalForIQ += childItem.IQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
										}

										if (Object.prototype.hasOwnProperty.call(childItem, 'BQTotalQuantity')){
											sumValues.PreEscalationTotalForBQ += childItem.BQTotalQuantity * childItem.DiscountedUnitprice * childItem.Factor;
										}

										if (Object.prototype.hasOwnProperty.call(childItem, 'InstalledQuantity')){
											sumValues.IQPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.InstalledQuantity * childItem.Factor): 0;
										}
										if (Object.prototype.hasOwnProperty.call(childItem, 'BilledQuantity')){
											sumValues.BQPreEscalation +=  service.isItemWithIT(childItem) ? (childItem.DiscountedUnitprice * childItem.BilledQuantity * childItem.Factor): 0;
										}

										if(option.serviceName === 'qtoBoqStructureService'){
											service.calcQtoBoqOrdPreEscalation(sumValues,childItem);
										}
									}

									sumValues.performance += childItem.Performance;

									service.calcDependantValues(childItem, 'TotalPrice');

									// Hint: For 'TotalPrice' is only a transient property we don't need to propagate it's change to the server via adding the item to the affected list.
								}
								if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(childItem, 'TotalQuantity')) {
									sumValues.totalHours += childItem.TotalHours;

									// Hint: For 'TotalHours' is only a transient property we don't need to propagate it's change to the server via adding the item to the affected list.
								}
								if(option.serviceName === 'qtoBoqStructureService') {
									service.initQtoBoqNewFinalPrices(childItem,sumValues);
								}
							}
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name calcBoq
				 * @function
				 * @methodOf boq.main.boqMainServiceFactory
				 * @description Calculate the whole boq
				 * @param {number} newExchangeRate based on which the current monetary values are calculated from its related oc values.
				 * @param {Array} calculatedProperties string held in an array indicating which item properties are to be summed up.
				 * If this value is undefined we sum up all handled summable values.
				 */
				service.calcBoq = function calcBoq(newExchangeRate, calculatedProperties) {
					var rootItem = service.getRootBoqItem();
					if (!rootItem) {
						return;
					}

					var mySumValues = {
						total: 0,
						totalOc: 0,
						totalgross: 0,
						totalgrossOc: 0,
						extraIncrement: 0,
						preEscalation: 0,
						extraIncrementOc: 0,
						preEscalationOc: 0,
						hours: 0,
						preEscalationTotal: 0,
						extraTotal: 0,
						totalPrice: 0,
						ordItemTotal: 0,
						totalHours: 0,
						totalBudget: 0,
						PreEscalationTotalForIQ:0,
						PreEscalationTotalForBQ:0,
						IQPreEscalation :0,
						BQPreEscalation :0,
						performance: 0
					};
					var discount = rootItem.Discount;
					var discountOc = rootItem.DiscountOc;
					var vatPercent = service.getVatPercentForBoqItem(rootItem);
					var discountgross = service.roundValue(rootItem.Discount * (100 + vatPercent) / 100, 'Discount');
					var discountgrossOc = service.roundValue(rootItem.DiscountOc * (100 + vatPercent) / 100, 'DiscountOc');

					if (_.isNumber(newExchangeRate)) {
						// First convert all basic home currency values (i.e. Price, Lumpsum and Discount) based on the newExchangeRate and the related oc.
						var convertAllMonetaryValuesVisitor = {
							visitBoqItemFn: localData.recalculateMonetaryValuesBasedOnNewExchangeRate,
							newExchangeRate: newExchangeRate
						};

						localData.visitBoqItemsRecursively(null, rootItem, 0, convertAllMonetaryValuesVisitor);
						service.setCurrentExchangeRate(newExchangeRate);
					}

					if(option.serviceName === 'qtoBoqStructureService'){
						service.initQtoSumValues(mySumValues);
					}
					// Recursively dig deeper
					service.calcChildTree(rootItem, mySumValues, calculatedProperties);

					// Set new item totals according to sum values in child calculation

					if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Finalprice') !== -1) {

						roundInitialValues(rootItem);

						rootItem.DiscountedPrice = 0; // On this level there is no accumulated discounted price
						rootItem.DiscountedPriceOc = 0;
						rootItem.ItemTotal = mySumValues.total;
						rootItem.ItemTotalOc = mySumValues.totalOc;

						rootItem.ExtraIncrement = mySumValues.extraIncrement;
						rootItem.ExtraIncrementOc = mySumValues.extraIncrementOc;
						rootItem.PreEscalation = mySumValues.preEscalation;

						rootItem.IQPreEscalation = mySumValues.IQPreEscalation;
						rootItem.BQPreEscalation = mySumValues.BQPreEscalation;

						rootItem.PreEscalationOc = mySumValues.preEscalationOc;

						if (rootItem.IsLumpsum) {
							rootItem.Finalprice = rootItem.LumpsumPrice;
							rootItem.FinalpriceOc = rootItem.LumpsumPriceOc;
							rootItem.Finalgross = service.roundValue(rootItem.Finalprice * (100 + vatPercent) / 100, 'Finalgross');
							rootItem.FinalgrossOc = service.roundValue(rootItem.FinalpriceOc * (100 + vatPercent) / 100, 'FinalgrossOc');
						} else {
							rootItem.Finalprice = mySumValues.total;
							rootItem.FinalpriceOc = mySumValues.totalOc;
							rootItem.Finalgross = mySumValues.totalgross;
							rootItem.FinalgrossOc = mySumValues.totalgrossOc;

							if (!service.isDivisionOrRootWithIT(rootItem)) {
								rootItem.BudgetTotal = 0;
								rootItem.BudgetDifference = 0;
							} else {
								if (!rootItem.BudgetFixedTotal) {
									rootItem.BudgetTotal = mySumValues.totalBudget;
								}

								rootItem.BudgetDifference = rootItem.BudgetTotal - mySumValues.totalBudget;
							}
						}

						// Calculate the discount values
						if (rootItem.DiscountPercentIt !== 0 && rootItem.Discount === 0) {
							discount = (rootItem.Finalprice * rootItem.DiscountPercentIt / 100);
							discountgross = (rootItem.Finalgross * rootItem.DiscountPercentIt / 100);
						}
						if (rootItem.DiscountPercentIt !== 0 && rootItem.DiscountOc === 0) {
							discountOc = (rootItem.FinalpriceOc * rootItem.DiscountPercentIt / 100);
							discountgrossOc = (rootItem.FinalgrossOc * rootItem.DiscountPercentIt / 100);
						}

						rootItem.Finalprice -= service.roundValue(discount, 'Discount'); // discount => abs (-)
						rootItem.FinalpriceOc -= service.roundValue(discountOc, 'DiscountOc');
						rootItem.Finalgross -= service.roundValue(discountgross, 'Discount');
						rootItem.FinalgrossOc -= service.roundValue(discountgrossOc, 'DiscountOc');
					}
					if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('Hours') !== -1) {
						rootItem.Hours = mySumValues.hours;
					}
					if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalPrice') !== -1 && Object.prototype.hasOwnProperty.call(rootItem, 'TotalQuantity')) {
						rootItem.TotalPrice   = mySumValues.totalPrice;
						rootItem.OrdItemTotal = mySumValues.ordItemTotal;

						// Calculate the discount values
						if (rootItem.DiscountPercentIt !== 0 && rootItem.Discount === 0) {
							discount = (rootItem.TotalPrice * rootItem.DiscountPercentIt / 100);
						}

						rootItem.TotalPrice  -= discount;
						rootItem.TotalPriceOc = rootItem.TotalPrice * localData.currentExchangeRate;

						rootItem.PreEscalationTotal = mySumValues.preEscalationTotal;
						rootItem.ExtraTotal = mySumValues.extraTotal;
						rootItem.PreEscalationTotalForIQ = mySumValues.PreEscalationTotalForIQ;
						rootItem.PreEscalationTotalForBQ = mySumValues.PreEscalationTotalForBQ;
						rootItem.BQPreEscalation = mySumValues.BQPreEscalation;
						rootItem.IQPreEscalation = mySumValues.IQPreEscalation;

						rootItem.Performance = mySumValues.performance;

						if(option.serviceName === 'qtoBoqStructureService') {
							service.calcQtoBoqRootItemNewFinalPrice(mySumValues,rootItem);
						}

						if (_.isArray(calculatedProperties) && (_.includes(calculatedProperties, 'TotalPrice'))) {
							service.calcDependantValues(rootItem, 'TotalPrice');
						}
					}
					if (angular.isUndefined(calculatedProperties) || calculatedProperties.indexOf('TotalHours') !== -1 && Object.prototype.hasOwnProperty.call(rootItem, 'TotalQuantity')) {
						rootItem.TotalHours = mySumValues.totalHours;
					}

					// After updating the whole boq a complete refresh of the grid is justified
					service.gridRefresh();
				};

				/**
				 * @ngdoc function
				 * @name calcTotalPriceAndHoursForBoq
				 * @function
				 * @methodOf boq.main.boqMainServiceFactory
				 * @description Calculate the whole boq, but only its total price and total hours.
				 */
				service.calcTotalPriceAndHoursForBoq = function calcTotalPriceAndHoursForBoq() {
					var calculatedProperties = ['TotalPrice', 'TotalHours'];
					service.calcBoq(null, calculatedProperties);
				};

				/**
				 * @ngdoc function
				 * @name calcDependantValues
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Calculate the dependant values due to a change of one dependant value in the dependancy chain.
				 * @param {Object} boqItem : item whose corresponding properties are calculated
				 * @param {String} valueToBeSkipped : indicating the property that has already been set manually and needs no calculation, so it can be skipped
				 */
				service.calcDependantValues = function calcDependantValues(boqItem, valueToBeSkipped) {

					// Check for initial calculation of values.
					// If so, add the TotalQuantity property to activate this feature.
					if (!_.isString(valueToBeSkipped) && !Object.prototype.hasOwnProperty.call(boqItem, 'TotalQuantity')) {
						boqItem.TotalQuantity = 0;
					}

					if (valueToBeSkipped !== 'TotalQuantity') {
						service.calcTotalQuantity(boqItem);
					}

					service.calcRemQuantity(boqItem);
					service.calcTotalHours(boqItem);
					service.calcTotalRejectedQuantity(boqItem);

					if (valueToBeSkipped !== 'TotalPrice') {
						service.calcTotalPrice(boqItem);
					}

					if (valueToBeSkipped !== 'ItemTotalEditable') {
						service.calcItemTotalEditable(boqItem);
					}

					if (valueToBeSkipped !== 'PercentageQuantity') {
						service.calcPercentageQuantity(boqItem);
					}

					if (valueToBeSkipped !== 'CumulativePercentage') {
						service.calcCumulativePercentage(boqItem);
					}
				};

				// calculate Price or PriceOc
				service.calPriceOrPriceOcByGross = function calPriceOrPriceOcByGross(boqItem, isPricegross) {

					var taxCodeFk = getValidTaxCodeFk(boqItem);
					var taxCode = getTaxCode(taxCodeFk);
					var vatPercent = taxCode ? taxCode.VatPercent : 0;
					if (isPricegross) {
						boqItem.DiscountedUnitprice = boqItem.Pricegross / ((100 + vatPercent) / 100);
						boqItem.Price = boqItem.DiscountedUnitprice / ((100 - boqItem.DiscountPercent) / 100);
					} else {
						boqItem.DiscountedUnitpriceOc = boqItem.PricegrossOc / ((100 + vatPercent) / 100);
						boqItem.PriceOc = boqItem.DiscountedUnitpriceOc / ((100 - boqItem.DiscountPercent) / 100);
					}
				};

				/**
				 * @ngdoc function
				 * @name doCalculateOverGross
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description return setting indicating that calculation is driven by the gross values
				 * @returns {Boolean} flag indicating that calculation is driven by the gross values
				 */
				service.doCalculateOverGross = function doCalculateOverGross() {
					return localData.isCalculateOverGross;
				};

				/**
				 * @ngdoc function
				 * @name getRoundingConfig
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the currently loaded rounding config
				 * @returns  {Object} holding the currently loaded rounding config
				 */
				service.getRoundingConfig = function getRoundingConfig() {
					let boqRoundingConfig = null;
					let loadedBoqStructure = service.getBoqStructure();

					if(_.isObject(loadedBoqStructure) && _.isNumber(loadedBoqStructure.BoqRoundingConfigFk)) {
						boqRoundingConfig = loadedBoqStructure.BoqRoundingConfig;
					}

					return boqRoundingConfig;
				};

				/**
				 * @ngdoc function
				 * @name getRoundingConfigDetails
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the currently loaded rounding config details
				 * @returns  {Array} with objects of rounding config details
				 */
				service.getRoundingConfigDetails = function getRoundingConfigDetails() {
					let roundingConfigDetails = null;
					let loadedBoqStructure = service.getBoqStructure();

					if(_.isObject(loadedBoqStructure) && _.isNumber(loadedBoqStructure.BoqRoundingConfigFk)) {
						let boqRoundingConfig = loadedBoqStructure.BoqRoundingConfig;

						if(_.isObject(boqRoundingConfig)) {
							if (_.isArray(boqRoundingConfig.BoqRoundingconfigdetailEntities) && loadedBoqStructure.BoqRoundingConfigFk !== 0) {
								roundingConfigDetails = boqRoundingConfig.BoqRoundingconfigdetailEntities;
							} else {
								roundingConfigDetails = boqRoundingConfig.DefaultBoqRoundingConfigDetails;
							}
						}
					}

					return roundingConfigDetails;
				};

				/**
				 * @ngdoc function
				 * @name getRoundingConfigDetailByDetailType
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the rounding config detail given by its columnId
				 * @param {Number} detailType which is usually given by a constant value of type 'boqMainRoundingConfigDetailType'
				 * @returns  {Array} with objects of rounding config details
				 */
				service.getRoundingConfigDetailByDetailType = function getRoundingConfigDetailByDetailType(detailType) {
					let roundingConfigDetails = service.getRoundingConfigDetails();
					let roundingConfigDetail = null;

					if(_.isArray(roundingConfigDetails) && roundingConfigDetails.length > 0) {
						roundingConfigDetail = _.find(roundingConfigDetails, {ColumnId: detailType});
					}

					return roundingConfigDetail;
				};

				/**
				 * @ngdoc function
				 * @name getBoqRoundedColumns2DetailTypes
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Get the mapping between the boq item colums to be rounded and the related boq rounding config detail type
				 * @returns  {Array} list of mapping entries
				 */
				service.getBoqRoundedColumns2DetailTypes = function getBoqRoundedColumns2DetailTypes() {
					return localData.boqRoundedColumns2DetailTypes;
				};

				/**
				 * @ngdoc function
				 * @name roundValue
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the currently loaded rounding config details
				 * @param {Number} value to be rounded
				 * @param {string} field of boq item telling which type of rounding config detail to use
				 * @returns  {number} rounded value
				 */
				service.roundValue = function roundValue(value,field) {
					let roundedValue = value;

					if (_.isNil(value)){
						return value;
					}

					roundedValue = boqMainRoundingService.doRoundingValue(field, value, service);

					return roundedValue;
				};

				/**
				 * @ngdoc function
				 * @name roundValue
				 * @function
				 * @methodOf boqMainServiceFactory
				 * @description Return the currently loaded rounding config details
				 * @param {Number} value to be rounded
				 * @param {Number} field of boq item telling which type of rounding config detail to use
				 * @returns  {number} rounded value
				 */
				service.roundValueByDetailType = function roundValue(value, detailType) {
					let roundedValue = value;

					if (_.isNil(value)){
						return value;
					}

					let boqRoundingConfigDetail = service.getRoundingConfigDetailByDetailType(detailType);
					roundedValue = boqMainRoundingService.doRounding(value, '', boqRoundingConfigDetail);

					return roundedValue;
				};

				// local helper to do rounding of initial, atomic values of boqItem
				function roundInitialValues(boqItem) {
					boqMainRoundingService.roundInitialValues(boqItem, service);
				}

				// #endregion
				//  endregion


				//  region Blob Specification (Langtext)  ==ts==>  To be moved to the data service of the specification container
				// #region

				localData.currentSpecification = { Content: null, Id: 0, Version: 0 };

				localData.modifiedSpecifications = []; // Used to handle multiple modified specifications when not being a root service.

				localData.specificationLoadCanceler = $q.defer(); // request canceler variables

				/**
				 * @ngdoc function
				 * @name clearCurrentSpecification
				 * @function
				 * @description Clears the state of the currently displayed specification object to initial values
				 */
				localData.clearSpecification = function clearSpecification() {
					localData.currentSpecification = {
						Content: null,
						Id: 0,
						Version: 0
					};

					// Notify that the specification has changed
					service.currentSpecificationChanged.fire(localData.currentSpecification);
				};

				/**
				 * @ngdoc function
				 * @name loadSpecificationById
				 * @function
				 * @description This function loads the specification given by it's foreign key
				 * @param {Number} fkId Foreign key of the blob string that's to be loaded as specification
				 */
				localData.loadSpecificationById = function loadSpecificationById(fkId) {
					localData.specificationLoadCanceler.resolve();
					localData.specificationLoadCanceler = $q.defer();

					if (fkId) {
						// We have a valid foreign key -> load related specification
						$http(
							{
								method: 'GET',
								url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + fkId,
								timeout: localData.specificationLoadCanceler.promise
							}
						).then(function (response) {
							// Load successful
							if (response && response.data) {
								// We use the already existing specification object and change its properties according the currently loaded specification object
								// in order to instantly update referencing elements.

								// Copy the loaded specification contents to the current specification
								service.setCurrentSpecification(response.data);
							}
						},
						function (/* response */) {
							// Load failed
							localData.clearSpecification();
						});
					} else {
						// We have an invalid specification -> reset specification
						localData.clearSpecification();
					}
				};

				/**
				 * @ngdoc function
				 * @name onSetSelected
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description React on selection change of boq item
				 * @param {Object} e : in our case this is supposed to be null
				 * @param {Object} args : in our case this is supposed the new set boq item
				 */
				localData.onSetSelected = function onSetSelected(e, args) { // Load the specification for the new current boqItem
					if (!args) {
						return;
					}

					// In case of a node service we cannot be sure to get the specifications by calling the server because they might not
					// already have been changed.

					// So first we look at the tracked modification list to find an entry that fits.
					// If there is one we take this, if not we can assume the specification has already been saved
					// and we can call the server and load the specification from there.
					var modifiedSpecification = localData.getModifiedSpecificationFor(service.getSelected());
					if (modifiedSpecification !== null) {
						service.setCurrentSpecification(modifiedSpecification); // Copy the found specification contents to the current specification
					}
					else {
						// Item not found in modified list -> try to load it from server
						if (angular.isDefined(args.BasBlobsSpecificationFk)) {
							localData.loadSpecificationById(args.BasBlobsSpecificationFk);
						}
					}
				};

				service.currentSpecificationChanged = new Platform.Messenger();

				/**
				 * @ngdoc function
				 * @name getCurrentSpecification
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description This function returns the current specification coming form the currently selected boqItem
				 * @returns {Object} returns object representing the current specification
				 */
				service.getCurrentSpecification = function getCurrentSpecification() {
					return localData.currentSpecification;
				};

				/**
				 * @ngdoc function
				 * @name setCurrentSpecification
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description This function sets the current specification.
				 * @param {Object} specification to be set as currentSpecification
				 */
				service.setCurrentSpecification = function setCurrentSpecification(specification) {
					if (localData.currentSpecification !== specification) {
						if (specification.Content) {
							// Fix of JIRA DEV-926
							// The HTML editor interprets a self closing tag as open tag.
							// Each user change in the editor then would provide incorrect HTML/XML content.
							// Finally the server function 'BoqTextComplementLogic.AdjustTable' does the unexpected change from type "Owner" to "Bidder"
							specification.Content = specification.Content.replaceAll('<ComplCaption/>', '<ComplCaption></ComplCaption>');
							specification.Content = specification.Content.replaceAll('<ComplTail/>',    '<ComplTail></ComplTail>');
						}
						localData.currentSpecification = specification;
						service.currentSpecificationChanged.fire(specification);
					}
				};

				service.getModifiedBlobSpecification = function() {
					return localData.modifiedSpecifications;
				};

				/**
				 * @ngdoc function
				 * @name setSpecificationAsModified
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Register the given specification as modified so it'll be saved on next saveBoqItem call.
				 * Do some further checks if saving the changes are really necessary.
				 * @param {Object} specification : modified specification that's to be saved
				 */
				service.setSpecificationAsModified = function setSpecificationAsModified(specification) {

					if (!specification) {
						return;
					}

					var currentlySelectedBoqItem = service.getSelected();
					var oldModifiedSpecification = localData.getModifiedSpecificationFor(currentlySelectedBoqItem);

					if ((typeof (oldModifiedSpecification) === 'undefined' || oldModifiedSpecification === null) &&
						(angular.isDefined(specification.Content) && specification.Content !== null)) {

						// Create a new specification object and copy the given changed specification to it
						// to isolate the specification to be saved from the currently displayed specification.
						// This is necessary to avoid unwanted updates.
						localData.modifiedSpecifications.push({BoqItemId: currentlySelectedBoqItem.Id, Specification: specification});

						// In this use case a specification always has a corresponding boqItem.
						// The boqItem has a foreign key to the corresponding data set in BAS_BLOBS table.
						// When inserting a new specification, the related boqItem has no foreign key set the boqItem
						// is set to be modified and the server cares about setting up the link to the BAS_BLOBS table
						// by creating a new id for the new blob and setting it as foreign key to the boqItem.

						if (currentlySelectedBoqItem /* && !currentlySelectedBoqItem.BasBlobsSpecificationFk && (newModifiedSpecification.Version === 0) */) {
							// The currently selected boqItem has no valid foreign key set to the corresponding blob object (i.e. specification)
							// and the specification itself hasn't been saved to the database before (i.e. specification.Version = 0)
							// -> add tis boqItem to the list of modified items and by this forcing it to be saved with the proper foreign key to the blob object
							// (this is all done on the server side)
							service.markItemAsModified(currentlySelectedBoqItem);

							// When changing the specification we reset the possibly set foreign keys to a possibly related wic boq item
							currentlySelectedBoqItem.BoqItemWicBoqFk = null;
							currentlySelectedBoqItem.BoqItemWicItemFk = null;
							currentlySelectedBoqItem.WicNumber = '';
							service.fireItemModified(currentlySelectedBoqItem);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name setSpecificationAsModifiedByItem
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Register the given specification as modified so it'll be saved on next saveBoqItem call.
				 * Do some further checks if saving the changes are really necessary.
				 * @param {Object} specification : modified specification that's to be saved
				 * @param {Object} boqItem : target item of specification
				 */
				service.setSpecificationAsModifiedByItem = function setSpecificationAsModifiedByItem(specification, boqItem) {
					if (!specification) {
						return;
					}

					var oldModifiedSpecification = localData.getModifiedSpecificationFor(boqItem);

					if ((typeof (oldModifiedSpecification) === 'undefined' || oldModifiedSpecification === null) &&
						(angular.isDefined(specification.Content) && specification.Content !== null)) {

						localData.modifiedSpecifications.push({BoqItemId: boqItem.Id, Specification: specification});

						if (boqItem) {
							service.markItemAsModified(boqItem);

							boqItem.BoqItemWicBoqFk = null;
							boqItem.BoqItemWicItemFk = null;
							boqItem.WicNumber = '';
							service.fireItemModified(boqItem);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name loadSpecificationByHeaderAndItemId
				 * @function
				 * @methodOf boq.service.boqMainServiceFactory
				 * @description Special function loading the specification for the boqItem represented by its primary keys boqHeaderId and boqItemId
				 */
				service.loadSpecificationByHeaderAndItemId = function(boqHeaderId, boqItemId) {
					$http.get(globals.webApiBaseUrl + 'boq/main/blobspecification' + '?boqHeaderId='+boqHeaderId + '&boqItemId='+boqItemId).then(function(response) {
						localData.clearSpecification();
						response = response.data;

						if      (!_.isEmpty(response.BlobSpecification)) { service.setCurrentSpecification({Content:response.BlobSpecification}); }
						else if (!_.isEmpty(response.CrbVariables))      { service.setCurrentSpecification({Content:$injector.get('boqMainCrbVariableCoreService').getPreview(response.CrbVariables, [], boqItemId)}); }
					});
				};

				localData.getModifiedSpecificationFor = function(boqItem) {
					if (!boqItem) {
						return null;
					}

					var modifiedSpecification = _.find(localData.modifiedSpecifications, {'BoqItemId':boqItem.Id});

					return modifiedSpecification ? modifiedSpecification.Specification : null;
				};

				service.getTextComplementService = function () {
					return boqMainTextComplementServiceFactory.getService(this, this.getModuleName());
				};

				// Register to the selectionChanged event of the base service
				// Todo: is an unregister necessary and where is it placed best.
				// For the event is a property of the service itself, so it gets destroyed when the service is destroyed and the same applies to the added callbacks.
				// No unregister seems to be necessary concerning destruction of the service as the triggering scenario.
				service.registerSelectionChanged(localData.onSetSelected);

				// #endregion
				//  endregion


				localData.init();

				if(option.isLookup) {
					serviceContainer.data.isRoot = false; // Avoid resetting object permission
				}

				return serviceContainer;
			};

			return factoryService;

		}]);

	//  region Controllers for the interactive deletion of boq items with attached estimate line items
	// #region

	// Deals with the way how to delete BOQ item referencing estimate line items
	boqMainModule.controller('boqMainEstimateDeleteController', ['_', '$scope', '$http', '$translate', 'platformGridAPI', 'platformDialogService', 'platformRuntimeDataService',
		function(_, $scope, $http, $translate, platformGridAPI, platformDialogService, platformRuntimeDataService) {
			var options = { deleteEstimateLineItems:1, deleteBoqItemFk:2 };

			const dialogOptions = $scope.dialog.modalOptions;
			$scope.selectedOption = options.deleteEstimateLineItems;

			platformRuntimeDataService.removeMarkAsBeingDeletedFromList(dialogOptions.onDeleteDoneParam1.entities);

			// Inits the grid with the dependent estimate line item data
			var estGridColumns = [
				{id:'BoqReference',   field:'BoqReference',   name:$translate.instant('boq.main.Reference'),   width:150},
				{id:'EstCode',        field:'EstCode',        name:$translate.instant('boq.main.Code'),        width:150},
				{id:'EstDescription', field:'EstDescription', name:$translate.instant('boq.main.Description'), width:250}];
			$scope.estGridId = '39760C12AE11494B9930AC46960E5285';
			$scope.estGridData =       {state: $scope.estGridId};
			platformGridAPI.grids.config({'id':$scope.estGridId, 'options':{idProperty:'EstCode'}, 'columns':estGridColumns});
			platformGridAPI.items.data(        $scope.estGridId, dialogOptions.dependentEstimateItems);

			// Inits the grid with the dependent QTO detail data
			var qtoGridColumns = [
				{id:'BoqReference',           field:'BoqReference',           name:$translate.instant('boq.main.Reference'),                      width:150},
				{id:'QtoDetailLineReference', field:'QtoDetailLineReference', name:$translate.instant('boq.main.deleteBoqItemsQtoLineReference'), width:150}];
			$scope.qtoGridId = 'EF8F4B6D41934A72B483315358B0E07E';
			$scope.qtoGridData =       {state: $scope.qtoGridId};
			platformGridAPI.grids.config({'id':$scope.qtoGridId, 'options':{idProperty:'QtoDetailLineReference'}, 'columns':qtoGridColumns});
			platformGridAPI.items.data(        $scope.qtoGridId, dialogOptions.dependentQtoDetails);

			// Starts the deletion
			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({ok: true});

				var request = {
					'DeletedBoqItems':     dialogOptions.deletedBoqItems,
					'ReferencedBoqItemIds': _.uniq(_.map(dialogOptions.dependentQtoDetails.concat(dialogOptions.dependentEstimateItems),'BoqItemFk')),
					'IsWeakDetach':         $scope.selectedOption===options.deleteBoqItemFk };
				$http.post(globals.webApiBaseUrl + 'boq/main/' + 'deleteincludedependencies', request)
					.then(function(response) {
						if (response.data) {
							platformDialogService.showDialog({headerText$tr$:'cloud.common.infoBoxHeader', bodyText:response.data, iconClass:'info'});
						}
						else {
							dialogOptions.onDeleteDoneFunc(dialogOptions.onDeleteDoneParam1, dialogOptions.onDeleteDoneParam2);
						}
					});
			};
		}
	]);

	boqMainModule.controller('boqMainEstimateItemsDetachController', ['_', '$scope',
		function(_, $scope) {
			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({ok:true});
				$scope.dialog.modalOptions.executeFunc();
			};
		}
	]);

	// #endregion
	//  endregion

})();


