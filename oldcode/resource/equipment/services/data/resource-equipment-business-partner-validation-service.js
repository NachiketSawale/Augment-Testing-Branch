(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentBusinessPartnerValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentBusinessPartnerValidationService', ResourceEquipmentBusinessPartnerValidationService);
	ResourceEquipmentBusinessPartnerValidationService.$inject = ['$http', '$injector', '_', '$q'];
	function ResourceEquipmentBusinessPartnerValidationService($http, $injector, _, $q) {
		let self = this;

	   return {
			asyncValidateBusinessPartnerFk: asyncValidateBusinessPartnerFk,
			asyncValidateContactFk: asyncValidateContactFk
		};
		
		function asyncValidateBusinessPartnerFk(entity, value) {
			return applyAsyncFieldTest({ Field2Validate: 1, NewIntValue: value, BusinessPartner: entity });
		}
		function applyAsyncFieldTest(validationSpec) {
			var defer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'resource/equipment/businesspartner/validate', validationSpec).then(function (result) {
				if (!result.data.ValidationResult) {
					defer.resolve({
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'project.main.errors.thisIsAnUnknwonBusinessPartner',
						error$tr$param: {}
					});
				} else {
					var serv = $injector.get('resourceEquipmentBusinessPartnerDataService');
					serv.takeOver(result.data.BusinessPartner);
					defer.resolve(true);
				}
			});
			return defer.promise;
		}
		function asyncValidateContactFk(entity, value) {
			return applyAsyncFieldTest({ BusinessPartner: entity, NewIntValue: value });
		}


	}
})(angular);