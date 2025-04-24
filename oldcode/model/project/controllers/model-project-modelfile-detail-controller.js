/**
 * Created by leo on 19.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectModelFileDetailController', ModelProjectModelFileDetailController);

	ModelProjectModelFileDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelProjectModelFileDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7215f25341714c81af7657fcd3854911', 'modelProjectMainTranslationService');
	}
})(angular);