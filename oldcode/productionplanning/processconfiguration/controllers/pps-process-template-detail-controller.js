(function(angular) {
	'use strict';

	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('productionplanningProcessConfigurationProcessTemplateDetailController', ProcessTemplateDetailController);

	ProcessTemplateDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningProcessConfigurationTranslationService'];

	function ProcessTemplateDetailController($scope, platformContainerControllerService, translateService) {
		let containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid, translateService);
	}

})(angular);