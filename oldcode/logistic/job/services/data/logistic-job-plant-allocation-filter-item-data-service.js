/**
 * Created by baf on 2019-08-08
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	// logisticJobPlantAllocationFilterItemDataService
	angular.module(moduleName).service('logisticJobPlantAllocationFilterItemDataService', LogisticJobPlantAllocationFilterItemDataService);

	LogisticJobPlantAllocationFilterItemDataService.$inject = ['_'];

	function LogisticJobPlantAllocationFilterItemDataService(_) {

		var data = {
			filterItems: [],
			nextId: 1,
			typedServices: []
		};

		this.displayFilterItems = function getFilterItems(filterItems) {
			data.filterItems.length = 0;
			data.nextId = 0;
			_.forEach(filterItems, function(item) {
				data.filterItems.push(_.cloneDeep(item));
				if(data.nextId < item.Id) {
					data.nextId = item.Id;
				}
			});

			++data.nextId;

			return data.filterItems;
		};

		this.createFilterItem = function createFilterItem(type) {
			let newFilterItem = {
				Id: data.nextId,
				FilterType: type,
				FilterValue: null
			};

			++data.nextId;

			return newFilterItem;
		};

		this.getFilterItems = function getFilterItems() {
			return data.filterItems;
		};

		this.provideFilterItems = function provideFilterItems() {
			let filterItems = [];
			_.forEach(data.typedServices, function(service) {
				_.forEach(service.provideFilterItems(), function(filterItem) {
					if(filterItem.FilterType && filterItem.FilterValue) {
						filterItems.push(filterItem);
					}
				});
			});

			return filterItems;
		};

		this.takeTypedService = function takeTypedService(typedService) {
			data.typedServices.push(typedService);
		};
	}
})(angular);
