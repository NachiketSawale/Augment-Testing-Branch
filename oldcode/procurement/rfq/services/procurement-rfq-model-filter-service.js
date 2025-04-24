/*
 * $Id: procurement-rfq-model-filter-service.js 557441 2019-09-04 09:00:53Z chi $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/**
	 * @ngdoc service
	 * @name procurementRfqModelFilterService
	 * @function
	 * @requires $http, modelViewerFilterFuncFactory
	 *
	 * @description Represents a filter function for the main entity filter in the Procurement RfQ module.
	 */
	angular.module('procurement.rfq').factory('procurementRfqModelFilterService', ['$http',
		'modelViewerFilterFuncFactory',
		function ($http, modelViewerFilterFuncFactory) {
			return modelViewerFilterFuncFactory.createForDataService([{
				serviceName: 'procurementRfqMainService',
				retrieveObjectIds: function (info) {
					return $http.get(globals.webApiBaseUrl + 'procurement/rfq/header/QueryModelObjects', {
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
			}]);
		}]);
})();