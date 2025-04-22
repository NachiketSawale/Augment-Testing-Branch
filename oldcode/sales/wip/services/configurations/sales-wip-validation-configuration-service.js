(function () {


	'use strict';
	var basicsCustomizeModule = 'basics.customize';
	var salesBillingModule = 'sales.billing';
	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipValidationConfigurationService', ['platformUIStandardExtentService', 'salesCommonLookupConfigsService', 'basicsCommonGridFormatterHelper',
		function (platformUIStandardConfigService, salesCommonLookupConfigsService, basicsCommonGridFormatterHelper) {

			return {
				'fid': 'sales.billing.validation.detailform',
				'version': '0.0.1',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['messageseverityfk', 'message']
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
						Message: {location: salesBillingModule, identifier: 'message', initial: 'Message'},
						invoiceValidation: {location: salesBillingModule, identifier: 'group.validation', initial: 'Validation'}
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
						},
						readonly: true
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
							},
							readonly: true
						}
					}
				}
			};
		}
	]);
})();
