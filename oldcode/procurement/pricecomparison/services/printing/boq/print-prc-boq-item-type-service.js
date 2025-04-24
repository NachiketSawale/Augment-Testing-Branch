(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/* jshint -W072 */
	angular.module(moduleName).factory('procurementtPricecomparisonPrcBoqItemTypeService',
		['globals', '$http', 'procurementCommonDataServiceFactory',
			function (globals, $http, procurementCommonDataServiceFactory) {
				var factoryOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementtPricecomparisonPrcBoqItemTypeService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/common/boqitemtype/',
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

				service.getBoqItemTypeList = function getBoqItemTypeList(/* prcHeaderFk, exchangeRate */) {
					var prcBoqUrl = globals.webApiBaseUrl + 'procurement/common/boqitemtype/list';
					return $http.get(prcBoqUrl);
				};
				return service;
			}]);
})(angular);