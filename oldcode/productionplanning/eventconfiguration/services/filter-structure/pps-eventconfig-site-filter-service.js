/**
 * Created by anl on 7/2/2019.
 */


(function () {
	'use strict';
	var moduleName = 'productionplanning.eventconfiguration';
	angular.module(moduleName).factory('productionplanningEventconfigurationSiteFilterDataService', SiteFilterDataService);

	SiteFilterDataService.$inject = ['ppsCommonSiteFilterDataFactory', 'basicsLookupdataLookupDescriptorService'];

	function SiteFilterDataService(siteFilterDataFactory, basicsLookupdataLookupDescriptorService) {

		//load siteType lookup data if not yet
		function loadSiteType() {
			var siteTypes = basicsLookupdataLookupDescriptorService.getData('SiteType');
			if(siteTypes === null || siteTypes === undefined){
				basicsLookupdataLookupDescriptorService.loadData('SiteType');
			}
		}
		loadSiteType();

		var service = siteFilterDataFactory.createSiteFilterStructureService(moduleName,
			'productionplanningEventconfigurationSiteFilterDataService');

		function filterFactorySite(site){
			var siteType = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', site.SiteTypeFk);
			return (siteType && siteType.IsFactory === true);
		}

		service.siteFilter = function siteFilter() {
			service.setItemFilter(filterFactorySite);
			service.enableItemFilter(true);
		};

		return service;
	}

})();