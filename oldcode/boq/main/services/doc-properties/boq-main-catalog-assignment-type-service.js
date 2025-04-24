/**
 * Created by benny on 12.06.2017.
 */
(function () {

	/* global globals, _ */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boq.main..service:boqMainCatalogAssignTypeService
	 * @function
	 *
	 * @description
	 * boqMainCatalogAssignTypeService is the data service for boq catalog assignment type functions.
	 */
	angular.module('boq.main').factory('boqMainCatalogAssignTypeService', ['$http', 'basicsLookupdataLookupFilterService', '$q', function ($http, basicsLookupdataLookupFilterService, $q) {

		var service = {}, boqCatalogTypeList = [];

		service.loadData = function loadData() {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/catalogassigntype/list').then(function (result) {
				var filter = basicsLookupdataLookupFilterService.getFilterByKey('boqCatalogAssignType');
				boqCatalogTypeList = _.isObject(filter) ? _.filter(result.data, filter.fn) : result.data;
			});
		};

		service.getList = function getList() {
			return boqCatalogTypeList;
		};

		service.loadCatAssignByTypeId = function loadCatAssignByTypeId(typeId) {
			if(_.isNumber(typeId)) {
				return $http.get(globals.webApiBaseUrl + 'boq/main/type/getboqcatassignconfbytypeid?typeId=' + typeId);
			}

			return $q.when(null);
		};

		return service;
	}]);
})();
