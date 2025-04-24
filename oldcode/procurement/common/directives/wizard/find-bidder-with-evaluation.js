/**
 * Created by lja on 2015/10/8.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWithEvaluation',
		['$translate', function ($translate) {
			return {
				restrict: 'AE',
				scope: {
					evaluation: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-evaluation.html';
				},
				link: function ($scope) {
					var tPrefix = 'procurement.common.findBidder.';

					$scope.evaluation.header = $translate.instant(tPrefix + 'evaluation.title');
					$scope.evaluation.description = $translate.instant(tPrefix + 'evaluation.description');
					$scope.evaluation.selectItem = null;

				},
				controller:['$scope', function ($scope) {
					$scope.evaluation.codeLookupConfig = {
						rt$readonly: function () {
							return !$scope.evaluation.isActive;
						}
					};

				}],
			};
		}]);
})(angular);