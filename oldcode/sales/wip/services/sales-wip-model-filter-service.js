/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name sales.wip.salesWipModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Sales Wip module.
	 */
	angular.module('sales.wip').factory('salesWipModelFilterService', ['_', 'globals', '$http', 'modelViewerFilterFuncFactory',
		'boqMainBoqVersionItem2ModelObjectService',
		function (_, globals, $http, modelViewerFilterFuncFactory, boqMainBoqVersionItem2ModelObjectService) {
			return modelViewerFilterFuncFactory.createForDataService([
				{
					serviceName: 'salesWipBoqStructureService',
					retrieveObjectIds: function (info) {
						return boqMainBoqVersionItem2ModelObjectService.getCompressedModelObjectIdsByBoQVersionItemIds(info.modelId,
							info.items, function getBoqHeaderId (item) {
								return item.BoqHeaderFk;
							}, function getBoqItemId (item) {
								return item.Id;
							}, true);
					}
				}, {
					serviceName: 'salesWipBoqService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/wip/boq2modelobject/objectsbywipboqheader', {
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
					serviceName: 'salesWipService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/wip/boq2modelobject/objectsbywipheader', {
							params: {
								modelId: info.modelId,
								wipHeaderFks: _.map(info.items, function (item) {
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