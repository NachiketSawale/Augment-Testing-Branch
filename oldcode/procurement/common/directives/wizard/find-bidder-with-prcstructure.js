/**
 * Created by chi on 2/16/2017.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWithPrcstructure',
		['$translate', function ($translate) {
			var tPrefix = 'procurement.common.findBidder.';
			return {
				restrict: 'AE',
				scope: {
					prcstructure: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-prcstructure.html';
				},
				controller: ['$scope', controller],
				link: function ($scope) {
					$scope.prcstructure.header = $translate.instant(tPrefix + 'prcstructure.title');
				}
			};

			// ////////////////////
			function controller (scope) {
				scope.prcstructure.rt$readonly = readonly;
				scope.prcstructure.rt$hasError = hasError;
				scope.prcstructure.rt$errorText = errorText;

				scope.options = {
					lookupOptions: {
						showClearButton: true
					},
					lookupDirective: 'basics-procurementstructure-structure-dialog',
					descriptionMember: 'DescriptionInfo.Translated'
				};

				// ///////////////////////
				function readonly() {
					return !scope.prcstructure.isActive;
				}
				function hasError() {
					if (scope.prcstructure.isActive) {
						return !scope.prcstructure.selectedItemFk;
					}
					return false;
				}
				function errorText() {
					return $translate.instant(tPrefix + 'prcstructure.errorEmpty');
				}
			}
		}]);
})(angular);