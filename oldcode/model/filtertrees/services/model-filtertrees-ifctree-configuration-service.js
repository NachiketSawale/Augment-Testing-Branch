/*
 * $Id: model-main-object-hierarchical-configuration-service.js 334 2021-05-21 10:07:38Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.filtertrees';

	/**
	 * @ngdoc service
	 * @name modelFiltertreesIFCTreeConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelFiltertreesIFCTreeConfigurationService', modelFiltertreesIFCTreeConfigurationService);

	modelFiltertreesIFCTreeConfigurationService.$inject = ['platformUIConfigInitService', 'modelFiltertreesUIConfigurationService', 'modelFiltertreesTranslationService'];

	function modelFiltertreesIFCTreeConfigurationService(platformUIConfigInitService, modelFiltertreesUIConfigurationService, modelFiltertreesTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: modelFiltertreesUIConfigurationService.getModelObjectIFCTreeDetailLayout(),
			dtoSchemeId: { typeName: 'ModelFiltertreeNodeDto', moduleSubModule: 'Model.Filtertrees' },
			translator: modelFiltertreesTranslationService
		});
	}

})(angular);
