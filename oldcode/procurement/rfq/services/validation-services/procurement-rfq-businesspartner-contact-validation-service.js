/**
 * Created by chi on 12.03.2021.
 */
(function (angular) {

	'use strict';

	var moduleName = 'procurement.rfq';

	angular.module(moduleName).factory('procurementRfqBusinessPartner2ContactValidationService', procurementRfqBusinessPartner2ContactValidationService);

	procurementRfqBusinessPartner2ContactValidationService.$inject = [
		'$injector',
		'platformDataValidationService'];

	function procurementRfqBusinessPartner2ContactValidationService(
		$injector,
		platformDataValidationService) {

		var service = {};

		service.validateContactFk = validateContactFk;

		return service;

		// //////////////////////////////////

		function validateContactFk(entity, value, model) {
			var dataService = getDataService();
			var tempValue = value;
			if (value === 0 || value === -1) {
				tempValue = null;
			}
			var list = dataService.getList();
			let result = platformDataValidationService.validateMandatoryUniqEntity(entity, tempValue, model, list, service, dataService);

			if (result.valid) {
				dataService.updateWithContacts(list,[value]);
			}
			return result;
		}

		function getDataService() {
			return $injector.get('procurementRfqBusinessPartner2ContactService');
		}
	}

})(angular);