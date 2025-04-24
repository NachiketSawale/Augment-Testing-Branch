/*
 * $Id: platform-promise-utilities-service.js 621816 2021-01-29 11:17:38Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformPromiseUtilitiesService
	 * @function
	 *
	 * @description Provides helper routines related to promises.
	 */
	angular.module('platform').factory('platformPromiseUtilitiesService', ['$q', '_',
		function ($q, _) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name doWhile
			 * @function
			 * @methodOf platformPromiseUtilitiesService
			 * @description Repeatedly executes an asynchronous function like in a do-while-loop.
			 * @param {Function} bodyFunc A function representing a single iteration of the loop. It may return a
			 *                            promise. The function receives the return value of the previous iteration,
			 *                            or the value a promise returned from the previous iteration resolves to,
			 *                            or `initialArgs` if it is the first call to `bodyFunc` as its only argument.
			 * @param {Function} conditionFunc A function that returns a truthy value iff another iteration should take
			 *                                 place, based on the return value from the last call to `bodyFunc`, or the
			 *                                 value a promise returned by the last call to `bodyFunc` resolves to.
			 * @param {any} initialArgs A value or object that is passed as an argument to `bodyFunc` when that function
			 *                          is invoked for the first time.
			 * @returns {any} A promise that resolves to the last return value of `bodyFunc`.
			 */
			service.doWhile = function (bodyFunc, conditionFunc, initialArgs) {
				var resultDeferred, chain;

				var iterate = function (args) {
					return $q.when(bodyFunc(args)).then(function (result) {
						if (conditionFunc(result)) {
							chain = chain.then(iterate);
							return result;
						} else {
							resultDeferred.resolve(result);
						}
					}, function (reason) {
						resultDeferred.reject(reason);
					});
				};

				resultDeferred = $q.defer();

				chain = iterate(initialArgs);

				return resultDeferred.promise;
			};

			/**
			 * @ngdoc function
			 * @name while
			 * @function
			 * @methodOf platformPromiseUtilitiesService
			 * @description Repeatedly executes an asynchronous function like in a do-while-loop.
			 * @param {Function} bodyFunc A function representing a single iteration of the loop. It may return a
			 *                            promise. The function receives the return value of the previous iteration,
			 *                            or the value a promise returned from the previous iteration resolves to,
			 *                            or `initialArgs` if it is the first call to `bodyFunc` as its only argument.
			 * @param {Function} conditionFunc A function that returns a truthy value iff another iteration should take
			 *                                 place, based on the return value from the last call to `bodyFunc`, or the
			 *                                 value a promise returned by the last call to `bodyFunc` resolves to, or
			 *                                 `initialArgs` for the first call to `conditionFunc`.
			 * @param {any} initialArgs A value or object that is passed as an argument to `bodyFunc` when that function
			 *                          is invoked for the first time.
			 * @returns {any} A promise that resolves to the last return value of `bodyFunc`.
			 */
			service.while = function (bodyFunc, conditionFunc, initialArgs) {
				if (conditionFunc(initialArgs)) {
					return service.doWhile(bodyFunc, conditionFunc, initialArgs);
				} else {
					return $q.resolve();
				}
			};

			/**
			 * @ngdoc function
			 * @name allSequentially
			 * @function
			 * @methodOf platformPromiseUtilitiesService
			 * @description Sequentially executes a set of promises.
			 * @param {Array|Object} items An array or object that contains values from which promises can be created.
			 * @param {Function} createPromiseFunc A function that creates a promise based upon a value from items. If
			 *                                     this is not provided, the item itself will be assumed to be a function
			 *                                     that may or may not return a promise, or else it will be treated as a
			 *                                     value that may or may not be a promise itself.
			 * @returns {Array|Object} An array or object with the results of the supplied promises, assigned to
			 *                         analogous indices or properties.
			 */
			service.allSequentially = function (items, createPromiseFunc) {
				var keys;
				var result;
				if (_.isArray(items)) {
					keys = _.range(0, items.length);
					result = [];
				} else if (_.isObject(items)) {
					keys = Object.keys(items);
					result = {};
				} else {
					return $q.when(items);
				}

				var keyIndex = 0;
				return service.while(function () {
					var key = keys[keyIndex];

					var item = items[key];
					var itemResult;
					if (_.isFunction(createPromiseFunc)) {
						itemResult = createPromiseFunc(item);
					} else {
						if (_.isFunction(item)) {
							itemResult = item();
						} else {
							itemResult = item;
						}
					}

					return $q.when(itemResult).then(function (v) {
						result[key] = v;
						keyIndex++;
					});
				}, function () {
					return keyIndex < keys.length;
				}).then(function () {
					return result;
				});
			};

			function PromiseSequencer() {
				this._state = {
					promise: null,
					promiseCount: 0,
					cleanUpAfterPromise: function () {
						this.promiseCount--;
						if (this.promiseCount <= 0) {
							this.promiseCount = 0;
							this.promise = null;
						}
					}
				};
			}

			service.PromiseSequencer = PromiseSequencer;

			PromiseSequencer.prototype.isActive = function () {
				return Boolean(this._state.promise);
			};

			PromiseSequencer.prototype.addPromise = function (promiseSource) {
				if (promiseSource) {
					var asyncFunc = null;
					if (_.isFunction(promiseSource)) {
						asyncFunc = promiseSource;
					} else if (_.isFunction(promiseSource.then)) {
						asyncFunc = function () {
							return promiseSource;
						};
					}

					if (asyncFunc) {
						var that = this;

						if (!that._state.promise) {
							that._state.promise = $q.when();
						}
						that._state.promiseCount++;
						that._state.promise = that._state.promise.then(asyncFunc).then(function (result) {
							that._state.cleanUpAfterPromise();
							return result;
						});
					}
				}

				return $q.when(this._state.promise);
			};

			return service;
		}]);
})(angular);
