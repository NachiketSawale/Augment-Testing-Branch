/**
 * Created by jie on 2023/03/08.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWithContractedDateOrdered',
		['$translate','moment', function ($translate,moment) {
			return {
				restrict: 'AE',
				scope: {
					contractedDateOrdered: '='
				},
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-contracted-date-ordered.html';
				},
				link: function ($scope) {
					var tPrefix = 'procurement.common.';

					$scope.contractedDateOrdered.header = $translate.instant(tPrefix + 'contractedDateOrdered');

					$scope.modalOptionsError = {
						rt$hasError: hasError,
						rt$errorText: null
					};

					function hasError() {
						if ($scope.contractedDateOrdered.startDate && $scope.contractedDateOrdered.endDate) {
							if ($scope.contractedDateOrdered.startDate.isSame($scope.contractedDateOrdered.endDate, 'd')) {
									let durationTime = _.round(moment.duration(moment($scope.contractedDateOrdered.endDate).diff(moment($scope.contractedDateOrdered.startDate))).asMinutes(), 0);
									if (durationTime < 0) {
										$scope.modalOptionsError.rt$errorText = $translate.instant('cloud.common.Error_EndDateTooEarlier');
										return true;
									}
								return false;
							}
							else if ($scope.contractedDateOrdered.startDate > $scope.contractedDateOrdered.endDate) {
								$scope.modalOptionsError.rt$errorText = $translate.instant('cloud.common.Error_EndDateTooEarlier');
								return true;
							}
						}
						return false;
					}

				},
				controller:['$scope', function ($scope) {
				}],
			};
		}]);
})(angular);