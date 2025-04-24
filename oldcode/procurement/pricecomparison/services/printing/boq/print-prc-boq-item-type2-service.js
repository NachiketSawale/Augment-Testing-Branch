(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementtPricecomparisonPrcBoqItemType2Service',
		['globals', '$http', 'procurementCommonDataServiceFactory',
			function (globals, $http, procurementCommonDataServiceFactory) {
				var factoryOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementtPricecomparisonPrcBoqItemTypeService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/common/boqitemtype2/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: function initReadData(/* readData */) {

							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(/* creationData */) {
								}
							}
						},
						entityRole: {
							leaf: {}
						}
					}
				};

				var serviceContainer = procurementCommonDataServiceFactory.createNewComplete(factoryOptions);
				var service = serviceContainer.service;

				service.getBoqItemType2List = function getBoqItemType2List(/* prcHeaderFk, exchangeRate */) {
					var prcBoqUrl = globals.webApiBaseUrl + 'procurement/common/boqitemtype2/list';
					return $http.get(prcBoqUrl);
				};
				return service;
			}]);
})(angular);