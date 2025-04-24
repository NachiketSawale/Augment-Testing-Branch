(function () {

	/* global angular, _, globals */
	'use strict';
	var moduleName = 'productionplanning.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('productionplanningCommonLocationInfoService', PPSCommonLocationInfoService);

	PPSCommonLocationInfoService.$inject = ['$q', 'basicsLookupdataLookupDescriptorService', '$http'];

	function PPSCommonLocationInfoService($q, basicsLookupdataLookupDescriptorService, $http) {
		let service = {};
		service.locationInfo = new Map();

		service.loadData = function (location) {
			let deferred = $q.defer();
			if (!angular.isDefined(location)) {
				let data = basicsLookupdataLookupDescriptorService.getData('LocationInfo');
				_.forEach(data, function (value, key) {
					service.locationInfo.set(parseInt(key), value);
				});
				deferred.resolve([...service.locationInfo.values()]);
			} else {
				var request = {
					ProjectId: location.ProjectFk,
					PrjLocationId: location.Id
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/common/locationinfo/gettree', request).then(function (response) {
					// update branchPath
					_.forEach(response.data, function (locationInfo) {
						var location = {
							Id: locationInfo.Id,
							BranchPath: locationInfo.BranchPath
						};
						service.updateList(location);
					});
					basicsLookupdataLookupDescriptorService.updateData('LocationInfo', [...service.locationInfo.values()]);
					deferred.resolve([...service.locationInfo.values()]);
				});
			}
			return deferred.promise;
		};

		service.getList = function () {
			return [...service.locationInfo.values()];
		};

		service.updateList = function (location) {
			service.locationInfo.set(location.Id, location);
		};

		service.handleNewLocation = function (item, entityService) {
			var request = {
				// Id: item.Id,
				ProjectId: item.ProjectFk,
				PrjLocationId: item.PrjLocationFk
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/common/locationinfo/getinfo', request).then(function (response) {
				// update branchPath
				var location = {
					Id: response.data.Id,
					BranchPath: response.data.BranchPath
				};
				service.updateList(location);
				basicsLookupdataLookupDescriptorService.updateData('LocationInfo', [location]);
				entityService.gridRefresh();
				entityService.markItemAsModified(item);
			});
		};

		return service;
	}
})();