/*
 * $Id: platform-watch-list-service.js 540289 2019-04-04 12:55:43Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformWatchListService
	 * @function
	 * @requires
	 *
	 * @description A small service that can process lists of Angular watch definitions that can be applied to any
	 *              scope object.
	 */
	angular.module('platform').factory('platformWatchListService', [
		function () {
			var service = {};

			/**
			 * @ngdoc function
			 * @name createWatches
			 * @function
			 * @methodOf platformWatchListService
			 * @description Initializes watches for a given scope based upon a given collection of watch definitions.
			 * @param {Array<Object>} list The list of watch definitions. Each watch definition is expected to contain
			 *                             an `expression` property that specifies what to watch (as a string or as a
			 *                             function), and an `fn` property that specifies a function to invoke when the
			 *                             watch detects a change.
			 * @param {Object} scope The scope on which to register the watches.
			 * @param {String} expressionPrefix The common prefix prepended to each string expression.
			 * @param {Function} enrichInfoObject Optionally, a function that receives the prepared info object passed
			 *                                    to watch handlers, so more properties can be added. The additional
			 *                                    properties should be inserted directly into the passed object
			 *                                    reference.
			 * @returns {String} The identifier of the current item source.
			 */
			service.createWatches = function (list, scope, expressionPrefix, enrichInfoObject) {
				if (!angular.isArray(list)) {
					return function () {
					};
				}

				var finalizers = [];

				list.forEach(function (watchDecl) {
					var watchExpr;
					if (angular.isFunction(watchDecl.expression)) {
						watchExpr = watchDecl.expression;
					} else {
						watchExpr = (angular.isString(expressionPrefix) ? expressionPrefix : '') + watchDecl.expression;
					}

					finalizers.push(scope.$watch(watchExpr, function (newValue, oldValue) {
						if (newValue !== oldValue) {
							var infoObject = {
								newValue: newValue,
								oldValue: oldValue,
								scope: scope
							};
							if (angular.isFunction(enrichInfoObject)) {
								enrichInfoObject(infoObject);
							}
							watchDecl.fn(infoObject);
						}
					}, Boolean(watchDecl.deep)));
				});

				return function () {
					finalizers.forEach(function (f) {
						f();
					});
				};
			};

			return service;
		}]);
})();