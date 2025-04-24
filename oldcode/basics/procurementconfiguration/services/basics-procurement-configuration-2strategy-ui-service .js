/**
 * Created by wuj on 9/2/2015.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementconfiguration', cloudCommonModule = 'cloud.common';
	angular.module(modName)
		.factory('basicsProcurementConfiguration2StrategyLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementconfiguration.2strategy.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['prcstrategyfk', 'prccommunicationchannelfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							PrcStrategyFk: {
								location: cloudCommonModule,
								identifier: 'EntityStrategy',
								initial: 'Strategy'
							},
							PrcCommunicationChannelFk: {
								location: cloudCommonModule,
								identifier: 'entityCommunicationChannel',
								initial: 'Communication Channel'
							}
						}
					},
					'overloads': {
						'prcstrategyfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.prcstrategy'),
						'prccommunicationchannelfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.prccommunicationchannel')
					}
				};
			}])
		.factory('basicsProcurementConfiguration2StrategyUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfiguration2StrategyLayout', 'platformSchemaService',
				function (platformUIStandardConfigService, translationService,
								  layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfiguration2StrategyDto',
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
})();