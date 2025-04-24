/**
 * Created by wuj on 8/27/2015.
 */
(function (angular) {
	'use strict';
	var modName = 'basics.procurementconfiguration',
		cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementConfigHeaderLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurement.configuration.header',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['descriptioninfo', 'isdefault', 'autocreateboq', 'sorting', 'isfreeitemsallowed', 'isconsolidatechange', 'ischangefrommaincontract','isconsolidatedtransaction','transactioniteminc','prcconfigheadertypefk','basconfigurationtypefk','isinherituserdefined']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [modName],
						'extraWords': {
							DescriptionInfo: {
								location: cloudCommonModule,
								identifier: 'entityDescription',
								initial: 'Description'
							},
							Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
							IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
							AutoCreateBoq:{location:modName,identifier: 'entityAutoCreateBoQ', initial: 'Auto Create BoQ'},
							IsFreeItemsAllowed: {location:modName,identifier: 'entityIsFreeItemsAllowed', initial: 'Is Free Items Allowed'},
							IsConsolidateChange: {location:modName,identifier: 'entityIsConsolidateChange', initial: 'Is Consolidate Change'},
							IsChangeFromMainContract: {location:modName,identifier: 'entityIsChangeFromMainContract', initial: 'Changes from Main Contract'},
							IsConsolidatedTransaction:{location:modName,identifier: 'entityIsConsolidatedTransaction', initial: 'Is Consolidated Transaction'},
							TransactionItemInc:{location:modName,identifier: 'entityTransactionItemInc', initial: 'Transaction Item Inc'},
							PrcConfigHeaderTypeFk:{location:modName,identifier: 'entityPrcConfigHeaderTypeFk', initial: 'Prc Config Header Type'},
							BasConfigurationTypeFk:{location:modName,identifier: 'entityBasConfigurationTypeFk', initial: 'Configuration Type'},
							IsInheritUserDefined:{location:modName,identifier: 'entityIsInheritUserDefined', initial: 'Inherit Header User Defined Fields'}
						}
					},
					'overloads': {
						'descriptioninfo': {
							'mandatory': true
						},
						'sorting': {
							'mandatory': true,
							'grid': {
								'width': 60
							}
						},
						'prcconfigheadertypefk':  basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.procurementconfigheadertype', 'Description'),
						'basconfigurationtypefk':  basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.configurationtype', 'Description')
					}
				};
			}])
		.factory('basicsProcurementConfigHeaderUIStandardService',
			['$translate', 'platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigHeaderLayout', 'platformSchemaService',
				function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfigHeaderDto',
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