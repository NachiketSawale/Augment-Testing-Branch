/**
 * Created by waz on 3/6/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonDocumentRevisionValidationServiceFactory', RevisionValidationServiceFactory);

	RevisionValidationServiceFactory.$inject = ['platformDataValidationService', 'platformRuntimeDataService'];

	function RevisionValidationServiceFactory() {
		var factory = {};
		var serviceCache = {};

		factory.createService = function () {
			return {};
		};

		factory.getService = function (containerId, dataService) {
			if (!serviceCache[containerId]) {
				serviceCache[containerId] = factory.createService(dataService);
			}
			return serviceCache[containerId];
		};
		return factory;
	}
})(angular);