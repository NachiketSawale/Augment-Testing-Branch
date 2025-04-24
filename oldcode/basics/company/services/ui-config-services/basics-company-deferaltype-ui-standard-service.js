/**
 * Created by henkel on 01.02.2018
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyDeferaltypeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyDeferaltypeUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.deferaltypedetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['descriptioninfo', 'sorting', 'isdefault', 'islive', 'codefinance', 'isstartdatemandatory']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {}
					};
				}

				var companyDeferaltypeDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyDeferaltypeAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyDeferaltypeDto',
					moduleSubModule: 'Basics.Company'
				});

				companyDeferaltypeAttributeDomains = companyDeferaltypeAttributeDomains.properties;

				return new BaseService(companyDeferaltypeDetailLayout, companyDeferaltypeAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
