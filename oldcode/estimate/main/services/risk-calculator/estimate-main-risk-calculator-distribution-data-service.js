/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskCalculatorDistributionDataService',[
		'$q', 'basicsRiskCalculatorMainService',
		function ($q, basicsRiskCalculatorMainService) {
			return {
				getList: function () {
					let deferred = $q.defer();

					basicsRiskCalculatorMainService.loadDistribution().then(
						function () {
							deferred.resolve(basicsRiskCalculatorMainService.getDistribution());
						}
					);

					return deferred.promise;
				},

				getItemByKey: function (value) {
					basicsRiskCalculatorMainService.loadDistribution().then(
						function () {
							return basicsRiskCalculatorMainService.getDistributionsById(value);
						}
					);
				}
			};
		}
	]);
})(angular);
