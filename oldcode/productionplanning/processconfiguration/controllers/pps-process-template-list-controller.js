(function(angular) {
	'use strict';

	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('productionplanningProcessConfigurationProcessTemplateListController', ProcessTemplateListController);

	ProcessTemplateListController.$inject = ['$scope', 'platformContainerControllerService', 'platformTranslateService',
		'productionplanningProcessConfigurationProcessTemplateUIStandardService'];

	function ProcessTemplateListController($scope, platformContainerControllerService, platformTranslateService, uiStandardService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		let containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid);
	}

})(angular);