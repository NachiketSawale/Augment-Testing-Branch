/**
 * Created by chi on 2018/3/22.
 */
(function(angular){
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonGridPopupController', procurementCommonGridPopupController);

	procurementCommonGridPopupController.$inject = ['_', '$scope', '$popupInstance', '$popupContext', 'basicsLookupdataLookupControllerFactory', 'platformObjectHelper'];

	function procurementCommonGridPopupController(_, $scope, $popupInstance, $popupContext, basicsLookupdataLookupControllerFactory, platformObjectHelper) {
		var selectedItem = null;
		var selectedId = null;
		var gridId = $scope.settings.uuid || 'lookup-popup-' + $scope.settings.lookupType;
		var extension = _.merge({}, $scope.settings, {
			gridId: gridId,
			idProperty: $scope.settings.idProperty || 'Id'
		});
		var self = basicsLookupdataLookupControllerFactory.create({grid: true}, $scope, extension);
		var gridIns = null;
		var gridPlugin = {
			init: function (grid) {
				gridIns = grid;
				subscribeGridEvents(grid);
			},
			destroy: function () {
				unsubscribeGridEvents();
			}
		};

		/**
         * @description setData
         * @param data
         */
		$scope.options.setData = function (data) {
			self.updateData(data);
		};

		/**
         * @description update popup data
         * @param data
         */
		$scope.refreshData = function (data) {
			self.updateData(data);
			self.selectRowById(selectedId);
		};

		/**
         * update data source outside.
         * @param data data array
         */
		$scope.updateData = function(data) {
			// apply filter and cache.
			data = $scope.settings.dataView.processData(data);
			$scope.refreshData(data);
			$scope.updateDisplayData();
		};

		/**
         * @description reload lookup data.
         */
		$scope.refresh = function () {
			if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
				$scope.settings.onDataRefresh($scope);
			}
			else {
				$scope.settings.dataView.invalidateData();
				refresh('', true);
			}
		};

		$scope.$on('$destroy', function () {
			if ($scope.$close) {
				$scope.$close();
			}
			self.destroy();
		});

		initialize();

		function initialize() {
			$popupInstance.opened.then(onPopupOpened);
			$popupInstance.onResizeStop.register(onResizeStop);
			refresh($scope.searchString);
		}

		function onPopupOpened(){
			self.registerGridPlugin(gridPlugin);
		}

		function onResizeStop() {
			var grid = self.getGrid();
			if (grid) {
				grid.resizeGrid(grid.id);
			}
		}

		function refresh() {
			if ($scope.settings && _.isFunction($scope.settings.lookupRequest)) {
				var promise = $scope.settings.lookupRequest(_.isFunction($scope.settings.getFilterValue) ? $scope.settings.getFilterValue() : null);
				if (!promise) {
					$scope.isLoading = false;
					return;
				}
				promise.then(function (response) {
					$scope.isLoading = false;
					$scope.refreshData(response.data);
				}, function () {
					$scope.isLoading = false;
				});
			}
			else {
				$scope.isLoading = false;
			}
		}

		function subscribeGridEvents(grid) {
			grid.onMouseEnter.subscribe(onGridMouseEnter);
			grid.onClick.subscribe(onGridClick);
			grid.onSelectedRowsChanged.subscribe(onGridSelectedRowsChanged);
			grid.getData().onRowsChanged.subscribe(onGridDataViewRowsChanged);
		}

		function unsubscribeGridEvents() {
			gridIns.onMouseEnter.unsubscribe(onGridMouseEnter);
			gridIns.onClick.unsubscribe(onGridClick);
			gridIns.onSelectedRowsChanged.unsubscribe(onGridSelectedRowsChanged);
			gridIns.getData().onRowsChanged.unsubscribe(onGridDataViewRowsChanged);
		}

		function onGridMouseEnter(e, arg) {
			var cell = arg.grid.getCellFromEvent(e),
				rowIndex = cell.row;

			arg.grid.setSelectedRows([rowIndex]);
		}

		function onGridClick() {
			applySelection();
		}

		/**
         * @description: slick grid event handler
         */
		function onGridDataViewRowsChanged() {
			var grid = self.getGrid();
			var gridDataView = grid.getData();

			if (selectedItem) {
				var row = gridDataView.getRowById(platformObjectHelper.getValue(selectedItem, $scope.settings.idProperty));
				grid.setSelectedRows([row]);
			}
			else {
				grid.setSelectedRows([]);
			}
		}

		/**
         * @description: slick grid event handler
         */
		function onGridSelectedRowsChanged(e, args) {
			var grid = args.grid,
				row = args.rows[0],
				dataItem = grid.getDataItem(row);

			if (selectedItem !== dataItem) {
				selectedItem = dataItem;
			}
		}

		function applySelection() {
			var selectedItems = self.getSelectedItems(),
				selectedItem = selectedItems.length ? selectedItems[0] : null;

			if ($scope.canSelect(selectedItem)) {
				$scope.$close({
					isOk: true,
					value: $scope.settings.valueMember ? selectedItem[$scope.settings.valueMember] : selectedItem
				});
			}
		}
	}
})(angular);