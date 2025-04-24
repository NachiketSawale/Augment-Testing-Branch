/**
 * Created by luy on 11/18/2019.
 */
(function(angular){
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainModelObjectFilterService', constructionSystemMainModelObjectFilterService);

	constructionSystemMainModelObjectFilterService.$inject = ['$http'];

	function constructionSystemMainModelObjectFilterService($http) {
		var service = {};
		service.listBySelectionStatement = listBySelectionStatement;

		// ///////////////////////////////////////
		function listBySelectionStatement(instanceid, modelId) {
			return $http.get(globals.webApiBaseUrl + 'constructionsystem/main/instance2object/listbyselectionstatement?cosInstanceId=' + instanceid + '&modelId=' + modelId).then(function (response) {
				return response.data;
			});
		}

		return service;
	}
})(angular);