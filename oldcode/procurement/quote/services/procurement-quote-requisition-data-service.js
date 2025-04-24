(function (angular) {
	'use strict';

	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name procurementQuoteRequisitionDataService
	 * @function
	 * @requires globals
	 */
	angular.module(moduleName).factory('procurementQuoteRequisitionDataService',
		['$q', '$injector', 'globals', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'procurementQuoteHeaderDataService',
			'procurementCommonDataEnhanceProcessor', 'PlatformMessenger', 'procurementCommonHelperService', 'platformRuntimeDataService', 'platformGridAPI',
			'procurementContextService', 'platformPermissionService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($q, $injector, globals, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, parentService,
				procurementCommonDataEnhanceProcessor, PlatformMessenger, procurementCommonHelperService, platformRuntimeDataService, platformGridAPI,
				procurementContextService, platformPermissionService) {

				var serviceOptions = {
					module: angular.module(moduleName),
					serviceName: 'procurementQuoteRequisitionDataService',
					entityRole: {
						node: {
							itemName: 'QtnRequisition',
							parentService: parentService,
							doesRequireLoadAlways: platformPermissionService.hasRead('ab8b7cdbc7fe411c87f2d18e4e0dffb9')
						}
					},
					entitySelection: {},
					modification: {multi: {}},
					httpRead: {route: globals.webApiBaseUrl + 'procurement/quote/requisition/', endRead: 'list'},
					presenter: {list: {incorporateDataRead: incorporateDataRead}},
					dataProcessor: [dataProcessItem()]
				};

				var _editorMode = 0;
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.service.registerEntityCreated = function () {
				};
				serviceContainer.service.itemList = serviceContainer.data.itemList;
				serviceContainer.service.getEditorMode = function () {
					return _editorMode;
				};
				serviceContainer.service.setEditorMode = function (value) {
					_editorMode = value ? 0 : 1;
				};
				serviceContainer.service.importToAll = function (value) {
					var entity = serviceContainer.service.getList();
					serviceContainer.service.setEditorMode(value);
					if (value) {
						_.forEach(entity, function (item) {
							platformRuntimeDataService.readonly(item, [{
								field: 'IsSelected',
								readonly: true
							}]);
							item.IsSelected = true;
							platformGridAPI.rows.refreshRow({gridId: 'B0F91870D5804749BE358015D372B8F7', item: item});
						});
					} else {
						_.forEach(entity, function (item) {
							platformRuntimeDataService.readonly(item, [{
								field: 'IsSelected',
								readonly: false
							}]);
							item.IsSelected = false;
							platformGridAPI.rows.refreshRow({gridId: 'B0F91870D5804749BE358015D372B8F7', item: item});
						});
					}

				};

				serviceContainer.service.loadRfqDocument = new PlatformMessenger();
				serviceContainer.service.loadOverview = new PlatformMessenger();

				serviceContainer.service.getItemServiceName = function () {
					return 'procurementQuoteItemDataService';
				};
				initialize(serviceContainer.service);

				serviceContainer.service.callRefresh = serviceContainer.service.refresh || serviceContainer.data.onRefreshRequested;

				serviceContainer.service.getModuleState = function () {
					return parentService.getModuleState();
				};

				serviceContainer.service.calculateTLeadTime = function (entity, value) {
					return entity.BufferLeadTime + entity.SafetyLeadTime + value;
				};

				serviceContainer.service.getPrcConfigurationId = function () {
					return parentService.hasSelection() ? parentService.getSelected().PrcConfigurationFk : null;
				};

				serviceContainer.service.getRubricId = function () {
					return procurementContextService.quoteRubricFk;
				};

				return serviceContainer.service;

				function incorporateDataRead(responseData, data) {
					basicsLookupdataLookupDescriptorService.attachData(responseData || {});
					var dataRead = data.handleReadSucceeded(responseData.Main, data, true);
					// serviceContainer.service.deselect();

					parentService.setTotalNoDiscountSplitOfHeader(responseData.TotalNoDiscountSplit, responseData.TotalNoDiscountSplitOc, responseData.TotalGrossNoDiscountSplit, responseData.TotalGrossOcNoDiscountSplitOc);

					serviceContainer.service.goToFirst();
					serviceContainer.service.canLoadOverview = true;
					serviceContainer.service.loadOverview.fire();
					serviceContainer.service.canLoadOverview = false;
					return dataRead;
				}

				function dataProcessItem() {
					var dataProcessService = function () {
						var defineOption = {
							fields: ['ExchangeRate', 'TaxCodeFk', 'ProjectFk', 'ReqHeaderEntity.BusinessPartnerFk', 'CurrencyFk'],
							get: parentService.getSelected
						};
						return {dataService: serviceContainer.service, validationService: {}, defineOption: defineOption};
					};
					return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementQuoteRequisitionUIConfigurationService', true);
				}

				/**
				 * @ngdoc function
				 * @name initialize
				 * @function
				 * @methodOf procurement.quote.procurementQuoteHeaderDataService
				 * @description initialize
				 */
				function initialize(service) {
					service.name = 'procurement.quote.requisition';
					service.exchangeRateChanged = parentService.exchangeRateChanged;
					service.noCreateOrDeleteAboutBoq = true;

					service.allMainItemToDictionary = function allMainItemToDictionary() {
						var items = basicsLookupdataLookupDescriptorService.getData('reqheaderlookupview');
						return procurementCommonHelperService.arrayToDictionary(service.getList(), 'PrcHeaderFk', function (item) {
							return items[item.ReqHeaderFk]?.Code;
						});
					};

					service.enhanceBoqFun = function (boqParentService, boqItemService, boqItemData) {
						var mergeInUpdateDataBack = boqItemService.mergeInUpdateData;
						boqItemService.mergeInUpdateData = function mergeInUpdateData(updateData) {
							if (updateData.PrcBoqCompleteToSave?.BoqItemCompleteToSave) {
								if (!updateData[boqItemData.itemName + 'ToSave']) {
									updateData[boqItemData.itemName + 'ToSave'] = updateData.PrcBoqCompleteToSave.BoqItemCompleteToSave;
								}
							}

							mergeInUpdateDataBack(updateData);
							var prcBoqMainService = $injector.get('prcBoqMainService');
							var boqMainService = prcBoqMainService.getService(procurementContextService.getMainService());
							_.forEach(updateData[boqItemData.itemName + 'ToSave'], function (boqItem) {
								boqMainService.syncItemsAfterUpdate(boqItem);
							});
							boqItemService.gridRefresh();
						};
					};

					service.update = function update() {
						if (parentService.update) {
							return parentService.update();
						}
						return $q.when(true);
					};

					manageFilter(service);
				}

				function manageFilter(service) {
					var onFilterLoaded = new PlatformMessenger(),
						onFilterUnLoaded = new PlatformMessenger();

					// register all filter in item
					service.registerFilters = function registerFilters() {
						if (!service.filterRegistered) {
							service.filterRegistered = true;
							onFilterLoaded.fire(moduleName);
						}
					};

					// register all filter in item
					service.unregisterFilters = function unregisterFilters() {
						onFilterUnLoaded.fire(moduleName);
						service.filterRegistered = false;
					};

					// filter events
					service.registerFilterLoad = function (func) {
						onFilterLoaded.register(func);
					};

					service.registerFilterUnLoad = function (func) {
						onFilterUnLoaded.register(func);
					};

					parentService.registerFilterLoad(service.registerFilters);
					parentService.registerFilterUnLoad(service.unregisterFilters);
				}
			}]
	);

})(angular);
