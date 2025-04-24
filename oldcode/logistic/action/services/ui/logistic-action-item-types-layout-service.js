/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc service
	 * @name logisticActionItemTypesLayoutService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * The UI layout service for the rubric entity.
	 */
	angular.module(moduleName).service('logisticActionItemTypesLayoutService', LogisticActionItemTypesLayoutService);

	LogisticActionItemTypesLayoutService.$inject = ['platformUIConfigInitService', 'logisticActionContainerInformationService',
		'logisticActionTranslationService', 'logisticActionConstantValues'];

	function LogisticActionItemTypesLayoutService(platformUIConfigInitService, logisticActionContainerInformationService,
		logisticActionTranslationService, logisticActionConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticActionContainerInformationService.getActionItemTypesLayout(),
			dtoSchemeId: logisticActionConstantValues.schemes.actionItemTypes,
			translator: logisticActionTranslationService
		});
	}
})(angular);
