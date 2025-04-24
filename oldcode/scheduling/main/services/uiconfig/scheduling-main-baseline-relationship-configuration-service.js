(function () {
	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainBaselineRelationshipConfigurationService',

		['_', 'platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService',

			function (_, platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				let relationshipAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ActivityRelationshipDto',
					moduleSubModule: 'Scheduling.Main'
				});
				if (relationshipAttributeDomains) {
					relationshipAttributeDomains = relationshipAttributeDomains.properties;
				}

				function SchedulingUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				SchedulingUIStandardService.prototype = Object.create(BaseService.prototype);
				SchedulingUIStandardService.prototype.constructor = SchedulingUIStandardService;

				let schedulingMainActivityRelationshipDetailLayout = _.cloneDeep(schedulingMainUIConfigurationService.getActivityRelationshipDetailLayout());

				return new BaseService(schedulingMainActivityRelationshipDetailLayout, relationshipAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
