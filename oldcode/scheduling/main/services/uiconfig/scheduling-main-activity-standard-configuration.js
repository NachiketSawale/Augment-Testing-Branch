/**
 * Created by welss on 10.06.2014.
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
	angular.module(moduleName).factory('schedulingMainActivityStandardConfigurationService', ['platformUIStandardConfigService', 'schedulingMainTranslationService', 'schedulingMainUIConfigurationService', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingMainTranslationService, schedulingMainUIConfigurationService, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var activityAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'ActivityDto',
				moduleSubModule: 'Scheduling.Main'
			});
			if (activityAttributeDomains) {
				activityAttributeDomains = activityAttributeDomains.properties;
				activityAttributeDomains.Icon ={ domain : 'multiImage'};
			}

			var schedulingMainActivityDetailLayout = schedulingMainUIConfigurationService.getActivityDetailLayout();

			return new BaseService(schedulingMainActivityDetailLayout, activityAttributeDomains, schedulingMainTranslationService);
		}
	]);
})();
