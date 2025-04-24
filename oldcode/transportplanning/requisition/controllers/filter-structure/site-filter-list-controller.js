/**
 * Created by anl on 7/12/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).controller('transportplanningRequisitionSiteFilterListController', SiteFilterListController);

	SiteFilterListController.$inject = ['$scope',
		'transportplanningRequisitionSiteFilterDataService',
		'transportplanningRequisitionMainService',
		'transportplanningRequisitionFilterClipBoardService',
		'ppsCommonSiteListControllerFactory'];

	function SiteFilterListController($scope,
									  siteFilterDataService,
									  mainService,
									  filterClipboardService,
									  controllerFactory) {
		var config = {
			filterId: 'transportplanningRequisitionMainService_SiteFilter',
			siteFilterDataService: siteFilterDataService,
			mainService: mainService,
			dragDropService: filterClipboardService
		};

		controllerFactory.initSiteFilter($scope, config);
	}
})(angular);