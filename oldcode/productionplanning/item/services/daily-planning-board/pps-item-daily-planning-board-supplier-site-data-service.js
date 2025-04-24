(function () {
	'use strict';
	/* global angular */

	let moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemDailyPlanningBoardSupplierSiteFilterDataService', [
		'ppsCommonSiteFilterDataFactory',
		function SiteFilterDataService(siteFilterDataFactory) {
			let initReadData = function (readData) {
				readData.FurtherFilters = readData.FurtherFilters || [];
				readData.FurtherFilters.push({
					Token: 'onlyProductionArea', // site type ID=8, "Production Area"
					Value: true
				});
			};
			let selectionFilter = function (site) {
				return site.SiteTypeFk === 8; // Production Area
			};



			var service =  siteFilterDataFactory.createSiteFilterStructureService(moduleName,
				'ppsItemDailyPlanningBoardSupplierSiteFilterDataService', initReadData, selectionFilter);
			return service;
		}]);

})();