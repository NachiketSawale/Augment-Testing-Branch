(function () {
	'use strict';
	/*global _, globals*/

	let moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonMapDataService', [
		'$http', '$q',
		function ($http, $q) {
			const url_getJobsAddrs = 'productionplanning/common/getJobAddress';
			function cloneAddresses(addressEntities) {
				let entities = [];
				if (Array.isArray(addressEntities)) {
					entities = addressEntities;
				} else if (!_.isNil(addressEntities) && typeof addressEntities === 'object') {
					entities.push(addressEntities);
				}

				let cloneEntities = [];
				entities.forEach(function (addr) {
					let address = {};
					Object.keys(addr).forEach(function (propName) {
						let camelCaseProp = propName.toLowerCase();
						address[camelCaseProp] = addr[propName];
					});

					address.waypointEntityId = addr.Id;
					address.isSelected = true;
					cloneEntities.push(address);
				});
				return cloneEntities;
			}

			this.loadAddresses = function (jobId, parentEntityId, url) {
				let promise = null;
				if (!_.isNil(jobId)) {
					let jobIds = [jobId];
					promise = $http.post(globals.webApiBaseUrl + url_getJobsAddrs, jobIds);
				} else if (url && parentEntityId) {
					let completeUrl = globals.webApiBaseUrl + url + '?entityId=' + parentEntityId;
					promise = $http.get(completeUrl);
				} else {
					promise = $q.when([]);
				}

				return promise.then(function (response) {
					return cloneAddresses(response.data);
				});
			};
		}
	]);
})();