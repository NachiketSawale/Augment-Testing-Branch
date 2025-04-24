(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.contract';
	var procurementContractModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name procurementContractHeaderDataService
	 * @function
	 * @requireds procurementContractHeaderDataService
	 *
	 * @description Provide contract header data service
	 */
	// jshint -W072
	procurementContractModule.factory('procurementContractHeaderDataService',
		['$translate', '_', '$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementCommonHelperService',
			'procurementContextService', /* 'procurementCommonTotalDataService', */ 'procurementContractHeaderFilterService',
			'cloudDesktopSidebarService', 'platformRuntimeDataService', 'ServiceDataProcessDatesExtension', 'PlatformMessenger', 'procurementContractHeaderReadonlyProcessor',
			'basicsCommonMandatoryProcessor', '$injector', 'procurementCommonPrcItemDataService', 'procurementCommonCharacteristicDataService', 'platformDataServiceModificationTrackingExtension',
			'procurementContractNumberGenerationSettingsService', '$q', 'platformModalService', 'procurementCommonCreateModuleService', 'procurementCommonHeaderTextNewDataService', '$timeout', 'platformModuleStateService',
			'contractHeaderPurchaseOrdersDataService', 'platformGridAPI', 'basicsCommonCharacteristicService', 'platformDataServiceItemFilterExtension',
			'prcCommonSplitOverallDiscountService', 'boqMainBoqTypes', 'platformDataServiceConfiguredCreateExtension', 'platformDataServiceActionExtension', 'basicsCommonInquiryHelperService','cloudCommonGridService', 'prcCommonProcessChangeVatGroupDialog',
			'procurementCommonOverrideHeaderInfoService',
			function ($translate, _, $http, dataServiceFactory, lookupDataService, basicsLookupdataLookupDescriptorService,
				procurementCommonHelperService, moduleContext, /* procurementCommonTotalDataService, */
				filterService, cloudDesktopSidebarService, runtimeDataService, ServiceDataProcessDatesExtension, PlatformMessenger, procurementContractHeaderReadonlyProcessor,
				mandatoryProcessor, $injector, procurementCommonPrcItemDataService, procurementCommonCharacteristicDataService, platformDataServiceModificationTrackingExtension,
				procurementContractNumberGenerationSettingsService, $q, platformModalService, procurementCommonCreateModuleService, procurementCommonHeaderTextNewDataService, $timeout, platformModuleStateService,
				contractHeaderPurchaseOrdersDataService, platformGridAPI, basicsCommonCharacteristicService, platformDataServiceItemFilterExtension,
				prcCommonSplitOverallDiscountService, boqMainBoqTypes, platformDataServiceConfiguredCreateExtension, platformDataServiceActionExtension, basicsCommonInquiryHelperService,cloudCommonGridService, prcCommonProcessChangeVatGroupDialog,
				procurementCommonOverrideHeaderInfoService) {

				var characteristicColumn = '';
				var service = {},
					naviHeaderFk = 0,
					onFilterLoaded = new PlatformMessenger(),
					onFilterUnLoaded = new PlatformMessenger();
				var serviceContainer;

				var createParam;
				// set filter parameter for this module
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					includeChainedItems: false,
					quotesFromSameRFQ: null,
					showOptions: true,
					showProjectContext: false, // TODO: rei remove it
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch: true
				};
				var initialDialogService = $injector.get('contractCreationInitialDialogService');
				var hasItemsOrBoqs = {
					items: false,
					prcboqs: false,
					boqitems: false
				};
				var needUpdateUcToItemsBoqs = false;
				var serviceOptions = {
					hierarchicalRootItem: {
						module: procurementContractModule,
						serviceName: 'procurementContractHeaderDataService',
						entityNameTranslationID: 'procurement.contract.contractGridTitle',
						entityInformation: {module: 'Procurement.Contract', entity: 'ConHeader', specialTreatmentService: initialDialogService},
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/contract/header/',
							endCreate: 'createcontract'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/contract/header/',
							endDelete: 'deletecontract'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/contract/header/',
							endUpdate: 'updatecontract'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/contract/header/',
							endRead: 'listcontract',
							usePostForRead: true
						},
						entityRole: {
							root: {
								itemName: 'ConHeader',
								moduleName: 'cloud.desktop.moduleDisplayNameContract',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								responseDataEntitiesPropertyName: 'Main',
								// TODO: it is just a work around to set Configuration readonly after saving a new item
								handleUpdateDone: function (updateData, response, data) {
									updateChange(updateData);
									data.handleOnUpdateSucceeded(updateData, response, data, true);
									if (response.PrcSubreferenceToDelete || response.PrcSubreferenceToSave) {
										service.contractSubContractorChanged.fire();
									}
									var currentItem = _.find(data.getList(), {Id: updateData.MainItemId});
									if (currentItem) {
										service.updateReadOnly(currentItem, 'PrcHeaderEntity.ConfigurationFk');
										service.onParentUpdated.fire();

										// set basis contract as readOnly when it has items
										var itemDataService = $injector.get('procurementCommonPrcItemDataService').getService(service);
										var items = itemDataService.getList();
										currentItem.HasItems = false;
										if (items && items.length !== 0) {
											currentItem.HasItems = true;
										}
										if (response.ConHeader && response.ConHeader.Id === currentItem.Id) {
											response.ConHeader.HasItems = currentItem.HasItems;
										}
										service.updateFieldsReadOnly(currentItem,
											['ProjectChangeFk', 'ContractHeaderFk'],
											currentItem.HasItems, 'HasItems');

										service.maintainBoqMainLookupFilter(currentItem);
										if ((updateData.HeaderPparamToSave && updateData.HeaderPparamToSave.length) ||
											((updateData.HeaderPparamToDelete && updateData.HeaderPparamToDelete.length))
										) {
											itemDataService.load();
										}
									}

									// for ALM(#92196),if user overwrites line no to a line no alredy used in the basis contract or a previous change order
									// then MDC_MATERIAL_FK, PRC_STRUCTURE_FK, DESCRIPTION1, DESCRIPTION2, BAS_UOM_FK must be taken from the previous line and set to read only10
									var selectedContract = service.getSelected();
									if (!_.isNil(selectedContract)) {
										var conHeaderFk = service.getSelected().ContractHeaderFk;
										if (conHeaderFk) {
											$http({
												method: 'GET',
												url: globals.webApiBaseUrl + 'procurement/common/prcitem/getprcitemsbyheader',
												params: {
													conHeaderFk: conHeaderFk
												}
											}).then(function (response) {
												if (response && response.data) {
													var parentPreviousItems = response.data;
													angular.forEach(items, function (item) {
														var existingItem = parentPreviousItems.findIndex(function (o) {
															return o.Id !== item.Id && o.Itemno === item.Itemno;
														});
														if (existingItem !== -1) {
															setItemReadonly(item, true);
														}
													});
												}
											});
											if (updateData.PrcItemToSave || updateData.PrcItemToDelete) {
												service.getHeaderContract();
											}
										}
									}

									if (currentItem) {
										var selectItem = service.getSelected();
										if (selectItem && currentItem.Id !== selectItem.Id) {
											service.maintainBoqMainLookupFilter(selectItem);
										} else {
											service.maintainBoqMainLookupFilter(currentItem);
										}
									}
								},
								showProjectHeader: {
									getProject: function (entity) {
										if (!entity || !entity.ProjectFk) {
											return null;
										}
										return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
									}
								}
							}
						},
						presenter: {
							tree: {
								parentProp: 'ConHeaderFk',
								childProp: 'ChildItems',
								initialState: 'expanded',
								incorporateDataRead: function (readData, data) {
									var result = serviceContainer.data.handleReadSucceeded(readData, data);
									var exist = platformGridAPI.grids.exist('e5b91a61dbdd4276b3d92ddc84470162');
									if (exist) {
										var characterColumnService = service.characterColumnService();
										var allList=getContractList(readData.dtos);
										characterColumnService.appendCharacteristicCols(allList);
									}
									return result;
								},

								handleCreateSucceeded: function (item) {
									// Contract characteristic1 SectionId = 8;
									// Contract characteristic2 SectionId = 46;
									// configuration characteristic1 SectionId = 32;
									// configuration characteristic2 SectionId = 55;
									// structure characteristic1 SectionId = 9;
									// structure characteristic2 SectionId = 54;
									basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, item, 8, 46, 32, 55, 9, 54);
									var exist = platformGridAPI.grids.exist('e5b91a61dbdd4276b3d92ddc84470162');
									if (exist) {
										var characterColumnService = service.characterColumnService();
										characterColumnService.appendDefaultCharacteristicCols(item);
									}
								},
								initCreationData: function initCreationData(creationData) {
									creationData.ProjectFk = moduleContext.loginProject;
									creationData.ConfigurationFk = createParam.ConfigurationFk;
									creationData.Code = createParam.Code;

									creationData.BusinessPartnerFk = createParam.BusinessPartnerFk;
									creationData.ContactFk = createParam.ContactFk;
									creationData.SubsidiaryFk = createParam.SubsidiaryFk;
									creationData.SupplierFk = createParam.SupplierFk;

									createParam = {};
								}/* ,

                                 sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true} */
							}
						},
						dataProcessor: [procurementContractHeaderReadonlyProcessor, {
							processItem: angular.noop,
							revertProcessItem: revertProcessContract
						}, new ServiceDataProcessDatesExtension(['DateOrdered', 'DateReported', 'DateCanceled', 'DateDelivery', 'DateCallofffrom', 'DateCalloffto', 'DateQuotation', 'ConfirmationDate', 'DatePenalty', 'DateEffective', 'ExecutionStart', 'ExecutionEnd', 'ValidFrom', 'ValidTo'])],
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						entitySelection: {},
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: 'procurement.contract',
								getSelectedItemsFn: getSelectedItems,
								getResultsSetFn: getResultsSet
							}
						},
						filterByViewer: true,
						actions: {
							delete: {}, create: 'flat',
							canDeleteCallBackFunc: function (item) {
								if (item.ConStatus) {
									if (item.Version === 0) {
										return true;
									} else {
										return !item.ConStatus.IsReadonly;
									}
								}
								return true;
							}
						}
					}
				};

				// dto is tree,need get list
				function getContractList(dtos){
					let contractList=[];
					cloudCommonGridService.flatten(dtos, contractList, 'ChildItems');
					return contractList;
				}

				function updateChange(updateData) {
					if (updateData.ChangeToDelete && updateData.ChangeToDelete.length > 0) {
						$http.post(globals.webApiBaseUrl + 'change/main/multidelete', updateData.ChangeToDelete);
					}
					if (updateData.ChangeToSave && updateData.ChangeToSave.length > 0) {
						$http.post(globals.webApiBaseUrl + 'change/main/update', {Change: updateData.ChangeToSave}).then(function (response) {
							if (response.data && response.data.Change && response.data.Change.length > 0) {
								var changeDataService = $injector.get('changeMainContractChangeDataService');
								var changes = changeDataService.getList();
								var selectedEntity = changeDataService.getSelected();
								var isExist = _.find(response.data.Change, function (item) {
									return _.find(changes, {Id: item.Id});
								});
								if (isExist) {
									var entity = _.find(response.data.Change, {Id: selectedEntity.Id});
									if (entity) {
										selectedEntity = entity;
									}
									changeDataService.load().then(function () {
										changeDataService.setSelected(selectedEntity);
									});
								}
							}
						});
					}
				}

				function revertProcessContract(item) {
					var rubricIndex = service.getRubricIndex(item);
					if (item.Version === 0 && procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk, rubricIndex)) {
						item.Code = 'IsGenerated';
					}
				}

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				service.totalFactorsChangedEvent = new PlatformMessenger();
				service.exchangeRateChanged = new PlatformMessenger();
				// service.contractHeaderFKChange=new PlatformMessenger();
				service.taxCodeFkChanged = new PlatformMessenger();
				service.projectFkChanged = new PlatformMessenger();
				service.completeItemCreated = new PlatformMessenger();
				service.onParentUpdated = new PlatformMessenger();
				service.taxMaterialCatalogFkChanged = new PlatformMessenger();
				service.basisChanged = new PlatformMessenger();
				service.selectedContractStatusChanged = new PlatformMessenger();
				service.isProcurementModule = true;
				service.targetSectionId = 8;
				service.BillingSchemaChanged = new PlatformMessenger();
				service.vatGroupChanged = new PlatformMessenger();
				service.onRecalculationItemsAndBoQ = new PlatformMessenger();
				service.configurationChanged = new PlatformMessenger();
				service.frameworkMdcCatalogChanged = new PlatformMessenger();
				service.isFrameworkChanged = new PlatformMessenger();
				service.controllingUnitChanged = new PlatformMessenger();
				service.controllingUnitToItemBoq = new PlatformMessenger();
				service.changeStructureSetTaxCodeToItemBoq = new PlatformMessenger();
				service.contractSubContractorChanged = new PlatformMessenger();
				/* function update() {
                    platformDataServiceModificationTrackingExtension.getModifications(service);
                    service.update();
                } */

				moduleContext.init();
				/* var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(service, service.targetSectionId); */
				basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 8, 46);

				function reloadHeaderText(item, options) {
					var headerTextDataService = procurementCommonHeaderTextNewDataService.getService(service);
					headerTextDataService.reloadData({
						prcHeaderId: item.PrcHeaderEntity.Id,
						prcConfigurationId: item.PrcHeaderEntity.ConfigurationFk,
						projectId: item.ProjectFk,
						isOverride: options !== null && !angular.isUndefined(options) ? options.isOverride : false
					});
				}

				service.reloadHeaderText = reloadHeaderText;

				var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
				serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
					var conHeaderCreated = created.ConHeaderDto || created;
					$timeout(function () {
						reloadHeaderText(conHeaderCreated);
					}, 500);
					procurementContractNumberGenerationSettingsService.assertLoaded().then(function () {
						var rubricIndex = service.getRubricIndex(conHeaderCreated);
						var hasToGenerate = procurementContractNumberGenerationSettingsService.hasToGenerateForRubricCategory(conHeaderCreated.RubricCategoryFk, rubricIndex);
						runtimeDataService.readonly(conHeaderCreated, [{
							field: 'Code',
							readonly: hasToGenerate
						}]);
						if (hasToGenerate) {
							conHeaderCreated.Code = $translate.instant('cloud.common.isGenerated');
						}
					});

					runtimeDataService.readonly(conHeaderCreated, [{field: 'BankFk', readonly: true}]);
					// data.selectedItem = conHeaderCreated;
					/** @namespace conHeaderCreated */
					// noinspection UnnecessaryLocalVariableJS
					/** @namespace created.PrcTotalsDto */
					var result = onCreateSucceeded.call(serviceContainer.data, conHeaderCreated, data, creationData).then(function () {
						service.completeItemCreated.fire(null, {
							mainItem: conHeaderCreated,
							totalItems: created.PrcTotalsDto,
							Generals:created.PrcGeneralsDto,
							Certificates:created.PrcCertificateDto
						});

						if (created.Version === 0 && creationData.parent) {
							var validationService = $injector.get('contractHeaderElementValidationService');
							$timeout(function () {
								validationService.overWriteGeneralsAndCertificates(creationData.parent, created);
							}, 500);
						}
						// var sourceHeaderId = service.getConfigurationFk(conHeaderCreated);
						// var onEntityParentCreatedForPrcModule = procurementCommonCharacteristicDataService.createMethod(service.targetSectionId, sourceHeaderId, service.isSavedImmediately, update);
						// onEntityParentCreatedForPrcModule(null, conHeaderCreated);
						service.markCurrentItemAsModified();// when create done the set selected will call by grid which will make selection changed and do clear all modifications.
					});
					return result;
				};

				service.getHeaderContract = function getHeaderContract() {
					const seleted = service.getSelected();
					const entity = _.find(service.getList(), { Id: seleted.Id });
					if (!entity || !entity.ConHeaderFk) {
						return;
					}
					const conHeaderId = entity.ConHeaderFk;
					$http.get(globals.webApiBaseUrl + 'procurement/contract/header/get?id=' + conHeaderId).then(function(result) {
						_.forEach(serviceContainer.data.itemList, function(item) {
							if (item.Id === conHeaderId) {
								item = result.data;
							}
						});
						let treeEntity = _.find(serviceContainer.data.itemTree, { Id: seleted.Id });
						let resultEntity = _.find(result.data.ChildItems, { Id: seleted.Id });
						if (resultEntity && treeEntity) {
							const indexId = serviceContainer.data.itemTree.indexOf(treeEntity);
							serviceContainer.data.itemTree.splice(indexId, 1);
						}
						_.forEach(serviceContainer.data.itemTree, function(item) {
							if (item.Id === conHeaderId) {
								item.ChildItems = result.data.ChildItems;
							}
						});
						let itemListOriginal = [];
						serviceContainer.data.flatten(serviceContainer.data.itemTree, itemListOriginal, serviceContainer.data.treePresOpt.childProp);

						service.gridRefresh();
					});
				};

				service.getDefaultListForCreated = function getDefaultListForCreated(targetSectionId, configrationSectionId, structureSectionId, newData) {
					var deferred = $q.defer();
					var sourceHeaderId = newData.Version === 0 ? newData.PrcHeaderEntity.ConfigurationFk : service.getConfigurationFk();
					if (!sourceHeaderId) {
						sourceHeaderId = newData.PrcHeaderEntity.ConfigurationFk;
					}
					procurementCommonCharacteristicDataService.getDefaultListForCreated(targetSectionId, sourceHeaderId, configrationSectionId, structureSectionId, newData).then(function (defaultItem) {
						if (defaultItem) {
							deferred.resolve(defaultItem);
						}
					});
					return deferred.promise;
				};
				// filter events

				service.registerFilterLoad = function (func) {
					onFilterLoaded.register(func);
				};

				service.registerFilterUnLoad = function (func) {
					onFilterUnLoaded.register(func);
				};

				service.allHeaderData = [];

				service.name = moduleName;
				/* procurementCommonTotalDataService.getService(service); */

				// filters register and un-register, it will call by the contract-module.js
				service.registerFilters = function () {
					filterService.registerFilters();
					onFilterLoaded.fire(moduleName);
				};

				// unload filters
				service.unRegisterFilters = function () {
					filterService.unRegisterFilters();
					onFilterUnLoaded.fire(moduleName);
				};

				service.getSelectedProjectId = function getSelectedProjectId() {
					var item = service.getSelected();
					if (item && angular.isDefined(item.Id)) {
						return item.ProjectFk;
					}
					return -1;
				};
				service.getConfigurationFk = function getConfigurationFk() {
					if (service.getSelected()) {
						return service.getSelected().PrcHeaderEntity.ConfigurationFk;
					}
				};
				// TODO: it is just a work around to reuse the onReadSucceeded in dataServiceFactory
				var onReadSucceeded = serviceContainer.data.onReadSucceeded;
				serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					basicsLookupdataLookupDescriptorService.loadData('BasAccassignAccType');
					service.allHeaderData = readData.Main;
					var dataRead = onReadSucceeded({
						dtos: readData.Main,
						FilterResult: readData.FilterResult
					},
					data);
					angular.forEach(readData.Main, function (item) {
						service.setEntityReadOnly(item);
					});
					if (naviHeaderFk > 0) {
						var select = _.find(service.getList(), function (k) {
							return naviHeaderFk === k.Id;
						});
						service.setSelected(select);
					}
					naviHeaderFk = 0;
					serviceContainer.service.goToFirst();
					return dataRead;
				};

				var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

				service.maintainBoqMainLookupFilter = function maintainBoqMainLookupFilter(selectedContract) {
					var leadingService = moduleContext.getLeadingService();
					if (!(leadingService && angular.isFunction(leadingService.getItemName) && leadingService.getItemName() === 'ConHeader')) {
						return;
					}

					var boqMainLookupFilterService = $injector.get('boqMainLookupFilterService');

					if (!boqMainLookupFilterService.getIsSourceBoqContainerCreated()) {
						return;
					}

					if (!_.isObject(selectedContract)) {
						return;
					}

					let boqType = 1;
					if (!selectedContract.IsFreeItemsAllowed && !selectedContract.IsFramework && (selectedContract.BoqWicCatFk || selectedContract.MaterialCatalogFk)) {
						boqMainLookupFilterService.boqTypeReadonly.fire(true);
						if (boqMainLookupFilterService.boqHeaderLookupFilter.boqType !== boqType) {
							boqMainLookupFilterService.boqTypeChanged.fire(boqType);
						}
						service.boqFilterSettingChanged.fire(boqType);
						return;
					}

					var copyMode = selectedContract.PrcCopyModeFk;
					var deferred = $q.defer();
					var packageIdsPromise = deferred.promise;

					if (_.isNumber(selectedContract.PackageFk) && selectedContract.PackageFk > 0) {
						packageIdsPromise = $q.when([selectedContract.PackageFk]);
					} else {
						// Look for package assignments of the related requisition.
						// This can be multiple assignments.

						$injector.get('basicsLookupdataLookupDataService').getSearchList('quote', 'Code="' + (selectedContract && selectedContract.CodeQuotation) + '"').then(function (quote) {
							var quoteId = null;
							var packIds = null;
							if (quote&&_.isArray(quote.items) && quote.items.length > 0) {
								quoteId = quote.items[0].Id;
								if (_.isNumber(quoteId) && quoteId > 0) {
									// The procurementQuoteRequisitionDataService could not be used.
									// When using its read function an client side exception was thrown.
									// So the direct call to the api is used.
									$http.get(globals.webApiBaseUrl + 'procurement/quote/requisition/list?mainItemId=' + quoteId).then(function (result) {
										if (_.isObject(result) && _.isObject(result.data) && _.isArray(result.data.ReqHeaderLookupView) && result.data.ReqHeaderLookupView.length > 0) {
											packIds = _.map(result.data.ReqHeaderLookupView, 'PrcPackageFk');
											deferred.resolve(packIds);
										} else {
											deferred.resolve([]);
										}
									});
								} else {
									deferred.resolve([]); // No quote Id -> no package ids
								}
							} else {
								deferred.resolve([]); // No quote -> no package ids
							}
						});
					}

					if (_.isNumber(copyMode)) {
						// The copy mode currently has three valid values, i.e.:
						// 1: no restrictions
						// 2: current package only
						// 3: only allowed catalogs
						// 4: no restrictions for standard user
						// -> in case of 2, we currently set the boq type of the selectable boqs type in the
						// boqMainLookupFilterService to readonly and set the displayed value accordingly
						boqMainLookupFilterService.boqTypeReadonly.fire(copyMode === 2);
						boqMainLookupFilterService.projectReadonly.fire(copyMode === 2);
						if (copyMode === 2) {
							// Current package only
							packageIdsPromise.then(function (packageIds) {
								boqType = 4;
								if (boqMainLookupFilterService.boqHeaderLookupFilter.boqType !== boqType) {
									boqMainLookupFilterService.boqTypeChanged.fire(boqType);
								}
								service.boqFilterSettingChanged.fire(boqType);
								boqMainLookupFilterService.setSelectedPackageIds(packageIds);
							});
						} else if (copyMode === 1 || copyMode === 3 || copyMode === 4) {
							// No restrictions or No restrictions for standard user in standard mode
							boqType = boqMainLookupFilterService.boqTypeListChanged.fire();
							if (boqMainLookupFilterService.boqHeaderLookupFilter.boqType !== boqType) {
								boqMainLookupFilterService.boqTypeChanged.fire(boqType);
							}
							service.boqFilterSettingChanged.fire(boqType);
						}
					}
				};

				service.registerSelectionChanged(function setFilter() {
					var currentItem = service.getSelected();

					if (currentItem && currentItem.Id) {
						moduleContext.exchangeRate = currentItem.ExchangeRate;
						service.setEntityReadOnly(currentItem);
						moduleContext.setModuleStatus(service.getModuleState(currentItem));

						service.maintainBoqMainLookupFilter(currentItem);

					} else {
						moduleContext.setModuleStatus({IsReadonly: true});
					}
					service.hasItemsOrBoqs({});

					$timeout(function () {
						service.selectedContractStatusChanged.fire(moduleContext.getModuleStatus());
					}, 500);

					procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNameContract');
				});

				let changeVatGroupRecalBoqAndItemDialogId = $injector.get('platformCreateUuid')();
				service.cellChange = function (entity, field) {
					if (field === 'BpdVatGroupFk') {
						prcCommonProcessChangeVatGroupDialog.showAskDialog(moduleName, service, serviceContainer.data, entity, changeVatGroupRecalBoqAndItemDialogId, function recalculateAfterChangeVatGroupInCon() {
							$http.get(globals.webApiBaseUrl + 'procurement/common/boq/RecalculationBoQ?headerId=' + entity.Id + '&vatGroupFk=' + entity.BpdVatGroupFk + '&sourceType=contract' + '&taxCodeFk=' + entity.TaxCodeFk).then(function () {
								service.onRecalculationItemsAndBoQ.fire();
							});
						});
					}
				};

				service.isChangeHeader = function (boqItem) {
					var baseBoqItem = _.indexOf(service.parentBoqItems, boqItem.BoqItemPrjItemFk);
					// eslint-disable-next-line eqeqeq
					return service.getSelected() && service.getSelected().ConHeaderFk !== null &&
						service.getSelected().ConHeaderFk > 0 && baseBoqItem >= 0; // if is change order and the base req have this item, readonly
				};

				service.isFrameworkContractCallOffByWic = function () {
					var selected = service.getSelected();
					return contractHeaderPurchaseOrdersDataService.isFrameworkContractCallOffByWic(selected);
				};

				service.isFrameworkContractCallOffByMdc = function () {
					var selected = service.getSelected();
					return contractHeaderPurchaseOrdersDataService.isFrameworkContractCallOffByMdc(selected);
				};

				service.parentBoqItems = [];
				service.getParentBoqItems = function () {
					if (service.getSelected() && service.getSelected().ConHeaderFk !== null && service.getSelected().ConHeaderFk > 0) {
						$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqitemsbymodule?module=3&headerId=' + service.getSelected().ConHeaderFk).then(function (result) {
							service.parentBoqItems = result.data;
						});
					}
				};

				// -------------- check and update package from baseline ----------------------- start

				service.checkCOContractIsChangedInBaseline = function (entity) {
					return $http.post(globals.webApiBaseUrl + 'procurement/contract/baseline/checkcocontractischanged', entity)
						.then(function (response) {
							return response.data;
						});
				};

				service.checkAndUpdateCOContractFromBaseLine = function (entity) {
					return $http.post(globals.webApiBaseUrl + 'procurement/contract/baseline/checkandupdatecocontract', entity)
						.then(function (response) {
							return response.data;
						});
				};
				service.showBlockDialog = new PlatformMessenger();
				service.closeBlockDialog = new PlatformMessenger();
				service.checkingContracts = [];
				service.existsCheckingContractId = function (id) {
					return _.findIndex(service.checkingContracts, function (n) {
						return n === id;
					}) !== -1;
				};
				service.setCheckingContractId = function (id) {
					service.checkingContracts.push(id);
				};
				service.removeCheckingContractId = function (id) {
					var idx = _.findIndex(service.checkingContracts, function (n) {
						return n === id;
					});
					if (idx !== -1) {
						service.checkingContracts.splice(idx, 1);
					}
				};
				service.refreshContracts = [];
				service.hasRefreshContracts = function () {
					return service.refreshContracts && service.refreshContracts.length > 0;
				};
				service.existsRefreshContractId = function (id) {
					return _.findIndex(service.refreshContracts, function (n) {
						return n === id;
					}) !== -1;
				};
				service.setRefreshContractId = function (id) {
					service.refreshContracts.push(id);
				};
				service.removeRefreshContractId = function (id) {
					var idx = _.findIndex(service.refreshContracts, function (n) {
						return n === id;
					});
					if (idx !== -1) {
						service.refreshContracts.splice(idx, 1);
					}
				};

				var isShowMessageboxCache = {
					show: null,
					cacheTime: null
				};
				service.isShowContractAutoUpdateMessagebox = function () {
					var show = getOptionForMessageBox();
					if (show !== undefined) {
						return $q.when(show);
					} else {
						return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isshowcontractautoupdatemessagebox')
							.then(function (response) {
								var show = response.data;
								setOptionForMessageBox(show);
								return show;
							});
					}
				};

				function getOptionForMessageBox() {
					if (isShowMessageboxCache.cacheTime !== null) {
						return isShowMessageboxCache.show;
					}
				}

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

				// -------------- check and update package from baseline ----------------------- end

				/**
				 * @ngdoc function
				 * @name getCellEditable
				 * @function
				 * @methodOf procurement.contract.procurementContractHeaderDataService
				 * @description get editable of model
				 * @returns bool
				 */
				/* jshint -W074 */ // The complexly warning is not need, logic in method is simple and readable
				service.getCellEditable = function (item, model) {
					var editable = true, state;
					if (angular.isDefined(item)) {

						// check is editable
						state = service.getModuleState(item);
						if (state && state.IsReadonly) {
							return false;
						}
						editable = procurementContractHeaderReadonlyProcessor.getIsEditalbeByField(item, model);
					}
					return editable;
				};

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns IsReadonly {Isreadonly:true|false}
				 */
				service.getModuleState = function getModuleState(item) {
					var state, status, parentItem = item || service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('ConStatus');
					if (parentItem && parentItem.ConStatusFk) {
						state = _.find(status, {Id: parentItem.ConStatusFk});
					} else {
						if(parentItem && _.isNil(parentItem.ConStatusFk) && parentItem.Version === 0){
							state = {IsReadonly: false};
						}else{
							state = {IsReadonly: true};
						}

					}
					return state;
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
					var itemStatus = self.getItemStatus(entity); // jshint ignore:line
					var readOnlyStatus = false;
					if (itemStatus) {
						readOnlyStatus = itemStatus.IsReadonly;
					}
					if (readOnlyStatus) {
						return;
					}

					var prcConfigurations = basicsLookupdataLookupDescriptorService.getData('prcconfiguration');
					service.updateFieldsReadOnly(entity,
						['ExchangeRate', 'TaxCodeFk', 'BusinessPartnerFk', 'ContactFk', 'SubsidiaryFk', 'SupplierFk',
							'IncotermFk', 'ProjectChangeFk', 'PrcHeaderEntity.ConfigurationFk', 'Code']);
					// #109234  whether the main contract has value or not, those columns should be editable
					runtimeDataService.readonly(entity, [{field: 'ContracttypeFk', readonly: false}]);
					runtimeDataService.readonly(entity, [{field: 'PaymentTermFiFk', readonly: false}]);
					runtimeDataService.readonly(entity, [{field: 'PaymentTermPaFk', readonly: false}]);
					runtimeDataService.readonly(entity, [{field: 'PaymentTermAdFk', readonly: false}]);
					runtimeDataService.readonly(entity, [{field: 'IncotermFk', readonly: false}]);
					runtimeDataService.readonly(entity, [{field: 'PrcCopyModeFk', readonly: false}]);

					if (entity.ConHeaderFk !== null) {
						runtimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'PackageFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'SupplierFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'ContactFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'CompanyInvoiceFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'ContracttypeFk', readonly: true}]);
					} else {
						runtimeDataService.readonly(entity, [{field: 'ProjectFk', readonly: false}]);
						runtimeDataService.readonly(entity, [{field: 'PackageFk', readonly: false}]);
						runtimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: false}]);
						runtimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: false}]);
						runtimeDataService.readonly(entity, [{field: 'SupplierFk', readonly: false}]);
						runtimeDataService.readonly(entity, [{field: 'ContactFk', readonly: false}]);
						runtimeDataService.readonly(entity, [{field: 'CompanyInvoiceFk', readonly: false}]);
					}

					if (entity.ConHeaderFk) {
						runtimeDataService.readonly(entity, [{field: 'IncotermFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'PaymentTermFiFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'PaymentTermPaFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'PaymentTermAdFk', readonly: true}]);
					}

					if (entity.MaterialCatalogFk || entity.BoqWicCatFk) {
						runtimeDataService.readonly(entity, [{field: 'BusinessPartnerFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: true}]);
						runtimeDataService.readonly(entity, [{field: 'SupplierFk', readonly: true}]);
					}
					// CON_HEADER_FK and PRJ_CHANGE_FK is only editable while no item exists
					if (entity.HasItems || entity.IsFramework) {
						runtimeDataService.readonly(entity, [{field: 'ProjectChangeFk', readonly: true}]);
					} else {
						runtimeDataService.readonly(entity, [{field: 'ProjectChangeFk', readonly: false}]);
					}
					if (entity.HasItems || entity.MaterialCatalogFk || entity.BoqWicCatFk || entity.IsFramework) {
						runtimeDataService.readonly(entity, [{field: 'ContractHeaderFk', readonly: true}]);
					} else {
						runtimeDataService.readonly(entity, [{field: 'ContractHeaderFk', readonly: false}]);
					}

					if (entity.ConHeaderFk !== null && entity.ProjectChangeFk === null) {
						runtimeDataService.readonly(entity, [{field: 'ContactFk', readonly: false}]);
					}

					// #99136 - Call Off Type Contract Update
					var isCallOff = contractHeaderPurchaseOrdersDataService.isCallOff(entity);
					runtimeDataService.readonly(entity, [{field: 'BasCurrencyFk', readonly: isCallOff}]);

					// #109234 - not readonly when main contract is set
					if (entity.ConHeaderFk !== null) {
						runtimeDataService.readonly(entity, [{field: 'ProjectChangeFk', readonly: false}]);
					} else {
						runtimeDataService.readonly(entity, [{field: 'ProjectChangeFk', readonly: true}]);
					}
					runtimeDataService.readonly(entity, [{field: 'MaterialCatalogFk', readonly: true}]);
					runtimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: true}]);
					runtimeDataService.readonly(entity, [{field: 'BoqWicCatBoqFk', readonly: true}]);
					if (!entity.ContractHeaderFk) {
						if (_.has(entity, 'PrcHeaderEntity.ConfigurationFk') && prcConfigurations && prcConfigurations[entity.PrcHeaderEntity.ConfigurationFk] && prcConfigurations[entity.PrcHeaderEntity.ConfigurationFk].IsMaterial && !isCallOff && !entity.IsFramework) {
							runtimeDataService.readonly(entity, [{field: 'MaterialCatalogFk', readonly: false}]);
						}
						if (_.has(entity, 'PrcHeaderEntity.ConfigurationFk') && prcConfigurations && prcConfigurations[entity.PrcHeaderEntity.ConfigurationFk] && prcConfigurations[entity.PrcHeaderEntity.ConfigurationFk].IsService && !entity.IsFramework) {
							runtimeDataService.readonly(entity, [{field: 'BoqWicCatFk', readonly: false}]);
							if (entity.BoqWicCatFk) {
								runtimeDataService.readonly(entity, [{field: 'BoqWicCatBoqFk', readonly: false}]);
							}
						}
					}

					runtimeDataService.readonly(entity, [{field: 'BankFk', readonly: !entity.BusinessPartnerFk}]);
				};

				// add update done event.
				var basUpdateSucceeded = serviceContainer.data.onUpdateSucceeded, leadingUpdateDone = new PlatformMessenger();
				serviceContainer.data.onUpdateSucceeded = function doUpdate() {
					var result = basUpdateSucceeded.apply(this, arguments);
					leadingUpdateDone.fire(null, {leadingService: service});
					service.showModuleHeaderInformation();
					refreshHeaderConHeaderContract();
					service.clearUpdateData();
					return result;
				};

				function refreshHeaderConHeaderContract() {
					let selectedItem = service.getSelected();
					if (selectedItem) {
						var conHeaderId = selectedItem.ConHeaderFk;
						if (conHeaderId) {
							service.getHeaderContract();
						}
					}
				}

				service.registerUpdateDone = function registerUpdateDone(handler) {
					leadingUpdateDone.register(handler);
				};
				service.unregisterUpdateDone = function unregisterUpdateDone(handler) {
					leadingUpdateDone.unregister(handler);
				};

				// add refresh done event.
				var basReadData = serviceContainer.data.doReadData, leadingRefreshDone = new PlatformMessenger();
				serviceContainer.data.doReadData = function doReadData() {
					return basReadData.apply(this, arguments).then(function () {
						leadingRefreshDone.fire(null, {leadingService: service});
						service.maintainBoqMainLookupFilter(service.getSelected());
					});
				};

				// Fix important issue https://rib-40.atlassian.net/browse/DEV-27373
				// Disable the following code added by Wei, because it will cause the issue that the item list will be empty
				// Wei need to create a task to follow up relevant feature in the future.
				// service.getList = function getList() {
				// 	var itemList = serviceContainer.data.itemList;
				// 	itemList = _.filter(itemList, {IsSearchItem: true});
				// 	serviceContainer.data.itemList = itemList;
				// 	if (serviceContainer.data.itemFilterEnabled) {
				// 		return platformDataServiceItemFilterExtension.filterList(serviceContainer.data);
				// 	}
				//
				// 	return serviceContainer.data.itemList;
				// };

				service.registerRefreshDone = function registerUpdateDone(handler) {
					leadingRefreshDone.register(handler);
				};
				service.unregisterRefreshDone = function unregisterUpdateDone(handler) {
					leadingRefreshDone.unregister(handler);
				};

				service.updateDeliveryDateToItem = function updateDeliveryDateToItem(entityToItem) {
					return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/updateDeliveryDateToItem', entityToItem);
				};

				// TODO It's just a workaround for create project suceesfully
				createParam = {};
				var baseCreateItem = service.createItem;
				service.createItem = function createItem() {
					if (platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)) {
						return platformDataServiceConfiguredCreateExtension.createByConfiguredDialog(platformDataServiceActionExtension, serviceContainer.data);
					} else {
						procurementCommonCreateModuleService.showEditDialog(moduleName).then(function (params) {
							createParam = params;
							baseCreateItem();
						});
					}
				};

				// add deep copy function
				service.createDeepCopy = function createDeepCopy() {
					var selectItem = service.getSelected();
					$http.post(globals.webApiBaseUrl + 'procurement/contract/header/deepcopy', selectItem)
						.then(function (response) {
							serviceContainer.data.handleOnCreateSucceeded(response.data.ConHeader, serviceContainer.data);
							if (response.data.ConHeader.ConHeaderFk !== null) {
								var sublist = service.getList();
								var parentItem = _.find(sublist, {Id: response.data.ConHeader.ConHeaderFk});
								parentItem.HasChildren = true;
								if (parentItem.ChildItems === null) {
									parentItem.ChildItems = [];
								}
								parentItem.ChildItems.push(response.data.ConHeader);
								service.gridRefresh();
								var callOffService = $injector.get('procurementContractCallOffsDataService');
								if (callOffService) {
									callOffService.load();
								}
							}
						},
						function (/* error */) {
						});
				};

				service.createChangeOrder = function createChangeOrder() {
					var itemSelected = service.getSelected();
					if (itemSelected) {
						var conHeaderId = itemSelected.ConHeaderFk ? itemSelected.ConHeaderFk : itemSelected.Id;
						$http.get(globals.webApiBaseUrl + 'procurement/contract/change/getchangeid?mainItemId=' + conHeaderId).then(function (response) {
							if (response.data === null) {
								platformModalService.showMsgBox($translate.instant('procurement.contract.createChangeNotFound'), 'Issue', 'ico-info');
							} else {
								$http.post(globals.webApiBaseUrl + 'procurement/contract/change/create',
									{mainItemId: conHeaderId}).then(function (response) {
									if (response && response.data) {
										serviceContainer.data.handleOnCreateSucceeded(response.data, serviceContainer.data);
										addToChildItems(response.data);
									}
								});
							}
						});
					}
				};
				service.createCallOff = function createCallOff() {
					var itemSelected = service.getSelected();
					if (itemSelected) {
						var conHeaderId = itemSelected.ConHeaderFk ? itemSelected.ConHeaderFk : itemSelected.Id;
						$http.post(globals.webApiBaseUrl + 'procurement/contract/callOffs/create',
							{mainItemId: conHeaderId}).then(function (response) {
							if (response && response.data) {
								serviceContainer.data.handleOnCreateSucceeded(response.data, serviceContainer.data);
								addToChildItems(response.data);
								var callOffService = $injector.get('procurementContractCallOffsDataService');
								if (callOffService) {
									callOffService.load();
								}
							}
						});
					}
				};

				function addToChildItems(newItem) {
					if (newItem.ConHeaderFk) {
						_.forEach(service.getTree(), function (item) {
							if (item.Id === newItem.ConHeaderFk) {
								item.HasChildren = true;
								if (item.ChildItems === null) {
									item.ChildItems = [];
								}
								item.ChildItems.push(newItem);
								service.gridRefresh();
							}
						});
					}
				}

				serviceContainer.data.handleOnDeleteSucceeded = function handleOnDeleteSucceeded(deleteParams) {
					if (deleteParams.entity && deleteParams.entity.ConHeaderFk) {
						let conHeader = _.find(service.getTree(), {Id: deleteParams.entity.ConHeaderFk});
						if (conHeader) {
							conHeader.ChildItems = _.filter(conHeader.ChildItems, function (item) {
								return item.Id !== deleteParams.entity.Id;
							});
							service.gridRefresh();
						}
					}
				};

				// load lookup items, and cache in front end.
				basicsLookupdataLookupDescriptorService.loadData(['packageStatus', 'prcconfiguration', 'prcconfig2strategy', 'constatus', 'PrcConfigHeader', 'ConHeader2BoqWicCatBoq']);

				procurementCommonHelperService.registerNavigation(serviceContainer.data.httpReadRoute, {
					moduleName: 'procurement.contract',
					getNavData: function getNavData(item, triggerField) {
						/** @namespace item.Contract2PackageData */
						if (item && triggerField === 'Id') {
							if (_.isObject(item)) {
								return item[triggerField];
							}
							if (_.isString(item)) {
								return parseInt(item);
							}
						} else if (item && triggerField === 'Code') {
							let Code = '';
							if (_.isObject(item)) {
								Code = item[triggerField];
							} else if (_.isString(item)) {
								Code = item;
							}
							return $http.get(serviceContainer.data.httpReadRoute + 'getitembyCode?code=' + Code).then(function (response) {
								if (!response || !response.data) {
									return [];
								} else {
									return response.data;
								}
							});
						} else if (triggerField === 'PriceComparisonNavBtn') {
							// from price comparison navigate button
							// item is rfq entity.
							return $http.post(serviceContainer.data.httpReadRoute + 'navigation',
								{From: 'PriceComparisonNavBtn', RfqId: item.Id}).then(function (response) {
								return (response.data);
							});
						} else if (triggerField === 'QuoteNavBtn') {
							// from quote navigate button
							// item is quote entity.
							return $http.post(serviceContainer.data.httpReadRoute + 'navigation',
								{From: 'QuoteNavBtn', QuoteCode: item.Code}).then(function (response) {
								return (response.data);
							});
						} else if (triggerField === 'PesNavBtn') {
							// from pes navigate button
							// item is pes entity.

							return item.ConHeaderFk;

						} else if (triggerField === 'FrameworkConHeaderFk') {
							return item.FrameworkConHeaderFk;
						} else if (angular.isDefined(item.ContractHeaderFk)) {
							return item.ContractHeaderFk !== null ? item.ContractHeaderFk : -1;
						} else if (angular.isDefined(item.Contract2PackageData) && item.Contract2PackageData &&
							angular.isDefined(item.Contract2PackageData.ConHeaderFk)) {// this is 'go to feature' for package at field ConCode
							return item.Contract2PackageData;
						} else if (angular.isDefined(item.ConHeaderFk)) { // data is navigated from Pes and invoice module to Contract
							return item.ConHeaderFk !== null ? item.ConHeaderFk : -1;
						} else if (_.isArray(item) && item.length > 0) { // navigate form ticket system, after successfully submit the order
							return item;
						} else if (triggerField === 'Ids' && item.FromGoToBtn) {
							return item.Ids.split(',');
						} else if (triggerField === 'Code') {
							return item.Id;
						} else {
							throw new Error('The property contract header is not recognized.');
						}
					}
				});

				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'ConHeaderDto',
					moduleSubModule: 'Procurement.Contract',
					validationService: 'contractHeaderElementValidationService',
					mustValidateFields: ['Code', 'TaxCodeFk', 'PrcHeaderEntity.StrategyFk', 'ContracttypeFk', 'AwardmethodFk', 'PrcCopyModeFk', 'BusinessPartnerFk']
				});

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
					let resultSet = platformGridAPI.rows.getRows('e5b91a61dbdd4276b3d92ddc84470162');
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

				function setItemReadonly(entity, isReadonly) {
					var fields = ['MdcMaterialFk', 'PrcStructureFk', 'BasUomFk', 'Description1', 'Description2'];
					var readonlyArr = [];
					angular.forEach(fields, function (field) {
						readonlyArr.push({field: field, readonly: isReadonly});
					});
					runtimeDataService.readonly(entity, readonlyArr);
				}

				service.getRubricIndex = function (contractEntity) {
					// check the contract type, 0 Purchase Order, 4 for 'call off' and 5 for 'change order'
					var rubricIndex = 0;
					if (contractEntity.ConHeaderFk !== null && contractEntity.ConHeaderFk !== undefined) {
						if (contractEntity.ProjectChangeFk !== null && contractEntity.ProjectChangeFk !== undefined) {
							rubricIndex = 5;
						} else {
							rubricIndex = 4;
						}
					}
					return rubricIndex;
				};

				service.getItemServiceName = function () {
					return 'procurementContractItemDataService';
				};

				// charDataService.registerParentsEntityCreated();

				// #98236 - Consider copy restrictions for copy mode for material items
				service.getConMasterRestrictionInfo = function () {
					var conHeader = service.getSelected();

					if (conHeader) {
						var result = {
							conHeaderId: conHeader.Id,
							prcConfigurationId: conHeader.PrcHeaderEntity.ConfigurationFk,
							prcCopyMode: conHeader.PrcCopyModeFk,
							packageFk: (conHeader.PackageFk === null) ? -1 : conHeader.PackageFk
						};

						var modState = platformModuleStateService.state(service.getModule());

						if (modState && modState.modifications) {
							if (angular.isArray(modState.modifications.ConMasterRestrictionToSave)) {
								result.includeCatalogIds = modState.modifications.ConMasterRestrictionToSave.filter(function (item) {
									return item.Version === 0 && item.MdcMaterialCatalogFk !== null;
								}).map(function (item) {
									return item.MdcMaterialCatalogFk;
								});
							}

							if (angular.isArray(modState.modifications.ConMasterRestrictionToDelete)) {
								result.excludeCatalogIds = modState.modifications.ConMasterRestrictionToDelete.filter(function (item) {
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

				// #99136 - Call Off Type Contract Update - Material
				service.getBasisContractInfo = function () {
					var conHeader = service.getSelected();

					if (conHeader && conHeader.ConHeaderFk !== null && conHeader.ProjectChangeFk === null) {
						return {
							basisContractId: conHeader.ConHeaderFk
						};
					}

					return null;
				};

				service.doPrepareUpdateCall = function (updateData) {
					if (service.getSelected() && updateData) {
						if (angular.isDefined(updateData.PrcBoqCompleteToSave)){
							updateData.PrcBoqCompleteToSave.HeaderId = service.getSelected().Id;
						}

						if (updateData.PrcHeaderblobToSave){
							procurementCommonHelperService.setHeaderTextContentNull(updateData.PrcHeaderblobToSave);
						}

						if (service.getSelected().Version === 0){
							service.doRecordUpdateData(updateData);
						}
					}

					if (needUpdateUcToItemsBoqs) {
						// need to update controllingUnit of prcItems and boqItems
						updateData.NeedUpdateUcToItemsBoqs = true;
						needUpdateUcToItemsBoqs = false;
					}

				};

				let recordUpdateData = {};
				service.doRecordUpdateData = function doRecordUpdateData(updateData) {
					var subItemNames = ['BillingSchema', 'PrcHeaderblob', 'CharacteristicData', 'Total'];
					_.forEach(subItemNames, function (subItem) {
						let itemName = subItem + 'ToSave';
						if (angular.isDefined(updateData[itemName])) {
							recordUpdateData[itemName] = updateData[itemName];
						}
						if (recordUpdateData[itemName] && !angular.isDefined(updateData[itemName])) {
							updateData[itemName] = recordUpdateData[itemName];
							updateData.EntitiesCount = updateData.EntitiesCount + _.size(updateData[itemName]);
						}

					});
				};

				service.clearUpdateData = function () {
					recordUpdateData = {};
				};


				service.clearModifications = function () {
					var items = serviceContainer.data.itemList;
					angular.forEach(items, function (item) {
						serviceContainer.data.doClearModifications(item, serviceContainer.data);
					});
				};

				service.getContainerData = function () {
					return serviceContainer.data;
				};

				service.wizardIsActivate = function () {
					var status = basicsLookupdataLookupDescriptorService.getData('ConStatus');
					var parentItem = service.getSelected();
					var IsActivate = true;
					if (parentItem) {
						var oneStatus = _.find(status, {Id: parentItem.ConStatusFk});
						var IsReadonly = oneStatus.IsReadonly;
						var IsLive = oneStatus.IsLive;
						IsActivate = !IsReadonly;
						if (IsActivate) {
							IsActivate = IsLive;
						}
					}
					if (!IsActivate) {
						var headerTextKey = $translate.instant('procurement.contract.wizard.isActivateCaption');
						var bodyText = $translate.instant('procurement.contract.wizard.isActiveMessage');
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
				serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
					characteristicColumn = colName;
				};
				serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
					return characteristicColumn;
				};

				service.gridRowChangeCallBack = function gridRowChangeCallBack() {
					var helperService = $injector.get('salesCommonContainerInformationHelperService');
					if (helperService) {
						helperService.initMasterDataFilter('procurementContractHeaderDataService');
					}
				};
				service.gridCellChangeCallBack = function gridCellChangeCallBack(arg) {
					var entity = arg.item;
					var col = arg.grid.getColumns()[arg.cell].field;
					service.cellChange(entity, col);
					var colService = service.characterColumnService();
					if (colService) {
						var column = arg.grid.getColumns()[arg.cell];
						var field = arg.grid.getColumns()[arg.cell].field;
						colService.fieldChange(arg.item, field, column);
					}
				};


				service.gridSelectionChangeed = function gridSelectionChangeed() {
				};

				service.gridOnActiveCellChanged = function gridOnActiveCellChanged(arg, characterColumnService) {
					var column = arg.grid.getColumns()[arg.cell];
					if (column) {
						var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						var isCharacteristic = characterColumnService.isCharacteristicColumn(column);
						if (isCharacteristic) {
							var lineItem = service.getSelected();
							if (lineItem !== null) {
								var col = column.field;
								var colArray = _.split(col, '_');
								if (colArray && colArray.length > 1) {
									var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
									var value = parseInt(characteristicType);
									var isLookup = characteristicTypeService.isLookupType(value);
									var updateColumn = isLookup ? col : undefined;
									service.setCharacteristicColumn(updateColumn);
								}
							}
						}
					}
				};
				// characteristic dynamic column
				service.characterColumnService = function characterColumnService() {
					var containerInfoService = $injector.get('procurementContractContainerInformationService');
					return $injector.get('basicsCharacteristicColumnServiceFactory').getService(service, 46, 'E5B91A61DBDD4276B3D92DDC84470162', containerInfoService);
				};
				service.characteristicDataOnItemUpdate = function characteristicDataOnItemUpdate(item, characteristicDataService, characterColumnService) {
					characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
						if (item.CharacteristicEntity === null) {
							item.CharacteristicEntity = data;
						}
						characterColumnService.checkColumn(item);
					});
				};

				service.boqFilterSettingChanged = new PlatformMessenger();
				service.boqProcurementStructureChanged = new PlatformMessenger();

				service.removeBoqItems = function removeBoqItems() {
					var prcBoqMainServiceFactory = $injector.get('prcBoqMainService');
					var procurementCommonPrcBoqServiceFactory = $injector.get('procurementCommonPrcBoqService');
					var prcBoqMainService = prcBoqMainServiceFactory.getService(service);
					var procurementCommonPrcBoqService = procurementCommonPrcBoqServiceFactory.getService(service, prcBoqMainService);
					if (procurementCommonPrcBoqService) {
						var boqItems = procurementCommonPrcBoqService.getList();
						if (boqItems) {
							_.forEach(boqItems, function (item) {
								procurementCommonPrcBoqService.deleteItem(item);
							});
						}
					}
				};

				service.hasWicBoqInConHeader = function hasWicBoqInConHeader(item) {
					return item && item.BoqWicCatFk;
				};
				// #135775, in contract module if open the contract strucure(Main/Sub) container, the getSelectedEntities function always get one item
				service.getToHandleEntities = function getToHandleEntities() {
					var entities = platformGridAPI.rows.selection({
						gridId: 'e5b91a61dbdd4276b3d92ddc84470162',
						wantsArray: true
					});
					var isGroup = _.some(entities, {'__group': true});
					//#147192, handle in contract strucure(Main/Sub) container select an item, if the contract container set group by the some columns
					//if will get the selected groups instead of the select contracts
					if(_.isNil(entities) || isGroup){
						entities = service.getSelectedEntities();
					}
					return entities;
				};

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
				service.wantToUpdateCUToItemsAndBoq = function (controllingUnitFk) {
					if (hasItemsOrBoqs.items || hasItemsOrBoqs.prcboqs || hasItemsOrBoqs.boqitems) {
						var modalOptions = {
							headerText: $translate.instant('procurement.package.updateControllingUnitDialogTitle'),
							bodyText: $translate.instant('procurement.package.doUpdateControllingUnit'),
							showYesButton: true, showNoButton: true,
							iconClass: 'ico-question',
							id: doUpdateControllingUnitDialogId,
							dontShowAgain: true
						};
						$injector.get('procurementContextService').showDialogAndAgain(modalOptions)
							.then(function (result) {
								if (result.yes) {
									var selected = service.getSelected();
									if (selected) {
										needUpdateUcToItemsBoqs = true;
										service.controllingUnitToItemBoq.fire();
									}
								} else {
									needUpdateUcToItemsBoqs = false;
								}
							}).finally(function () {
							service.hasItemsOrBoqs({});
						});
					}
				};

				service.wantToUpdateTXToItemsAndBoq = function () {
					var modalOptions = {
						headerText: $translate.instant('procurement.common.changeTaxCode.caption'),
						bodyText:$translate.instant('procurement.common.changeTaxCode.DialogTitle') + $translate.instant('procurement.common.changeTaxCode.noteForPaymentSchedule'),
						showYesButton: true, showNoButton: true,
						iconClass: 'ico-question',
						id: doUpdateControllingUnitDialogId,
					};
					$injector.get('procurementContextService').showDialogAndAgain(modalOptions)
						.then(function (result) {
							if (result.yes) {
								var selected = service.getSelected();
								if (selected) {
									service.changeStructureSetTaxCodeToItemBoq.fire();
								}
							}
						});
				};

				service.isConsolidateChange = function(selectedConHeader) {
					const prcConfigurations = basicsLookupdataLookupDescriptorService.getData('prcConfiguration');
					const prcConfigHeaders = basicsLookupdataLookupDescriptorService.getData('PrcConfigHeader');
					const selectedEntity = selectedConHeader ? selectedConHeader : this.getSelected();
					let isConsolidateChange = false;

					if (prcConfigurations && prcConfigHeaders && selectedEntity.PrcHeaderEntity.ConfigurationFk) {
						const config = _.find(prcConfigurations, {Id: selectedEntity.PrcHeaderEntity.ConfigurationFk});
						if (config) {
							const configHeader = _.find(prcConfigHeaders, {Id: config.PrcConfigHeaderFk});
							isConsolidateChange = configHeader.IsConsolidateChange;
						}
					}

					return isConsolidateChange;
				}

				basicsCommonInquiryHelperService.registerEnableInspector('e5b91a61dbdd4276b3d92ddc84470162',service);

				service.getRubricId = function () {
					return moduleContext.contractRubricFk;
				};
				return service;
			}]);
})(angular);
