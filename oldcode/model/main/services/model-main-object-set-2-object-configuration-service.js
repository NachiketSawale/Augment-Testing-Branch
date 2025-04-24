/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelMainObjectSet2ObjectConfigurationService
	 * @function
	 * @requires platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
	 *           modelMainTranslationService
	 *
	 * @description Provides the configuration for the object set container.
	 */
	angular.module('model.main').service('modelMainObjectSet2ObjectConfigurationService', ['platformUIConfigInitService',
		'platformSchemaService', 'modelMainUIConfigurationService', 'modelMainTranslationService',
		function (platformUIConfigInitService, platformSchemaService, modelMainUIConfigurationService,
		          modelMainTranslationService) {
			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: modelMainUIConfigurationService.getModelObjectSet2ObjectLayout(),
				dtoSchemeId: {typeName: 'ObjectSet2ObjectDto', moduleSubModule: 'Model.Main'},
				translator: modelMainTranslationService
			});
		}]);
})();