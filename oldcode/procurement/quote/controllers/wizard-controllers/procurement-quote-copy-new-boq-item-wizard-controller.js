/**
 * Created by clv on 10/8/2018.
 */
(function (angular) {
	'use strict';
	const moduleName = 'procurement.quote';

	angular.module(moduleName).controller('procurementQuoteCopyNewBoqItemWizardController', copyNewBoqItemWizardController);

	copyNewBoqItemWizardController.$inject = [
		'$scope', 'platformGridAPI',
		'platformTranslateService',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'procurementQuoteCopyNewBoqItemWizardService',
		'_',
		'platformModalService'
	];

	function copyNewBoqItemWizardController(
		$scope,
		platformGridAPI,
		platformTranslateService,
		basicsCommonHeaderColumnCheckboxControllerService,
		quoteCopyNewBoqItemWizardService,
		_,
		platformModalService
	) {
		$scope.gridId = '87c664435ffc4146b8ccfc6dba2616df';
		// grid's columns
		const copyNewBoqItemGridIdColumns = [
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
				id: 'PrcBoqRefNo',
				field: 'PrcBoqRefNo',
				name: 'Procurement Boq Reference.No',
				name$tr$: 'procurement.quote.wizard.copyNewBoqItem.prcBoqReferenceNo',
				formatter: 'code',
				readonly: true,
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
				id: 'BoqLineTypeFk',
				field: 'BoqItem.BoqLineTypeFk',
				// field:'BoqLineTypeFk',
				name: 'BoQ Line Type',
				name$tr$: 'cloud.common.boqLineType',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'BoQLineType',
					displayMember: 'Description'
				},
				readonly: true,
				width: 100
			},
			{
				id: 'Reference',
				field: 'BoqItem.Reference',
				// field:'Reference',
				name: 'Reference No.',
				name$tr$: 'cloud.common.referenceNo',
				formatter: 'description',
				readonly: true,
				width: 110
			},
			{
				id: 'Brief',
				field: 'BoqItem.BriefInfo.Translated',
				// field: 'BriefInfo.Translated',
				name: 'Outline Specification',
				name$tr$: 'cloud.common.entityBriefInfo',
				formatter: 'description',
				readonly: true,
				width: 120
			},
			{
				id: 'UoM',
				field: 'BoqItem.BasUomFk',
				// field: 'BasUomFk',
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
				field: 'BoqItem.Quantity',
				// field: 'Quantity',
				name: 'Quantity',
				name$tr$: 'basics.common.Quantity',
				formatter: 'quantity',
				readonly: true,
				width: 100
			},
			{
				id: 'UnitRate',
				field: 'BoqItem.Price',
				// field:'Price',
				name: 'Unit Rate',
				name$tr$: 'basics.common.entityUnitRate',
				formatter: 'money',
				readonly: true,
				width: 100
			},
			{
				id: 'FinalPrice',
				field: 'BoqItem.Finalprice',
				// field:'Finalprice',
				name: 'Final Price',
				name$tr$: 'basics.common.entityFinalPrice',
				formatter: 'money',
				readonly: true,
				width: 100
			}
		];
		$scope.copyNewBoqItemGridConfig = {
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
					const boqItems = _.map(checkedData, function (item) {
						return item.BoqItem;
					});
					$scope.isLoading = true;
					quoteCopyNewBoqItemWizardService.doCopy($scope.modalOptions.copyOptions, boqItems, callback);
				}
			}

			function callback() {
				const uncheckedData = _.filter(data, {Selected: false});
				platformGridAPI.items.data($scope.gridId, uncheckedData);
				const bodyMessage = 'procurement.quote.wizard.copyNewBoqItem.copySuccessfully';
				const titleMessage = 'procurement.quote.wizard.copyNewBoqItem.copyNewBoqItemTitle';
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
			quoteCopyNewBoqItemWizardService.getData($scope.gridId, $scope.modalOptions.gridDatas);
		}

		function initGrid() {
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				const gridConfig = {
					columns: angular.copy(copyNewBoqItemGridIdColumns),
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
