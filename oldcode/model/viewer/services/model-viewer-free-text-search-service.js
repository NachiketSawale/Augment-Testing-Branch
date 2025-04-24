/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFreeTextSearchService
	 * @function
	 *
	 * @description The service is one function that executes free-text queries on model objects in the selected model.
	 *              The function returns a promise that is resolved to an array of object IDs.
	 */
	angular.module('model.viewer').factory('modelViewerFreeTextSearchService', ['$http',
		'modelViewerModelSelectionService',
		function ($http, modelSelectionService) {
			return function (searchPattern) {
				var selModelId = modelSelectionService.getSelectedModelId();
				if (selModelId) {
					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'model/main/objectfilter/filterfreetext',
						params: {
							modelId: selModelId,
							pattern: angular.isString(searchPattern) ? searchPattern : JSON.stringify(searchPattern)
						},
						timeout: 600000
					}).then(function (result) {
						if (result.status === 200) {
							return result.data;
						}
					});
				} else {
					return null;
				}
			};
		}]);
})(angular);
