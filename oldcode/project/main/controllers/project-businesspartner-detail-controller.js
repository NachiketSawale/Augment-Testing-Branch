/**
 * Created by leo on 12.10.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectPrj2BPDetailController', ProjectPrj2BPDetailController);

	ProjectPrj2BPDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectPrj2BPDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'A47736265C1242348D032A55DE80AA99', 'projectMainTranslationService');
	}
})(angular);