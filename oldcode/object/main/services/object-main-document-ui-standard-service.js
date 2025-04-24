(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Document entities
	 */
	angular.module(moduleName).factory('objectMainDocumentUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						'fid': 'object.main.documentdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['description','documenttypefk', 'unitdocumenttypefk', 'date', 'barcode', 'originfilename']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.basDocumenttype'),
							unitdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectunitdocumenttype'),
							originfilename: { readonly: true }
						}
					};
				}

				var objectMainDocumentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentDto',
					moduleSubModule: 'Object.Main'
				});
				documentAttributeDomains = documentAttributeDomains.properties;


				function DocUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				DocUIStandardService.prototype = Object.create(BaseService.prototype);
				DocUIStandardService.prototype.constructor = DocUIStandardService;

				return new BaseService(objectMainDocumentDetailLayout, documentAttributeDomains, objectMainTranslationService);
			}
		]);
})();
