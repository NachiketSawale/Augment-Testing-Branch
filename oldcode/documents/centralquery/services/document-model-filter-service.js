(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name documents.centralquery.DocumentModelFilterService
	 * @function
	 * @requires $http, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the centralquery document module.
	 */
	angular.module('documents.centralquery').factory('DocumentModelFilterService', ['globals','_','$http',
		'modelViewerFilterFuncFactory',
		function (globals,_,$http, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([{
				serviceName: 'documentCentralQueryDataService',
				retrieveObjectIds: function (info) {
					return $http.get(globals.webApiBaseUrl + 'documents/centralquery/QueryModelObjectsByDocument', {
						params: {
							modelId: info.modelId,
							documentIds: _.map(info.items, function (item) {
								return item.Id;
							}).join(':')
						}
					}).then(function (response) {
						return response.data;
					});
				}
			}]);
		}]);
})();