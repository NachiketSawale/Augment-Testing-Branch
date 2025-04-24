(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('qto.main').controller('qtoMainSubTotalGridController',
		['$scope', 'platformGridControllerService', 'qtoMainSubTotalUIStandardService', 'qtoMainSubTotalService', 'platformGridAPI',
			function ($scope, gridControllerService, gridColumns, dataService, platformGridAPI) {
				var gridConfig = {
					columns: []
				};

				function onDblClick() {
					var current = dataService.getSelected();
					dataService.setQtoDetailSelectItem(current);
				}

				gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

				platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);
				});
			}
		]);
})(angular);