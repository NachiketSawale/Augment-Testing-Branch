(function () {

	'use strict';
	let moduleName = 'qto.main';
	let  myModule = angular.module(moduleName);

	myModule.factory('qtoCostGroupCatalogService', ['$injector','costGroupCatalogServiceFactory','qtoMainHeaderDataService',
		function ($injector, costGroupCatalogServiceFactory,qtoMainHeaderDataService) {

			let service= costGroupCatalogServiceFactory.createCostGroupCatalogService(qtoMainHeaderDataService, 'Project', 'QuantityTakeOff');

			service.clearFilterData = function (){
				qtoMainHeaderDataService.setSelectProjectId(-1);
			};

			service.clearCostGroupStructureList = function (){
				service.setSelected(undefined);
				let qtoCostGroupStructureDataService = $injector.get('qtoCostGroupStructureDataServiceFactory');
				qtoCostGroupStructureDataService.clearFilters();
			};

			return service;

		}]);
})();
