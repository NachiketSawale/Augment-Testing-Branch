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
	angular.module(moduleName).factory('schedulingCalendarExceptionDayConfigurationService', ['platformUIStandardConfigService', 'schedulingCalendarTranslationService', 'schedulingCalendarExceptionDayDetailLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingCalendarTranslationService, schedulingCalendarExceptionDayDetailLayout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var exceptionDayAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ExceptionDayDto', moduleSubModule: 'Scheduling.Calendar'} );
			exceptionDayAttributeDomains = exceptionDayAttributeDomains.properties;

			function CalendarUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CalendarUIStandardService.prototype = Object.create(BaseService.prototype);
			CalendarUIStandardService.prototype.constructor = CalendarUIStandardService;

			return new BaseService(schedulingCalendarExceptionDayDetailLayout, exceptionDayAttributeDomains, schedulingCalendarTranslationService);
		}
	]);
})();