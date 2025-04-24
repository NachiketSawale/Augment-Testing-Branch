(function (angular) {

	'use strict';

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).factory('businessPartnerContactExtRoleValidationService', businessPartnerContactExtRoleValidationService);

	businessPartnerContactExtRoleValidationService.$inject = [
		'$injector',
		'platformDataValidationService'];

	function businessPartnerContactExtRoleValidationService(
		$injector,
		platformDataValidationService) {

		let service = {};
		service.validateExternalRoleFk = validateExternalRoleFk;
		return service;



		function validateExternalRoleFk(entity, value, model) {
			let dataService = getDataService();
			let tempValue = value;
			if (value === 0 || value === -1) {
				tempValue = null;
			}
			let list = dataService.getList();
			return   platformDataValidationService.validateMandatoryUniqEntity(entity, tempValue, model, list, service, dataService);

		}

		function getDataService() {
			return $injector.get('businessPartnerContactExtRoleDataService');
		}
	}

})(angular);