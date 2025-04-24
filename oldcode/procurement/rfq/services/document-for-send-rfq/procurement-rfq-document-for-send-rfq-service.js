/**
 * Created by chi on 2/24/2021.
 */

(function(angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqDocumentForSendRfqService', procurementRfqDocumentForSendRfqService);

	procurementRfqDocumentForSendRfqService.$inject = ['$http', 'globals', '_', 'platformDataServiceFactory'];

	function procurementRfqDocumentForSendRfqService($http, globals, _, platformDataServiceFactory) {
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementRfqDocumentForSendRfqService',
			presenter: {
				list: {}
			},
			dataProcessor: [],
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
			return 'DocumentResult';
		}
	}

})(angular);