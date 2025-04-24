/**
 * Created by myh on 2023.02.01
 */

(function (angular) {

	'use strict';
	var moduleName = 'qto.main';


	/**
     * @ngdoc service
     * @name qtoDetailFormulaResultDetailsController
     * @function
     *
     * @description
     * Controller for a modal dialogue displaying the formula result in a form container for qto detail.
     **/
	angular.module(moduleName).controller('qtoDetailFormulaResultDetailsController', [
		'$scope',
		function ($scope) {

			$scope.formulaResult = $scope.$parent.modalOptions.formulaResult || null;

			$scope.showFormulaResult = $scope.formulaResult && $scope.formulaResult !== '';

			$scope.modalTitle = $scope.modalOptions.headerText;

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.formulaResult});
			};

		}
	]);
})(angular);
