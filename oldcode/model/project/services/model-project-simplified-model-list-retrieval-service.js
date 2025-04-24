/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectSimplifiedModelListRetrievalService
	 * @function
	 * @requires $http
	 *
	 * @description Retrieves lists of simplified model DTOs from the server.
	 */
	angular.module('model.project').factory('modelProjectSimplifiedModelListRetrievalService', ['$http',
		function ($http) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name getModelsForProject
			 * @function
			 * @methodOf modelProjectSimplifiedModelListRetrievalService
			 * @description Retrieves a list of models for a given project ID.
			 * @param {Number} projectId The project ID.
			 * @returns {Array} The retrieved simplified model information objects.
			 * @throws {Error} if `projectId` is not a number.
			 */
			service.getModelsForProject = function (projectId) {
				if (!angular.isNumber(projectId)) {
					throw new Error('The project ID must be a number.');
				}

				return $http.get(globals.webApiBaseUrl + 'model/project/model/listsimplifiedforpj?projectId=' + projectId).then(function (response) {
					if (angular.isArray(response.data)) {
						return response.data;
					} else {
						return [];
					}
				});// TODO: handle error?
			};

			return service;
		}]);
})(angular);
