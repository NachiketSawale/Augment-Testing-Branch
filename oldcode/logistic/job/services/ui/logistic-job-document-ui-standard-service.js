(function () {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc service
	 * @name logisticJobDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of job document entities
	 */
	angular.module(moduleName).factory('logisticJobDocumentUIStandardService',
		['platformUIStandardConfigService', '$injector', 'logisticJobTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'platformUIConfigInitService',
			function (platformUIStandardConfigService, $injector, logisticJobTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, platformUIConfigInitService ) {

				function createMainDetailLayout() {
					return {
						'fid': 'logistic.job.jobdocumentdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [ 'description', 'jobdocumenttypefk', 'documenttypefk', 'date', 'barcode', 'originfilename']
							}
						],
						'overloads': {
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype'),
							jobdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.jobdocumenttype'),
							originfilename: {	readonly: true }
						}
					};
				}

				var logisticJobDocumentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var logisticJobDocumentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'JobDocumentDto',
					moduleSubModule: 'Logistic.Job'
				});
				logisticJobDocumentAttributeDomains = logisticJobDocumentAttributeDomains.properties;


				function LogisticJobDocumentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				LogisticJobDocumentUIStandardService.prototype = Object.create(BaseService.prototype);
				LogisticJobDocumentUIStandardService.prototype.constructor = LogisticJobDocumentUIStandardService;


				platformUIConfigInitService.createUIConfigurationService({
					service: this,
					layout: createMainDetailLayout(),
					dtoSchemeId: {
						typeName: 'JobDocumentDto',
						moduleSubModule: 'Logistic.Job'
					},
					translator: logisticJobTranslationService
				});


				return new BaseService(logisticJobDocumentDetailLayout, logisticJobDocumentAttributeDomains, logisticJobTranslationService);
			}
		]);
})();
