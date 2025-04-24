(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainTimekeepingClerkDetailController', ProjectMainTimekeepingClerkDetailController);

	ProjectMainTimekeepingClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainTimekeepingClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'c9902287755c4d51bacc15895b8fcb83', 'projectMainTranslationService');
	}
})(angular);