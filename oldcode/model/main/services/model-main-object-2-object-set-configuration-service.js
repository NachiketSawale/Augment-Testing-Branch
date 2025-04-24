/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainObject2ObjectSetConfigurationService
	 * @function
	 * @requires platformUIStandardConfigService, platformSchemaService, modelMainUIConfigurationService,
	 *           modelMainTranslationService
	 *
	 * @description Provides the configuration for the object set container.
	 */
	angular.module(moduleName).service('modelMainObject2ObjectSetConfigurationService', ModelMainObject2ObjectSetConfigurationService);

	ModelMainObject2ObjectSetConfigurationService.$inject = ['platformUIStandardConfigService', 'modelMainUIConfigurationService', 'modelMainTranslationService', 'platformSchemaService'];
	function ModelMainObject2ObjectSetConfigurationService(platformUIStandardConfigService, modelMainUIConfigurationService, modelMainTranslationService, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var modelMainObject2ObjectSetDomainSchema = platformSchemaService.getSchemaFromCache( {  typeName: 'ObjectSet2ObjectDto', moduleSubModule: 'Model.Main'} );
		if(modelMainObject2ObjectSetDomainSchema) {
			modelMainObject2ObjectSetDomainSchema = modelMainObject2ObjectSetDomainSchema.properties;
		}

		function ModelMainObject2ObjectSetUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ModelMainObject2ObjectSetUIStandardService.prototype = Object.create(BaseService.prototype);
		ModelMainObject2ObjectSetUIStandardService.prototype.constructor = ModelMainObject2ObjectSetUIStandardService;

		var modelMainObject2ObjectSetDetailLayout = modelMainUIConfigurationService.getModelObject2ObjectSetLayout();

		return new BaseService( modelMainObject2ObjectSetDetailLayout, modelMainObject2ObjectSetDomainSchema, modelMainTranslationService);
	}
})(angular);