(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).controller('basicsRiskRegisterResultsController', [
		'$scope','basicsRiskCalculatorMainService',
		function ($scope,basicsRiskCalculatorMainService) {

			$scope.xValue = 0;
			$scope.pValue = 0;

			$scope.minMaxModel = {
				min:0,
				max:0,
				mean:0,
				stdDev:0
			};
			$scope.checkBoxModel = {
				min: false,
				max: false,
				mean: false,
				stdDev: false
			};

			$scope.calculateXValue = function () {
				var calcObj = basicsRiskCalculatorMainService.getCalcResults();
				basicsRiskCalculatorMainService.calculateXValue(calcObj,$scope.pValue).then(function (response) {
					if(response.data){
						$scope.xValue = response.data;
					}
				});

			};

			$scope.updateValues =function (items) {
				console.log('Update Values function ',items);
			};

			$scope.updateXValue = function (data) {
				console.log('Update X Value ',data);
			};
			function setStats(){
				basicsRiskCalculatorMainService.setStatistics($scope.minMaxModel);
			}
			function setFinalTotal(){
				basicsRiskCalculatorMainService.setResultToApply($scope.checkBoxModel,$scope.minMaxModel,$scope.xValue);
			}
			basicsRiskCalculatorMainService.statisticsSet.register(setStats);
			basicsRiskCalculatorMainService.finalCalculationSet.register(setFinalTotal);


			$scope.$on('$destroy', function () {
				basicsRiskCalculatorMainService.statisticsSet.unregister(setStats);
				basicsRiskCalculatorMainService.finalCalculationSet.unregister(setFinalTotal);
			});
		}
	]);
})(angular);
