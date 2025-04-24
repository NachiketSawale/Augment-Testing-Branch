/*
* $Id$
* Copyright(c) RIB Software GmbH
*/
(function () {
	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostcodesReferenceConfigurationService
	 * @function
	 * @description
	 * basicsCostcodesReferenceConfigurationService is the data service for cost code reference functions.
	 */
	angular.module(moduleName).factory('basicsCostcodesReferenceConfigurationService', [
		'$log', 'platformUIStandardConfigService', 'platformSchemaService', 'basicsCostCodesUIConfigurationService','basicsCostCodesTranslationService','platformUIStandardExtentService',
		function ($log, platformUIStandardConfigService, platformSchemaService, basicsCostCodesUIConfigurationService, basicsCostCodesTranslationService, platformUIStandardExtentService) {

			let BaseService = platformUIStandardConfigService;

			let costCodeDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CostCodesReferencesDto',
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
			let layout = basicsCostCodesUIConfigurationService.getBasicsCostCodesReferenceLayout();
			let service = new BaseService(layout, costCodeDomainSchema, basicsCostCodesTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, costCodeDomainSchema);

			return service;
		}
	]);
})();
