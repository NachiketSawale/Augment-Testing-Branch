(function (angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialSearchProfileService', ['$http',
		function ($http) {
			var service = {
				filterName: 'searchProfile',
				baseUrl: globals.webApiBaseUrl + 'basics/material/'
			};

			service.load = function () {
				return $http.get(service.baseUrl + 'getmaterialdefinitions?filterName=' + service.filterName)
					.then(function (result) {
						if (result.data && result.data.FilterDef) {
							return JSON.parse(result.data.FilterDef);
						}
						return null;
					});
			};

			service.save = function (data) {
				var profile = {
					FilterName: service.filterName,
					AccessLevel: 'User',
					FilterDef: JSON.stringify(data)
				};

				$http.post(service.baseUrl + 'savematerialdefinition', profile);
			};

			service.getSearchSettings = function () {
				return $http.get(service.baseUrl + 'searchsetting').then(function (res) {
					return res.data;
				});
			};

			return service;
		}
	]);


})(angular);