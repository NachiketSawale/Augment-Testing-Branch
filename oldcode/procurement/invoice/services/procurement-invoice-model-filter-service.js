/*
 * $Id: procurement-invoice-model-filter-service.js 500948 2018-06-27 15:45:03Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurement.invoice.procurementInvoiceModelFilterService
	 * @function
	 * @requires $http, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the Procurement Invoice module.
	 */
	angular.module('procurement.invoice').factory('procurementInvoiceModelFilterService', ['$http',
		'modelViewerFilterFuncFactory',
		function ($http, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([
				[
					{
						serviceName: 'procurementInvoiceContractDataService',
						retrieveObjectIds: function (info) {
							return $http.get(globals.webApiBaseUrl + 'procurement/invoice/contract/QueryModelObjects', {
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
						serviceName: 'procurementInvoicePESDataService',
						retrieveObjectIds: function (info) {
							return $http.get(globals.webApiBaseUrl + 'procurement/invoice/pes/QueryModelObjects', {
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
						serviceName: 'procurementInvoiceBoqItemService',
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
					serviceName: 'procurementInvoiceHeaderDataService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'procurement/invoice/header/QueryModelObjects', {
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