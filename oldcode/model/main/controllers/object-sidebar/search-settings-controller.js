/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global $ */
	'use strict';
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
	angular.module('model.main').controller('modelMainObjectSidebarSearchSettingsController',
		['$scope', 'platformTranslateService', 'cloudDesktopSidebarService', '$translate', '$timeout',
			function ($scope, platformTranslateService, cloudDesktopSidebarService, $translate, $timeout) {

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

				$scope.settingsOptions = {
					filterRequest: cloudDesktopSidebarService.filterRequest,
					filterInfo: cloudDesktopSidebarService.filterInfo,
					pageInfoLabel: $translate.instant('cloud.desktop.sdSettingspageInfoLabel'),
					pageInfoLabel$tr$: 'cloud.desktop.sdSettingspageInfoLabel',
					withExecutionHintsChk: {
						ctrlId: 'withExecutionHints',
						labelText: $translate.instant('cloud.desktop.sdGoogleExecHintsChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleExecHintsChk'
					},
					executionHintLabel: $translate.instant('cloud.desktop.sdSettingsExecHintLabel'),
					executionHintLabel$tr$: 'cloud.desktop.sdSettingsExecHintLabel'
				};

				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject($scope.settingsOptions, ['pageInfoLabel', 'labelText', 'executionHintLabel']);
				};

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				setFocusToSearchPageSizeInput();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
				});

			}]);
})(angular);
