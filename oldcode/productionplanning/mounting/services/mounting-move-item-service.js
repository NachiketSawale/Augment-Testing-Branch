(function () {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var module = angular.module(moduleName);

	module.factory('productionplanningMountingMoveItemService', MoveItemService);

	MoveItemService.$inject = ['platformGridAPI'];
	
	function MoveItemService(platformGridAPI) {
		var service = {};

		function getGridSelectedInfos(gridId) {
			var selectedInfo = {};
			var gridinstance = platformGridAPI.grids.element('id', gridId).instance;

			selectedInfo.selectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];

			selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
				return gridinstance.getDataItem(row);
			});

			return selectedInfo;
		}

		function moveItem(gridId, type) {
			var items = platformGridAPI.items.data(gridId);
			var selectedData = getGridSelectedInfos(gridId);
			var i;

			switch(type) {
				case 1: //moveUp
					for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
						items.splice(selectedData.selectedRows[i] - 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
					}
					break;
				case 2: //moveDown
					selectedData.selectedRows = selectedData.selectedRows.reverse();
					for(i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i]+1 < items.length); i++) {
						items.splice(selectedData.selectedRows[i] + 1, 0, items.splice(selectedData.selectedRows[i], 1)[0]);
					}
					break;
			}

			platformGridAPI.items.data(gridId, items);
			platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});
		}

		function updateSorting(dataService, gridId) {
			var items = platformGridAPI.items.data(gridId);

			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.Sorting !== i) {
					item.Sorting = i;
					dataService.markItemAsModified(item);
				}
			}
		}

		function canMove(gridId, type) {
			var result = false;
			var items = platformGridAPI.items.data(gridId);
			var selectedData = getGridSelectedInfos(gridId);

			switch (type) {
				case 1: //canMoveUp
					if (!_.isNil(items) && items.length > 0 && !_.isNil(selectedData) && selectedData.selectedRows.length > 0) {
						result = items[0].Id !== selectedData.selectedRows.Id;
					}
					break;
				case 2: //canMoveDown
					if (!_.isNil(items) && items.length > 0 && !_.isNil(selectedData) && selectedData.selectedRows.length > 0) {
						result = items[items.length - 1].Id !== selectedData.selectedRows[selectedData.selectedRows.length - 1].Id;
					}
					break;
			}
			return result;
		}

		service.moveUp = function (dataService, gridId) {
			if (canMove(gridId, 1)) {
				moveItem(gridId, 1);
				updateSorting(dataService, gridId);
			}
		};

		service.moveDown = function (dataService, gridId) {
			if (canMove(gridId, 2)) {
				moveItem(gridId, 2);
				updateSorting(dataService, gridId);
			}
		};

		return service;
	}
})();
