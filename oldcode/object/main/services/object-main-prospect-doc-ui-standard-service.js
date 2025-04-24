(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainProspectDocUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of prospect doc entities
	 */
	angular.module(moduleName).factory('objectMainProspectDocUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						'fid': 'object.main.prospectdocdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['date', 'barcode', 'originfilename']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							originfilename: { readonly: true }
						}
					};
				}

				var objectMainProspectDocDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var objectMainProspectDocAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ProspectDocDto',
					moduleSubModule: 'Object.Main'
				});

				objectMainProspectDocAttributeDomains = objectMainProspectDocAttributeDomains.properties;


				function ProspectDocUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProspectDocUIStandardService.prototype = Object.create(BaseService.prototype);
				ProspectDocUIStandardService.prototype.constructor = ProspectDocUIStandardService;

				return new BaseService(objectMainProspectDocDetailLayout, objectMainProspectDocAttributeDomains, objectMainTranslationService);
			}
		]);
})();
