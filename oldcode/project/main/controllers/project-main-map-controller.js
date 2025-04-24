(function () {

	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).controller('projectMainMapController', ProjectMainProjectListController);

	ProjectMainProjectListController.$inject = ['$scope', 'platformMultiAddressControllerService', 'projectMainMapService'];
	function ProjectMainProjectListController($scope, addressControllerService, projectMainMapService) {
		addressControllerService.initController($scope, moduleName);
		projectMainMapService.setAddresses();
	}
})();