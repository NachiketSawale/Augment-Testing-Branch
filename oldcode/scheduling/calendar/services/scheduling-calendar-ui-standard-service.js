/**
 * Created by leo on 16.09.2014
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
	angular.module(moduleName).factory('schedulingCalendarUIStandardService', ['platformUIStandardConfigService', 'schedulingCalendarTranslationService', 'schedulingCalendarMainUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingCalendarTranslationService, schedulingCalendarMainUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var calendarAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'CalendarDto', moduleSubModule: 'Scheduling.Calendar'} );
			calendarAttributeDomains = calendarAttributeDomains.properties;

			function CalendarUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CalendarUIStandardService.prototype = Object.create(BaseService.prototype);
			CalendarUIStandardService.prototype.constructor = CalendarUIStandardService;

			var schedulingCalendarMainDetailLayout = schedulingCalendarMainUIConfig.getCalendarDetailLayout();

			return new BaseService(schedulingCalendarMainDetailLayout, calendarAttributeDomains, schedulingCalendarTranslationService);
		}
	]);
})();
