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

	angular.module('timekeeping.recording').factory('TimekeepingRecordingDataProcessTimesExtension', [ function () {

		return function (fields, format) {

			let self = this;
			if(!format) {
				format = function () {
				};
				format.parse = function (string) {
					let datetime = string.split('T');
					let dateParts = datetime[0].split('-');
					let res = datetime[1].split(':');
					let month = parseInt(dateParts[1]) - 1;
					let date = moment({year: dateParts[0], month: month, date: dateParts[2], hour: res[0], minute: res[1], second: res[2] })
					return isNaN(date) ? null : date;
				};
			}

			self.processItem = function processItem(item) {
				if (fields.length > 0) {
					for (let n = 0; n < fields.length; ++n) {
						if(item[fields[n]] && angular.isString(item[fields[n]])){
							item[fields[n]] = format.parse(item[fields[n]]);
						}
					}
				}
			};

			self.revertProcessItem = function revertProcessItem(item) {
				if (fields.length > 0) {
					for (let n = 0; n < fields.length; ++n) {
						if(item[fields[n]] && !angular.isString(item[fields[n]])){
							item[fields[n]] = item[fields[n]].format('YYYY-MM-DDTHH:mm:ss') + 'Z';
						}
					}
				}
			};
		};
	}]);
})(angular);