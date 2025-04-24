/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global angular */
	const moduleName = 'productionplanning.drawing';

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingSkillUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(moduleName).service('productionplanningDrawingSkillUIConfigurationService', UIConfigurationService);

	UIConfigurationService.$inject = ['platformUIConfigInitService', 'productionplanningDrawingContainerInformationService', 'productionplanningDrawingTranslationService'];

	function UIConfigurationService(platformUIConfigInitService, drawingContainerInformationService, translationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: drawingContainerInformationService.getDrawingSkillLayoutInfo(),
			dtoSchemeId: {typeName: 'EngDrawingSkillDto', moduleSubModule: 'ProductionPlanning.Drawing'},
			translator: translationService
		});
	}
})(angular);
