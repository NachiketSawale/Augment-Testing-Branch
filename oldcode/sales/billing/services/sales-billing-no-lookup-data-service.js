(function (angular) {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	salesBillingModule.factory('salesBillingNoLookupDataService', ['_', 'globals', '$http', '$q', '$injector', 'basicsLookupdataLookupFilterService', 'qtoBoqType',
		function (_, globals, $http, $q, $injector, basicsLookupdataLookupFilterService, qtoBoqType) {

			var service = {};

			var lookupData = {};

			var salesBillingHeaderList = [];

			var projectId = 0;

			var saleBillingHeaderPromise = null;

			service.setProjectId = function (value) {
				saleBillingHeaderPromise = null;
				projectId = value;
			};

			service.getItemById = function (item, options) {
				if (options && options.BoqType && options.BoqType !== qtoBoqType.QtoBoq){
					let itemService = $injector.get('qtoMainCommonService').getItemService(options.BoqType);
					return  itemService.getSelected();
				}
				else {
					return _.find(salesBillingHeaderList, {Id: item});
				}
			};

			service.getItemByIdAsync = function (value, options) {
				if (projectId > 0) {
					if (!saleBillingHeaderPromise) {
						saleBillingHeaderPromise = $http.get(globals.webApiBaseUrl + 'sales/billing/list?projectId=' + projectId);
					}
					return saleBillingHeaderPromise.then(function (response) {
						salesBillingHeaderList = _.uniqBy(salesBillingHeaderList.concat(response.data), 'Id');
						saleBillingHeaderPromise = null;
						return service.getItemById(value, options);
					});
				} else {

					var currentBillingHeaderAsyncPromise = 'BillingHeaderAsyncPromise' + value;
					if (!lookupData[currentBillingHeaderAsyncPromise]) {
						lookupData[currentBillingHeaderAsyncPromise] = getBillingHeaderById(value);
					}

					return lookupData[currentBillingHeaderAsyncPromise].then(function (data) {
						lookupData[currentBillingHeaderAsyncPromise] = null;
						return data;
					});
				}
			};

			function getBillingHeaderById(value) {
				var deferred = $q.defer();
				var ids = [value];
				$http.post(globals.webApiBaseUrl + 'sales/billing/billingsbyids', ids).then(function (response) {
					let billingHeaderList = response.data;
					salesBillingHeaderList = _.uniqBy(salesBillingHeaderList.concat(billingHeaderList), 'Id');
					deferred.resolve(_.find(billingHeaderList, {Id: value}));

				});

				return deferred.promise;
			}

			service.getSalesBillingList = function () {

				var filter = basicsLookupdataLookupFilterService.getFilterByKey('qto-sales-billing-no-filter');

				if (filter) {

					var value = filter.fn();

					if (angular.isDefined(value) && value !== null) {

						return $http.get(globals.webApiBaseUrl + 'sales/billing/getlist?' + value).then(function (response) {
							saleBillingHeaderPromise = null;
							salesBillingHeaderList = _.uniqBy(salesBillingHeaderList.concat(response.data), 'Id');
							return _.uniqBy(response.data, 'Code');
						});
					}
				}

				return $q.when([]);
			};
			service.getSalesBillingByWipList = function () {

				var filter = basicsLookupdataLookupFilterService.getFilterByKey('sales-billing-no-filter');
				if (filter) {
					var value = filter.fn();
					if (angular.isDefined(value) && value !== null) {
						return $http.get(globals.webApiBaseUrl + 'sales/billing/getbillsbywip?' + value).then(function (response) {
							saleBillingHeaderPromise = null;
							salesBillingHeaderList = _.uniqBy(salesBillingHeaderList.concat(response.data), 'Id');
							return _.uniqBy(response.data, 'Code');
						});
					}
				}
				return $q.when([]);
			};

			service.clearDataCache = function clearDataCache() {
				salesBillingHeaderList =[];
			};

			return service;

		}]);
})(angular);
