(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemCommonFormdataValidationServiceFactory', ppsItemCommonFormdataValidationServiceFactory);

	ppsItemCommonFormdataValidationServiceFactory.$inject = ['platformDataValidationService', 'platformValidationServiceFactory'];

	function ppsItemCommonFormdataValidationServiceFactory(platformDataValidationService, platformValidationServiceFactory) {
		var serviceCache = {};

		function create (dataService) {

			var validSrv = {};

			validSrv.validateFormFk = function (entity, value, model) {
				value = value === 0 ? null : value;
				return platformDataValidationService.validateMandatory(entity, value, model, validSrv, dataService);
			};

			return validSrv;
		}

		function getService(dataService) {
			var key = dataService.getTranslatedEntityName();
			if (!serviceCache[key]) {
				serviceCache[key] = create(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})(angular);
