/**
 * Created by lcn on 20/12/2024.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.invoice';

	angular.module(moduleName).controller('procurementInvoiceCreateInterCompanyBillController', [
		'$scope', 'procurementCommonCreateInterCompanyFactoryController', 'basicsLookupdataLookupDescriptorService', 'procurementInvoiceInterCompanyDrillDownService',
		function ($scope, factoryController, basicsLookupdataLookupDescriptorService, invoiceInterCompanyDrillDownService) {

			// Constants for translation keys
			const translateSource = 'procurement.invoice.wizard.createInterCompanyBill.';
			const commonTranslate = 'procurement.common.wizard.createInterCompany.';
			const lookupUpdateArray = ['prcconfiguration', 'PrcConfig2BSchema'];
			// Configuration Object
			const config = {
				$scope: $scope,
				translateSource: translateSource,
				contextUrlSuffix: 'sales/billing/intercompany/',
				gridId: '5332107C7C8749EFB2554B7FF3CC67D2',
				drillDownFactoryService: invoiceInterCompanyDrillDownService,
				extendColumns: getExtendColumns(translateSource, commonTranslate),
				extraFilters: getExtraFilters(basicsLookupdataLookupDescriptorService),
				lookupUpdateArray: lookupUpdateArray
			};

			// Create and return the factory controller logic
			return factoryController.create(config);

			// Helper function to generate extendColumns configuration
			function getExtendColumns(translateSource, commonTranslate) {
				return [
					{
						id: 'configuration',
						field: 'ConfigurationId',
						name: 'Configuration',
						name$tr$: translateSource + 'configuration',
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-configuration-configuration-combobox',
							lookupOptions: {
								filterKey: 'configuration-filter',
								events: [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											if (args.entity) {
												args.entity.BillingSchemaId = null; // Clear BillingSchemaId when Configuration changes
											}
										}
									}
								]
							}
						},
						formatter: 'lookup',
						formatterOptions: {lookupType: 'prcconfiguration', displayMember: 'DescriptionInfo.Translated'},
						width: 120
					},
					{
						id: 'billingschema',
						field: 'BillingSchemaId',
						name: 'BillingSchema',
						name$tr$: translateSource + 'billingSchema',
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-configuration-billing-schema-combobox',
							lookupOptions: {filterKey: 'billingSchema-filter'}
						},
						formatter: 'lookup',
						formatterOptions: {lookupType: 'PrcConfig2BSchema', displayMember: 'DescriptionInfo.Translated'},
						width: 120
					},
					{
						id: 'billedAmount',
						field: 'BilledAmount',
						name: 'BilledAmount',
						name$tr$: commonTranslate + 'billedAmount',
						width: 110,
						formatter: 'money',
						readonly: true
					},
					{
						id: 'surchargeAmount',
						field: 'SurchargeAmount',
						name: 'SurchargeAmount',
						name$tr$: commonTranslate + 'surchargeAmount',
						width: 102,
						formatter: 'money',
						readonly: true
					}
				];
			}

			// Helper function to generate extraFilters configuration
			function getExtraFilters(basicsLookupdataLookupDescriptorService) {
				return [
					{
						key: 'configuration-filter',
						serverKey: 'configuration-filter-only-sales',
						serverSide: true,
						fn: () => ({RubricFk: 7, IsSales: true})
					},
					{
						key: 'billingSchema-filter',
						serverSide: true,
						fn: function (entity) {
							if (entity && entity.ConfigurationId) {
								const config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: entity.ConfigurationId});
								return config ? `IsChained=false AND PrcConfigHeaderFk=${config.PrcConfigHeaderFk}` : 'PrcConfigHeaderFk=-1';
							}
							return 'PrcConfigHeaderFk=-1';
						}
					}
				];
			}
		}
	]);
})(angular);
