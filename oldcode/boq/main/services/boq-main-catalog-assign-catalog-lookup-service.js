/**
 * Created by Reimer on 25.04.2017.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('boq.main').factory('boqMainCatalogAssignCatalogLookupService', ['$q',
		'$http',
		/* 'basicsLookupdataLookupDescriptorService', */

		function ($q,
			$http
			/* lookupDescriptorService */) {

			var data = null;      // cached object list
			var service = {};

			service.loadData = function () {

				var deffered = $q.defer();
				if (data === null) {
					$http.get(globals.webApiBaseUrl + 'boq/main/catalog/list').then(function (response) {
						data = response.data;
						// lookupDescriptorService.updateData(service.getlookupType(), data);
						deffered.resolve();
					});
				} else {
					deffered.resolve();
				}
				return deffered.promise;
			};

			service.getList = function () {
				return service.loadData().then(function () {
					return data;
				});
			};

			service.getItemById = function (value) {
				return service.getItemByKey(value);
			};

			service.getItemByKey = function (value) {

				return service.getList().then(function () {
					var item = {};
					for (var i = 0; i < data.length; i++) {
						if (data[i].Id === value) {
							item = data[i];
							break;
						}
					}
					return item;
				});
			};

			service.getItemByIdAsync = function (value) {
				return service.getItemByKeyAsync(value);
			};

			service.getItemByKeyAsync = function (value) {
				return service.getList().then(function () {
					return service.getItemByKey(value);
				});
			};

			service.refresh = function () {
				data = null;
				service.loadData();
			};

			service.isPrjCostGroup = function (id) {
				return id === 15;
			};

			service.isLicCostGroup = function (id) {
				return id === 14;
			};

			service.isCostGroup = function (id) {
				return service.isPrjCostGroup(id) || service.isLicCostGroup(id);
			};

			return service;

		}]);
})();
