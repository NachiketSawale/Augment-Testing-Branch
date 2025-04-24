(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module(moduleName).controller('procurementPriceComparisonOneQuoteContractController', [
		'$scope',
		'$injector',
		'$translate',
		'procurementPriceComparisonOneQuoteContractMainService',
		'basicsLookupdataLookupDataService',
		'procurementQuoteCreateContractWizardService',
		'procurementPriceComparisonMainService',
		'platformModalService',
		'procurementPriceComparisonCommonService',
		function ($scope,
			$injector,
			$translate,
			procurementPriceComparisonOneQuoteContractMainService,
			lookupDataService,
			procurementQuoteCreateContractWizardService,
			mainService,
			platformModalService,
			procurementPriceComparisonCommonService) {

			var formOptions = {
				fid: 'procurement.pricecomparison.create.one.quote.contract',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'create.one.quote.contract',
						header: contractTr(procurementPriceComparisonOneQuoteContractMainService.dialoguePrompt || 'create.contract.doYouWantTo'),
						isOpen: true,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'create.one.quote.requisition',
						header: contractTr('reqInQuotation'),
						isOpen: true,
						visible: true,
						sortOrder: 2
					}
				],
				rows: [
					{
						gid: 'create.one.quote.contract',
						label: '',
						rid: '1',
						type: 'directive',
						directive: 'procurement-price-comparison-one-quote-contract'
					},
					{
						gid: 'create.one.quote.requisition',
						label: '',
						rid: '2',
						type: 'directive',
						directive: 'procurement-price-comparison-one-quote-contract-requisition'
					}
				]
			};

			$scope.okBtnStatus = false;
			$scope.reqTotal = procurementPriceComparisonOneQuoteContractMainService.getSelectedReqTotal();
			$scope.htmlTranslate = {
				reqTotal: $translate.instant('procurement.pricecomparison.compareQuoteSubtotal'),
				items: $translate.instant('procurement.pricecomparison.htmlTranslate.items')
			};
			// the form view
			$scope.containerOptions = {
				formOptions: {
					configure: formOptions
				}
			};
			$scope.hasContractItem = procurementPriceComparisonOneQuoteContractMainService.getHasContractItem();
			$scope.modalOptions = {
				headerText: contractTr('createContract'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				closeButtonText: $translate.instant('cloud.common.cancel'),
				dialogLoading: false,
				loadingInfo: '',
				isFilterEvaluated: 2,
				ok: function () {
					$scope.okBtnStatus = true; // after ok btn is clicked, disable it
					showOptionDialog();
				},
				close: function () {
					$scope.$close(false);
				},
				cancel: function () {
					$scope.$close(false);
				}
			};
			$scope.priceRadioChg = function (isPrice) {
				$scope.modalOptions.isFilterEvaluated = isPrice;
			};

			$scope.error = {
				show: false,
				messageCol: 1,
				message: '',
				type: 0
			};

			$scope.hasChangeOrder = function () {
				return mainService.isCurrentSelectedIncludingChangeOrder();
			};

			var unwatch1 = $scope.$watch(procurementPriceComparisonOneQuoteContractMainService.getSelectedReqHeaderIdsCount, function (newValue) {
				$scope.okBtnStatus = newValue <= 0;
				$scope.reqTotal = procurementPriceComparisonOneQuoteContractMainService.getSelectedReqTotal();
				checkAndCreateContract();
			});

			$scope.$on('$destroy', function () {
				if (unwatch1) {
					unwatch1();
				}
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

			function checkAndCreateContract() {
				var reqHeaderIds = procurementPriceComparisonOneQuoteContractMainService.getSelectedReqHeaderIds();
				var reqHeaders = procurementPriceComparisonOneQuoteContractMainService.getReqHeaders();
				var errors = '';
				lookupDataService.getList('ReqStatus').then(function (data) {
					_.forEach(reqHeaders, function (reqHeader) {
						if (_.includes(reqHeaderIds, reqHeader.Id)) {
							var reqStatus = _.find(data, {Id: reqHeader.ReqStatusFk});
							if (reqStatus && reqStatus.Isordered) {
								errors += reqHeader.Code + ' ';
							}
						}
					});

					if (errors) {
						setError(true, $translate.instant('procurement.pricecomparison.wizard.create.contract.reqStatusIsOrderedDeny', {req: errors}), 2);
					} else {
						setError(false, '', 0);
					}
				});
			}

			function createContract() {
				var qtnHeaders = procurementPriceComparisonOneQuoteContractMainService.getQuote();
				var qtnHeaderId = qtnHeaders[0].Id;
				var qtnLength = qtnHeaders.length;
				var qtnHeaderIds = _.map(qtnHeaders, 'Id');
				var from = procurementPriceComparisonOneQuoteContractMainService.from;
				var reqHeaderIds = procurementPriceComparisonOneQuoteContractMainService.getSelectedReqHeaderIds();
				let reqHeaderId2ReqVariantIdsMap = procurementPriceComparisonOneQuoteContractMainService.getSelectedReqHeaderId2ReqVariantIdsMap();

				var createContractTypeValue = {
					createContracts: 'createContracts',
					createOneContract: 'createOneContract'
				};
				var webApiPostfix = 'createcontractsfromquote';
				if (procurementPriceComparisonCommonService.getWizardContractType() === createContractTypeValue.createOneContract) {
					webApiPostfix = 'createmergecontractfromquote';
				}

				if (parseInt(qtnHeaderId) > 0 && reqHeaderIds && reqHeaderIds.length > 0 && qtnLength === 1) {
					var url = globals.webApiBaseUrl + 'procurement/contract/wizard/' + webApiPostfix;
					$injector.get('$http').post(url, {
						QtnHeaderId: qtnHeaderId,
						ReqHeaderIds: reqHeaderIds,
						Wizards: from,
						IsFilterEvaluated: $scope.modalOptions.isFilterEvaluated || 2,
						AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
							ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
						} : null
					}).then(function (response) {
						afterResponse(response);
					}, function () {
						setError(true, contractTr('createContractFail'), 3);
						$scope.okBtnStatus = false;  // enable ok button
					});
				} else if (reqHeaderIds && reqHeaderIds.length > 0 && qtnLength > 1) {
					procurementQuoteCreateContractWizardService.createContract({
						QtnHeaderIds: qtnHeaderIds,
						HasChangeOrder: true,
						ReqHeaderIds: reqHeaderIds,
						Wizards: from,
						AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
							ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
						} : null
					}).then(function (response) {
						afterResponse(response);
					}, function () {
						setError(true, contractTr('createContractFail'), 3);
						$scope.okBtnStatus = false;  // enable ok button
					});
				} else {
					$scope.$close(false);
				}
			}

			function afterResponse(response) {
				// after response, remove the circle loading
				$scope.modalOptions.dialogLoading = false;
				if (response.data) {
					// show a successful message
					setError(true, contractTr('create.contract.successfully'), 1);
					$scope.$close(false);
					if (angular.isArray(response.data) && response.data.length === 0) {
						let msgOptions = {
							headerText: $translate.instant('procurement.pricecomparison.wizard.createContract'),
							bodyText: $translate.instant('procurement.pricecomparison.wizard.create.contract.noDataForContractToCreate'),
							iconClass: 'ico-info'
						};
						return platformModalService.showDialog(msgOptions);
					} else {
						var conModalOptions = {
							resizeable: true,
							headerText: $translate.instant('procurement.pricecomparison.wizard.createContract'),
							itemList: _.isArray(response.data) ? response.data : [response.data],
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/create-contract-success.html'
						};
						platformModalService.showDialog(conModalOptions);
					}
				} else {
					// show error message
					setError(true, contractTr('create.contract.noQuoteRequisition'), 3);
					$scope.okBtnStatus = false; // enable ok button
				}
			}

			function contractTr(term) {
				return $translate.instant('procurement.pricecomparison.wizard.' + term);
			}

			function showOptionDialog() {
				let reqHeaderIds = procurementPriceComparisonOneQuoteContractMainService.getSelectedReqHeaderIds();
				if (reqHeaderIds.length > 1) {
					let modalOptions = {
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/create-contract-wizard-option.html',
						actionButtonText: $translate.instant('cloud.common.ok'),
						closeButtonText: $translate.instant('cloud.common.cancel'),
						okCallback: function () {
							createContract();
						},
						onCancelFun: function () {
							$scope.okBtnStatus = false;
						}
					};
					platformModalService.showDialog(modalOptions);
				} else {
					createContract();
				}
			}
		}
	]);
})(angular);
