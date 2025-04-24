/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostBudgetUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Cost Budget Config UI for dialog.
	 */
	angular.module(moduleName).factory('estimateMainCostBudgetUIConfigService', [
		function () {
			let service = {};

			let formConfig = {
				groups: [
					{
						gid: 'costBudgetConfig',
						header: 'Cost Budget Config',
						header$tr$: 'estimate.main.costBudgetConfigDialogTitle',
						isOpen: true,
						visible: true,
						sortOrder: 5
					}
				],
				rows: [
					{
						gid: 'costBudgetConfig',
						rid: 'costBudgetConfigType',
						label: 'Cost Budget Config Type',
						label$tr$: 'estimate.main.costBudgetConfigType',
						type: 'directive',
						directive : 'estimate-main-cost-budget-config-type',
						model: 'costBudgetConfigTypeFk',
						options: {
							serviceName: 'estimateMainCostBudgetConfigTypeService',
							displayMember: 'Description',
							valueMember: 'Id',
							watchItems: true
						},
						readonly: false,
						disabled: false,
						visible: true,
						sortOrder: 1
					},
					{
						gid: 'costBudgetConfig',
						rid: 'editCostBudgetConfigType',
						label: 'Edit Type',
						label$tr$: 'estimate.main.editCostBudgetConfigType',
						type: 'boolean',
						model: 'isEditCostBudgetConfigType',
						checked: false,
						disabled: false,
						visible: true,
						sortOrder: 2
					},
					{
						gid: 'costBudgetConfig',
						rid: 'costBudgetConfigDesc',
						label: 'Description',
						label$tr$: 'estimate.main.totalsConfigurationDialogForm.Description',
						type: 'description',
						model: 'costBudgetConfigDesc',
						readonly: false,
						visible: true,
						sortOrder: 3
					},
					{
						gid: 'costBudgetConfig',
						rid: 'costBudgetConfigFactor',
						label: 'Factor',
						label$tr$: 'estimate.main.xFactor',
						type: 'decimal',
						model: 'costBudgetConfigFactor',
						readonly: false,
						visible: true,
						sortOrder: 4
					},
					{
						gid: 'costBudgetConfig',
						label: 'Cost Budget Assignment Details',
						label$tr$: 'estimate.main.costBudgetAssignDetials',
						rid: 'costBudgetAssignDetail',
						type: 'directive',
						model: 'costBudgetAssignDetails',
						directive: 'estimate-main-cost-budget-assign-detail-grid',
						sortOrder: 5
					}
				],
				overloads: {}
			};

			service.getFormConfig = function (customizeOnly) {
				let deepCopiedFormConfiguration =  angular.copy(formConfig);
				if(customizeOnly) {
					// Remove the first row that holds the checkbox to make the cost budget a specific one different form estimate.
					_.remove(deepCopiedFormConfiguration.rows, function (row) {
						return row.rid === 'editCostBudgetConfigType';
					});
				}
				return deepCopiedFormConfiguration;
			};
			return service;
		}
	]);

})(angular);
