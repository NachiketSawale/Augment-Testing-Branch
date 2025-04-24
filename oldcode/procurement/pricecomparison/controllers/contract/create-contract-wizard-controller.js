(function (angualar) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonCreateContractWizardController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for wizard 'create contract' dialog in pricecomparison.
	 */
	angualar.module(moduleName).controller('procurementPriceComparisonCreateContractWizardController', [
		'$scope',
		'$translate',
		'$http',
		'$state',
		'$timeout',
		'cloudDesktopSidebarService',
		'procurementPriceComparisonCreateContractWizardGridService',
		'procurementQuoteCreateContractWizardService',
		'procurementPriceComparisonMainService',
		'platformModalService',
		'procurementPriceComparisonOneQuoteContractMainService',
		'procurementPriceComparisonCommonService',
		function ($scope,
			$translate,
			$http,
			$state,
			$timeout,
			cloudDesktopSidebarService,
			createContractWizardGridService,
			procurementQuoteCreateContractWizardService,
			mainService,
			platformModalService,
			procurementPriceComparisonOneQuoteContractMainService,
			procurementPriceComparisonCommonService) {

			var translatePrefix = 'procurement.pricecomparison.wizard';
			var createContractTypeValue = {
				createContracts: 'createContracts',
				createOneContract: 'createOneContract'
			};
			// to store contracts of selected quote.
			var contracts = [];
			var formOptions = {
				fid: 'procurement.pricecomparison.create.contract.wizard',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'create.contract.wizard',
						header: $translate.instant(translatePrefix + '.quoteGrid.choose.quote'),
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
						gid: 'create.contract.wizard',
						label: '',
						rid: '1',
						type: 'directive',
						directive: 'procurement-price-comparison-create-contract-wizard-grid-directive'
					},
					{
						gid: 'create.one.quote.requisition',
						label: '',
						rid: '2',
						type: 'directive',
						directive: 'procurement-price-comparison-one-quote-contract-requisition',
						options: {
							dataSource: 'wizard'
						}
					}
				]
			};

			// the form view
			$scope.containerOptions = {
				formOptions: {
					configure: formOptions
				}
			};

			$scope.createContractType = createContractTypeValue.createContracts;

			$scope.hasChangeOrder = function () {
				return mainService.isCurrentSelectedIncludingChangeOrder();
			};

			$scope.isFilterEvaluated = $scope.modalOptions.isFilterEvaluated || 2;
			$scope.priceRadioChg = function (isPrice) {
				$scope.isFilterEvaluated = isPrice;
			};
			$scope.modalOptions = {
				headerText: $translate.instant(translatePrefix + '.createContract'),
				btnOkText: $translate.instant('procurement.common.createBtn'),
				btnCancelText: $translate.instant('cloud.common.cancel'),
				isBtnOkDisabled: true,
				dialogLoading: false,
				loadingInfo: '',
				ok: function () {
					if (checkContracts() > 0) {
						showContracts();
					} else {
						if (checkSelectRequisions() > 0) {
							showOptionDialog();
						} else {
							onOK();
						}
					}
				},
				close: function () {
					createContractWizardGridService.resetRequisitionGrid();
					$scope.$close(false);
				},
				cancel: function () {
					createContractWizardGridService.resetRequisitionGrid();
					$scope.$close(false);
				}
			};

			createContractWizardGridService.registerSelectionChanged(onCurrentItemChanged);

			var unwatch1 = $scope.$watch(createContractWizardGridService.getSelectedReqHeaderIdsCount, function (newValue) {
				$scope.okBtnStatus = newValue <= 0;
			});

			$scope.$on('$destroy', function () {
				createContractWizardGridService.unregisterSelectionChanged(onCurrentItemChanged);
				if (unwatch1) {
					unwatch1();
				}
			});

			function onCurrentItemChanged(arg1, entity) {
				$scope.modalOptions.isBtnOkDisabled = false;
				hideInfo();
				// it's a tree, but we can get all flatted items using 'getList()'
				var qtnHeaderId = entity.QuoteHeaderId;
				$http.post(globals.webApiBaseUrl + 'procurement/quote/header/cancreatecontract', {Value: qtnHeaderId}).then(function (response) {
					contracts = response.data.contracts || [];
				});
				createContractWizardGridService.getSelectedReqHeaderIds([]);
				createContractWizardGridService.setSelectedQuote(entity);
				createContractWizardGridService.clearSelectedReqHeaderId2ReqVariantIdsMap();
				createContractWizardGridService.registerOnSelectedQuoteChanged.fire(entity);
			}

			function showContracts() {
				let selectedItems = _.filter(createContractWizardGridService.getList(), {IsChecked: true});
				let isIdealBidder = selectedItems[0].IsIdealBidder;
				let qtnHeaderIds = _.map(selectedItems, 'QuoteHeaderId') || [];
				let request = {
					MainItemIds: qtnHeaderIds,
					ModuleName: 'procurement.quote'
				};
				$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/hascontracteddata', request)
					.then(function (response) {
						let hasContractItem = response ? response.data : false;
						// add a view to show contracts.
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/prc-common-show-contract-view.html',
							width: '800px',
							resizeable: true,
							headerText: $translate.instant(translatePrefix + '.createContract'),
							contracts: contracts,
							OKButtonText: $translate.instant('procurement.common.createBtn'),
							okCallback: function () {
								showOptionDialog();
							},
							bodyText: isIdealBidder ? $translate.instant('procurement.common.createdContracts4IdealQtn') : $translate.instant('procurement.common.hasContractWhetherStillCreate'),
							hasContractItem: hasContractItem,
							isHideThisDialog: true,
							isFilterEvaluated: 2,
						});
					});
			}

			function showOptionDialog() {
				if (checkSelectRequisions() > 1) {
					let modalOptions = {
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/create-contract-wizard-option.html',
						actionButtonText: $translate.instant('cloud.common.ok'),
						closeButtonText: $translate.instant('cloud.common.cancel'),
						okCallback: function () {
							onOK();
						}
					};

					platformModalService.showDialog(modalOptions);
				} else {
					onOK();
				}
			}

			function checkContracts() {
				return contracts ? contracts.length : 0;
			}

			function checkSelectRequisions() {
				let reqHeaderIds = createContractWizardGridService.getSelectedReqHeaderIds();
				return reqHeaderIds ? reqHeaderIds.length : 0;
			}

			function onOK() {
				var selectedItems = _.filter(createContractWizardGridService.getList(), {IsChecked: true});
				$scope.modalOptions.isBtnOkDisabled = true;
				// it's a tree, but we can get all flatted items using 'getList()'
				var qtnHeaderIds = _.map(selectedItems, 'QuoteHeaderId') || [];
				createContract();

				function createContract() {
					// (1) Only create contract for the quote.
					if (qtnHeaderIds.length === 1) {
						// (1.1) create a contract for each quote's requisitions.
						let webApiPostfix = 'createcontractsfromquote';
						if (procurementPriceComparisonCommonService.getWizardContractType() === createContractTypeValue.createOneContract) {
							// (1.2) create one contract (merge many quote requisitions to one contract)
							webApiPostfix = 'createmergecontractfromquote';
						}
						let reqHeaderIds = createContractWizardGridService.getSelectedReqHeaderIds();
						let reqHeaderId2ReqVariantIdsMap = createContractWizardGridService.getSelectedReqHeaderId2ReqVariantIdsMap();

						$scope.modalOptions.dialogLoading = true;
						$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/' + webApiPostfix, {
							QtnHeaderId: qtnHeaderIds[0],
							ReqHeaderIds: reqHeaderIds,
							Wizards: 23,
							IsFilterEvaluated: $scope.isFilterEvaluated,
							AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
								ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
							} : null
						}).then(function (response) {
							if (response.data) {
								showInfo($translate.instant(translatePrefix + '.create.contract.successfully'), 0);
								$scope.modalOptions.dialogLoading = false;
								$scope.$close(false);
								goToContract(response.data);
							} else {
								showInfo($translate.instant(translatePrefix + '.create.contract.noQuoteRequisition'), 3);
								$scope.modalOptions.isBtnOkDisabled = false;
								$scope.modalOptions.dialogLoading = false;
							}
						}, function () {
							showInfo($translate.instant(translatePrefix + '.createContractFail'), 3);
							$scope.modalOptions.isBtnOkDisabled = false;
							$scope.modalOptions.dialogLoading = false;
						});
					}

					// (2) Create a contract for Base quote and it's change order quotes. Need to compare and merge the same PrcItems or BoqItems.
					if (qtnHeaderIds.length > 1) {
						$scope.modalOptions.dialogLoading = true;
						let reqHeaderIds = createContractWizardGridService.getSelectedReqHeaderIds();
						let reqHeaderId2ReqVariantIdsMap = createContractWizardGridService.getSelectedReqHeaderId2ReqVariantIdsMap();
						procurementQuoteCreateContractWizardService.createContract({
							QtnHeaderIds: qtnHeaderIds,
							HasChangeOrder: true,
							ReqHeaderIds: reqHeaderIds,
							AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
								ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
							} : null
						}).then(function (response) {
							showInfo($translate.instant(translatePrefix + '.create.contract.successfully'), 0);
							$scope.modalOptions.dialogLoading = false;

							$scope.modalOptions.close();
							goToContract(response.data);
						}, function () {
							$scope.modalOptions.isBtnOkDisabled = false;
							$scope.modalOptions.dialogLoading = false;
						});
					}
				}
			}

			function goToContract(data) {
				if (angular.isArray(data) && data.length === 0) {
					let msgOptions = {
						headerText: $translate.instant(translatePrefix + '.createContract'),
						bodyText: $translate.instant(translatePrefix + '.create.contract.noDataForContractToCreate'),
						iconClass: 'ico-info'
					};
					return platformModalService.showDialog(msgOptions);
				} else {
					var conModalOptions = {
						resizeable: true,
						headerText: $translate.instant(translatePrefix + '.createContract'),
						itemList: _.isArray(data) ? data : [data],
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/create-contract-success.html'
					};
					platformModalService.showDialog(conModalOptions);
				}
			}

			/**
			 * @ngdoc function
			 * @param {string} message
			 * @param {number} type (0: success; 1: info; 2: warning; 3: error)
			 */
			function showInfo(message, type) {
				$scope.error = {
					show: true,
					messageCol: 1,
					message: message,
					type: type
				};
			}

			function hideInfo() {
				$scope.error = {
					show: false,
					messageCol: 1,
					message: '',
					type: 0
				};
			}

			function contractTr(term) {
				return $translate.instant('procurement.pricecomparison.wizard.' + term);
			}
		}
	]);
})(angular);
