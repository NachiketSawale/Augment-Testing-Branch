/**
 * Created by lnb on 6/25/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	angular.module(moduleName).factory('procurementCommonServiceCache', ['procurementContextService', function (moduleContext) {
		var service = {}, serviceCache = {};
		service.registerService = function (constructor, name) {
			var service = function () {
				var mainService = moduleContext.getMainService();
				if (_.isNil(mainService)) {
					return {};
				}
				var dataServiceCache = serviceCache[mainService.name];
				if (!dataServiceCache) {
					dataServiceCache = {};
					serviceCache[mainService.name] = dataServiceCache;
				}
				var argument = arguments[0];
				var virtualName = name;
				if (argument && argument.markName) {
					virtualName = argument.markName + '.' + name;
				}

				var dataService = dataServiceCache[virtualName];
				if (!dataService) {
					try {
						dataService = constructor.apply(this, arguments);
					} catch (e) {
						dataService = constructor(mainService);
					}
					if (dataService) {
						dataServiceCache[virtualName] = dataService;
					}
				}
				return dataService;
			};
			return {getService: service};
		};

		return service;
	}]);

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonDataServiceFactory', ['platformDataServiceFactory', '$http', '$q', 'PlatformMessenger', 'procurementContextService',
		'procurementCommonServiceCache', 'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessDatesExtension', 'platformRuntimeDataService', 'basicsLookupdataLookupFilterService',
		'procurementCommonOverviewDataService', 'platformModalService', '$translate', 'SchedulingDataProcessTimesExtension', '_',
		function (dataServiceFactory, $http, $q, PlatformMessenger, moduleContext, serviceCache, basicsLookupdataLookupDescriptorService, ServiceDataProcessDatesExtension,
			runtimeDataService, basicsLookupdataLookupFilterService, procurementCommonOverviewDataService, platformModalService, $translate, SchedulingDataProcessTimesExtension) {
			var Service = function Service(options, extendOptions, parentService, _) {
				var service = {}, overviewDataService;

				var createReloadDataHandler = function createReloadDataHandler(container) {
					if (!extendOptions.reload) {
						return;
					}
					// clear original automatically generate items
					service.clearItems = function clearItems(reloadData) {
						if (extendOptions.reload) {
							if (!extendOptions.reload.clearHandler || !reloadData) {
								angular.forEach(service.getList(), function (item) {
									container.data.deleteItem(item, container.data);
								});
							} else {
								extendOptions.reload.clearHandler(reloadData);
							}
						}
					};

					var doReadData = container.data.doReadData;
					service.disableDoReadData = function disableDoReadData() {
						container.data.doReadData = function () {
							return $q.defer().promise;
						};
					};

					service.enableDoReadData = function enableDoReadData() {
						container.data.doReadData = doReadData;
					};

					service.overWriteData = function (entity, originalEntity) {
						// packageDataService
						if (options.flatLeafItem) {
							var config = options.flatLeafItem.httpCRUD;
							$http({method: 'get', url: config.route + 'copy?PrcHeaderFk=' + entity.PrcHeaderFk + '&oldPrcHeaderFk=' + originalEntity.PrcHeaderFk}).then(function (reloadData) {
								if (extendOptions.onOverWriteSuccessed) {
									extendOptions.onOverWriteSuccessed(reloadData);
								}

							}, function (error) {
								if (extendOptions.onOverWriteSuccessed) {
									extendOptions.onOverWriteSuccessed.call(error);
								}
							});
						}

					};

					service.setGeneralItemsReadOnly = function (isReadOnly) {
						extendOptions.setItemsReadOnly(isReadOnly);
					};

					service.reloadData = function reloadData(reloadArgs) {
						if (extendOptions.reload) {
							var config = extendOptions.reload;
							var param = {};
							if (config.initReloadData) {
								config.initReloadData(param, reloadArgs);
							}
							$http({method: 'post', url: config.route, data: param}).then(function (reloadData) {
								if (reloadData && reloadData.data) {
									// clear original Items which automatically generate
									service.clearItems(reloadData.data);

									if (extendOptions.onReloadSucceeded) {
										extendOptions.onReloadSucceeded.call(service, reloadData.data, param);
									} else {
										service.handleReloadSucceeded(reloadData.data);
									}
								}
							}, function (error) {
								if (extendOptions.onReloadSucceeded) {
									extendOptions.onReloadSucceeded.call(service, error, param);
								}
							});
						}
					};

					// attach lookup data after re-load
					service.handleReloadSucceeded = function handleReloadCompleted(loadedData) {
						basicsLookupdataLookupDescriptorService.attachData(loadedData);
						angular.forEach(loadedData.Main, function (item) {

							if (container.data.handleCreateSucceededWithoutSelect) {
								container.data.handleCreateSucceededWithoutSelect(item, container.data, service);
							}
						});
					};

					service.reloadDataByChangeStructure = function reloadDataByChangeStructure(reloadArgs) { // todo livia
						var defer = $q.defer();
						if (extendOptions.reloadByChangeStructure) {
							var config = extendOptions.reloadByChangeStructure;
							var param = {};
							if (config.initReloadData) {
								config.initReloadData(param, reloadArgs);
							}

							$http({method: 'post', url: config.route, data: reloadArgs}).then(function (reloadData) {
								if (reloadData && reloadData.data) {
									// reload list and refresh container
									// container.data.doReadData(container.data);
									// service.gridRefresh();
									defer.resolve(reloadData.data);
								}
							}, function (error) {
								platformModalService.showMsgBox(error, $translate.instant('procurement.package.wizard.reloadErrorTitle'), 'info');
								return false;
							});
						}
						return defer.promise;
					};

					service.reloadDataByChangeBusinessPartner = function reloadDataByChangeBusinessPartner(reloadArgs) { // todo livia
						var defer = $q.defer();
						var route = globals.webApiBaseUrl + 'procurement/common/prcgenerals/loadbychangebp';
						$http({method: 'post', url: route, data: reloadArgs}).then(function (reloadData) {
							if (reloadData && reloadData.data) {
								defer.resolve(reloadData.data);
							}
						}, function (error) {
							platformModalService.showMsgBox(error, $translate.instant('procurement.package.wizard.reloadErrorTitle'), 'info');
							return false;
						});

						return defer.promise;
					};
				};

				var createSubSubServiceClearDataHandler = function createSubSubServiceClearDataHandler(container) {

					container.removeCache = function removeCache(entity/* , data */) {
						if (container.data.cache) {
							if (entity && container.data.currentParentItem && container.data.cache[container.data.currentParentItem.Id]) {
								var index = _.indexOf(container.data.cache[container.data.currentParentItem.Id], entity);
								if (index >= 0) {
									container.data.cache[container.data.currentParentItem.Id].splice(index, 1);
								}
							} else {
								container.data.cache = [];
							}
						}
					};

					var leadingService = moduleContext.getLeadingService();
					var basDeleteItem = container.service.deleteItem;
					container.service.entitiyDeleted = new PlatformMessenger();
					container.service.deleteItem = function deleteItem(entity/* , data */) {
						container.data.supportUpdateOnSelectionChanging = false;
						basDeleteItem.apply(this, arguments);
						container.data.supportUpdateOnSelectionChanging = true;

						container.removeCache(entity);
						service.entitiyDeleted.fire(null);
						if (extendOptions.onDeleteDone) {
							extendOptions.onDeleteDone.apply(this, arguments);
						}
					};

					var refreshDone = function refreshDone() {
						container.removeCache();
					};

					var updateDone = function updateDone() {
						var service = container.service;
						if (extendOptions.onUpdateDone) {
							extendOptions.onUpdateDone.apply(this, arguments);
						}
						container.removeCache();
						// fixed issue: 111094, Be capable to upload document for readonly entities
						if (service !== null && service.getServiceName() === 'procurementCommonDocumentDataService') {
							service.read();
						}

					};

					if (leadingService.registerUpdateDone) {
						leadingService.registerUpdateDone(updateDone);
					}
					if (leadingService.registerRefreshDone) {
						leadingService.registerRefreshDone(refreshDone);
					}

				};

				var createOverviewDataHandler = function createOverviewDataHandler(container) {
					var mainService = moduleContext.getMainService();
					/** @namespace mainService.disableOverview */
					if (extendOptions.overview && !mainService.disableOverview) {
						overviewDataService = procurementCommonOverviewDataService.getService(moduleContext.getMainService(), moduleContext.getLeadingService());
						overviewDataService.registerDataService(extendOptions.overview.key, container.service, extendOptions.overview.mapper);
					}
				};

				var createReadOnlyHandler = function createReadOnlyHandler(container) {
					if (extendOptions.readonly && extendOptions.readonly.length) {
						// add readonly methods
						var service = container.service, index;
						extendOptions.readonly = extendOptions.readonly || [];

						var updateFieldReadonly = function updateFieldReadonly(item, model, value) {
							var editable = !moduleContext.isReadOnly && (!service.getCellEditable || service.getCellEditable(item, model, value));
							runtimeDataService.readonly(item, [{field: model, readonly: !editable}]);
						};

						service.updateReadOnly = function (item, model, value) {
							if (!model) {
								for (index = 0; index < extendOptions.readonly.length; index++) {
									updateFieldReadonly(item, extendOptions.readonly[index], value);
								}
							} else {
								updateFieldReadonly(item, model, value);
							}

						};
					}
				};

				var createLookupFiltersHandler = function createLookupFiltersHandler(container) {
					var service = container.service;
					var registerLookupFilters = function (filters) {
						filters = filters || {};
						var filterLst = [];
						angular.forEach(filters, function (filter, name) {
							filter.key = name;
							filterLst.push(filter);
						});
						service.registerFilters = function registerFilters() {
							if (!service.filterRegistered) {
								service.filterRegistered = true;
								basicsLookupdataLookupFilterService.registerFilter(filterLst);
							}
						};
						service.unregisterFilters = function unregisterFilters() {
							basicsLookupdataLookupFilterService.unregisterFilter(filterLst);
							service.filterRegistered = false;
						};
						if (parentService.registerFilterLoad) {
							parentService.registerFilterLoad(service.registerFilters);
							parentService.registerFilterUnLoad(service.unregisterFilters);
						}

						service.registerFilters();
					};

					service.registerLookupFilters = registerLookupFilters;
					return registerLookupFilters;
				};

				var addExtendMethods = function addExtendMethods(container) {
					createSubSubServiceClearDataHandler(container);
					createReloadDataHandler(container);
					createOverviewDataHandler(container);
					createReadOnlyHandler(container);
					createLookupFiltersHandler(container);

				};

				/**
				 * create procurement data service
				 * @returns {*}
				 */
				var createProcurementDataService = function createProcurementDataService() {
					extendServiceOptions(options, options.flatLeafItem || options.flatNodeItem || options.flatRootItem || options.hierarchicalNodeItem);
					var serviceContainer = dataServiceFactory.createNewComplete(options);

					service = serviceContainer.service;

					service.data = serviceContainer.data;
					if (moduleContext.getModuleReadOnly()) {
						service.createItem = null;
						service.deleteItem = null;
					}
					addExtendMethods(serviceContainer);
					return serviceContainer;
				};

				var initReadData = function initReadData(readData) {
					var mainItemId = 0, projectFk = null;
					var parentItem = parentService.getSelected();
					var moduleName = moduleContext.getModuleName();
					if (parentItem) {
						if (parentItem.PrcHeaderEntity) {

							mainItemId = parentItem.PrcHeaderEntity.Id || 0;
						} else { // it needed;
							mainItemId = parentItem.PrcHeaderFk || 0;
						}
						projectFk = parentItem.ProjectFk;
					}
					if (projectFk === null || projectFk === undefined) {
						readData.filter = '?MainItemId=' + mainItemId + '&moduleName=' + moduleName;
					} else {
						readData.filter = '?MainItemId=' + mainItemId + '&projectId=' + projectFk + '&moduleName=' + moduleName;
					}

				};

				var incorporateDataRead = function (readData, data) {
					if (readData === null) {
						return;
					}
					basicsLookupdataLookupDescriptorService.attachData(readData || {});
					var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;
					// set readonly for read only fields.
					if (parentService.containerReadonly && angular.isFunction(service.setFieldReadonly)) {

						service.setFieldReadonly(items);
					}
					var result = data.handleReadSucceeded(items, data);
					service.goToFirst(data);
					return result;
				};

				var canCreateCallBackFunc = function () {
					var parentItem = parentService.getSelected();
					return !moduleContext.isReadOnly && !!parentItem && !!parentItem.Id;

				};

				var canDeleteCallBackFunc = function () {
					return !moduleContext.isReadOnly;
				};

				var setExtensionProcessors = function setExtensionProcessors(config) {
					if (extendOptions.date && extendOptions.date.length) {
						config.dataProcessor.push(new ServiceDataProcessDatesExtension(extendOptions.date));
					}

					if (extendOptions.time && extendOptions.time.length) {
						config.dataProcessor.push(new SchedulingDataProcessTimesExtension(extendOptions.time));
					}
				};

				/**
				 * extend configuration from default settings
				 * @param options service configuration
				 * @param config service configuration role root
				 */
				var extendServiceOptions = function extendServiceOptions(options, config) { // jshint ignore: line
					var httpCRUD = config.httpCRUD,
						presenter = config.presenter,
						entityRole = config.entityRole;

					// config.modification = true;
					config.module = config.module || angular.module(moduleName);
					config.dataProcessor = config.dataProcessor || [];
					httpCRUD.initReadData = httpCRUD.initReadData || initReadData;
					if (presenter.list) {
						presenter.list.incorporateDataRead = presenter.list.incorporateDataRead || incorporateDataRead;
					} else if (presenter.tree) {
						presenter.tree.incorporateDataRead = presenter.tree.incorporateDataRead || incorporateDataRead;
					}
					presenter.isInitialSorted = true;
					config.actions = config.actions || {delete: true, create: 'flat'};
					config.actions.canCreateCallBackFunc = config.actions.canCreateCallBackFunc || canCreateCallBackFunc;
					config.actions.canDeleteCallBackFunc = config.actions.canDeleteCallBackFunc || canDeleteCallBackFunc;
					setExtensionProcessors(config);
					if (entityRole.leaf || entityRole.node) {
						var role = entityRole.leaf || entityRole.node;
						role.parentService = role.parentService || parentService;
					}
				};

				// noinspection JSUnusedLocalSymbols
				// eslint-disable-next-line no-unused-vars
				var ReadOnlyDataProcessor = function readOnlyDataProcessor() { // jshint ignore:line
					this.processItem = function (item) {
						service.updateReadOnly(item);
					};
				};
				/** *********************add procurement common extend actions****************************************/
				/**
				 * reload items by configure or structure
				 * @param container
				 */
				return createProcurementDataService();
			};

			return {
				createService: serviceCache.registerService,
				createNewComplete: function (options, extendOptions, parentService) {
					parentService = parentService || moduleContext.getMainService();
					extendOptions = extendOptions || {};
					return new Service(options, extendOptions, parentService);
				}
			};
		}]);

})(angular);