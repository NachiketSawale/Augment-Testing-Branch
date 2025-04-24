/**
 * Created by leo on 19.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.map';
	
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMapDetailController', modelMapDetailController);
	
	modelMapDetailController.$inject = ['$scope', 'platformContainerControllerService','modelMapDataService'];
	
	function modelMapDetailController($scope, platformContainerControllerService,modelMapDataService) {
		platformContainerControllerService.initController($scope, moduleName, '5b2eda413a434857848e70df9ba397f9', 'modelMapTranslationService');
		modelMapDataService.retrieveRefreshedModelMaps();
	}
})(angular);