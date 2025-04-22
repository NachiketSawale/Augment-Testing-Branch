/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingPreviousBillsConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'salesCommonLookupConfigsService', 'salesBillingTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
		function (_, $injector, platformUIStandardConfigService, salesCommonLookupConfigsService, salesBillingTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

			var billingPreviousBillsDetailLayout = {
				'fid': 'sales.billing.previousbills.detailform',
				'version': '0.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': [
							'finalgroup', 'rubriccategoryfk', 'bilstatusfk', 'billdate', 'billno', 'invoicetypefk',
							'descriptioninfo', 'iscanceled', 'cancellationno', 'cancellationreason', 'cancellationdate',
							'bookingtext'
						]
					},
					{
						'gid': 'paymentData',
						'attributes': [
							'billingschemafk', 'paymenttermfk', 'taxcodefk', 'amounttotal', 'discountamounttotal'
						]
					},
					{
						'gid': 'datesData',
						'attributes': [
							'performedfrom', 'performedto'
						]
					},
					{
						'gid': 'otherData',
						'attributes': [
							'remark', 'commenttext'
						]
					},
					{
						'gid': 'userDefText',
						'isUserDefText': true,
						'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],

				'overloads': {
					'bilstatusfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'salesBillingStatusLookupDataService',
						readonly: true
					}),
					'billdate': {
						readonly: true
					},
					'billno': {
						mandatory: true,
						searchable: true,
						readonly: true
					},
					'amounttotal':{
						readonly: true
					},
					'discountamounttotal': {
						readonly: true
					},
					invoicetypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('billing.invoicetype', null, {customBoolProperty: 'ISLUMPSUM'}),
					paymenttermfk: {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookupdata-payment-term-lookup',
								descriptionMember: 'Description'
							}
						},
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PaymentTerm',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {directive: 'basics-lookupdata-payment-term-lookup'}
						}
					}
				}
			};

			salesCommonLookupConfigsService.addCommonLookupsToLayout(billingPreviousBillsDetailLayout);

			// make all other attributes readonly
			var overloads = billingPreviousBillsDetailLayout.overloads;
			_.each(_.flatten(_.map(billingPreviousBillsDetailLayout.groups, 'attributes')), function(attribute) {
				if (angular.isUndefined(overloads[attribute])) {
					overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
				}
			});

			var BaseService = platformUIStandardConfigService;

			var salesBillingHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'BilHeaderDto',
				moduleSubModule: 'Sales.Billing'
			});

			if (salesBillingHeaderDomainSchema) {
				salesBillingHeaderDomainSchema = salesBillingHeaderDomainSchema.properties;
			}

			function SalesBillingPreviousBillsUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesBillingPreviousBillsUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBillingPreviousBillsUIStandardService.prototype.constructor = SalesBillingPreviousBillsUIStandardService;
			return new BaseService(billingPreviousBillsDetailLayout, salesBillingHeaderDomainSchema, salesBillingTranslationService);
		}
	]);
})();
