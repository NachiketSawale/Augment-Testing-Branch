/*
 * $Id: platform-nice-name-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformNiceNameService
	 * @function
	 * @requires $translate
	 *
	 * @description Provides routines to generate human-readable names for some entities.
	 */
	angular.module('platform').factory('platformNiceNameService', ['$translate',
		function ($translate) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name generateNiceName
			 * @function
			 * @methodOf platformNiceNameService
			 * @description Generates a nice (human-readable) name for a given entity.
			 * @param {Object} entity The entity.
			 * @returns {String} The generated human-readable name.
			 */
			service.generateNiceName = function (entity) {
				var code = entity.Code || entity.code;
				var description = entity.Description ? (entity.Description.Translated || entity.Description) :
					(entity.description ? (entity.description.Translated || entity.description) : null);
				var id = entity.Id || entity.id;

				if (description) {
					if (code) {
						return $translate.instant('platform.niceNames.codeDesc', {
							code: code,
							desc: description
						});
					} else {
						return description;
					}
				} else {
					if (code) {
						return code;
					} else {
						if (id) {
							return $translate.instant('platform.niceNames.id', {
								id: id
							});
						} else {
							return '?';
						}
					}
				}
			};

			return service;
		}]);
})();