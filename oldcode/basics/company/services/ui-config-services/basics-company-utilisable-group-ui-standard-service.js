/**
 * Created by henkel
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyUtilisableGroupUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyUtilisableGroupUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.utilisablegroupdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['groupfk', 'isactive', 'commenttext']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							groupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectgroup')
						}
					};
				}

				var companyUtilisableGroupDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyUtilisableGroupAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Company2PrjGroupDto',
					moduleSubModule: 'Basics.Company'
				});

				companyUtilisableGroupAttributeDomains = companyUtilisableGroupAttributeDomains.properties;

				return new BaseService(companyUtilisableGroupDetailLayout, companyUtilisableGroupAttributeDomains, basicsCompanyTranslationService);
			}

		]);
})();
