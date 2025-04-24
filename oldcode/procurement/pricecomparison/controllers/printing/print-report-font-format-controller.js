/**
 * Created by ada on 2018/9/28.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonPrintFontFormatController
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 */
	angular.module(moduleName).controller('procurementPriceComparisonPrintFontFormatController', [
		'$scope',
		'$translate',
		function ($scope,
			$translate) {
			// $scope.value = $scope.modalOptions.value;
			$scope.onOK = function () {
				$scope.$close({isOK: true, value: $scope.modalOptions.value});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({isOK: false});
			};

			$scope.onPropertyChanged = function (/* currentItem */) {

			};

			$scope.modalOptions.headerText = $translate.instant('procurement.pricecomparison.compareConditionFormattingConfig');

			/* $scope.model = {
				selectedText: $scope.value
			} */
		}]);
})(angular);
