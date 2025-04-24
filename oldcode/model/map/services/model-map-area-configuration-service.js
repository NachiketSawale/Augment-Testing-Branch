/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc service
	 * @name modelMapAreaConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMapAreaConfigurationService', ModelMapAreaConfigurationService);
	
	ModelMapAreaConfigurationService.$inject = ['platformUIConfigInitService', 'modelMapAreaUIConfig', 'modelMapTranslationService'];
	
	function ModelMapAreaConfigurationService(platformUIConfigInitService, modelMapAreaUIConfig, modelMapTranslationService) {
		
		platformUIConfigInitService.createUIConfigurationService({ service: this,
			layout: modelMapAreaUIConfig.getStandardConfigForDetailView(),
			
			
			dtoSchemeId: { typeName: 'MapAreaDto', moduleSubModule: 'Model.Map'},
			translator: modelMapTranslationService
		});
	}
	
})(angular);