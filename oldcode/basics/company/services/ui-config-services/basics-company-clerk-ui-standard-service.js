/**
 * Created by henkel on 16.09.2014
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyClerkUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',
			'platformUIStandardExtentService', 'platformObjectHelper',

			/* jshint -W072 */ // many parameters because of dependency injection
			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService,
				platformUIStandardExtentService, platformObjectHelper) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.clerkdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['clerkfk', 'validfrom', 'validto']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
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
										displayMember: 'Code'
									}
								}
							}
						}
					};
				}

				var companyClerkDetailLayout = createMainDetailLayout();

				function extendClerkDisplayConfig() {
					return {
						'addition': {
							'grid': platformObjectHelper.extendGrouping([
								{
									'afterId': 'clerkfk',
									'id': 'ClerkDescription_description',
									'field': 'ClerkFk',
									'name': 'Clerk Description',
									'name$tr$': 'basics.company.clerkdesc',
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'clerk',
										displayMember: 'Description'
									},
									width: 140
								}
							])
						}
					};
				}

				var BaseService = platformUIStandardConfigService;

				var companyClerkAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Company2ClerkDto',
					moduleSubModule: 'Basics.Company'
				});

				companyClerkAttributeDomains = companyClerkAttributeDomains.properties;

				function CompanyClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				CompanyClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				CompanyClerkUIStandardService.prototype.constructor = CompanyClerkUIStandardService;

				var service = new BaseService(companyClerkDetailLayout, companyClerkAttributeDomains, basicsCompanyTranslationService);
				platformUIStandardExtentService.extend(service, extendClerkDisplayConfig().addition, companyClerkAttributeDomains);

				return service;
			}
		]);
})();
