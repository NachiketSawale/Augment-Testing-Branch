/**
 * Created by leo on 29.04.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'logistic.common';
	var myModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name logisticCommonMaterialDataService
	 * @description provides methods to access basics material entity
	 */
	myModule.service('logisticCommonMaterialDataService', LogisticCommonMaterialDataService);
	LogisticCommonMaterialDataService.$inject = ['$http', '$q'];

	function LogisticCommonMaterialDataService($http, $q) {
		this.getItemByIdAsync = function getItemByIdAsync(id) {
			var deferred = $q.defer();
			$http.get(globals.webApiBaseUrl + 'basics/material/getbyid?id=' + id).then(function (response) {
				var result = null;
				if (response && response.data) {
					result = response.data;
				}
				deferred.resolve(result);
			});
			return deferred.promise;
		};
		this.getItemById = function getItemById() {
			return undefined;
		};
	}
})(angular);