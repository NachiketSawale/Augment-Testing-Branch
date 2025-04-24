/**
 * Created by wed on 9/14/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonPrintPageLayoutController', [
		'$scope',
		'$translate',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintCommonService',
		function ($scope,
			$translate,
			printConstants,
			printSettingService,
			printCommonService) {

			$scope.settings = {
				paperSize: {
					paperSizeText: $translate.instant('procurement.pricecomparison.printing.paperSize'),
					selectedValue: printConstants.paperSize.A4,
					options: {
						items: [
							{
								name: $translate.instant('procurement.pricecomparison.printing.formatA4'),
								value: printConstants.paperSize.A4
							},
							{
								name: $translate.instant('procurement.pricecomparison.printing.formatA3'),
								value: printConstants.paperSize.A3
							},
							{
								name: $translate.instant('procurement.pricecomparison.printing.formatLetter'),
								value: printConstants.paperSize.Letter
							}
						],
						valueMember: 'value',
						displayMember: 'name',
						selected: printConstants.paperSize.A4
					},
					onChange: function () {
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.genericClickChange
						});
					}
				},
				orientation: {
					selectedValue: printConstants.orientation.portrait,
					options: {
						displayMember: 'description',
						valueMember: 'value',
						items: [
							{
								value: printConstants.orientation.portrait,
								description: $translate.instant('procurement.pricecomparison.printing.pagePortrait')
							},
							{
								value: printConstants.orientation.landscape,
								description: $translate.instant('procurement.pricecomparison.printing.pageLandscape')
							}
						]
					},
					onSelectChanged: function (value) {
						$scope.settings.orientation.selectedValue = value;
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.genericClickChange
						});
					}
				}
			};

			function loadSetting(eventInfo) {
				var isApplyNewProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.generic;
				if (!eventInfo || isApplyNewProfile) {
					printSettingService.getCurrentGenericSetting().then(function (profile) {
						$scope.settings = printCommonService.merge2($scope.settings, {
							paperSize: {
								selectedValue: profile.pageLayout.paperSize
							},
							orientation: {
								selectedValue: profile.pageLayout.orientation
							}
						});
					});
				}
			}

			function onPaperSizeChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.paperSizeChange,
					value: $scope.settings.paperSize.selectedValue
				});
			}

			function onOrientationChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.orientationChange,
					value: $scope.settings.orientation.selectedValue
				});
			}

			function onCollectSetting() {
				printSettingService.setCurrentGenericSetting({
					pageLayout: {
						paperSize: $scope.settings.paperSize.selectedValue,
						orientation: $scope.settings.orientation.selectedValue
					}
				});
			}

			printSettingService.onCurrentSettingChanged.register(loadSetting);
			printSettingService.onCollectSetting.register(onCollectSetting);

			var unWatchFn = $scope.$watchGroup(['settings.paperSize.selectedValue', 'settings.orientation.selectedValue'], function (newValue, oldValue) {
				if (newValue !== oldValue) {
					printSettingService.setCurrentGenericSetting({
						pageLayout: {
							paperSize: $scope.settings.paperSize.selectedValue,
							orientation: $scope.settings.orientation.selectedValue
						}
					});
					if (newValue[0] !== oldValue[0]) {
						onPaperSizeChange();
						oldValue[0] = newValue[0];
					}
					if (newValue[1] !== oldValue[1]) {
						onOrientationChange();
						oldValue[1] = newValue[1];
					}
				}
			});

			loadSetting();

			$scope.$on('$destroy', function () {
				unWatchFn();
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
				printSettingService.onCollectSetting.unregister(onCollectSetting);
			});
		}
	]);
})(angular);