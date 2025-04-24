(function (angular) {
	'use strict';

	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainProspectValidationService
	 * @description provides validation methods for unit entities
	 */
	angular.module(moduleName).factory('objectMainProspectValidationService', ['$injector', '$q', '$http',

		function ($injector, $q, $http) {

			return {
				asyncValidateBusinessPartnerFk: asyncValidateBusinessPartnerFk,
				//asyncValidateSubsidiaryFk: asyncValidateSubsidiaryFk,
				//asyncValidateCustomerFk: asyncValidateCustomerFk,
				//asyncValidateContactFk: asyncValidateContactFk
			};

			function asyncValidateBusinessPartnerFk (entity, value) {
				return applyAsyncFieldTest({ Field2Validate: 1, NewIntValue: value, Prospect: entity });
			}

			//function asyncValidateSubsidiaryFk (entity, value) {
			//	return applyAsyncFieldTest({ Field2Validate: 2, NewIntValue: value, Prospect: entity });
			//}
			//
			//function asyncValidateCustomerFk (entity, value) {
			//	return applyAsyncFieldTest({ Field2Validate: 3, NewIntValue: value, Prospect: entity });
			//}
			//
			//function asyncValidateContactFk (entity, value) {
			//	return applyAsyncFieldTest({ Field2Validate: 4, NewIntValue: value, Prospect: entity });
			//}

			function applyAsyncFieldTest(validationSpec) {
				var defer = $q.defer();
				$http.post(globals.webApiBaseUrl + 'object/main/prospect/validate', validationSpec).then(function (result) {
					if (!result.data.ValidationResult) {
						defer.resolve({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'project.main.errors.thisIsAnUnknwonBusinessPartner',
							error$tr$param: {}
						});
					} else {
						var serv = $injector.get('objectMainProspectService');
						serv.takeOver(result.data.Prospect);
						defer.resolve(true);
					}
				});

				return defer.promise;
			}
		}

	]);

})(angular);
