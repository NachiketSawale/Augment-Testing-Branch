(function () {
	'use strict';
	var moduleName = 'resource.master';
	/**
	 * @ngdoc service
	 * @name resourceMasterUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of master entities
	 */
	angular.module(moduleName).factory('resourceMasterUIStandardService', resourceMasterUIStandardService);

	resourceMasterUIStandardService.$inject = ['platformUIStandardConfigService', 'resourceMasterTranslationService',
		'platformSchemaService', 'resourceMasterLayout', 'platformUIStandardExtentService', 'resourceMasterMainLayoutConfig'];

	function resourceMasterUIStandardService(platformUIStandardConfigService, resourceMasterTranslationService,
	                                         platformSchemaService, resourceMasterLayout, platformUIStandardExtentService, resourceMasterMainLayoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var masterAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'ResourceDto',
			moduleSubModule: 'Resource.Master'
		});
		masterAttributeDomains = masterAttributeDomains.properties;

		function MasterUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		MasterUIStandardService.prototype = Object.create(BaseService.prototype);
		MasterUIStandardService.prototype.constructor = MasterUIStandardService;

		var service = new BaseService(resourceMasterLayout, masterAttributeDomains, resourceMasterTranslationService);

		platformUIStandardExtentService.extend(service, resourceMasterMainLayoutConfig.addition, masterAttributeDomains);

		service.getProjectMainLayout = function () {
			return resourceMasterLayout;
		};

		return service;
	}
})();
