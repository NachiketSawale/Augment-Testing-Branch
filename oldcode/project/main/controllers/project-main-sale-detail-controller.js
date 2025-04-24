/**
 * Created by leo on 13.10.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainSaleDetailController', ProjectMainSaleDetailController);

	ProjectMainSaleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectMainSaleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b85c94bf5b2a4496bd7e2cd7312b9104', 'projectMainTranslationService');
	}
})(angular);