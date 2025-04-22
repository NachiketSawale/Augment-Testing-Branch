/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name sales.bid.salesBidModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Sales Bid module.
	 */
	angular.module('sales.bid').factory('salesBidModelFilterService', ['_', 'globals', '$http', 'modelViewerFilterFuncFactory',
		'boqMainBoqVersionItem2ModelObjectService',
		function (_, globals, $http, modelViewerFilterFuncFactory, boqMainBoqVersionItem2ModelObjectService) {
			return modelViewerFilterFuncFactory.createForDataService([
				{
					serviceName: 'salesBidBoqStructureService',
					retrieveObjectIds: function (info) {
						return boqMainBoqVersionItem2ModelObjectService.getCompressedModelObjectIdsByBoQVersionItemIds(info.modelId,
							info.items, function getBoqHeaderId (item) {
								return item.BoqHeaderFk;
							}, function getBoqItemId (item) {
								return item.Id;
							}, true);
					}
				}, {
					serviceName: 'salesBidBoqService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/bid/boq2modelobject/objectsbybidboqheader', {
							params: {
								modelId: info.modelId,
								boqHeaderFks: _.map(info.items, function (item) {
									return item.BoqHeader.Id;
								}).join(':')
							}
						}).then(function (response) {
							return response.data;
						});
					}
				}, {
					serviceName: 'salesBidService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/bid/boq2modelobject/objectsbybidheader', {
							params: {
								modelId: info.modelId,
								bidHeaderFks: _.map(info.items, function (item) {
									return item.Id;
								}).join(':')
							}
						}).then(function (response) {
							return response.data;
						});
					}
				}
			]);
		}]);
})();