
(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('phaseReqTemplateDetailController', PhaseReqTemplateDetailController);

	PhaseReqTemplateDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'productionplanningProcessConfigurationTranslationService', 'phaseReqTemplateDataService'];

	function PhaseReqTemplateDetailController($scope, platformContainerControllerService, translationService, dataService) {
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid, translationService);

		$scope.onPropertyChange = function (entity, col) {
			dataService.onPropertyChanged(entity, col);
		};
	}

})(angular);