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
	 * @name logisticCommonDispatchRecordDataService
	 * @description provides methods to access logistic dispatch record entity
	 */
	myModule.service('logisticCommonDispatchRecordDataService', LogisticCommonDispatchRecordDataService);
	LogisticCommonDispatchRecordDataService.$inject = ['$http', '$q'];

	function LogisticCommonDispatchRecordDataService($http, $q) {
		this.getItemByIdAsync = function getItemByIdAsync(id) {
			var deferred = $q.defer();
			$http.post(globals.webApiBaseUrl + 'logistic/dispatching/record/getById', {Id: id}).then(function (response) {
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