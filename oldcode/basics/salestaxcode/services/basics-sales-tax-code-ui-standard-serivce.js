/*
 * Created by lcn on 11/4/2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.salestaxcode';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('basicsSalesTaxCodeLayout', [
		function basicsSalesTaxCodeLayout() {
			return {
				fid: 'basics.salestaxcode.salestaxcodedetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['id', 'code','taxpercent', 'reference', 'userdefined1', 'userdefined2', 'userdefined3', 'islive', 'descriptioninfo','calculationorder']
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
						'IsLive': {location: cloudCommonModule, identifier: 'entityIsLive', initial: 'Active'},
						'CalculationOrder': {location: moduleName, identifier: 'calculationOrder', initial: 'Calculation Order'}
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

	angular.module(moduleName).factory('basicsSalesTaxCodeUIStandardService',

		['platformUIStandardConfigService', 'basicsSalesTaxCodeTranslationService', 'platformSchemaService', 'basicsSalesTaxCodeLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, basicsSalesTaxCodeLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MdcSalesTaxCodeDto',
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

				var service = new BaseService(basicsSalesTaxCodeLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, basicsSalesTaxCodeLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
