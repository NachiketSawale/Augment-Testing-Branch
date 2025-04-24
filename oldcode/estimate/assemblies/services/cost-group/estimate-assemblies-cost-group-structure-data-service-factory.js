/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies';
	let  myModule = angular.module(moduleName);

	myModule.factory('estimateAssembliesCostGroupStructureDataServiceFactory', [ '$timeout','$http','$q','$injector', '$log','costGroupsStructureMainDataServiceFactory','estimateAssembliesCreationService','estimateAssembliesFilterService','estimateAssembliesService','estimateAssembliesCostGroupCatalogDataService',
		function ($timeout,$http, $q, $injector, $log,costGroupsStructureMainDataServiceFactory,estimateAssembliesCreationService,estimateAssembliesFilterService,estimateAssembliesService,estimateAssembliesCostGroupCatalogDataService) {

			let costGroupStructureDataService = costGroupsStructureMainDataServiceFactory.createCostGroupsStructureDataService(estimateAssembliesService,estimateAssembliesFilterService,estimateAssembliesCostGroupCatalogDataService);
			costGroupsStructureMainDataServiceFactory.extendByFilter(estimateAssembliesCreationService,costGroupStructureDataService, 'estimateAssembliesCostGroupStructureController',estimateAssembliesFilterService,estimateAssembliesCostGroupCatalogDataService);

			return costGroupStructureDataService;

		}]);
})();
