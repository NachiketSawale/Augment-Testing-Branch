(function (angular) {
	'use strict';

	var moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainInfoRequestRelevantToDetailController', ProjectInfoRequestRelevantToDetailController);

	ProjectInfoRequestRelevantToDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestRelevantToDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Model.Main', 'a5779e8fa1d543febfdf92832d44a9e8', 'projectInfoRequestTranslationService');
	}
})(angular);