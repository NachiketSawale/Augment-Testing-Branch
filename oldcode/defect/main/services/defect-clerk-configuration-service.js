/**
 * Created by pel on 5/10/2019.
 */
/* global */
(function () {
	'use strict';
	var moduleName = 'defect.main';

	/**
     * @ngdoc service
     * @name defectClerkConfigurationService
     * @function
     *
     * @description
     * This service provides standard layouts for clerk container defined in defect main module
     */
	angular.module(moduleName).factory('defectClerkConfigurationService',

		['platformUIStandardConfigService', 'defectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, defectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function provideClerkLayout() {
					return {
						fid: 'defect.clerk.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [ 'clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'commenttext' ]
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

				var defectClerkDetailLayout = provideClerkLayout();

				var defectClerkAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'DfmDefect2basClerkDto', moduleSubModule: 'Defect.Main'} );
				if(defectClerkAttributeDomains) {
					defectClerkAttributeDomains = defectClerkAttributeDomains.properties;
				}

				function ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;

				return new BaseService(defectClerkDetailLayout, defectClerkAttributeDomains, defectMainTranslationService);
			}
		]);
})();
