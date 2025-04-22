/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesContractLookupDataService', ['_', 'globals', '$http', '$q', 'basicsLookupdataLookupFilterService',
		function (_, globals, $http, $q, basicsLookupdataLookupFilterService) {

			var service = {};
			var salesContractHeaderList = [];
			service.getSalesContractByBid = function () {
				var filter = basicsLookupdataLookupFilterService.getFilterByKey('sales-contract-code-filter');

				if (filter) {
					var value = filter.fn();
					if (angular.isDefined(value) && value !== null) {
						return $http.get(globals.webApiBaseUrl + 'sales/contract/getcontractsbybid?' + value).then(function (response) {
							salesContractHeaderList = _.uniqBy(salesContractHeaderList.concat(response.data), 'Id');
							return _.uniqBy(response.data, 'Code');
						});
					}
				}
				return $q.when([]);
			};

			service.clearDataCache = function clearDataCache() {
				salesContractHeaderList = [];
			};

			return service;

		}]);
})(angular);
