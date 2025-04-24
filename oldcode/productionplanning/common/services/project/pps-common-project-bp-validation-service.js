/**
 * Created by lav on 6/25/2019.
 */

(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name ppsCommonProjectBPValidationService
	 * @description provides validation methods for project generals entities
	 */
	angular.module(moduleName).service('ppsCommonProjectBPValidationService', ['$injector', '$q', '$http',
		'platformValidationServiceFactory',

		function ($injector, $q, $http,
				  platformValidationServiceFactory) {

			var serviceCache = {};

			function createValidationService(dataService) {
				var service = {};
				platformValidationServiceFactory.addValidationServiceInterface(
					{
						typeName: 'Project2BusinessPartnerDto',
						moduleSubModule: 'Project.Main'
					},
					{
						mandatory: ['RoleFk', 'BusinessPartnerFk', 'SubsidiaryFk']

					},
					service,
					dataService);

				service.asyncValidateBusinessPartnerFk = asyncValidateBusinessPartnerFk;

				return service;

				function asyncValidateBusinessPartnerFk(entity, value) {
					return applyAsyncFieldTest({Prj2BP: entity, NewBusinessPartner: value});
				}

				function applyAsyncFieldTest(validationSpec) {
					var defer = $q.defer();
					// .net core porting, hzh. fix issue when some property of dto is null, it can not converted, In the project partners of Engineering planning, click create popup error.
					if (validationSpec.Prj2BP && !validationSpec.Prj2BP.SubsidiaryFk) {
						validationSpec.Prj2BP.SubsidiaryFk = 0;
					}
					$http.post(globals.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec).then(function (result) {
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
