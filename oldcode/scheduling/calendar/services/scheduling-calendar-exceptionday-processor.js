/**
 * Created by henkel on 16.04.2015.
 */


(function (angular) {
	'use strict';
	angular.module('scheduling.calendar').factory('schedulingCalendarExceptiondayProcessor', ['platformRuntimeDataService', function (platformRuntimeDataService) {

		var service = {};
		service.processItem = function processItem(exceptionday) {
			var fields = null;
			if (exceptionday.IsWorkday !== true) {
				fields = [
					{
						field: 'WorkStart',
						readonly: true
					},
					{
						field: 'WorkEnd',
						readonly: true
					}
				];
			}else{
				fields = [
					{
						field: 'WorkStart',
						readonly: false
					},
					{
						field: 'WorkEnd',
						readonly: false
					}
				];
			}
			platformRuntimeDataService.readonly(exceptionday, fields);
		};

		return service;

	}]);
})(angular);