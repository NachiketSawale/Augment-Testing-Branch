/*
 * $Id: platform-dragdrop-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformDropServiceFactory
	 * @function
	 * @requires _
	 *
	 * @description Provides a factory for creation of services for teh handling of dropping
	 */
	angular.module('platform').service('platformDropServiceFactory', PlatformDropServiceFactory);

	PlatformDropServiceFactory.$inject = ['_'];

	/**
	 * @ngdoc function
	 * @name PlatformDropServiceFactory
	 * @function
	 * @methodOf platformDropServiceFactory
	 * @description The function creating the platformDropServiceFactory
	 * @param {Object} _ library for list evaluation
	 */
	function PlatformDropServiceFactory(_) {
		var self = this;

		/**
		 * @ngdoc function
		 * @name createDropService
		 * @function
		 * @methodOf platformDropServiceFactory
		 * @description Creates a new services which supports drop as described by the actionHandler
		 * @param {Object} actionHandler An array of actionHandler which consists of a type identifier and a function to be
		 *                 function to be called when the dragged type matches the action handler type
		 */
		this.createDropService = function createDropService(actionHandler) {
			var service = {};
			self.initializeDropService(service, actionHandler);

			return service;
		};

		/**
		 * @ngdoc function
		 * @name createDropService
		 * @function
		 * @methodOf platformDropServiceFactory
		 * @description Initializes a given services to support drop as described by the actionHandler
		 * @param {Object} service The service which is to be enhanced by drop functionality
		 * @param {Object} actionHandler An array of actionHandler which consists of a type identifier and a function to be
		 *                 function to be called when the dragged type matches the action handler type
		 */
		this.initializeDropService = function initializeDropService(service, actionHandler) {
			service.doCanPaste = function doCanPaste(source) {
				var handler = _.find(actionHandler, function (handler) {
					return source.type === handler.type;
				});

				return !_.isNull(handler) && !_.isUndefined(handler);
			};

			service.doPaste = function doPaste(source, type, itemOnDragEnd, itemService) {
				var handler = _.find(actionHandler, function (handler) {
					return source.type === handler.type;
				});

				if (!_.isNull(handler) && !_.isUndefined(handler)) {
					handler.fn(source, itemOnDragEnd, itemService);
				}
			};
		};
	}
})(angular);