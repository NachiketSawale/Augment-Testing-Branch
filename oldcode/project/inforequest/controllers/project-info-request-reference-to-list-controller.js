(function (angular) {
	'use strict';

	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestReferenceToListController', ProjectInfoRequestReferenceToListController);

	ProjectInfoRequestReferenceToListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestReferenceToListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '251358b08bbf48cdb9ed586711fbabb1');
	}
})(angular);