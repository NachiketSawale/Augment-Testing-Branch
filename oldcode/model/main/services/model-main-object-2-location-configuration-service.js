/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.main';

	angular.module(moduleName).service('modelMainObject2LocationConfigurationService', ModelMainObject2LocationConfigurationService);

	ModelMainObject2LocationConfigurationService.$inject = ['platformUIConfigInitService', 'modelMainUIConfigurationService', 'modelMainTranslationService'];

	function ModelMainObject2LocationConfigurationService(platformUIConfigInitService, modelMainUIConfigurationService, modelMainTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: modelMainUIConfigurationService.getModelObject2LocationDetailLayout(),
			dtoSchemeId: {typeName: 'ModelObject2LocationDto', moduleSubModule: 'Model.Main'},
			translator: modelMainTranslationService
		});
	}

})(angular);