(function(angular) {
	'use strict';
	/* global globals, angular */
	const moduleName = 'productionplanning.formwork';

	angular.module(moduleName).controller('ppsFormworkListController', PpsFormworkListController);

	PpsFormworkListController.$inject = ['$scope', '$injector', 'platformContainerControllerService', 'platformTranslateService',
		'ppsFormworkUIStandardService', 'platformGridAPI'];

	function PpsFormworkListController($scope, $injector, platformContainerControllerService, platformTranslateService,
		uiStandardService, platformGridAPI) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		const containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid);

		platformGridAPI.events.register(containerUUid, 'onCellChange', onCellChange);

		function onCellChange(e, args) {
			const column = args.grid.getColumns()[args.cell].field;
			$injector.get('ppsFormworkDataService').onEntityPropertyChanged(args.item, column);
		}

		$scope.$on('$destroy', function() {
			platformGridAPI.events.unregister(containerUUid, 'onCellChange', onCellChange);
		});
	}

})(angular);