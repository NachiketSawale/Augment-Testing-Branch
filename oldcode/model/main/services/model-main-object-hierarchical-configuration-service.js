/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMainObjectHierarchicalConfigurationService', ModelMainObjectConfigurationService);

	ModelMainObjectConfigurationService.$inject = ['platformUIConfigInitService', 'modelMainUIConfigurationService', 'modelMainTranslationService'];

	function ModelMainObjectConfigurationService(platformUIConfigInitService, modelMainUIConfigurationService, modelMainTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: modelMainUIConfigurationService.getModelObjectHierarchicalDetailLayout(),
			dtoSchemeId: {typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
			translator: modelMainTranslationService
		});
	}

})(angular);
