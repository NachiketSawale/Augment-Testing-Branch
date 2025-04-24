(function (angular) {
	'use strict';

	var moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainInfoRequestDetailController', ProjectInfoRequestDetailController);

	ProjectInfoRequestDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectInfoRequestDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Model.Main', '8b9c47c94f0b4077beaaab998c399048', 'projectInfoRequestTranslationService');
	}
})(angular);