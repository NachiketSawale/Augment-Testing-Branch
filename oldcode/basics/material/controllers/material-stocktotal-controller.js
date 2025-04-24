/*
 * Created by lcn on 4/18/2022.
 */

// eslint-disable-next-line no-redeclare
/* global angular */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialStockTotalGridController',
		['$scope', '$translate', 'platformGridControllerService', 'basicsMaterialStockTotalDataService', 'basicsMaterialStockTotalUIStandardService','basicsMaterialRecordService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns,parentService) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					options: {
						editable: false,
						readonly: false
					}
				};

				dataService.createItem = false;
				dataService.deleteItem = false;

				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);

				parentService.registerSelectedEntitiesChanged(function () {
					dataService.deselect();
					dataService.setList([]);
				});

				// un-register on destroy
				$scope.$on('$destroy', function () {
					parentService.unregisterSelectedEntitiesChanged(function () {
						dataService.deselect();
						dataService.setList([]);
					});
				});
			}]);
})(angular);