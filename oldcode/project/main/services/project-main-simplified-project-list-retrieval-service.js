/*
 * $Id: project-main-simplified-project-list-retrieval-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name project.main.projectMainSimplifiedProjectListRetrievalService
	 * @function
	 * @requires $http
	 *
	 * @description Retrieves lists of simplified project DTOs from the server.
	 */
	angular.module('project.main').factory('projectMainSimplifiedProjectListRetrievalService', ['$http',
		function ($http) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name getModelOwnerProjects
			 * @function
			 * @methodOf projectMainSimplifiedProjectListRetrievalService
			 * @description Retrieves a list of projects that contain models.
			 * @returns {Array} The retrieved simplified project information objects.
			 */
			service.getModelOwnerProjects = function () {
				return $http.get(globals.webApiBaseUrl + 'project/main/simplifiedmodelownerlist').then(function (response) {
					if (angular.isArray(response.data)) {
						return response.data;
					} else {
						return [];
					}
				});// TODO: handle error?
			};

			return service;
		}]);
})();