/**
 * Created by jim on 2/14/2017.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc controller
	 * @name procurementPackageGridController
	 * @require $scope, platformGridControllerBase, $filter,  procurementPackageDataService, procurementPackageUIStandardService, slickGridEditors, lookupDataService, reqHeaderElementValidationService
	 * @description controller for requisition header
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('packageValidateAndUpdateItemQuantityController',
		['$scope', '$http', '$translate', 'platformModalService', 'procurementPackageDataService',
			function ($scope, $http, $translate, platformModalService, procurementPackageDataService) {

				$scope.setChecked = function (value) {
					angular.forEach($scope.Options, function (item) {
						if (item.isChecked === true) {
							item.isChecked = false;
						}
						if (item.value === value) {
							item.isChecked = true;

						}
					});
				};

				$scope.validateAndUpdateItemQuantity = function () {
					var selectedItem = getSelectedPrcItem();
					if (procurementPackageDataService.getSelected() === null && (selectedItem.value === 'currentPackage' || selectedItem.value === 'currentProject')) {
						platformModalService.showMsgBox('Please select a leading record.', 'Info', 'ico-info');
						$scope.modalOptions.ok();
					} else {
						if (selectedItem !== null) {
							var httpCreationRequest = globals.webApiBaseUrl + 'procurement/package/package/ValidateAndUpdateItemQuantity';
							var leadingRecordItem = procurementPackageDataService.getSelected();
							var data = {
								PackageId: leadingRecordItem !== null ? leadingRecordItem.Id : null,
								ValidateAndUpdateScope: selectedItem.value
							};
							$http.post(httpCreationRequest, data).then(function (result) {
								if ((result !== null) && (result.data !== null)) {
									if (result.data === 0) {
										platformModalService.showMsgBox('Quantity of 0 item has been updated successfully', 'Info', 'ico-info');
									} else if (result.data === 1) {
										platformModalService.showMsgBox('Quantity of 1 item has been updated successfully.', 'Info', 'ico-info');
									} else if (result.data > 1) {
										platformModalService.showMsgBox('Quantity of ' + result.data + ' items have been updated successfully.', 'Info', 'ico-info');
									}
									$scope.modalOptions.ok();
								}
							}, function () {
								platformModalService.showMsgBox('Some exception happened.', 'Info', 'ico-info');
							});
						}
					}
				};

				function getSelectedPrcItem() {
					var result = null;
					for (var i = 0; i < $scope.Options.length; i++) {
						if ($scope.Options[i].isChecked === true) {
							result = $scope.Options[i];
							break;
						}
					}
					return result;
				}

				$scope.Options = [
					{value: 'currentPackage', text: 'For current package', isChecked: true},
					{value: 'currentProject', text: 'For current project', isChecked: false},
					{value: 'currentCompany', text: 'For current login company', isChecked: false}
				];

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.common.wizard.validateAndUpdateItemQuantity')
				});
			}
		]);
})(angular);
