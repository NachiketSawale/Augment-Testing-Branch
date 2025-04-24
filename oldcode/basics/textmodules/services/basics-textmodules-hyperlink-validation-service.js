/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesHyperlinkValidationService', basicsTextModulesHyperlinkValidationService);

	basicsTextModulesHyperlinkValidationService.$inject = [
		'$injector',
		'platformDataValidationService'];

	function basicsTextModulesHyperlinkValidationService(
		$injector,
		platformDataValidationService) {

		let service = {};

		service.validateLanguageFk = validateLanguageFk;

		return service;

		function validateLanguageFk(entity, value, model) {
			let dataService = getDataService();
			let tempValue = value;
			if (value === 0 || value === -1) {
				tempValue = null;
			}
			let list = dataService.getList();
			return platformDataValidationService.validateMandatoryUniqEntity(entity, tempValue, model, list, service, dataService);
		}

		function getDataService() {
			return $injector.get('basicsTextModulesHyperlinkDataService');
		}
	}

})(angular);