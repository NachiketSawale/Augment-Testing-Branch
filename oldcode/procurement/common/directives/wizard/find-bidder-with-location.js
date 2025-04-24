/**
 * Created by lja on 2015/10/8.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).directive('findBidderWithLocation', ['$translate', '$http',
		function ($translate, $http) {
			return {
				restrict: 'AE',
				scope: {
					location: '=',
					isLoading: '='
				},
				controller:['$scope', function ($scope) {

					var tPrefix = 'procurement.common.findBidder.location';
					$scope.location.title = $translate.instant(tPrefix + '.title');
					$scope.location.distance.title = $translate.instant(tPrefix + '.distance.title');
					$scope.location.regional.title = $translate.instant(tPrefix + '.regional.title');

					if($scope.location.isDisabled){
						$scope.location.title = $translate.instant(tPrefix + '.noProjectAddress.title');
					}

					var getDistance = function () {
						$scope.isLoading = true;
						$http.get(globals.webApiBaseUrl + 'procurement/common/prcradius/getprcradius').then(function (response) {
							$scope.isLoading = false;
							$scope.location.distance.items =_.orderBy(response.data, ['IsDefault','Sorting'], ['desc','asc']);
							if (response.data.length > 0) {
								var defaultItem = $scope.location.distance.items[0];
								$scope.location.distance.selectedItem = defaultItem;
								$scope.location.distance.selectedItemFk = defaultItem.Id;
							}
						}, function () {
							$scope.isLoading = false;
						});
					};

					if (!$scope.location.distance.items) {
						getDistance();
					}

					$scope.location.codeLookupConfig = {
						rt$readonly: function () {
							return !$scope.location.regional.isActive || !$scope.location.isActive;
						}
					};

				}],
				templateUrl: function () {
					return globals.appBaseUrl + 'procurement.common/partials/wizard/find-bidder-with-location.html';
				},
				link: function (scope) {

					scope.activeLocation = function () {
						scope.activeDistance();
					};

					scope.activeDistance = function () {
						scope.location.distance.isActive = true;
						scope.location.regional.isActive = false;
					};

					scope.activeRegional = function () {
						scope.location.distance.isActive = false;
						scope.location.regional.isActive = true;
					};

					scope.changeDistance = function (selectedItem) {
						scope.location.distance.selectedItemFk = selectedItem.Id;
					};
				}
			};
		}]);
})(angular);