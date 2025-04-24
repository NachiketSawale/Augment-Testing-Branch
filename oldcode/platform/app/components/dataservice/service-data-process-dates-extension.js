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

	angular.module('platform').factory('ServiceDataProcessDatesExtension', ['_', function (_) {

		return function (fields) {

			var self = this;
			self.processItem = function processItem(item) {
				_.forEach(fields, function (field) {
					if (_.get(item, field)) {
						_.set(item, field, moment.utc(_.get(item, field)));
					}
				});
			};

			self.revertProcessItem = function revertProcessItem(item) {
				_.forEach(fields, function (field) {
					if (_.get(item, field) && !angular.isString(_.get(item, field))) {
						// always format as utc string, Newtonsoft sometimes has issues with localised strings!
						_.set(item, field, _.get(item, field).utc().format());
					}
				});
			};
		};
	}]);
})(angular);