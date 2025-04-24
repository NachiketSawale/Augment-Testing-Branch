/**
 * Created by baf on 18.01.2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'model.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMainPropertyDetailController', ModelMainPropertyDetailController);

	ModelMainPropertyDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainPropertyDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'A275A7128A6F40AAAF20D27386A4BBF9', 'modelMainTranslationService');
	}
})(angular);