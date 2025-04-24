(function (angular) {
	'use strict';
	/* globals angular, _, globals */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('trsTransportCheckResRequisitionReadOnlyProcessor', processor);

	processor.$inject = [
		'$injector',
		'platformRuntimeDataService',
		'$http'
	];

	function processor($injector,
	                   platformRuntimeDataService,
	                   $http) {
		var service = {};

		var loadResReqStatusPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/resrequisitionstatus/list').then(function (response) {
			if (response !== null && response.data !== null) {
				return response.data;
			}
			return [];
		});

		var fields = ['Description', 'ResourceFk', 'JobFk', 'TypeFk', 'Quantity', 'UomFk', 'RequestedFrom', 'RequestedTo',  'CommentText',  'ActivityFk', 'TrsRequisitionFk', 'IsLinkedFixToReservation', 'UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05'];

		service.processItem = function (item) {
			if (item && item.Version > 0) {
				loadResReqStatusPromise.then(function(resReqStatusList){
					var status = _.find(resReqStatusList, {Id: item.RequisitionStatusFk });
					service.setColumnsReadOnly(item, fields, status.IsConfirmed === true);
				});
			}
		};
		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}
})(angular);
