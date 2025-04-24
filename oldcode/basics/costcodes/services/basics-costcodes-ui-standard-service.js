/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostcodesUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of costcodes entities
	 */
	angular.module(moduleName).factory('basicsCostCodesUIStandardService', ['platformUIStandardConfigService', 'platformUIStandardExtentService',
		'basicsCostCodesTranslationService', 'basicsCostCodesUIConfigurationService', 'platformSchemaService',
		function (platformUIStandardConfigService, platformUIStandardExtentService, basicsCostCodesTranslationService, basicsCostCodesUIConfigurationService, platformSchemaService) {

			let BaseService = platformUIStandardConfigService;

			let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CostCodeDto',
				moduleSubModule: 'Basics.CostCodes'
			});
			if (costCodeDomainSchema) {
				costCodeDomainSchema = costCodeDomainSchema.properties;
			}
			function CostCodeUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CostCodeUIStandardService.prototype = Object.create(BaseService.prototype);
			CostCodeUIStandardService.prototype.constructor = CostCodeUIStandardService;
			let layout = basicsCostCodesUIConfigurationService.getBasicsCostCodesDetailLayout();
			let service = new BaseService(layout, costCodeDomainSchema, basicsCostCodesTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, costCodeDomainSchema);
			return service;
		}
	]);
})();
