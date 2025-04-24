/**
 * Created by zen on 5/17/2017.
 */
(function () {
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainTextUIStandardService', ['platformUIStandardConfigService', 'platformSchemaService',
		'boqMainTextGridConfigurationService', 'platformUIStandardExtentService', 'boqMainTextTranslationService',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTextGridConfigurationService, platformUIStandardExtentService, boqMainTextTranslationService) {
			var BaseService = platformUIStandardConfigService;
			var boqMainTextDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'BoqTextConfigurationDto',
				moduleSubModule: 'Boq.Main'
			});

			if (boqMainTextDomainSchema) {
				boqMainTextDomainSchema = boqMainTextDomainSchema.properties;
			}

			function BoqMainTextUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			BoqMainTextUIStandardService.prototype = Object.create(BaseService.prototype);
			BoqMainTextUIStandardService.prototype.constructor = BoqMainTextUIStandardService;
			var layout = boqMainTextGridConfigurationService.getBoqMainTextGridLayout();
			var service = new BaseService(layout, boqMainTextDomainSchema, boqMainTextTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, boqMainTextDomainSchema);
			return service;
		}]);
})();