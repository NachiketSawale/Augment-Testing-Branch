/**
 * Created by reimer on 16.01.2018.
 */

(function () {

	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsConfigAuditContainerLookupService',
		['$q',
			'$http',
			function ($q,
		          $http) {

				var _data = null;      // cached object list

				var service = {};

				service.getlookupType = function() {
					return 'basicsConfigAuditContainerLookup';
				};

				// service.getList = function(moduleName) {
				//
				// 	return loadData().then(function() {
				// 		getModuleContainers(moduleName).then(function(uuids) {
				// 				var result = [];
				// 				for (var i = 0; i < uuids.length; i++) {
				// 					var item = getContainer(_data, uuids[i]);
				// 					if (item) {
				// 						result.push(item);
				// 					}
				// 				}
				// 				return result;
				// 		});
				// 	});
				// };

				service.getList = function(moduleName) {

					var deffered = $q.defer();

					loadData().then(function() {
						var promise = service.getModuleContainers(moduleName);
						promise.then(function(uuids) {
							var result = [];
							if (uuids && uuids.length > 0) {
								for (var i = 0; i < uuids.length; i++) {
									var item = getContainer(_data, uuids[i]);
									if (item) {
										result.push(item);
									}
								}
							}
							deffered.resolve(result);
						});
					});
					return deffered.promise;
				};

				service.getItemByKey = function (uuid) {
					return loadData().then(function() {
						return getContainer(_data, uuid);
					});
				};

				service.refresh = function () {
					_data = null;
					service.loadData();
				};

				service.getModuleContainers = function (moduleName) {
					var result = [];

					if(!moduleName) {
						return $q.when(result);
					}

					var calls = [];

					calls.push($http.get(globals.appBaseUrl + moduleName + '/content/json/module-containers.json'));
					calls.push($http.get(globals.webApiBaseUrl + 'basics/layout/containerdefinition?module=' + moduleName));

					return $q.all(calls)
						.then(function (response) {
							_.compact(response[0].data.concat(response[1].data))
								.forEach(function (element) {
									result.push(element.uuid);
								});

							return result;
						});
				};

				function loadData() {

					var deffered = $q.defer();

					if (_data === null) {
						$http.get(globals.webApiBaseUrl + 'basics/audittrail/container/list4lookup').then (function (response) {
							_data = response.data;
							deffered.resolve();
						});
					}
					else {
						deffered.resolve();
					}
					return deffered.promise;

				}

				function getContainer(list, uuid) {

					var item;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							if (list[i].ContainerUuid === uuid) {
								item = list[i];
								break;
							}
						}
					}
					return item;
				}

				return service;

			}
		]);
})(angular);
