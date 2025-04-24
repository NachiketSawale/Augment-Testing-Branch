/**
 * Created by chi on 2/23/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqDataFormatService', procurementRfqDataFormatService);

	procurementRfqDataFormatService.$inject = ['$http', 'globals', '_', 'platformDataServiceFactory'];

	function procurementRfqDataFormatService($http, globals, _, platformDataServiceFactory) {
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementRfqDataFormatService',
			presenter: {
				list: {}
			},
			dataProcessor: [{
				processItem: function (dataFormat) {
					if (dataFormat.Isdefault) {
						dataFormat.IsIncluded = true;
					}
				}
			}],
			entitySelection: {},
			modification: {multi: {}},
			actions: {
				create: false,
				delete: false
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		data.markItemAsModified = angular.noop;
		service.markItemAsModified = angular.noop;
		service.getItemName = getItemName;
		return service;
		// ///////////////////////////

		function getItemName() {
			return 'DataFormat';
		}
	}

})(angular);
