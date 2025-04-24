/**
 * Created by Benny on 13.06.2017.
 */
(function (angular) {
	/* global globals, _ */ 
	'use strict';

	/**
	 * @ngdoc service
	 * @name boqCatalogAssignModeLookupDataService
	 * @function
	 *
	 * @description
	 * boqCatalogAssignModeLookupDataService is the data service for all catalog assign mode lookup related functionality.
	 */
	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqCatalogAssignModeLookupDataService', [
		'$q',
		'$http',
		'platformPermissionService',
		function ($q,
			$http,
			platformPermissionService) {

			var service = {}, _data = null;
			var _accessRight = '24a6990fa55b424e965054116dbf80e3';

			function loadData() {

				var deffered = $q.defer();
				if (_data === null) {
					platformPermissionService.loadPermissions([_accessRight]).then(function () {
						return $http.get(globals.webApiBaseUrl + 'boq/main/catalog/modelist').then(function (response) {
							_data = [];
							for (var key in response.data) {
								_data.push({Id: parseInt(key), Description: response.data[key]});
							}
							deffered.resolve(_data);
						});
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
					return _data[2];
				}
				);
			};

			service.getList = function getList() {
				return loadData().then(function () {
					var result = [];
					result.push(_data[0]);  // ignore
					// todo: platformPermissionService returns sometimes false???
					result.push(_data[1]);  // search + ignore
					result.push(_data[2]);  // search + add
					return result;
				});
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getList().then(function (data) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].Id === value) {
							return data[i];
						}
					}
					return service.getDefault();  // maybe user has no access right
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

			function init() {
			}

			init();

			return service;
		}]);
})(angular);
