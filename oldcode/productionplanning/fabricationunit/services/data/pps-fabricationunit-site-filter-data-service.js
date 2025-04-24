(function () {
	'use strict';

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).factory('ppsFabricationunitSiteFilterDataService', SiteFilterDataService);

	SiteFilterDataService.$inject = ['ppsCommonSiteFilterDataFactory'];

	function SiteFilterDataService(siteFilterDataFactory) {

		return siteFilterDataFactory.createSiteFilterStructureService(moduleName,
			'ppsFabricationunitSiteFilterDataService');

	}

})();