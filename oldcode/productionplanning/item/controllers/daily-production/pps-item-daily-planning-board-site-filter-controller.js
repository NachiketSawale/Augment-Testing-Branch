(function (){
	'use strict';
	/* global _ */

	let moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemDailyPlanningBoardSupplierSiteFilterController', [
		'$scope',
		'ppsItemDailyPlanningBoardSupplierSiteFilterDataService',
		'ppsItemDailyPlanningBoardSupplierService',
		'ppsCommonSiteListControllerFactory',
		'transportplanningTransportUtilService',
		function ($scope,
			siteFilterDataService,
			mainService,
			controllerFactory,
			transportplanningTransportUtilService) {
			var config = {
				filterId: 'ppsItemDailyPlanningBoardSupplierService_SiteFilter',
				siteFilterDataService: siteFilterDataService,
				mainService: mainService,
				dragDropService: null
			};

			controllerFactory.initSiteFilter($scope, config, false);

			if(transportplanningTransportUtilService.hasShowContainerInFront('productionplanning.item.dailyplanningboard') && siteFilterDataService.markedItems.length > 0){
				mainService.load();
			}

			$scope.$on('$destroy', function onDestroy() {
				if(transportplanningTransportUtilService.hasShowContainerInFront('productionplanning.item.dailyplanningboard')){
					mainService.load();
				}
			});
	}]);
})();