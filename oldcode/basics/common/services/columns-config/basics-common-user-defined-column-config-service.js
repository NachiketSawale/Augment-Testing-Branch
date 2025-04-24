/**
 * Created by myh on 08/16/2021.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonUserDefinedColumnConfigService', ['globals', '$http', '_', '$q', 'PlatformMessenger',
		function (globals, $http, _, $q, PlatformMessenger) {
			let service = {};
			let loadDynamicAsyncPromise = null;
			let data = {
				allDynamicColumnConfig: null,
				dynamicColumnConfig: null, // columnConfi.IsLive = 1
				isActive: false
			};

			function getLoadDynamicColumnPromise() {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/UserDefinedColumn/list').then(function (response) {
					loadDynamicAsyncPromise = null;
					data.allDynamicColumnConfig = response.data;
					data.dynamicColumnConfig = _.filter(response.data, function (conf) {
						return conf.IsLive;
					});
					data.isActive = data.dynamicColumnConfig && data.dynamicColumnConfig.length > 0;

					return data.dynamicColumnConfig;
				});
			}

			service.getAllDynamicColumnConfig = function () {
				return data.allDynamicColumnConfig;
			};

			service.getDynamicColumnConfig = function () {
				return data.dynamicColumnConfig;
			};

			service.onReloaded = new PlatformMessenger();

			service.load = function () {
				if (_.isNull(loadDynamicAsyncPromise)) {
					loadDynamicAsyncPromise = getLoadDynamicColumnPromise();
				}

				return loadDynamicAsyncPromise;
			};

			service.reLoad = function () {
				service.load().then(function () {
					service.onReloaded.fire();
				});
			};

			return service;
		}]);
})(angular);
