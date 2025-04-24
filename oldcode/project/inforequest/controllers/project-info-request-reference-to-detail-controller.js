(function (angular) {
	'use strict';

	const moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInfoRequestReferenceToDetailController',
		projectInfoRequestReferenceToDetailController);

	projectInfoRequestReferenceToDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function projectInfoRequestReferenceToDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6a7b8a7849e74634afc484437d30ab60');
	}
})(angular);
