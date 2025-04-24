/**
 * Created by lvy on 3/21/2019.
 */
(function () {
	'use strict';
	var modName = 'basics.procurementconfiguration';
	angular.module(modName)
		.factory('basicsProcurementConfigurationRfqDataFormatLayout',
			['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
				return {
					'fid': 'basics.procurementconfiguration.rfqdataformat',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['basdataformatfk', 'isdefault']
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							BasDataformatFk: {location: modName, identifier: 'entityBasDataformat', initial: 'Data format'},
							IsDefault: {location: modName, identifier: 'entityIsDefault', initial: 'Is Default'}
						}
					},
					'overloads': {
						'basdataformatfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsDataformatLookupDataService',
							enableCache: false,
							additionalColumns: true,
							showClearButton: true
						},{ required: false }),
					}
				};
			}])
		.factory('basicsProcurementConfigurationRfqDataFormatUIService',
			['platformUIStandardConfigService', 'basicsProcurementConfigHeaderTranslationService',
				'basicsProcurementConfigurationRfqDataFormatLayout', 'platformSchemaService', 'platformUIStandardExtentService',
				function (platformUIStandardConfigService, translationService,
				          layout, platformSchemaService, platformUIStandardExtentService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcConfig2dataformatDto',
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

					var service = new BaseService(layout, domainSchema, translationService);
					platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

					return service;
				}
			]);
})();