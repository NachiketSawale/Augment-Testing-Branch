/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	//noinspection JSAnnotator
	/**
	 * @ngdoc service
	 * @name model.main.modelMainViewerLegendConfigurationService
	 * @function
	 * @requires platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
	 *           modelMainTranslationService
	 *
	 * @description Provides the configuration for the viewer legend container.
	 */
	angular.module('model.main').factory('modelMainViewerLegendConfigurationService', ['platformUIStandardConfigService',
		'platformSchemaService', 'modelMainUIConfigurationService', 'modelMainTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
		          modelMainTranslationService) {
			var BaseService = platformUIStandardConfigService;

			var modelMainViewerLegendDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'} );
			if (modelMainViewerLegendDomainSchema) {
				modelMainViewerLegendDomainSchema = modelMainViewerLegendDomainSchema.properties;
				modelMainViewerLegendDomainSchema.Color = { domain: 'color' };
				modelMainViewerLegendDomainSchema.Description = { domain: 'description' };
				modelMainViewerLegendDomainSchema.MeshCount = { domain: 'dynamic' };
			}

			var modelMainViewerLegendDetailLayout = modelMainUIConfigurationService.getModelViewerLegendLayout();
			return new BaseService(modelMainViewerLegendDetailLayout, modelMainViewerLegendDomainSchema, modelMainTranslationService);
		}]);
})();