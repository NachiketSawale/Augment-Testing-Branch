/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.formworktype';

	/**
	 * @ngdoc service
	 * @name productionplanningFormworktypeUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('productionplanningFormworktypeUIConfigurationService', UIConfigurationService);

	UIConfigurationService.$inject = ['platformUIConfigInitService', 'productionplanningFormworktypeContainerInformationService', 'productionplanningFormworktypeConstantValues', 'productionplanningFormworktypeTranslationService'];

	function UIConfigurationService(platformUIConfigInitService, containerInformationService, constantValues, translationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: containerInformationService.getFormworktypeLayoutInfo(),
			dtoSchemeId: constantValues.schemes.formworktype,
			translator: translationService
		});
	}
})(angular);
