/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainAssemblyRelateWicConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for Related Assemblies for WIC container for Estimate Main module
	 */
	angular.module(moduleName).factory('estimateMainAssemblyRelateWicConfigurationService',
		['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainWic2AssemblyUIConfigurationService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainWic2AssemblyUIConfigurationService, platformUIStandardExtentService) {

				let BaseService = platformUIStandardConfigService;

				let attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqWic2assemblyDto',
					moduleSubModule: 'Boq.Main'
				});

				function EstimateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;
				let wic2AssemblyListLayout = boqMainWic2AssemblyUIConfigurationService.getWic2AssemblyListLayout(true);
				let service =  new BaseService(wic2AssemblyListLayout, attributeDomains.properties, boqMainTranslationService);
				platformUIStandardExtentService.extend(service, wic2AssemblyListLayout.addition, attributeDomains.properties);
				return service;
			}
		]);
})();
