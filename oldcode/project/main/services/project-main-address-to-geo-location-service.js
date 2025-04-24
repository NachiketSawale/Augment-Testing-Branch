/**
 * Created by chi on 2021-10-11
 */
(function (angular) {
	'use strict';
	let moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainAddressTcoGeoLocationService', projectMainAddressTcoGeoLocationService);

	projectMainAddressTcoGeoLocationService.$inject = ['$http', '$log', 'globals'];

	function projectMainAddressTcoGeoLocationService($http, $log, globals) {
		let service = {};
		service.getProjectcAddresses = getProjectAddresses;
		return service;

		function getProjectAddresses(projectIds) {
			return $http.post(globals.webApiBaseUrl + 'project/main/addresstogeolocation/getaddessesbyprojectids', projectIds)
				.then(function (response) {
					if (!response) {
						return null;
					}
					return response.data;
				}, function (error) {
					$log.error(error);
				});
		}
	}
})(angular);