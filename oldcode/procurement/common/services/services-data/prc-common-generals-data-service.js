(function (angular) {
	'use strict';
	/* global _,globals */

	var moduleName = 'procurement.common';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonGeneralsDataService',
		['$http', 'procurementCommonDataServiceFactory', 'cloudDesktopSidebarService', 'procurementContextService', '$translate',
			'platformContextService', 'basicsLookupdataLookupDescriptorService', 'procurementCommonGeneralsReadonlyProcessor', 'basicsCommonReadDataInterceptor', 'platformRuntimeDataService',
			'PlatformMessenger', 'purchaseOrderType',
			function ($http, dataServiceFactory, cloudDesktopSidebarService, moduleContext, $translate,
				platformContextService, basicsLookupdataLookupDescriptorService, readonlyProcessor, readDataInterceptor, runtimeDataService, PlatformMessenger, purchaseOrderType) {

				// create a new data service object
				function constructorFn(parentService) {

					// properties
					// retrieve leading data service
					var service;
					var initCreationData = function initCreationData(creationData, reloadArgs) {
							var prcParentItem = parentService.getSelected();
							if (prcParentItem !== undefined && prcParentItem !== null) {
								var prcHeader = prcParentItem.PrcHeaderEntity;
								creationData.MainItemId = prcHeader.Id;
								creationData.ConfigurationFk = prcHeader.ConfigurationFk;
								creationData.StructureFk = prcHeader.StructureFk;
								creationData.ProjectFk = prcParentItem.ProjectFk || moduleContext.loginProject;
							}

							if (_.isObject(reloadArgs) && reloadArgs) {// if have original data to get
								creationData.OriginalConfigurationFk = reloadArgs.originalConfigurationFk;
								creationData.OriginalStructureFk = reloadArgs.originalStructureFk;
							}
						},
						initCreationDataByChangeStructure = function initCreationDataByChangeStructure(creationData, reloadArgs) {
							// noinspection JSUnusedAssignment
							creationData = reloadArgs;
						},

						// service configuration
						serviceContainer = null,
						tmpServiceInfo = {
							flatLeafItem: {
								serviceName: 'procurementCommonGeneralsDataService',
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/prcgenerals/'
								},
								actions: {
									delete: {},
									create: 'flat',
									canCreateCallBackFunc: function () {
										return service.canCreate();
									},
									canDeleteCallBackFunc: function () {
										return service.canDelete();
									}
								},
								presenter: {
									list: {
										initCreationData: initCreationData,
										incorporateDataRead: incorporateDataRead
									}
								},
								entityRole: {leaf: {itemName: 'PrcGenerals', parentService: parentService, doesRequireLoadAlways: true}},
								dataProcessor: [readonlyProcessor]
							}
						};

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						readonly: ['ControllingUnitFk', 'TaxCodeFk'],
						overview: {key: moduleContext.overview.keys.general},
						reload: {
							ParentTriggerKey: ['ConfigurationFk', 'StructureFk'],
							route: globals.webApiBaseUrl + 'procurement/common/prcgenerals/reload',
							initReloadData: initCreationData,
							clearHandler: function (reloadData) {// use to clear item in common dataService
								/** @namespace reloadData.OriginalGeneralTypes */
								if (reloadData && reloadData.OriginalGeneralTypes) {// delete original data exist in current list
									angular.forEach(service.getList(), function (item) {
										if (reloadData.OriginalGeneralTypes && item.PrcGeneralstypeFk && _.includes(reloadData.OriginalGeneralTypes, item.PrcGeneralstypeFk)) {
											serviceContainer.data.deleteItem(item, serviceContainer.data);
										}
									});
									delete reloadData.OriginalGeneralTypes;
								}
							}
						},
						onOverWriteSuccessed: function (loadedData) {
							angular.forEach(loadedData.data, function (item) {
								// same type update
								var hasSomeTypeItem = _.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk});
								if (hasSomeTypeItem) {
									_.extend(hasSomeTypeItem, item);
									service.markItemAsModified(hasSomeTypeItem);
								} else {
									serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
								}
							});
							// set as readOnly after overWrite from basis contract in contract module
							var moduleName = moduleContext.getModuleName();
							if (moduleName === 'procurement.contract') {
								setGeneralItemsReadOnly(true);
								disableCreate(true);
								disableDelete(true);
							}
						},
						onReloadSucceeded: function (loadedData) {
							basicsLookupdataLookupDescriptorService.attachData(loadedData);
							angular.forEach(loadedData.Main, function (item) {
								if (serviceContainer.data.handleCreateSucceededWithoutSelect && !_.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk})) {
									serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
								}
							});
						},
						setItemsReadOnly: function (isReadOnly) {
							setGeneralItemsReadOnly(isReadOnly);
						},
						reloadByChangeStructure: {
							route: globals.webApiBaseUrl + 'procurement/common/prcgenerals/loadbychangestructure',
							initReloadData: initCreationDataByChangeStructure,
							clearHandler: function (reloadData) {// use to clear item in common dataService
								if (reloadData) {// delete original data exist in current list
									angular.forEach(service.getList(), function (item) {
										serviceContainer.data.deleteItem(item, serviceContainer.data);
									});
								}
							}
						}
					}
					);
					// read service from serviceContainer
					service = serviceContainer.service;
					readDataInterceptor.init(serviceContainer.service, serviceContainer.data);

					service.reload = function () {
						serviceContainer.data.usesCache = false;
						serviceContainer.data.doReadData(serviceContainer.data);
						// serviceContainer.data.usesCache = true;//todo:latter modify.the leaf container cache defect,so set useCache false
					};

					// add clearCache method for reading data from database
					service.clearCache = function clearCacheAndItems() {
						serviceContainer.data.cache = {};

						serviceContainer.service.setList([]);
					};
					// reload items from configuration in server side.
					/* service.loadItemsFromConfig = function loadItemsFromConfig(onLoadDone) {
						var uri = serviceContainer.data.httpCreateRoute + 'reload';
						var creationData = {};
						initCreationData(creationData);
						$http.post(uri, creationData).then(function (response) {
							angular.forEach(response.data.Main, function (item) {
								basicsLookupdataLookupDescriptorService.attachData(response.data || {});
								if (serviceContainer.data.onCreateSucceeded) {
									serviceContainer.data.onCreateSucceeded(item, serviceContainer.data, creationData);
								}
								if (onLoadDone) {
									onLoadDone(item, serviceContainer.data, creationData);
								}
							});
						});
					}; */

					/**
					 * @ngdoc function
					 * @name getCellEditable
					 * @function
					 * @methodOf procurement.common.procurementCommonGeneralsDataService
					 * @description get editable of model
					 * @returns bool
					 */
					service.getCellEditable = readonlyProcessor.getCellEditable;

					service.registerLookupFilters({
						'prc-req-mdc-controll-filter': {
							fn: function (dataItem) {
								// The hierarchical Lookup automatically restricts to controlling units for the current log in company
								// MDC_CONTROLLINGUNIT.MDC_CONTEXT_FK = BAS_COMPANY.MDC_CONTEXT_FK
								var projectContext = platformContextService.getApplicationValue(cloudDesktopSidebarService.appContextProjectContextKey);
								return (dataItem.PrjProjectFk === projectContext.pId);
							}
						},
						'prc-generals-controlling-unit-filter': {
							serverSide: true,
							serverKey: 'prc.con.controllingunit.by.prj.filterkey',
							fn: function () {
								var currentItem = parentService.getSelected();
								if (currentItem) {
									var selectItem = currentItem.ReqHeaderEntity || currentItem;
									return {
										ByStructure: true,
										ExtraFilter: true,
										PrjProjectFk: selectItem.ProjectFk,
										CompanyFk: null
									};
								}
							}
						},
						'procurement-common-generals-type-lookup': {
							serverSide: true,
							fn: function () {
								return 'IsProcurement = true';
							}
						}
					});

					service.updateToolsEvent = new PlatformMessenger();

					service.toolItems = null;
					service.setToolItems = function (toolItems) {
						service.toolItems = toolItems;
					};

					service.canCreate = function () {
						var parentItem = parentService.getSelected();
						var moduleName = parentService.getModule().name;
						if (moduleName === 'procurement.contract' && parentItem !== null && !angular.isUndefined(parentItem.ConHeaderFk) && parentItem.ConHeaderFk !== null && parentItem.ProjectChangeFk !== null) {
							return false;
						} else {
							return !moduleContext.isReadOnly && !!parentItem && !!parentItem.Id;
						}
					};

					service.canDelete = function () {
						var parentItem = parentService.getSelected();
						var moduleName = parentService.getModule().name;
						if (moduleName === 'procurement.contract' && parentItem !== null && !angular.isUndefined(parentItem.ConHeaderFk) && parentItem.ConHeaderFk !== null && parentItem.ProjectChangeFk !== null) {
							return false;
						} else {
							return !moduleContext.isReadOnly;
						}
					};

					service.reloadGeneralsByBusinessPartnerFk = function reloadGeneralsByBusinessPartnerFk(dataEntity) {
						$http.post(globals.webApiBaseUrl + 'procurement/common/prcgenerals/reloadbybp', dataEntity).then(function (res) {
							if (res && res.data) {
								var originaltypes = res.data.OriginalGeneralTypes;
								var main = res.data.Main;
								if (originaltypes) {
									serviceContainer.data.supportUpdateOnSelectionChanging = false;
									angular.forEach(service.getList(), function (item) {
										if (item.PrcGeneralstypeFk && _.includes(originaltypes, item.PrcGeneralstypeFk)) {
											serviceContainer.data.deleteItem(item, serviceContainer.data);
										}
									});
									serviceContainer.data.supportUpdateOnSelectionChanging = true;
								}
								if (main) {
									angular.forEach(main, function (item) {
										if (serviceContainer.data.handleCreateSucceededWithoutSelect && !_.find(service.getList(), {PrcGeneralstypeFk: item.PrcGeneralstypeFk})) {
											serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
										}
									});
								}
							}
						});
					};

					function incorporateDataRead(readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData || {});

						readData.Main = readData.Main || readData;
						var dataRead = data.handleReadSucceeded(readData.Main, data, true);
						var prcParentItem = parentService.getSelected();
						if (!prcParentItem) {
							return dataRead;
						}
						var parentServiceName = parentService.name;
						var isChangeOrder = _.isNil(prcParentItem) ? false : prcParentItem.PurchaseOrders === purchaseOrderType.changeOrder;
						var prcGeneralsType = basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType');
						if (parentServiceName && parentServiceName === 'procurement.contract' && prcParentItem !== null && prcParentItem.ConHeaderFk !== null && prcParentItem.ProjectChangeFk !== null) {
							angular.forEach(readData.Main, function (item) {
								runtimeDataService.readonly(item, [{field: 'PrcGeneralstypeFk', readonly: true}]);
								runtimeDataService.readonly(item, [{field: 'ControllingUnitFk', readonly: true}]);
								runtimeDataService.readonly(item, [{field: 'ValueType', readonly: true}]);
								runtimeDataService.readonly(item, [{field: 'CommentText', readonly: true}]);
								var isValueReadOnly = true;
								var data = _.find(prcGeneralsType, {Id: item.PrcGeneralstypeFk});
								if (angular.isObject(data)) {
									// For change order, if general type is % type, this line cannot be changed. Else if non % type, user can change value field
									if (!data.IsPercent && isChangeOrder) {
										isValueReadOnly = false;
									}
								}
								runtimeDataService.readonly(item, [{field: 'Value', readonly: isValueReadOnly}]);

								runtimeDataService.readonly(item, [{field: 'TaxCodeFk', readonly: true}]);
							});
						}

						return dataRead;
					}

					/* function buttonIsReadOnly(){
						var prcParentItem = parentService.getSelected();
						return prcParentItem !== null && prcParentItem.ConHeaderFk !== null;

					} */

					function disableCreate(flag) {
						var createToolItem = _.find(service.toolItems, {id: 'create'});
						if (createToolItem) {
							createToolItem.disabled = flag;
							if (service.updateToolsEvent) {
								service.updateToolsEvent.fire();
							}
						}
					}

					function disableDelete(flag) {
						var deleteToolItem = _.find(service.toolItems, {id: 'delete'});
						if (deleteToolItem) {
							deleteToolItem.disabled = flag;
							if (service.updateToolsEvent) {
								service.updateToolsEvent.fire();
							}
						}
					}

					/* function canDeleteCallBackFunc(selected) {
						return !!selected;
					} */

					function setGeneralItemsReadOnly(isReadOnly) {
						var items = service.getList();
						var parenEntity = parentService.getSelected();
						if (!parenEntity) {
							return;
						}
						var isChangeOrder = parentService.getSelected().PurchaseOrders === purchaseOrderType.changeOrder;
						var prcGeneralsType = basicsLookupdataLookupDescriptorService.getData('PrcGeneralsType');

						angular.forEach(items, function (item) {
							runtimeDataService.readonly(item, [{field: 'PrcGeneralstypeFk', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'ControllingUnitFk', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'ValueType', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'CommentText', readonly: isReadOnly}]);
							var isValueReadOnly = isReadOnly;
							var data = _.find(prcGeneralsType, {Id: item.PrcGeneralstypeFk});
							if (angular.isObject(data)) {
								// For change order, if general type is % type, this line cannot be changed. Else if non % type, user can change value field
								if (!data.IsPercent && isChangeOrder) {
									isValueReadOnly = false;
								}
							}
							runtimeDataService.readonly(item, [{field: 'Value', readonly: isValueReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'TaxCodeFk', readonly: isReadOnly}]);
						});
						disableCreate(isReadOnly);
						disableDelete(isReadOnly);
						service.gridRefresh();

					}

					// do create the certificate item when parent created
					var onParentItemCreated = function onParentItemCreated(e, args) {
						/** @namespace args.Generals */
						if (!angular.isUndefined(args.Generals)) {
							service.setCreatedItems(args.Generals, true).then(function () {
							});

						}
						// if(args.Package2HeaderComplete!=null){
						// service.setCreatedItems(args.Package2HeaderComplete.Generals, true);
						// }
					};

					if (parentService.completeItemCreated) {
						parentService.completeItemCreated.register(onParentItemCreated);
					}

					return service;
				}

				return dataServiceFactory.createService(constructorFn, 'procurementCommonGeneralsDataService');
			}
		]);
})(angular);
