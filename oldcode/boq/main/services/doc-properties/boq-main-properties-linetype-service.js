/**
 * Created by joshi on 27.08.2014.
 */
(function () {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boq.main..service:boqMainBoqLineTypeService
	 * @description
	 * boqMainBoqLineTypeService is the data service for boq Line type list.
	 */
	angular.module('boq.main').factory('boqMainBoqLineTypeService', ['$q', '$http', function ($q, $http) {
		var deffered = $q.defer();
		var data;
		var service = {};

		service.loadData = function () {
			if (!data) {
				$http.get(globals.webApiBaseUrl + 'boq/main/type/getboqlinetypes').then(function (response) {
					data = response.data;
					deffered.resolve();
				});
			}
			return deffered.promise;
		};

		service.getList = function () {
			var lineTypeList = [];
			for (var key in data) {
				if (data[key].Description !== '') {
					lineTypeList.push(data[key]);
				}
			}
			//            return _.sortBy(typeList, 'description');
			return lineTypeList;
		};
		return service;
	}
	]);
})();