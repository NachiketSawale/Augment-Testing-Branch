/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsClerkUtilitiesService
	 * @function
	 *
	 * @description
	 * basicsClerkUtilitiesService
	 */
	angular.module('basics.clerk').factory('basicsClerkUtilitiesService', ['_', '$q', '$http',

		function (_, $q, $http) {

			var client;
			const clerksForUser = {};

			var service = {
				getClientByUser: function getClientByUser() {
					var defer = $q.defer();

					if (client) {
						defer.resolve(client);
					} else {
						$http.get(globals.webApiBaseUrl + 'basics/clerk/toUser').then(function (response) {
							client = response.data;
							defer.resolve(client);
						});
					}

					return defer.promise;
				},
				getClerkByUserId: function getClerkByUserId(userId) {
					if(_.isNil(clerksForUser[userId])) {
						return $http.get(globals.webApiBaseUrl + 'basics/clerk/clerkByUser?userId=' + userId).then(function (response) {
							var clerk = response.data;
							clerksForUser[userId] = clerk;
							
							return clerk;
						});
					}
					
					return $q.when(clerksForUser[userId]);
				},

				getClerkById: function getClerkById(clerkId) {
					var defer = $q.defer();
					if (clerkId) {
						$http.get(globals.webApiBaseUrl + 'basics/clerk/getClerkById?clerkId=' + clerkId).then(function (response) {
							defer.resolve(response.data);
						});
					} else {
						defer.resolve(null);
					}
					return defer.promise;
				}
			};

			return service;
		}]);
})(angular);
