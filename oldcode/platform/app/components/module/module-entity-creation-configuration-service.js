(function (angular) {
	'use strict';
	/**
	 * Created by baf on 2020/09/04.
	 *
	 * @name platform.platformModuleInitialConfigurationService
	 * @function
	 * @description Service for loading / getting initial configuration of a module.
	 */
	angular.module('platform').service('platformModuleEntityCreationConfigurationService', PlatformModuleEntityCreationConfigurationService);

	PlatformModuleEntityCreationConfigurationService.$inject = ['_', '$q', '$http'];

	function PlatformModuleEntityCreationConfigurationService(_, $q, $http) {
		var route = globals.webApiBaseUrl + 'basics/config/entitycreation/load/?module=';
		var data = {};
		var self = this;

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

		this.getModule = function getModule(modName) {
			var storeName = getStorageName(modName);
			return data[storeName];
		};

		this.getEntity = function getEntity(modName, entityName) {
			var configuredModule = self.getModule(modName);

			if (!configuredModule) {
				return null;
			}

			return _.find(configuredModule.ClassConfigurations, {EntityName: entityName});
		};
	}

})(angular);
