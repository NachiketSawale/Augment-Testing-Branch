/**
 * Created by baf on 2023-02-27
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	// logisticJobPlantAllocationFilterItemTypeDataService
	angular.module(moduleName).service('logisticJobPlantAllocationFilterItemTypeDataService', LogisticJobPlantAllocationFilterItemTypeDataService);

	LogisticJobPlantAllocationFilterItemTypeDataService.$inject = ['_', 'logisticJobPlantAllocationFilterItemDataService'];

	function LogisticJobPlantAllocationFilterItemTypeDataService(_, logisticJobPlantAllocationFilterItemDataService) {
		let self = this;

		let data = {
			getLoaded: true,
			filterItems: [],
			selected: null,
			createCallback: null
		};

		this.getFilterItems = function getFilterItems() {
			data.filterItems.length = 0;
			_.forEach(logisticJobPlantAllocationFilterItemDataService.getFilterItems(), function(item) {
				if(item.FilterType === 2) {
					data.filterItems.push(item);
				}
			});

			return data.filterItems;
		};

		this.setSelected = function setSelected(sel) {
			data.selected = sel;
		};

		this.registerEntityCreated = function registerEntityCreated(cb) {
			data.createCallback = cb;
		};

		this.unregisterEntityCreated = function unregisterEntityCreated(cb) {
			if(data.createCallback === cb) {
				data.createCallback = null;
			}
		};

		this.createFilterItem = function createFilterItem() {
			let newFilterItem = logisticJobPlantAllocationFilterItemDataService.createFilterItem(2);

			data.filterItems.push(newFilterItem);
			data.selected = newFilterItem;

			if(_.isFunction(data.createCallback)) {
				data.createCallback(newFilterItem);
			}
		};

		this.deleteFilterItems = function deleteFilterItems(selected) {
			data.filterItems = _.filter(data.filterItems, function (item) {
				return _.every(selected, function (sel) {
					return item.Id !== sel.Id;
				});
			});
		};

		this.discardChanges = function discardChanges() {
			data.filterItems.length = 0;
		};

		this.provideFilterItems = function provideFilterItems() {
			if(data.getLoaded) {
				self.getFilterItems();
				data.getLoaded = false;
			}
			return data.filterItems;
		};

		logisticJobPlantAllocationFilterItemDataService.takeTypedService(this);
	}
})(angular);
