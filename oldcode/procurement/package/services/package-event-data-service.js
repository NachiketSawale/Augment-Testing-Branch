/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	/* global _, globals */
	'use strict';
	var module = angular.module('procurement.package');

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').factory('procurementPackageEventService',
		['platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementPackageEventReadonlyProcessor',
			'ServiceDataProcessDatesExtension', 'platformRuntimeDataService', 'procurementContextService',
			'$injector', '$http', 'procurementModuleName', 'platformNavBarService', 'procurementPackageEventValidationService',
			'procurementPackageDataService',
			function (dataServiceFactory, lookupDescriptorService, readonlyProcessor,
				ServiceDataProcessDatesExtension, runtimeDataService, moduleContext,
				$injector, $http, procurementModuleName, platformNavBarService, procurementPackageEventValidationService,
				procurementPackageDataService) {

				function constructorFn(moduleName, leadingService, directParentServiceName) {

					var serviceContainer;
					var service;
					var serviceOption = {
						flatLeafItem: {
							module: module,
							serviceName: 'procurementPackageEventService',
							httpCreate: {route: globals.webApiBaseUrl + 'procurement/package/event/', endCreate: 'createdata'},
							httpRead: {
								route: globals.webApiBaseUrl + 'procurement/package/event/',
								initReadData: initReadData
							},
							dataProcessor: [readonlyProcessor, new ServiceDataProcessDatesExtension(['StartOverwrite', 'EndOverwrite',
								'StartCalculated', 'EndCalculated', 'StartActual', 'EndActual', 'StartRelevant', 'EndRelevant'])],
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										lookupDescriptorService.attachData(readData);
										_.forEach(readData.Main, function (item) {
											var lookUpItems = lookupDescriptorService.getData('PrcEventType');
											if (lookUpItems) {
												var lookUpItem = lookUpItems[item.PrcEventTypeFk];
												/** @namespace lookUpItem.HasStartDate */
												if (lookUpItem && !lookUpItem.HasStartDate) {
													item.StartOverwrite = null;
													item.StartRelevant = item.PrcEventTypeDto.startactual;
												}
											}
										});
										service.getProcurementStructureEvents();
										return serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									},
									handleCreateSucceeded: handleCreateSucceeded
								}
							},
							entityRole: {
								leaf: {
									itemName: 'PrcPackageEvent',
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

					function initReadData(readData) {
						var selectItem = leadingService.getSelected();
						var mainItemId = -1;
						if (!service.directParentService) {
							service.PackageFk = -1;
						}
						switch (moduleName) {
							case procurementModuleName.pesModule:
							case procurementModuleName.contractModule:
							case procurementModuleName.requisitionModule:
								mainItemId = selectItem ? selectItem.PackageFk : -1;
								break;
							case procurementModuleName.invoiceModule:
								mainItemId = selectItem ? selectItem.PrcPackageFk : -1;
								break;
							case procurementModuleName.quoteModule:
							case procurementModuleName.rfqModule:
								mainItemId = selectItem ? service.PackageFk : -1;
								break;
							case procurementModuleName.packageModule:
								mainItemId = selectItem ? selectItem.Id : -1;
								service.PackageFk = selectItem ? selectItem.Id : -1;
								break;
						}
						readData.filter = '?mainItemId=' + (mainItemId || -1);

					}

					serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;
					serviceContainer.data.doesRequireLoadAlways = true;// Frank B.: Otherwise the service.loadSubItemList will not work correctly when called from wizards.

					// service.registerEntityCreated(onEntityCreated);
					// TODO this is only mainServie is package need register
					if (moduleName === procurementModuleName.packageModule) {
						leadingService.registerPropertyChanged(onHeaderPropertyChanged);
					}

					serviceContainer.service.gridRefresh = serviceContainer.data.dataModified.fire;
					serviceContainer.service.getParentService = function getParentService() {
						return serviceContainer.data.parentService;
					};

					// reload item after event evaluation.
					// service.loadSubItemList = function(){ serviceContainer.data.loadSubItemList.apply(this, arguments); };//Frank B.: Already provided by data service factory

					var baseDeleteItem = service.deleteItem;
					service.deleteItem = function deleteItem(entity) {
						var eventType = _.find(lookupDescriptorService.getData('PrcEventType'), {Id: entity.PrcEventTypeFk});
						var procurementValidationService = $injector.get('procurementPackageEventValidationService');
						var valSrv = procurementValidationService.getProcurementEventValidationService({moduleName: moduleName, service: leadingService});

						var result = valSrv.validatePrcEventTypeFk(entity, entity.PrcEventTypeFk, 'PrcEventTypeFk');

						if (result.valid) {
							leadingService.firePrcEventProperChanged(null, eventType);
						}

						baseDeleteItem(entity);
					};

					/* jshint -W074 */ // The complexly warning is not need, logic in method is simple and readable
					service.getCellEditable = readonlyProcessor.getCellEditable;

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

					function onEntityCreated(item) {
						var eventType = _.find(lookupDescriptorService.getData('PrcEventType'), {Id: item.PrcEventTypeFk});
						item.PrcEventTypeDto = eventType;
						if (eventType.IsMainEvent) {
							leadingService.firePrcEventProperChanged(item);
							// var headerItem = parentService.getSelected();
							// _.set(headerItem,'MainEvent'+eventType.Id, item);
							// //headerItem.MainEventsDto.push(item);
							// parentService.markItemAsModified(headerItem);
							// parentService.setEntityReadOnly(headerItem);
						}
					}

					// noinspection JSUnusedLocalSymbols
					function onHeaderPropertyChanged(e, args) {
						if (args.model.indexOf('MainEvent') !== -1) {
							var headItemEvent = _.get(args.entity, args.model.slice(0, args.model.indexOf('.')));

							if (headItemEvent) {
								var mainEvent = getMainEventItem(headItemEvent);
								if (mainEvent) {
									serviceContainer.service.setSelected(mainEvent);
									// set new value to packageEvent
									if (args.model.indexOf('StartRelevant') !== -1) {
										mainEvent.StartOverwrite = args.value;
									} else if (args.model.indexOf('EndRelevant') !== -1) {
										mainEvent.EndOverwrite = args.value;
									}
									service.markItemAsModified(mainEvent);
								}
							}
						}
					}

					function getMainEventItem(headItemEvent) {
						return _.find(serviceContainer.data.itemList, {Id: headItemEvent.Id});
					}

					function handleCreateSucceeded(entity) {
						var procurementValidationService = $injector.get('procurementPackageEventValidationService');
						var valSrv = procurementValidationService.getProcurementEventValidationService({moduleName: moduleName, service: leadingService});
						var result = valSrv.validatePrcEventTypeFk(entity, entity.PrcEventTypeFk, 'PrcEventTypeFk');

						if (result.valid) {
							onEntityCreated(entity);
						}
					}

					var isUpdate = false;
					service.doUpdate = function (entities) {
						if (leadingService.isModelChanged()) {
							var selectedItem = leadingService.getSelected();
							if (selectedItem) {
								$injector.get('procurementPackageValidationService').validateAssetMasterFk(selectedItem, selectedItem.AssetMasterFk, 'AssetMasterFk');
							}
							leadingService.update().then(function (res) {
								if (res) {
									var reqData = {
										Entities: entities,
										MainItemId: service.PackageFk
									};
									if (reqData.MainItemId > 0 && !isUpdate) {
										isUpdate = true; // to fixed, when click the update button, it save before the data update in UI(this will pop up the error)
										$http.post(globals.webApiBaseUrl + 'procurement/package/event/update', reqData).then(function (response) {
											if (response && response.data) {
												service.load().finally(function () {
													isUpdate = false;
												});
											}
										});
									}
								}
							});
						}

					};

					service.PackageFk = -1;

					leadingService.registerItemModified(leadingServiceModifyItem);

					leadingService.registerSelectionChanged(leadingServiceSelected);

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

					function directParentServiceItemModified(e, item) {
						if (service.directParentService) {
							// if(procurementModuleName[moduleName])
							var incloudeModule = _.includes(procurementModuleName, moduleName);
							if (incloudeModule) {
								loadEvents(item);
							}
						}
					}

					function directParentServiceSelectionChanged(e, item) {
						loadEvents(item);
					}

					function loadEvents(item) {
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

					service.procurementStructureEventList = null;
					service.getProcurementStructureEvents = function () {
						var selectItem = leadingService.getSelected();
						if (!selectItem) {
							return;
						}
						var structureFk = selectItem.StructureFk ? selectItem.StructureFk : selectItem.PrcStructureFk;
						if (!structureFk && selectItem.PrcHeaderEntity) {
							structureFk = selectItem.PrcHeaderEntity.StructureFk ? selectItem.PrcHeaderEntity.StructureFk : selectItem.PrcHeaderEntity.PrcStructureFk;
						}
						if (structureFk) {
							$http.get(globals.webApiBaseUrl + 'basics/procurementstructure/event/list?mainItemId=' + structureFk).then(function (response) {
								if (response && response.data) {
									service.procurementStructureEventList = response.data.Main;
								}
							});
						}
					};
					return service;
				}

				var serviceCache = {};

				function getProcurementEventService(option) {
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
					var dataService = getProcurementEventService(option);
					var validationService = procurementPackageEventValidationService.getProcurementEventValidationService(
						{
							moduleName: option.moduleName,
							service: dataService,
							parentService: option.moduleName === procurementModuleName.packageModule ? option.leadingService : null
						});

					platformNavBarService.getActionByKey('save').fn = function () {
						var items = dataService.getList();
						dataService.doUpdate(items);
					};
					return {
						dataService: dataService,
						validationService: validationService,
						moduleName: option.moduleName,
						isPackageModule: option.moduleName === procurementModuleName.packageModule
					};
				}

				return {
					getProcurementEventService: getProcurementEventService,
					loadControllerInitData: loadControllerInitData
				};
			}]);
})(angular);