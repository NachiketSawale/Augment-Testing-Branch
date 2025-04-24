(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).controller('ppsFabricationunitSiteFilterController', [
		'$scope', 'ppsFabricationunitDataService',
		'ppsFabricationunitSiteFilterDataService', 'ppsCommonSiteListControllerFactory',
		function ($scope, mainService,
		          siteFilterDataService, controllerFactory) {
			var config = {
				filterId: mainService.getServiceName() + '_SiteFilter', //must start with data service name + _
				siteFilterDataService: siteFilterDataService,
				mainService: mainService,
				dragDropService: null
			};

			controllerFactory.initSiteFilter($scope, config);
		}
	]);
})();