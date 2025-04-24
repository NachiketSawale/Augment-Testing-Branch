(function (angular) {
	'use strict';

	var moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainInfoRequestRelevantToListController', ProjectInfoRequestRelevantToListController);

	ProjectInfoRequestRelevantToListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestRelevantToListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Model.Main', '55f24a16454c4b8ab9fbf2e4fe2e90e6');
	}
})(angular);