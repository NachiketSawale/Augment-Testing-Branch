(function (angular) {
	'use strict';

	angular.module('basics.common').controller('chartColorConfigDialogController', [
		'_',
		'globals',
		'$scope',
		'$timeout',
		'$translate',
		'platformGridControllerService',
		'platformGridAPI',
		'platformModalService',
		'platformGridConfigService',
		'bascisCommonChartColorProfileService',
		function (
			_,
			globals,
			$scope,
			$timeout,
			$translate,
			platformGridControllerService,
			platformGridAPI,
			platformModalService,
			platformGridConfigService,
			colorProfileService) {

			$scope.modalOptions.headerText = $translate.instant('basics.common.chartColorConfig');

			$scope.maxValue = '';
			$scope.minValue = '';
			$scope.avgValue = '';
			$scope.viewDatakey = 'chartColor';
			$scope.modalOptions.onOK = function () {
				if ($scope.maxValue === null && $scope.minValue === null && $scope.avgValue === null) {
					colorProfileService.setCustomViewData($scope.modalOptions.uuid, $scope.viewDatakey, {});
				} else {
					var ViewDataValue = {};
					if ($scope.maxValue) {
						ViewDataValue.Max = parseDecToRgb($scope.maxValue);
					}
					if ($scope.minValue) {
						ViewDataValue.Min = parseDecToRgb($scope.minValue);
					}
					if ($scope.avgValue) {
						ViewDataValue.Avg = parseDecToRgb($scope.avgValue);
					}
					colorProfileService.setCustomViewData($scope.modalOptions.uuid, $scope.viewDatakey, ViewDataValue);
				}
				$scope.$close({isOK: true, data: {}});
			};

			$scope.modalOptions.onReset = function () {
				// colorProfileService.setViewConfig(uid, null);
				// colorProfileService.setCustomViewData($scope.modalOptions.uuid, $scope.viewDatakey, '');
				$scope.maxValue = null;
				$scope.minValue = null;
				$scope.avgValue = null;
				// $scope.$close({isOK: true, data: {}});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({isOK: false});
			};
			loadColorConfig();

			function loadColorConfig() {
				let viewData = colorProfileService.getCustomDataFromView($scope.modalOptions.uuid, $scope.viewDatakey);
				if (viewData) {
					viewData.Max ? $scope.maxValue = rgbToHex(viewData.Max) : '#000000';
					viewData.Min ? $scope.minValue = rgbToHex(viewData.Min) : '#000000';
					viewData.Avg ? $scope.avgValue = rgbToHex(viewData.Avg) : '#000000';
				}
			}

			function parseDecToRgb(dec) {
				if (_.isString(dec) && dec.charAt('0') === '#') {
					dec = dec.substr(1);
				}
				var hex = dec.toString(16);
				var r = parseInt(hex.slice(0, 2), 16);
				var g = parseInt(hex.slice(2, 4), 16);
				var b = parseInt(hex.slice(4, 6), 16);
				return r + ',' + g + ',' + b;
			}

			function rgbToHex(rgb) {
				if (rgb.charAt(0) === '#') {
					return rgb;
				}
				let ds = rgb.split(/\D+/);
				let decimal = Number(ds[0]) * 65536 + Number(ds[1]) * 256 + Number(ds[2]);
				return '#' + zeroFillHex(decimal, 6);
			}

			function zeroFillHex(num, digists) {
				let s = num.toString(16);
				while (s.length < digists) {
					s = '0' + s;
				}
				return s;
			}
		}]);
})(angular);