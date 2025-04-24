(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainMeterTypeReadingUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of MeterTypeReading entities
	 */
	angular.module(moduleName).factory('objectMainMeterTypeReadingUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator ) {

				function createMainDetailLayout() {
					return {
						'fid': 'object.main.metertypereadingdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['metertypefk', 'meterno', 'meterreading', 'dateread', 'commenttext', 'userdefinedtext01', 'userdefinedtext02', 'userdefinedtext03', 'userdefinedtext04', 'userdefinedtext05']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							metertypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.metertype'),
						}
					};
				}

				var objectMainMeterTypeReadingDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var meterTypeReadingAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'MeterTypeReadingDto',
					moduleSubModule: 'Object.Main'
				});
				meterTypeReadingAttributeDomains = meterTypeReadingAttributeDomains.properties;


				function MeterTypeReadingUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				MeterTypeReadingUIStandardService.prototype = Object.create(BaseService.prototype);
				MeterTypeReadingUIStandardService.prototype.constructor = MeterTypeReadingUIStandardService;

				return new BaseService(objectMainMeterTypeReadingDetailLayout, meterTypeReadingAttributeDomains, objectMainTranslationService);
			}
		]);
})();
