/**
 * Created by reimer on 15.02.2016.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).factory('basicsUserformLookupQualifierLookupService', [
		'globals',
		'$q',
		'$http',
		function (
			globals,
			$q,
			$http) {

			var data = null;      // cached object list
			var service = {};

			service.getlookupType = function () {
				return 'basicsUserformLookupQualifierLookup';
			};

			service.loadData = function () {
				if (data === null) {
					return $http.get(globals.webApiBaseUrl + 'basics/userform/qualifier/list').then(function (response) {
						data = [];
						// data.push({ id: 0, description: ''});  // empty item
						for (var i = 0, len = response.data.length; i < len; i++) {
							data.push({id: i + 1, description: response.data[i]});
						}
					});
				} else {
					return $q.when(undefined);
				}
			};

			service.getList = function () {
				return data;
			};

			service.getItemByDescription = function (value) {
				var item = {};
				for (var i = 0; i < data.length; i++) {
					if (data[i].description === value) {
						item = data[i];
						break;
					}
				}
				return item;
			};

			service.refresh = function () {
				data = null;
				service.loadData();
			};

			return service;

		}
	]);
})(angular);
