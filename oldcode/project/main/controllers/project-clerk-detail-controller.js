/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainClerkDetailController', ProjectMainClerkDetailController);

	ProjectMainClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '190FEBD3204840F58F5D6398705744F9', 'projectMainTranslationService');
	}
})(angular);