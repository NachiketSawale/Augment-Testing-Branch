/**
 * Created by zwz on 12/27/2024.
 */
// remark: implementation of ppsBillingDataOfProductAndMaterialSelectionWizardDialogFormService is based on copy from transportplanningTransportGoodsTabService
(function (angular) {
	'use strict';
	/* global globals, _ */

	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsBillingDataOfProductAndMaterialSelectionWizardDialogFormService', Service);

	Service.$inject = ['$http', 'platformTranslateService'
	];

	function Service($http, platformTranslateService) {

		const service = {};

		service.getFormOptions = function (scope) {
			const formConfig = {
				fid: 'pps.billing.data.dialog.form',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'projectId',
						model: 'projectId',
						sortOrder: 1,
						label$tr$: 'cloud.common.entityProject',
						label: 'Project',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							displayMember: 'Code',
							descriptionMember: 'ProjectName',
						},
						readonly: true,
					},
					{
						gid: 'baseGroup',
						rid: 'ordHeaderId',
						model: 'ordHeaderId',
						sortOrder: 2,
						label: 'Contract',
						label$tr$: 'productionplanning.common.ordHeaderFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-contract-dialog-v2',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'sales-contract-main-contract-filter-by-server',
								showClearButton: true
							}
						},
						readonly: true,
					},
					{
						gid: 'baseGroup',
						rid: 'ppsHeaderId',
						model: 'ppsHeaderId',
						sortOrder: 3,
						label: '*Production planning',
						label$tr$: 'productionplanning.header.entityHeader',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						readonly: true,
						options: {
							lookupDirective: 'productionplanning-Header-Dialog-Lookup',
							descriptionMember: 'DescriptionInfo.Translated',
						},
					},
					{
						gid: 'baseGroup',
						rid: 'jobIds',
						model: 'jobIds',
						sortOrder: 4,
						label: '*Job',
						label$tr$: 'logistic.job.entityJob',
						// readonly: true,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								multipleSelection: true,
								showClearButton: true
							}
						}
					},
				]
			};
			return {
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
		};

		return service;
	}
})(angular);