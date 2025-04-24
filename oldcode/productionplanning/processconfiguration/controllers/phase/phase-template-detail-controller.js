
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('ppsProcessConfigurationPhaseTemplateDetailController', TemplateDetailController);

	TemplateDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningProcessConfigurationTranslationService'];

	function TemplateDetailController($scope, platformContainerControllerService, translationService) {
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid, translationService);
	}

})(angular);