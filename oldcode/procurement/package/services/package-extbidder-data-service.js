/**
 * Created by lcn on 11/16/2021.
 */
(function (angular) {
	'use strict';
	var module = angular.module('procurement.package');
	// eslint-disable-next-line no-redeclare
	/* global globals, angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackage2ExtBidderService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementPackage2ExtBidderReadonlyProcessor',
			'ServiceDataProcessDatesExtension', 'platformRuntimeDataService', 'procurementContextService',
			'$injector', '$http', 'procurementModuleName', 'platformNavBarService', 'procurementPackage2ExtBidderValidationService',
			'procurementPackageDataService','platformDialogService','basicsLookupdataLookupFilterService',
			function (dataServiceFactory, lookupDescriptorService, procurementPackage2ExtBidderReadonlyProcessor,
				ServiceDataProcessDatesExtension, runtimeDataService, moduleContext,
				$injector, $http, procurementModuleName, platformNavBarService, procurementPackage2ExtBidderValidationService,
				procurementPackageDataService,platformDialogService,basicsLookupdataLookupFilterService) {

				function constructorFn(moduleName, leadingService, directParentServiceName) {
					var serviceContainer;
					var listResult = {};
					var service;
					var serviceOption = {
						flatNodeItem: {
							module: module,
							serviceName: 'procurementPackage2ExtBidderService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/package/extbidder/',
								endCreate: 'createnew',
								initReadData: initReadData
							},
							presenter: {
								list: {
									initCreationData: initCreationData,
									incorporateDataRead: incorporateDataRead
								}
							},
							dataProcessor: [procurementPackage2ExtBidderReadonlyProcessor],
							entityRole: {
								node: {
									itemName: 'PrcPackage2ExtBidder',
									parentService: leadingService
								}
							},
							actions: {
								delete: true, create: 'flat',
								canCreateCallBackFunc: function () {
									return !moduleContext.isReadOnly;
								},
								canDeleteCallBackFunc: function () {
									return !moduleContext.isReadOnly;
								}
							}
						}
					};

					serviceContainer = dataServiceFactory.createNewComplete(serviceOption, {readonly: ['Id']});

					service = serviceContainer.service;
					serviceContainer.data.doesRequireLoadAlways = true;
					service.reload = function () {
						serviceContainer.data.usesCache = false;
						serviceContainer.data.doReadData(serviceContainer.data);
					};
					service.clearCache = function clearCacheAndItems() {
						serviceContainer.data.cache = {};
						serviceContainer.service.setList([]);
					};
					service.getParentService = function getParentService() {
						return serviceContainer.data.parentService;
					};
					serviceContainer.data.doPrepareDelete = function doPrepareDelete(deleteParams) {
						deleteParams.entity = deleteParams.entities[0];
						deleteParams.entities = null;
					};
					var onDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function onDeleteDoneSucceeded(/* data */) {
						onDeleteDone.apply(serviceContainer.data, arguments);
						let itemList = service.getList();
						service.setSelected(itemList[itemList.length - 1]);
					};

					service.PackageFk = -1;
					service.getFieldDisplayText = function (model, id, field) {
						var ret = '';
						var modelData;
						if (model === 'ContactFk') {
							modelData = listResult.contact;
						}

						if (modelData && modelData.length > 0) {
							for (var i = 0; i < modelData.length; ++i) {
								if (modelData[i].Id === id) {
									ret = modelData[i][field];
									break;
								}
							}
						}
						return ret;
					};
					service.updateReadOnly = function (item, modelArray) {
						angular.forEach(modelArray, function (model) {
							var editable = procurementPackage2ExtBidderReadonlyProcessor.getCellEditable(item, model);
							runtimeDataService.readonly(item, [{field: model, readonly: !editable}]);
						});

					};

					leadingService.registerItemModified(leadingServiceModifyItem);
					leadingService.registerSelectionChanged(leadingServiceSelected);

					if (directParentServiceName) {
						leadingService.unregisterSelectionChanged(leadingServiceSelected);
						leadingService.unregisterItemModified(leadingServiceModifyItem);
						var directParentService = $injector.get(directParentServiceName);
						if (directParentService) {
							service.directParentService = directParentService;
							directParentService.registerItemModified(directParentServiceItemModified);
							directParentService.registerSelectionChanged(directParentServiceSelectionChanged);
						}
					}

					function getPackageFk() {
						var selectItem = leadingService.getSelected();
						var mainItemId = -1;
						if (!service.directParentService) {
							service.PackageFk = -1;
						}
						switch (moduleName) {
							case procurementModuleName.pesModule:
							case procurementModuleName.contractModule:
							case procurementModuleName.requisitionModule:
							case procurementModuleName.rfqModule:
								mainItemId = selectItem ? selectItem.PackageFk : -1;
								break;
							case procurementModuleName.invoiceModule:
								mainItemId = selectItem ? selectItem.PrcPackageFk : -1;
								break;
							case procurementModuleName.quoteModule:
								mainItemId = selectItem ? ((selectItem.ReqHeaderEntity !== undefined ? selectItem.ReqHeaderEntity.PackageFk : undefined) || service.PackageFk) : -1;
								break;
							case procurementModuleName.packageModule:
								mainItemId = selectItem ? selectItem.Id : -1;
								break;
						}
						return mainItemId||-1;
					}

					function initReadData(readData) {
						var mainItemId = getPackageFk();
						readData.filter = '?mainItemId=' + (mainItemId || -1);

					}

					function initCreationData(creationData) {
						creationData.mainItemId = getPackageFk();
					}

					function incorporateDataRead(result, data) {
						listResult = result;
						let option = {
							moduleName: moduleName,
							leadingService: service,
							directParentServiceName: null
						};
						const ext2ContactService = $injector.get('packageExtBidder2ContactDataService').createExt2ContactService(option);
						ext2ContactService.clearCache();
						return serviceContainer.data.handleReadSucceeded(result.Main, data, true);
					}

					function leadingServiceModifyItem(e, item) {
						if (moduleName === procurementModuleName.rfqModule || moduleName === procurementModuleName.quoteModule ||
							moduleName === procurementModuleName.packageModule) {
							return;
						}
						var packageFk = item.PackageFk;
						if (moduleName === procurementModuleName.packageModule) {
							packageFk = item.Id;
						} else if (moduleName === procurementModuleName.invoiceModule) {
							packageFk = item.PrcPackageFk;
						}
						if (packageFk !== service.PackageFk) {
							service.load();
							service.PackageFk = packageFk || -1;
						}
					}

					function leadingServiceSelected(e, item) {
						var packageFk = null;
						if (item) {
							switch (moduleName) {
								case procurementModuleName.packageModule:
									packageFk = item.Id;
									break;
								case procurementModuleName.invoiceModule:
									packageFk = item.PrcPackageFk;
									break;
								default:
									packageFk = item.PackageFk;
									break;
							}
						}
						service.PackageFk = packageFk || -1;
					}

					function directParentServiceItemModified(e, item) {
						if (service.directParentService) {
							// if(procurementModuleName[moduleName])
							var incloudeModule = _.includes(procurementModuleName, moduleName);
							if (incloudeModule) {
								loadExtBidder(item);
							}
						}
					}

					function directParentServiceSelectionChanged(e, item) {
						loadExtBidder(item);
					}

					function loadExtBidder(item) {
						if (service.directParentService) {
							if (item) {
								if (moduleName === procurementModuleName.rfqModule || moduleName === procurementModuleName.requisitionModule || moduleName === procurementModuleName.contractModule || moduleName === procurementModuleName.pesModule) {
									service.PackageFk = item.PackageFk || -1;
								} else if (moduleName === procurementModuleName.invoiceModule) {
									service.PackageFk = item.PrcPackageFk || -1;
								} else if (moduleName === procurementModuleName.quoteModule) {
									service.PackageFk = item.ReqHeaderEntity ? item.ReqHeaderEntity.PackageFk : -1;
								}
								service.load();
							}
						}
					}

					service.init = function init() {
						service.PackageFk = -1;
						if (service.directParentService) {
							if (service.directParentService.hasSelection()) {
								var items = service.directParentService.getList();
								if (items.length > 0) {
									var firstItem = _.sortBy(items, 'Id')[0];
									switch (moduleName) {
										case procurementModuleName.quoteModule:
											service.PackageFk = firstItem.ReqHeaderEntity ? firstItem.ReqHeaderEntity.PackageFk : -1;
											break;
										case procurementModuleName.rfqModule:
											service.PackageFk = firstItem.PackageFk;
											break;
									}
								}
							}
						} else {
							if (leadingService.hasSelection()) {
								switch (moduleName) {
									case procurementModuleName.packageModule:
										service.PackageFk = leadingService.getSelected().Id;
										break;
									case procurementModuleName.invoiceModule:
										service.PackageFk = leadingService.getSelected().PrcPackageFk;
										break;
									default:
										service.PackageFk = leadingService.getSelected().PackageFk;
										break;
								}
							}
						}
					};

					var baseCreateItem = service.createItem;
					service.createItem = function createItem() {
						if (getPackageFk()> -1) {
							baseCreateItem();
						} else {
							platformDialogService.showInfoBox('procurement.common.extBidderPackageMissing');
						}
					};

					var filters = [
						{
							key: 'procurement-package-extbidder-businesspartner-subsidiary-filter',
							serverSide: true,
							serverKey: 'businesspartner-main-subsidiary-common-filter',
							fn: function () {
								var currentItem = loadControllerInitData().dataService.getSelected();
								return {
									BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null
								};
							}
						},
						{
							key: 'procurement-package-extbidder-businesspartner-contact-filter',
							serverSide: true,
							serverKey: 'procurement-rfq-businesspartner-contact-filter',
							fn: function () {
								var currentItem = loadControllerInitData().dataService.getSelected();
								return {
									BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
									SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
								};
							}
						}
					];

					basicsLookupdataLookupFilterService.registerFilter(filters);
					return service;
				}

				var serviceCache = {};

				function getProcurementExtBidderService(option) {
					var moduleName = option.moduleName;
					// eslint-disable-next-line no-prototype-builtins
					if (!serviceCache.hasOwnProperty(moduleName)) {
						serviceCache[moduleName] = constructorFn.apply(null, [option.moduleName, option.leadingService, option.directParentServiceName]);
					}
					var service = serviceCache[moduleName];
					service.init();
					return service;
				}

				function loadControllerInitData() {
					var option = {
						leadingService: procurementPackageDataService
					};
					try {
						option.leadingService = moduleContext.getLeadingService();
						// eslint-disable-next-line no-empty
					} catch (e) {
					}

					option.moduleName = option.leadingService ? option.leadingService.getModule().name : '';

					switch (option.moduleName) {
						case procurementModuleName.rfqModule:
							option.directParentServiceName = 'procurementRfqRequisitionService';
							break;
						case procurementModuleName.quoteModule:
							option.directParentServiceName = 'procurementQuoteRequisitionDataService';
							break;
						case procurementModuleName.requisitionModule:
							option.directParentServiceName = 'procurementRequisitionHeaderDataService';
							break;
						case procurementModuleName.contractModule:
							option.directParentServiceName = 'procurementContractHeaderDataService';
							break;
						case procurementModuleName.invoiceModule:
							option.directParentServiceName = 'procurementInvoiceHeaderDataService';
							break;
						case procurementModuleName.pesModule:
							option.directParentServiceName = 'procurementPesHeaderService';
							break;
						default:
							option.directParentServiceName = null;
							break;
					}
					var dataService = getProcurementExtBidderService(option);
					var validationService = procurementPackage2ExtBidderValidationService.getProcurementExtBidderValidationService(
						{
							moduleName: option.moduleName,
							service: dataService,
							parentService: option.moduleName === procurementModuleName.packageModule ? option.leadingService : null
						});

					return {
						dataService: dataService,
						validationService: validationService,
						moduleName: option.moduleName
					};
				}

				return {
					getProcurementExtBidderService: getProcurementExtBidderService,
					loadControllerInitData: loadControllerInitData
				};
			}]);
})(angular);