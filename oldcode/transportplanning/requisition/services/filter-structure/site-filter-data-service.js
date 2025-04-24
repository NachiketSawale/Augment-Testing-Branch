/**
 * Created by anl on 7/12/2018.
 */


(function () {
	'use strict';
	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).factory('transportplanningRequisitionSiteFilterDataService', SiteFilterDataService);

	SiteFilterDataService.$inject = ['ppsCommonSiteFilterDataFactory'];

	function SiteFilterDataService(siteFilterDataFactory) {
		return siteFilterDataFactory.createSiteFilterStructureService(moduleName,
		'transportplanningRequisitionSiteFilterDataService');
	}

})();