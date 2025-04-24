(function () {
	'use strict';
	var moduleName = 'basics.site';
	/**
	 * @ngdoc service
	 * @name basicsSiteUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of site entities
	 */
	angular.module(moduleName).factory('basicsSiteUIStandardService', BasicsSiteUIStandardService);

	BasicsSiteUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsSiteTranslationService',
		'platformSchemaService', 'basicsSiteDetailLayout', 'platformUIStandardExtentService', 'basicsSiteMainLayoutConfig'];

	function BasicsSiteUIStandardService(platformUIStandardConfigService, basicsSiteTranslationService,
		platformSchemaService, basicsSiteDetailLayout, platformUIStandardExtentService, basicsSiteMainLayoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var siteAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'SiteDto', moduleSubModule: 'Basics.Site' });
		siteAttributeDomains = siteAttributeDomains.properties;

		function SiteUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		SiteUIStandardService.prototype = Object.create(BaseService.prototype);
		SiteUIStandardService.prototype.constructor = SiteUIStandardService;

		var service =  new BaseService(basicsSiteDetailLayout, siteAttributeDomains, basicsSiteTranslationService);

		platformUIStandardExtentService.extend(service, basicsSiteMainLayoutConfig.addition, siteAttributeDomains);

		service.getProjectMainLayout = function () {
			return basicsSiteDetailLayout;
		};

		return service;
	}
})();
