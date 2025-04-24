(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).controller('ppsDrawingRevisionListController', RevisionListController);

	RevisionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function RevisionListController($scope, platformContainerControllerService) {
		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, guid);
	}
})(angular);