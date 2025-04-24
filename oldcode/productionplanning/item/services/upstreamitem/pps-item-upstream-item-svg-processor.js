(function (angular) {
	'use strict';
   /* global _, angular */
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemUpstreamItemSvgProcessor', ppsItemUpstreamItemProcessor);

	ppsItemUpstreamItemProcessor.$inject = ['platformRuntimeDataService', 'productionplanningUpStreamStatusLookupService'];

	function ppsItemUpstreamItemProcessor(platformRuntimeDataService, productionplanningUpStreamStatusLookupService) {
		var service = {};

		service.processItem = function processItem(item) {
			if (item) {
				var statusList = productionplanningUpStreamStatusLookupService.getList();
				var status = _.find(statusList, {Id: item.PpsUpstreamStatusFk});
				if(status.BackgroundColor) {
					item.BackgroundColor = status.BackgroundColor;
				}
			}
		};
		return service;
	}

})(angular);
