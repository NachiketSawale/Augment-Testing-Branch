/**
 * Created by lja on 2015/10/8.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWithName', ['$translate',
		function ($translate) {
			return {
				restrict: 'AE',
				scope: {
					bidder: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-name.html';
				},
				link: function ($scope) {

					$scope.bidder.title = $translate.instant('procurement.common.findBidder.bidderName.title');
				}
			};
		}]);
})(angular);