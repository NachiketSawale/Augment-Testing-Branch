/**
 * Created by mov on 4/19/2017.
 */

(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqWicCatBoqStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for wic cat boq entities
	 */
	angular.module(moduleName).factory('boqMainWic2AssemblyStandardConfigurationService',
		['platformUIStandardConfigService', 'platformSchemaService', 'boqMainWic2AssemblyUIConfigurationService', 'boqMainTranslationService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, platformSchemaService, boqMainWic2AssemblyUIConfigurationService, boqMainTranslationService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'BoqWic2assemblyDto', moduleSubModule: 'Boq.Main'});
				attributeDomains = attributeDomains.properties;

				function Wic2AssemblyUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				Wic2AssemblyUIStandardService.prototype = Object.create(BaseService.prototype);
				Wic2AssemblyUIStandardService.prototype.constructor = Wic2AssemblyUIStandardService;

				var wic2AssemblyListLayout = boqMainWic2AssemblyUIConfigurationService.getWic2AssemblyListLayout(false);
				var service = new BaseService(wic2AssemblyListLayout, attributeDomains, boqMainTranslationService);

				platformUIStandardExtentService.extend(service, wic2AssemblyListLayout.addition, attributeDomains);

				return service;

			}
		]);
})();
