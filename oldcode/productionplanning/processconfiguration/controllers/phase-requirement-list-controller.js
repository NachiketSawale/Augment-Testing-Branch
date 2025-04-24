
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('ppsProcessConfigurationPhaseRequirementListController', ListController);

	ListController.$inject = ['$scope',
		'platformContainerControllerService',
		'platformGridControllerService',
		'platformDetailControllerService',
		'platformTranslateService',
		'ppsProcessConfigurationPhaseRequirementUIStandardService',
		'ppsProcessConfigurationPhaseRequirementUIReadonlyService',
		'productPhaseRequirementValidationService',
		'productPhaseRequirementDataService',
		'productionplanningPhaseDataServiceFactory',
		'platformGridAPI'];

	function ListController($scope,
		platformContainerControllerService,
		platformGridControllerService,
		platformDetailControllerService,
		platformTranslateService,
		uiStandardService,
		uiReadonlyService,
		productPhaseRequirementValidationService,
		productPhaseRequirementDataService,
		phaseDataServiceFactory,
		platformGridAPI) {

		platformTranslateService.translateGridConfig(uiStandardService.getService(productPhaseRequirementDataService).getStandardConfigForListView().columns);
		var containerId = $scope.getContentValue('id');
		var dataService = null;

		if(containerId === 'productionplanning.product.phase.requirement.list'){
			dataService = productPhaseRequirementDataService;
			let productPhaseDataService = phaseDataServiceFactory.getService('productionplanning.product', dataService.parentService());
			platformGridControllerService.initListController($scope, uiStandardService.getService(productPhaseRequirementDataService), productPhaseRequirementDataService, productPhaseRequirementValidationService, {});

			productPhaseDataService.registerSelectionChanged(productPhaseRequirementDataService.load);
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
			dataService.parentService().registerUpdateDone(loadDataIfProdCompsUpdated);

			$scope.$on('$destroy', function () {
				productPhaseDataService.unregisterSelectionChanged(productPhaseRequirementDataService.load);
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
				dataService.parentService().unregisterUpdateDone(loadDataIfProdCompsUpdated);
			});
		}

		function onCellChange(e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataService.onPropertyChanged(args.item, field);
		}

		function loadDataIfProdCompsUpdated(updateData) {
			if (updateData && updateData.EngProdComponentToSave) {
				dataService.load();
			}
		}
	}

})(angular);