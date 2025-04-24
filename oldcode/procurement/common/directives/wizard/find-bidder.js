/**
 * Created by lja on 2015/10/8.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWizard', [function () {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl: function () {
				return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder.html';
			},
			scope: {
				findBidderSetting: '='
			},
			link: function (scope) {
				scope.loading = {
					isLoading: false,
					loadingInfo: ''
				};
			}
		};
	}]);
})(angular);