/**
 * Created by zwz on 2022/8/19.
 */
(function () {
	'use strict';
	/* global angular, _ */
	const moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsPlannedQuantityGridHandler', GridHandler);
	GridHandler.$inject = ['platformRuntimeDataService', 'platformGridAPI'];

	function GridHandler(platformRuntimeDataService, platformGridAPI) {

		this.getSelectedItem = function getSelectedItem(gridId) {
			let selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			return selected;
		};

		this.setGridList = function setGridList(gridId, items) {
			if(_.isNil(items)){
				items = [];
			}
			platformGridAPI.items.data(gridId, items);
		};

		this.getGridData = function (gridId) {
			return platformGridAPI.items.data(gridId);
		};

		this.deleteItems = function (gridId, deleteItems){
			let grid = platformGridAPI.grids.element('id', gridId);
			_.forEach(deleteItems, function (item) {
				grid.dataView.deleteItem(item.Id);
			});
		};

		this.refreshList = (gridId) =>{
			platformGridAPI.configuration.refresh(gridId);
		};

	}
})();