/**
 * Created by pel on 1/3/2020.
 */

(function (angular) {
	'use strict';
	/* global */
	var moduleName = 'documents.centralquery';

	/**
	 * @ngdoc service
	 * @name documentClerkConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for clerk container defined in docuemnt centre main module
	 */
	angular.module(moduleName).factory('centralQueryClerkConfigurationService',

		['platformUIStandardConfigService', 'documentProjectDocumentTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, documentProjectDocumentTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function provideClerkLayout() {
					return {
						fid: 'document.clerk.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'commenttext']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomClerkRoleLookupDataService',
								enableCache: true
							}),
							clerkfk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												width: 200,
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Code'
									}
								}
							}
						}
					};
				}

				var documentClerkDetailLayout = provideClerkLayout();

				var documentClerkAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'Document2BasClerkDto', moduleSubModule: 'Documents.Project'});
				if (documentClerkAttributeDomains) {
					documentClerkAttributeDomains = documentClerkAttributeDomains.properties;
				}

				function ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;

				return new BaseService(documentClerkDetailLayout, documentClerkAttributeDomains, documentProjectDocumentTranslationService);
			}
		]);
})(angular);

