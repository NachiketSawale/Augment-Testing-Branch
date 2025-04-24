/*
 * $Id: project-main-nice-name-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name project.main.projectMainNiceNameService
	 * @function
	 * @requires $translate
	 *
	 * @description Provides routines to generate human-readable names for some entities.
	 */
	angular.module('project.main').factory('projectMainNiceNameService', ['$translate',
		function ($translate) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name generateNiceProjectNameFromValues
			 * @function
			 * @methodOf projectMainNiceNameService
			 * @description Constructs a human-readable name for a project based upon given values.
			 * @param {Number} id The project ID.
			 * @param {String} name The project name.
			 * @param {String} projectNo The project number.
			 * @returns {String} The human-readable text.
			 */
			service.generateNiceProjectNameFromValues = function (id, name, projectNo) {
				if (name) {
					if (projectNo) {
						return $translate.instant('project.main.niceProjectNamePattern', {
							name: name,
							number: projectNo
						});
					} else {
						return name;
					}
				} else {
					if (projectNo) {
						return projectNo;
					} else {
						return $translate.instant('project.main.niceProjectIdPattern', {
							id: id
						});
					}
				}
			};

			/**
			 * @ngdoc function
			 * @name generateNiceProjectNameFromEntity
			 * @function
			 * @methodOf projectMainNiceNameService
			 * @description Constructs a human-readable name for a project based upon a project entity.
			 * @param {Object} project The project entity. This function may also be called as a method of a project
			 *                         entity, in which case the argument can be omitted.
			 * @returns {String} The human-readable text.
			 */
			service.generateNiceProjectNameFromEntity = function (project) {
				var pjObject = project || this;
				return service.generateNiceProjectNameFromValues(pjObject.Id, pjObject.ProjectName, pjObject.ProjectNo);
			};

			/**
			 * @ngdoc function
			 * @name joinNameWithProjectName
			 * @function
			 * @methodOf projectMainNiceNameService
			 * @description Nicely formats an arbitrary resource name and a project name in such a way that the project
			 *              appears as the owner or container for the other named resource.
			 * @param {String} name The name of an arbitrary project-related resource.
			 * @param {String} projectName The name of a project.
			 * @returns {String} The human-readable text.
			 */
			service.joinNameWithProjectName = function (name, projectName) {
				return $translate.instant('project.main.niceJoinedProjectPattern', {
					child: name,
					project: projectName
				});
			};

			return service;
		}]);
})();