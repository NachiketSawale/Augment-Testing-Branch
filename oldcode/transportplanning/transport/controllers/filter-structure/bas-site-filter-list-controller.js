/**
 * Created by anl on 7/11/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).controller('transportplanningTransportSiteFilterListController', SiteFilterListController);

	SiteFilterListController.$inject = ['$scope',
		'transportplanningTransportSiteFilterDataService',
		'transportplanningTransportMainService',
		'transportplanningTransportFilterClipBoardService',
		'ppsCommonSiteListControllerFactory'];

	function SiteFilterListController($scope,
									  siteFilterDataService,
									  mainService,
									  filterClipboardService,
									  controllerFactory) {
		var config = {
			filterId: 'transportplanningTransportMainService_SiteFilter',
			siteFilterDataService: siteFilterDataService,
			mainService: mainService,
			dragDropService: filterClipboardService
		};

		controllerFactory.initSiteFilter($scope, config);
	}
})(angular);