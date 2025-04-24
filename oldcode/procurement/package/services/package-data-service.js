(function (angular) {
	'use strict';

	/* global globals */
	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name procurementPackageDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide package header data service
	 */
	angular.module(moduleName).factory('procurementPackageDataService',
		['$http', '$injector', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension', 'basicsLookupdataLookupFilterService',
			'basicsLookupdataLookupDescriptorService', 'procurementContextService', 'PlatformMessenger', 'complexServiceDataProcessDatesExtension',
			'procurementPackageReadonlyProcessor', 'procurementCommonHelperService', '$q', 'platformModalService', 'platformRuntimeDataService', 'platformDialogService',
			'_', 'platformDataServiceDataProcessorExtension', '$translate', 'cloudDesktopInfoService', 'cloudDesktopSidebarService', 'basicsCommonMandatoryProcessor',
			'platformHeaderDataInformationService', 'platformObjectHelper', 'moment', 'procurementCommonCharacteristicDataService', 'platformDataServiceModificationTrackingExtension', '$timeout', 'projectMainPinnableEntityService', 'packagePinnableEntityService',
			'procurementPackageNumberGenerationSettingsService', 'platformDataValidationService', 'platformGridAPI', 'platformContextService', 'basicsCommonCharacteristicService',
			'platformModuleStateService',
			'procurementCommonPrcItemDataService',
			'prcCommonSplitOverallDiscountService',
			'SchedulingDataProcessTimesExtension',
			'procurementCopyMode',
			'platformDataServiceActionExtension',
			'platformDataServiceConfiguredCreateExtension',
			'basicsCommonInquiryHelperService',
			'prcCommonProcessChangeVatGroupDialog',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($http, $injector, dataServiceFactory, ServiceDataProcessDatesExtension, LookupFilterService,// jshint ignore : line
				basicsLookupdataLookupDescriptorService, moduleContext, PlatformMessenger, processDatesExtension,
				readonlyProcessor, procurementCommonHelperService, $q, platformModalService, runtimeDataService, platformDialogService,
				_, platformDataServiceDataProcessorExtension, $translate, cloudDesktopInfoService, cloudDesktopSidebarService, mandatoryProcessor,
				platformHeaderDataInformationService, platformObjectHelper, moment, procurementCommonCharacteristicDataService, platformDataServiceModificationTrackingExtension, $timeout, projectMainPinnableEntityService, packagePinnableEntityService,
				procurementPackageNumberGenerationSettingsService, platformDataValidationService, platformGridAPI, platformContextService, basicsCommonCharacteristicService,
				platformModuleStateService, itemService, prcCommonSplitOverallDiscountService, SchedulingDataProcessTimesExtension, procurementCopyMode, platformDataServiceActionExtension,
				platformDataServiceConfiguredCreateExtension,
				basicsCommonInquiryHelperService,
				prcCommonProcessChangeVatGroupDialog
			) {
				var characteristicColumn = '';
				var gridContainerGuid = '1d58a4da633a485981776456695e3241';
				var onFilterLoaded = new PlatformMessenger();
				var onFilterUnLoaded = new PlatformMessenger();
				var completeItemCreated = new PlatformMessenger();
				var onPropertyChanged = new PlatformMessenger();
				var onPrcEventProperChanged = new PlatformMessenger();
				var serviceContainer;
				var service;
				let preUpdatePromises = [];
				let mandatoryFields = ['TaxCodeFk', 'Code', 'ProjectFk', 'CurrencyFk'];

				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: true,
					includeNonActiveItems: false,
					showOptions: true,
					showProjectContext: false,
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}, {
							token: 'procurement.package',
							show: true
						}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext,
						disableContextBtnCallback: function () {
							return !service.checkIfCurrentLoginCompany();
						}

					},
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch: true
				};

				var self = this;

				var currentViewItems = [];
				var createParam;
				var mergeUpdatedBoqRootItemIntoBoqList;
				var hasItemsOrBoqs = {
					items: false,
					prcboqs: false,
					boqitems: false
				};
				var needUpdateUcToItemsBoqs = false;
				var initialDialogService = $injector.get('packageCreationInitialDialogService');
				var serviceOptions = {
					flatRootItem: {
						module: module,
						serviceName: 'procurementPackageDataService',
						entityNameTranslationID: 'procurement.package.pacHeaderGridTitle',
						entityInformation: {
							module: 'Procurement.Package',
							entity: 'PrcPackage',
							specialTreatmentService: initialDialogService
						},
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/package/package/',
							endCreate: 'create/createpackage'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/package/package/',
							endDelete: 'deletepackage'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/package/package/',
							endUpdate: 'updatepackage'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/package/package/',
							endRead: 'listpackage',
							usePostForRead: true,
							extendSearchFilter: function (readData) {
								// To have the focus still on the same package as before
								// To have the same packages loaded
								if (currentViewItems.length) {
									readData.PageNumber = null;
									readData.PageSize = null;
									readData.Pattern = null;
									readData.PinningContext = null;
									readData.PKeys = currentViewItems.map(function (item) {
										return item.Id;
									});
									currentViewItems = [];
								}
							}
						},
						entityRole: {
							root: {
								itemName: 'PrcPackage',
								moduleName: 'cloud.desktop.moduleDisplayNamePackage',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								responseDataEntitiesPropertyName: 'Main',
								codeField: 'ProjectLongNo',
								descField: 'ProjectName',
								// TODO: it is just a work around to set Configuration readonly after saving a new item
								handleUpdateDone: function (updateData, response, data) {
									data.handleOnUpdateSucceeded(updateData, response, data, true);
									// var genaralsServer = $injector.get('procurementCommonGeneralsDataService').getService(serviceContainer.service);
									// var mainItemId;
									// var currentItem;
									// var prcHearderFk;
									// if(updateData.PrcGeneralsToSave!=null){
									//    prcHearderFk=updateData.PrcPackage2HeaderToSave[0].PrcPackage2Header.PrcHeaderFk;
									//    currentItem=_.find(genaralsServer.getList(), { PrcHeaderFk: prcHearderFk });
									// }
									// else{
									//    mainItemId= updateData.MainItemId;
									//    currentItem=_.find(data.getList(), { Id: mainItemId });
									// }

									service.onParentUpdated.fire();
									mergeUpdatedBoqRootItemIntoBoqList(response);
									// remove the lineItem
									var headerDataService = $injector.get('procurementPackageEstimateHeaderDataService'),
										lineItemDataService = $injector.get('procurementPackageEstimateLineItemDataService');
									if (lineItemDataService) {
										var lineItems = lineItemDataService.getList();
										var newLineItems = [];
										var lineItemHasUpdate = false;
										angular.forEach(lineItems, function (item) {
											if (item.PrcPackageFk !== service.getIfSelectedIdElse(-1)) {
												if (_.indexOf(service.reloadPackageIds, item.PrcPackageFk) === -1) {
													service.reloadPackageIds.push({
														'prcpackagefk': item.PrcPackageFk,
														'lineitemid': item.Id
													});
												}
												lineItemHasUpdate = true;
											} else {
												newLineItems.push(item);
											}
										}
										);
										if (lineItemHasUpdate) {
											lineItemDataService.setList(newLineItems);
											if (newLineItems[0]) {
												lineItemDataService.setSelected(newLineItems[0]);
											} else {
												lineItemDataService.deselect();
											}
											if (headerDataService) {
												var selectedHeaderId = headerDataService.getIfSelectedIdElse(null);
												headerDataService.load().then(function () {
													if (!selectedHeaderId) {
														return;
													}
													var headerList = headerDataService.getList();
													var foundHeader = _.find(headerList, {Id: selectedHeaderId});
													if (!foundHeader) {
														return;
													}
													headerDataService.setSelected(foundHeader);
												});
											}
										}
									}

									if((updateData.PrcItemAssignmentToSave&&updateData.PrcItemAssignmentToSave.length>0)||(updateData.PrcItemAssignmentToDelete&&updateData.PrcItemAssignmentToDelete.length>0)){
										itemService.getService().load();
										var boqService = $injector.get('prcBoqMainService').getService(moduleContext.getMainService());
										boqService.load();
									}

									if ((updateData.HeaderPparamToSave && updateData.HeaderPparamToSave.length) ||
										((updateData.HeaderPparamToDelete && updateData.HeaderPparamToDelete.length))
									) {
										$injector.get('procurementPackageItemDataService').load();
									}

									// The PermissionObjectInfo has to be refreshed automatically.
									// After creating a new package the feature your team currently implement will add a clerk or clerk group (from BAS_CLERKFORPACKAGE). This should give the current user a different role for the package
									if ((response.ClerkDataToSave && response.ClerkDataToSave.length) || (response.ClerkDataToDelete && response.ClerkDataToDelete.length)) {
										$timeout(function () {
											// To have the focus still on the same package as before
											// To have the same packages loaded
											currentViewItems = angular.copy(service.getList());
											service.refresh();
										}, 100);
									}

									// set the cost group
									if (response.PrcPackage2HeaderToSave && response.PrcPackage2HeaderToSave.length > 0) {
										_.each(response.PrcPackage2HeaderToSave, function (PrcPackage2Header) {
											if (PrcPackage2Header.PrcBoqCompleteToSave && PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave && PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave.length > 0) {
												var qtoDetailsToSave = _.map(PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave, 'QtoDetailToSave');
												var isQtoDetailChange = false;
												_.each(qtoDetailsToSave, function (qtoDetailToSave) {
													_.each(qtoDetailToSave, function (item) {
														if (item.QtoDetail) {
															isQtoDetailChange = true;
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
												});

												// set the boq split quantity
												if (isQtoDetailChange) {
													_.each(PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave, function (boqItemToSave) {
														if (boqItemToSave.BoqSplitQuantityToSave && boqItemToSave.BoqSplitQuantityToSave.length > 0) {
															var items = _.map(boqItemToSave.BoqSplitQuantityToSave, 'BoqSplitQuantity');
															var boqService = $injector.get('prcBoqMainService').getService(moduleContext.getMainService());
															$injector.get('boqMainSplitQuantityServiceFactory').getService(boqService, 'procurement.package').synBoqSplitQuantity(items);
														}
													});
												}
											}
										});
									}
								},
								showProjectHeader: {getProject: getProject}
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									creationData.PrjProjectFk = createParam.ProjectFk;
									creationData.ConfigurationFk = createParam.ConfigurationFk;
									creationData.Description = createParam.Description;
									creationData.StructureFk = createParam.StructureFk;
									creationData.ClerkPrcFk = createParam.ClerkPrcFk;
									creationData.ClerkReqFk = createParam.ClerkReqFk;
									creationData.AssetMasterFk = createParam.AssetMasterFk;
									creationData.Code = createParam.Code;
									creationData.IsAutoSave = true;// by defect#143849
									createParam = {};
								},
								incorporateDataRead: function (readData, data) {
									var result = serviceContainer.data.handleReadSucceeded(readData, data);
									var exist = platformGridAPI.grids.exist(gridContainerGuid);
									if (exist) {
										var containerInfoService = $injector.get('procurementPackageContainerInformationService');
										var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 48, gridContainerGuid.toUpperCase(), containerInfoService);
										characterColumnService.appendCharacteristicCols(readData.dtos);
									}
									return result;
								},
								handleCreateSucceeded: function (newData) {
									// package characteristic1 SectionId = 18;
									// package characteristic2 SectionId = 48;
									// configuration characteristic1 SectionId = 32;
									// configuration characteristic2 SectionId = 55;
									// structure characteristic1 SectionId = 9;
									// structure characteristic2 SectionId = 54;

									let createCharacteristicPromise = basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, newData, 18, 48, 32, 55, 9, 54);
									preUpdatePromises.push(createCharacteristicPromise);

									var exist = platformGridAPI.grids.exist(gridContainerGuid);
									if (exist) {
										var containerInfoService = $injector.get('procurementPackageContainerInformationService');
										var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 48, gridContainerGuid.toUpperCase(), containerInfoService);
										characterColumnService.appendDefaultCharacteristicCols(newData);
									}
									return newData;
								},
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						dataProcessor: [readonlyProcessor, {
							processItem: angular.noop,
							revertProcessItem: function (item) {
								// why sometimes item is array, and sometimes is object??
								// why this method will be call two times??
								// 2019-08-27@lst.
								if (!angular.isArray(item)) {
									item = [item];
								}
								angular.forEach(item, function (entity) {
									if (entity.Version === 0) {
										var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: entity.ConfigurationFk});
										var hasToGenerate = config && procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
										if (hasToGenerate) {
											entity.Code = 'IsGenerated';
										}
									}
								});
							}
						}, new ServiceDataProcessDatesExtension(['PlannedStart', 'PlannedEnd', 'ActualStart', 'ActualEnd', 'BaselineUpdate', 'DateEffective', 'DateDelivery', 'DeadlineDate', 'DateAwardDeadline','DateRequested',
							'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']),
						new SchedulingDataProcessTimesExtension(['DeadlineTime']),
						// TODO: it is just a work around to use complex Layer string such as 'Requisition2PackageData.MinDateRequired' when set deepen layer Object's value
						processDatesExtension],
						entitySelection: {supportsMultiSelection: true},
						longText: {
							relatedContainerTitle: 'procurement.package.packageListTitle',
							relatedGridId: '1D58A4DA633A485981776456695E3241',
							longTextProperties: [{
								displayProperty: 'Remark',
								propertyTitle: 'procurement.package.remarkContainerTitle'
							}, {
								displayProperty: 'Remark2',
								propertyTitle: 'procurement.package.remark2ContainerTitle'
							}, {
								displayProperty: 'Remark3',
								propertyTitle: 'procurement.package.remark3ContainerTitle'
							}]
						},
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName,
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						},
						filterByViewer: true,
						actions: {
							delete: {}, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								if (item && !_.isEmpty(item)) {
									if (item.Version === 0) {
										return true;
									} else {
										return !moduleContext.isReadOnly;
									}
								}
								return true;
							}
						}
					}
				};
				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
					deleteParams.entity = deleteParams.entities[0];
					deleteParams.entities = null;
				};
				serviceContainer.data.getChangedRootEntitiesAsArray = function getChangeRootEntitiesAsArray(updateData) {
					if (updateData.PrcPackages && _.isArray(updateData.PrcPackages)) {
						return updateData.PrcPackages;
					} else if (updateData.PrcPackage && _.isArray(updateData.PrcPackage)) {
						return updateData.PrcPackage;
					} else if (updateData.PrcPackage) {
						return [updateData.PrcPackage];
					}
					return [];
				};
				// reader service
				service = serviceContainer.service;
				service.name = moduleName;

				// eslint-disable-next-line no-unused-vars
				function update() {
					platformDataServiceModificationTrackingExtension.getModifications(service);
					service.update();
				}

				service.isProcurementModule = true;
				service.isSavedImmediately = true;
				service.targetSectionId = 18;
				service.completeItemCreated = completeItemCreated;
				service.reloadPackageIds = [];
				// used to distinguish wizard 'create contract' from package or requisition module.
				service.isPackageWizardCreateContract = false;
				service.totalFactorsChangedEvent = new PlatformMessenger();
				service.exchangeRateChanged = new PlatformMessenger();
				service.taxCodeFkChanged = new PlatformMessenger();
				service.projectFkChanged = new PlatformMessenger();
				service.assetMasterFkChanged = new PlatformMessenger();
				service.onParentUpdated = new PlatformMessenger();
				service.onStructureFkChanged = new PlatformMessenger();
				service.onBusinessPartnerFkChanged = new PlatformMessenger();
				// service.onProjectFkChanged = new PlatformMessenger();
				service.selectedPackageStatusChanged = new PlatformMessenger();
				service.vatGroupChanged = new PlatformMessenger();
				service.controllingUnitChanged = new PlatformMessenger();
				service.controllingUnitToItemBoq = new PlatformMessenger();
				service.onRecalculationItemsAndBoQ = new PlatformMessenger();
				service.PackageStatusChangedByWizard = new PlatformMessenger();
				service.onLeadingServiceUpdateDone = new PlatformMessenger();

				// eslint-disable-next-line no-unused-vars
				var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(service, service.targetSectionId);

				// TODO: it is just a work around to reuse the onCreateSucceeded in dataServiceFactory
				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {

					newData.totalItems = newData.PrcTotalsDto; // for total default create.
					newData.clerkItems = newData.Package2ClerkDto;
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcConfiguration'), {Id: newData.ConfigurationFk}) || {RubricCategoryFk: -1};
					var hasToGenerate = procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk);
					var code = newData.Code;
					// if AutoCreateBoq, then it will save the package immediately
					if ((code === null || code === '' || hasToGenerate) && newData.Version === 0) {
						procurementPackageNumberGenerationSettingsService.assertLoaded().then(function () {
							runtimeDataService.readonly(newData, [{
								field: 'Code',
								readonly: procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory(config.RubricCategoryFk)
							}]);
							newData.Code = procurementPackageNumberGenerationSettingsService.provideNumberDefaultText(config.RubricCategoryFk, code);
							var currentItem = serviceContainer.service.getSelected();
							var result = {apply: true, valid: true};
							if (newData.Code === '') {
								result.valid = false;
								result.error = $translate.instant('cloud.common.generatenNumberFailed', {fieldName: 'Code'});
							}
							platformDataValidationService.finishValidation(result, currentItem, currentItem.Code, 'Code', service, service);
							runtimeDataService.applyValidationResult(result, currentItem, 'Code');
							service.fireItemModified(currentItem);
							serviceContainer.service.markCurrentItemAsModified();
							service.gridRefresh();

						});
					}


					return onCreateSucceeded.call(serviceContainer.data,newData, data, creationData).then(function () {
						service.markCurrentItemAsModified();// when create done the set selected will call by grid which will make selection changed and do clear all modifications.
						service.completeItemCreated.fire(null, newData);
						// var sourceHeaderId = service.getConfigurationFk(newData.Package);
						// var  onEntityParentCreatedForPrcModule = procurementCommonCharacteristicDataService.createMethod(service.targetSectionId,sourceHeaderId,service.isSavedImmediately,update);
						// onEntityParentCreatedForPrcModule(null,newData.Package);
					});
				};

				var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer, {targetModuleName: moduleName});
				basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 18, 48);
				service.getDefaultListForCreated = function getDefaultListForCreated(targetSectionId, configrationSectionId, structureSectionId, newData) {
					var deferred = $q.defer();
					// var sourceHeaderId = service.getConfigurationFk();
					var sourceHeaderId = newData.Version === 0 ? newData.ConfigurationFk : service.getConfigurationFk();
					if (!sourceHeaderId) {
						sourceHeaderId = newData.ConfigurationFk;
					}
					procurementCommonCharacteristicDataService.getDefaultListForCreated(targetSectionId, sourceHeaderId, configrationSectionId, structureSectionId, newData).then(function (defaultItem) {
						if (defaultItem) {
							deferred.resolve(defaultItem);
						}
					});
					return deferred.promise;
				};

				let changeVatGroupRecalBoqAndItemDialogId = $injector.get('platformCreateUuid')();
				service.cellChange = function (entity, field) {
					if (field === 'BpdVatGroupFk') {
						prcCommonProcessChangeVatGroupDialog.showAskDialog(moduleName, service, serviceContainer.data, entity, changeVatGroupRecalBoqAndItemDialogId, function recalculateAfterChangeVatGroupInPac() {
							$http.get(globals.webApiBaseUrl + 'procurement/package/package/RecalculationBoQ?packageId=' + entity.Id + '&vatGroupFk=' + entity.BpdVatGroupFk + '&TaxCodeFkOfPackageHeader=' + entity.TaxCodeFk).then(function () {
								service.onRecalculationItemsAndBoQ.fire();
							});
						});
					}
				};

				service.onCreateFromTemplateSucceeded = function (newData) {
					angular.forEach(newData, function (item) {
						/** @namespace item.Package */
						service.getList().push(item.Package);
					});
					serviceContainer.data.listLoaded.fire();
					var length = service.getList().length;
					service.setSelected(service.getList()[length - 1]);
				};

				// TODO: it is just a work around to reuse the onReadSucceeded in dataServiceFactory
				var onReadSucceeded = serviceContainer.data.onReadSucceeded;
				serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					angular.forEach(readData.Main, function (item) {
						service.setEntityReadOnly(item);
					});
					var dataRead = onReadSucceeded({
						dtos: readData.Main,
						FilterResult: readData.FilterResult
					},
					data);

					// TODO: rework of pinning context needed
					// set pinning contextt
					if (readData.IsFavoritesJump && _.get(readData, 'Project') && _.get(readData, 'Main').length > 0) {
						var project = _.first(_.get(readData, 'Project'));
						var projectId = project.Id;
						var packageHeader = _.first(_.get(readData, 'Main'));
						// project favorites are used, we set pinning context
						setPrcPackageToPinningContext(projectId, packageHeader);
					}

					// service.goToFirst();
					if (!service.lastSelectionItem) {
						service.goToFirst();
					}

					return dataRead;
				};

				function setPrcPackageToPinningContext(projectId, packageHeader) {
					var packageHeaderId = _.get(packageHeader, 'Id');

					if ((projectMainPinnableEntityService.getPinned() !== projectId) || (packagePinnableEntityService.getPinned() !== packageHeaderId)) {
						var ids = {};
						projectMainPinnableEntityService.appendId(ids, projectId);
						return projectMainPinnableEntityService.pin(ids, serviceContainer.service).then(function () {
							return true;
						});
					} else {
						return $q.when(false);
					}
				}

				// filter events
				service.registerFilterLoad = function (func) {
					onFilterLoaded.register(func);
				};

				service.registerFilterUnLoad = function (func) {
					onFilterUnLoaded.register(func);
				};
				var tempFilter;
				var filters = [
					{
						key: 'procurement-package-header-project-assetmasterfk-filter',
						serverSide: true,
						fn: function (entity) {
							var filter = 'IsLive=true';
							if (entity.AssetMasterFk && entity.packageCreationShowAssetMaster) {

								var rootAssertMaster = null;
								var getRootAssertMaster = function (assetMasterFk, entities) {
									for (var i = entities.length; i > 0; i--) {
										var tempAssertMaster = entities[i - 1];
										if (tempAssertMaster.Id === assetMasterFk) {
											rootAssertMaster = entities[i - 1];
											break;
										} else {
											if (tempAssertMaster.HasChildren === true) {
												getRootAssertMaster(assetMasterFk, tempAssertMaster.AssetMasterChildren);
											}
										}
									}
								};

								tempFilter = '';
								var getFilter = function (rootAssertMasterEntity) {
									if (tempFilter.length > 0) {
										tempFilter += ' or ';
									}
									// tempFilter += 'AssetMasterFk=' + rootAssertMasterEntity.Id;
									tempFilter += rootAssertMasterEntity.Id;
									if (rootAssertMasterEntity.HasChildren === true) {
										for (var i = rootAssertMasterEntity.AssetMasterChildren.length; i > 0; i--) {
											getFilter(rootAssertMasterEntity.AssetMasterChildren[i - 1]);
										}
									}
								};

								var entities = entity.AssetMasterList;
								for (var p in entities) {
									if (Object.prototype.hasOwnProperty.call(entities,p)) {
										var assetMasterTemp = entities[p];
										if (assetMasterTemp.Id === entity.AssetMasterFk) {
											rootAssertMaster = assetMasterTemp;
											break;
										} else {
											if (assetMasterTemp.HasChildren === true) {
												getRootAssertMaster(entity.AssetMasterFk, assetMasterTemp.AssetMasterChildren);
											}
										}
									}
								}

								if (rootAssertMaster) {
									getFilter(rootAssertMaster);
									// eslint-disable-next-line no-unused-vars
									filter += ' and(' + tempFilter + ')';
								}
							}
							// return filter;
							return {
								IsLive: true,
								AssetMasterFk: tempFilter
							};
						}
					}, {
						key: 'procurement-package-header-project-filter',
						serverSide: true,
						fn: function () {
							return {IsLive: true};
						}
					}, {
						key: 'procurement-package-clerk-filter',
						serverSide: true,
						fn: function () {
							// the keyword 'and' here must be lowercase
							// return 'IsLive=true and CompanyFk='+item.CompanyFk+' and ProjectFk='+item.ProjectFk+' and StructureFk='+item.StructureFk;
							return 'IsLive=true';
						}
					}, {
						key: 'procurement-package-configuration-filter',
						serverSide: true,
						fn: function () {
							return 'RubricFk = ' + moduleContext.packageRubricFk;
						}
					}, {
						key: 'procurement-package-scheduling-activity-filter',
						serverSide: true,
						fn: function (item) {
							return 'ScheduleFk =' + item.ScheduleFk;
						}
					},
					{
						key: 'prc-package-businesspartner-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function () {
							var currentItem = service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
							};
						}
					},
					{
						key: 'prc-package-businesspartner-supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						/* jshint undef:false, unused:false */
						fn: function () {
							var currentItem = service.getSelected();
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'basics-asset-master-filter',
						serverSide: true,
						serverKey: 'basics-asset-master-filter',
						fn: function () {
							var currentItem = service.getSelected();
							if (!currentItem || !currentItem.ProjectFk) {// lookup project
								return null;
							}
							var projectLookup = basicsLookupdataLookupDescriptorService.getItemByIdSync(currentItem.ProjectFk, {lookupType: 'project'});
							if (!projectLookup || !projectLookup.AssetMasterFk) {
								return null;
							}
							return {AssetMasterFk: projectLookup.AssetMasterFk};
						}
					},
					{
						key: 'basics-asset-master-dialog-filter',
						serverSide: true,
						serverKey: 'basics-asset-master-dialog-filter',
						fn: function (currentItem) {
							if (!currentItem || !currentItem.ProjectFk) {// lookup project
								return null;
							}
							if (!currentItem || !currentItem.ProjectFk) {// lookup project
								return null;
							}
							var projectLookup = basicsLookupdataLookupDescriptorService.getItemByIdSync(currentItem.ProjectFk, {lookupType: 'project'});
							if (!projectLookup || !projectLookup.AssetMasterFk) {
								return null;
							}
							return {AssetMasterFk: projectLookup.AssetMasterFk};
						}
					},
					{
						key: 'procurement.package.clerkalt-role-filter',
						serverSide: false,
						/* jshint undef:false, unused:false */
						fn: function (currentItem) {
							return currentItem.IsForPackage === true;
						}
					},
					{
						key: 'procurement.package.clerk-role-filter',
						serverSide: false,
						/* jshint undef:false, unused:false */
						fn: function (currentItem) {
							return currentItem.IsForPackageAccess === true;
						}
					},
					{
						key: 'bas-currency-conversion-filter',
						serverSide: true,
						serverKey: 'bas-currency-conversion-filter',
						fn: function (currentItem) {
							return {companyFk: currentItem.CompanyFk};
						}
					},
					{
						key: 'prc-con-controlling-by-prj-filter',
						serverKey: 'prc.con.controllingunit.by.prj.filterkey',
						serverSide: true,
						fn: function (entity) {
							return {
								ByStructure: true,
								ExtraFilter: true,
								PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
								CompanyFk: platformContextService.getContext().clientId
							};
						}
					},
					{
						key: 'prc-package-copymode-filter',
						serverSide: false,
						fn: function (currentItem) {
							return currentItem.Id !== procurementCopyMode.CurrentPackageOnly;
						}
					}
				];

				// register filter by hand
				service.registerFilters = function registerFilters() {
					LookupFilterService.registerFilter(filters);
					onFilterLoaded.fire(moduleName);
				};

				// unload filters
				service.unregisterFilters = function () {
					LookupFilterService.unregisterFilter(filters);
					onFilterUnLoaded.fire(moduleName);
				};

				service.getRubricId = function () {
					return moduleContext.packageRubricFk;
				};

				procurementCommonHelperService.registerNavigation(serviceContainer.data.httpReadRoute, {
					moduleName: moduleName,
					getNavData: function getNavData(item, triggerfield) {
						var navHeaderFk = null;
						if (triggerfield === 'fromRfqReq' || triggerfield === 'fromQtnReq') {
							var items = basicsLookupdataLookupDescriptorService.getData('reqheaderlookupview');
							var req = _.filter(items, function (rfq) {
								return rfq.Id === item.ReqHeaderFk;
							});
							if (req) {
								navHeaderFk = req[0].PrcPackageFk;
							}
						} else if (triggerfield === 'PrcPackageFk' && _.isArray(item)) {
							navHeaderFk = item;
						} else if (triggerfield === 'Id') {
							if (_.isObject(item)) {
								return item[triggerfield];
							}
							if (_.isString(item)) {
								return parseInt(item);
							}
						} else if (triggerfield === 'Ids' && item.FromGoToBtn) {
							return item.Ids.split(',');
						} else {
							navHeaderFk = item.PackageFk || item.PrcPackageFk || _.get(item, 'PrcBoq.PackageFk');
							if (!angular.isDefined(navHeaderFk) && angular.isDefined(triggerfield)) {
								navHeaderFk = platformObjectHelper.getValue(item, triggerfield);
							}
						}
						if (angular.isDefined(navHeaderFk)) {
							return navHeaderFk;
						} else {
							throw new Error('The property is not recognized.');
						}
					}
				});

				service.registerPropertyChanged = function registerPropertyChanged(func) {
					onPropertyChanged.register(func);
				};
				service.unregisterPropertyChanged = function unregisterPropertyChanged(func) {
					onPropertyChanged.unregister(func);
				};
				service.firePropertyChanged = function firePropertyChanged(entity, value, model) {
					onPropertyChanged.fire(null, {entity: entity, model: model, value: value});
				};

				service.registerPrcEventProperChanged = function (func) {
					onPrcEventProperChanged.register(func);
				};
				service.unregisterPrcEventProperChanged = function (func) {
					onPrcEventProperChanged.unregister(func);
				};
				service.firePrcEventProperChanged = function (Event, orginEventType) {
					onPrcEventProperChanged.fire(null, {MainEvent: Event, OriginEventType: orginEventType});
				};

				service.mergeMainEvent = function (entities) {
					var itemList = service.getList();
					_.forEach(entities, function (entity) {
						var mergeItem = _.find(itemList, {Id: entity.Id});
						if (mergeItem) {
							_.extend(mergeItem, entity);
							platformDataServiceDataProcessorExtension.doProcessItem(mergeItem, serviceContainer.data);
							service.setEntityReadOnly(mergeItem);
							service.gridRefresh();
						}
					});
				};

				service.registerPrcEventProperChanged(function (e, args) {
					var currentItem = service.getSelected();
					if (currentItem) {
						var isChanged = false;
						if (args.OriginEventType && args.OriginEventType.IsMainEvent) {
							_.set(currentItem, 'MainEvent' + args.OriginEventType.Id, null);
							isChanged = true;
						}
						if (args.MainEvent && args.MainEvent.PrcEventTypeDto.IsMainEvent) {
							_.set(currentItem, 'MainEvent' + args.MainEvent.PrcEventTypeDto.Id, args.MainEvent);
							isChanged = true;
						}

						if (isChanged) {
							service.setEntityReadOnly(currentItem);
							service.markItemAsModified(currentItem);
						}
					}
				});

				function projectFkChanged(e, args) {
					if (args.model === 'ProjectFk') {
						// procurementPackageClerkService.copyClerksFromProject(args.value);
						$http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + args.value).then(function (response) {
							if (_.isArray(response.data) && response.data.length === 1) {
								var oldAssetMaster = args.entity.AssetMasterFk;

								args.entity.AssetMasterFk = response.data[0].AssetMasterFk;
								var validateService = $injector.get('procurementPackageValidationService');
								validateService.validateAssetMasterFk(args.entity, response.data[0].AssetMasterFk, 'AssetMasterFk');
								service.gridRefresh();

								if (!args.entity.AddressEntity) {
									// eslint-disable-next-line no-unused-vars
									var addressFk = null;
									var deffer = $q.defer();

									// 1.get address from asset master
									if (response.data[0].AssetMasterFk) {
										$http
											.get(globals.webApiBaseUrl + 'basics/assetmaster/get?id=' + response.data[0].AssetMasterFk)
											.then(function (xhr) {
												xhr.data = xhr.data || {};
												deffer.resolve(xhr.data.AddressFk);
											});
									} else {
										deffer.resolve(null);
									}

									deffer.promise
										.then(function (addressFk) {
											// 2. if asset master have no address ,then get from project
											addressFk = addressFk || response.data[0].AddressFk;

											// 3.if have fk,then load remote data
											if (addressFk) {
												updateAddress(args.entity, addressFk);
											}
										});

								} else {
									if (response.data[0].AssetMasterFk && response.data[0].AssetMasterFk !== oldAssetMaster) {
										$http
											.get(globals.webApiBaseUrl + 'basics/assetmaster/get?id=' + response.data[0].AssetMasterFk)
											.then(function (xhr) {
												if (xhr && xhr.data && xhr.data.AddressFk) {
													updateAddress(args.entity, xhr.data.AddressFk);
												}
											});
									}
								}
							}
							// response end ===============================
						});
					}
				}

				service.projectFkChanged.register(projectFkChanged);

				function onAssetMasterFkChanged(e, args) {
					if (args.model === 'AssetMasterFk' && args.value > 0) {
						$http
							.get(globals.webApiBaseUrl + 'basics/assetmaster/get?id=' + args.value)
							.then(function (xhr) {
								if (xhr && xhr.data && xhr.data.AddressFk) {
									updateAddress(args.entity, xhr.data.AddressFk);
								}
							});
					}
				}

				service.assetMasterFkChanged.register(onAssetMasterFkChanged);

				function updateAddress(entity, addressFk) {
					$http
						.get(globals.webApiBaseUrl + 'basics/common/address/clone?id=' + addressFk)
						.then(function (xhr) {
							if (xhr && xhr.data) {
								entity.AddressFk = xhr.data.Id;
								entity.AddressEntity = xhr.data;
								service.gridRefresh();
							}
						});
				}

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns  object {IsReadonly:true|false}
				 */
				service.getModuleState = function getModuleState(item) {
					if (!service.checkIfCurrentLoginCompany()) {
						return {IsReadonly: true};
					}

					var state, status, parentItem = item || service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('PackageStatus');

					if (!_.isNil(parentItem)) {
						state = _.find(status, {Id: parentItem.PackageStatusFk});
					} else {
						state = {IsReadonly: true};
					}

					return state;
				};

				service.checkIfCurrentLoginCompany = function (item) {
					let entity = item || service.getSelected() || (service.getSelectedEntities().length > 0 ? service.getSelectedEntities()[0] : null);
					return entity?.CompanyFk === moduleContext.loginCompany;
				};

				service.getContainerData = function () {
					return serviceContainer.data;
				};

				service.registerSelectionChanged(function setFilter() {
					var currentItem = service.getSelected();
					if (currentItem && currentItem.Id) {
						moduleContext.exchangeRate = currentItem.ExchangeRate;
						service.setEntityReadOnly(currentItem);
						moduleContext.setModuleStatus(service.getModuleState(currentItem));
					} else {
						moduleContext.setModuleStatus({IsReadonly: true});
					}

					service.selectedPackageStatusChanged.fire(moduleContext.getModuleStatus());

					service.hasItemsOrBoqs({});
				});

				/**
				 * @ngdoc function
				 * @name getCellEditable
				 * @function
				 * @methodOf procurement.package.procurementPackageDataService
				 * @description get editable of model
				 * @returns bool
				 */
				/* jshint -W074 */ // The complexly warning is not need, logic in method is simple and readable
				service.getCellEditable = function (item, model) {
					var editable = true, state = false;
					if (angular.isDefined(item)) {

						// check is editable
						state = service.getModuleState(item);
						if (state && state.IsReadonly) {
							return false;
						}

						var mainEvent;
						// check filed editable
						if (model === 'ExchangeRate') {
							editable = moduleContext.companyCurrencyId !== item.CurrencyFk;
						} else if (model === 'ConfigurationFk') {
							// editable only before first time save
							return item.Version === 0;
						} else if (model.indexOf('StartRelevant') !== -1) {
							mainEvent = _.get(item, model.slice(0, model.indexOf('.')));
							if (!mainEvent || mainEvent.StartActualBool) {
								editable = false;
							}
						} else if (model.indexOf('EndRelevant') !== -1) {
							mainEvent = _.get(item, model.slice(0, model.indexOf('.')));
							if (!mainEvent || mainEvent.EndActualBool) {
								editable = false;
							}
						} else if (model === 'ActivityFk') {
							editable = item.ScheduleFk;
						} else if (model === 'SubsidiaryFk') {
							editable = !!item.BusinessPartnerFk;
						} else if (model === 'Code') {
							editable = item.Version === 0;
						}
					}
					return editable;
				};

				service.updateReadOnly = function updateReadOnly(entity, readOnlyField, value, editField) {
					if (!entity) {
						return;
					}
					if (editField) {
						entity[editField] = value;
					}
					var readOnly = !service.getCellEditable(entity, readOnlyField);
					runtimeDataService.readonly(entity, [{field: readOnlyField, readonly: readOnly}]);
				};

				service.updateFieldsReadOnly = function updateFieldsReadOnly(entity, readOnlyFields, value, editField) {
					if (editField) {
						entity[editField] = value;
					}
					angular.forEach(readOnlyFields, function (filed) {
						var readOnly = !service.getCellEditable(entity, filed);
						runtimeDataService.readonly(entity, [{field: filed, readonly: readOnly}]);
					});
				};

				// characteristic item readonly
				service.setDataReadOnly = function (items) {
					_.forEach(items, function (item) {
						runtimeDataService.readonly(item, true);
					});
				};

				service.setEntityReadOnly = function (entity) {
					service.updateFieldsReadOnly(entity, ['Code', 'ConfigurationFk', 'ExchangeRate', 'ActivityFk'].concat(processDatesExtension.getDynamicFieldsFromEvent()));
				};

				// TODO It's just a workaround for create project suceesfully
				createParam = {};
				var showEditDialog;
				var baseCreateItem = service.createItem;
				service.createItem = function createItem() {
					if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
						return platformDataServiceConfiguredCreateExtension.createByConfiguredDialog(platformDataServiceActionExtension, serviceContainer.data);
					} else {
						var loginProject = moduleContext.loginProject;
						showEditDialog(loginProject).then(function (params) {
							createParam = params;
							return baseCreateItem().then(function () {
								$q.all(preUpdatePromises);
							});
						});
					}
				};

				service.createDeepCopy = function createDeepCopy() {
					let entity = angular.copy(service.getSelected());
					if (entity && entity.DeadlineTime && _.isObject(entity.DeadlineTime)) {
						entity.DeadlineTime = entity.DeadlineTime.format('HH:mm:ss');
					}
					$http.post(globals.webApiBaseUrl + 'procurement/package/package/deepcopy', entity)
						.then(function (response) {
							/** @namespace response.data.PrcPackage */
							serviceContainer.data.handleOnCreateSucceeded(response.data.PrcPackage, serviceContainer.data);
						},
						function (/* error */) {
						});
				};

				showEditDialog = function showEditDialog(selectedProject) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/showassetmasterinprocurement').then(function (response) {
						platformModalService.showDialog({
							defaults: {
								ProjectFk: selectedProject || null,
								IsCreateByPackage: true
							},
							templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-prc-package-project.html',
							backdrop: false,
							packageCreationShowAssetMaster: response.data
						}).then(function (result) {
							if (result) {
								var params = {};
								params.ProjectFk = result.ProjectFk;
								params.ConfigurationFk = result.ConfigurationFk;
								params.Description = result.Description;
								params.StructureFk = result.StructureFk === -1 ? null : result.StructureFk;
								params.ClerkPrcFk = result.ClerkPrcFk;
								params.ClerkReqFk = result.ClerkReqFk;
								params.AssetMasterFk = result.AssetMasterFk;
								params.Code = result.Code;
								defer.resolve(params);
							}
						});
					});
					return defer.promise;
				};

				var needUpdateDateFromActivity = function needUpdateDateFromActivity(entityActivity, entityPackage) {
					if (entityActivity && entityPackage) {
						var activityPlannedStart = entityActivity.PlannedStart ? moment.utc(entityActivity.PlannedStart).format('YYYY-MM-DD') : null;
						var activityPlannedEnd = entityActivity.PlannedFinish ? moment.utc(entityActivity.PlannedFinish).format('YYYY-MM-DD') : null;
						var activityActualStart = entityActivity.ActualStart ? moment.utc(entityActivity.ActualStart).format('YYYY-MM-DD') : null;
						var activityActualEnd = entityActivity.ActualFinish ? moment.utc(entityActivity.ActualFinish).format('YYYY-MM-DD') : null;

						var packagePlannedStart = entityPackage.PlannedStart ? entityPackage.PlannedStart.format('YYYY-MM-DD') : null;
						var packagePlannedEnd = entityPackage.PlannedEnd ? entityPackage.PlannedEnd.format('YYYY-MM-DD') : null;
						var packageActualStart = entityPackage.ActualStart ? entityPackage.ActualStart.format('YYYY-MM-DD') : null;
						var packageActualEnd = entityPackage.ActualEnd ? entityPackage.ActualEnd.format('YYYY-MM-DD') : null;

						if (packagePlannedStart !== activityPlannedStart ||
							packagePlannedEnd !== activityPlannedEnd ||
							packageActualStart !== activityActualStart ||
							packageActualEnd !== activityActualEnd) {
							return true;
						}
					}
					return false;
				};

				service.showDateDecisionDialog = function showDateDecisionDialog(headerEntity, activityId) {
					$injector.get('basicsLookupdataLookupDataService').getItemByKey('SchedulingActivity', activityId).then(function (res) {

						var validateActivity = res;
						if (!validateActivity) {
							return;
						}
						if (needUpdateDateFromActivity(validateActivity, headerEntity)) {
							platformModalService.showDialog({
								validateActivity: validateActivity,
								headerEntity: headerEntity,
								templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-change-date.html',
								backdrop: false
							}).then(function (res) {
								if (res && res === true) {
									self.setPackageDateFromActivity(headerEntity, validateActivity);
									service.gridRefresh();
								}
							});
						}
					});

				};

				self.setPackageDateFromActivity = function (entity, activityItem) {
					if (entity && activityItem && needUpdateDateFromActivity(activityItem, entity)) {
						entity.PlannedStart = activityItem.PlannedStart ? moment.utc(activityItem.PlannedStart) : null;
						entity.PlannedEnd = activityItem.PlannedFinish ? moment.utc(activityItem.PlannedFinish) : null;
						entity.ActualStart = activityItem.ActualStart ? moment.utc(activityItem.ActualStart) : null;
						entity.ActualEnd = activityItem.ActualFinish ? moment.utc(activityItem.ActualFinish) : null;
						service.markItemAsModified(entity);
						return true;
					}
					return false;
				};

				// load lookup items, and cache in front end.
				basicsLookupdataLookupDescriptorService.loadData(['PackageStatus', 'ReqStatus', 'RfqStatus', 'ConStatus']);

				function getProject(entity) {
					if (!entity || !entity.ProjectFk) {
						return null;
					}
					return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
				}

				service.updateModuleHeaderInfo = function (subItem) {
					let headerObject = {};
					var entity = service.getSelected();
					var projectText = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(getProject(entity), {
						codeField: 'ProjectLongNo',
						descField: 'ProjectName'
					}, 'text'
					) || '';

					headerObject.project = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(getProject(entity), {
							codeField: 'ProjectLongNo',
							descField: 'ProjectName'
						}, 'object'
					) || '';

					if (projectText.length > 0) {
						projectText += ' / ';
					}

					projectText += platformHeaderDataInformationService.prepareMainEntityHeaderInfo(entity, {
						codeField: 'Code',
						descField: 'Description'
					});

					headerObject.module = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(entity, {
						codeField: 'Code',
						descField: 'Description'
					}, 'object');


					var subPackageText = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(subItem, {
						descField: 'Description'
					});

					headerObject.lineItem = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(subItem, {
						descField: 'Description'
					}, 'object');

					if (subPackageText.length > 0) {
						projectText += ' / ';
					}

					projectText += subPackageText;
					cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePackage', headerObject, '');
				};

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'PrcPackageDto',
					moduleSubModule: 'Procurement.Package',
					validationService: 'procurementPackageValidationService',
					mustValidateFields: mandatoryFields
				});

				serviceContainer.service.validateNewEntity = function (newItem) {
					return serviceContainer.data.newEntityValidator.validate(newItem, serviceContainer.service);
				};

				mergeUpdatedBoqRootItemIntoBoqList = function mergeUpdatedBoqRootItemIntoBoqList(response) {

					if (angular.isUndefined(response) || response === null) {
						return;
					}

					/** @namespace response.PrcPackage2HeaderToSave */
					var packageHeaderToSaveArray = response.PrcPackage2HeaderToSave;

					if (angular.isUndefined(packageHeaderToSaveArray) || !_.isArray(packageHeaderToSaveArray)) {
						return;
					}

					angular.forEach(packageHeaderToSaveArray, function (packageHeaderToSave) {
						if (angular.isUndefined(packageHeaderToSave) || (packageHeaderToSave === null)) {
							return;
						}

						var prcBoqCompleteToSave = packageHeaderToSave.PrcBoqCompleteToSave;

						if (angular.isUndefined(prcBoqCompleteToSave) || (prcBoqCompleteToSave === null)) {
							return;
						}

						var boqItemCompleteToSaveArray = prcBoqCompleteToSave.BoqItemCompleteToSave;

						if (angular.isUndefined(boqItemCompleteToSaveArray) || !_.isArray(boqItemCompleteToSaveArray)) {
							return;
						}

						angular.forEach(boqItemCompleteToSaveArray, function (boqItemCompleteToSave) {
							if (angular.isUndefined(boqItemCompleteToSave) || (boqItemCompleteToSave === null)) {
								return;
							}

							var updatedBoqRootItem = boqItemCompleteToSave.BoqItem;

							if (angular.isUndefined(updatedBoqRootItem) || (updatedBoqRootItem === null)) {
								return;
							}

							// We're only handling boq root item changes for these are the types that are updated when the package is saved and changes have been
							// done to the currently active procurement boq structure root item.
							var boqMainLineTypes = $injector.get('boqMainLineTypes');
							if (updatedBoqRootItem.BoqLineTypeFk !== boqMainLineTypes.root) {
								// This shouldn't happen, but if so we exit here
								return;
							}

							var procurementPackagePackage2HeaderService = $injector.get('procurementPackagePackage2HeaderService');
							var prcBoqMainService = $injector.get('prcBoqMainService');
							var boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
							var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
							var prcCommonBoqService = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, boqMainService);
							var boqList = prcCommonBoqService.getList();

							var boqExtended = _.find(boqList, function (item) {
								return item.BoqRootItem.Id === updatedBoqRootItem.Id;
							});

							if (angular.isUndefined(boqExtended) || (boqExtended === null)) {
								return;
							}

							var boqRootItem = boqExtended.BoqRootItem;

							if (angular.isDefined(boqRootItem) && (boqRootItem !== null) && (boqRootItem.Id === updatedBoqRootItem.Id)) {
								// Update the client side version with the server side version of this boqItem.
								// Remove the child array property, because an empty property might delete the child hierarchy on the client side.
								if (angular.isDefined(updatedBoqRootItem.BoqItems)) {
									delete updatedBoqRootItem.BoqItems;
								}
								angular.extend(boqRootItem, updatedBoqRootItem);
							}
						});
					});
				};
				service.getConfigurationFk = function getConfigurationFk() {
					if (service.getSelected()) {
						return service.getSelected().ConfigurationFk;
					}
				};

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddSelectedItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getSelectedItems() {
					var resultSet = service.getSelected();
					if (resultSet === null || resultSet === undefined) {
						return;
					}
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				/**
				 * this function will be called from Sidebar Inquiry container when user presses the "AddAllItems" Button
				 * returns: array {itemInfo}  {iteminfo} { id: int(unique identifier), name: string, description: string}
				 */
				function getResultsSet() {
					let resultSet = platformGridAPI.rows.getRows(gridContainerGuid);
					return createInquiryResultSet(_.isArray(resultSet) ? resultSet : [resultSet]);
				}

				function createInquiryResultSet(resultSet) {
					var defNoName = $translate.instant('businesspartner.main.inquiry.noname');
					var defNoSubSidDesc = $translate.instant('businesspartner.main.inquiry.nosubsidiarydesc');
					var resultArr = [];
					_.forEach(resultSet, function (item) {
						if (item && item.Id) { // check for valid object
							resultArr.push({
								id: item.Id,
								name: item.Code === '' ? defNoName : item.Code,
								description: item.Description === '' ? defNoSubSidDesc : item.Description
							});
						}
					});

					return resultArr;
				}

				// charDataService.registerParentsEntityCreated();

				var formerUpdateAndExecute = service.updateAndExecute;
				service.updateAndExecute = function updateAndExecute(callWhenDataIsInUpdatedStateFunc) {
					var procurementPackagePackage2HeaderService = $injector.get('procurementPackagePackage2HeaderService');
					var prcBoqMainService = $injector.get('prcBoqMainService');
					var boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
					var procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService');
					var prcCommonBoqService = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, boqMainService);
					let boqUpdatedata = platformDataServiceModificationTrackingExtension.getModifications(prcCommonBoqService);
					if (boqUpdatedata && boqUpdatedata.PrcBoqExtended) {
						var boqExtendedItem = prcCommonBoqService.getList();
						_.forEach(boqExtendedItem,(item)=>{
							if(item.BoqRootItem){
								setFormatValue(item.BoqRootItem);
								formatDateValueObjectToString(item.BoqRootItem);
							}
						});
					}
					let packageModifications = platformDataServiceModificationTrackingExtension.getModifications(service);
					if((packageModifications && packageModifications.EntitiesCount > 0) && (boqUpdatedata && boqUpdatedata.EntitiesCount > 0)) {
						return prcCommonBoqService.update().then(async function () {
							const updateData = await service.update();
							if(updateData){
								service.refreshSelectedEntities();
							}
						});
					}else{
						return prcCommonBoqService.update().then(function () {
							formerUpdateAndExecute(callWhenDataIsInUpdatedStateFunc);
						});
					}
				};

				function formatDateValueObjectToString(item) {
					if(item.BoqItems !== null){
						_.forEach(item.BoqItems,(itemObject)=>{
							setFormatValue(itemObject);
							formatDateValueObjectToString(itemObject);
						});
					}
				}

				function setFormatValue(entity) {
					let insertVal = entity.InsertedAt;
					if(typeof(insertVal)==='object'){
						entity.InsertedAt = insertVal._i;
					}
					let updateVal = entity.UpdatedAt;
					if(typeof(updateVal)==='object' && !_.isNil(updateVal)){
						entity.UpdatedAt = updateVal._i;
					}
				}

				service.hasItemsOrBoqs = function (o) {
					if (_.isObject(o)) {
						hasItemsOrBoqs.items = !!o.items;
						hasItemsOrBoqs.prcboqs = !!o.prcboqs;
						hasItemsOrBoqs.boqitems = !!o.boqitems;
					}
				};
				service.getItemsOrBoqs = function () {
					return hasItemsOrBoqs;
				};
				let doUpdateControllingUnitDialogId = $injector.get('platformCreateUuid')();
				// eslint-disable-next-line no-unused-vars
				service.wantToUpdateCUToItemsAndBoq = function (entity,isProjectFkChange) {
					const defer = $q.defer();
					if (hasItemsOrBoqs.items || hasItemsOrBoqs.prcboqs || hasItemsOrBoqs.boqitems) {
						var modalOptions = {
							headerText: $translate.instant('procurement.package.updateControllingUnitDialogTitle'),
							bodyText: $translate.instant('procurement.package.doUpdateControllingUnit'),
							showYesButton: true, showNoButton: true,
							iconClass: 'ico-question',
							id: doUpdateControllingUnitDialogId,
							dontShowAgain: true
						};
						let validateService = $injector.get('procurementPackageValidationService');
						$injector.get('procurementContextService').showDialogAndAgain(modalOptions)
							.then(function (result) {
								if (result.yes) {
									if(!_.isNil(isProjectFkChange)){
										if(isProjectFkChange){
											service.updateHeaderCUtoItemBoq(entity);
											entity.NeedUpdateCUToItemsBoq = true;
											service.fireItemModified(entity);
										}
									}else {
										var selected = service.getSelected();
										if (selected) {
											needUpdateUcToItemsBoqs = true;
											service.controllingUnitToItemBoq.fire();
										}
									}
								} else {
									needUpdateUcToItemsBoqs = false;
								}
								defer.resolve(true);
							}).finally(function () {
								service.hasItemsOrBoqs({});
								if(!_.isNil(isProjectFkChange) && isProjectFkChange){
									validateService.validateCurrencyFn(entity, entity.CurrencyFk, 'CurrencyFk');
								}
							});
					}
					else {
						defer.resolve(true);
					}
					return defer.promise;
				};

				// -------------- check and update package from baseline ----------------------- start

				service.checkPackageIsChangedInBaseline = function (entity) {
					return $http.post(globals.webApiBaseUrl + 'procurement/package/baseline/checkpackageischanged', entity)
						.then(function (response) {
							return response.data;
						});
				};

				service.checkAndUpdatePakcageFromBaseLine = function (entity) {
					return $http.post(globals.webApiBaseUrl + 'procurement/package/baseline/checkandupdatepackage', entity)
						.then(function (response) {
							return response.data;
						});
				};

				service.updateHeaderCUtoItemBoq = (entity)=> {
					let procurementCommonPrcBoqService = $injector.get('procurementCommonPrcBoqService').getService();
					let itemList = itemService.getService().getList();
					let prcBoqList = procurementCommonPrcBoqService.getList();
					let boqService = $injector.get('prcBoqMainService').getService();
					let boqItemList = boqService.getList();
					for (let i = 0; i < itemList.length; i++) {
						itemList[i].MdcControllingunitFk = entity.MdcControllingUnitFk;
						itemService.getService().markItemAsModified(itemList[i]);
					}
					for (let i = 0; i < prcBoqList.length; i++) {
						prcBoqList[i].PrcBoq.MdcControllingunitFk = entity.MdcControllingUnitFk;
						procurementCommonPrcBoqService.markItemAsModified(prcBoqList[i]);
					}
					for (let i = 0; i < boqItemList.length; i++) {
						boqItemList[i].MdcControllingunitFk = entity.MdcControllingUnitFk;
						boqService.markItemAsModified(boqItemList[i]);
					}
				};

				service.checkingPackages = [];
				service.existsCheckingPackageId = function (id) {
					return _.findIndex(service.checkingPackages, function (n) {
						return n === id;
					}) !== -1;
				};
				service.setCheckingPackageId = function (id) {
					service.checkingPackages.push(id);
				};
				service.removeCheckingPackageId = function (id) {
					var idx = _.findIndex(service.checkingPackages, function (n) {
						return n === id;
					});
					if (idx !== -1) {
						service.checkingPackages.splice(idx, 1);
					}
				};
				service.refreshPackages = [];
				service.hasRefreshPackages = function () {
					return service.refreshPackages && service.refreshPackages.length > 0;
				};
				service.existsRefreshPackageId = function (id) {
					return _.findIndex(service.refreshPackages, function (n) {
						return n === id;
					}) !== -1;
				};
				service.setRefreshPackageId = function (id) {
					service.refreshPackages.push(id);
				};
				service.removeRefreshPackageId = function (id) {
					var idx = _.findIndex(service.refreshPackages, function (n) {
						return n === id;
					});
					if (idx !== -1) {
						service.refreshPackages.splice(idx, 1);
					}
				};

				service.showBlockDialog = new PlatformMessenger();
				service.closeBlockDialog = new PlatformMessenger();

				service.hasContracts = function (packageId) {
					return $http.get(globals.webApiBaseUrl + 'procurement/contract/header/packagehascontract?packageId=' + packageId)
						.then(function (response) {
							return response.data;
						});
				};

				var isShowMessageboxCache = {
					show: null,
					cacheTime: null
				};

				function getOptionForMessageBox() {
					if (isShowMessageboxCache.cacheTime !== null) {
						return isShowMessageboxCache.show;
					}
				}

				function setOptionForMessageBox(show) {
					isShowMessageboxCache.show = show;
					isShowMessageboxCache.cacheTime = new Date().getTime();
				}

				// when leave current module, we must clear the cache data.
				service.clearIsShowMessageboxCache = function () {
					isShowMessageboxCache.show = null;
					isShowMessageboxCache.cacheTime = null;
				};

				service.isShowPackageAutoUpdateMessagebox = function () {
					var show = getOptionForMessageBox();
					if (show !== undefined) {
						return $q.when(show);
					} else {
						return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isshowpackageautoupdatemessagebox')
							.then(function (response) {
								var show = response.data;
								setOptionForMessageBox(show);
								return show;
							});
					}
				};

				service.getPackageById = function(id){
					return $http.get(globals.webApiBaseUrl + 'procurement/package/package/getitembyid?headerId=' + id)
						.then(function(response){
							return response.data;
						});
				};

				service.getHeaderEditAble = function () {
					var statusList = basicsLookupdataLookupDescriptorService.getData('PackageStatus');
					var packageHeader = service.getSelected();
					if(packageHeader) {
						var oneStatus = _.find(statusList, {Id: packageHeader.PackageStatusFk});
						return !(oneStatus && oneStatus.IsReadonly);
					}
					return false;
				};

				// -------------- check and update package from baseline ----------------------- end

				service.wizardIsActivate = function () {
					var status = basicsLookupdataLookupDescriptorService.getData('PackageStatus');
					var parentItem = service.getSelected();
					var IsActivate = true;
					var bodyText = '';
					if (parentItem) {
						var oneStatus = _.find(status, {Id: parentItem.PackageStatusFk});
						var IsReadonly = oneStatus.IsReadonly;
						var IsLive = oneStatus.IsLive;
						IsActivate = !IsReadonly;
						if (IsReadonly) {
							bodyText = $translate.instant('procurement.package.wizard.isReadOnlyMessage');
						}
						if (!IsLive) {
							bodyText = $translate.instant('procurement.package.wizard.isNoActivateMessage');
						}
						if (IsReadonly && !IsLive) {
							bodyText = $translate.instant('procurement.package.wizard.isReadOnlyAndNoActivateMessage');
						}
						if (IsActivate) {
							IsActivate = IsLive;
						}
					}
					if (!IsActivate) {
						var headerTextKey = $translate.instant('procurement.package.wizard.isActivateCaption');
						var modalOptions = {
							headerTextKey: headerTextKey,
							bodyTextKey: bodyText,
							showOkButton: true,
							showCancelButton: false,
							defaultButton: 'ok',
							iconClass: 'ico-question'
						};
						platformModalService.showDialog(modalOptions);
					}
					return IsActivate;
				};
				service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;
				// add update done event.
				var basUpdateSucceeded = serviceContainer.data.onUpdateSucceeded,
					leadingUpdateDone = new PlatformMessenger();
				serviceContainer.data.onUpdateSucceeded = function doUpdate() {
					var result = basUpdateSucceeded.apply(this, arguments);
					leadingUpdateDone.fire(null, {leadingService: service});

					var currentItem = service.getSelected();
					if (currentItem) {
						service.updateFieldsReadOnly(currentItem, ['Code', 'ConfigurationFk', 'MainEventDto.StartRelevant', 'MainEventDto.EndRelevant']);
					}
					return result;
				};

				service.registerUpdateDone = function registerUpdateDone(handler) {
					leadingUpdateDone.register(handler);
				};
				service.unregisterUpdateDone = function unregisterUpdateDone(handler) {
					leadingUpdateDone.unregister(handler);
				};

				service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData) {
					if (updateData.PrcPackage) {
						// adding PrcPackages for batch disable record
						if (updateData.PrcPackage.length > 1) {
							updateData.PrcPackages = updateData.PrcPackage;
							updateData.PrcPackage = null;
						} else if (updateData.PrcPackage.length === 1) {
							updateData.PrcPackages = null;
							updateData.PrcPackage = updateData.PrcPackage[0];
						}
					}

					if (needUpdateUcToItemsBoqs) {
						// need to update controllingUnit of prcItems and boqItems
						updateData.NeedUpdateUcToItemsBoqs = true;
						needUpdateUcToItemsBoqs = false;
					}

					// the cost group to save
					if (updateData.PrcPackage2HeaderToSave?.length > 0) {
						_.each(updateData.PrcPackage2HeaderToSave, function (PrcPackage2Header) {
							if (PrcPackage2Header.PrcHeaderblobToSave){
								procurementCommonHelperService.setHeaderTextContentNull(PrcPackage2Header.PrcHeaderblobToSave);
							}

							if (PrcPackage2Header.PrcBoqCompleteToSave && PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave && PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave.length > 0) {
								var qtoDetailsToSave = _.map(PrcPackage2Header.PrcBoqCompleteToSave.BoqItemCompleteToSave, 'QtoDetailToSave');
								_.each(qtoDetailsToSave, function (qtoDetailToSave) {
									_.each(qtoDetailToSave, function (item) {
										if (item.QtoDetail) {
											if (item.QtoDetail.CostGroupsToCopy && item.QtoDetail.IsCopy) {
												item.CostGroupToSave = item.QtoDetail.CostGroupsToCopy;
											}
										}
									});
								});
							}
						});
					}
				};
				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				service.getPrcPacMasterRestrictionInfo = function () {
					var packageHeader = service.getSelected();

					if (packageHeader) {
						var result = {
							prcConfigurationId: packageHeader.ConfigurationFk,
							prcCopyMode: packageHeader.PrcCopyModeFk,
							packageId: packageHeader.Id
						};

						var modState = platformModuleStateService.state(service.getModule());

						if (modState && modState.modifications) {
							if (angular.isArray(modState.modifications.PrcPacMasterRestrictionToSave)) {
								result.includeCatalogIds = modState.modifications.PrcPacMasterRestrictionToSave.filter(function (item) {
									return item.Version === 0 && item.MdcMaterialCatalogFk !== null;
								}).map(function (item) {
									return item.MdcMaterialCatalogFk;
								});
							}

							if (angular.isArray(modState.modifications.PrcPacMasterRestrictionToDelete)) {
								result.excludeCatalogIds = modState.modifications.PrcPacMasterRestrictionToDelete.filter(function (item) {
									return item.MdcMaterialCatalogFk !== null;
								}).map(function (item) {
									return item.MdcMaterialCatalogFk;
								});
							}
						}

						return result;
					}

					return null;
				};

				let budgetEditableInPrc = {
					editable: false,
					cacheTime: null,
					optionValue: -1
				};

				function getBudgetEditableInPrc() {
					if (budgetEditableInPrc.cacheTime !== null) {
						return budgetEditableInPrc;
					}
				}

				service.setBudgetEditableInPrc = function(editable, value) {
					budgetEditableInPrc.editable = editable;
					budgetEditableInPrc.cacheTime = new Date().getTime();
					budgetEditableInPrc.optionValue = value;
				}

				service.syncGetBudgetEditingInProcurement = function () {
					let isEditableObject = getBudgetEditableInPrc();
					if (isEditableObject !== undefined) {
						return $q.when(isEditableObject.editable);
					} else {
						service.resetBudgetEditable();
					}
				};

				service.getBudgetEditingInProcurement = function () {
					let isEditableObject = getBudgetEditableInPrc();
					if (isEditableObject !== undefined){
						return isEditableObject.editable;
					} else {
						return false;
					}
				};

				service.getBudgetEditingValueInProcurement = function () {
					let isEditableObject = getBudgetEditableInPrc();
					if (isEditableObject !== undefined){
						return isEditableObject.optionValue;
					} else {
						return -1;
					}
				};

				service.resetBudgetEditable = function(){
					return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/getbudgeteditinginprocurement')
						.then(function (response) {
							let result = _.toNumber(response.data);
							let isEditable = result === 1;
							service.setBudgetEditableInPrc(isEditable, result);
							return isEditable;
						});
				}

				var protectContractedPackageItemAssignment = {
					result: false,
					cacheTime: null
				};
				function getProtectContractedPackageItemAssignment() {
					if (protectContractedPackageItemAssignment.cacheTime !== null) {
						return protectContractedPackageItemAssignment.result;
					}
				}
				function setProtectContractedPackageItemAssignment(isProtect) {
					protectContractedPackageItemAssignment.result = isProtect;
					protectContractedPackageItemAssignment.cacheTime = new Date().getTime();
				}

				service.isProtectContractedPackageItemAssignment = function () {
					return getProtectContractedPackageItemAssignment();
				};
				service.asyncProtectContractedPackageItemAssignment = function () {
					var isProtect = getProtectContractedPackageItemAssignment();
					if (isProtect !== undefined) {
						return $q.when(isProtect);
					} else {
						return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/protectcontractedpackageitemassignment')
							.then(function (response) {
								var isProtect = response.data;
								setProtectContractedPackageItemAssignment(isProtect);
								return isProtect;
							});
					}
				};

				basicsCommonInquiryHelperService.registerEnableInspector(gridContainerGuid, service);

				let baseDoUpdate = serviceContainer.data.doUpdate;
				serviceContainer.data.doUpdate = function () {
					if (serviceContainer.data.ignoreNextSelectionChangeForUpdate) {
						serviceContainer.data.ignoreNextSelectionChangeForUpdate = false;
						return $q.when(true);
					}
					const procurementPackagePackage2HeaderService = $injector.get('procurementPackagePackage2HeaderService');
					const subPackages = procurementPackagePackage2HeaderService.getList();
					const idInfo = {
						mainItemPrcHeaderIds: subPackages.map(e => e.PrcHeaderFk)
					}
					return baseDoUpdate(serviceContainer.data, true, true)
						.then(function (result) {
							service.onLeadingServiceUpdateDone.fire(idInfo);
							return result;
						});
				};

				return service;
			}]);

})(angular);