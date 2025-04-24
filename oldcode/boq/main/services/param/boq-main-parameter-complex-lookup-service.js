/**
 * Created by zos on 1/4/2018.
 */

(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParamComplexLookupService
	 * @function
	 *
	 * @description
	 * boqParamComplexLookupService provides all lookup data for boq Parameters complex lookup
	 */
	angular.module(moduleName).factory('boqParameterComplexLookupService', ['$http', '$q',
		function ($http, $q) {

			// Object presenting the service
			var service = {};

			// private code
			var lookupData = {
				boqParamItems: []
			};

			var getBoqParamItems = function () {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/estparameter/list');
			};

			// get data list of the boq ParamCode items
			service.getList = function getList() {
				if (lookupData.boqParamItems.length > 0) {
					return lookupData.boqParamItems;
				} else {
					getBoqParamItems().then(function (response) {
						var list = _.filter(response.data, function (item) {
							return item.IsLive === true;
						});
						lookupData.boqParamItems = list;
						return lookupData.boqParamItems;
					});
				}
			};

			// get data list of the estimate ParamCode items
			service.getListAsync = function getListAsync() {
				if (lookupData.boqParamItems && lookupData.boqParamItems.length > 0) {
					return $q.when(lookupData.boqParamItems);
				} else {
					return getBoqParamItems().then(function (response) {
						var list = _.filter(response.data, function (item) {
							return item.IsLive === true;
						});
						lookupData.boqParamItems = list;
						return lookupData.boqParamItems;
					});
				}
			};

			// get list of the estimate ParamCode item by Id
			service.getItemById = function getItemById(value) {
				var items = [];
				var list = lookupData.boqParamItems;
				if (list && list.length > 0) {
					angular.forEach(value, function (val) {
						var item = _.find(list, {'Code': val});
						if (item && item.Id) {
							items.push(item);
						}
					});
				}
				return _.uniqBy(items, 'Id');
			};

			// get list of the estimate ParamCode item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				if (lookupData.boqParamItems.length) {
					return $q.when(service.getItemById(value));
				} else {
					if (!lookupData.boqParamItemsPromise) {
						lookupData.boqParamItemsPromise = service.getListAsync();
					}
					return lookupData.boqParamItemsPromise.then(function (data) {
						lookupData.boqParamItemsPromise = null;
						lookupData.boqParamItems = data;
						return service.getItemById(value);
					});
				}
			};

			// estimate look up data service call
			service.loadLookupData = function () {
				return getBoqParamItems().then(function (response) {
					var list = _.filter(response.data, function (item) {
						return item.IsLive === true;
					});
					lookupData.boqParamItems = list;
					return lookupData.boqParamItems;
				});
			};

			// General stuff
			service.reLoad = function () {
				service.loadLookupData();
			};

			service.getBoqParamItems = function getBoqParamItems() {
				return lookupData.boqParamItems;
			};
			return service;
		}]);
})();

