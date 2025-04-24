
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('ppsProcessConfigurationPhaseListController', ListController);

	ListController.$inject = ['$scope', 'dataService', 'parentService', 'onParentSelChanged',
		'platformGridControllerService',
		'platformTranslateService',
		'ppsProcessConfigurationPhaseUIStandardService'];

	function ListController($scope, dataService, parentService, onParentSelChanged,
		platformGridControllerService,
		platformTranslateService,
		uiStandardService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, dataService.getValidationService(), {});

		parentService.registerSelectionChanged(onParentSelChanged);

		$scope.$on('$destroy', function () {
			parentService.unregisterSelectionChanged(onParentSelChanged);
		});
	}

})(angular);