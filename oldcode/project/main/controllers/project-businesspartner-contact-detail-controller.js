/**
 * Created by leo on 12.10.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectPrj2BPContactDetailController', ProjectPrj2BPContactDetailController);

	ProjectPrj2BPContactDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectPrj2BPContactDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'B2CDEC2972234462804B1ACA15E00330', 'projectMainTranslationService');
	}




})(angular);