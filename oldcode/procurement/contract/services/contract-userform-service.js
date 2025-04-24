(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global globals */
	'use strict';

	var moduleName = 'procurement.contract';
	var procurementContractModule = angular.module(moduleName);
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name basicsUserformFormDataListService
	 * @function
	 * @description
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	procurementContractModule.factory('contractUserformFormDataListService',
		['$http', 'procurementContractHeaderDataService', 'platformDataServiceFactory',
			'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService',
			'platformDataServiceDataProcessorExtension', 'PlatformMessenger','procurementContextService',
			function ($http, procurementContractHeaderDataService, platformDataServiceFactory,
				basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService,
				platformDataServiceDataProcessorExtension, PlatformMessenger, procurementContextService) {

				// noinspection JSUnresolvedVariable
				var serviceContainer;
				var serviceFactoryOptions = {
					flatLeafItem: {
						// eslint-disable-next-line no-undef
						module: templateGroupModule, // jshint ignore:line
						serviceName: 'contractUserformFormDataListService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/userform/data/',
							endRead: 'rubricdatalist',
							initReadData: function initReadData(readData) {
								var contractItem = procurementContractHeaderDataService.getSelected() || {Id: 0};
								readData.filter = '?rubricId=' + serviceContainer.service.rubricFk + '&contextFk=' + contractItem.Id;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData || {});

									return serviceContainer.data.initItemList(readData, data);
								},
								initCreationData: function initCreationData(/* creationData */) {

								}
							}
						},
						entityRole: {root: {itemName: 'FormData'}}
						// translation:{uid: 'basicsUserformMainService', title: 'Translation', colHeader: ['Description'], descriptors: ['DescriptionInfo']}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

				// service data initializer method
				serviceContainer.data.initItemList = function initItemList(readData, data) {
					readData = readData || {};
					var items = readData.Main;
					data.selectedItem = {};
					data.itemList.length = 0;
					for (var i = 0; i < items.length; ++i) {
						data.itemList.push(items[i]);
					}
					platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

					data.listLoaded.fire();
				};

				procurementContractHeaderDataService.registerSelectionChanged(function () {
					serviceContainer.service.refresh();
				});

				serviceContainer.service.rubricFk = 30;
				// region overloads

				// events
				serviceContainer.service.formDataDeleted = new PlatformMessenger();
				serviceContainer.service.createFormDataRequested = new PlatformMessenger();

				serviceContainer.service.createItem = function () {
					serviceContainer.service.createFormDataRequested.fire();
				};

				serviceContainer.service.deleteItem = function () {

					var entity = serviceContainer.service.getSelected();
					$http.get(globals.webApiBaseUrl + 'basics/userform/data/deletebyid?id=' + entity.Id).then(function () {
						serviceContainer.service.formDataDeleted.fire();
					});
				};

				basicsLookupdataLookupFilterService.registerFilter([{
					key: 'prc-con-header-userform-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk=' + serviceContainer.service.rubricFk;
					}
				}]);
				// endregion

				return serviceContainer.service;

			}]);
})(angular);
