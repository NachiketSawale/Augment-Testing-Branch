/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies';
	let  myModule = angular.module(moduleName);

	myModule.factory('estimateAssembliesCostGroupCatalogDataService', [ '$timeout','$http','$q',
		'$injector', '$log', 'costGroupCatalogServiceFactory','estimateAssembliesService',
		function ($timeout,$http, $q,$injector, $log,costGroupCatalogServiceFactory,estimateAssembliesService) {

			let costGroupCatalogService = costGroupCatalogServiceFactory.createCostGroupCatalogService(estimateAssembliesService,'Assembly','Estimate');

			return costGroupCatalogService;

		}]);
})();
