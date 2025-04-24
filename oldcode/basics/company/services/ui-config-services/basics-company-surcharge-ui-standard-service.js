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
	angular.module(moduleName).factory('basicsCompanySurchargeUIStandardService',
		['platformUIStandardConfigService', 'basicsCompanyTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCompanyTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.company.surchargedetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['mdccostcodefk', 'rate', 'surcharge', 'contribution', 'remark', 'isdefault', 'extra']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							mdccostcodefk: {
								'detail': {
									'type': 'directive',
									'directive': 'basics-cost-codes-lookup',
									'options': {
										showClearButton: true
									}
								},
								'grid': {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'costcode',
										displayMember: 'Code'
									},
									editor: 'lookup',
									editorOptions: {
										lookupField: 'CostCodeFk',
										lookupOptions: {showClearButton: true},
										directive: 'basics-cost-codes-lookup'
									}
								}
							}
						}
					};
				}

				var companySurchargeDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var companySurchargeAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'Company2CostCodeDto',
					moduleSubModule: 'Basics.Company'
				});

				companySurchargeAttributeDomains = companySurchargeAttributeDomains.properties;

				return new BaseService(companySurchargeDetailLayout, companySurchargeAttributeDomains, basicsCompanyTranslationService);
			}

		]);
})();
