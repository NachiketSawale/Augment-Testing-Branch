(function (angular) {

	'use strict';

	var moduleName = 'project.location';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectLocationDetailController', ProjectLocationDetailController);

	ProjectLocationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectLocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '33761E17BFB84451BD226BF2882BC11D', 'projectLocationTranslationService');
	}
})(angular);