/*
 * $Id: boq-main-boq-version-item-2-model-object-service.js 573966 2020-01-20 12:26:29Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boq.main.boqMainBoqVersionItem2ModelObjectService
	 * @function
	 *
	 * @description Provides helper routines for the association between BoQ version items and model objects.
	 */
	angular.module('boq.main').factory('boqMainBoqVersionItem2ModelObjectService', ['$http', 'platformIdUtilsService',
		'_',
		function ($http, platformIdUtilsService, _) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name getCompressedModelObjectIdsByBoQVersionItemIds
			 * @function
			 * @methodOf boqMainBoqVersionItem2ModelObjectService
			 * @description Retrieves model objects associated with any of a given set of BoQ version items.
			 * @param {Integer} modelId The ID of the model (or the composite model) that contains the objects.
			 * @param {Array<Object>} items The array of BoQ items (or any other objects that contain their IDs).
			 * @param {Function} boqHeaderIdFunc A function that extracts the BoQ header ID from a given item.
			 * @param {Function} boqItemIdFunc A function that extracts the BoQ item ID from a given item.
			 * @param {Boolean} includeSubTree Indicates whether descendants of the given item IDs should be included
			 *                                 as well.
			 * @returns {String} The associated model object IDs in compressed string format.
			 */
			service.getCompressedModelObjectIdsByBoQVersionItemIds = function (modelId,
				items, boqHeaderIdFunc, boqItemIdFunc,
				includeSubTree) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/versionitem2mdlobject/objectsbyitems', {
					params: {
						modelId: modelId,
						itemIds: platformIdUtilsService.compressIdentificationData(_.map(items, function (item) {
							return {
								PKey1: boqHeaderIdFunc(item),
								Id: boqItemIdFunc(item)
							};
						})),
						includeSubTree: Boolean(includeSubTree)
					}
				}).then(function (response) {
					return response.data;
				});
			};

			return service;
		}]);
})();
