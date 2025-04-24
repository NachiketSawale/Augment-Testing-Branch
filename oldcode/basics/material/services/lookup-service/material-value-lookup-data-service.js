/**
 * Created by wui on 10/13/2016.
 */

(function (angular) {
	'use strict';

	angular.module('basics.material').factory('basicsMaterialMaterialValueLookupDataService', [
		'$q',
		'$http',
		'basicsMaterialRecordService',
		function (
			$q,
			$http,
			basicsMaterialRecordService
		) {
			var service = {};

			service.getList = function (settings, scope) {
				var deferred = $q.defer();
				var material = basicsMaterialRecordService.getSelected();
				if (material && !_.isNil(material.MaterialGroupFk) && scope.entity.PropertyDescription) {
					$http.post(globals.webApiBaseUrl + 'basics/materialcatalog/groupcharval/search', {
						MaterialGroupFk: material.MaterialGroupFk,
						Property: scope.entity.PropertyDescription
					}).then(function (res) {
						deferred.resolve(res.data);
					}, function () {
						deferred.resolve([]);
					});
				} else {
					deferred.resolve([]);
				}

				return deferred.promise;
			};

			service.getDefault = function () {
				// no use.
				return $q.when({});
			};

			service.getItemByKey = function () {
				// no use.
				return $q.when({});
			};

			service.getSearchList = function () {
				// no use.
				return $q.when([]);
			};

			return service;
		}
	]);

})(angular);
