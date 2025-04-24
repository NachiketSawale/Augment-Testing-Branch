(function (angular) {
	'use strict';
	/**
	 * Created by baf on 2016/12/29.
	 *
	 * @name platform.platformModuleInitialConfigurationService
	 * @function
	 * @description Service for loading / getting initial configuration of a module.
	 */
	angular.module('platform').service('platformModuleInitialConfigurationService', PlatformModuleInitialConfigurationService);

	PlatformModuleInitialConfigurationService.$inject = ['_', '$q', '$http'];

	function PlatformModuleInitialConfigurationService(_, $q, $http) {
		var route = globals.webApiBaseUrl + 'basics/common/moduleconfig/load/?module=';
		var data = {};

		function getStorageName(modName) {
			return _.replace(modName, '.', '_');
		}

		this.load = function load(modName) {
			var storeName = getStorageName(modName);
			if (!_.isNull(data[storeName]) && !_.isUndefined(data[storeName])) {
				return $q.when(data[storeName]);
			}

			return $http.get(route + modName).then(function (response) {
				data[storeName] = response.data;

				return response.data;
			});
		};

		this.get = function get(modName) {
			var storeName = getStorageName(modName);
			return data[storeName];
		};
	}

})(angular);
