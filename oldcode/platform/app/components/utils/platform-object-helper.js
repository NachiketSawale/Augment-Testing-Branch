/*
 * $Id: platform-object-helper.js 634282 2021-04-27 16:17:27Z baf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global _ */
	'use strict';

	/**
	 * @ngdoc constant
	 * @name platformObjectHelper
	 * @description helper methods to get/set object values using dot-notation (e.g. property1.property2.mydata = value)
	 */
	angular.module('platform-helper').constant('platformObjectHelper', {

		setValue: function setValue(entity, field, value) {
			_.set(entity, field, value);
		},

		getValue: function getValue(entity, field, defaultValue) {
			if (field) {
				return _.get(entity, field, defaultValue !== undefined ? defaultValue : null);
			}

			return null;
		},

		checkProperty: function checkProperty(entity, field) {
			var result = false;

			if (field) {
				var props = field.split('.');

				_.each(props, function (prop) {
					if (entity) {
						result = entity.hasOwnProperty(prop);
						entity = entity[prop];
					}
				});
			}

			return result;
		},

		// checks references for null or undefined
		// can be called with arbitrary number of parameters
		// objectHelper.isSet(myBool, myList, myOtherValue);
		// returns false after the first argument is null or undefined otherwise true
		isSet: function isSet() {
			var result = false;
			_.each(arguments, function (arg) {
				result = (arg !== null && arg !== undefined);
				if (!result) {
					return result;
				}
			});

			return result;
		},

		// checks if value is an angular promise
		isPromise: function (value) {
			return value && _.isFunction(value.then);
		},

		extendGrouping: function extendGrouping(gridColumns) {
			angular.forEach(gridColumns, function (column) {
				angular.extend(column, {
					grouping: {
						title: column.name$tr$,
						getter: column.field,
						aggregators: [],
						aggregateCollapsed: true
					}
				});
			});

			return gridColumns;
		},

		arrayItemMove: function arrayItemMove(arr, from, to) {
			arr.splice(to, 0, arr.splice(from, 1)[0]);
			return arr;
		},

		/**
		 * @ngdoc function
		 * @name cleanupScope
		 * @function
		 * @methodOf platformObjectHelper
		 * @description removes all properties of given $scope not starting with $
		 * @param {object} scope $scope to be cleaned
		 * @param {object} $timeout $timeout or null (called immediately)
		 */
		cleanupScope: function cleanupScope(/* scope, $timeout */) {
			return;
		}
	});
})(angular);
