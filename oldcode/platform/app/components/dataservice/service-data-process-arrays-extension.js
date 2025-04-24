/**
 * Created by baf on 11.09.2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ServiceDataProcessArraysExtension
	 * @function
	 *
	 * @description
	 * The ServiceDataProcessArraysExtension converts array fields which are null or undefined into empty arrays.
	 */

	angular.module('platform').factory('ServiceDataProcessArraysExtension', ['_', function (_) {

		return function (fields) {

			var self = this;

			self.processItem = function processItem(item) {
				if (fields.length > 0) {
					_.map(fields, function (field) {
						return item[field] ? item[field] : item[field] = [];
					});
				}
			};

		};
	}]);
})(angular);