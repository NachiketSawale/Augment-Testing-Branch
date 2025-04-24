/**
 * Created by wui on 3/1/2017.
 */
/* global globals */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).factory('constructionSystemProjectCompareCosService', [
		'$http',
		function ($http) {
			var service = {};
			var urlBase = globals.webApiBaseUrl + 'constructionsystem/main/instance/';

			service.compare = function (request) {
				return $http.post(urlBase + 'compare', request);
			};

			service.autoUpdate = function (items) {
				return $http.post(urlBase + 'autoupdate', items);
			};

			return service;
		}
	]);

})(angular);