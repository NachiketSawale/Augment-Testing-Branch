(function () {
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc service
	 * @name schedulingService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('basicsCostGroupsStandardConfigurationService', ['platformUIStandardConfigService', 'basicsCostgroupsTranslationService', 'basicsCostGroupsUIConfigurationService', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsCostGroupsTranslationService, basicsCostGroupsUIConfigurationService, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var costGroupAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'CostGroupDto',
				moduleSubModule: 'Basics.CostGroups'
			});

			if (costGroupAttributeDomains) {
				costGroupAttributeDomains = costGroupAttributeDomains.properties;
			}

			function CostGroupUIStandardService(layout, schema, translateService) {
				BaseService.call(this, layout, schema, translateService);
			}

			CostGroupUIStandardService.prototype = Object.create(BaseService.prototype);
			CostGroupUIStandardService.prototype.constructor = CostGroupUIStandardService;

			return new BaseService(basicsCostGroupsUIConfigurationService, costGroupAttributeDomains, basicsCostGroupsTranslationService);
		}
	]);
})();
