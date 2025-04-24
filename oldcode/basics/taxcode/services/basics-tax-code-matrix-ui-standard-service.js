/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.taxcode';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('basicsTaxCodeMatrixLayout', ['basicsLookupdataConfigGenerator',
		function basicsTaxCodeMatrixLayout(basicsLookupdataConfigGenerator) {
			return {
				fid: 'basics.taxcode.taxcodematrixdetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['id', 'code', 'descriptioninfo', 'vatpercent', 'taxcategory', 'bpdvatgroupfk', 'basvatcalculationtypefk', 'basvatclausefk', 'userdefined1', 'userdefined2', 'userdefined3','commenttranslateinfo']
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
						'VatPercent': {
							'location': cloudCommonModule,
							'identifier': 'entityVatPercent',
							'initial': 'Vat Percent'
						},
						'TaxCategory': {
							'location': moduleName,
							'identifier': 'entityMdcTaxCategory',
							'initial': 'Tax Category'
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
						'BpdVatgroupFk': {
							'location': moduleName,
							'identifier': 'entityVatGroup',
							'initial': 'Vat Group'
						},
						'BasVatcalculationtypeFk': {
							'location': moduleName,
							'identifier': 'entityBasVatcalculationtype',
							'initial': 'VAT Calculation Type'
						},
						'BasVatclauseFk': {
							'location': moduleName,
							'identifier': 'entityBasVatclause',
							'initial': 'VAT Clause'
						},
						CommentTranslateInfo: {location: cloudCommonModule, identifier: 'entityComment',initial: 'Comments'},
					}
				},
				overloads: {
					'id': {
						'readonly': true
					},
					'code': {
						'mandatory': true
					},
					'userdefined1': {
						maxLength: 252
					},
					'taxcategory':{
						maxLength: 252
					},
					'userdefined2': {
						maxLength: 252
					},
					'userdefined3': {
						maxLength: 252
					},
					'bpdvatgroupfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'VatGroup',
								displayMember: 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'business-partner-vat-group-lookup',
								lookupOptions: {
									showClearButton: true,
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'business-partner-vat-group-lookup',
							'options': {
								showClearButton: true,
								displayMember: 'DescriptionInfo.Translated'
							}
						}
					},
					basvatcalculationtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.vatcalculationtype'),
					basvatclausefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.vatclause')
				}
			};
		}
	]);

	angular.module(moduleName).factory('basicsTaxCodeMatrixUIStandardService',

		['platformUIStandardConfigService', 'basicsTaxCodeTranslationService', 'platformSchemaService', 'basicsTaxCodeMatrixLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, basicsTaxCodeMatrixLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MdcTaxCodeMatrixDto',
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

				var service = new BaseService(basicsTaxCodeMatrixLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, basicsTaxCodeMatrixLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
