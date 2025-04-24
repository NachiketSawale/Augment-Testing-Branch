(function (){
	'use strict';
	/* global _ */

	let moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).controller('ppsProductionplaceSiteFilterController', [
		'$scope',
		'ppsProductionplaceSiteFilterDataService',
		'ppsProductionPlaceDataService',
		'ppsCommonSiteListControllerFactory',
		function ($scope,
			siteFilterDataService,
			mainService,
			controllerFactory) {
			var config = {
				filterId: 'ppsProductionPlaceDataService_SiteFilter',
				siteFilterDataService: siteFilterDataService,
				mainService: mainService,
				dragDropService: null
			};

			controllerFactory.initSiteFilter($scope, config, false);

			if(_.isArray(siteFilterDataService.delayMarkedItems) && _.size(siteFilterDataService.delayMarkedItems) > 0){
				siteFilterDataService.markedItems = [];
				siteFilterDataService.markersChanged(siteFilterDataService.delayMarkedItems, true);
				siteFilterDataService.delayMarkedItems = [];
				var root = siteFilterDataService.getTree();
				if (root && _.isArray(root) && root.length > 0) {
					var markedItems = siteFilterDataService.markedItems;
					if (markedItems && _.isArray(markedItems) && markedItems.length > 0) {
						var markedItemIds = _.map(markedItems, 'Id');
						siteFilterDataService.setSelected(markedItems[0]);
						siteFilterDataService.setItemMarkers(root, markedItemIds);
						siteFilterDataService.gridRefresh();
					}
				}
			}

		}]);
})();