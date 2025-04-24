(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstance2ObjectParamUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem main instance2object param grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemMainInstance2ObjectParamUIConfigService', [
		'platformUIConfigInitService', 'constructionsystemMainTranslationService','platformUIStandardExtentService','constructionSystemMainUIConfigurationService',
		function (platformUIConfigInitService, translateService,platformUIStandardExtentService,constructionSystemMainUIConfigurationService) {

			var layout = constructionSystemMainUIConfigurationService.getConstructionSystemMainObject2ParamDetailLayout();

			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: layout,
				dtoSchemeId: {typeName: 'Instance2ObjectParamDto', moduleSubModule: 'ConstructionSystem.Main'},
				translator: translateService
			});

			platformUIStandardExtentService.extend(this, layout.addition);

		}
	]);
})(angular);
