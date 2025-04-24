/**
 * Created by henkel on 16.09.2014
 */

(function () {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyPeriodsUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of company entities
	 */
	angular.module(moduleName).factory('basicsCompanyPeriodsUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.periodsdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['companyyearfk', 'tradingperiod', 'startdate', 'enddate', 'periodstatusstockfk', 'periodstatusapfk', 'periodstatusarfk', 'remark', 'preliminaryactual', 'periodstatusfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							companyyearfk: {
								readonly: true,
								detail: {
									type: 'integer',
									formatter: 'integer',
									model: 'Year.TradingYear'
								},
								grid: {
									formatter: 'integer',
									field: 'Year.TradingYear'
								}
							},
							periodstatusstockfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.status'),
							periodstatusapfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.status'),
							periodstatusarfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.status'),
							periodstatusfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.status')
						}
					};
				}

				var companyPeriodsDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companyPeriodsAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CompanyPeriodDto',
					moduleSubModule: 'Basics.Company'
				});

				companyPeriodsAttributeDomains = companyPeriodsAttributeDomains.properties;

				return new BaseService(companyPeriodsDetailLayout, companyPeriodsAttributeDomains, basicsCompanyTranslationService);
			}
		]);
})();
