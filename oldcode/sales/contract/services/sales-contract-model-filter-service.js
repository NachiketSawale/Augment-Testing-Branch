/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name sales.contract.salesContractModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Sales Contract module.
	 */
	angular.module('sales.contract').factory('salesContractModelFilterService', ['_', 'globals', '$http', 'modelViewerFilterFuncFactory',
		'boqMainBoqVersionItem2ModelObjectService',
		function (_, globals, $http, modelViewerFilterFuncFactory, boqMainBoqVersionItem2ModelObjectService) {
			return modelViewerFilterFuncFactory.createForDataService([
				{
					serviceName: 'salesContractBoqStructureService',
					retrieveObjectIds: function (info) {
						return boqMainBoqVersionItem2ModelObjectService.getCompressedModelObjectIdsByBoQVersionItemIds(info.modelId,
							info.items, function getBoqHeaderId (item) {
								return item.BoqHeaderFk;
							}, function getBoqItemId (item) {
								return item.Id;
							}, true);
					}
				}, {
					serviceName: 'salesContractBoqService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/contract/boq2modelobject/objectsbycontractboqheader', {
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
					serviceName: 'salesContractService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/contract/boq2modelobject/objectsbycontractheader', {
							params: {
								modelId: info.modelId,
								ordHeaderFks: _.map(info.items, function (item) {
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