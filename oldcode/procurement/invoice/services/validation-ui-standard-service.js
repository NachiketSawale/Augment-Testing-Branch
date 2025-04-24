(function () {
	'use strict';
	var basicsCustomizeModule = 'basics.customize';
	var modName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(modName).factory('procurementInvoiceValidationLayout',[
		'basicsCommonGridFormatterHelper','$translate',
		function (basicsCommonGridFormatterHelper, $translate) {
			return {
				'fid': 'procurement.invoice.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'invoiceValidation',
						'attributes': ['messageseverityfk', 'referencetype', 'message']
					},
					{'gid': 'entityHistory', 'isHistory': true}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						MessageseverityFk: { location: basicsCustomizeModule, identifier: 'messageseverityfk', initial: 'Message Severity' },
						ReferenceType: {location: modName, identifier: 'referenceType', initial: 'Reference'},
						Message: {location: modName, identifier: 'message', initial: 'Message'},
						invoiceValidation: {location: modName, identifier: 'group.validation', initial: 'Validations'}
					}
				},
				'overloads': {
					'referencetype': {
						readonly: true,
						'grid': {
							editor: 'simplelookup',
							width: 80,
							formatter: function (row, cell, value) {
								var result = $translate.instant('procurement.invoice.referenceDes.transaction');
								if(value === 1) {result = $translate.instant('procurement.invoice.referenceDes.general');}
								else if(value === 2) {result = $translate.instant('procurement.invoice.referenceDes.certificate');}
								else if(value === 3) {result = $translate.instant('procurement.invoice.referenceDes.billingSchema');}
								else if(value === 4) {result = $translate.instant('procurement.invoice.referenceDes.invHeader');}
								value = result;
								return '<span>' + value + '</span>';
							}
						}
					},
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
		}
	]);

	angular.module(modName).factory('procurementInvoiceValidationUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'procurementInvoiceValidationLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'InvValidationDto',
					moduleSubModule: 'Procurement.Invoice'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
