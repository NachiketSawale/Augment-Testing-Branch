/*
 * $Id: platform-promise-utilities-service.js 621816 2021-01-29 11:17:38Z haagf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('platform').service('platformSystemOptionService', PlatformSystemOptionService);

	PlatformSystemOptionService.$inject = ['$q', '$http'];

	function PlatformSystemOptionService($q, $http) {
		let _ShallReloadOnPinningChange = null;
		this.shallReloadOnPinningChange = function () {
			if(_ShallReloadOnPinningChange === null) {
				return $http.get(globals.webApiBaseUrl + 'basics/customize/systemoption/shallreloadonpinningchange').then(
					function(value) {
						_ShallReloadOnPinningChange = value;
						return value;
					}
				);
			}

			return $q.when(_ShallReloadOnPinningChange);
		};
	}

})(angular);