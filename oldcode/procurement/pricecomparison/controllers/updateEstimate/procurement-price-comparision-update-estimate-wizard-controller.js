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
	angualar.module(moduleName).controller('procurementPriceComparisonUpdateEstimateWizardController', [
		'$scope', '$translate', '$http', '$state', '$timeout', 'cloudDesktopSidebarService',
		'procurementPriceComparisonCreateContractWizardGridService', '$injector', 'platformModalService',
		function ($scope, $translate, $http, $state, $timeout, cloudDesktopSidebarService,
			createContractWizardGridService, $injector, platformModalService) {

			var translatePrefix = 'procurement.pricecomparison.updateEstimateWizard';
			var createContractTypeValue = {
				createContracts: 'createContracts',
				createOneContract: 'createOneContract'
			};

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
					}
				],
				rows: [
					{
						gid: 'create.contract.wizard',
						label: '',
						rid: '1',
						type: 'directive',
						directive: 'procurement-price-comparison-create-contract-wizard-grid-directive'
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

			$scope.modalOptions = {
				headerText: $translate.instant(translatePrefix + '.updateEstimate'),
				btnOkText: $translate.instant('cloud.common.ok'),
				btnCancelText: $translate.instant('cloud.common.cancel'),

				isBtnOkDisabled: true,
				dialogLoading: false,
				loadingInfo: '',

				ok: onOK,
				close: function () {
					$scope.$close(false);
				},
				cancel: function () {
					$scope.$close(false);
				}
			};

			createContractWizardGridService.registerSelectionChanged(onCurrentItemChanged);

			$scope.$on('$destroy', function () {
				createContractWizardGridService.unregisterSelectionChanged(onCurrentItemChanged);
			});

			function onCurrentItemChanged() {
				$scope.modalOptions.isBtnOkDisabled = false;
				hideInfo();
			}

			function onOK() {
				$scope.modalOptions.isBtnOkDisabled = true;

				// it's a tree, but we can get all flatted items using 'getList()'
				let filterData = _.filter(createContractWizardGridService.getList(), {IsChecked: true});
				var qtnHeaderIds = _.map(filterData, 'QuoteHeaderId') || [];

				let requestData = {
					headerId: 0,
					sourceType: 'pricecomparison',
					qtnHeaderIds:qtnHeaderIds
				};

				var modalOptions = {
					backdrop: false,
					controller: 'proPriceComparisonUpdateEstimateWizardController',
					templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-dialog.html',
					resizeable: true,
					qtnHeaderIds: qtnHeaderIds,
					width: '700px'
				};

				$injector.get('proComparisonWizardUpdateEstimateService').setQtnHeaderIds(qtnHeaderIds);
				$injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').setProcurementMainData(0, qtnHeaderIds, 'pricecomparison');

				$http.post(globals.webApiBaseUrl + 'procurement/common/option/getIsHasPrcItemAndPrcBoq', requestData)
					.then(function (response) {
						let prcCommonUpdateEstimateService = $injector.get('prcCommonUpdateEstimateService');
						prcCommonUpdateEstimateService.setIsHasPrcItem(response.data.isHasPrcItem);
						prcCommonUpdateEstimateService.setIsHasPrcBoq(response.data.isHasPrcBoq);
						platformModalService.showDialog(modalOptions);

					});
				$scope.$close(false);
			}

			function hideInfo() {
				$scope.error = {
					show: false,
					messageCol: 1,
					message: '',
					type: 0
				};
			}

		}
	]);
})(angular);
