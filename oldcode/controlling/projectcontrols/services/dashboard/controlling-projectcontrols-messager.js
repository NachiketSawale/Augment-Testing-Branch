(function (angular) {
	'use strict';

	angular.module('controlling.projectcontrols').constant('ProjectcontrolsMessenger', ProjectcontrolsMessenger); // jshint ignore:line

	/**
	 * @ngdoc function
	 * @name Messenger
	 * @function
	 * @description Constructor of platform messenger
	 */
	function ProjectcontrolsMessenger() {
		let handlers = [];
		let that = this;

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
			for (let i = 0; i < handlers.length; i++) {
				if (handlers[i] === fn) {
					handlers.splice(i, 1);
				}
			}
		};

		/**
		 * @ngdoc function
		 * @name unregister all callbacks
		 * @function
		 * @methodOf Messenger
		 * @description unregister all callbacks
		 */
		this.unregisterAll = function unregisterAll() {
			handlers = [];
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
		this.fire = function fire(e, args, scope) {
			let returnValueArr = [];
			scope = scope || this;
			for (let i = 0; i < handlers.length; i++) {
				// eslint-disable-next-line no-undef
				if (_.isFunction(handlers[i])) {
					let returnValue = handlers[i].call(scope, e, args);
					if(returnValue){
						returnValueArr.push(returnValue);
					}
				}
			}
			return returnValueArr;
		};
	}

})(angular);

