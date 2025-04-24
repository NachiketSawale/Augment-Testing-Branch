/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	//noinspection JSAnnotator
	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectInfoConfigurationService
	 * @function
	 * @requires platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
	 *           modelMainTranslationService
	 *
	 * @description Provides the configuration for the object info container.
	 */
	angular.module('model.main').factory('modelMainObjectInfoConfigurationService', ['platformUIStandardConfigService',
		'platformSchemaService', 'modelMainUIConfigurationService', 'modelMainTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
		          modelMainTranslationService) {
			var BaseService = platformUIStandardConfigService;

			var modelMainObjectAttributeDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'} );
 			if (modelMainObjectAttributeDomainSchema) {
				modelMainObjectAttributeDomainSchema = modelMainObjectAttributeDomainSchema.properties;
				modelMainObjectAttributeDomainSchema.Name = { domain: 'description' };
				modelMainObjectAttributeDomainSchema.FormattedValue = { domain: 'description' };
				modelMainObjectAttributeDomainSchema.Origin = { domain: 'description' };
				modelMainObjectAttributeDomainSchema.Kind = { domain: 'description' };
			}

			var modelMainObjectInfoDetailLayout = modelMainUIConfigurationService.getModelObjectInfoLayout();
			return new BaseService(modelMainObjectInfoDetailLayout, modelMainObjectAttributeDomainSchema, modelMainTranslationService);
		}]);
})();