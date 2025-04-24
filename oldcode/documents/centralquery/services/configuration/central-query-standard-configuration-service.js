/**
 * Created by pel on 1/14/2020.
 */

(function () {
	'use strict';
	/* global */
	var moduleName = 'documents.centralquery';

	angular.module(moduleName).factory('centralQueryStandardConfigurationService', ['platformUIStandardConfigService', 'documentProjectDocumentTranslationService', 'platformSchemaService', 'documentCentralQueryLayout',

		function (platformUIStandardConfigService, documentProjectDocumentTranslationService, platformSchemaService, documentCentralQueryLayout) {

			function getLayout() {
				documentCentralQueryLayout.overloads.quantitytotal = {};
				return documentCentralQueryLayout;
			}

			var BaseService = platformUIStandardConfigService;
			var projectDocumentDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'});

			if (projectDocumentDomainSchema) {
				projectDocumentDomainSchema = projectDocumentDomainSchema.properties;
				projectDocumentDomainSchema.Action = {domain: 'action'};
				projectDocumentDomainSchema.Info = {domain: 'image'};
				projectDocumentDomainSchema.Rule = {domain: 'imageselect'};
				projectDocumentDomainSchema.Param = {domain: 'imageselect'};
				projectDocumentDomainSchema.ModelStatus = {domain: 'action'};
			}

			function CentralQueryUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CentralQueryUIStandardService.prototype = Object.create(BaseService.prototype);
			CentralQueryUIStandardService.prototype.constructor = CentralQueryUIStandardService;
			const entityInformation = { module: angular.module(moduleName), moduleName: 'Documents.CentralQuery', entity: 'Document' };
			return new BaseService(getLayout(), projectDocumentDomainSchema, documentProjectDocumentTranslationService, entityInformation);
		}
	]);
})();