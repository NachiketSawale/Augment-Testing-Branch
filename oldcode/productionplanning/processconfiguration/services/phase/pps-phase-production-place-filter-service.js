(function (){
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('ppsPhaseProductionPlaceFilterService', [
		'$http', 'basicsLookupdataLookupFilterService',
		'$q',
		function ($http, basicsLookupdataLookupFilterService,
			$q){
			let service = {};
			let currentSiteId;
			let siteChildrenIds = [];
			let loading = false;
			const phaseProductionPlaceFilterKey = 'phase-production-place-filter';
			service.productionPlaceFilterKey = phaseProductionPlaceFilterKey;
			service.registerLeadingSite = function (siteId) {
				if(typeof siteId === 'number') {
					if(currentSiteId !== siteId) {
						currentSiteId = siteId;
						siteChildrenIds.length = 0;
						loading = true;
						$http.get(globals.webApiBaseUrl + 'basics/sitenew/getchildrenids?siteid=' + siteId).then(function (response) {
							siteChildrenIds = response.data;
							loading = false;
						});
					}
				} else {
					throw new Error('siteIds is not valid when calling ppsPhaseSiteFilterService.registerLegalSites');
				}
			};

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: phaseProductionPlaceFilterKey,
					fn: function (prodPlace, data){
						return !loading ? siteChildrenIds.indexOf(prodPlace.BasSiteFk) > -1 : true;
					}
				}
			]);

			let item2SiteCache = {};
			service.onProductSelectionChanged = function onProductSelectionChanged(event, product) {
				if (!product) {
					return;
				}
				let siteId = item2SiteCache[product.ItemFk];
				let promise = $q.when(0);
				if(!siteId) {
					promise = $http.post(globals.webApiBaseUrl + 'productionplanning/item/list', {Id: product.ItemFk}).then(function (response) {
						item2SiteCache[product.ItemFk] = response.data[0].SiteFk;
					});
				}
				promise.then(function () {
					service.registerLeadingSite(item2SiteCache[product.ItemFk]);
				});
			};

			service.onFormworkSelectionChanged = function onFormworkSelectionChanged(event, formwork) {
				if (!formwork) {
					return;
				}
				service.registerLeadingSite(formwork.BasSiteFk);
			};

			return service;
		}
	]);
})();