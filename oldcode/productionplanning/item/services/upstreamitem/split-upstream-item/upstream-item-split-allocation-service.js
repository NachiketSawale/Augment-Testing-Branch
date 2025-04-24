/**
 * Created by anl on 8/24/2021.
 */

(function (angular) {
	'use strict';
	/*globals angular, moment, _, Slick*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemUpstreamItemSplitAllocationService', AllocationService);

	AllocationService.$inject = [
		'$http', '$q', '$interval',
		'platformTranslateService',
		'platformGridAPI',
		'productionplanningItemUpstreamItemSplitUIService',
		'productionplanningItemUpstreamItemSplitSelectionService',
		'basicsCommonToolbarExtensionService'];

	function AllocationService(
		$http, $q, $interval,
		platformTranslateService,
		platformGridAPI,
		UIStandardService,
		upstreamItemSplitSelectionService,
		basicsCommonToolbarExtensionService) {

		var service = {};
		var scope = {};
		// var cache = {
		// 	updatedItems: []
		// };

		service.init = function ($scope) {
			scope = $scope;
			initGrid();
			service.active();
		};

		function initGrid() {
			var itemGrid = UIStandardService.GetItemGrid(2);
			scope.gridOptions = {
				allocationItemGrid: {
					state: itemGrid.state,
					columns: itemGrid.columns,
					tools: {
						showImages: false,
						showTitles: true,
						cssClass: 'tools',
						items: []
					},
					gridId: itemGrid.state,
				}
			};
			basicsCommonToolbarExtensionService.addBtn(scope.gridOptions.allocationItemGrid, null, null, 'G');

			var itemGridConfig = {
				id: scope.gridOptions.allocationItemGrid.state,
				columns: scope.gridOptions.allocationItemGrid.columns,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					enableConfigSave: true,
					enableModuleConfig: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: scope.gridOptions.allocationItemGrid.state
			};
			itemGridConfig.columns.current = scope.gridOptions.allocationItemGrid.columns;
			platformGridAPI.grids.config(itemGridConfig);
		}

		service.getModule = function () {//for validation
			return 'productionplanningItemUpstreamItemSplitAllocationService';
		};

		service.isValid = function () {
			return angular.isDefined(scope) && angular.isDefined(scope.context) && scope.context.selectedItems.length >= 1;
		};

		service.unActive = function () {
			var defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.active = function () {
			initData();
			scope.isBusy = true;
			$interval(function () {
				var itemGrid = platformGridAPI.grids.element('id', scope.gridOptions.allocationItemGrid.state);
				if (itemGrid.dataView) {
					itemGrid.dataView.setItems(scope.context.updatedItems);
					platformGridAPI.grids.refresh(scope.gridOptions.allocationItemGrid.state, true);
				}
				scope.isBusy = false;
			}, 300, 1);
		};

		service.getResult = function () {
			platformGridAPI.grids.commitEdit(scope.gridOptions.allocationItemGrid.state);
			return scope.context;
		};

		service.updateItem = function (item) {
			var itemIndex = _.findIndex(scope.context.updatedItems, {Id: item.Id});
			if (itemIndex >= 0) {
				scope.context.updatedItems[itemIndex] = item;
			}
		};

		service.clear = function clear() {
			scope.context.updatedItems = [];
		};

		service.busy = function (flag) {
			scope.isBusy = flag;
		};

		function initData() {
			scope.context.updatedItems = angular.copy(upstreamItemSplitSelectionService.getResult());

			//remove ppsItemFk for showing in list
			_.forEach(scope.context.updatedItems, function (item) {
				delete item.nodeInfo;
			});
		}

		return service;
	}
})(angular);