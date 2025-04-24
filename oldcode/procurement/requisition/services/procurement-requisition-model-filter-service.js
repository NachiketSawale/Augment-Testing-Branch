/*
 * $Id: procurement-requisition-model-filter-service.js 557425 2019-09-04 08:31:39Z chi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementRequisitionModelFilterService
	 * @function
	 * @requires $http, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the Procurement Requisition module.
	 */
	angular.module('procurement.requisition').factory('procurementRequisitionModelFilterService', ['$http',
		'modelViewerFilterFuncFactory',
		function ($http, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([
				[
					{
						serviceName: 'procurementRequisitionItemDataService',
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
						serviceName: 'procurementRequisitionBoqItemService',
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
					serviceName: 'procurementRequisitionHeaderDataService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/QueryModelObjects', {
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
				}
			]);
		}]);
})();