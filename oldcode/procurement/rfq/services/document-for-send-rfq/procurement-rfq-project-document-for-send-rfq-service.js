(function(angular) {
	'use strict';

	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqProjectDocumentForSendRfqService', procurementRfqProjectDocumentForSendRfqService);

	procurementRfqProjectDocumentForSendRfqService.$inject = ['$http', 'globals', '_', 'platformDataServiceFactory'];

	function procurementRfqProjectDocumentForSendRfqService($http, globals, _, platformDataServiceFactory) {
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementRfqProjectDocumentForSendRfqService',
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
			return 'ProjectDocument';
		}
	}

})(angular);
