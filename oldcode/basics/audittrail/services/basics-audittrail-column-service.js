/**
 * Created by uestuenel on 14.03.2018.
 */
(function (angular) {
	'use strict';

	function basicsAudittrailColumnService($http, $translate, mainViewService) {
		var service = {}, columns = [];

		// service.loadData = function loadData(itemID) {
		//
		// 	return $http({
		// 		method: 'GET',
		// 		url: globals.webApiBaseUrl + 'basics/config/audittrail/containercols',
		// 		params: {
		// 			mainItemId: 128
		// 		}
		// 	}).then(function(response) {
		// 		columns = response.data;
		// 	});
		//
		// };

		// service.getList = function getList(itemID) {
		// 	return getFirstItem(columns);
		// };

		service.getColumList = function (mainItemId) {
			var data = {};
			data.mainItemId = mainItemId;
			data.moduleName = mainViewService.getCurrentModuleName();
			return $http.post(globals.webApiBaseUrl + 'basics/config/audittrail/containercols', data).then(function (response) {
				return getFirstItem(response.data);
			});
		};

		function getFirstItem(data) {
			data.unshift({
				Columnname: $translate.instant('basics.audittrail.all')
			});
			return data;
		}

		return service;
	}

	basicsAudittrailColumnService.$inject = ['$http', '$translate', 'mainViewService'];

	angular.module('basics.audittrail').factory('basicsAudittrailColumnService', basicsAudittrailColumnService);

})(angular);
