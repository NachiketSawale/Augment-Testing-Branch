/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelMainObjectSetConfigurationService
	 * @function
	 * @requires platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
	 *           modelMainTranslationService
	 *
	 * @description Provides the configuration for the object set container.
	 */
	angular.module('model.main').service('modelMainObjectSetConfigurationService', ['platformUIConfigInitService',
		'platformSchemaService', 'modelMainUIConfigurationService', 'modelMainTranslationService',
		function (platformUIConfigInitService, platformSchemaService, modelMainUIConfigurationService,
		          modelMainTranslationService) {
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: modelMainUIConfigurationService.getModelObjectSetLayout(),
				dtoSchemeId: {typeName: 'ObjectSetDto', moduleSubModule: 'Model.Main'},
				translator: modelMainTranslationService
			});
		}]);
})();