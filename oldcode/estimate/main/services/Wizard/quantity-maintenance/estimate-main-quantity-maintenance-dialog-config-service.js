/**
 * Created by joshi on 30.03.2017.
 */

(function () {

	'use strict';

	let modulename = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainQuantityMaintenanceDialogConfigService
     * @description configuration to show dialog for Quantity types on selected level.
     */
	angular.module(modulename).service('estimateMainQuantityMaintenanceDialogConfigService', ['basicsLookupdataConfigGenerator', '$translate', 'estimateMainScopeSelectionService',
		function (basicsLookupdataConfigGenerator, $translate, estimateMainScopeSelectionService) {
			let service = {
				getFormConfig: getFormConfig,
			};

			function getFormConfig() {
				let formConfig = {
					fid: 'estimate.main.replaceResourceWizard.replaceform',
					version: '1.0.0',
					showGrouping: true,
					change: 'change',
					overloads: {},
					skipPermissionCheck: true,
					groups: [
						{
							gid: 'qtyAssignLevel',
							header: 'Assigned Level',
							header$tr$: 'estimate.main.quantityLevelDialogHeader',
							isOpen: true,
							visible: true,
							sortOrder: 1,
							attributes: [
								'estimateScope'
							]
						},
						{
							gid: 'quantityValues',
							header: 'Area',
							header$tr$: 'estimate.main.quantityDialogHeader',
							isOpen: true,
							visible: true,
							sortOrder: 2
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.quantitytype', 'Code',
							{
								gid: 'quantityValues',
								rid: 'qtyType',
								model: 'sourceQuantityTypeId',
								sortOrder: 1,
								label: 'Source Quantity Type',
								label$tr$: 'estimate.main.sourceQuantityType',
								type: 'integer'
							}),
						{
							gid: 'quantityValues', rid: 'factor', label: 'x Factor', label$tr$: 'estimate.main.xFactor',
							type: 'factor', model: 'factor', disabled: false, visible: true, sortOrder: 2
						},
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.quantitytype', 'Code',
							{
								gid: 'quantityValues',
								rid: 'userQtyType',
								model: 'targetQuantityTypeId',
								label: '= Target Quantity Type',
								label$tr$: 'estimate.main.dialogTargetQuantityType',
								type: 'integer',
								visible: true,
								sortOrder: 3
							}),
						{
							gid: 'quantityValues', rid: 'date', label: 'Date', label$tr$: 'estimate.main.date',
							type: 'date', model: 'date', disabled: false, visible: true, sortOrder: 4
						}
					]
				};

				let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
				if (selectlineItemscopeRow) {
					selectlineItemscopeRow.gid = 'qtyAssignLevel';
					selectlineItemscopeRow.sortOrder = 1;
				}
				formConfig.rows.push(selectlineItemscopeRow);

				let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
				if (resultSetScopeRow) {
					resultSetScopeRow.gid = 'qtyAssignLevel';
					resultSetScopeRow.sortOrder = 1;
				}
				formConfig.rows.push(resultSetScopeRow);

				let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

				if (allEstimateScopeRow) {
					allEstimateScopeRow.gid = 'qtyAssignLevel';
					allEstimateScopeRow.sortOrder = 1;
				}
				formConfig.rows.push(allEstimateScopeRow);

				return formConfig;
			}

			return service;
		}
	]);

})();
