/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.taxcode';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('basicsTaxCodeLayout', [
		function basicsTaxCodeLayout() {
			return {
				fid: 'basics.taxcode.taxcodedetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['id', 'code', 'descriptioninfo', 'islive','vatpercent', 'vatpercentdominant', 'codefinance', 'userdefined1', 'userdefined2', 'userdefined3','validfrom','validto','commenttranslateinfo']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						'Id': {location: cloudCommonModule, identifier: 'entityId', initial: 'ID'},
						'basicData': {
							location: cloudCommonModule,
							identifier: 'entityProperties',
							initial: 'Basic Data'
						},
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'IsLive': {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
						'VatPercentDominant': {
							location: moduleName,
							identifier: 'vatpercentdominant',
							initial: 'VAT Percent Dominant'
						},
						'VatPercent': {
							'location': cloudCommonModule,
							'identifier': 'entityVatPercent',
							'initial': 'Vat Percent'
						},
						'CodeFinance': {
							'location': moduleName,
							'identifier': 'entityCodeFinance',
							'initial': 'Code Finance'
						},
						'UserDefined1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 1',
							param: {'p_0': '1'}
						},
						'UserDefined2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 1',
							param: {'p_0': '2'}
						},
						'UserDefined3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'User Defined 1',
							param: {'p_0': '3'}
						},
						ValidFrom: {location: cloudCommonModule, identifier: 'entityValidFrom', initial: 'Valid From'},
						ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo', initial: 'Valid To'},
						CommentTranslateInfo: {location: cloudCommonModule, identifier: 'entityComment',initial: 'Comments'},
					}
				},
				overloads: {
					'id': {
						'readonly': true
					},
					'code': {
						'mandatory': true
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory('basicsTaxCodeUIStandardService',

		['platformUIStandardConfigService', 'basicsTaxCodeTranslationService', 'platformSchemaService', 'basicsTaxCodeLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, basicsTaxCodeLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MdcTaxCodeDto',
					moduleSubModule: 'Basics.TaxCode'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(basicsTaxCodeLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, basicsTaxCodeLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
