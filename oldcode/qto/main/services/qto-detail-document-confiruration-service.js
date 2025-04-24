/**
 * Created by lnt on 02.11.2019.
 */

(function () {
	'use strict';
	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoDetailDocumentConfigurationService
	 * @function
	 *
	 * @description
	 * provides layout configuration for qto detail document container
	 */
	angular.module(moduleName).factory('qtoDetailDocumentConfigurationService',
		['platformUIStandardConfigService', 'qtoMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (PlatformUIStandardConfigService, qtoMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createDocumentDetailLayout(fid, version) {
					return {
						'fid': fid,
						'version': version,
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [{
							'gid': 'basicData',
							'attributes': ['documentdescription', 'documenttypefk', 'qtodetaildocumenttypefk', 'documentdate', 'originfilename']
						}, {
							'gid': 'entityHistory',
							'isHistory': true
						}],
						'overloads': {
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.basDocumenttype'),
							qtodetaildocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.qtodetaildocumenttype'),
							originfilename: {readonly: true}
						}
					};
				}

				var layout = createDocumentDetailLayout('qto.detai.documentdetail', '1.0.0');
				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoDetailDocumentDto',
					moduleSubModule: 'Qto.Main'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					PlatformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(PlatformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new PlatformUIStandardConfigService(layout, documentAttributeDomains, qtoMainTranslationService);
			}
		]);
})();
