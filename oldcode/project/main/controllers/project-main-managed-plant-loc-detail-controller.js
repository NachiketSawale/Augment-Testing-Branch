/**
 * Created by Nikhil on 19-04-2023
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainManagedPlantLocDetailController', ProjectMainManagedPlantLocDetailController);

	ProjectMainManagedPlantLocDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainManagedPlantLocDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6ff893e4f04448d38552f2e3678e2c25', 'projectMainTranslationService');
	}
})(angular);