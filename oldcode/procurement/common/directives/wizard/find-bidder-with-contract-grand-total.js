/**
 * Created by pel on 2022/12/26.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWithContractGrandTotal',
		['$translate', function ($translate) {
			return {
				restrict: 'AE',
				scope: {
					contractGrandTotal: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-contract-grand-total.html';
				},
				link: function ($scope) {
					var tPrefix = 'procurement.common.findBidder.';

					$scope.contractGrandTotal.header = $translate.instant(tPrefix + 'individualContractAmount');
					$scope.contractGrandTotal.considerProcurementStructure = $translate.instant(tPrefix + 'considerProcurementStructure');
					var operators = [
						{id: 0, value: '=', description: '='},
						{id: 1, value: '>', description: '>'},
						{id: 2, value: '>=', description: '>='},
						{id: 3, value: '<', description: '<'},
						{id: 4, value: '<=', description: '<='}
					];
					$scope.contractGrandTotal.operators = operators;
					$scope.contractGrandTotal.selectedOp = operators[0];

				},
				controller:['$scope', function ($scope) {
				}],
			};
		}]);
})(angular);