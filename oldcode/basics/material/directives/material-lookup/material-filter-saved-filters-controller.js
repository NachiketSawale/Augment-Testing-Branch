/*
 * Copyright(c) RIB Software GmbH
 */

(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterSavedFiltersController', ['$scope', '$http', 'materialFilterAccessLevel',
		function ($scope, $http, materialFilterAccessLevel) {
			$scope.filterGroups = [];

			// Fetch data from the specified URL
			$http.get(globals.webApiBaseUrl + 'basics/material/filter/load').then(function (response) {
				const data = response.data;
				// Group data by AccessLevel
				_.forEach(_.groupBy(data, "AccessLevel"), (value, key) => {
					const level = Number.parseInt(key);
					let header = '';

					switch (level) {
						case materialFilterAccessLevel.user:
							header = 'basics.material.lookup.filter.user';
							break;
						case materialFilterAccessLevel.role:
							header = 'basics.material.lookup.filter.role';
							break;
						case materialFilterAccessLevel.system:
							header = 'basics.material.lookup.filter.system';
							break;
						default:
							header = 'Unknown Access Level';
					}

					$scope.filterGroups.push({
						header: header,
						profiles: value
					});
				});
			}).catch(function (error) {
				console.error('Error fetching filter data:', error);
			});

			$scope.select = function (profile) {
				$scope.$close(profile);
			};
		}
	]);

})();