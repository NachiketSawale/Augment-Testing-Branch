/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainPropertyConfigurationService
	 * @description provides validation methods for model object-3D entities
	 */
	angular.module(moduleName).service('modelMainPropertyConfigurationService', ModelMainPropertyConfigurationService);

	ModelMainPropertyConfigurationService.$inject = ['platformUIStandardConfigService', 'modelMainTranslationService', 'platformSchemaService', 'modelMainUIConfigurationService'];

	//function ModelMainPropertyConfigurationService(platformUIConfigInitService, modelMainUIConfigurationService, modelMainTranslationService) {
	//
	//	platformUIConfigInitService.createUIConfigurationService({ service: this,
	//		layout: modelMainUIConfigurationService.getModelPropertyDetailLayout(),
	//		dtoSchemeId: { typeName: 'PropertyDto', moduleSubModule: 'Model.Main'},
	//		translator: modelMainTranslationService
	//	});
	//}
	function ModelMainPropertyConfigurationService(platformUIStandardConfigService, modelMainTranslationService, platformSchemaService, modelMainUIConfigurationService) {

		var BaseService = platformUIStandardConfigService;
		var modelMainPropertyDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'PropertyDto',
			moduleSubModule: 'Model.Main'
		});
		if (modelMainPropertyDomainSchema) {
			modelMainPropertyDomainSchema = modelMainPropertyDomainSchema.properties;
			modelMainPropertyDomainSchema.Value = {domain: 'dynamic'};
		}

		function ModelPropertyUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ModelPropertyUIStandardService.prototype = Object.create(BaseService.prototype);
		ModelPropertyUIStandardService.prototype.constructor = ModelPropertyUIStandardService;
		var modelMainPropertyDetailLayout = modelMainUIConfigurationService.getModelPropertyDetailLayout();
		return new BaseService(modelMainPropertyDetailLayout, modelMainPropertyDomainSchema, modelMainTranslationService);
	}

})(angular);
