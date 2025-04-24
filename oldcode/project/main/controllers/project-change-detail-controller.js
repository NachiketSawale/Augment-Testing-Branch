/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainChangeDetailController', ProjectMainChangeDetailController);

	ProjectMainChangeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainChangeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'E1405BBC35214477B518D2639AF5B2ED', 'projectMainTranslationService');
	}
})(angular);