/**
 * Created by Frank Baedeker on 15.01.2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMainObjectConfigurationService', ModelMainObjectConfigurationService);

    ModelMainObjectConfigurationService.$inject = ['platformUIStandardConfigService', 'modelMainUIConfigurationService', 'modelMainTranslationService', 'platformSchemaService'];

	function ModelMainObjectConfigurationService(platformUIStandardConfigService, modelMainUIConfigurationService, modelMainTranslationService, platformSchemaService) {

		//platformUIConfigInitService.createUIConfigurationService({ service: this,
		//	layout: modelMainUIConfigurationService.getModelObjectDetailLayout(),
		//	dtoSchemeId: { typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
		//	translator: modelMainTranslationService
		//});
		var BaseService = platformUIStandardConfigService;

		var modelProjectModelAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'} );
		if(modelProjectModelAttributeDomains) {
			modelProjectModelAttributeDomains = modelProjectModelAttributeDomains.properties;
/*
			angular.extend(modelProjectModelAttributeDomains, {IsMarked: {
				domain:'marker'
			}});
*/
		}

		function ModelProjectModelUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ModelProjectModelUIStandardService.prototype = Object.create(BaseService.prototype);
		ModelProjectModelUIStandardService.prototype.constructor = ModelProjectModelUIStandardService;

		return new BaseService(modelMainUIConfigurationService.getModelObjectDetailLayout(), modelProjectModelAttributeDomains, modelMainTranslationService);
	}

})(angular);