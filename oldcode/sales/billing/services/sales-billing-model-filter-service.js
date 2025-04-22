/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name sales.billing.salesBillingModelFilterService
	 * @function
	 *
	 * @description Represents a filter function for the main entity filter in the Sales Billing module.
	 */
	angular.module('sales.billing').factory('salesBillingModelFilterService', ['globals', '_', '$http', 'modelViewerFilterFuncFactory',
		'boqMainBoqVersionItem2ModelObjectService',
		function (globals, _, $http, modelViewerFilterFuncFactory, boqMainBoqVersionItem2ModelObjectService) {
			return modelViewerFilterFuncFactory.createForDataService([
				{
					serviceName: 'salesBillingBoqStructureService',
					retrieveObjectIds: function (info) {
						return boqMainBoqVersionItem2ModelObjectService.getCompressedModelObjectIdsByBoQVersionItemIds(info.modelId,
							info.items, function getBoqHeaderId (item) {
								return item.BoqHeaderFk;
							}, function getBoqItemId (item) {
								return item.Id;
							}, true);
					}
				}, {
					serviceName: 'salesBillingBoqService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/billing/boq2modelobject/objectsbybillingboqheader', {
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
					serviceName: 'salesBillingService',
					retrieveObjectIds: function (info) {
						return $http.get(globals.webApiBaseUrl + 'sales/billing/boq2modelobject/objectsbybillingheader', {
							params: {
								modelId: info.modelId,
								billingHeaderFks: _.map(info.items, function (item) {
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
