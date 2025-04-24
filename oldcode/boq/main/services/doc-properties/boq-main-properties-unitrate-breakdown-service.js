/**
 * Created by joshi on 25.08.2014.
 */
(function () {
	/* global globals, _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boq.main..service:boqMainUrBreakdownService
	 * @function
	 *
	 * @description
	 * boqMainUrBreakdownService is the data service for boq Unit Rate Breakdown functions.
	 */
	angular.module('boq.main').factory('boqMainUrBreakdownService', ['$q', '$http', function ($q, $http) {

		var deffered = $q.defer();
		var data;
		var urbList = [];
		var service = {};
		var runningReadCall = false;

		service.loadData = function () {
			if (angular.isUndefined(data) || data === null) {
				if (!runningReadCall) {
					runningReadCall = true;
					$http.get(globals.webApiBaseUrl + 'boq/main/type/getboqdefaulturbs').then(
						function (response) {
							data = response.data;
							deffered.resolve();
						},
						function () {
							// Error case -> make sure flag is reset
							runningReadCall = false;
						});
				}
			} else if (_.isObject(data)) {
				runningReadCall = false;
				return $q.when(data);
			}

			return deffered.promise;
		};

		service.getList = function () {

			if (angular.isDefined(data) && _.isArray(data) && data.length > 0) {
				urbList = _.filter(data, function (item) {
					return angular.isDefined(item) && item !== null && item.DescriptionInfo.Translated !== '';
				});

				return urbList;
			}

			return [];
		};

		return service;
	}
	]);
})();
