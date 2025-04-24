/**
 * Created by leo on 03.11.2014.
 */

(function () {
	'use strict';
	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc service
	 * @name schedulingCalendarUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of calendar entities
	 */
	angular.module(moduleName).factory('schedulingCalendarWorkhourConfigurationService', ['platformUIStandardConfigService', 'schedulingCalendarTranslationService', 'schedulingCalendarMainUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingCalendarTranslationService, schedulingCalendarMainUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var workhourAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'WorkHourDto', moduleSubModule: 'Scheduling.Calendar'} );
			workhourAttributeDomains = workhourAttributeDomains.properties;

			function CalendarUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CalendarUIStandardService.prototype = Object.create(BaseService.prototype);
			CalendarUIStandardService.prototype.constructor = CalendarUIStandardService;

			var schedulingWorkhourDetailLayout = schedulingCalendarMainUIConfig.getWorkhourDetailLayout();

			return new BaseService(schedulingWorkhourDetailLayout, workhourAttributeDomains, schedulingCalendarTranslationService);
		}
	]);
})();