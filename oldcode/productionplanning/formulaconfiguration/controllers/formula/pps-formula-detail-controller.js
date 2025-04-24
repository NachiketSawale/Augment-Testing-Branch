(function(angular) {
	'use strict';
  /* global globals, angular */
	var moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('ppsFormulaDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionPlanningFormulaConfigurationTranslationService'];

	function DetailController($scope, platformContainerControllerService, translateService) {
		var containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid, translateService);
	}

})(angular);