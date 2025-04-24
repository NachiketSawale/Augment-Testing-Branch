/**
 * Created by joshi on 16.09.2014.
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
	angular.module(moduleName).factory('basicsCostCodesPriceVersionListRecordUIStandardService',
		['platformUIStandardConfigService', 'platformUIStandardExtentService',
			'basicsCostCodesPriceVersionListRecordTranslationService',
			'basicsCostCodesPriceVersionListRecordUIConfigurationService',
			'platformSchemaService',
			function (platformUIStandardConfigService, platformUIStandardExtentService,
				translationService, UIConfigurationService, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'CostcodePriceListDto',
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
