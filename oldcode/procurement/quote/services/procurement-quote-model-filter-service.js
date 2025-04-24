/*
 * $Id: procurement-quote-model-filter-service.js 557392 2019-09-04 06:48:59Z chi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementQuoteModelFilterService
	 * @function
	 * @requires $http, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the Procurement Quote module.
	 */

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	angular.module('procurement.quote').factory('procurementQuoteModelFilterService', ['$http',
		'modelViewerFilterFuncFactory',
		function ($http, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([
				[
					{
						serviceName: 'procurementQuoteItemDataService',
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
						serviceName: 'procurementQuoteBoqItemService',
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
					serviceName: 'procurementQuoteHeaderDataService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'procurement/quote/header/QueryModelObjects', {
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