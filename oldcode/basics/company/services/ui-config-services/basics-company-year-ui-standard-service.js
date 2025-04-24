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
	angular.module(moduleName).factory('basicsCompanyYearUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService','basicsLookupdataConfigGenerator' , 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {


				function createMainDetailLayout() {
					return {
						fid: 'basics.company.yeardetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: [ 'tradingyear', 'startdate', 'enddate', 'preliminaryactual']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
						}
					};
				}
				var companyYearDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyYearAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'CompanyYearDto', moduleSubModule: 'Basics.Company'} );

				companyYearAttributeDomains = companyYearAttributeDomains.properties;



				function CompanyYearUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				CompanyYearUIStandardService.prototype = Object.create(BaseService.prototype);
				CompanyYearUIStandardService.prototype.constructor = CompanyYearUIStandardService;

				return new BaseService(companyYearDetailLayout, companyYearAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
