/**
 * Created by anl on 6/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).controller('productionplanningEventconfigurationSequenceListController', EventSequenceListController);

	EventSequenceListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningEventconfigurationSequenceUIStandardService',
		'platformGridAPI',
		'productionplanningEventconfigurationSequenceDataService',
		'productionplanningCommonStructureFilterService',
		'$timeout'];

	function EventSequenceListController($scope, platformContainerControllerService,
										 platformTranslateService, uiStandardService,
										 platformGridAPI,
										 sequenceDataService,
										 ppsCommonStructureFilterService,
										 $timeout) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			//Handle IsTemplate
			sequenceDataService.handleFieldChanged(args.item, col);
		};

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.setTools(ppsCommonStructureFilterService.getToolbar(sequenceDataService));
		// update toolbar
		function updateToolsWA() {
			$timeout($scope.tools.update, 50);
		}
		ppsCommonStructureFilterService.onUpdated.register(updateToolsWA);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			ppsCommonStructureFilterService.onUpdated.unregister(updateToolsWA);
		});
	}

})(angular);