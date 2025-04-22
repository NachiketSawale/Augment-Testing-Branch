/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesWipCreateWizardDialogUIService
	 * @function
	 *
	 * @description
	 * Service for the wizard creation dialog
	 **/

	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipCreateWizardDialogUIService', [
		'platformTranslateService', 'basicsLookupdataConfigGenerator',
		function (platformTranslateService, basicsLookupdataConfigGenerator) {

			return {
				getCreateBillFormConfiguration: function getCreateBillFormConfiguration(onSelectedItemChangedHandler, filterKey) {

					var formOptions = {
						fid: 'sales.wip.createBillWizardModal',
						version: '0.3.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [
									'description', 'typefk', 'rubriccategoryfk', 'configurationfk', 'previousbillfk', 'billtofk'
								]
							}
						],
						rows: [
							// billing type
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
								'basics.customize.billtype',
								'Description',
								{
									gid: 'baseGroup',
									rid: 'typeFk',
									model: 'TypeFk',
									label: 'Type',
									label$tr$: 'sales.billing.entityBillTypeFk',
									sortOrder: 0
								},
								false, // caution: this parameter is ignored by the function
								{
									required: true,
									customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
								}
							),
							// rubric category
							{
								gid: 'baseGroup',
								rid: 'rubricCategoryFk',
								model: 'RubricCategoryFk',
								sortOrder: 1,
								required: true,
								label$tr$: 'project.main.entityRubric',
								label: 'Rubric Category',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: filterKey,
										showClearButton: false
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'RubricCategoryByRubricAndCompany',
									displayMember: 'Description'
								},
								events: [{
									name: 'onSelectedItemChanged',
									handler: onSelectedItemChangedHandler
								}]
							},
							// Sales Configuration
							{
								gid: 'baseGroup',
								rid: 'configurationfk',
								label: 'Configuration',
								label$tr$: 'sales.common.entityConfigurationFk',
								type: 'directive',
								model: 'ConfigurationFk',
								directive: 'basics-configuration-configuration-combobox',
								options: {
									filterKey: 'sales-billing-configuration-filter',
									showClearButton: true
								},
								sortOrder: 2
							},
							// (bill) description
							{
								gid: 'baseGroup',
								rid: 'description',
								model: 'Description',
								label: 'Description',
								label$tr$: 'cloud.common.entityDescription',
								type: 'description',
								sortOrder: 3
							},
							// Bill to
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'projectBilltoLookupDataService',
								filter: function (item) {
									return item.ProjectFk;
								},
								showClearButton: true,
							}, {
								gid: 'baseGroup',
								rid: 'billToFk',
								label: 'Bill To',
								label$tr$: 'project.main.billToEntity',
								model: 'BillToFk',
								sortOrder: 4,
								type: 'lookup'
							}),
							// (previous) Bill
							{
								gid: 'baseGroup',
								rid: 'previousbillfk',
								model: 'PreviousBillFk',
								sortOrder: 5,
								label: 'Previous Bill',
								label$tr$: 'sales.common.PreviousBill',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'sales-common-bill-dialog-v2',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										filterKey: 'sales-wip-create-bill-wizard-previous-bill-filter',
										showClearButton: true
									}
								}
							},
							// wip grid with select column
							{
								gid: 'baseGroup',
								rid: 'wipsGrid',
								label: 'WIPs',
								label$tr$: 'sales.wip.wips',
								type: 'directive',
								directive: 'sales-wip-select-wips',
								options: {
									wipServiceName: 'salesWipCreateBillWizardDialogService',
									getListName: 'getWIPsFromSameContract',
									getPreselectedName: 'getPreselectedWIPs'
								},
								readonly: false, maxlength: 5000, rows: 20, visible: true, sortOrder: 6
							}
						]
					};

					platformTranslateService.translateFormConfig(formOptions);

					return formOptions;
				}
			};

		}]);
})();
