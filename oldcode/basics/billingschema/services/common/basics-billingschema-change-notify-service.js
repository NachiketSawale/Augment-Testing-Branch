/**
 * Created by wed on 7/14/2020.
 * Added this async messager temporary, It will be removed once PlatformMessager supports async fire events.
 */

(function initializeBasicsBillingSchemaChangeNotifyService(angular) {

	'use strict';

	angular.module('basics.billingschema').factory('basicsBillingSchemaChangeNotifyService', [
		'_',
		'$q',
		function basicsBillingSchemaChangeNotifyService(
			_,
			$q) {

			function AsyncMessenger() {
				var handlers = [];
				var that = this;

				/**
				 * @ngdoc function
				 * @name register
				 * @function
				 * @methodOf Messenger
				 * @description registers a new callback
				 * @param {function} fn callback to be registered
				 * @returns {function} un-register function
				 */
				this.register = function register(fn) {
					handlers.push(fn);

					return function () {
						that.unregister(fn);
					};
				};

				/**
				 * @ngdoc function
				 * @name unregister
				 * @function
				 * @methodOf Messenger
				 * @description unregisters a callback
				 * @param {function} fn callback to be unregistered
				 */
				this.unregister = function unregister(fn) {
					for (var i = 0; i < handlers.length; i++) {
						if (handlers[i] === fn) {
							handlers.splice(i, 1);
						}
					}
				};

				/**
				 * @ngdoc function
				 * @name fire
				 * @function
				 * @methodOf Messenger
				 * @description fires an event to registered callbacks
				 * @param {object} e event
				 * @param {args} args arguments
				 * @param {object} scope $scope
				 * @returns {object} result of last callback
				 */
				this.fireAsync = function fire(e, args, scope) {
					var returnValues = [];
					scope = scope || this;
					for (var i = 0; i < handlers.length; i++) {
						if (_.isFunction(handlers[i])) {
							returnValues.push(handlers[i].call(scope, e, args));
						}
					}
					return $q.all(returnValues);
				};
			}


			return {
				createMessager: function () {
					return new AsyncMessenger();
				}
			};

		}]);

})(angular);
