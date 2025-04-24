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
	angular.module(moduleName).factory('basicsCompanyCategoryUIStandardService',
		['$injector', 'platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function ($injector, platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.categorydetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['rubricfk', 'rubriccategoryfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							rubricfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubric'),
							rubriccategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig(
								'basics.customize.rubriccategory',
								'Description',
								{
									required: true,
									field: 'RubricFk',
									filterKey: 'basics-company-rubric-category-by-rubric-filter',
									customIntegerProperty: 'BAS_RUBRIC_FK'
								})
						}
					};
				}

				var companyCategoryDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyCategoryAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'RubricCategory2CompanyDto',
					moduleSubModule: 'Basics.Company'
				});

				companyCategoryAttributeDomains = companyCategoryAttributeDomains.properties;

				function CompanyCategoryUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				CompanyCategoryUIStandardService.prototype = Object.create(BaseService.prototype);
				CompanyCategoryUIStandardService.prototype.constructor = CompanyCategoryUIStandardService;

				return new BaseService(companyCategoryDetailLayout, companyCategoryAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
