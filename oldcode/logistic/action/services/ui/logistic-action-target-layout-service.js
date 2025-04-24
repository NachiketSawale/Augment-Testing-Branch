/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc service
	 * @name logisticActionTargetLayoutService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * The UI layout service for the rubric entity.
	 */
	angular.module(moduleName).service('logisticActionTargetLayoutService', LogisticActionTargetLayoutService);

	LogisticActionTargetLayoutService.$inject = ['platformUIConfigInitService', 'logisticActionContainerInformationService',
		'logisticActionTranslationService', 'logisticActionConstantValues'];

	function LogisticActionTargetLayoutService(platformUIConfigInitService, logisticActionContainerInformationService,
		logisticActionTranslationService, logisticActionConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticActionContainerInformationService.getActionTargetLayout(),
			dtoSchemeId: logisticActionConstantValues.schemes.actionTarget,
			translator: logisticActionTranslationService
		});
	}
})(angular);
