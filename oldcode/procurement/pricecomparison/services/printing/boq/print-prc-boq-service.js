(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPricecomparisonPrcBoqService',
		['globals', '$http', 'procurementCommonDataServiceFactory',
			function (globals, $http, procurementCommonDataServiceFactory) {
				var factoryOptions = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'procurementPricecomparisonPrcBoqService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/common/boq/',
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
							leaf: {/* itemName: 'UnitPrice', parentService: objectMainUnitService */}
						}
					}
				};

				var serviceContainer = procurementCommonDataServiceFactory.createNewComplete(factoryOptions);
				var service = serviceContainer.service;

				service.getDialogPrcBoqList = function getDialogPrcBoqList(rfqHeaderFk, prcPackageFk) {
					var prcBoqUrl = globals.webApiBaseUrl + 'procurement/common/boq/getprcbaseboqsonlyone?rfqHeaderFk=' + rfqHeaderFk + '&prcPackageFk=' + prcPackageFk;
					return $http.get(prcBoqUrl);
				};
				return service;
			}]);
})(angular);