
(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('ppsProcessConfigurationPhaseDetailController', DetailController);

	DetailController.$inject = ['$scope', 'dataService', 'parentService', 'onParentSelChanged',
		'platformDetailControllerService',
		'platformTranslateService',
		'ppsProcessConfigurationPhaseUIStandardService'];

	function DetailController($scope, dataService, parentService, onParentSelChanged,
		platformDetailControllerService,
		platformTranslateService,
		uiStandardService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		platformDetailControllerService.initDetailController($scope, dataService, dataService.getValidationService(), uiStandardService);

		let detailView = uiStandardService.getStandardConfigForDetailView();
		_.forEach(detailView.rows, function (row) {
			row.change = function (entity, field) {
				dataService.handleFieldChanged(entity, field);
			};
		});

		parentService.registerSelectionChanged(onParentSelChanged);

		$scope.$on('$destroy', function () {
			parentService.unregisterSelectionChanged(onParentSelChanged);
		});
	}

})(angular);