
(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let  myModule = angular.module(moduleName);

	myModule.factory('costGroupCatalogService', [ '$timeout','$http', '$q',
		'$injector', '$log', 'costGroupCatalogServiceFactory','estimateMainService',
		function ($timeout,$http, $q,$injector, $log,costGroupCatalogServiceFactory,estimateMainService) {

			let costGroupCatalogService = costGroupCatalogServiceFactory.createCostGroupCatalogService(estimateMainService,'Project','Estimate');

			return costGroupCatalogService;

		}]);
})();
