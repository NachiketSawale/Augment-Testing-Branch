
(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectPrj2BPValidationService
	 * @description provides validation methods for project generals entities
	 */
	angular.module(moduleName).service('projectPrj2BPValidationService', ['$injector', '$q', '$http',

		function ($injector, $q, $http) {

			return {
				asyncValidateBusinessPartnerFk: asyncValidateBusinessPartnerFk,
				asyncValidateSubsidiaryFk: asyncValidateSubsidiaryFk
			};

			function asyncValidateBusinessPartnerFk(entity, value) {
				return applyAsyncFieldTest({Prj2BP: entity, NewBusinessPartner: value});
			}

			function asyncValidateSubsidiaryFk(entity, value) {
				return applyAsyncFieldTest({Prj2BP: entity, NewSubsidiary: value});
			}

			function applyAsyncFieldTest(validationSpec) {
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec).then(function (result) {
					var serv = $injector.get('projectPrj2BPService');
					serv.takeOver(result.data);
					defer.resolve(true);
				});

				return defer.promise;
			}
		}
	]);

})(angular);
