/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainRebImportSelectLocationService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportSelectLocationService', ['$http', 'platformGridAPI', 'cloudCommonGridService',
		function ($http, platformGridAPI, cloudCommonGridService) {
			let service = {};

			service.setGridId = function (value) {
				service.gridId = value;
			};

			service.loadLocationItems = function (projectId) {
				if (service.gridId) {
					$http.get(globals.webApiBaseUrl + 'project/location/tree' + '?projectId=' + projectId).then(function (response) {
						let locations = [];
						if (response.data && response.data.length > 0) {
							locations = response.data;
						}
						platformGridAPI.items.data(service.gridId, locations);
					});
				}
			};

			function setIsMarked(locations) {
				locations.forEach(function (item) {
					item.IsMarked = true;
					if (item.Locations && item.Locations.length > 0) {
						setIsMarked(item.Locations);
					}
				});
			}

			service.getIsMarkedIdList = function () {
				if (service.gridId) {
					let locationList = [];
					let locations = platformGridAPI.items.data(service.gridId);
					cloudCommonGridService.flatten(locations, locationList, 'Locations');
					if (locationList && locationList.length > 0) {
						return locationList.filter(function (item) {
							return item.IsMarked;
						}).map(function (item) {
							return item.Id;
						});
					}
				}
				return [];
			};

			return service;
		}
	]);
})(angular);