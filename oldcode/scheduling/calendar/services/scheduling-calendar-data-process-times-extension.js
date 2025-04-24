/**
 * Created by baf on 11.09.2014.
 */
(function (angular) {
	/* global moment */
	'use strict';
	/**
	 * @ngdoc service
	 * @name ServiceDataProcessDatesExtension
	 * @function
	 *
	 * @description
	 * The ServiceDataProcessDatesExtension converts date strings into real date variables.
	 */

	angular.module('scheduling.calendar').factory('SchedulingDataProcessTimesExtension', [ function () {

		return function (fields, format) {

			var self = this;
			if(!format) {
				format = function () {
				};
				format.parse = function (string) {
					var res = string.split(':');
					var date = moment({hour: res[0], minute: res[1], second: res[2]});
					return isNaN(date) ? null : date;
				};
			}

			self.processItem = function processItem(item) {
				if (fields.length > 0) {
					for (var n = 0; n < fields.length; ++n) {
						if(item[fields[n]] && angular.isString(item[fields[n]])){
							item[fields[n]] = format.parse(item[fields[n]]);
						}
					}
				}
			};

			self.revertProcessItem = function revertProcessItem(item) {
				if (fields.length > 0) {
					for (var n = 0; n < fields.length; ++n) {
						if(item[fields[n]] && !angular.isString(item[fields[n]])){
							item[fields[n]] = item[fields[n]].format('HH:mm:ss');
						}
					}
				}
			};
		};
	}]);
})(angular);