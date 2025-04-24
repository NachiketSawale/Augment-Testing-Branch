/**
 * Created by reimer on 24.11.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).factory('basicsUserformRubricDataSourceService', [
		'globals',
		'$q',
		'$http',
		'basicsUserformMainService',
		function (
			globals,
			$q,
			$http,
			basicsUserformMainService) {

			var selectedRubricId = 0;
			var data = null;      // cached indexed object list

			var service = {};

			service.getlookupType = function () {
				return 'basicsUserformRubricDataSourceLookup';
			};

			service.loadData = function () {
				if (selectedRubricId !== basicsUserformMainService.getSelectedRubricId()) {
					selectedRubricId = basicsUserformMainService.getSelectedRubricId();
					data = null;
				}

				if (data === null) {
					return $http.get(globals.webApiBaseUrl + 'basics/userform/rubric/datasourcelist?rubricId=' + selectedRubricId).then(function (response) {
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
