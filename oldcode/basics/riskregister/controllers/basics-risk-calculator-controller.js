/**
 * Created by waldrop on 11/25/2019
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.riskregister';

	/**
	 * @ngdoc controller
	 * @name basicsRiskRiskListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics risk risk entities.
	 **/

	angular.module(moduleName).controller('basicsRiskCalculatorController', BasicsRiskCalculatorController);

	BasicsRiskCalculatorController.$inject = ['$scope', 'platformContainerControllerService','basicsRiskCalculatorMainService'];

	function BasicsRiskCalculatorController($scope, platformContainerControllerService,basicsRiskCalculatorMainService) {
		$scope.points = basicsRiskCalculatorMainService.getPoints();
		$scope.modalOptions =  {};
		$scope.modalOptions.ok = function onOK() {
			$scope.$close({ok: true});
		};

		$scope.modalOptions.close = function onCancel() {
			$scope.$close({ok: false});
		};
		//platformContainerControllerService.initController($scope, moduleName, '483b4864a1b5456ba08bba411aa57285');
	}
})(angular);
