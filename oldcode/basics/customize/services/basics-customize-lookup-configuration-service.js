/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeTypeDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeTypeDataService is the data service for all entity type descriptions
	 */
	basicsCustomizeModule.service('basicsCustomizeLookupConfigurationService', BasicsCustomizeLookupConfigurationService);

	BasicsCustomizeLookupConfigurationService.$inject = ['_', '$q', '$http'];

	function BasicsCustomizeLookupConfigurationService(_, $q, $http) {
		var data = {
			loaded: 0,
			configuration: {}
		};

		function load() {
			return $http.get(globals.webApiBaseUrl + 'basics/customize/lookupconfig/get').then(function (response) {
				_.forEach(response.data, function (conf) {
					data.configuration[conf.Table] = conf.Qualifier;
					data.loaded += 1;
				});

				return data.configuration;
			});
		}

		this.loadLookupConfigurations = function loadLookupConfigurations() {
			if (data.loaded === 0) {
				return load();
			}

			return $q.when(data.configuration);
		};

		this.getSimpleLookupQualifier = function getSimpleLookupQualifier(table) {
			return data.configuration[table];
		};

		this.loadedSuccessfully = function loadedSuccessfully() {
			return data.loaded > 0;
		};
	}
})();
