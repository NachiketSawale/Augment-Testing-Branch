/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainCalculatorService
	 * @function
	 *
	 * @description
	 * estimateMainCalculatorService is the data service for line item and resources calculations.
	 */
	estimateMainModule.factory('estimateMainCalculatorService', [
		'$http',
		'estimateMainOutputDataService',
		'PlatformMessenger',
		'estimateMainService',
		function ($http,
			estimateMainOutputDataService,
			PlatformMessenger,
			estimateMainService) {

			let service = {
				calculate: completeCalculation,
				onCalculationDone : new PlatformMessenger(),
				calculateassembly: completeAssemblyCalculation
			};

			function completeCalculation(headerId, projectId) {
				if(headerId <= 0){
					return;
				}
				let postData = {
					'ProjectId': projectId,
					'EstHeaderFk': headerId

				};
				estimateMainService.update().then(function () {
					// estimateMainService.load();
					$http.post(globals.webApiBaseUrl + 'estimate/main/calculator/completecalculation', postData).then(function (response) {
						estimateMainService.activeLoadByNavigation();
						estimateMainService.load();
						// estimateMainService.gridRefresh();
						estimateMainOutputDataService.setDataList(response.data);
						estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();
						// notify the grand total container to recalculate if necessary
						service.onCalculationDone.fire();
					});
				});
			}

			function completeAssemblyCalculation(filterRequest) {
				$http.post(globals.webApiBaseUrl + 'estimate/main/calculator/completecalculateassembly', filterRequest).then(function (response) {
					estimateMainService.activeLoadByNavigation();
					estimateMainService.load();
					estimateMainOutputDataService.setDataList(response.data);
					estimateMainOutputDataService.estMainRuleOutputResultChanged.fire();
				});
			}

			return service;
		}]);
})(angular);
