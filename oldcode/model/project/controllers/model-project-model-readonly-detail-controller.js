/**
 * Created by leo on 19.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectModelReadonlyDetailController', ModelProjectModelReadonlyDetailController);

	ModelProjectModelReadonlyDetailController.$inject = ['$scope','platformContainerControllerService'];
	function ModelProjectModelReadonlyDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'A4F63DA300D948B78A6492B65EF1E5D5', 'modelProjectMainTranslationService');
	}
})(angular);