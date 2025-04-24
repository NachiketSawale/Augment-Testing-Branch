/**
 * Created by Benny on 21.06.2017.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqCatalogAssignGaebLookupDataService
	 * @function
	 *
	 * @description
	 * boqCatalogAssignGaebLookupDataService is the data service for all catalog assign gaeb lookup related functionality.
	 */
	var moduleName = 'basics.currency';
	angular.module(moduleName).factory('boqCatalogAssignGaebLookupDataService', ['$q', '$http',

		function ($q, $http) {

			var service = {}, _data = null;

			function loadData() {

				var deffered = $q.defer();
				if (_data === null) {
					return $http.get(globals.webApiBaseUrl + 'boq/main/catalog/gaebtypelist').then(function (response) {
						_data = [];
						for (var key in response.data) {
							_data.push({Id: parseInt(key), Description: response.data[key]});
						}
						deffered.resolve(_data);
					});
				} else {
					deffered.resolve(_data);
				}

				return deffered.promise;
			}

			service.refresh = function refresh() {
				_data = null;
				loadData();
			};

			service.getDefault = function getDefault() {
				return loadData().then(function () {
					return _data[0];
				}
				);
			};

			service.getList = function getList() {
				return loadData().then(function () {
					return _data;
				}
				);
			};

			service.getItemByKey = function getItemByKey(value) {
				return loadData().then(function () {
					for (var i = 0; i < _data.length; i++) {
						if (_data[i].Id === value) {
							return _data[i];
						}
					}
				});
			};

			service.getItemById = function getItemById(id) {
				return _.find(_data, function (item) {
					return item.Id === id;
				});
			};

			service.getItemByIdAsync = function getItemByIdAsync(id) {
				return loadData().then(function () {
					return service.getItemById(id);
				});
			};

			return service;
		}]);
})(angular);
