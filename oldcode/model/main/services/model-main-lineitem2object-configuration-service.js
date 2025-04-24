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
	angular.module(moduleName).service('modelMainEstLineItem2ObjectConfigurationService', ModelMainEstLineItem2ObjectConfigurationService);

	ModelMainEstLineItem2ObjectConfigurationService.$inject = ['platformUIStandardConfigService', 'modelMainUIConfigurationService', 'modelMainTranslationService', 'platformSchemaService'];

	function ModelMainEstLineItem2ObjectConfigurationService(platformUIStandardConfigService, modelMainUIConfigurationService, modelMainTranslationService, platformSchemaService) {

		//platformUIConfigInitService.createUIConfigurationService({ service: this,
		//	layout: modelMainUIConfigurationService.getModelObjectDetailLayout(),
		//	dtoSchemeId: { typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
		//	translator: modelMainTranslationService
		//});
		var BaseService = platformUIStandardConfigService;

		var modelMainEstLineItem2ObjectAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'EstLineItem2MdlObjectDto',
			moduleSubModule: 'Estimate.Main'
		});
		if (modelMainEstLineItem2ObjectAttributeDomains) {
			modelMainEstLineItem2ObjectAttributeDomains = modelMainEstLineItem2ObjectAttributeDomains.properties;
		}

		function ModelMainEstLineItem2ObjectUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ModelMainEstLineItem2ObjectUIStandardService.prototype = Object.create(BaseService.prototype);
		ModelMainEstLineItem2ObjectUIStandardService.prototype.constructor = ModelMainEstLineItem2ObjectUIStandardService;

		return new BaseService(modelMainUIConfigurationService.getEstLineItem2ObjectDetailLayout(), modelMainEstLineItem2ObjectAttributeDomains, modelMainTranslationService);
	}

})(angular);
