/**
 * Created by chi on 5/17/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).controller('procurementPriceComparisonSeperatePrcItemContractController', [
		'$scope', '$http', '$timeout', '$state', '$translate', 'cloudDesktopSidebarService',
		'procurementPriceComparisonSeperatePrcItemContractService',
		function controller($scope, $http, $timeout, $state, $translate, cloudDesktopSidebarService,
			procurementPriceComparisonSeperatePrcItemContractService) {

			var formOptions = {
				fid: 'procurement.pricecomparison.create.seperate.prcitem.contract',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'create.seperate.prcitem.contract',
						header: $translate.instant('procurement.pricecomparison.wizard.create.contract.seperate.prcitem'),
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: 'create.seperate.prcitem.contract',
						label: '',
						rid: '1',
						type: 'directive',
						directive: 'procurement-price-comparison-seperate-prc-item-contract'
					}
				]
			};

			// the form view
			$scope.containerOptions = {
				formOptions: {
					configure: formOptions
				}
			};

			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.wizard.createPartialContracts'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				closeButtonText: $translate.instant('cloud.common.cancel'),
				ok: function () {
					$scope.okBtnStatus = true; // after ok btn is clicked, disable it
					$scope.modalOptions.dialogLoading = true; // the circle is loading...
					createContract();
				},
				close: function () {
					$scope.$close(false);
				},
				cancel: function () {
					$scope.$close(false);
				}
			};

			$scope.$on('$destroy', function () {
				procurementPriceComparisonSeperatePrcItemContractService.resetData();
			});

			/**
			 * @ngdoc function
			 * @param {bool} isShow (true: show, false: hidden)
			 * @param {string} message
			 * @param {number} type (0: success; 1: info; 2: warning; 3: error)
			 */
			function setError(isShow, message, type) {
				$scope.error = {
					show: isShow,
					messageCol: 1,
					message: message,
					type: type
				};
			}

			function createContract() {
				var requestData = procurementPriceComparisonSeperatePrcItemContractService.getRequestData();

				$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createcontractsforseperateprcitem', {
					SeperatePrcItems: requestData.seperatePrcItemsGrouppedByBP,
					Wizards: requestData.wizards
				}).then(function (response) {
					// after response, remove the circle loading
					$scope.modalOptions.dialogLoading = false;

					if (response.data) {
						// show a successful message
						setError(true, contractTr('create.contract.successfully'), 1);

						// go to contract module
						var len = response.data.length;
						var conHeaderIds = [];
						for (var i = 0; i < len; i++) {
							conHeaderIds.push(response.data[i].Id);
						}
						$timeout(function () {
							$scope.$close(false);
							$state.go(globals.defaultState + '.' + 'procurement.contract'.replace('.', '')).then(function () {
								cloudDesktopSidebarService.filterSearchFromPKeys(conHeaderIds);
							});
						}, 2000);

					} else {
						// show error message
						setError(true, contractTr('create.contract.noQuoteRequisition'), 3);
						$scope.okBtnStatus = false; // enable ok button
					}
				}, function () {
					setError(true, contractTr('createContractFail'), 3);
					$scope.okBtnStatus = false;  // enable ok button
				});
			}

			function contractTr(term) {
				return $translate.instant('procurement.pricecomparison.wizard.' + term);
			}
		}
	]);
})(angular);
