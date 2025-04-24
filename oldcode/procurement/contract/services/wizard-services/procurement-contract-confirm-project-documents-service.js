(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	angular.module(moduleName).factory('procurementContractConfirmProjectDocumentsService', procurementContractConfirmProjectDocumentsService);

	procurementContractConfirmProjectDocumentsService.$inject = ['$http', 'globals', '_', 'platformDataServiceFactory'];

	function procurementContractConfirmProjectDocumentsService($http, globals, _, platformDataServiceFactory) {
		var serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'procurementContractConfirmProjectDocumentsService',
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

		function getItemName() {
			return 'ProjectDocumentForContractConfirm';
		}

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		data.markItemAsModified = angular.noop;
		service.markItemAsModified = angular.noop;
		service.getItemName = getItemName;
		return service;

	}

})(angular);
