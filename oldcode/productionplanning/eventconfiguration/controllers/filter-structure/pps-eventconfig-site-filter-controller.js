/**
 * Created by anl on 7/2/2019.
 */

(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';
	angular.module(moduleName).controller('productionplanningngEventconfigurationSiteFilterListController', SiteFilterListController);

	SiteFilterListController.$inject = ['$scope',
		'productionplanningEventconfigurationSiteFilterDataService',
		'productionplanningEventconfigurationSequenceDataService',
		'ppsCommonSiteListControllerFactory'];

	function SiteFilterListController($scope,
									  siteFilterDataService,
									  mainService,
									  controllerFactory) {
		var config = {
			filterId: 'productionplanningEventconfigurationSequenceDataService_SiteFilter',
			siteFilterDataService: siteFilterDataService,
			mainService: mainService,
			dragDropService: null
		};

		controllerFactory.initSiteFilter($scope, config);
		siteFilterDataService.siteFilter();
	}
})(angular);