/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainCostRiskDataService',[
		'$q', 'estimateMainService',
		function ($q, estimateMainService) {
			return {
				getList: function () {
					let deferred = $q.defer();

					estimateMainService.loadCostRisks().then(
						function () {
							deferred.resolve(estimateMainService.getCostRisks());
						}
					);

					return deferred.promise;
				},

				getItemByKey: function (value) {
					return estimateMainService.loadCostRisks().then(
						function () {
							return estimateMainService.getCostRisksById(value);
						}
					);
				}
			};
		}
	]);
})(angular);
