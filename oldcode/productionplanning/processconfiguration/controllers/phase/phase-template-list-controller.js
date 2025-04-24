
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('ppsProcessConfigurationPhaseTemplateListController', TemplateListController);

	TemplateListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'ppsProcessConfigurationPhaseTemplateUIStandardService',
		'platformGridAPI',
		'ppsProcessConfigurationPhaseTemplateDataService'];

	function TemplateListController($scope, platformContainerControllerService,
		platformTranslateService, uiStandardService,
		platformGridAPI,
		ppsProcessConfigurationPhaseTemplateDataService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			ppsProcessConfigurationPhaseTemplateDataService.handleFieldChanged(args.item, col);
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}

})(angular);