(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).directive('findBidderWithBusinesspartnerStatus',
		['$translate', function ($translate) {
			var tPrefix = 'procurement.common.findBidder.';
			return {
				restrict: 'AE',
				scope: {
					businesspartnerstatus: '=',
					businesspartnerstatus2: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-businesspartnerstatus.html';
				},
				controller: ['$scope', function ($scope) {
					$scope.businesspartnerstatus.codeLookupConfig = {
						rt$readonly: function () {
							return !$scope.businesspartnerstatus.isActive;
						}
					};
					$scope.businesspartnerstatus2.codeLookupConfig = {
						rt$readonly: function () {
							return !$scope.businesspartnerstatus2.isActive;
						}
					};
				}],
				link: function ($scope) {
					$scope.businesspartnerstatus.header = $translate.instant(tPrefix + 'businesspartnerstatus.title');
					$scope.businesspartnerstatus2.header = $translate.instant(tPrefix + 'businesspartnerstatus2.title');
				}
			};
		}]);


})(angular);