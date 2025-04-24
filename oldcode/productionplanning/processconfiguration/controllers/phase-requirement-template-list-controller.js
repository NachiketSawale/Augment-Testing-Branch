
(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).controller('phaseReqTemplateListController', PhaseReqTemplateListController);

	PhaseReqTemplateListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'phaseReqTemplateUIStandardService', 'phaseReqTemplateDataService', 'platformGridAPI'];

	function PhaseReqTemplateListController($scope, platformContainerControllerService,
										 platformTranslateService, uiStandardService, dataService, platformGridAPI) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			dataService.onPropertyChanged(args.item, field);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}

})(angular);