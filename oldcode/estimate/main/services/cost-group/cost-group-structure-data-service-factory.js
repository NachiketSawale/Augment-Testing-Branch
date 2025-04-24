
(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let  myModule = angular.module(moduleName);

	myModule.factory('costGroupStructureDataServiceFactory', [ '$timeout','$http', '$q',
		'$injector', '$log', 'costGroupsStructureMainDataServiceFactory','estimateMainCreationService','estimateMainFilterService','estimateMainService','costGroupCatalogService',
		function ($timeout,$http, $q,$injector, $log,costGroupsStructureMainDataServiceFactory,estimateMainCreationService,estimateMainFilterService,estimateMainService,costGroupCatalogService) {

			let costGroupStructureDataService = costGroupsStructureMainDataServiceFactory.createCostGroupsStructureDataService(estimateMainService,estimateMainFilterService,costGroupCatalogService);
			costGroupsStructureMainDataServiceFactory.extendByFilter(estimateMainCreationService,costGroupStructureDataService, 'costGroupStructureController',estimateMainFilterService,costGroupCatalogService);

			return costGroupStructureDataService;

		}]);
})();
