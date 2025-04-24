/**
 * Created by uestuenel on 24.06.2016.
 */

(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowChangeStatusService', basicsWorkflowChangeStatusService);

	basicsWorkflowChangeStatusService.$inject = ['$http'];

	function basicsWorkflowChangeStatusService($http) {
		var service = {};

		service.getParameters = function getParameters(statusName) {
			return $http.get(globals.webApiBaseUrl + 'basics/common/status/list?statusName=' + statusName)
				.then(function (respon) {
					return respon.data;
				}, function () {
					//return empty array field. Otherwise the values from selectbox are not right
					return [];
				});
		};
		return service;
	}
})(angular);
