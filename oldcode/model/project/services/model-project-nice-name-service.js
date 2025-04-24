/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectNiceNameService
	 * @function
	 * @requires $translate
	 *
	 * @description Provides routines to generate human-readable names for some entities.
	 */
	angular.module('model.project').factory('modelProjectNiceNameService', ['$translate',
		function ($translate) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name generateNiceModelNameFromValues
			 * @function
			 * @methodOf modelProjectNiceNameService
			 * @description Constructs a human-readable name for a model based upon given values.
			 * @param {Number} id The model ID.
			 * @param {String} code The model code.
			 * @param {String} description The model description.
			 * @returns {String} The human-readable text.
			 */
			service.generateNiceModelNameFromValues = function (id, code, description) {
				if (code) {
					if (description) {
						return $translate.instant('model.project.niceModelNamePattern', {
							code: code,
							description: description
						});
					} else {
						return code;
					}
				} else {
					if (description) {
						return description;
					} else {
						return $translate.instant('model.project.niceModelIdPattern', {
							id: id
						});
					}
				}
			};

			/**
			 * @ngdoc function
			 * @name generateNiceModelNameFromEntity
			 * @function
			 * @methodOf modelProjectNiceNameService
			 * @description Constructs a human-readable name for a model based upon a model entity.
			 * @param {Object} model The model entity. This function may also be called as a method of a model
			 *                       entity, in which case the argument can be omitted.
			 * @returns {String} The human-readable text.
			 */
			service.generateNiceModelNameFromEntity = function (model) {
				var mdlObject = model || this;
				return service.generateNiceModelNameFromValues(mdlObject.Id, mdlObject.Code, mdlObject.Description);
			};

			return service;
		}]);
})();