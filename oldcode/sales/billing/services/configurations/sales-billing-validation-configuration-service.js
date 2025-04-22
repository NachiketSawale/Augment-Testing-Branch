/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var basicsCustomizeModule = 'basics.customize';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingValidationConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'salesBillingTranslationService', 'platformSchemaService', 'basicsCommonGridFormatterHelper',
		function (_, $injector, platformUIStandardConfigService, platformUIStandardExtentService, salesCommonLookupConfigsService, salesBillingTranslationService, platformSchemaService, basicsCommonGridFormatterHelper) {

			var billingValidationDetailLayout = {
				'fid': 'sales.billing.validation.detailform',
				'version': '0.0.1',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['messageseverityfk', 'message',]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						MessageseverityFk: {
							location: basicsCustomizeModule,
							identifier: 'messageseverityfk',
							initial: 'Message Severity'
						},
						Message: {location: moduleName, identifier: 'message', initial: 'Message'},
						invoiceValidation: {location: moduleName, identifier: 'group.validation', initial: 'Validation'}
					}
				},
				'overloads': {
					'message': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'procurement-Invoice-Validations-Message-Lookup',
								lookupOptions: {
									showClearButton: false
								}
							},
							width: 50,
							formatter: function (row, cell, value, columnDef, dataContext) {
								value = basicsCommonGridFormatterHelper.formatterValue(dataContext, columnDef.field, columnDef.formatterOptions, null, value);
								return '<span>' + value + '</span>';
							}
						}
					},
					'messageseverityfk': {
						readonly: true,
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-messages-everity-combobox',
							'options': {
								imageSelector: 'platformStatusIconService'
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MessagesEverity',
								displayMember: 'DescriptionInfo.Translated',
								imageSelector: 'platformStatusIconService'
							}
						}
					}
				}
			};

			// make all attributes readonly // TODO: extract to common service function
			var overloads = billingValidationDetailLayout.overloads;
			_.each(_.flatten(_.map(billingValidationDetailLayout.groups, 'attributes')), function (attribute) {
				if (angular.isUndefined(overloads[attribute])) {
					overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
				}
			});

			var BaseService = platformUIStandardConfigService;

			var salesBillingValidationDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ValidationDto',
				moduleSubModule: 'Sales.Billing'
			});

			if (salesBillingValidationDomainSchema) {
				salesBillingValidationDomainSchema = salesBillingValidationDomainSchema.properties;
			}

			function SalesBillingUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesBillingUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBillingUIStandardService.prototype.constructor = SalesBillingUIStandardService;
			var service = new BaseService(billingValidationDetailLayout, salesBillingValidationDomainSchema, salesBillingTranslationService);

			return service;
		}
	]);
})();
