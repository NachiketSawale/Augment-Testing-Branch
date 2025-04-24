(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';
	/**
	 * @ngdoc service
	 * @name procurementCommonCertificateNewDataService
	 * @function
	 * @requireds
	 *
	 * @description Provide requisition data
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonCertificateNewDataService',
		['$http', '_', 'procurementCommonDataServiceFactory', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService',
			'procurementCommonCertificateReadonlyProcessor', 'basicsCommonReadDataInterceptor', 'procurementContextService', 'platformRuntimeDataService', 'PlatformMessenger',
			'procurementCommonHelperService', 'ServiceDataProcessDatesExtension', 'procurementCommonTotalDataService', 'math', 'moment',
			function ($http, _, dataServiceFactory, basicsLookupdataLookupFilterService, basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService,
				readonlyProcessor, readDataInterceptor, moduleContext, runtimeDataService, PlatformMessenger,
				procurementCommonHelperService, ServiceDataProcessDatesExtension, procurementCommonTotalDataService, math, moment) {
				// create a new data service object
				var constructorFn = function (parentService) {
					// service configuration
					var service;
					var prcTotalDataService = procurementCommonTotalDataService.getService(parentService);
					var serviceContainer = null,
						// set the create parameters
						initCreationData = function initCreationData(creationData, reloadArgs) {
							var parent = parentService.getSelected();
							if (!_.isNil(parent)) {
								var prcHeader = parentService.getSelected().PrcHeaderEntity;
								if (!_.isNil(prcHeader)) {
									creationData.PrcConfigFk = prcHeader.ConfigurationFk;
									creationData.StructureFk = prcHeader.StructureFk;
									creationData.MainItemId = prcHeader.Id;
								}
							}

							if (_.isObject(reloadArgs) && reloadArgs) {// if have original data to get
								creationData.OriginalConfigurationFk = reloadArgs.originalConfigurationFk;
								creationData.OriginalStructureFk = reloadArgs.originalStructureFk;
							}
						},
						initCreationDataByChangeStructure = function initCreationData(creationData, reloadArgs) {
							var prcHeader = parentService.getSelected().PrcHeaderEntity;
							creationData.PrcConfigFk = prcHeader.ConfigurationFk;
							creationData.StructureFk = prcHeader.StructureFk;
							creationData.MainItemId = prcHeader.Id;
							if (_.isObject(reloadArgs) && reloadArgs) {// if have original data to get
								creationData.OriginalConfigurationFk = reloadArgs.originalConfigurationFk;
								creationData.OriginalStructureFk = reloadArgs.originalStructureFk;
							}
						},
						tmpServiceInfo = {
							flatLeafItem: {
								serviceName: 'procurementCommonCertificateNewDataService',
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/prccertificate/'
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
										initCreationData: initCreationData
									}
								},
								entityRole: {leaf: {itemName: 'PrcCertificate', parentService: parentService}},
								dataProcessor: [readonlyProcessor, new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])]
							}
						};

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						readonly: ['RequiredAmount'],
						date: ['RequiredBy'],
						reload: {
							route: globals.webApiBaseUrl + 'procurement/common/prccertificate/reload',
							initReloadData: initCreationData,
							clearHandler: function (reloadData) {// use to clear item in common dataService
								/** @namespace reloadData.OriginalCertificateTypes */
								if (reloadData && reloadData.OriginalCertificateTypes) {// delete original data exist in current list
									angular.forEach(service.getList(), function (item) {
										if (reloadData.OriginalCertificateTypes && item.BpdCertificateTypeFk && _.includes(reloadData.OriginalCertificateTypes, item.BpdCertificateTypeFk)) {
											serviceContainer.data.deleteItem(item, serviceContainer.data);
										}
									});
									delete reloadData.OriginalCertificateTypes;
								}
							}
						},
						onOverWriteSuccessed: function (loadedData) {
							angular.forEach(loadedData.data, function (item) {
								// same type update
								var hasSomeTypeItem = _.find(service.getList(), {BpdCertificateTypeFk: item.BpdCertificateTypeFk});
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
								setCertificateItemsReadOnly(true);
								disableCreate(true);
								disableDelete(true);
							}
						},
						onReloadSucceeded: function (loadedData) {
							basicsLookupdataLookupDescriptorService.attachData(loadedData);
							var netTotalItem = prcTotalDataService.getNetTotalItem();
							service.isCalculateAmount = false;
							angular.forEach(loadedData.Main, function (item) {
								if (serviceContainer.data.handleCreateSucceededWithoutSelect && !_.find(service.getList(), {BpdCertificateTypeFk: item.BpdCertificateTypeFk})) {
									if (item.GuaranteeCostPercent && netTotalItem) {
										item.RequiredAmount = Number(math.format(item.GuaranteeCostPercent * netTotalItem.ValueNet / 100, {precision: 14}));
									}
									serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
								}
							});
							service.isCalculateAmount = true;
						},
						reloadByChangeStructure: {
							route: globals.webApiBaseUrl + 'procurement/common/prccertificate/loadbychangestructure',
							initReloadData: initCreationDataByChangeStructure,
							clearHandler: function (reloadData) {// use to clear item in common dataService
								if (reloadData) {// delete original data exist in current list
									angular.forEach(service.getList(), function (item) {
										serviceContainer.data.deleteItem(item, serviceContainer.data);
									});
								}
							}
						}
					});
					// read service from serviceContainer
					service = serviceContainer.service;
					readDataInterceptor.init(serviceContainer.service, serviceContainer.data);

					service.reload = function () {
						serviceContainer.data.usesCache = false;
						serviceContainer.data.doReadData(serviceContainer.data);
						// serviceContainer.data.usesCache = true;//todo:latter modify.the leaf container cache defect,so set useCache false after read data set true
					};

					// add clearCache method for reading data from database
					service.clearCache = function clearCache() {
						serviceContainer.data.cache = {};

						serviceContainer.service.setList([]);
					};

					/**
					 * @description get editable of model
					 * @returns bool
					 */
					service.getCellEditable = readonlyProcessor.getCellEditable;

					// do create the certificate item when parent created
					var onParentItemCreated = function onParentItemCreated(e, args) {
						/** @namespace args.Certificates */
						if (!angular.isUndefined(args.Certificates)) {
							service.setCreatedItems(args.Certificates, true).then(function () {
							});

						}
					};

					if (parentService.completeItemCreated) {
						parentService.completeItemCreated.register(onParentItemCreated);

					}

					function setCertificateItemsReadOnly(isReadOnly) {
						var items = service.getList();
						angular.forEach(items, function (item) {
							runtimeDataService.readonly(item, [{field: 'RequiredAmount', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'BpdCertificateTypeFk', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'Isrequired', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'Ismandatory', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'Isrequiredsubsub', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'Ismandatorysubsub', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'RequiredBy', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'RequiredAmount', readonly: isReadOnly}]);
							runtimeDataService.readonly(item, [{field: 'CommentText', readonly: isReadOnly}]);
						});
						disableCreate(isReadOnly);
						disableDelete(isReadOnly);
						service.gridRefresh();

					}

					service.setCertificateItemsReadOnly = setCertificateItemsReadOnly;

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

					// copy certificates from other module such as project and material.
					service.copyCertificatesFromOtherModule = function (options) {

						procurementCommonHelperService.copyCertificatesFromOtherModule(options);
					};

					service.createCertificates = function (items) {
						if (serviceContainer.data.handleCreateSucceededWithoutSelect && angular.isArray(items)) {
							_.forEach(items, function (item) {
								serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
							});
						}
					};

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

					service.isCalculateAmount = true;
					service.configuration2certCache = null;
					service.clearConfiguration2certCache = function () {
						if (service.configuration2certCache) {
							service.configuration2certCache = null;
						}
					};
					parentService.registerSelectionChanged(service.clearConfiguration2certCache);
					service.calculateAmountExp = function (item, bpdCertificateTypeFk, certificateInfoList) {
						var configuration2cert = _.find(certificateInfoList, {BpdCertificateTypeFk: bpdCertificateTypeFk});
						if (configuration2cert) {
							item.GuaranteeCost = configuration2cert.GuaranteeCost;
							item.GuaranteeCostPercent = configuration2cert.GuaranteeCostPercent;
							if (configuration2cert.ValidFrom) {
								item.ValidFrom = moment.utc(configuration2cert.ValidFrom);
							} else {
								item.ValidFrom = null;
							}
							if (configuration2cert.ValidTo) {
								item.ValidTo = moment.utc(configuration2cert.ValidTo);
							} else {
								item.ValidTo = null;
							}
							var netTotalItem = prcTotalDataService.getNetTotalItem();
							item.RequiredAmount = configuration2cert.Amount;
							if (netTotalItem && configuration2cert.GuaranteeCostPercent) {
								item.RequiredAmount = Number(math.format(configuration2cert.GuaranteeCostPercent * netTotalItem.ValueNet / 100, {precision: 14}));
							}
						} else {
							item.GuaranteeCost = null;
							item.GuaranteeCostPercent = null;
							item.ValidFrom = null;
							item.ValidTo = null;
							item.RequiredAmount = 0;
						}
						service.gridRefresh();
					};
					service.calculateAmount = function (item, bpdCertificateTypeFk) {
						var parentItem = parentService.getSelected();
						if (parentItem) {
							var prcHeader = parentItem.PrcHeaderEntity;
							if (prcHeader.StructureFk) {
								// If data exist in cache, use cache data.
								if (service.configuration2certCache && service.configuration2certCache.PrcConfigFk === prcHeader.ConfigurationFk && service.configuration2certCache.StructureFk === prcHeader.StructureFk) {
									service.calculateAmountExp(item, bpdCertificateTypeFk, service.configuration2certCache.CertificateInfoList);
								} else {
									var paramData = {};
									paramData.PrcConfigFk = prcHeader.ConfigurationFk;
									paramData.StructureFk = prcHeader.StructureFk;
									paramData.MainItemId = prcHeader.Id;
									$http.post(globals.webApiBaseUrl + 'procurement/common/prccertificate/getconfig2certifcates', paramData)
										.then(function (response) {
											if (response.data) {
												var certificateCache = {};
												certificateCache.PrcConfigFk = prcHeader.ConfigurationFk;
												certificateCache.StructureFk = prcHeader.StructureFk;
												certificateCache.CertificateInfoList = response.data;
												service.configuration2certCache = certificateCache;
												service.calculateAmountExp(item, bpdCertificateTypeFk, response.data);
											}
										});
								}
							}
						}
					};
					service.recalculateAmountExp = function (item, costPercent) {
						var netTotalItem = prcTotalDataService.getNetTotalItem();
						if (item && costPercent && netTotalItem) {
							item.RequiredAmount = Number(math.format(costPercent * netTotalItem.ValueNet / 100, {precision: 14}));
						}
					};
					return service;
				};

				return dataServiceFactory.createService(constructorFn, 'procurementCommonCertificateNewDataService');
			}]);
})(angular);