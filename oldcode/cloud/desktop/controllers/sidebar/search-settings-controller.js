// jshint -W072
// jshint +W098
/**
 @ngdoc controller
 * @name cloudSettingsDialogController
 * @function
 *
 * @description
 * Controller for the Document Properties Structure Details view.
 */
angular.module('cloud.desktop').controller('cloudDesktopSearchSettingsController',
	['$scope', 'platformTranslateService', 'cloudDesktopSidebarService', '$translate', '$timeout', 'basicsConfigMainService',
		function ($scope, platformTranslateService, cloudDesktopSidebarService, $translate, $timeout, basicsConfigMainService) {
			'use strict';

			/**
			 * selfexplaining....
			 */
			function setFocusToSearchPageSizeInput() {
				// must run in new digest cycle, otherwise focus not working, we delay it slightly to be sure focus
				// move to this input field
				$timeout(function () {
					var elem = $('#searchPageSize');
					if (elem) {
						elem.focus();
					}
				}, 50);
			}

			function reloadMaxPageSize() {
				cloudDesktopSidebarService.readRecordPerPageStandardSize().then(function () {
					$timeout(function () {
						$scope.recordPerPageDataFetched = false;
						// the basic.config module is overwriting the list in basicsConfigMainService when filtering
						// skip this part for the basics.config module
						if (cloudDesktopSidebarService.filterRequest.moduleName !== 'basics.config') {
							basicsConfigMainService.getByModuleId(cloudDesktopSidebarService.filterRequest.moduleName).then(function (response) {
								$timeout(function () {
									updateFilterSettings(response);
								});
							});
						} else {
							updateFilterSettings(cloudDesktopSidebarService.filterRequest);
						}
					});
				});
			}

			function updateFilterSettings(data) {
				cloudDesktopSidebarService.recordPerPageMaxValue = data.MaxPageSize;
				if (data.MaxPageSize > 0) {
					$scope.infoTextMaxPageSize = $translate.instant('cloud.desktop.infoTextMaxPageSize', {maxPageSize: data.MaxPageSize});
				} else if (data.MaxPageSize === 0) {
					$scope.infoTextMaxPageSize = $translate.instant('cloud.desktop.infoTextUnlimitedPageSize');
				}
				expandTooltipString();
				$scope.settingsOptions.filterRequest.pageSize = getAllowedValue($scope.settingsOptions.filterRequest.pageSize);
				$scope.recordPerPageDataFetched = true;
			}

			$scope.settingsOptions = {
				filterRequest: cloudDesktopSidebarService.filterRequest,
				filterInfo: cloudDesktopSidebarService.filterInfo,
				pageInfoLabel: $translate.instant('cloud.desktop.sdSettingspageInfoLabel'),
				pageInfoLabel$tr$: 'cloud.desktop.sdSettingspageInfoLabel',
				restoreEntitiesChk: {
					ctrlId: 'restoreEntities',
					labelText: $translate.instant('cloud.desktop.sdGoogleRestoreEntitiesChk'),
					labelText$tr$: 'cloud.desktop.sdGoogleRestoreEntitiesChk'
				},
				withExecutionHintsChk: {
					ctrlId: 'withExecutionHints',
					labelText: $translate.instant('cloud.desktop.sdGoogleExecHintsChk'),
					labelText$tr$: 'cloud.desktop.sdGoogleExecHintsChk',
					changeChk: function() {
						$scope.searchOptions.cssClass.hintsChk = $scope.settingsOptions.filterRequest.withExecutionHints;
					}
				},
				executionHintLabel: $translate.instant('cloud.desktop.sdSettingsExecHintLabel'),
				executionHintLabel$tr$: 'cloud.desktop.sdSettingsExecHintLabel',
				showHelpDeskServiceParameter: cloudDesktopSidebarService.showHelpDeskServiceParameter
			};

			$scope.infoTextMaxPageSize = $translate.instant('cloud.desktop.infoTextMaxPageSize', {maxPageSize: 1000});
			reloadMaxPageSize();

			cloudDesktopSidebarService.fetchShowHelpDeskServiceParameter().then(function () {
				$scope.settingsOptions.showHelpDeskServiceParameter = cloudDesktopSidebarService.showHelpDeskServiceParameter;
			});

			// loads or updates translated strings
			var loadTranslations = function () {
				platformTranslateService.translateObject($scope.settingsOptions, ['pageInfoLabel', 'labelText', 'executionHintLabel']);
			};

			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			setFocusToSearchPageSizeInput();

			function getAllowedValue(value) {
				if (value < 0) {
					value = -1 * value;
				}

				if (cloudDesktopSidebarService.recordPerPageMaxValue > 0) { // limited record
					if (value > 0 && value <= cloudDesktopSidebarService.recordPerPageMaxValue) {
						return value;
					} else {
						return cloudDesktopSidebarService.recordPerPageMaxValue;
					}
				} else { // unlimited record allowed
					return value;
				}
			}

			function expandTooltipString() {
				$scope.infoTextMaxPageSize += '&#013;' + $translate.instant('cloud.desktop.InfoTextTooltip');
			}

			$scope.$watch('settingsOptions.filterRequest.pageSize', function (newVal, oldVal, scope) {
				// only correct value if settings has loaded
				if ($scope.recordPerPageDataFetched) {
					if (newVal !== null && newVal !== undefined) {
						scope.settingsOptions.filterRequest.pageSize = getAllowedValue(newVal);
					} else {
						scope.settingsOptions.filterRequest.pageSize = getAllowedValue(oldVal);
					}
				}

				// #123779: save current page size in view data
				// only change if value has changed and
				if (newVal !== oldVal) {
					scope.settingsOptions.filterRequest.savePageSize();
				}
			});

			cloudDesktopSidebarService.onOpenSidebar.register(reloadMaxPageSize);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
				cloudDesktopSidebarService.onOpenSidebar.unregister(reloadMaxPageSize);
			});

		}]);
