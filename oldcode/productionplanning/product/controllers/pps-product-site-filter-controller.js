(function (){
	'use strict';
	/*global angular*/

	let moduleName = 'productionplanning.product';
	angular.module(moduleName).controller('ppsProductSiteFilterController', [
		'$scope',
		'ppsProductSiteFilterDataService',
		'productionplanningProductMainService',
		'ppsCommonSiteListControllerFactory',
		function ($scope,
			siteFilterDataService,
			mainService,
			controllerFactory) {
			var config = {
				filterId: 'productionplanningProductMainService_SiteFilter',
				siteFilterDataService: siteFilterDataService,
				mainService: mainService,
				dragDropService: null
			};

			controllerFactory.initSiteFilter($scope, config, false);
	}]);
})();