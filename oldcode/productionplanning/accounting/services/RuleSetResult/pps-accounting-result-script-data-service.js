(function (angular) {
	'use strict';
	/* global globals */

	const moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('ppsAccountingResultScriptDataService', ppsAccountingResultScriptDataService);

	ppsAccountingResultScriptDataService.$inject = ['ppsFormulaScriptDataServiceFactory',
		'productionplanningAccountingResultDataService'];

	function ppsAccountingResultScriptDataService(ppsFormulaScriptDataServiceFactory,
		ppsAccountingResultDataService) {

		const service = ppsFormulaScriptDataServiceFactory.getService(ppsAccountingResultDataService,
			'BasClobFormulaFk',
			'ClobToSave.Content',
			{
				Component : function getEngDrwComponentScriptContextParameters($q, $http) {
					const deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'productionplanning/drawing/component/getengdrwcompcontextparameters')
						.then((response) => {
							deferred.resolve(response.data);
						});
					return deferred.promise;
				},
				PlannedQuantity: function getPlannedQuantityScriptContextParameters($q, $http) {
					const deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'productionplanning/drawing/component/getplannedquantitycontextparameters')
						.then((response) => {
							deferred.resolve(response.data);
						});
					return deferred.promise;
				},
				UpstreamItem: function getUpstreamItemScriptContextParameters($q, $http) {
					const deferred = $q.defer();
					$http.get(globals.webApiBaseUrl + 'productionplanning/drawing/component/getupstreamitemcontextparameters')
						.then((response) => {
							deferred.resolve(response.data);
						});
					return deferred.promise;
				},
			});

		service.markScriptAsModified = (newScript) =>  {
			const selectedItem = ppsAccountingResultDataService.getSelected();
			if (selectedItem && selectedItem.ClobToSave.Content !== newScript) {
				selectedItem.ClobToSave.Content = newScript;
				ppsAccountingResultDataService.markItemAsModified(selectedItem);
				ppsAccountingResultDataService.gridRefresh();
			}
		};

		return service;
	}
})(angular);