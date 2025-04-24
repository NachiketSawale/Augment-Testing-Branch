/**
 * Created by chi on 3/1/2021.
 */

(function(angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqSendRfqBoqService', procurementRfqSendRfqBoqService);

	procurementRfqSendRfqBoqService.$inject = ['$http', 'globals', '_', 'platformDataServiceFactory'];

	function procurementRfqSendRfqBoqService($http, globals, _, platformDataServiceFactory) {
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementRfqSendRfqBoqService',
			presenter: {
				list: {}
			},
			dataProcessor: [{
				processItem: function (boq) {
					boq.IsIncluded = true;
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
			return 'SendRfqBoqInfo';
		}
	}

})(angular);
