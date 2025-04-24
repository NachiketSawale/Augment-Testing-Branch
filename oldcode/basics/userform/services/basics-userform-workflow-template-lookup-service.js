/**
 * Created by reimer on 03.11.2016.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).factory('basicsUserformWorkflowTemplateLookupService', [
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
				return 'basicsUserformWorkflowTemplateLookup';
			};

			service.loadData = function () {
				if (data === null) {
					return $http.get(globals.webApiBaseUrl + 'basics/workflow/template/list').then(function (response) {
						data = response.data;
					});
				} else {
					return $q.when(undefined);
				}
			};

			service.getList = function () {
				return data;
			};

			service.getItemByKey = function (value) {
				var item = {};
				for (var i = 0; i < data.length; i++) {
					if (data[i].Id === value) {
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
