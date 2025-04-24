/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.salestaxcode';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('basicsSalesTaxMatrixLayout', ['basicsLookupdataConfigGenerator',
		function basicsSalesTaxMatrixLayout(basicsLookupdataConfigGenerator) {
			return {
				fid: 'basics.salestaxcode.salestaxmatrixdetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['id', 'taxpercent', 'reference', 'salestaxgroupfk', 'userdefined1', 'userdefined2', 'userdefined3', 'islive']
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
						'TaxPercent': {
							'location': moduleName,
							'identifier': 'taxPercent',
							'initial': 'Tax Percent'
						},
						'Reference': {
							'location': moduleName,
							'identifier': 'reference',
							'initial': 'Reference'
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
						'SalesTaxGroupFk': {
							'location': moduleName,
							'identifier': 'salesTaxGroup',
							'initial': 'Sales Tax Group'
						},
						'IsLive': {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'}
					}
				},
				overloads: {
					'id': {
						'readonly': true
					},
					'salestaxgroupfk': {
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-sales-tax-group-lookup',
								descriptionMember: 'DescriptionInfo.Translated'
							}
						},
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								lookupDirective:'basics-sales-tax-group-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'SalesTaxGroup',
								displayMember: 'Code'
							}
						}
					}
				},
				'addition': {
					'grid': [ {
						'lookupDisplayColumn': true,
						'field': 'SalesTaxGroupFk',
						'displayMember': 'DescriptionInfo.Translated',
						'name$tr$': 'basics.salestaxcode.entitySalesTaxCodeDescription',
						'width': 150
					}]
				}
			};
		}
	]);

	angular.module(moduleName).factory('basicsSalesTaxMatrixUIStandardService',

		['platformUIStandardConfigService', 'basicsSalesTaxCodeTranslationService', 'platformSchemaService', 'basicsSalesTaxMatrixLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, basicsSalesTaxMatrixLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MdcSalesTaxMatrixDto',
					moduleSubModule: 'Basics.SalesTaxCode'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(basicsSalesTaxMatrixLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, basicsSalesTaxMatrixLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
