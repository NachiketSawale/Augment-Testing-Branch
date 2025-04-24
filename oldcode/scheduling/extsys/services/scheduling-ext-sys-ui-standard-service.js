/**
 * Created by csalopek on 14.08.2017.
 */

(function () {
	'use strict';
	var moduleName = 'scheduling.extsys';

	/**
	 * @ngdoc service
	 * @name schedulingExtSysCalendarUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of calendar entities
	 */
	angular.module(moduleName).factory('schedulingExtSysCalendarUIStandardService', ['platformUIStandardConfigService', 'schedulingExtSysCalendarTranslationService', 'schedulingExtSysCalendarMainUIConfig', 'platformSchemaService',

		function (platformUIStandardConfigService, schedulingExtSysCalendarTranslationService, schedulingExtSysCalendarMainUIConfig, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var calendarAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'Calendar2ExternalDto', moduleSubModule: 'Scheduling.ExtSys'} );
			calendarAttributeDomains = calendarAttributeDomains.properties;

			var schedulingCalendarMainDetailLayout = schedulingExtSysCalendarMainUIConfig.getCalendarLayout();

			return new BaseService(schedulingCalendarMainDetailLayout, calendarAttributeDomains, schedulingExtSysCalendarTranslationService);
		}
	]);
})();
