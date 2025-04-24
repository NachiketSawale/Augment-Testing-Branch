/**
 * Created by aljami on 27.10.2020.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';
	var configModule = new angular.module(moduleName);

	configModule.factory('basicsConfigDashboardXModuleUIService', basicsConfigDashboardXModuleUIService);
	basicsConfigDashboardXModuleUIService.$inject = ['platformUIConfigInitService', 'platformUIStandardConfigService', 'basicsConfigTranslationService', 'basicsConfigDashboardXModuleLayout', 'platformSchemaService'];

	function basicsConfigDashboardXModuleUIService(platformUIConfigInitService, platformUIStandardConfigService, translationService, layout, platformSchemaService) {
		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'Dashboard2moduleDto',
			moduleSubModule: 'Basics.Config'
		});

		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}

		function ConfigUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		ConfigUIStandardService.prototype = Object.create(BaseService.prototype);
		ConfigUIStandardService.prototype.constructor = ConfigUIStandardService;

		return new BaseService(layout, domainSchema, translationService);
	}

})(angular);