// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';

	/**
     * @ngdoc service
     * @name modelEstLineItemLookupDataService
     * @function
     *
     * @description
     * modelEstLineItemLookupDataService is the data service for activity look ups
     */
	angular.module(moduleName).factory('stockPesItemLookupDataService', [
		'$q',
		'$http',
		'_',
		// eslint-disable-next-line func-names
		function ($q,
			$http,
			_) {
			var service= {}, cache = [],
				// getListUrl = globals.webApiBaseUrl + 'procurement/stockheaderv/header/list',
				// eslint-disable-next-line no-undef
				getItemUrl = globals.webApiBaseUrl + 'procurement/transaction/pesitem/item?id=';

			service.loadData=function loadData(data)
			{
				cache=data;
			};

			// service.getList = function getList() {
			//     var deferred = $q.defer();
			//
			//     $http.get(getListUrl).then(function (res) {
			//         cache = res.data;
			//     }, function () {
			//
			//     }).finally(function () {
			//         deferred.resolve(cache);
			//     });
			//
			//     return deferred.promise;
			// };


			service.getItemById = function getItemById(id) {
				return _.find(cache, {Id: id});
			};

			service.getItemByKey = function getItemByKey(id) {
				var deferred = $q.defer();
				if(cache.length<1)
				{
					// service.getList();
					$http.get(getItemUrl + id).then(function (res) {
						deferred.resolve(res.data);
						// eslint-disable-next-line func-names
					}, function () {

					});
				}
				else
				{
					deferred.resolve(service.getItemById(id));
				}
				return deferred.promise;
			};

			service.getItemByIdAsync = service.getItemByKey;

			return service;
		}]);
})(angular);