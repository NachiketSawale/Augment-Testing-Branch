/**
 * Created by uestuenel on 16.11.2016.
 */
(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowClerkRoleService', basicsWorkflowClerkRoleService);

	basicsWorkflowClerkRoleService.$inject = ['$http'];

	function basicsWorkflowClerkRoleService($http) {
		var service = {};

		service.getItems = function getParameters(value) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/customize/' + value
			}).then(function (response) {
				return response.data;
			});
		};

		return service;
	}
})(angular);
