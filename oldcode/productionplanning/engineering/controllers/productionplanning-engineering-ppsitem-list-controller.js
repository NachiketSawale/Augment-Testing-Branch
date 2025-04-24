(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).controller('productionplanningEngineeringPpsItemListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService',
		'$timeout', 'basicsCommonToolbarExtensionService',
		'productionplanningEngineeringPpsItemDataService',
		'platformGridAPI'];

	function ListController($scope, platformContainerControllerService,
							$timeout,
							basicsCommonToolbarExtensionService,
							engineeringPpsItemDataService,
							platformGridAPI) {
		platformContainerControllerService.initController($scope, moduleName, $scope.getContentValue('uuid'));
		
		var onCellChange = function (e, args) {
			var field = args.grid.getColumns()[args.cell].field;
			if(field === 'Quantity') {
				var selected = engineeringPpsItemDataService.getSelected();
				engineeringPpsItemDataService.showEventQuantityDialog(selected);
			}
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);


		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});
	}
})(angular);