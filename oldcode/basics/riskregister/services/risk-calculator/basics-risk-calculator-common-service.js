(function (angular) {
	/*global angular, globals*/
	'use strict';

	var moduleName = 'basics.riskregister';

	angular.module(moduleName).service('basicsRiskCalculatorCommonService',[
		'$http','basicsRiskCalculatorMainService','$timeout',
		function ($http,basRiskCalcMainService,$timeout) {
			var service = {};

			var impactValues = {
				distributionType:null,
				probabilityRisk:null,
				inverseOccurence:null,
				noRiskValue:null,
				dependantOn:null,
				inverseDependancy:null,
			};

			service.tempLoadGaussModel = function () {
				$http.get(globals.webApiBaseUrl + 'estimate/main/riskcalculator/gauss').then(function (response) {
					basRiskCalcMainService.setPoints(response.data);
				});
			};

			service.setupRiskCalculator = function () {
				basRiskCalcMainService.loadDistribution();
				basRiskCalcMainService.loadProbabilityRisk();
			};

			service.simulateCalculation = function () {
				return $timeout(function(){
					console.log('TimeoutCalled');
				},30000);
			};


			return service;
		}
	]);
})(angular);
