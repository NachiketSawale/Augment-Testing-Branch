/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc service
	 * @name modelMapLevelConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMapLevelConfigurationService', ModelMapLevelConfigurationService);
	
	ModelMapLevelConfigurationService.$inject = ['platformUIConfigInitService', 'modelMapPolygonUIConfig', 'modelMapTranslationService'];
	
	function ModelMapLevelConfigurationService(platformUIConfigInitService, modelMapLevelUIConfig, modelMapTranslationService) {
		
		platformUIConfigInitService.createUIConfigurationService({ service: this,
			layout: modelMapLevelUIConfig.getStandardConfigForDetailView(),
			
			
			dtoSchemeId: { typeName: 'MapLevelDto', moduleSubModule: 'Model.Map'},
			translator: modelMapTranslationService
		});
	}
	
})(angular);