/**
 * Created by anl on 8/24/2021.
 */

(function (angular) {
	'use strict';
	/*globals angular,_,globals,Slick*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemUpstreamItemSplitSelectionService', SelectionService);

	SelectionService.$inject = [
		'$http', '$q', '$interval',
		'platformTranslateService',
		'platformGridAPI',
		'productionplanningItemUpstreamItemSplitUIService',
		'basicsCommonToolbarExtensionService',
		'cloudCommonGridService',
		'$translate'];

	function SelectionService(
		$http, $q, $interval,
		platformTranslateService,
		platformGridAPI,
		UIStandardService,
		basicsCommonToolbarExtensionService,
		cloudCommonGridService,
		$translate) {

		var service = {};
		var scope = {};
		var alerts = [];
		var selectedUpstreamItem = {};

		service.init = function ($scope) {
			scope = $scope;
			selectedUpstreamItem = _.clone(scope.context.selectedUpstreamItem);
			initGrid();
			service.active();
		};

		function initGrid() {
			var itemGrid = UIStandardService.GetItemGrid(1);

			scope.gridOptions = {
				selectionItemGrid: {
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
			basicsCommonToolbarExtensionService.addBtn(scope.gridOptions.selectionItemGrid, null, null, 'G');

			var itemGridConfig = {
				id: scope.gridOptions.selectionItemGrid.state,
				columns: scope.gridOptions.selectionItemGrid.columns,
				lazyInit: true,
				options: {
					indicator: true,
					editable: true,
					idProperty: 'Id',
					tree: true,
					parentProp: 'PPSItemFk',
					childProp: 'ChildItems',
					hierarchyEnabled: true,
					skipPermissionCheck: true,
					enableConfigSave: true,
					enableModuleConfig: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: scope.gridOptions.selectionItemGrid.state,
			};

			itemGrid.columns.current = scope.gridOptions.selectionItemGrid.columns;
			platformGridAPI.grids.config(itemGridConfig);
		}

		service.getModule = function () {
			return 'productionplanningItemUpstreamItemSplitSelectionService';
		};

		service.isValid = function () {
			return angular.isDefined(scope) && angular.isDefined(scope.context) && scope.context.selectedItems.length >= 1 && alerts.length === 0;
		};

		service.unActive = function () {
			scope.context.selectedItems = _.filter(scope.context.selectedItems, function (item) {
				return item.Checked;
			});

			var defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.active = function () {
			alerts = [];
			scope.isBusy = true;
			$http.get(globals.webApiBaseUrl + 'productionplanning/item/upstreamitem/getppsitems?id=' + selectedUpstreamItem.Id).then(function (response) {
				if (response.data && response.data.length > 0) {
					$interval(function () {
						var itemGrid = platformGridAPI.grids.element('id', scope.gridOptions.selectionItemGrid.state);
						if (itemGrid.dataView) {
							itemGrid.dataView.setItems(response.data);
							platformGridAPI.grids.refresh(scope.gridOptions.selectionItemGrid.state, true);
						}
					}, 300, 1);
				}
			}).finally(() => {
				scope.isBusy = false;
			});
		};

		service.getResult = function () {
			return scope.context.selectedItems;
		};

		service.getAlerts = function () {
			return alerts;
		};

		service.updateSelectedItems = function (items) {
			scope.context.selectedItems = items;
		};

		service.clear = function clear() {
			scope.context.selectedItems = [];
		};

		service.validateCheckItem = function (checkItem) {
			var result = true;
			var shownItems = platformGridAPI.rows.getRows(scope.gridOptions.selectionItemGrid.state);
			var flattenItems = [];
			flattenItems = cloudCommonGridService.flatten(shownItems, flattenItems, 'ChildItems');

			if (!checkItem.Checked) {
				var ids = _.map(alerts, 'id');
				var index = ids.indexOf(checkItem.Id);
				if (index > -1) {
					alerts.splice(index, 1);
				}
			} else {
				if (!noSplitedChildren(checkItem)) {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.upstreamItem.wrongSelect', checkItem),
						css: 'alert-info',
						id: checkItem.Id
					});
					result = false;
				}
				else if (!validChildren(checkItem)) {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.upstreamItem.wrongSelect', checkItem),
						css: 'alert-info',
						id: checkItem.Id
					});
					result = false;
				}
				else if (!validParent(checkItem, flattenItems)) {
					alerts.push({
						title: $translate.instant('productionplanning.item.creation.alertTitle'),
						message: $translate.instant('productionplanning.item.upstreamItem.wrongSelect', checkItem),
						css: 'alert-info',
						id: checkItem.Id
					});
					result = false;
				}
			}
			return result;
		};

		service.validateAlertItems = function(){
			var itemGrid = platformGridAPI.grids.element('id', scope.gridOptions.selectionItemGrid.state);
			if (itemGrid && itemGrid.dataView) {
				var shownItems = itemGrid.dataView.getRows();
				var flattenItems = [];
				flattenItems = cloudCommonGridService.flatten(shownItems, flattenItems, 'ChildItems');
				var ids = _.map(alerts, 'id');
				var alertItems = _.filter(flattenItems, function(ppsItem){
					return ids.indexOf(ppsItem.Id) > -1;
				});

				_.forEach(alertItems, function(alertItem){
					if(noSplitedChildren(alertItem) && validChildren(alertItem) && validParent(alertItem, flattenItems)){
						var index = ids.indexOf(alertItem.Id);
						alerts.splice(index, 1);
					}
				});
			}
		};

		function noSplitedChildren(checkItem) {
			var flattenItems = [];
			flattenItems = cloudCommonGridService.flatten([checkItem], flattenItems, 'ChildItems');
			var upstreamItems = _.filter(flattenItems, function (item) {
				return item.Id !== checkItem.Id && item.UpstreamItemQuantity !== null;
			});
			return upstreamItems.length === 0 || checkItem.UpstreamItemQuantity !== null;
		}

		function validChildren(checkItem) {
			var flattenItems = [];
			flattenItems = cloudCommonGridService.flatten([checkItem], flattenItems, 'ChildItems');
			var upstreamItems = _.filter(flattenItems, function (item) {
				return item.Id !== checkItem.Id && item.Checked;
			});
			return upstreamItems.length === 0 || checkItem.UpstreamItemQuantity !== null;
		}

		function validParent(item, shownPUs) {
			var parentItem = _.find(shownPUs, {Id: item.PPSItemFk});
			if (!parentItem) {
				return true;
			} else if (parentItem.Checked && parentItem.UpstreamItemQuantity === null) {
				return false;
			} else {
				return validParent(parentItem, shownPUs);
			}
		}

		return service;
	}
})(angular);