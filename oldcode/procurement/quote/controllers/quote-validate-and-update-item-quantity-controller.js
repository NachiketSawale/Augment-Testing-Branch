/**
 * Created by Boom on 10/21/2024.
 */
(function (angular) {
	'use strict';

	angular.module('procurement.quote').controller('quoteValidateAndUpdateItemQuantityController',
		['$scope', '$http', '$translate', 'platformModalService', 'procurementQuoteHeaderDataService',
			function($scope, $http, $translate, platformModalService, procurementQuoteHeaderDataService) {

				$scope.setChecked = function(value) {
					angular.forEach($scope.options, function(item) {
						item.isChecked = item.value === value;
					});
				};

				$scope.validateAndUpdateItemQuantity = function() {
					if (procurementQuoteHeaderDataService.getSelected() === null) {
						platformModalService.showMsgBox('Please select a leading record.', 'Info', 'ico-info');
						$scope.modalOptions.ok();
						return;
					}
					let selectedItem = getSelectedPrcItem();
					if (!selectedItem) {
						return;
					}
					let httpCreationRequest = globals.webApiBaseUrl + 'procurement/quote/header/ValidateAndUpdateItemQuantity';
					let data = {
						QuoteId: procurementQuoteHeaderDataService.getSelected().Id,
						ValidateAndUpdateScope: selectedItem.value
					};
					$http.post(httpCreationRequest, data).then(function(result) {
						if (result && result.data !== null) {
							platformModalService.showMsgBox($translate.instant('cloud.common.hasBeenUpdatedSuccessfully', { itemCount: result.data }), 'Info', 'ico-info');
							$scope.modalOptions.ok();
						}
					}, function() {
						platformModalService.showMsgBox('Some exception happened.', 'Info', 'ico-info');
					});
				};

				function getSelectedPrcItem() {
					let result = null;
					for (let i = 0; i < $scope.options.length; i++) {
						if ($scope.options[i].isChecked === true) {
							result = $scope.options[i];
							break;
						}
					}
					return result;
				}

				$scope.options = [
					{
						value: 'CurrentLeadingRecord',
						text: $translate.instant('cloud.common.forCurrentLeadingRecord'),
						isChecked: true
					},
					{ value: 'CurrentPackage', text: $translate.instant('cloud.common.forCurrentPackage'), isChecked: false },
					{ value: 'CurrentProject', text: $translate.instant('cloud.common.forCurrentProject'), isChecked: false }
				];

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.common.wizard.validateAndUpdateItemQuantity')
				});
			}
		]);
})(angular);
