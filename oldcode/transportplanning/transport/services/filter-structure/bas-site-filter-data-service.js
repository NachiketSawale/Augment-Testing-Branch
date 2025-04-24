/**
 * Created by anl on 7/11/2018.
 */


(function () {
	'use strict';

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportSiteFilterDataService', SiteFilterDataService);

	SiteFilterDataService.$inject = ['ppsCommonSiteFilterDataFactory'];

	function SiteFilterDataService(siteFilterDataFactory) {

		let initReadData = function (readData) {
			readData.FurtherFilters = readData.FurtherFilters || [];
			readData.FurtherFilters.push({
				Token: 'site.isdisp', // all Sites Where all places are activated
				Value: true
			});
		};

		return siteFilterDataFactory.createSiteFilterStructureService(moduleName,
			'transportplanningTransportSiteFilterDataService',initReadData);

	}

})();