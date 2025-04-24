/**
 * Created by xai on 5/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartner2ExternalValidationService', businessPartner2ExternalValidationService);
	businessPartner2ExternalValidationService.$inject = ['platformDataValidationService'];

	function businessPartner2ExternalValidationService(platformDataValidationService) {
		return function (dataService) {
			var service = {};

			service.validateExternalFk = validateExternalFk;

			return service;

			// ////////////////////////
			function validateExternalFk(entity, value, model) {
				var tempValue = value === -1 ? '' : value;
				return platformDataValidationService.validateMandatory(entity, tempValue, model, service, dataService);
			}
		};
	}
})(angular);