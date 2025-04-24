(function(angular){
	// eslint-disable-next-line no-redeclare
	/* global angular */

	/** @namespace item.StatusDescriptionInfo */
	'use strict';
	let moduleName = 'procurement.requisition';
	angular.module(moduleName).controller('requisitionWizardCreateChangeOrderContractController', createChangeOrderContractController);
	createChangeOrderContractController.$inject= ['globals','$scope', 'platformGridAPI', 'platformTranslateService', 'basicsCommonHeaderColumnCheckboxControllerService',
		'$translate', 'procurementRequisitionWizardCreateContractService', 'platformStatusIconService', '_','platformDialogService',
	'procurementRequisitionWizardCreateContractFromVariantControlService',
	'ServiceDataProcessDatesExtension'];

	function createChangeOrderContractController(globals,$scope, platformGridAPI, platformTranslateService, basicsCommonHeaderColumnCheckboxControllerService,
		$translate, requisitionWizardCreateContractService, platformStatusIconService, _,platformDialogService,
		variantControlService,
		ServiceDataProcessDatesExtension){

		let gridId = 'c07efe4475e6415da952d41feede72ab';
		$scope.gridId = gridId;
		$scope.itemsCofig = {
			state: gridId
		};
		$scope.initOptions = {
			headerText: 'procurement.requisition.contract.createChangeOrderContract',
			dialogLoading: false
		};
		$scope.OKButtonIsDisabled = okButtonIsDisabled;
		$scope.OK = createChangeOrderContract;
		let reqHeader = $scope.modalOptions?.reqHeader;

		let itemColumns = [
			{
				id: 'Selected',
				field:'Selected',
				name:'Selected',
				name$tr$:'',
				editor: 'boolean',
				formatter: 'boolean',
				headerChkbox: false,
				width: 80,
				validator: checkboxValidator
			},
			{
				id:'Status',
				field: 'ConStatusFk',
				name: 'Status',
				name$tr$: 'cloud.common.entityStatus',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'ConStatus',
					displayMember: 'DescriptionInfo.Translated',
					imageSelector: 'platformStatusIconService'
				},
				readonly: true,
				width: 100
			},
			{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				name$tr$:'cloud.common.entityCode',
				formatter:'code',
				readonly: true,
				width: 80
			},
			{
				id: 'Description',
				field: 'Description',
				name: 'Description',
				name$tr$:'cloud.common.entityDescription',
				formatter:'description',
				readonly:true,
				width: 100
			},
			{
				id: 'BusinessPartnerFk',
				field: 'BusinessPartnerFk',
				name: 'Business Partner',
				width: 100,
				name$tr$: 'basics.common.BusinessPartner',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'BusinessPartner',
					displayMember: 'BusinessPartnerName1'
				}
			},
			{
				id: 'ProjectFk',
				field: 'ProjectFk',
				name: 'Project Code',
				name$tr$: 'cloud.common.entityProjectNo',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'project',
					displayMember: 'ProjectNo'
				},
				width: 100
			},
			{
				id: 'ProjectDescription',
				field: 'ProjectFk',
				name: 'Project Description',
				name$tr$: 'procurement.common.projectDescription',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'project',
					displayMember: 'ProjectName'
				},
				width: 100
			},
			{
				id: 'PackageCode',
				field: 'PrcPackageFk',
				name: 'Package Code',
				name$tr$: 'procurement.common.prcItemPackageCode',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'PrcPackage',
					displayMember: 'Code'
				},
				width: 100
			},
			{
				id: 'PackageDescription',
				field: 'PrcPackageFk',
				name: 'Package Description',
				name$tr$: 'procurement.common.prcItemPackageDescription',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'PrcPackage',
					displayMember: 'Description'
				},
				width: 120
			},
			{
				id: 'Package2HeaderFk',
				field: 'PrcPackage2HeaderFk',
				name: 'Sub Package',
				name$tr$: 'procurement.common.boq.entityPackage2Header',
				formatter: 'lookup',
				formatterOptions:{
					lookupType: 'prcpackage2header',
					displayMember: 'Description'
				},
				width: 100
			},
			{
				id: 'PrcStructureCode',
				field: 'PrcStructureFk',
				name: 'Structure Code',
				name$tr$: 'cloud.common.entityStructureCode',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'PrcStructure',
					displayMember: 'Code'
				},
				width: 100
			},
			{
				id: 'PrcStructureDescription',
				field: 'PrcStructureFk',
				name: 'Structure Description',
				name$tr$: 'cloud.common.entityStructureDescription',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'PrcStructure',
					displayMember: 'DescriptionInfo.Translated'
				},
				width: 100
			},
			{
				id: 'DateOrdered',
				field: 'DateOrdered',
				name: 'Date Ordered',
				name$tr$: 'procurement.common.dateOrdered',
				formatter: 'dateutc',
				readonly: true,
				width: 100
			}
		];

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.grids.unregister(gridId);
			}
		});

		init();

		function init(){

			let items = $scope.modalOptions?.items || [];
			let dateProcessor = new ServiceDataProcessDatesExtension(['DateOrdered']);
			items.forEach(e => {
				dateProcessor.processItem(e);
			});
			// noinspection JSCheckFunctionSignatures
			if(! platformGridAPI.grids.exist(gridId)){
				let gridConfig = {
					columns: angular.copy(itemColumns),
					data: items,
					id: gridId,
					lazyInit: true,
					options:{
						tree: false,
						IdProperty: 'Id',
						indicator: true
					}
				};

				platformGridAPI.grids.config(gridConfig);
				platformTranslateService.translateGridConfig(gridConfig.columns);
				basicsCommonHeaderColumnCheckboxControllerService.setGridId(gridConfig.id);
			}

			variantControlService.initVariantControl({
				variantGridId: 'fcba84a4ef204bafb700c39e486a4a09',
				scope: $scope,
				reqHeader: reqHeader,
			});
			$scope.initOptions.dialogLoading = true;
			$scope.getVariants().finally(function () {
				$scope.initOptions.dialogLoading = false;
			});
		}

		function createChangeOrderContract(){

			let items = platformGridAPI.items.data(gridId);
			let selectedItem = _.find(items, {Selected: true});
			$scope.initOptions.dialogLoading = true;
			let variants = $scope.getSelectedVariants();
			let variantIds = null;
			if (variants && variants.length > 0) {
				variantIds = _.map(variants, 'Id');
			}
			requisitionWizardCreateContractService.createChangeOrderContract(selectedItem, variantIds).then(function(result){
				$scope.initOptions.dialogLoading = false;
				$scope.$close(false);

				platformDialogService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.requisition/partials/create-contract-wizard-dialog.html',
					width: '600px',
					resizeable: true,
					newId: result.data.Id,
					newCode:result.data.Code
				});
			});
		}

		function checkboxValidator(entity, value, model) {
			// if it is true, it should set ohter's to be false. There is only one can be checked.
			if (value) {
				let items = platformGridAPI.items.data(gridId) || [];
				_.forEach(items, function (item) {
					if (item.Id !== entity.Id && item[model]) {
						item[model] = false;
					}
				});
			}
			platformGridAPI.grids.invalidate(gridId);
			return {apply: true, valid: true, error: ''};

		}

		function okButtonIsDisabled(){

			let items = platformGridAPI.items.data(gridId) || [];
			let selectedItem = _.find(items, {Selected: true});

			let isVariantCaseValid = true;
			if ($scope.variantOptions.isCreateFromVariants) {
				isVariantCaseValid = $scope.hasSelectedVariants();
			}
			return !selectedItem || !isVariantCaseValid;


		}
	}
})(angular);