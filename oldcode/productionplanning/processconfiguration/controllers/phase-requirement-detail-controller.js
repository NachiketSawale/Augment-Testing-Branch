
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('ppsProcessConfigurationPhaseRequirementDetailController', DetailController);

	DetailController.$inject = ['$scope',
		'platformContainerControllerService',
		'platformGridControllerService',
		'platformDetailControllerService',
		'platformTranslateService',
		'ppsProcessConfigurationPhaseRequirementUIStandardService',
		'ppsProcessConfigurationPhaseRequirementUIReadonlyService',
		'productPhaseRequirementValidationService',
		'productPhaseRequirementDataService'];

	function DetailController($scope,
		platformContainerControllerService,
		platformGridControllerService,
		platformDetailControllerService,
		platformTranslateService,
		uiStandardService,
		uiReadonlyService,
		productPhaseRequirementValidationService,
		productPhaseRequirementDataService) {

		platformTranslateService.translateGridConfig(uiStandardService.getService(productPhaseRequirementDataService).getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		var containerId = $scope.getContentValue('id');
		var isReadonly = $scope.getContentValue('isReadonly') || false;
		var dataService = null;

		if(containerId === 'productionplanning.product.phase.requirement.detail'){
			dataService = productPhaseRequirementDataService;
			platformDetailControllerService.initDetailController($scope, productPhaseRequirementDataService, productPhaseRequirementValidationService, uiStandardService.getService(productPhaseRequirementDataService));
		}

		var detailView = uiStandardService.getService(dataService).getStandardConfigForDetailView();
		_.forEach(detailView.rows, function (row) {
			row.change = function (entity, field) {
				dataService.onPropertyChanged(entity, field);
			};
		});
		// platformContainerControllerService.initController($scope, moduleName, containerUid);
	}

})(angular);