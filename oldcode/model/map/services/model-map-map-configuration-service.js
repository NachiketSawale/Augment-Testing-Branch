/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc service
	 * @name modelMapMapConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMapMapConfigurationService', ModelMapMapConfigurationService);
	
	ModelMapMapConfigurationService.$inject = ['platformUIConfigInitService', 'modelMapUIConfig', 'modelMapTranslationService'];
	
	function ModelMapMapConfigurationService(platformUIConfigInitService, modelMapUIConfig, modelMapTranslationService) {
		
		platformUIConfigInitService.createUIConfigurationService({ service: this,
			layout: modelMapUIConfig.getStandardConfigForDetailView(),
			
			
			dtoSchemeId: { typeName: 'MapDto', moduleSubModule: 'Model.Map'},
			translator: modelMapTranslationService
		});
	}
	
})(angular);