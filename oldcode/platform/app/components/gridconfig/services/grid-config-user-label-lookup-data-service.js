/**
 * Created by aljami on 22.12.22.
 */
(function (angular) {
	/* global globals, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformGridConfigUserLabelLookupDataService
	 * @function
	 *
	 * @description
	 * platformGridConfigUserLabelLookupDataService is the data service for all catalog assign mode lookup related functionality.
	 */
	var moduleName = 'platform';
	angular.module(moduleName).factory('platformGridConfigUserLabelLookupDataService', [
		'$q',
		'$http',
		'platformPermissionService',
		function ($q,
			$http,
			platformPermissionService) {

			var service = {}, _data = null;
			var translations = {};
			var _accessRight = '7f644bce8e034baeaa4bf306c466e20b';

			function loadData() {

				var deffered = $q.defer();
				if (_data === null) {
					platformPermissionService.loadPermissions([_accessRight]).then(function () {
						return $http.post(globals.webApiBaseUrl + 'basics/customize/userlabel/list').then(function (response) {
							_data = [];
							translations = {};
							// populate here
							response.data.forEach(item=>{
								_data.push({
									Id: item.Id,
									Code: item.Code,
									KeyWords: item.KeyWords
								});
							});
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
						return null; // todo
					}
				);
			};

			service.getList = function getList() {
				return loadData().then(function () {
					var result = [];
					_data.forEach(item=>{
						result.push({
							Id: item.Id,
							Code: item.Code,
							KeyWords: item.KeyWords
						});
					});
					return result;
				});
			};

			service.getItemByKey = function getItemByKey(value) {
				return service.getList().then(function (data) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].Id === value.Id) {
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