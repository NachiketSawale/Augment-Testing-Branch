/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global angular */
	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc service
	 * @name productionPlanningDrawingTypeUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('productionPlanningDrawingTypeUIConfigurationService', UIConfigurationService);

	UIConfigurationService.$inject = ['platformUIConfigInitService', 'productionplanningDrawingtypeContainerInformationService', 'productionPlanningDrawingTypeConstantValues', 'productionPlanningDrawingTypeTranslationService'];

	function UIConfigurationService(platformUIConfigInitService, drawingTypeContainerInformationService, constantValues, translationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: drawingTypeContainerInformationService.getDrawingTypeLayoutInfo(),
			dtoSchemeId: constantValues.schemes.drawingType,
			translator: translationService
		});
	}
})(angular);
