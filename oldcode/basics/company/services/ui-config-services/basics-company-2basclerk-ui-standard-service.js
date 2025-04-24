/**
 * Created by leo on 05.11.2015
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompany2BasClerkUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompany2BasClerkUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.2basclerkdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['clerkfk', 'clerkrolefk', 'validfrom', 'validto', 'commenttext']
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
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Description'
									}
								}
							}
						}
					};
				}

				var companyClerkDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyClerkAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Company2BasClerkDto',
					moduleSubModule: 'Basics.Company'
				});
				companyClerkAttributeDomains = companyClerkAttributeDomains.properties;

				function Company2BasClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				Company2BasClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				Company2BasClerkUIStandardService.prototype.constructor = Company2BasClerkUIStandardService;

				return new BaseService(companyClerkDetailLayout, companyClerkAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
