(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('ppsCommonBizPartnerContactValidationServiceFactory', [
		'$injector', '$q', '$http', 'globals', 'platformDataValidationService', 'platformValidationServiceFactory',

		function ($injector, $q, $http, globals, platformDataValidationService, platformValidationServiceFactory) {

			var serviceCache = {};

			function createValidationService(dataService) {
				var service = {};
				platformValidationServiceFactory.addValidationServiceInterface({
					typeName: 'CommonBizPartnerContactDto',
					moduleSubModule: 'ProductionPlanning.Common'
				}, {
					mandatory: ['ContactFk']
				}, service, dataService);

				service.validateContactFk = function (entity, value, model) {
					if(value === 0)
					{
						value = null;
					}
					return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
				};

				service.asyncValidateContactFk = function (entity, value) {
					return applyAsyncFieldTest({Prj2BP: entity, NewIntValue: value});
				};

				function applyAsyncFieldTest(validationSpec) {
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'project/main/project2bpcontact/validate', validationSpec).then(function (result) {
						dataService.takeOver(result.data);
						defer.resolve(true);
					});
					return defer.promise;
				}

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
