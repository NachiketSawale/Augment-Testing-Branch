/**
 * Created by anl on 5/14/2018.
 */

(function (angular) {
	'use strict';
	/* global moment */

	var moduleName = 'productionplanning.report';
	angular.module(moduleName).factory('productionplanningReportTimeFieldProcessor', [ function () {

		return function (fields, format) {

			var self = this;
			if(!format) {
				format = function () {
				};
				format.parse = function (string) {
					var date = string;
					if(angular.isString(date)) {
						var res = string.split(':');
						date = moment({hour: res[0], minute: res[1], second: res[2]});
					}
					return isNaN(date) ? null : date;
				};
			}

			self.processItem = function processItem(item) {
				if (fields.length > 0) {
					for (var n = 0; n < fields.length; ++n) {
						if(item[fields[n]]){
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