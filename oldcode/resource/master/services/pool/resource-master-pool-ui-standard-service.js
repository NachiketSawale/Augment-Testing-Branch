(function () {
	'use strict';
	var moduleName = 'resource.master';
	/**
	 * @ngdoc service
	 * @name resourceMasterPoolUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of master entities
	 */
	angular.module(moduleName).factory('resourceMasterPoolUIStandardService', resourceMasterPoolUIStandardService);

	resourceMasterPoolUIStandardService.$inject = ['platformUIStandardConfigService', 'resourceMasterTranslationService',
		'platformSchemaService', 'resourceMasterPoolLayout', 'platformUIStandardExtentService', 'resourceMasterPoolLayoutConfig'];

	function resourceMasterPoolUIStandardService(platformUIStandardConfigService, resourceMasterTranslationService,
	                                             platformSchemaService, resourceMasterPoolLayout, platformUIStandardExtentService, resourceMasterPoolLayoutConfig) {

		var BaseService = platformUIStandardConfigService;

		var masterAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'PoolDto',
			moduleSubModule: 'Resource.Master'
		});
		masterAttributeDomains = masterAttributeDomains.properties;

		function MasterPoolUIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		MasterPoolUIStandardService.prototype = Object.create(BaseService.prototype);
		MasterPoolUIStandardService.prototype.constructor = MasterPoolUIStandardService;

		var service = new BaseService(resourceMasterPoolLayout, masterAttributeDomains, resourceMasterTranslationService);

		platformUIStandardExtentService.extend(service, resourceMasterPoolLayoutConfig.addition, masterAttributeDomains);

		service.getProjectMainLayout = function () {
			return resourceMasterPoolLayout;
		};

		return service;
	}
})();
