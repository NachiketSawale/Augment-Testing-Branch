(function () {

	'use strict';
	let moduleName = 'qto.main';
	let  myModule = angular.module(moduleName);

	myModule.factory('qtoCostGroupStructureDataServiceFactory', [ '$timeout','$http', '$q',
		'$injector', '$log', 'costGroupsStructureMainDataServiceFactory','estimateMainCreationService','qtoDetailDataFilterService','qtoMainHeaderDataService','qtoCostGroupCatalogService',
		function ($timeout,$http, $q,$injector, $log,costGroupsStructureMainDataServiceFactory,estimateMainCreationService,qtoDetailDataFilterService,qtoMainHeaderDataService,costGroupCatalogService) {

			let costGroupStructureDataService = costGroupsStructureMainDataServiceFactory.createCostGroupsStructureDataService(qtoMainHeaderDataService,qtoDetailDataFilterService,costGroupCatalogService);
			costGroupsStructureMainDataServiceFactory.extendByFilter(estimateMainCreationService,costGroupStructureDataService, 'qtoCostGroupCatalogController',qtoDetailDataFilterService,costGroupCatalogService);

			return costGroupStructureDataService;

		}]);
})();