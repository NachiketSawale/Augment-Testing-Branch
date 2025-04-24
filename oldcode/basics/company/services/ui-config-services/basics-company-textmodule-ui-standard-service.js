/**
 * Created by henkel on 16.09.2014
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTextmoduleUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of companyTextmodule entities
	 */
	angular.module(moduleName).factory('basicsCompanyTextModuleUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.textmoduledetailform',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['languagefk', 'textmoduletypefk', 'textmodulefk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							languagefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.language'),
							//textmodulefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.textmodule'),
							textmodulefk: {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										directive: 'basics-text-module-lookup',
										//lookupOptions: {filterKey: 'basics-procurement-configuration-text-textmoudle-filter'}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'TextModule',
										'displayMember': 'DescriptionInfo.Translated'
									},
									'width': 120
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-text-module-lookup',
									'options': {
										//filterKey: 'basics-procurement-configuration-text-textmoudle-filter',
										'descriptionMember': 'DescriptionInfo.Translated'
									}
								}
							},// basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							// 	dataServiceName: 'basicsCompanyTextModuleLookupDataService',
							// 	// filter: function (item) {
							// 	// 	return item && item.CompanyFk ? item.CompanyFk : null;
							// 	// }
							// }),
							textmoduletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.textmoduletype')
						}
					};
				}

				var companyTextmoduleDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyTextmoduleAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Company2TextModuleDto',
					moduleSubModule: 'Basics.Company'
				});

				companyTextmoduleAttributeDomains = companyTextmoduleAttributeDomains.properties;

				return new BaseService(companyTextmoduleDetailLayout, companyTextmoduleAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
