/**
 * Created by joshi on 08.07.2014.
 */
(function () {

	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boq.main..service:boqMainBoqTypeService
	 * @function
	 *
	 * @description
	 * boqMainBoqTypeService is the data service for boq type functions.
	 */
	angular.module('boq.main').factory('boqMainBoqTypeService', ['$q', '$http', function ($q, $http) {

		var data;      // cached indexed object list
		var typeList = [];
		var service = {};
		var forceLoad = false;

		function updateTypeList() {
			typeList = [];
			for (var key in data) {
				if (angular.isDefined(data[key].Description) && data[key].Description !== '' && data[key].Description !== null) {
					typeList.push(data[key]);
				}
			}
			// return _.sortBy(typeList, 'Description');
		}

		service.loadData = function loadData(forceLoading) {
			var deffered = $q.defer();

			if (angular.isDefined(forceLoading) && (forceLoading !== null) && forceLoading) {
				forceLoad = true;
			}

			if (!data || (angular.isDefined(forceLoad) && (forceLoad !== null) && forceLoad)) {
				$http.get(globals.webApiBaseUrl + 'boq/main/type/getboqtypes').then(function (response) {
					data = response.data;
					updateTypeList();
					deffered.resolve();
					forceLoad = false; // We only load the data once when being forced to.
				});
			} else {
				deffered.resolve();
			}

			return deffered.promise;
		};

		service.getBoqType = function getBoqType() {
			return typeList;
		};

		service.getList = function getList() {
			return service.getBoqType();
		};

		return service;
	}]);
})();
