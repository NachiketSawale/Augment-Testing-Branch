/**
 * Created by Frank Baedeker on 15.01.2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc service
	 * @name modelMainObject3DConfigurationService
	 * @description provides validation methods for model object-3D entities
	 */
	angular.module(moduleName).service('modelMainObject3DConfigurationService', ModelMainObject3DConfigurationService);

	ModelMainObject3DConfigurationService.$inject = ['platformUIConfigInitService', 'modelMainUIConfigurationService', 'modelMainTranslationService'];

	function ModelMainObject3DConfigurationService(platformUIConfigInitService, modelMainUIConfigurationService, modelMainTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({ service: this,
			layout: modelMainUIConfigurationService.getModelObject3DDetailLayout(),
			dtoSchemeId: { typeName: 'ModelObject3DDto', moduleSubModule: 'Model.Main'},
			translator: modelMainTranslationService
		});
	}

})(angular);