/**
 * Created by janas on 20.02.2018.
 */


(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureWizardGenerateLocationService
	 * @function
	 *
	 * @description
	 * controllingStructureWizardGenerateLocationService is the data service for managing Locations.
	 */
	controllingStructureModule.factory('controllingStructureWizardGenerateLocationService',
		['globals', '$http', 'cloudCommonGridService', function (globals, $http, cloudCommonGridService) {

			var locations = [];

			var service = {
				init: function (projectId) {
					return $http.get(globals.webApiBaseUrl + 'project/location/tree?projectId=' + projectId)
						.then(function (response) {
							var flatLocations = [];
							cloudCommonGridService.flatten(response.data, flatLocations, 'Locations');
							locations = flatLocations;
							return locations;
						});
				},
				getLocations: function () {
					return locations;
				}
			};

			return service;
		}]);
})();
