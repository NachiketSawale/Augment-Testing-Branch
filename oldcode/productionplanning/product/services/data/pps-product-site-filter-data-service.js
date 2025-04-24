(function () {
	'use strict';
	/*global angular*/

	let moduleName = 'productionplanning.product';
	angular.module(moduleName).factory('ppsProductSiteFilterDataService', [
		'ppsCommonSiteFilterDataFactory',
		function SiteFilterDataService(siteFilterDataFactory) {
			let initReadData = function (readData) {
				readData.FurtherFilters = readData.FurtherFilters || [];
				readData.FurtherFilters.push({
					Token: 'onlyProductionArea', //site type ID=8, "Production Area"
					Value: true
				});
			};
			let selectionFilter = function (site) {
				return site.SiteTypeFk === 8; //Production Area
			};

			return siteFilterDataFactory.createSiteFilterStructureService(moduleName,
				'ppsProductSiteFilterDataService', initReadData, selectionFilter);
		}]);

})();