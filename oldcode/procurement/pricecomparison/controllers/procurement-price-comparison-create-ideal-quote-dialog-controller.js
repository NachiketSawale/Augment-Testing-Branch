/**
 * Created by chi on 10/23/2018.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).controller('procurementPriceComparisonCreateIdealQuoteDialogController', procurementPriceComparisonCreateIdealQuoteDialogController);

	procurementPriceComparisonCreateIdealQuoteDialogController.$inject = ['$scope', '$translate', 'basicsLookupdataLookupDescriptorService', 'platformModalService', '$http'];

	function procurementPriceComparisonCreateIdealQuoteDialogController($scope, $translate, basicsLookupdataLookupDescriptorService, platformModalService, $http) {
		$scope.modalOptions.ok = ok;
		$scope.modalOptions.deleteData = deleteData;
		$scope.modalOptions.proceeding = false;
		$scope.modalOptions.proceedingInfo = $translate.instant('procurement.pricecomparison.createIdealQuoteDialog.proceedingInfo');
		$scope.data = {
			selectedItemId: $scope.modalOptions.nonIdealQuotes[0].Id,
			selectedItem: $scope.modalOptions.nonIdealQuotes[0],
			items: $scope.modalOptions.nonIdealQuotes
		};

		$scope.$on('$destroy', function () {
			reset();
		});

		// /////////////////////

		function ok() {
			$scope.modalOptions.proceeding = true;
			var errMsg = $translate.instant('basics.common.importError.importError4BigData');
			if ($scope.data.selectedItemId) {
				$scope.modalOptions.createIdealQuote($scope.modalOptions.rfqHeaderId, $scope.data.selectedItemId, $scope.modalOptions.idealBidderDataType).then(function (response) {
					if (response && response.data) {
						if (angular.isFunction($scope.modalOptions.createNewCompareColumnItem)) {
							var idealQuote = response.data;
							if (idealQuote && idealQuote.quote && $scope.modalOptions.getIdealQuote) {
								basicsLookupdataLookupDescriptorService.attachData(idealQuote);
								var newItem = idealQuote.quote[0];
								newItem.IsIdealBidder = true;
								$scope.modalOptions.createNewCompareColumnItem(newItem);
							}
						}
					}
				}, function (error) {
					if (error && error.data) {
						errMsg = error.data.ErrorMessage;
					}
					platformModalService.showErrorBox(errMsg, 'cloud.common.errorMessage');
				}).finally(function () {
					close();
				});
			} else {
				close();
			}
		}

		function deleteData() {
			if (!$scope.modalOptions.rfqHeaderId || !$scope.modalOptions.idealQuote) {
				platformModalService.showMsgBox($translate.instant('procurement.pricecomparison.deleteIdealQuote.noFind'), $translate.instant('procurement.pricecomparison.deleteIdealQuote.title'), 'ico-info');
				return;
			}
			platformModalService.showYesNoDialog($translate.instant('procurement.pricecomparison.deleteIdealQuote.confirm'), $translate.instant('procurement.pricecomparison.deleteIdealQuote.title'), 'yes')
				.then(function (result) {
					if (result.yes) {
						let url = globals.webApiBaseUrl + 'procurement/quote/header/deleteIdealBidder?rfqId=' + $scope.modalOptions.rfqHeaderId;
						$http.get(url)
							// eslint-disable-next-line no-unused-vars
							.then(function (response) {
								close('delete');
							});
					}
				});
		}

		function reset() {
			$scope.data = {};
			$scope.modalOptions.proceeding = false;
		}

		function close(value) {
			$scope.modalOptions.proceeding = false;
			if ($scope.$close) {
				$scope.$close({result: value});
			}
		}
	}
})(angular);