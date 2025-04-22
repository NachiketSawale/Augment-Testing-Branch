/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesBidCreateWizardDialogUIService
	 * @function
	 *
	 * @description
	 * Service for the wizard creation dialog
	 **/

	var moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidCreateWizardDialogUIService', [
		'platformTranslateService', 'basicsLookupdataConfigGenerator',
		function (platformTranslateService, basicsLookupdataConfigGenerator) {

			return {
				getCreateFormConfiguration: function getCreateFormConfiguration(onSelectedItemChangedHandler, filterKey, mainContractFilter/* , selectedBid */) { // TODO: check obsolete selectedBid parameter

					var formOptions =
					{
						fid: 'sales.bid.createContractWizardModal',
						version: '0.4.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [
									'rubriccategoryfk', 'configurationfk','billingmethodfk', 'description', 'ordheaderfk', 'billtofk', 'changeorderfk'
								]
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'rubricCategoryFk',
								model: 'RubricCategoryFk',
								label$tr$: 'project.main.entityRubric',
								label: 'Category',
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
									filterKey: 'sales-contract-configuration-filter',
									showClearButton: true
								}
							},
							{
								gid: 'baseGroup',
								rid: 'description',
								label$tr$: 'cloud.common.entityDescription',
								model: 'Description',
								type: 'description'
							},

							//billing method
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
								'basics.customize.salesbillingmethod',
								'Description',
								{
									gid: 'baseGroup',
									rid: 'billingMethodFk',
									model: 'BillingMethodFk',
									required: false,
									sortOrder: 3,
									label: 'Billing Method',
									label$tr$: 'sales.common.entityBillingMethodFk',
								},

							),
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
								type: 'lookup'
							}),
							// Change Order
							{
								gid: 'baseGroup',
								rid: 'changeorderfk',
								model: 'ChangeOrderFk',
								required: true,
								// sortOrder: 13,
								label: 'Change Order',
								label$tr$: 'sales.common.entityPrjChangeOrder',
								validator: function onPrjChangeChanged(/* entity, prjChangeFk */) {
								},
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-change-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										createOptions: {
											typeOptions: {
												isSales: true,
												isChangeOrder: true
											}
										},
										filterKey: 'sales-contract-project-change-common-filter'
									}
								}
							}
						]
					};

					// add main contract lookup, if selected bid is a side order (#86903)
					// since we cannot differ between a side/quote and main quote,
					// at the moment we will show the lookup all the time
					// (selectedBid !== null && selectedBid.BidHeaderFk > 0) <- old condition, but user do not have to set a main bid.
					var mainContractRow = {
						gid: 'baseGroup',
						rid: 'ordheaderfk',
						model: 'OrdHeaderFk',
						label: 'Main Contract',
						label$tr$: 'sales.common.MainContract',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'sales-common-contract-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: mainContractFilter,
								showClearButton: true
							}
						}
					};
					formOptions.rows.push(mainContractRow);

					platformTranslateService.translateFormConfig(formOptions);

					return formOptions;
				}
			};

		}]);
})();
