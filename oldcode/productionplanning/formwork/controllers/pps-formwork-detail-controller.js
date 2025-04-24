(function(angular) {
	'use strict';
  /* global globals, angular */
	var moduleName = 'productionplanning.formwork';

	angular.module(moduleName).controller('ppsFormworkDetailController', PpsFormworkDetailController);

	PpsFormworkDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningFormworkTranslationService'];

	function PpsFormworkDetailController($scope, platformContainerControllerService, translateService) {
		var containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid, translateService);
	}

})(angular);