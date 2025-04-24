/**
 * Created by henkel on 01.02.2018
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyCreateRoleUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyCreateRoleUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.createroledetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['commenttext', 'clerkrolefk', 'accessrolefk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							clerkrolefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.clerk.role'),
							accessrolefk: {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'usermanagement-right-role-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									}
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'usermanagement-right-role-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Name'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'AccessRole',
										displayMember: 'Name'
									}
								}
							},

						}
					};
				}

				var companyCreateRoleDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyCreateRoleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyRoleBas2FrmDto',
					moduleSubModule: 'Basics.Company'
				});

				companyCreateRoleAttributeDomains = companyCreateRoleAttributeDomains.properties;

				return new BaseService(companyCreateRoleDetailLayout, companyCreateRoleAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
