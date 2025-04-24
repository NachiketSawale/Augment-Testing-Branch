/**
 * Created by henkel on 22.10.2015
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
	angular.module(moduleName).factory('basicsCompanyUrlUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService','basicsLookupdataConfigGenerator' , 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {


				function createMainDetailLayout() {
					return {
						fid: 'basics.company.urldetailform',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['companyurltypefk','url', 'urluser','urlpassword' ]
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							companyurltypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.urltype')
						}
					};
				}
				var companyUrlDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyUrlAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'CompanyUrlDto', moduleSubModule: 'Basics.Company'} );
				companyUrlAttributeDomains = companyUrlAttributeDomains.properties;

				return new BaseService(companyUrlDetailLayout, companyUrlAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
