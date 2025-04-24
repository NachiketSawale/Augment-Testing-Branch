/*
 * $Id: procurement-pes-model-filter-service.js 500948 2018-06-27 15:45:03Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurement.pes.procurementPesModelFilterService
	 * @function
	 * @requires $http, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the Procurement PES module.
	 */
	angular.module('procurement.pes').factory('procurementPesModelFilterService', ['$http',
		'modelViewerFilterFuncFactory',
		function ($http, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([
				[
					{
						serviceName: 'procurementPesItemService',
						retrieveObjectIds: function (info) {
							return $http.get(globals.webApiBaseUrl + 'procurement/pes/item/QueryModelObjects', {
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
						serviceName: 'procurementPesBoqItemService',
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
					serviceName: 'procurementPesHeaderService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'procurement/pes/header/QueryModelObjects', {
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