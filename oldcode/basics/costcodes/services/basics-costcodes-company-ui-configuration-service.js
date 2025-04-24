/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodesCompanyUIConfigurationService
	 * @function
	 *
	 * @description
	 *basicsCostCodesCompanyConfigService
	 */
	angular.module(moduleName).factory('basicsCostCodesCompanyUIConfigurationService',
		['platformUIStandardConfigService',
			'basicsCostCodesTranslationService',
			'platformSchemaService',
			function (platformUIStandardConfigService,
				basicsCostCodesTranslationService,
				platformSchemaService) {

				let BaseService = platformUIStandardConfigService;
				let costCodesCompanyLayout = {

					'fid': 'basics.costcodes.usedincompany.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['code', 'companyname', 'ischecked']
						}
					],

					'overloads': {
						'code': {
							readonly: true
						},
						'companyname': {
							readonly: true
						}
					}
				};

				let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({typeName: 'CompanyDto',moduleSubModule: 'Basics.Company'});
				if (costCodeDomainSchema) {
					costCodeDomainSchema = costCodeDomainSchema.properties;
					costCodeDomainSchema.IsChecked ={ domain : 'boolean'};
				}
				function CostCodeUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				CostCodeUIStandardService.prototype = Object.create(BaseService.prototype);
				CostCodeUIStandardService.prototype.constructor = CostCodeUIStandardService;
				return new BaseService(costCodesCompanyLayout, costCodeDomainSchema, basicsCostCodesTranslationService);
			}
		]);
})(angular);

