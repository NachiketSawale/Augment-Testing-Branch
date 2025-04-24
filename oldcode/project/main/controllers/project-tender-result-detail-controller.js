(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainTenderResultDetailController', ProjectMainTenderResultDetailController);

	ProjectMainTenderResultDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainTenderResultDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3dd9fa3c5742468db296da347a7f1c31', 'projectMainTranslationService');
	}
})(angular);