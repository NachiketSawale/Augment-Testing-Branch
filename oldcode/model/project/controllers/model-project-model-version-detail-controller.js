/**
 * Created by leo on 19.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.project';
	
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectModelVersionDetailController', modelProjectModelVersionDetailController);
	
	modelProjectModelVersionDetailController.$inject = ['$scope', 'platformContainerControllerService'];
	
	function modelProjectModelVersionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a16d5eb0ec314c00871308b03f4a1c39', 'modelProjectMainTranslationService');
	}
})(angular);