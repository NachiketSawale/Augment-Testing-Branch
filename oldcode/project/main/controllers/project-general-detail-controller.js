(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainGeneralDetailController', ProjectMainGeneralDetailController);

	ProjectMainGeneralDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainGeneralDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '82366961458345aa8113ed3c2fcddc1d', 'projectMainTranslationService');
	}
})(angular);