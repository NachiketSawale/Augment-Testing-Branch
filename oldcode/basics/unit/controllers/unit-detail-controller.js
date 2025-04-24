(function (angular) {

	'use strict';
	var moduleName = 'basics.unit';

	angular.module(moduleName).controller('basicsUnitDetailController', BasicsUnitDetailController);

	BasicsUnitDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsUnitDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'A68D72F3D8B74A4A9DD677738A79EBAA', 'basicsUnitTranslationService');
	}
})(angular);