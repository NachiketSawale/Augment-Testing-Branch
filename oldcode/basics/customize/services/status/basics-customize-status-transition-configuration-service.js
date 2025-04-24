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
	basicsCustomizeModule.service('basicsCustomizeStatusTransitionConfigurationService', BasicsCustomizeStatusTransitionConfigurationService);

	BasicsCustomizeStatusTransitionConfigurationService.$inject = ['_', '$q', '$http'];

	function BasicsCustomizeStatusTransitionConfigurationService(_, $q, $http) {
		var data = {
			loaded: 0,
			configuration: {}
		};

		this.assertTransitionDataIsLoaded = function assertTransitionDataIsLoaded() {
			if(data.loaded === 0) {
				return $http.get(globals.webApiBaseUrl + 'basics/customize/statustransition/get').then(function (response) {
					_.forEach(response.data, function (conf) {
						data.configuration[conf.Table] = conf.StatusTransition;
						data.loaded += 1;
					});

					return true;
				});
			}

			return $q.when(true);
		};

		this.StatusTransitionInitialize = function StatusTransitionInitialize(table) {
			return data.configuration[table];
		};

		function getStatusConfigByWorkflowTable(table) {
			var config = data.configuration;
			var props = Object.getOwnPropertyNames(data.configuration);
			var conf;
			_.forEach(props, function(prop) {
				var tmp = config[prop];
				if(tmp.WorkflowTable === table) {
					conf = tmp;
				}
			});

			return conf;
		}

		this.StatusEntityByTable = function StatusEntityByTable(table) {
			var conf = data.configuration[table];

			if(_.isNull(conf) || _.isUndefined(conf)) {
				conf = getStatusConfigByWorkflowTable(table);
			}

			if(_.isNull(conf) || _.isUndefined(conf)) {
				console.log('No status transition information found for table: ' + table);
				console.log(JSON.stringify(data.configuration));

				return 'Unknown_Type';
			}

			return conf.WorkflowEntityName;
		};

		this.loadedSuccessfully = function loadedSuccessfully() {
			return data.loaded > 0;
		};
	}
})();
