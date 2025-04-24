/**
 * Created by csalopek on 14.08.2017.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingExtSysCalendarValidationService
	 * @description provides validation methods for calendar instances
	 */
	angular.module('scheduling.extsys').factory('schedulingExtSysCalendarValidationService', ['platformDataValidationService', 'schedulingExtSysCalendarService',

		function (/* platformDataValidationService, schedulingExtSysCalendarService */) {

			var service = {};

			service.validateCalendarFk = function (entity, value) {
				var result = true;
				if(value === null) {
					result = false;
				}
				return result;// Returns allways true, no result admoinistraiton is to be done
			};

			return service;
		}

	]);

})(angular);
