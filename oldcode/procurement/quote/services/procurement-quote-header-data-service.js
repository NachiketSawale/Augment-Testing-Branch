/**
 * Created by sus on 2014/12/9.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.quote';
	/** @namespace filterRequest.navInfo.extparamsDic */
	/** @namespace  entity.Rfq2PackageData */
	/** @namespace  entity.qtnSelectedItem */
	/**
	 * @ngdoc service
	 * @name procurementQuoteHeaderDataService
	 * @function
	 * @requires globals ...
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementQuoteHeaderDataService',
		['_', '$injector', 'globals', '$http', '$timeout', 'platformDataServiceFactory', 'platformContextService', 'basicsLookupdataLookupDescriptorService', 'PlatformMessenger',
			'basicsLookupdataLookupFilterService', 'platformRuntimeDataService', 'procurementQuoteHeaderValidationService', 'procurementContextService',
			'ServiceDataProcessDatesExtension', 'procurementCommonDataEnhanceProcessor', 'platformDataServiceDataProcessorExtension', 'platformDataServiceActionExtension',
			'procurementCommonInputArgumentDialog', 'cloudDesktopSidebarService', 'platformDataServiceModificationTrackingExtension', 'cloudDesktopPinningContextService',
			'procurementCommonPrcItemDataService', 'platformHeaderDataInformationService',
			'cloudDesktopInfoService', 'basicsCommonFileUploadServiceLocator', '$rootScope', '$q', 'platformModuleDataExtensionService',
			'platformDataServiceValidationErrorHandlerExtension', 'platformModalService', '$translate',
			'commonBusinessPartnerEvaluationModificationKeeper', 'prcCommonBoqMainReadonlyProcessor', 'procurementCommonCodeHelperService',
			'platformGridAPI', 'basicsCommonCharacteristicService', 'prcCommonProcessChangeVatGroupDialog', 'SchedulingDataProcessTimesExtension','procurementCommonHelperService',
			function (_, $injector, globals, $http, $timeout, platformDataServiceFactory, platformContextService, basicsLookupdataLookupDescriptorService, PlatformMessenger,
				basicsLookupdataLookupFilterService, platformRuntimeDataService, validationService, procurementContextService,
				ServiceDataProcessDatesExtension, procurementCommonDataEnhanceProcessor, dataProcessorExtension, dataServiceActionExtension,
				procurementCommonInputArgumentDialog, cloudDesktopSidebarService, platformDataServiceModificationTrackingExtension, cloudDesktopPinningContextService,
				itemService, platformHeaderDataInformationService,
				cloudDesktopInfoService, basicsCommonFileUploadServiceLocator, $rootScope, $q, platformModuleDataExtensionService,
				platformDataServiceValidationErrorHandlerExtension, platformModalService, $translate, evaluationModificationKeeper, prcCommonBoqMainReadonlyProcessor,
				codeHelperService, platformGridAPI, basicsCommonCharacteristicService, prcCommonProcessChangeVatGroupDialog, SchedulingDataProcessTimesExtension, procurementCommonHelperService) {
				var characteristicColumn = '';
				var gridContainerGuid = '338048ac80f748b3817ed1faea7c8aa5';
				var serviceContainer = null;
				var totalNoDiscountSplitOfHeader = 0;
				var totalNoDiscountSplitOcOfHeader = 0;
				var totalGrossNoDiscountSplitOfHeader = 0;
				var totalGrossOcNoDiscountSplitOcOfHeader = 0;
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					includeChainedItems: false,
					quotesFromSameRFQ: false,
					onlyDisplayLatestQuoteVersion: false,
					showOptions: true,
					showProjectContext: false, // TODO: rei remove it
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false,
					orderBy: [{Field: 'Code'}],
					enhancedSearchVersion: '2.0',
					includeDateSearch: true
				};
				var isCreateReadonly = false;
				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementQuoteHeaderDataService',
						entityRole: {
							root: {
								moduleName: 'cloud.desktop.moduleDisplayNameQuote',
								itemName: 'QuoteHeader',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								codeField: 'Code',
								descField: 'Description',
								handleUpdateDone: handleUpdateDone,
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
						entitySelection: {},
						modification: {simple: {}},
						httpCreate: {
							route: globals.webApiBaseUrl + 'procurement/quote/header/',
							endCreate: 'createqtn'
						},
						httpDelete: {
							route: globals.webApiBaseUrl + 'procurement/quote/header/',
							endDelete: 'deleteqtn'
						},
						httpUpdate: {
							route: globals.webApiBaseUrl + 'procurement/quote/header/',
							endUpdate: 'updateqtn'
						},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/quote/header/',
							endRead: 'listqtn',
							usePostForRead: true,
							extendSearchFilter: function (filterRequest) {
								if (filterRequest.navInfo) {
									if (filterRequest.navInfo.extparamsDic) {
										var furtherFilters = angular.isArray(filterRequest.furtherFilters) ? filterRequest.furtherFilters : [],
											extParams = filterRequest.navInfo.extparamsDic;
										for (var name in extParams) {
											// eslint-disable-next-line no-prototype-builtins
											if (extParams.hasOwnProperty(name)) {
												furtherFilters.push({Token: name.toUpperCase(), Value: extParams[name]});
											}
										}
										filterRequest.furtherFilters = furtherFilters;
									}
								}

								if (serviceContainer && serviceContainer.service && serviceContainer.service.filterRecordsForRfqId) {
									if (serviceContainer.service.filterRecordsForRfqId > 0) {
										filterRequest.RfqHeaderId = serviceContainer.service.filterRecordsForRfqId;
										delete serviceContainer.service.filterRecordsForRfqId;
									}
								}
							}
						},
						presenter: {
							list: {
								initCreationData: initCreationData,
								incorporateDataRead: incorporateDataRead
							}, isInitialSorted: true
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
						dataProcessor: [dataProcessItem(), new ServiceDataProcessDatesExtension(['DateQuoted', 'DateReceived', 'DatePricefixing', 'DateEffective','DateAwardDeadline', 'DeadlineDate']),
							new SchedulingDataProcessTimesExtension(['DeadlineTime']), {processItem: processPortalStatus}],
						// actions: {create: 'flat', delete: 'flat'},
						actions: {
							delete: 'flat', create: 'flat',
							canCreateCallBackFunc: function canCreateButton() {
								return !isCreateReadonly;
							}
						},
						filterByViewer: true
					}
				};

				function processPortalStatus(item) {
					if (item.IsBidderDeniedRequest) {
						platformRuntimeDataService.readonly(item, true);
					}
				}

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

				var IsPortalUser = false;

				codeHelperService.IsPortalUser().then(function (val) {
					IsPortalUser = val;
				});

				initialize(serviceContainer.service, serviceContainer.data);
				basicsLookupdataLookupDescriptorService.loadData(['QuoteStatus']);

				serviceContainer.service.loadNewItems = function (newItems) {
					var index = 1;
					_.forEach(newItems, function (newItem) {
						newItem = newItem.QuoteHeader;
						dataProcessorExtension.doProcessItem(newItem, serviceContainer.data);
						serviceContainer.data.itemList.push(newItem);
						dataServiceActionExtension.fireEntityCreated(serviceContainer.data, newItem);
						if (newItems.length === index) {
							serviceContainer.data.listLoaded.fire(null, newItem);
							serviceContainer.service.setSelected(newItem);
						}
						index++;
					});
				};

				var confirmDeleteDialogHelper = $injector.get('prcCommonConfirmDeleteDialogHelperService');
				confirmDeleteDialogHelper.attachConfirmDeleteDialog(serviceContainer);

				serviceContainer.service.getItemServiceName = function () {
					return 'procurementQuoteItemDataService';
				};

				basicsCommonCharacteristicService.unregisterCreateAll(serviceContainer.service, 7, 50);

				serviceContainer.service.callRefresh = serviceContainer.service.refresh || serviceContainer.data.onRefreshRequested;

				serviceContainer.service.getValueByLookup = function (type, key) {
					var items = basicsLookupdataLookupDescriptorService.getData(type);
					if (items) {
						return items[key];
					}
					return null;
				};

				serviceContainer.service.wizardIsActivate = function () {
					var status = basicsLookupdataLookupDescriptorService.getData('QuoteStatus');
					var parentItem = serviceContainer.service.getSelected();
					var IsActivate = true;
					if (parentItem) {
						var oneStatus = _.find(status, {Id: parentItem.StatusFk});
						if (oneStatus) {
							var IsReadonly = oneStatus.IsReadonly;
							var IsLive = oneStatus.IsLive;
							IsActivate = !IsReadonly;
							if (IsActivate) {
								IsActivate = IsLive;
							}
						}
					}
					if (!IsActivate) {
						showWizardIsActiveMessage();
					}
					return IsActivate;
				};

				serviceContainer.service.wizardIsActivateForBidderStatus = function () {
					var IsActive = true;
					if (isBidderDeniedRequest()) {
						IsActive = false;
						showWizardIsActiveMessage();
					}

					return IsActive;
				};

				function showWizardIsActiveMessage() {
					var headerTextKey = $translate.instant('procurement.quote.wizard.isActivateCaption');
					var bodyText = $translate.instant('procurement.quote.wizard.isActiveMessage');
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

				/**
				 * get module state
				 * @param item target item, default to current selected item
				 * @returns  object {IsReadonly:true|false}
				 */
				serviceContainer.service.getModuleState = function getModuleState(item) {
					var state, status, parentItem = item || serviceContainer.service.getSelected();
					status = basicsLookupdataLookupDescriptorService.getData('QuoteStatus');

					if (parentItem && parentItem.Id) {
						state = _.find(status, {Id: parentItem.StatusFk});
					} else {
						state = {IsReadonly: true};
					}
					return state;
				};

				// characteristic item readonly
				serviceContainer.service.setDataReadOnly = function (items) {
					_.forEach(items, function (item) {
						platformRuntimeDataService.readonly(item, true);
					});
				};

				serviceContainer.data.callAfterSuccessfulUpdate = function () {
					var boqMainService = $injector.get('prcBoqMainService').getService(),
						container = boqMainService.getServiceContainer();
					var list = container.service.getList();
					_.each(list, function (item) {
						prcCommonBoqMainReadonlyProcessor.processItem(item, container.data);
					});
				};

				let changeVatGroupRecalBoqAndItemDialogId = $injector.get('platformCreateUuid')();
				serviceContainer.service.cellChange = function cellChange(entity, field) {
					if (field === 'BpdVatGroupFk') {
						prcCommonProcessChangeVatGroupDialog.showAskDialog(moduleName, serviceContainer.service, serviceContainer.data, entity, changeVatGroupRecalBoqAndItemDialogId, function recalculateAfterChangeVatGroupInQtn() {
							$http.get(globals.webApiBaseUrl + 'procurement/common/boq/RecalculationBoQ?headerId=' + entity.Id + '&vatGroupFk=' + entity.BpdVatGroupFk + '&sourceType=quote').then(function () {
								serviceContainer.service.onRecalculationItemsAndBoQ.fire();
							});
						});
					}
				};

				serviceContainer.service.setTotalNoDiscountSplitOfHeader = function setTotalNoDiscountSplitOfHeader(totalNoDiscountSplit, totalNoDiscountSplitOc, totalGrossNoDiscountSplit, totalGrossOcNoDiscountSplitOc) {
					totalNoDiscountSplitOfHeader = (totalNoDiscountSplit || totalNoDiscountSplit === 0) ? totalNoDiscountSplit : 0;
					totalNoDiscountSplitOcOfHeader = (totalNoDiscountSplitOc || totalNoDiscountSplitOc === 0) ? totalNoDiscountSplitOc : 0;
					totalGrossNoDiscountSplitOfHeader = (totalGrossNoDiscountSplit || totalGrossNoDiscountSplit === 0) ? totalGrossNoDiscountSplit : 0;
					totalGrossOcNoDiscountSplitOcOfHeader = (totalGrossOcNoDiscountSplitOc || totalGrossOcNoDiscountSplitOc === 0) ? totalGrossOcNoDiscountSplitOc : 0;
				};

				serviceContainer.service.getTotalNoDiscountSplitOfHeader = function getTotalNoDiscountSplitOfHeader() {
					return {
						ValueNet: totalNoDiscountSplitOfHeader,
						ValueNetOc: totalNoDiscountSplitOcOfHeader,
						Gross: totalGrossNoDiscountSplitOfHeader,
						GrossOc: totalGrossOcNoDiscountSplitOcOfHeader
					};
				};

				serviceContainer.service.getRubricId = function () {
					return procurementContextService.quoteRubricFk;
				};

				return serviceContainer.service;

				function initCreationData(creationData) {
					creationData.Value = platformContextService.getApplicationValue('projectId');
				}

				function incorporateDataRead(responseData, data) {
					basicsLookupdataLookupDescriptorService.attachData(responseData || {});
					var dataRead = serviceContainer.data.handleReadSucceeded(responseData, data);
					serviceContainer.service.goToFirst(data);
					// handel characterist
					var exist = platformGridAPI.grids.exist(gridContainerGuid);
					if (exist) {
						var containerInfoService = $injector.get('procurementQuoteContainerInformationService');
						var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 50, gridContainerGuid.toUpperCase(), containerInfoService);
						characterColumnService.appendCharacteristicCols(responseData.dtos);
					}
					return dataRead;
				}

				function handleUpdateDone(updateData, response, data) {
					data.handleOnUpdateSucceeded(updateData, response, data, true);
					data.updateSucceed.fire(updateData, response);
					serviceContainer.service.refreshTotal.fire(); // refresh quote totals
					// no need to trigger itemService load manually
					//var requisitionService = $injector.get('procurementQuoteRequisitionDataService');
					//itemService.getService(requisitionService).load()
					//	.then(function () {
							//itemService.getService(requisitionService).gridRefresh();
					//	});

					// update the evaluation container data
					var uploadService = basicsCommonFileUploadServiceLocator.getService('businessPartnerEvaluationService.common.document');
					if (uploadService) {
						uploadService.clear();
					}
					serviceContainer.service.setTotalNoDiscountSplitOfHeader(response.TotalNoDiscountSplit, response.TotalNoDiscountSplitOc, response.TotalGrossNoDiscountSplit, response.TotalGrossOcNoDiscountSplitOc);
					serviceContainer.service.onUpdateSucceeded.fire({updateData: updateData, response: response});
				}

				function dataProcessItem() {
					var getValue = function (type, key) {
						var items = basicsLookupdataLookupDescriptorService.getData(type);
						if (items) {
							return items[key];
						}
						return null;
					};
					/* jshint -W074 */ // many parameters because of dependency injection
					var isReadonly = function isReadonly(currentItem, model) {
						var editable = true;
						var statusItem = getValue('QuoteStatus', currentItem.StatusFk);
						if (statusItem && statusItem.IsReadonly) {
							return true;
						}

						if (!currentItem || currentItem.IsIdealBidder) {
							return true;
						}

						if (model === 'StatusFk' || model === 'QuoteVersion' || model === 'BillingSchemaFk') {
							return true;
						} else if (model === 'RfqHeaderFk') {
							editable = !currentItem.RfqHeaderFk;
						} else if (model === 'ExchangeRate') {
							var company = getValue('Company', currentItem.CompanyFk);
							if (company && company.CurrencyFk === currentItem.CurrencyFk) {
								editable = false;
							}
						} else if (model === 'SubsidiaryFk') {
							editable = (!!currentItem.BusinessPartnerFk) || (!!currentItem.SupplierFk);
						} else if (model === 'BusinessPartnerFk') {
							editable = /* !!currentItem.RfqHeaderFk && */ (!currentItem.Version || !currentItem.BusinessPartnerFk);
						} else if (model === 'Code') {
							editable = currentItem.Version === 0;
						}
						if (IsPortalUser) {
							var portalUserReadonlyFields = ['BusinessPartnerFk', 'IsValidated', 'IsExcluded', 'IsShortlisted'];
							if (_.includes(portalUserReadonlyFields, model)) {
								editable = false;
							}
						}
						return !editable;
					};

					var dataProcessService = function () {
						serviceContainer.service.updateReadOnly = serviceContainer.service.updateReadOnly || function (item, model) {
							platformRuntimeDataService.readonly(item, [{
								field: model,
								readonly: isReadonly(item, model)
							}]);
						};
						return {dataService: serviceContainer.service, validationService: null};// validationService(serviceContainer.service)};
					};

					return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementQuoteHeaderUIConfigurationService', isReadonly);
				}

				function getSelectedQuoteStatus() {
					var selectedItem = serviceContainer.service.getSelected();
					if (selectedItem && selectedItem.StatusFk) {
						var items = basicsLookupdataLookupDescriptorService.getData('QuoteStatus');
						if (items && items[selectedItem.StatusFk]) {
							return items[selectedItem.StatusFk];
						}
					}

					return null;
				}

				function isBidderDeniedRequest() {
					var selectedItem = serviceContainer.service.getSelected();
					if (selectedItem) {
						return selectedItem.IsBidderDeniedRequest;
					}

					return false;
				}

				/**
				 * @ngdoc function
				 * @name initialize
				 * @function
				 * @methodOf procurement.quote.procurementQuoteHeaderDataService
				 * @description initialize
				 */
				function initialize(service, data) {
					var completeItemCreated = new PlatformMessenger();
					data.updateSucceed = new PlatformMessenger();
					service.refreshTotal = new PlatformMessenger();
					service.registerCompleteItemCreated = registerCompleteItemCreated;
					service.unregisterCompleteItemCreated = unregisterCompleteItemCreated;

					service.name = moduleName;
					service.priceRecalculated = new PlatformMessenger();
					service.exchangeRateChanged = new PlatformMessenger();
					service.selectedQuoteStatusChanged = new PlatformMessenger();
					service.BillingSchemaChanged = new PlatformMessenger();
					service.onUpdateSucceeded = new PlatformMessenger();
					service.onEvaluationChanged = new PlatformMessenger();
					service.vatGroupChanged = new PlatformMessenger();
					service.evaluationModificationKeeper = evaluationModificationKeeper.createKeeper({
						equals: function (a, b) {
							return a.Id === b.Id;
						}
					});
					service.filterByRfQ = filterByRfQ;
					service.setShowHeaderAfterSelectionChanged(updateModuleHeaderInfo);
					service.onRecalculationItemsAndBoQ = new PlatformMessenger();

					service.canDelete = function () {
						if (isBidderDeniedRequest()) {
							return false;
						}

						var selectedQuoteStatus = getSelectedQuoteStatus();
						if (selectedQuoteStatus) {
							return !selectedQuoteStatus.IsOrdered && !selectedQuoteStatus.IsReadonly;
						}

						return false;
					};
					service.getSelectedQuoteStatus = getSelectedQuoteStatus;
					service.registerUpdateSucceed = function (func) {
						data.updateSucceed.register(func);
					};

					service.updateRowStatus = dataProcessItem().processItem;

					// TODO: it is just a work around to reuse the onCreateSucceeded in dataServiceFactory
					var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
					serviceContainer.data.onCreateSucceeded = function (newDataList, data, creationData) {
						// data.selectedItem = newData.Package;
						/** @namespace newData.QuoteHeader */
						var index = 0;
						_.forEach(newDataList, function (newData) {
							index++;
							if (index !== newDataList.length) {
								if (data.addEntityToCache) {
									data.addEntityToCache(newData.QuoteHeader, data);
								}
								dataProcessorExtension.doProcessItem(newData.QuoteHeader, data);
								data.itemList.push(newData.QuoteHeader);
								dataServiceActionExtension.fireEntityCreated(data, newData.QuoteHeader);
							} else {
								onCreateSucceeded(newData.QuoteHeader, data, creationData).then(function () {
									newData.totalItems = newData.PrcTotalsDto; // for total default create.
									completeItemCreated.fire(null, newData);
									serviceContainer.service.refreshTotal.fire(); // refresh quote totals
									service.markCurrentItemAsModified();// when create done the set selected will call by grid which will make selection changed and do clear all modifications.

									// if the rfqHeader has created QTN, then readonly the BillingSchemaFk field
									if (newData.QuoteHeader && newData.QuoteHeader.QuoteVersion === 1) {
										var rfqMainService = $injector.get('procurementRfqMainService');
										rfqMainService.billingSchemaReadonly(newData.QuoteHeader.RfqHeaderFk);
									}
								});
							}
							// handel characterist
							basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, newData.QuoteHeader, 7, 50);
							var exist = platformGridAPI.grids.exist(gridContainerGuid);
							if (exist) {
								var containerInfoService = $injector.get('procurementQuoteContainerInformationService');
								var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(serviceContainer.service, 50, gridContainerGuid.toUpperCase(), containerInfoService);
								characterColumnService.appendDefaultCharacteristicCols(newData.QuoteHeader);
							}
						});

					};

					service.navigationCompleted = function navigationCompleted(entity, field) {
						var parameters = {}, hasParameters = false;

						// navigate from 'procurement.package'
						if (entity && entity.Rfq2PackageData && entity.Rfq2PackageData.PrcPackageFk) {
							parameters.PrcPackageFk = entity.Rfq2PackageData.PrcPackageFk;
							hasParameters = true;
						}
						// navigate from 'procurememnt.rfq' or 'procurement.pricecomparison' tools button
						else if (entity && field === 'RfqHeaderFk') {
							parameters.RfqHeaderFk = entity.Id;
							parameters.FromToolsBtn = true;
							hasParameters = true;
						}
						// navigate from 'procurememnt.rfq' 'request for quotes' container
						else if (entity && field === 'RfqHeaderId') {
							parameters.RfqHeaderId = entity.Id;
							hasParameters = true;
						}
						// navigate from 'procurememnt.rfq' 'bidder' container
						else if (entity && field === 'FirstQuoteFrom') {
							parameters.RfqHeaderId = entity.RfqHeaderFk;
							parameters.BusinessPartnerId = entity.BusinessPartnerFk;
							hasParameters = true;
						}
						// navigate from 'procurement.pricecomparison'
						else if (entity && _.startsWith(field, 'QuoteCol_')) {
							parameters.QtnHeaderId = entity;
							parameters.BusinessPartnerId = field.split('_')[2];
							hasParameters = true;
						}
						// navigate from 'procurememnt.contract'
						else if (entity && field === 'CodeQuotation') {
							cloudDesktopSidebarService.filterSearchFromPattern(entity[field]);
						} else if (entity && field === 'NoOfQuoteRfqHeaderFk') {
							parameters.NoOfQuoteRfqHeaderFk = entity.Id;
							hasParameters = true;
						}
						// navigate from 'procurememnt.contract'
						else if (entity && entity.qtnSelectedItem) {
							cloudDesktopSidebarService.filterSearchFromPattern(entity.qtnSelectedItem.Code);
						} else if (entity && field === 'Id') {
							var keys = [];
							if (angular.isObject(entity)) {
								keys.push(entity[field]);
							}
							if (angular.isString(entity)) {
								keys.push(parseInt(entity));
							}
							cloudDesktopSidebarService.filterSearchFromPKeys(keys);
						} else if (field === 'Ids' && entity.FromGoToBtn) {
							var ids = entity.Ids.split(',');
							cloudDesktopSidebarService.filterSearchFromPKeys(ids);
						}
						if (hasParameters) {
							$http.post(globals.webApiBaseUrl + 'procurement/quote/header/navigation', parameters).then(function (response) {
								cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
							});
						}
					};

					service.getBiddersVersionOverZero = function (rfqHeaderFk) {
						return $http.post(service.getUrl('biddersversionoverzero'), {Value: rfqHeaderFk});
					};

					service.createItem = function (fillSelectedItem, onCreateSucceeded, needCopyRfqTotals, isCreateByMaterials, hasContractItem, isCreateByRfq, uuid) {
						// isCreateByMaterials=true;
						var quoteSelectionService = $injector.get('procurementQuoteSelectionService');
						var projectVal = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
						var projectId = projectVal ? projectVal.id : null;
						data.selectedItemDailog = {ProjectFk: projectId, requestedBiddersFire: quoteSelectionService.rawDataLoaded.fire};

						if (!angular.isFunction(onCreateSucceeded)) {
							onCreateSucceeded = null;
						}

						service.readonlyBidders = false;// whether readonly find bidders group.
						service.biddersGroup = false; // default open bidders group.
						if (angular.isFunction(fillSelectedItem)) {
							fillSelectedItem(data.selectedItemDailog);
						}
						var readonlyProject = data.selectedItemDailog.ProjectFk || data.selectedItemDailog.RfqHeaderFk;
						if (data.selectedItemDailog.hasBaseQtnHeaderFk && data.selectedItemDailog.hasBaseQtnHeaderFk()) {
							service.readonlyBidders = true;
							service.biddersGroup = true;
							data.selectedItemDailog.hasBaseQtnHeaderFk = undefined;// clearn the hasBaseQtnHeaderFk function
						}

						data.selectedItemDailog.hasSelectedBidders = function(){
							let selectedBidders = quoteSelectionService.getSelectedBidders();
							return selectedBidders && selectedBidders.length > 0;
						}
						uuid = uuid ?? 'cd2df5d9ece440548d6cf25e7bccc799';
						return procurementCommonInputArgumentDialog.showDialog(
							service,
							data,
							validationService(serviceContainer.service),
							function (currItem) {
								$http.post(service.getUrl('bidders'), {Value: currItem.RfqHeaderFk || -1})
									.then(function (req) {
										quoteSelectionService.rawData = req.data;
										quoteSelectionService.rawDataLoaded.fire(quoteSelectionService.rawData);
									});
							},
							{
								// schema: {typeName: 'QuoteHeaderDto', moduleSubModule: 'Procurement.Quote'},
								UUID: uuid,
								title$tr$: 'procurement.quote.headerCreateDialog',
								dialogHeight: '730px',
								rows: 'procurementQuoteHeaderUIConfigurationService:ProjectFk,RfqHeaderFk,BusinessPartnerFk,PaymentFromSupplier',
								replace: {
									'ProjectFk': {noCheck: true, readonly: readonlyProject},
									'BusinessPartnerFk': {readonly: service.readonlyBidders},// readonly bidders
									'biddersGroup': {
										isOpen: true,// service.biddersGroup,
										sortOrder: 2,
										header: 'Requested Bidders',
										header$tr$: 'procurement.rfq.sidebar.requestedBidders'
									},
									'supplierGroup': {
										isOpen: true,// !service.biddersGroup,
										sortOrder: 3,
										header: 'Find Business Partner',
										header$tr$: 'procurement.quote.headerBusinessPartnerGroup'
									}
								},
								additional: [{
									gid: 'biddersGroup',
									model: 'BusinessPartnerFk',
									type: 'directive',
									directive: 'procurement-quote-business-partner-selection',
									options: {
										serviceName: 'procurementQuoteBiddersSelection',
										UUID: 'C19799E8307E4A1EB44FD32CEFE29D35',
										valueMember: 'BusinessPartnerFk',
										skipPermissionCheck: true,
										columns: [
											{
												id: 'Selected',
												field: 'Selected',
												name: 'Selected',
												name$tr$: 'cloud.common.entitySelected',
												editor: 'boolean',
												formatter: 'boolean',
												headerChkbox: true,
												width: 100
											},
											{
												id: 'CopiedPrice',
												field: 'UpdateWithQuoteData',
												name: 'Update with Quote data',
												name$tr$: 'cloud.common.updateWithQuoteData',
												editor: 'boolean',
												formatter: 'boolean',
												headerChkbox: true,
												width: 100
											},
											{
												id: 'paymentFromSupplierPerBid',
												field: 'PaymentFromSupplierPerBid',
												name: 'Use Supplier Payment Term',
												name$tr$: 'procurement.quote.UseSupplierPaymentTerm',
												editor: 'boolean',
												formatter: 'boolean',
												headerChkbox: true,
												width: 100
											},
											{
												id: 'updateWithReqData',
												field: 'UpdateWithReqData',
												name: 'Copy rate from Requisition',
												name$tr$: 'procurement.common.copyRateFromRequisition',
												editor: 'boolean',
												formatter: 'boolean',
												headerChkbox: true,
												width: 100
											},
											{
												id: 'bpStatus',
												field: 'RfqBusinesspartnerStatusFk',
												name: 'Status',
												name$tr$: 'cloud.common.entityStatus',
												formatter: 'lookup',
												formatterOptions: {
													lookupType: 'RfqBusinessPartnerStatus',
													displayMember: 'Description'
												},
												width: 100
											},
											{
												id: 'bpName',
												field: 'BusinessPartnerFk',
												name: 'Name',
												name$tr$: 'businesspartner.main.name1',
												formatter: 'lookup',
												formatterOptions: {
													lookupType: 'BusinessPartner',
													displayMember: 'BusinessPartnerName1'
												},
												width: 180
											},
											{
												id: 'desc',
												field: 'SubsidiaryFk',
												name: 'Address',
												name$tr$: 'cloud.common.entityAddress',
												formatter: 'lookup',
												formatterOptions: {
													lookupType: 'Subsidiary',
													displayMember: 'Address'
												},
												width: 230
											},
											{
												id: 'version',
												field: 'QuoteVersion',
												name: 'Version',
												name$tr$: 'procurement.quote.headerVersion',
												width: 60
											}
										]
									}
								},{
									rid: 'PaymentFromSupplier',
									gid: 'supplierGroup',
									model: 'PaymentFromSupplier',
									type: 'boolean',
									label: 'Use Supplier Payment Term',
									label$tr$: 'procurement.quote.UseSupplierPaymentTerm',
									checked: false,
									readonly: false,
									disabled: false,
									noCheck: true,
									sortOrder: 99

								}],
								disableButton: function (currentItem, dialogOptions) {
									let selectedBidders = quoteSelectionService.getSelectedBidders();
									return !dialogOptions.checkingMandatory(currentItem) && (!selectedBidders || selectedBidders.length <= 0);
								},
								hasContractItem: hasContractItem,
								customValidate: function(currentItem, dialogOptions){
									let selectedBidders = quoteSelectionService.getSelectedBidders();
									return dialogOptions.checkingMandatory(currentItem) || (selectedBidders && selectedBidders.length > 0);
								},
								customProcessRows: function(configurationRows){
									angular.forEach(configurationRows, row => {
										if (row.rid === 'businesspartnerfk'){
											row.required = false;
											if (row.options){
												row.options.showClearButton = true;
												if (isCreateByRfq) {
													row.options.approvalBPRequired = true;
													row.options.filterKey = 'procurement-rfq-create-quote-businesspartner-filter';// from rfq
												}
											}
										}
									});
								}
							},
							false, // do not check mandatory at the beginning
							isCreateByMaterials
						).then(function closeDialog(result) {
							var selectedBidders = quoteSelectionService.getSelectedBidders();
							quoteSelectionService.rawData = [];
							quoteSelectionService.setList([]);
							if (result) {
								var selectedItems = [];
								if (data.selectedItemDailog) {
									_.forEach(selectedBidders, function (bidder) {
										var selected = {
											Code: 'IsGenerated',
											BusinessPartnerFk: bidder.BusinessPartnerFk,
											ProjectFk: data.selectedItemDailog.ProjectFk,
											RfqHeaderFk: data.selectedItemDailog.RfqHeaderFk,
											UpdateWithQuoteData: bidder.UpdateWithQuoteData || false,
											UpdateWithReqData: bidder.UpdateWithReqData || false,
											PaymentFromSupplier: bidder.PaymentFromSupplierPerBid  || false
										};
										selectedItems.push(selected);
									});
									if (result.BusinessPartnerFk) {
										let selectedBidder = _.find(selectedBidders, bp => {
											return result.BusinessPartnerFk === bp.BusinessPartnerFk;
										});
										if (!selectedBidder) {
											selectedItems.push({
												Code: 'IsGenerated',
												BusinessPartnerFk: result.BusinessPartnerFk,
												ProjectFk: result.ProjectFk,
												RfqHeaderFk: result.RfqHeaderFk,
												PaymentFromSupplier: result.PaymentFromSupplier  || false,
												SubsidiaryFk: result.SubsidiaryFk
											});
										}
									}
								}
								if (needCopyRfqTotals) {
									var oldEndCreate = data.endCreate;
									data.endCreate = 'createviawizard';
									data.doCallHTTPCreate(selectedItems, data, onCreateSucceeded || data.onCreateSucceeded);
									data.endCreate = oldEndCreate;
								} else {
									if (!isCreateByMaterials) {
										onCreateSucceeded = onCreateSucceeded || data.onCreateSucceeded;
										createData(selectedItems, onCreateSucceeded);
									} else {
										$injector.get('procurementQtnGetMaterialsWizardService').showMaterialsPortalDialog(selectedItems);
									}
								}
								data.selectedItemDailog = null;
								result = null;
							}
						});
					};

					service.getUrl = function (end) {
						return data.httpReadRoute + end;
					};

					service.registerSelectionChanged(function quoteHeaderChanged(e, selected) {
						var selectedQuoteStatus = getSelectedQuoteStatus();
						service.selectedQuoteStatusChanged.fire(selectedQuoteStatus);

						if (!selected || selected.IsIdealBidder || (selectedQuoteStatus && selectedQuoteStatus.IsReadonly)) {
							procurementContextService.setModuleStatus({IsReadonly: true});
						} else {
							procurementContextService.setModuleStatus(service.getModuleState(selected));
						}

						isFreeItemsAllowedChanged.fire(serviceContainer.service.getIsFreeItemsAllowed());
					});

					manageFilter(service);

					function createData(selectedItems, onCreateSucceeded) {
						// readonly the create button
						isCreateReadonly = true;
						data.listLoaded.fire();
						$http.post(data.httpCreateRoute + data.endCreate, selectedItems)
							.then(function (response) {
								if (onCreateSucceeded) {
									return onCreateSucceeded(response.data, data, selectedItems);
								}
								return response.data;
							}).finally(function () {
								isCreateReadonly = false;
								data.listLoaded.fire();
							});
					}

					function registerCompleteItemCreated(func) {
						completeItemCreated.register(func);
					}

					function unregisterCompleteItemCreated(func) {
						completeItemCreated.unregister(func);
					}

					function filterByRfQ() {
						var select = service.getSelected();
						if (select && angular.isDefined(select.Id)) {
							var searchOptions = data.sidebarSearchOptions.options;
							searchOptions.useCurrentClient = cloudDesktopSidebarService.filterRequest.useCurrentClient;
							cloudDesktopSidebarService.initializeFilterRequest(searchOptions);
							data.extendSearchFilter = function extendSearchFilter(filterRequest) {
								filterRequest.RfqHeaderId = select.RfqHeaderFk;
							};

							platformDataServiceModificationTrackingExtension.clearModificationsInRoot(service);
							cloudDesktopSidebarService.filterStartSearch();

							data.extendSearchFilter = null;
						}
					}

					service.collectLocalEvaluationData = function collectLocalEvaluationData() {
						var currentItem = service.getSelected();
						/** @namespace currentItem.EvaluationCompleteDto */
						if (currentItem && currentItem.EvaluationCompleteDto) {
							return currentItem.EvaluationCompleteDto;
						}
					};

					service.isChangeOrder = function isChangeOrder(qtnHeaderFk) {
						var isChangeOrderUrl = globals.webApiBaseUrl + 'procurement/quote/header/ischangeorder';
						return $http.post(isChangeOrderUrl, {Value: qtnHeaderFk});
					};

					service.canCreateContract = function canCreateContract(qtnHeaderFk) {
						var canCreateContractUrl = globals.webApiBaseUrl + 'procurement/quote/header/cancreatecontract';
						return $http.post(canCreateContractUrl, {Value: qtnHeaderFk});
					};

					service.updateItem = updateItem;
					service.loadById = loadById;
					service.isReadonlyWholeModule = isReadonlyWholeModule;

					serviceContainer.service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
						characteristicColumn = colName;
					};
					serviceContainer.service.getCharacteristicColumn = function getCharacteristicColumn() {
						return characteristicColumn;
					};
					var isFreeItemsAllowedChanged = new PlatformMessenger();

					service.registerIsFreeItemsAllowedChanged = function registerIsFreeItemsAllowedChanged(handler) {
						if (angular.isFunction(handler)) {
							isFreeItemsAllowedChanged.register(handler);
						}
					};

					service.unregisterIsFreeItemsAllowedChanged = function unregisterIsFreeItemsAllowedChanged(handler) {
						if (angular.isFunction(handler)) {
							isFreeItemsAllowedChanged.unregister(handler);
						}
					};

					service.getIsFreeItemsAllowed = function getIsFreeItemsAllowed() {
						// For currently a quote header doesn't have a link to a procurement configuration
						// (the place where the IsFreeItemsAllowed flag is located) we default this property to be true
						// until another decision is made.
						var isFreeItemsAllowed = false;
						var quote = service.getSelected();
						if (quote) {
							var configuraionFk = service.getSelected().ConfigurationFk;
							var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: configuraionFk});
							isFreeItemsAllowed = config ? config.IsFreeItemsAllowed : false;
						}
						return isFreeItemsAllowed;
					};

					service.getIsProtected = function getIsProtected() {
						var isProtected = false;
						var item = service.getSelected();
						var quoteStatuses = basicsLookupdataLookupDescriptorService.getData('QuoteStatus');
						var quoteStatus = null;

						if (quoteStatuses && item) {
							quoteStatus = quoteStatuses[item.StatusFk];
							isProtected = quoteStatus ? quoteStatus.IsProtected : false;
						}

						return isProtected;
					};

					service.getSelectedItemDailog = function getSelectedItemDailog(){
						return data.selectedItemDailog;
					}

					service.doPrepareUpdateCall = function (updateData){
						if (updateData.QtnRequisitionToSave?.length > 0){
							_.forEach(updateData.QtnRequisitionToSave, function (headerToSave){
								if (headerToSave.PrcHeaderblobToSave){
									procurementCommonHelperService.setHeaderTextContentNull(headerToSave.PrcHeaderblobToSave);
								}
							});
						}
					}

					// //////////////////////////////
					function updateModuleHeaderInfo() {
						var entity = service.getSelected();

						if (entity) {
							var quoteText = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(entity, {
								codeField: 'Code',
								descField: 'Description'
							});

							var bpText = platformHeaderDataInformationService.prepareMainEntityHeaderInfo(getBusinessPartner(entity), {
								codeField: 'BusinessPartnerName1'
							}) || '';

							if (bpText) {
								quoteText += ' / ' + bpText;
							}

							cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameQuote', quoteText, '');
						}
					}

					function getBusinessPartner(entity) {
						if (entity.BusinessPartnerFk) {
							var values = basicsLookupdataLookupDescriptorService.getData('BusinessPartner');
							if (values) {
								return values[entity.BusinessPartnerFk];
							}
						}

						return null;
					}

					function updateItem(type) {
						$rootScope.$emit('updateRequested');
						var endUpdate = data.endUpdate;
						switch (type) {
							case 'item2OneQuote':
								endUpdate = 'updateitemtoonequote';
								break;
							case 'item2AllQuotes':
								endUpdate = 'updateitemtoallquotes';
								break;
						}

						return $q.all([data.waitForOutstandingDataTransfer(), platformDataServiceValidationErrorHandlerExtension.assertAllValid(service)])
							.then(function (responses) {
								var response = responses[1];
								if (response === true) {
									var updateData = platformDataServiceModificationTrackingExtension.getModifications(service);
									platformDataServiceModificationTrackingExtension.clearModificationsInRoot(service);
									if (service.doPrepareUpdateCall) {
										service.doPrepareUpdateCall(updateData);
									}

									if (updateData && updateData.EntitiesCount >= 1) {
										platformModuleDataExtensionService.fireUpdateDataExtensionEvent(updateData, data);

										return $http.post(data.httpUpdateRoute + endUpdate, updateData).then(function (response) {
											data.onUpdateSucceeded(response.data, data, updateData);
											$rootScope.$emit('updateDone');
											return response.data;
										});
									}
								}
								return response;
							}
							);
					}

					function loadById(id) {
						data.initReadData = function (readData) {
							readData.PKeys = [id];
						};

						service.refresh();
						data.initReadData = null;
					}

					function isReadonlyWholeModule() {
						var selected = service.getSelected();
						return (selected && selected.IsIdealBidder) || !selected;
					}
				}

				function manageFilter(service) {
					var onFilterLoaded = new PlatformMessenger(),
						onFilterUnLoaded = new PlatformMessenger();

					var filters = [
						{
							key: 'procurement-quote-rfq-header-filter',
							serverKey: 'procurement-quote-rfq-header-filter',
							serverSide: true,
							fn: function (selectedProject) {
								var result = {
									CompanyFk: platformContextService.getContext().clientId,// todo stone: is login company?
									HasSelected: false,
									ProjectFk: null
								};

								// var selectedProject = service.getSelected();
								if (selectedProject) {
									result.HasSelected = true;
									var targetProjectFk = selectedProject.ProjectFk || procurementContextService.loginProject;
									if (targetProjectFk) {
										result.ProjectFk = targetProjectFk;
									}
								}

								return result;
							}
						},

						{
							key: 'procurement-quote-qtn-header-filter',
							serverKey: 'procurement-quote-qtn-header-filter',
							serverSide: true,
							fn: function (item) {
								return {QtnHeaderFk: null, CompanyFk: item.CompanyFk};
							}
						},

						{
							key: 'procurement-quote-project-filter',
							serverKey: 'procurement-quote-project-filter',
							serverSide: true,
							fn: function () {
								return {IsLive: true};
							}
						},
						{
							key: 'procurement-quote-subsidiary-filter',
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
							key: 'procurement-quote-supplier-filter',
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
							key: 'quote-import-controllingunit-filter',
							serverSide: true,
							serverKey: 'basics.masterdata.controllingunit.filterkey',
							fn: function () {
								var currentItem = service.getSelected();
								if (currentItem) {
									var selectItem = currentItem.ReqHeaderEntity || currentItem;
									return {ProjectFk: selectItem.ProjectFk};
								}
							}
						},
						{
							key: 'businesspartner-certificate-quote-bp-filter',
							serverSide: true,
							serverKey: 'businesspartner-certificate-contract-bp-filter',
							fn: function () {
								var currentItem = service.getSelected();
								if (currentItem) {
									return {
										Ids: [(currentItem.BusinessPartnerFk)]
									};
								}
							}
						},
						{
							key: 'prc-quote-billing-schema-filter',
							serverSide: true,
							fn: function (currentItem) {
								if (!currentItem || !currentItem.Id) {
									return '';
								}
								var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: currentItem.ConfigurationFk});

								return 'PrcConfigHeaderFk=' + (config ? config.PrcConfigHeaderFk : -1);
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
							key: 'procurement-quote-rfq-businesspartner-filter',
							serverSide: true,
							serverKey: 'procurement-quote-rfq-businesspartner-filter',
							fn: function () {
								return {
									ApprovalBPRequired: true,
								};
							}
						}
					];

					basicsLookupdataLookupDescriptorService.loadData(['rfqStatus', 'PrcConfiguration']);
					// register filter by hand
					service.registerFilters = function registerFilters() {
						basicsLookupdataLookupFilterService.registerFilter(filters);
						onFilterLoaded.fire(moduleName);
					};

					// unload filters
					service.unRegisterFilters = function () {
						basicsLookupdataLookupFilterService.unregisterFilter(filters);
						onFilterUnLoaded.fire(moduleName);
					};

					// filter events
					service.registerFilterLoad = function (func) {
						onFilterLoaded.register(func);
					};

					service.registerFilterUnLoad = function (func) {
						onFilterUnLoaded.register(func);
					};
					service.targetSectionId = 7;
				}

			}]
		/** @namespace e.IsCanceled */
		/** @namespace e.IsQuoted */
		/** @namespace e.IsOrdered */
	);

	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementQuoteCertificateActualDataService', ['businesspartnerCertificateCertificateContainerServiceFactory', 'procurementQuoteHeaderDataService',
		function (dataServiceFactory, parentService) {
			return dataServiceFactory.getDataService(moduleName, parentService);
		}]);

})(angular);