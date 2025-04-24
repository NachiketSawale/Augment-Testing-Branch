(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	angular.module(moduleName).factory('basicsWorkflowEntityUtilsService', basicsWorkflowEntityUtilsService);

	basicsWorkflowEntityUtilsService.$inject = ['$http', '$log', '_', 'platformModuleNavigationService'];

	function basicsWorkflowEntityUtilsService($http, $log, _, platformModuleNavigationService) { // jshint ignore:line

		return {
			getModulesWithNavigationEndpoint: getModulesWithNavigationEndpoint,
			getModuleWithNavigationEndpointByModuleName: getModuleWithNavigationEndpointByModuleName,
			getModuleWithNavigationEndpointById: getModuleWithNavigationEndpointById
		};

		/**
		 * @ngdoc function
		 * @name getModulesWithNavigationEndpoint
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns all modules with Navigation Endpoints.
		 * @returns { array } An array with modules
		 */
		function getModulesWithNavigationEndpoint() {
			return $http.get(globals.webApiBaseUrl + 'basics/config/listAll').then(function (response) {
				var list = [];
				for (var i = 0; i < response.data.length; i++) {
					var module = response.data[i];
					var navEndPoint = platformModuleNavigationService.getNavigator(module.InternalName);
					if (!angular.isUndefined(navEndPoint)) {
						list.push(module);
					}
				}
				return list;
			}, function (error) {
				$log.error(error);
			});
		}

		/**
		 * @ngdoc function
		 * @name getModuleWithNavigationEndpointByModuleName
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns a module object with Naviation Endpoint.
		 * @param {( string )} moduleName The name of the target module
		 * @returns { object } An module object
		 */
		function getModuleWithNavigationEndpointByModuleName(moduleName) {
			return getModulesWithNavigationEndpoint().then(function (modules) {
				if (modules) {
					var module = _.find(modules, {InternalName: moduleName});
					return _.isUndefined(module) ? null : module;
				}

				return null;
			});
		}

		/**
		 * @ngdoc function
		 * @name getModuleWithNavigationEndpointById
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns a module object with Naviation Endpoint.
		 * @param {( int )} id The id of the target module
		 * @returns { object } An module object
		 */
		function getModuleWithNavigationEndpointById(id) {
			return getModulesWithNavigationEndpoint().then(function (modules) {
				if (modules) {
					var module = _.find(modules, {Id: id});
					return _.isUndefined(module) ? null : module;
				}

				return null;
			});
		}
	}
})(angular);