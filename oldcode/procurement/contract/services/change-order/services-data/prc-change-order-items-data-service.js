/**
 * Created by chd on 3/6/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementChangeOrderItemDataService',
		['$http', '$q', '$injector', 'procurementCommonDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'basicsCommonCurrencyHttpService', 'platformObjectHelper',
			'procurementChangeOrderContextService', 'PlatformMessenger', 'platformModuleStateService',
			'procurementCommonDataImageProcessor', 'ServiceDataProcessArraysExtension', 'procurementCommonOverviewDataService',
			'procurementCommonDataEnhanceProcessor', 'procurementCommonPrcItemReadonlyProcessor', 'ServiceDataProcessDatesExtension', 'platformRuntimeDataService',
			function ($http, $q, $injector, procurementCommonDataServiceFactory, basicsLookupdataLookupDescriptorService, currencyHttpService, platformObjectHelper,
				moduleContext, PlatformMessenger, platformModuleStateService,
				procurementCommonDataImageProcessor, ServiceDataProcessArraysExtension, procurementCommonOverviewDataService,
				procurementCommonDataEnhanceProcessor, readonlyProcessor, ServiceDataProcessDatesExtension, platformRuntimeDataService) {

				function getStopChangeStatus() {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/prcitem/externalstatus',
						params: {
							externalsourceDesc: 'YTWO Platform',
							externalCode: 'SUPPLIER_STOP_CHANGE'
						}
					}).then(function (respon) {
						return respon.data;
					});
				}

				function getAllDeliveryStatus() {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/prcitem/getdeliveredstatus',
					}).then(function (respon) {
						return respon.data;
					});
				}

				// create a new data service object
				function constructor(parentService, isTree) {
					var service = null;
					var stopChangeStatusId = 0;
					var deliveredStatusIds = [];
					getStopChangeStatus().then(function (id) {
						getAllDeliveryStatus().then(function (status) {
							if (id !== null) {
								stopChangeStatusId = id;
							} else {
								stopChangeStatusId = 9;
							}

							if (status !== null && angular.isArray(status)) {
								_.forEach(status, function (status) {
									deliveredStatusIds.push(status.Id);
								});
							}
						});
					});

					// service configuration
					var serviceContainer = null,
						readonlyLevel2 = ['prcitemstatusfk', 'daterequired', 'newdaterequired'],
						editableLevel1 = [],
						extendOptions = {
							date: ['DateRequired', 'NewDateRequired'],
							readonly: ['DateRequired', 'NewDateRequired'],
							overview: {
								key: moduleContext.overview.keys.item
							}
						},
						serviceOptions = {},
						defaultOptions = {
							module: angular.module(moduleName),
							entityRole: {
								node: {
									itemName: 'PrcItem',
									parentService: parentService,
									doesRequireLoadAlways: true
								}
							},
							actions: {delete: true},
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/common/prcitem/'
							},
							dataProcessor: [new ServiceDataProcessDatesExtension(['DeliverDateConfirm'])],
							presenter: {isInitialSorted: true}
						};

					var incorporateDataRead = function incorporateDataRead(readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData || {});
						var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;

						_.forEach(items, function (item) {
							if (item.NewDateRequired === null) {
								item.NewDateRequired = item.DateRequired;
							}

							if (item.NewAddress === null) {
								item.NewAddress = item.Address;
							}
						});

						var dataRead = data.handleReadSucceeded(items, data, true);
						// get leading item
						var headerItem = parentService.getSelected();
						if (!headerItem || !headerItem.Id) {
							return;
						}

						// update readonly
						angular.forEach(items, function (item) {
							service.setColumnsReadOnly(item, true);
						});
						return dataRead;
					};

					var initCreationData = function initCreationData(creationData, data, isMainItem) {
						var createToolItem = _.find(service.toolItems, {id: 'create'});
						if (!!creationData && !!createToolItem) {
							createToolItem.disabled = true;
							if (service.updateToolsEvent) {
								service.updateToolsEvent.fire();
							}
						}
						var parentServiceName = parentService.name;
						creationData.PrcPackageFk = null;
						creationData.IsPackage = false;
						creationData.parentId = isTree && !isMainItem ? serviceContainer.service.getIfSelectedIdElse(null) : null;
						creationData.InstancId = null;
						creationData.PrcHeaderFk = parentService.getSelected().PrcHeaderFk;
						creationData.ProjectFk = parentService.getSelected().ProjectFk;
						creationData.ConfigurationFk = parentService.getSelected().PrcHeaderEntity.ConfigurationFk;
						if (parentServiceName && parentServiceName === 'procurement.contract') {
							creationData.BasPaymentTermFiFk = parentService.getSelected().PaymentTermFiFk;
							creationData.BasPaymentTermPaFk = parentService.getSelected().PaymentTermPaFk;
							creationData.BasPaymentTermAdFk = parentService.getSelected().PaymentTermAdFk;
							creationData.FrmStyle = 2;// from  contract
							creationData.FrmHeaderFk = parentService.getSelected().Id;// from  contract
						}

						creationData.TaxCodeFk = service.getSelectedPrcHeader().TaxCodeFk;
						creationData.Itemnos = _.map(data.itemList, function (item) {
							return item.Itemno;
						});
					};

					var handleCreateSucceeded = function handleCreateSucceeded(newItem) {
						var createToolItem = _.find(service.toolItems, {id: 'create'});
						if (!!newItem && !!createToolItem) {
							createToolItem.disabled = false;
							if (service.updateToolsEvent) {
								service.updateToolsEvent.fire();
							}
						}
					};

					// create service options by isTree option
					if (isTree) {
						var isReadonly = function (currentItem, model) {
							return !serviceContainer.service.getCellEditable(currentItem, model);
						};
						var dataProcessService = function () {
							return {dataService: serviceContainer.service, validationService: null};
						};
						defaultOptions.dataProcessor.push(procurementCommonDataImageProcessor('PrcReplacementItemFk'));
						defaultOptions.dataProcessor.push(new ServiceDataProcessArraysExtension(['ReplacementItems']));
						defaultOptions.dataProcessor.push(procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementChangeOrderItemsUIStandardService', isReadonly));
						defaultOptions.actions.create = 'hierarchical';
						defaultOptions.presenter.tree = {
							parentProp: 'PrcReplacementItemFk',
							childProp: 'ReplacementItems',
							initCreationData: initCreationData,
							incorporateDataRead: incorporateDataRead
						};

						serviceOptions.hierarchicalNodeItem = defaultOptions;
					} else {
						defaultOptions.dataProcessor.push(readonlyProcessor);
						defaultOptions.actions.create = 'flat';
						defaultOptions.presenter.list = {
							initCreationData: initCreationData,
							incorporateDataRead: incorporateDataRead,
							handleCreateSucceeded: handleCreateSucceeded
						};
						serviceOptions.flatNodeItem = defaultOptions;
						_.forEach(editableLevel1, function (item) {
							extendOptions.readonly.push(item);
						});
						_.forEach(readonlyLevel2, function (item) {
							extendOptions.readonly.push(item);
						});
					}

					extendOptions.onUpdateDone = function onUpdateDone() {
						procurementCommonOverviewDataService.getService(parentService).load();
						var headerItem = parentService.getSelected();
						if (headerItem) {
							if (headerItem.MaterialCatalogFk) {
								var items = service.getList();
								angular.forEach(items, function (item) {
									service.setColumnsReadOnly(item, true);
								});
							}
						}
					};

					// bootstrap service
					serviceContainer = procurementCommonDataServiceFactory.createNewComplete(serviceOptions, extendOptions);
					service = serviceContainer.service;
					service.toolItems = null;
					service.setToolItems = function (toolItems) {
						service.toolItems = toolItems;
					};
					service.updateToolsEvent = new PlatformMessenger();
					moduleContext.setItemDataService(serviceContainer.service);
					moduleContext.setItemDataContainer(serviceContainer);

					// read service from serviceContainer

					// var data = serviceContainer.data;
					service.name = 'procurement.item';
					service.decimalRoundTo = 2;
					service.parentDataService = parentService;
					// var parentServiceName = parentService.name;

					/**
					 * @ngdoc function
					 * @name getCellEditable
					 * @function
					 * @methodOf procurement.common.procurementCommonPrcItemDataService
					 * @description get editable of model
					 * @returns boolean
					 */
					service.getCellEditable = function (item, model) {
						var editable = true;
						// var mainService = moduleContext.getMainService();
						if (model === 'PrcStructureFk') {
							editable = !item.MdcMaterialFk;
						} else if (model === 'DateRequired') {
							editable = !item.Hasdeliveryschedule;
						} else if (model === 'NewDateRequired') {
							editable = !item.Hasdeliveryschedule;
						}

						if (isTree) {
							if (item.Version === 0) {
								editable = true;
							}
							/** @namespace item.PrcReplacementItemFk */
							else {
								if (!item.PrcReplacementItemFk) {
									var child = item.ReplacementItems;
									if (child && child.length) {
										editable = false;
									} else {
										editable = editableLevel1.indexOf(model.toLocaleLowerCase()) !== -1;
									}
								} else {
									editable = readonlyLevel2.indexOf(model.toLocaleLowerCase()) === -1;
								}
							}
						}
						return editable;
					};

					var onUpdateDone = function (response) {
						if (!response) {
							return;
						}
						var data = serviceContainer.data;
						data.disableWatchSelected(data);
						data.trackSelections(service.getSelected(), data);// TODO: for adding current item to data.selection, this work should be done by dataServiceFactory
						data.enableWatchSelected(data.selectedItem, data);
					};
					parentService.registerUpdateDone(onUpdateDone);// Frank, 2015-06-12: This will not work any longer. How to fix will be discussed next Monday

					// this method will call when scheduled quantity changed
					// if quantityScheduled is not zero, Hasdeliveryschedule in current item will set true.
					service.onDeliveryScheduleRecordChanged = function (quantityScheduled) {
						var currentItem = service.getSelected();
						if (!currentItem) {
							return;
						}

						var hasDeliveryScheduled = quantityScheduled.length > 0;
						currentItem.Hasdeliveryschedule = !!currentItem.Hasdeliveryschedule; // force it as a bool value
						if (currentItem.Hasdeliveryschedule !== hasDeliveryScheduled) {
							currentItem.Hasdeliveryschedule = hasDeliveryScheduled;

							service.markCurrentItemAsModified();
							currentItem.DateRequired = currentItem.Hasdeliveryschedule ? null : currentItem.DateRequired;
							service.updateReadOnly(currentItem, 'DateRequired');
							currentItem.NewDateRequired = currentItem.Hasdeliveryschedule ? null : currentItem.NewDateRequired;
							service.updateReadOnly(currentItem, 'NewDateRequired');
							service.fireItemModified(currentItem);
						}
					};

					// Set some columns readonly when parent item have material Catalog
					service.setColumnsReadOnly = function (item, readOnly) {

						if (item.Hasdeliveryschedule) {
							platformRuntimeDataService.readonly(item, [{field: 'NewDateRequired', readonly: readOnly}]);
						}

						if (item.PrcItemstatusFk === stopChangeStatusId) {
							platformRuntimeDataService.readonly(item, [{field: 'NewAddress', readonly: readOnly}]);
							platformRuntimeDataService.readonly(item, [{field: 'NewDateRequired', readonly: readOnly}]);
						}

						_.forEach(deliveredStatusIds, function (deliveredStatusId) {
							if (item.PrcItemstatusFk === deliveredStatusId) {
								platformRuntimeDataService.readonly(item, [{field: 'NewAddress', readonly: readOnly}]);
								platformRuntimeDataService.readonly(item, [{field: 'NewDateRequired', readonly: readOnly}]);
							}
						});
					};

					service.getSelectedPrcHeader = function getSelectedPrcHeader() {
						return (service.parentDataService.getSelectedPrcHeader || service.parentDataService.getSelected)();
					};

					return service;
				}

				return procurementCommonDataServiceFactory.createService(constructor, 'procurementChangeOrderItemDataService');
			}
		]);
})(angular);
