(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDataDictionaryRangeUnitService
	 * @function
	 * @requires $q, $http, _, $log
	 *
	 * @description Retrieves and stores data range unit definitions for dictionary-based
	 *              bulk expressions.
	 */
	angular.module('basics.common').service('basicsCommonDataDictionaryRangeUnitService', ['$q', '$http', '_', '$log', 'globals',
		function ($q, $http, _, $log, globals) {
			const service = {};

			const state = {
				rangeUnits: null
			};

			service.prepareRangeUnits = function () {
				if (!state.rangeUnits) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/bulkExpr/schema/transformations').then(function processEnvExprData(response) {
						if (_.isEmpty(response.data) || !_.isArray(response.data)) {
							return $q.reject();
						}
						state.rangeUnits = response.data;
					});
				}
				return $q.resolve();
			};

			service.getRangeUnits = function () {
				if (!state.rangeUnits) {
					service.prepareRangeUnits().then(() => {
						return state.rangeUnits;
					});
				}
				return state.rangeUnits;
			};

			return service;
		}]);
})();