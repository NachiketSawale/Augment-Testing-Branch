/**
 * Created by ada on 2018/9/27.
 */
(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonReportSettingController', [
		'$scope',
		'$translate',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintCommonService',
		'reportSettingTranslationService',
		function ($scope,
			$translate,
			printConstants,
			printSettingService,
			printCommonService,
			translationService) {

			// set default value
			$scope.settings = {
				coverSheet: {
					check: false
				},
				bidder: {
					nameCheck: false,
					bidderPageSizeCheck: false,
					pageSize: 5
				},
				shortenOutlineSpec: {
					check: false,
					value: 100
				},
				header: {
					report: {
						leftTemplate: '',
						middleTemplate: '',
						rightTemplate: ''
					}
				},
				footer: {
					report: {
						leftTemplate: '',
						middleTemplate: '',
						rightTemplate: ''
					}
				},
				onClickChange: function (type) {
					if (type === 'pageSize') {
						onMaxBidderPageSizeChange();
					}
					printSettingService.onCurrentSettingChanged.fire({
						eventName: printConstants.eventNames.genericClickChange
					});
				}
			};

			function loadSetting(eventInfo) {
				var isApplyNewProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.generic;
				if (!eventInfo || isApplyNewProfile) {
					printSettingService.getCurrentGenericSetting().then(function (profile) {
						$scope.settings = printCommonService.merge2($scope.settings, {
							coverSheet: {
								check: profile.report.coverSheetCheck,
								selectedValue: profile.report.coverSheetTemplateId
							},
							bidder: {
								nameCheck: profile.report.bidderNameCheck,
								bidderPageSizeCheck: profile.report.bidderPageSizeCheck,
								pageSize: profile.report.bidderPageSize
							},
							shortenOutlineSpec: {
								check: profile.report.shortenOutlineSpecCheck,
								value: profile.report.shortenOutlineSpecValue
							},
							header: {
								report: {
									leftTemplate: translationService.transform(profile.report.header.leftTemplate, false),
									middleTemplate: translationService.transform(profile.report.header.middleTemplate, false),
									rightTemplate: translationService.transform(profile.report.header.rightTemplate, false),
									leftPicture: profile.report.header.leftPicture,
									middlePicture: profile.report.header.middlePicture,
									rightPicture: profile.report.header.rightPicture
								}
							},
							footer: {
								report: {
									leftTemplate: translationService.transform(profile.report.footer.leftTemplate, false),
									middleTemplate: translationService.transform(profile.report.footer.middleTemplate, false),
									rightTemplate: translationService.transform(profile.report.footer.rightTemplate, false),
									leftPicture: profile.report.footer.leftPicture,
									middlePicture: profile.report.footer.middlePicture,
									rightPicture: profile.report.footer.rightPicture
								}
							}
						});
					});
				}

			}

			function onMaxBidderPageSizeChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.maxBidderPageSizeChange,
					value: {
						bidderPerSize: $scope.settings.bidder.pageSize,
						bidderPerSizeCheck: $scope.settings.bidder.bidderPageSizeCheck
					}
				});
			}

			function onCollectSetting() {
				printSettingService.setCurrentGenericSetting({
					report: {
						coverSheetCheck: $scope.settings.coverSheet.check,
						// coverSheetTemplateId: $scope.settings.coverSheet.selectedValue,
						coverSheetTemplateId: $scope.settings.coverSheet.check ? -1 : null,

						bidderNameCheck: $scope.settings.bidder.nameCheck,
						bidderNameTemplate: $scope.settings.bidder.nameCheck ? printConstants.bidderNameTemplate : null,
						bidderPageSizeCheck: $scope.settings.bidder.bidderPageSizeCheck,
						bidderPageSize: $scope.settings.bidder.pageSize,
						shortenOutlineSpecCheck: $scope.settings.shortenOutlineSpec.check,
						shortenOutlineSpecValue: $scope.settings.shortenOutlineSpec.value,

						header: {
							leftTemplate: translationService.transform($scope.settings.header.report.leftTemplate, true),
							middleTemplate: translationService.transform($scope.settings.header.report.middleTemplate, true),
							rightTemplate: translationService.transform($scope.settings.header.report.rightTemplate, true),
							leftPicture: $scope.settings.header.report.leftPicture,
							middlePicture: $scope.settings.header.report.middlePicture,
							rightPicture: $scope.settings.header.report.rightPicture
						},

						footer: {
							leftTemplate: translationService.transform($scope.settings.footer.report.leftTemplate, true),
							middleTemplate: translationService.transform($scope.settings.footer.report.middleTemplate, true),
							rightTemplate: translationService.transform($scope.settings.footer.report.rightTemplate, true),
							leftPicture: $scope.settings.footer.report.leftPicture,
							middlePicture: $scope.settings.footer.report.middlePicture,
							rightPicture: $scope.settings.footer.report.rightPicture
						}
					}
				});
			}

			printSettingService.onCurrentSettingChanged.register(loadSetting);
			printSettingService.onCollectSetting.register(onCollectSetting);

			var unWatchFn = $scope.$watchGroup(['settings.bidder.pageSize'], function (newValue, oldValue) {
				if (newValue !== oldValue) {
					if (!newValue[0]) {
						$scope.settings.bidder.pageSize = 1;
					}
					printSettingService.setCurrentGenericSetting({
						report: {
							bidderPageSize: $scope.settings.bidder.pageSize
						}
					});
					onMaxBidderPageSizeChange();
				}
			});

			loadSetting();

			$scope.$on('$destroy', function () {
				unWatchFn();
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
				printSettingService.onCollectSetting.unregister(onCollectSetting);
			});
		}]);
})(angular);