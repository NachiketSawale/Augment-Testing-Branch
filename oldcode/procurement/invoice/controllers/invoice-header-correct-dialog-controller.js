(function (angular) {
	'use strict';
	/* global globals, _ */

	angular.module('procurement.invoice').controller('procurementInvoiceHeaderCorrectDialogController', [
		'$scope',
		'$http',
		'$translate',
		'platformRuntimeDataService',
		'platformDataValidationService',
		function (
			$scope,
			$http,
			$translate,
			platformRuntimeDataService,
			platformDataValidationService
		) {
			const code = $scope.$parent.modalOptions.code;
			const list = $scope.$parent.modalOptions.list;
			const httpRoutBaseUrl = globals.webApiBaseUrl + 'procurement/invoice/header/';
			const codeTr = $translate.instant('procurement.invoice.header.code');
			const asyncCodeValidateor = function (entity, value, model) {
				return platformDataValidationService.isSynAndAsyncUnique(list, httpRoutBaseUrl + 'iscodeunique',
					entity, value, model, {object: codeTr}
				).then(function (result) {
					return result;
				});
			};
			const options = {
				showGrouping: false,
				groups: [ { gid: '1', header: '', header$tr$: '', isOpen: true, visible: true, sortOrder: 1 } ],
				rows: [{
					gid: '1',
					rid: 'code',
					label: 'Entry No.',
					label$tr$: codeTr,
					type: 'code',
					model: 'Code',
					asyncValidator: asyncCodeValidateor
				}]
			};
			$scope.newItem = null;
			$scope.updateEntities = [];
			$scope.messageText = '';
			$scope.autoGenerateCode = $scope.$parent.modalOptions.autoGenerateCode;
			$scope.isLoading = $scope.autoGenerateCode;
			$scope.currentItem = {Code: code};
			$scope.configureOptions = { configure: options };
			$scope.showCodeInput = false;
			$scope.correctSuccess = false;
			$scope.cannotCorrect = false;
			$scope.disableOk = function() {
				if ($scope.isLoading) {
					return true;
				} else if (_.has($scope.currentItem, '__rt$data.errors.Code') && ($scope.currentItem.__rt$data.errors.Code)) {
					return true;
				}
				return false;
			};
			$scope.disableCancel = function() {
				return !!$scope.isLoading;
			};
			$scope.ok = function() {
				if ($scope.correctSuccess) {
					$scope.$close({ok: true, item: $scope.newItem, updateEntities: $scope.updateEntities});
				} else {
					correctInvoice();
				}
			};
			$scope.cancel = function() {
				$scope.$close({cancel: true});
			};
			function correctInvoice() {
				$scope.isLoading = true;
				return $http.post(httpRoutBaseUrl + 'correct', {
					Type: $scope.$parent.modalOptions.type,
					SelectedInvoice: $scope.$parent.modalOptions.selectedItem,
					NewInvoiceCode: $scope.currentItem.Code
				}).then(function (response) {
					$scope.newItem = response.data.newEntity;
					$scope.updateEntities = response.data.updateEntities;
					$scope.messageText = $translate.instant('procurement.invoice.correctSuccess', {
						code: $scope.newItem.Code
					});
					$scope.isLoading = false;
					$scope.showCodeInput = false;
					$scope.correctSuccess = true;
				});
			}
			function checkWhetherCanCorrectInvoice() {
				$scope.isLoading = true;
				return $http.get(httpRoutBaseUrl + 'validateinvoiceforcorrect?invoiceHeaderId=' + $scope.$parent.modalOptions.selectedItem.Id + '&type=' + $scope.$parent.modalOptions.type).then(function (response) {
					const res = response.data;
					if (res.Result) {
						if ($scope.autoGenerateCode) {
							correctInvoice();
						}
						else {
							const isMandatoryResult = platformDataValidationService.isMandatory($scope.currentItem.Code, 'Code');
							platformRuntimeDataService.applyValidationResult(isMandatoryResult, $scope.currentItem, 'Code');
							$scope.showCodeInput = true;
							$scope.isLoading = false;
						}
					}
					else {
						$scope.messageText = res.Message;
						$scope.cannotCorrect = true;
						$scope.isLoading = false;
					}
				});
			}
			checkWhetherCanCorrectInvoice();
		}]);
})(angular);