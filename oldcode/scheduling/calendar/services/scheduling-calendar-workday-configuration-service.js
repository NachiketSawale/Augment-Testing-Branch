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
	angular.module(moduleName).factory('schedulingCalendarWorkdayConfigurationService', ['platformUIStandardConfigService', 'schedulingCalendarTranslationService', 'schedulingCalendarWorkdayDetailLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingCalendarTranslationService, schedulingCalendarWorkdayDetailLayout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var workdayAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'WorkdayDto', moduleSubModule: 'Scheduling.Calendar'} );
			workdayAttributeDomains = workdayAttributeDomains.properties;

			function CalendarUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			CalendarUIStandardService.prototype = Object.create(BaseService.prototype);
			CalendarUIStandardService.prototype.constructor = CalendarUIStandardService;

			return new BaseService(schedulingCalendarWorkdayDetailLayout, workdayAttributeDomains, schedulingCalendarTranslationService);
		}
	]);
})();
