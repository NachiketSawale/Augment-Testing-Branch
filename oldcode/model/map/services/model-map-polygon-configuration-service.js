/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc service
	 * @name modelMapPolygonConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('modelMapPolygonConfigurationService', ModelMapPolygonConfigurationService);
	
	ModelMapPolygonConfigurationService.$inject = ['platformUIConfigInitService', 'modelMapPolygonUIConfig', 'modelMapTranslationService'];
	
	function ModelMapPolygonConfigurationService(platformUIConfigInitService, modelMapPolygonUIConfig, modelMapTranslationService) {
		
		platformUIConfigInitService.createUIConfigurationService({ service: this,
			layout: modelMapPolygonUIConfig.getStandardConfigForDetailView(),
			
			
			dtoSchemeId: { typeName: 'MapPolygonDto', moduleSubModule: 'Model.Map'},
			translator: modelMapTranslationService
		});
	}
	
})(angular);