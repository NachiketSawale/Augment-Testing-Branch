/**
 * Created by lja on 5/18/2015.
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteCreateContractWizardsController',
		['$scope', 'globals', '$translate', 'procurementQuoteRequisitionDataService', 'procurementQuoteHeaderDataService',
			'$http', 'cloudDesktopSidebarService', '$state',
			function ($scope, globals, $translate, procurementQuoteRequisitionDataService, procurementQuoteHeaderDataService,
				$http, cloudDesktopSidebarService, $state) {

				var createContractTypeValue =
						{
							createContracts: 'createContracts',
							createOneContract: 'createOneContract'
						},
					webApiRoute = {
						createContracts: 'createcontractsfromquote',
						createMergeContract: 'createmergecontractfromquote',
						createContractWithChangeOrder: ''
					};

				var conHeaderIds = [];
				$scope.createContractType = createContractTypeValue.createContracts;
				var translatePrefix = 'procurement.quote.wizard.create.contract';
				$scope.translateTemplate = {
					createContractsTemplate: $translate.instant(translatePrefix + '.createContracts'),
					createOneContractTemplate: $translate.instant(translatePrefix + '.createOneContract')
				};
				$scope.showCreateType = true;
				$scope.okBtnDisabled = true;
				$scope.creating = false;
				$scope.created = false;
				$scope.createdText = null;
				$scope.hasContractItem = $scope.modalOptions.hasContractItem || false;
				$scope.isFilterEvaluated = $scope.modalOptions.isFilterEvaluated;
				$scope.showFilterEvaluated = $scope.modalOptions.showFilterEvaluated || false;
				$scope.goToContract = function () {
					$state.go(globals.defaultState + '.' + 'procurement.contract'.replace('.', '')).then(function () {
						cloudDesktopSidebarService.filterSearchFromPKeys(conHeaderIds);
					});
					$scope.$close(false);
				};
				$scope.priceRadioChg = function (isPrice) {
					$scope.isFilterEvaluated = isPrice;
				};
				$scope.modalOptions = {
					headerText: $translate.instant(translatePrefix + '.title'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					closeButtonText: $translate.instant('cloud.common.close'),
					isFilterEvaluated: $scope.isFilterEvaluated,
					ok: function () {
						$scope.modalOptions.dialogLoading = true;
						$scope.showCreateType = false;
						$scope.creating = true;
						$scope.showFilterEvaluated = false;
						$scope.okBtnDisabled = false;
						var headerItem = procurementQuoteHeaderDataService.getSelected();
						var webApiPostFix = webApiRoute.createContracts;
						// create merge contract
						if ($scope.createContractType === createContractTypeValue.createOneContract) {
							webApiPostFix = webApiRoute.createMergeContract;
						}
						var quoteRequisitionList = procurementQuoteRequisitionDataService.getList(),
							len = quoteRequisitionList.length;
						if (len > 0) {
							$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/' + webApiPostFix, {
								QtnHeaderId: headerItem.Id,
								Wizards: 22,
								IsFilterEvaluated: $scope.modalOptions.isFilterEvaluated || 1
							}).then(function (response) {
								var codeArr = [];
								var items = response.data;
								if (items && items.length > 0) {
									items.forEach((item) => {
										if (item.Version > 0) { // filter out contracts which are not saved
											conHeaderIds.push(item.Id);
											codeArr.push(item.Code);
										}
									});
									// $scope.createdText = $translate.instant('procurement.common.createContractSuccessfully',{codes: codeArr.join(', ')});
									let createdText = $translate.instant(translatePrefix + '.successfully');
									$scope.createdText = createdText;
									$scope.codeText = $translate.instant(translatePrefix + '.newCode',{newCode:codeArr.join(', ')});
									$scope.created = true;
									$scope.creating = false;
									$scope.modalOptions.dialogLoading = false;
								} else {
									setError(true, $translate.instant(translatePrefix + '.noQuoteRequisition'), 'error');
									$scope.okBtnDisabled = false;
									$scope.modalOptions.dialogLoading = false;
								}
							}, function () {
								setError(true, $translate.instant(translatePrefix + '.fail'), 'error');
								$scope.okBtnDisabled = false;
								$scope.modalOptions.dialogLoading = false;
							});
						} else {
							setError(true, $translate.instant(translatePrefix + '.noRequisitions'), 'error');
							$scope.okBtnDisabled = false;
							$scope.modalOptions.dialogLoading = false;
						}
					},
					close: function () {
						$scope.$close(false);
					},
					cancel: function () {
						$scope.$close(false);
					}
				};

				function setError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}

				$scope.changeCreateType = function (type) {
					$scope.createContractType = type === 'merge' ? createContractTypeValue.createOneContract : createContractTypeValue.createContracts;
				};

				var init = function () {
					var quoteRequisitionList = procurementQuoteRequisitionDataService.getList(),
						len = quoteRequisitionList.length;
					if (len === 1) {
						// $scope.modalOptions.ok();
						if(!$scope.isFilterEvaluated) {
							$scope.modalOptions.ok();
						}
						$scope.showCreateType = false;
						$scope.okBtnDisabled = false;
					} else {
						$scope.okBtnDisabled = false;
					}
				};

				init();
			}]);
})(angular);

