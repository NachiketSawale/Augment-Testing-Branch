/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc controller
     * @name platform.controller:estimateMainMasterDetailDialogController
     * @requires _, $scope, $q, platformTranslateService, $translate
     * @description Controller for the estimate main resource summary master detail dialog box.
     */
	angular.module(moduleName).controller('estimateMainMasterDetailDialogController', ['_', '$scope', '$q',
		'platformTranslateService', '$translate', 'estimateMainResourceSummaryConfigDataService',
		function (_, $scope, $q, platformTranslateService, $translate, estimateMainResourceSummaryConfigDataService) { // jshint ignore:line
			$scope.getContainerUUID = function () {
				return '515e4e050710438383782f5e473a784c';
			};

			$scope.nameProperty = 'name';

			function getMasterItems() {
				let masterItems = [];
				masterItems.push({
					Id: 'userSettings',
					name: $translate.instant('estimate.main.summaryConfig.userSetting')
				});
				masterItems.push({
					Id: 'roleSettings',
					name: $translate.instant('estimate.main.summaryConfig.roleSetting')
				});
				masterItems.push({
					Id: 'sysSettings',
					name: $translate.instant('estimate.main.summaryConfig.systemSetting')
				});
				return masterItems;
			}

			$scope.displayedItems = getMasterItems();

			let configure = {
				fid: 'model.viewer.ods.form',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'general',
						header$tr$: 'estimate.main.summaryConfig.generalSettings',
						isOpen: true,
						isVisible: true,
						sortOrder: 0
					},
					{
						gid: 'combined',
						header$tr$: 'estimate.main.summaryConfig.combineSettings',
						isOpen: true,
						isVisible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'general',
					rid: 'name',
					type: 'directive',
					directive: 'estimate-main-summary-config-grid',
					model: 'name',
					sortOrder: 1
				}, {
					gid: 'combined',
					rid: 'other',
					type: 'directive',
					directive: 'estimate-main-summary-combine-grid',
					model: 'other',
					sortOrder: 2
				}]
			};
			$scope.formOptions = {
				configure: configure
			};

			platformTranslateService.translateFormConfig($scope.formOptions.configure);

			$scope.selectedItem = null;
			let firstTimeLoaded = true;

			$scope.selectItem = function (item) {
				if (isDisabled(item) || !isVisible(item)) {
					return;
				}

				$scope.selectedItem = item;
				estimateMainResourceSummaryConfigDataService.setSelectedItemPath(item);
				firstTimeLoaded = false;
				if(!firstTimeLoaded) {
					estimateMainResourceSummaryConfigDataService.onSelectedTypeChanged.fire(item);
				}
			};

			$scope.isDisabled = isDisabled;
			$scope.isVisible = isVisible;

			function isDisabled(item) {
				// eslint-disable-next-line no-prototype-builtins
				if (item && item.hasOwnProperty(getDisabledMember())) {
					return item[getDisabledMember()];
				}
				else {
					return false;
				}
			}

			function isVisible(item) {
				// eslint-disable-next-line no-prototype-builtins
				if (item && item.hasOwnProperty(getVisibleMember())) {
					return item[getVisibleMember()];
				}
				else {
					return true;
				}
			}

			function getDisabledMember() {
				return 'disabled';
			}

			function getVisibleMember() {
				return 'visible';
			}

			function doInitialItemSelect() {
				if ($scope.displayedItems.length > 0) {
					let item;

					item = $scope.displayedItems.find(function findItem(item) {
						// select first item which isn't disabled and is visible
						return !isDisabled(item) && isVisible(item);
					});

					if (item) {
						$scope.selectItem(item);
					}
					else {
						$scope.selectItem($scope.displayedItems[0]);
					}
				}
			}

			doInitialItemSelect();
		}]);
})();
