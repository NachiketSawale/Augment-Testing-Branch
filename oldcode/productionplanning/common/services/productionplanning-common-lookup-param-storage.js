/**
 * Created by waz on 8/3/2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc
	 * @summary
	 * A simple data stroge, use for lookup param interaction.
	 */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('productionplanningCommonLookupParamStorage', LookupParamStorage);

	LookupParamStorage.$inject = [];

	function LookupParamStorage() {
		var service = {
			set: set,
			get: get
		};

		var params = {};

		function set(token, param) {
			if (!params[token]) {
				params[token] = {};
			}
			_.merge(params[token], param);
		}

		function get(token, name) {
			return _.get(params[token], name);
		}

		return service;
	}
})(angular);