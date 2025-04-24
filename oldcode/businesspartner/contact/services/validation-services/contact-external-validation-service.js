(function (angular) {

	'use strict';

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContact2ExternalValidationService', businessPartnerContact2ExternalValidationService);

	businessPartnerContact2ExternalValidationService.$inject = [
		'$injector',
		'platformDataValidationService',];

	function businessPartnerContact2ExternalValidationService(
		$injector,
		platformDataValidationService) {

		let service = {};
		service.validateExternalSourceFk = validateExternalSourceFk;
		return service;

		function validateExternalSourceFk (entity, value, model) {
			let dataService = getDataService();
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		}

		function getDataService() {
			return $injector.get('businessPartnerContact2ExternalDataService');
		}
	}

})(angular);