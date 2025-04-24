((angular) => {
	'use strict';
	/*global globlas, _*/

	const moduleName = 'productionplanning.item';
	const module = angular.module(moduleName);
	module.factory('ppsItemProductionOverviewDataProcessor', ppsItemProductionOverviewDataProcessor);

	ppsItemProductionOverviewDataProcessor.$inject = ['productionplanningItemStatusLookupService', 'productionplanningCommonProductStatusLookupService'];

	function ppsItemProductionOverviewDataProcessor(productionplanningItemStatusLookupService, productionplanningCommonProductStatusLookupService) {
		let service = {};
		service.processItem = (item) => {
			if (isPpsItem(item)) {
				let statusList = productionplanningItemStatusLookupService.getItemList();
				if (statusList && item.StatusFk) {
					let status = _.find(statusList, {Id: item.StatusFk});
					if (status.BackgroundColor) {
						item.Backgroundcolor = status.BackgroundColor;
					}
				}
			} else {
				let statusList = productionplanningCommonProductStatusLookupService.getList();
				if (statusList && item.StatusFk) {
					let status = _.find(statusList, {Id: item.StatusFk});
					if (status.BackgroundColor) {
						item.BackgroundColor = status.BackgroundColor;
					}
				}
			}
		};

		let isPpsItem = (item) => {
			return item.ParentId === null;
		};

		return service;
	}
})(angular);