/**
 * Created by bh on 31.05.2016.
 */
(function () {

	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boq.main..service:boqMainBoqStandardService
	 * @function
	 *
	 * @description
	 * boqMainBoqStandardService is the data service for boq standard functions.
	 */
	angular.module('boq.main').factory('boqMainBoqStandardService', ['$http', function ($http) {

		var service = {};
		var boqStandardList = [];

		service.loadData = function loadData() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/boqstandard/list').then(function (result) {
				boqStandardList = result.data;
			});
		};

		service.getList = function getList() {
			return boqStandardList;
		};

		return service;
	}]);
})();
