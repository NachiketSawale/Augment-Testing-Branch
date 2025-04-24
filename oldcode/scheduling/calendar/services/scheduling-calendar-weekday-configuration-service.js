/**
 * Created by leo on 04.11.2014.
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
	angular.module(moduleName).factory('schedulingCalendarWeekdayConfigurationService', ['platformUIStandardConfigService', 'schedulingCalendarTranslationService', 'schedulingCalendarMainUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingCalendarTranslationService, schedulingCalendarMainUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var weekdayAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'WeekdayDto', moduleSubModule: 'Scheduling.Calendar'} );
			weekdayAttributeDomains = weekdayAttributeDomains.properties;

			function CalendarUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CalendarUIStandardService.prototype = Object.create(BaseService.prototype);
			CalendarUIStandardService.prototype.constructor = CalendarUIStandardService;

			var schedulingCalendarWeekdayDetailLayout = schedulingCalendarMainUIConfig.getWeekdayDetailLayout();
			return new BaseService(schedulingCalendarWeekdayDetailLayout, weekdayAttributeDomains, schedulingCalendarTranslationService);
		}
	]);
})();