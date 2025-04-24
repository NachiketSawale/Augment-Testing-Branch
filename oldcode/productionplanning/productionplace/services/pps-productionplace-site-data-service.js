(function () {
	'use strict';
	/* global angular */

	let moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('ppsProductionplaceSiteFilterDataService', [
		'ppsCommonSiteFilterDataFactory',
		function SiteFilterDataService(siteFilterDataFactory) {
			let initReadData = function (readData) {
				readData.FurtherFilters = readData.FurtherFilters || [];
				readData.FurtherFilters.push({
					Token: 'allSitesWherePlacesActive', // all Sites Where all places are activated
					Value: true
				});
			};
			let selectionFilter = function (site) {
				return true; // Production Area
			};



			var service =  siteFilterDataFactory.createSiteFilterStructureService(moduleName,
				'ppsProductionplaceSiteFilterDataService', initReadData, selectionFilter);

			service.delayMarkedItems = [];
			service.addDelayMarkedItems = function (site){
				service.delayMarkedItems.push(site);
			};
			return service;
		}]);

})();