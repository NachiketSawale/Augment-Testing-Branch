(function (angular) {
	'use strict';
	var priceConditionModule = angular.module('basics.pricecondition');

	/**
	 * @ngdoc service
	 * @name basicsPriceConditionDataService
	 * @function
	 *
	 * description data service of total container
	 */
	priceConditionModule.factory('basicsPriceConditionDetailDataService',
		['platformDataServiceFactory', 'basicsPriceConditionDataService', '$http', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			/* jshint -W072*/ //many parameters because of dependency injection
			function (dataServiceFactory, parentService, $http, basicsLookupdataLookupDescriptorService, runtimeDataService) {
				//service configuration
				var serviceOptions = {
					flatLeafItem: {
						module: priceConditionModule,
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/priceconditiondetail/'
						},
						entityRole: {leaf: {itemName: 'PriceConditionDetail', parentService: parentService}},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									basicsLookupdataLookupDescriptorService.attachData(readData || {});
									var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;
									var dataRead = data.handleReadSucceeded(items, data);
									angular.forEach(items, function (item) {
										service.updateReadOnly(item, ['Value']);
									});
									service.goToFirst(data);
									return dataRead;
								}
							},
							isInitialSorted: true
						},
						entitySelection: {}
					}
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				var service = serviceContainer.service;

				service.updateReadOnly = function (item, modelArray) {
					angular.forEach(modelArray, function (model) {
						var editable = service.getCellEditable(item, model);
						runtimeDataService.readonly(item, [{field: model, readonly: !editable}]);
					});

				};

				service.getCellEditable =function getCellEditable(item, model){
					var editable = true;
					if(model === 'Value') {
						var type = _.find(basicsLookupdataLookupDescriptorService.getData('PrcPriceConditionType'), {Id: item.PriceConditionTypeFk});
						if (type) {
							editable = type.HasValue;
						}
					}
					return editable;
				};

				basicsLookupdataLookupDescriptorService.loadData('PrcPriceConditionType');
				return service;

			}
		]);

})(angular);
