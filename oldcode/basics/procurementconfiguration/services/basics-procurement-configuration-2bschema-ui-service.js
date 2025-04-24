/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';
	var modName = 'basics.procurementconfiguration', cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementConfiguration2BSchemaLayout', [function () {
			return {
				'fid': 'basics.procurementconfiguration.2bschema.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['billingschemafk', 'isdefault']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						BillingSchemaFk: {
							location: cloudCommonModule,
							identifier: 'entityBillingSchema',
							initial: 'Billing Schema'
						}
					}
				},
				'overloads': {
					'billingschemafk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-billing-schema-billing-schema-combobox'
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'billingschema',
								'displayMember': 'DescriptionInfo.Translated'
							},
							name$tr$: 'cloud.common.entityBillingSchema',
							'width': 80
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-billing-schema-billing-schema-combobox'
						}
					}
				}
			};
		}])
		.factory('basicsProcurementConfiguration2BSchemaUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfiguration2BSchemaLayout', 'platformSchemaService',
				function (platformUIStandardConfigService, translationService,
					layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfiguration2BSchemaDto',
						moduleSubModule: 'Basics.ProcurementConfiguration'
					});
					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}
					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;

					return new BaseService(layout, domainSchema, translationService);
				}
			]);
})(angular);