(function () {
	'use strict';
	var moduleName = 'object.project';

	/**
	 * @ngdoc service
	 * @name objectProjectHeaderDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of HeaderDocument entities
	 */
	angular.module(moduleName).factory('objectProjectHeaderDocumentUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectProjectTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectProjectTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.project.projectheaderdocumentdetailform',
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

				var headerDocDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var projectAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'HeaderDocumentDto',
					moduleSubModule: 'Object.Project'
				});
				projectAttributeDomains = projectAttributeDomains.properties;


				function ProjectUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;

				return new BaseService(headerDocDetailLayout, projectAttributeDomains, objectProjectTranslationService);
			}
		]);
})();
