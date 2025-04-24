/**
 * Created by wui on 6/13/2017.
 */
/* global globals,_ */

(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.project';

	angular.module(modulename).factory('cosModelObjectFilterDefService', ['$http', '$q',
		function ($http, $q) {
			var url = globals.webApiBaseUrl + 'model/main/objectfilter/getfilterdefinitions';

			return {
				getList: function () {
					var deferred = $q.defer();

					$http.get(url).then(function (response) {
						deferred.resolve(response.data);
					});

					return deferred.promise;
				},
				getItemByKey: function (id) {
					var deferred = $q.defer();

					this.getList().then(function (data) {
						deferred.resolve(_.find(data, {Id: id}));
					});

					return deferred.promise;
				}
			};
		}
	]);

})(angular);