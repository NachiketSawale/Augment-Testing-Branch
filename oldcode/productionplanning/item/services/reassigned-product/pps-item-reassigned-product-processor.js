(function() {
	'use strict';
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('productionplanningReassignedProductProcessor',productionplanningReassignedProductProcessor);
	productionplanningReassignedProductProcessor.$inject = ['productionplanningCommonProductStatusLookupService'];
	function productionplanningReassignedProductProcessor(productionplanningCommonProductStatusLookupService) {

		var service = {};

		service.processItem = function processItem(item) {
			if (item.Type === 1) {
				item.image = 'control-icons ico-product';
				var statusList = productionplanningCommonProductStatusLookupService.getList();
				var status = _.find(statusList, {Id: item.StatusFk});
				if(status.BackgroundColor) {
					item.BackgroundColor = status.BackgroundColor;
				}
			}
			else if (item.Type === 2){
				item.image = 'control-icons ico-product-bundles';
			}
		};

		return service;
	}
})();
