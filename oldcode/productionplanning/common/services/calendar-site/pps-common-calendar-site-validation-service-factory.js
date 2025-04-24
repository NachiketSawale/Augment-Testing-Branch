(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonCalendarSiteValidationServiceFactory', ['$injector',
		'$q', '$http', '_', 'globals', 'platformDataValidationService', 'platformValidationServiceFactory',

		function ($injector, $q, $http, _, globals, platformDataValidationService, platformValidationServiceFactory) {

			var serviceCache = {};

			function createValidationService(dataService) {
				var service = {};

				service.validatePpsEntityFk = function (entity, value, model) {
					if(value === 0){
						value = null;
					}
					var dataList = dataService.getList();
					return  platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, dataList, service, dataService);
				};

				service.validateCalCalendarFk = function (entity, value, model) {
					if(value === 0)
					{
						value = null;
					}
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				};
				return service;
			}

			function getService(dataService) {
				var key = dataService.getServiceName();
				if (!serviceCache[key]) {
					serviceCache[key] = createValidationService(dataService);
				}
				return serviceCache[key];
			}

			return {
				getService: getService
			};
		}
	]);
})(angular);
