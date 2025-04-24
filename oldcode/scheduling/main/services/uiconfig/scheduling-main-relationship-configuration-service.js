/**
 * Created by leo on 03.11.2014.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingService
	 * @function
	 *
	 * @description
	 * schedulingService is the data service for all scheduling data functions.
	 */
	angular.module(moduleName).factory('schedulingMainRelationshipConfigurationService',

		['platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService',

			function (platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var relationshipAttributeDomains = platformSchemaService.getSchemaFromCache({
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

				var schedulingMainActivityRelationshipDetailLayout = schedulingMainUIConfigurationService.getActivityRelationshipDetailLayout();

				return new BaseService(schedulingMainActivityRelationshipDetailLayout, relationshipAttributeDomains, schedulingMainTranslationService);
			}
		]);
})();
