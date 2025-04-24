/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskOccuranceDataService', [
		'$q', 'basicsRiskCalculatorMainService',
		function ($q, basicsRiskCalculatorMainService) {
			return {
				getList: function () {
					let deferred = $q.defer();

					basicsRiskCalculatorMainService.loadProbabilityRisk().then(
						function () {
							deferred.resolve(basicsRiskCalculatorMainService.getProbabilityRisk());
						}
					);

					return deferred.promise;
				},

				getItemByKey: function (value) {
					basicsRiskCalculatorMainService.loadProbabilityRisk().then(
						function () {
							return basicsRiskCalculatorMainService.getProbabilityRiskById(value);
						}
					);
				}
			};
		}
	]);
})(angular);
