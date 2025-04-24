
(function(angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).service('constructionSystemMainObject2LocationConfigurationService', constructionSystemMainObject2LocationConfigurationService);

	constructionSystemMainObject2LocationConfigurationService.$inject = ['platformUIConfigInitService', 'constructionSystemMainUIConfigurationService', 'modelMainTranslationService'];

	function constructionSystemMainObject2LocationConfigurationService(platformUIConfigInitService, configurationService, modelMainTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: configurationService.getModelObject2LocationDetailLayout(),
			dtoSchemeId: {typeName: 'ModelObject2LocationDto', moduleSubModule: 'Model.Main'},
			translator: modelMainTranslationService
		});
	}

})(angular);
