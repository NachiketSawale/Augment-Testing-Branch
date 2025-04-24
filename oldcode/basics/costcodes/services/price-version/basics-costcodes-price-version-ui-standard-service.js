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
	angular.module(moduleName).factory('basicsCostCodesPriceVersionUIStandardService', ['platformUIStandardConfigService', 'platformUIStandardExtentService',
		'basicsCostCodesPriceVersionTranslationService', 'basicsCostCodesPriceVersionUIConfigurationService', 'platformSchemaService',
		function (platformUIStandardConfigService, platformUIStandardExtentService,
			translationService, UIConfigurationService, platformSchemaService) {

			let BaseService = platformUIStandardConfigService;

			let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CostcodePriceVerDto',
				moduleSubModule: 'Basics.CostCodes'
			});
			if (costCodeDomainSchema) {
				costCodeDomainSchema = costCodeDomainSchema.properties;
			}
			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;
			let layout = UIConfigurationService.getDetailLayout();
			let service = new BaseService(layout, costCodeDomainSchema, translationService);
			platformUIStandardExtentService.extend(service, layout.addition, costCodeDomainSchema);
			return service;
		}
	]);
})();
