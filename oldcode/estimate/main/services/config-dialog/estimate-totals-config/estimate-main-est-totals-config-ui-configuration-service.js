/**
 * Created by lnt on 8/3/2016.
 */
(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainEstTotalsConfigUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Totals Config UI for dialog.
	 */
	angular.module(moduleName).factory('estimateMainEstTotalsConfigUIConfigurationService', [
		function () {
			let service = {};

			let formConfig = {
				groups: [
					{
						gid: 'tolConfig',
						header: 'Totals Config',
						header$tr$: 'estimate.main.totalsConfigurationDialogTitle',
						isOpen: true,
						visible: true,
						sortOrder: 3
					}
				],
				rows: [
					{
						gid: 'tolConfig',
						rid: 'estTolConfigType',
						label: 'Totals Config Type',
						label$tr$: 'estimate.main.estTolConfigType',
						type: 'directive',
						directive : 'estimate-main-totals-config-type',
						model: 'estTolConfigTypeFk',
						options: {
							serviceName: 'estimateMainTotalsConfigTypeService',
							displayMember: 'Description',
							valueMember: 'Id',
							watchItems: true,
							showClearButton: true
						},
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'tolConfig',
						rid: 'editTolConfigType',
						label: 'Edit Type',
						label$tr$: 'estimate.main.editEstTolConfigType',
						type: 'boolean',
						model: 'isEditTolConfigType',
						checked: false,
						disabled: false,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'tolConfig',
						rid: 'estTotalsConfigDesc',
						label: 'Description',
						label$tr$: 'cloud.common.entityDescription',
						type: 'description',
						model: 'estTotalsConfigDesc',
						readonly: false,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'tolConfig',
						rid: 'estTolConfigActiveUnitRateStrQty',
						label: 'Active Unit Rate/Str.Qty',
						label$tr$: 'basics.customize.activeUnitRateStrQty',
						type: 'boolean',
						model: 'ActivateLeadingStr',
						checked: false,
						disabled: false,
						visible: true,
						sortOrder: 4
					},
					{
						gid: 'tolConfig',
						rid: 'estTolConfigStrType',
						label: 'Structure Type',
						label$tr$: 'basics.customize.structuretype',
						type: 'directive',
						directive : 'estimate-main-totals-config-structure-type',
						model: 'LeadingStr',
						options: {
							serviceName: 'estimateMainTotalsConfigStructureTypeService',
							displayMember: 'Description',
							valueMember: 'Id',
							watchItems: true
						},
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 5
					},

					{
						gid: 'tolConfig',
						rid: 'estTolConfigStrTypeProjectCostGroup',
						label: 'Project CostGroup',
						label$tr$: 'basics.customize.projectcostgroup',
						type: 'directive',
						directive : 'estimate-main-totals-config-structure-type-project-cost-group',
						model: 'LeadingStrPrjCostgroup',
						options: {
							serviceName: 'estimateMainTotalsConfigStructureTypeServiceCostGroup',
							displayMember: 'Description',
							valueMember: 'Id',
							watchItems: true
						},
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 6
					},
					{
						gid: 'tolConfig',
						rid: 'estTolConfigStrTypeEnterpriseCostGroup',
						label: 'Enterprise CostGroup',
						label$tr$: 'basics.customize.enterprisecostgroup',
						type: 'directive',
						directive : 'estimate-main-totals-config-structure-type-enterprise-cost-group',
						model: 'LeadingStrEntCostgroup',
						options: {
							serviceName: 'estimateMainTotalsConfigStructureTypeServiceCostGroup',
							displayMember: 'Description',
							valueMember: 'Id',
							watchItems: true
						},
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 7
					},


					{
						gid: 'tolConfig',
						label: 'Totals Configure Details',
						label$tr$: 'estimate.main.totalsConfigurationDialogForm.totalsConfigureDetails',
						rid: 'estTotalsConfigDetail',
						type: 'directive',
						model: 'EstTotalsConfigDetails',
						directive: 'estimate-main-totals-config-detail-grid',
						sortOrder: 7
					},
					{
						gid: 'tolConfig',
						label: 'Cost Code Assignment Details',
						label$tr$: 'estimate.main.totalsConfigurationDialogForm.costCodeAssignmentDetials',
						rid: 'costCodeAssignmentDetail',
						type: 'directive',
						model: 'costCodeAssignmentDetails',
						directive: 'estimate-main-cost-code-assignment-detail-grid',
						sortOrder: 8
					}
				],
				overloads: {}
			};

			service.getFormConfig = function (customizeOnly, isAssemblies) {
				let deepCopiedFormConfiguration = angular.copy(formConfig);
				if (customizeOnly) {
					// Remove the first row that holds the checkbox to make the structure a specific one different form estimate.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editTolConfigType';
					});

					// Change project cost group to text box in customize module
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'estTolConfigStrTypeProjectCostGroup';
					});
					deepCopiedFormConfiguration.rows.push({
						gid: 'tolConfig',
						rid: 'estTolConfigStrTypeProjectCostGroup',
						label: 'Project CostGroup',
						label$tr$: 'basics.customize.projectcostgroup',
						type: 'description',
						model: 'LeadingStrPrjCostGroup',
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 6
					});

				}

				if(isAssemblies){
					_.remove(deepCopiedFormConfiguration.rows, function(row){
						// Remove this two columns as assemblies do not have leading structure.
						return ['estTolConfigActiveUnitRateStrQty', 'estTolConfigStrType', 'estTolConfigStrTypeProjectCostGroup', 'estTolConfigStrTypeEnterpriseCostGroup'].indexOf(row.rid) > -1;
					});
				}

				return deepCopiedFormConfiguration;
			};

			return service;

		}
	]);

})(angular);
