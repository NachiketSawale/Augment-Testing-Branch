/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	/* global Platform */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceEventExtension
	 * @function
	 * @description
	 * platformDataServiceEventExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceEventExtension', PlatformDataServiceEventExtension);

	PlatformDataServiceEventExtension.$inject = ['_'];

	function PlatformDataServiceEventExtension(_) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceisconnectEventExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		// var self = this;

		this.addEventBaseFunctionality = function addEventBaseFunctionality(container) {
			container.data.allRegisteredEventMessenger = [];

			container.data.registerAndCreateEventMessenger = function registerAndCreateEventMessenger(name) {
				container.data.allRegisteredEventMessenger.push(name);

				container.data[name] = new Platform.Messenger();

				var capitalName = _.capitalize(name.substr(0, 1)) + name.substr(1);
				var registerEvent = 'register' + capitalName;
				var unregisterEvent = 'unregister' + capitalName;

				container.service[registerEvent] = function registerNamedEvent(callBackFn) {
					container.data[name].register(callBackFn);
				};

				container.service[unregisterEvent] = function unregisterNamedEvent(callBackFn) {
					container.data[name].unregister(callBackFn);
				};
			};

			container.service.disconnectRegisteredEvents = function disconnectRegisteredEvents() {
				_.forEach(container.data.allRegisteredEventMessenger, function (event) {
					container.data[event] = null;

					container.data[event] = new Platform.Messenger();
				});
			};
		};
	}
})();