(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainProspectActivityUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of prospect activity entities
	 */
	angular.module(moduleName).factory('objectMainProspectActivityUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.main.prospectactivitydetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['description','activitytypefk', 'appointmenttime', 'location', 'remark']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'activitytypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('object.main.activitytype')
						}
					};
				}

				var objectMainProspectActivityDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var objectMainProspectActivityAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ProspectActivityDto',
					moduleSubModule: 'Object.Main'
				});
				objectMainProspectActivityAttributeDomains = objectMainProspectActivityAttributeDomains.properties;


				function ProspectActivityUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProspectActivityUIStandardService.prototype = Object.create(BaseService.prototype);
				ProspectActivityUIStandardService.prototype.constructor = ProspectActivityUIStandardService;

				return new BaseService(objectMainProspectActivityDetailLayout, objectMainProspectActivityAttributeDomains, objectMainTranslationService);
			}
		]);
})();
