/**
 * Created by uestuenel on 14.03.2018.
 */

(function (angular) {
	'use strict';

	function basicsAudittrailActionService($translate, $q) {
		var service = {}, _action = [];

		service.loadData = function loadData() {

			var deferred = $q.defer();

			_action = [
				{
					Id: 'A', Description: $translate.instant('basics.audittrail.actionAll')
				},
				{
					Id: 'D', Description: $translate.instant('basics.audittrail.actionDeleted')
				},
				{
					Id: 'U', Description: $translate.instant('basics.audittrail.actionModified')
				}
			];

			deferred.resolve(_action);
			return deferred.promise;
		};

		service.getList = function getList() {
			return _action;
		};

		return service;
	}

	basicsAudittrailActionService.$inject = ['$translate', '$q'];

	angular.module('basics.audittrail').factory('basicsAudittrailActionService', basicsAudittrailActionService);
})(angular);
