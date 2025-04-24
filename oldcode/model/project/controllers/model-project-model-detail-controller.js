/**
 * Created by leo on 19.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectModelDetailController', ModelProjectModelDetailController);

	ModelProjectModelDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelProjectModelDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ad70980f975343f1a2af096762faec25', 'modelProjectMainTranslationService');
	}
})(angular);