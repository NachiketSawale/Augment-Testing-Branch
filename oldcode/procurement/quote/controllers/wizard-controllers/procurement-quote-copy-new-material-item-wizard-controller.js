/**
 * Created by clv on 12/3/2018.
 */

(function (angular) {

	'use strict';
	const moduleName = 'procurement.quote';
	angular.module(moduleName).controller('procurementQuoteCopyNewMaterialItemWizardController', copyNewMaterialItemWizardController);

	copyNewMaterialItemWizardController.$inject = [
		'$scope',
		'platformGridAPI',
		'platformTranslateService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'_',
		'platformModalService',
		'procurementQuoteCopyMaterialNewItemWizardService'
	];

	function copyNewMaterialItemWizardController(
		$scope,
		platformGridAPI,
		platformTranslateService,
		basicsCommonHeaderColumnCheckboxControllerService,
		_,
		platformModalService,
		procurementQuoteCopyMaterialNewItemWizardService
	) {
		$scope.gridId = 'f6e9af4a26904d2fb846e335c1beb6c1';
		// grid's columns
		const copyNewMaterialItemGridIdColumns = [
			{
				id: 'Selected',
				field: 'Selected',
				name: 'Selected',
				name$tr$: 'cloud.common.entitySelected',
				editor: 'boolean',
				formatter: 'boolean',
				headerChkbox: true,
				width: 100
			},
			{
				id: 'ReqCode',
				field: 'ReqCode',
				name: 'ReqHeader Code',
				name$tr$: 'procurement.quote.wizard.copyNewBoqItem.reqHeaderCode',
				formatter: 'code',
				readonly: true,
				width: 100
			},
			{
				id: 'ItemMaterialNo',
				field: 'PrcItem.MdcMaterialFk',
				name: 'Material No.',
				name$tr$: 'procurement.common.prcItemMaterialNo',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'MaterialCommodity',
					displayMember: 'Code'
				},
				readonly: true,
				width: 100
			},
			{
				id: 'ItemNo',
				field: 'PrcItem.Itemno',
				name: 'Item No.',
				name$tr$: 'procurement.common.prcItemItemNo',
				formatter: 'code',
				readonly: true,
				width: 110
			},
			{
				id: 'Description1',
				field: 'PrcItem.Description1',
				name: 'Description 1',
				name$tr$: 'procurement.common.prcItemDescription1',
				formatter: 'description',
				readonly: true,
				width: 120
			},
			{
				id: 'UoM',
				field: 'PrcItem.BasUomFk',
				name: 'UoM',
				name$tr$: 'cloud.common.entityUoM',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'UoM',
					displayMember: 'Unit'
				},
				readonly: true,
				width: 100
			},
			{
				id: 'Quantity',
				field: 'PrcItem.Quantity',
				name: 'Quantity',
				name$tr$: 'basics.common.Quantity',
				formatter: 'quantity',
				readonly: true,
				width: 100
			},
			{
				id: 'Price',
				field: 'PrcItem.Price',
				name: 'Price',
				name$tr$: 'cloud.common.entityPrice',
				formatter: 'money',
				readonly: true,
				width: 100
			},
			{
				id: 'TotalPrice',
				field: 'PrcItem.TotalPrice',
				name: 'Total Price',
				name$tr$: 'procurement.common.prcItemTotalPrice',
				formatter: 'money',
				readonly: true,
				width: 100
			},
			{
				id: 'Total',
				field: 'PrcItem.Total',
				name: 'Total',
				name$tr$: 'cloud.common.entityTotal',
				formatter: 'money',
				readonly: true,
				width: 100
			}
		];

		// $scope.titleText = $translate.instant('basics.material.updatePriceWizard.updateMaterialPricesTitle');
		$scope.copyNewMaterialItemGridConfig = {
			state: $scope.gridId
		};

		$scope.isLoading = false;

		$scope.canCopy = function () {
			const data = platformGridAPI.items.data($scope.gridId);
			return !!(data && _.find(data, {Selected: true}));
		};

		$scope.copy = function () {
			const data = platformGridAPI.items.data($scope.gridId);
			if (data && data.length > 0) {
				const checkedData = _.filter(data, {Selected: true});
				if (checkedData && checkedData.length > 0) {
					$scope.isLoading = true;
					procurementQuoteCopyMaterialNewItemWizardService.doCopy($scope.modalOptions.copyOptions, checkedData, callback);
				}
			}

			function callback() {
				const uncheckedData = _.filter(data, {Selected: false});
				platformGridAPI.items.data($scope.gridId, uncheckedData);
				const bodyMessage = 'procurement.quote.wizard.copyNewBoqItem.copySuccessfully';
				const titleMessage = 'procurement.quote.wizard.copyNewMaterialItem.title';
				platformModalService.showMsgBox(bodyMessage, titleMessage, 'info').then(function () {
					$scope.$close({
						copied: true
					});
				});
				$scope.isLoading = false;
			}
		};

		$scope.onCancel = function () {
			$scope.$close();
		};

		initGrid();
		initData();

		function initData() {
			procurementQuoteCopyMaterialNewItemWizardService.getData($scope.gridId, $scope.modalOptions.gridDatas);
		}

		function initGrid() {
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				const gridConfig = {
					columns: angular.copy(copyNewMaterialItemGridIdColumns),
					data: [],
					id: $scope.gridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id'
					}
				};
				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);
			}

			const headerCheckBoxFields = ['Selected'];
			const headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: function (e) {
						const isSelected = (e.target.checked);
						if (isSelected) {
							$scope.canNextStep = true;
						}
					}
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
		}
	}
})(angular);
