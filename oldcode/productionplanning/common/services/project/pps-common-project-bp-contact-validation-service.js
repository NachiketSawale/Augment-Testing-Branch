/**
 * Created by lav on 6/25/2019.
 */

(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name ppsCommonProjectBPContactValidationService
	 * @description provides validation methods for project generals entities
	 */
	angular.module(moduleName).service('ppsCommonProjectBPContactValidationService', ['$injector', '$q', '$http',
		'platformValidationServiceFactory',

		function ($injector, $q, $http,
				  platformValidationServiceFactory) {

			var serviceCache = {};

			function createValidationService(dataService) {
				var service = {};
				platformValidationServiceFactory.addValidationServiceInterface(
					{
						typeName: 'Project2BusinessPartnerContactDto',
						moduleSubModule: 'Project.Main'
					},
					{
						mandatory: ['ContactFk']

					},
					service,
					dataService);

				service.asyncValidateContactFk = asyncValidateContactFk;

				return service;

				function asyncValidateContactFk(entity, value) {
					return applyAsyncFieldTest({Prj2BP: entity, NewIntValue: value});
				}

				function applyAsyncFieldTest(validationSpec) {
					var defer = $q.defer();
					$http.post(globals.webApiBaseUrl + 'project/main/project2bpcontact/validate', validationSpec).then(function (result) {
						dataService.takeOver(result.data);
						defer.resolve(true);
					});

					return defer.promise;
				}
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
