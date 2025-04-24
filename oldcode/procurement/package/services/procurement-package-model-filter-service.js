/*
 * $Id: procurement-package-model-filter-service.js 500948 2018-06-27 15:45:03Z haagf $
 * Copyright (c) RIB Software SE
 */

// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurement.package.procurementPackageModelFilterService
	 * @function
	 * @requires _, $http, $injector, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the Procurement Package module.
	 */
	angular.module('procurement.package').factory('procurementPackageModelFilterService', ['_', '$http', '$injector',
		'modelViewerFilterFuncFactory',
		function (_, $http, $injector, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([
				[
					{
						serviceName: 'procurementPackageItemDataService',
						retrieveObjectIds: function (info) {
							return $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/QueryModelObjects', {
								params: {
									modelId: info.modelId,
									itemIds: _.map(info.items, function (item) {
										return item.Id;
									}).join(':')
								}
							}).then(function (response) {
								return response.data;
							});
						}
					}, {
						serviceName: 'procurementPackageEstimateLineItemDataService',
						retrieveObjectIds: function (info) {
							var estimateMainLineItem2MdlObjectService = $injector.get('estimateMainLineItem2MdlObjectService');
							return estimateMainLineItem2MdlObjectService.getObjectIdsForLineItems(_.map(info.items, function (item) {
								return {
									EstHeaderFk: item.EstHeaderFk,
									EstLineItemFk: item.Id
								};
							}));
						}
					}, {
						serviceName: 'procurementPackageBoqItemService',
						retrieveObjectIds: function (info) {
							return $http.post(globals.webApiBaseUrl + 'procurement/common/boq/QueryModelObjects', {
								modelId: info.modelId,
								itemIds: _.map(info.items, function (item) {
									return {
										PKey1: item.BoqHeaderFk,
										Id: item.Id
									};
								})
							}).then(function (response) {
								return response.data;
							});
						}
					}
				], {
					serviceName: 'procurementPackageDataService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'procurement/package/package/QueryModelObjects', {
							params: {
								modelId: info.modelId,
								packageIds: _.map(info.items, function (item) {
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