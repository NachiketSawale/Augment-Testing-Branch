/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateCombineLineItemSaveCustomViewController', [
		'_',
		'$scope',
		'$modalInstance',
		'$translate',
		'moment',
		'platformUserInfoService',
		'estimateMainCombineLineItemCustomViewConstants',
		'estimateMainCombineLineItemCustomViewService',
		'controllerOptions',
		function (_,
			$scope,
			$modalInstance,
			$translate,
			moment,
			platformUserInfoService,
			constants,
			customViewService,
			controllerOptions) {

			let locations = [
				{
					name: $translate.instant('basics.common.configLocation.user'),
					value: constants.customViewSaveType.user
				},
				{
					name: $translate.instant('basics.common.configLocation.role'),
					value: constants.customViewSaveType.role
				},
				{
					name: $translate.instant('basics.common.configLocation.system'),
					value: constants.customViewSaveType.system
				}
			];
			let locationFilters = {
				'1': function (item) {
					return !!item.FrmUserFk;
				},
				'2': function (item) {
					return !!item.FrmAccessRoleFk;
				},
				'3': function (item) {
					return item.IsSystem;
				}
			};

			$scope.isLoading = false;

			$scope.modalOptions = {
				headerText: $translate.instant('estimate.main.combineLineItems.saveCustomView'),
				locationText: $translate.instant('estimate.main.combineLineItems.saveLocation'),
				availableViewsText: $translate.instant('estimate.main.combineLineItems.availableViews'),
				saveViewNameText: $translate.instant('estimate.main.combineLineItems.saveViewName'),
				deleteButtonText: $translate.instant('cloud.common.delete'),
				defaultButtonText: $translate.instant('basics.common.button.default'),
				actionButtonText: $translate.instant('basics.common.button.ok'),
				closeButtonText: $translate.instant('basics.common.button.cancel'),
				ok: function () {
					let customView = $scope.viewOptions.selectedItem && $scope.viewOptions.selectedItem.Description === $scope.viewOptions.customViewName ?
						$scope.viewOptions.selectedItem :
						{
							Description: $scope.viewOptions.customViewName,
							ViewType: controllerOptions.viewType
						};
					let viewConfig = {};
					viewConfig.baseCombinedView = controllerOptions.viewType;
					viewConfig.columns = {};
					viewConfig.columns.combineColumns = controllerOptions.combineColumns;
					customView.ViewConfig = JSON.stringify(viewConfig);
					customView.ViewType = controllerOptions.viewType;
					$scope.isLoading = true;
					customViewService.saveCustomView($scope.locationOptions.selectedItem.value, [customView]).then(function () {
						$scope.modalOptions.cancel({ok: true});
					}).finally(function () {
						$scope.isLoading = false;
					});
				},
				delete: function () {
					$scope.isLoading = true;
					customViewService.deleteCustomView($scope.viewOptions.selectedItem.Id).then(function () {
						$scope.modalOptions.cancel({ok: true});
					}).finally(function () {
						$scope.isLoading = false;
					});
				},
				default: function () {
					$scope.isLoading = true;
					customViewService.setDefault($scope.viewOptions.selectedItem.Id).then(function () {
						// $scope.modalOptions.cancel({ok: true});
					}).finally(function () {
						$scope.isLoading = false;
					});
				},
				cancel: function (result) {
					if (result && result.ok) {
						$modalInstance.close(result);
					} else {
						$modalInstance.dismiss('cancel');
					}
				}
			};

			$scope.buttonOptions = {
				disableOkay: function () {
					return $scope.viewOptions.customViewName === '';
				},
				disableDefault: function () {
					return !$scope.viewOptions.selectedItem || $scope.viewOptions.selectedItem.IsDefault || $scope.locationOptions.selectedItem.value === constants.customViewSaveType.user;
				},
				disableDelete: function () {
					return !$scope.viewOptions.selectedItem;
				}
			};

			$scope.locationOptions = {
				selectedItem: locations[0],
				items: locations,
				onSelectChanged: function () {
					$scope.viewOptions.selectedItem = null;
					loadCustomViews();
				}
			};

			$scope.viewOptions = {
				customViewName: '',
				selectedItem: null,
				isShowTitle: false,
				items: null,
				onSelectChanged: function () {
					if (this.selectedItem) {
						this.customViewName = this.selectedItem.Description;
					}
				}
			};

			function loadCustomViews() {
				let getPromise = customViewService.getCustomViews(true);

				$scope.isLoading = true;

				getPromise.then(function (items) {
					let customViews = _.filter(items, function (item) {
						return item.Description !== null && locationFilters[$scope.locationOptions.selectedItem.value].call(null, item);
					});
					_.forEach(customViews, function (customView) {
						let userName = platformUserInfoService.logonName(customView.UpdatedBy || customView.InsertedBy);
						let extStr;

						if (userName) {
							extStr = userName + ' | ' + moment(customView.UpdatedAt || customView.InsertedAt).format('L | LTS');
							customView.dialogName = customView.Description + ' (' + extStr + ')' + (customView.IsDefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
						} else {
							// eslint-disable-next-line no-console
							console.log('user info not found:' + customView.UpdatedBy + ' | ' + customView.InsertedBy);
							customView.dialogName = customView.Description + ' ( loading ...)';

							platformUserInfoService.loadUsers([customView.UpdatedBy || customView.InsertedBy])
								.then(function () {
									userName = platformUserInfoService.logonName(customView.UpdatedBy || customView.InsertedBy);
									extStr = userName + ' | ' + moment(customView.UpdatedAt || customView.InsertedAt).format('L | LTS');
									customView.dialogName = customView.Description + ' (' + extStr + ')' + (customView.IsDefault && (' (' + $scope.modalOptions.defaultButtonText + ')') || '');
								});
						}
					});
					$scope.viewOptions.items = customViews;
					$scope.viewOptions.selectedItem = null;
					$scope.isLoading = false;
				});
			}

			loadCustomViews();
		}
	]);
})(angular);
