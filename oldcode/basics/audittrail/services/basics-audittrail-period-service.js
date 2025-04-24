/**
 * Created by uestuenel on 14.03.2018.
 */

(function (angular) {
	'use strict';

	function basicsAudittrailPeriodService($translate, $q) {
		var service = {}, _period = [];

		service.loadData = function loadData() {

			var deferred = $q.defer();

			_period = [
				{Id: 1, Description: $translate.instant('basics.audittrail.FilterToday')},
				{Id: 2, Description: $translate.instant('basics.audittrail.FilterYesterday')},
				{Id: 3, Description: $translate.instant('basics.audittrail.FilterLast7Days')},
				{Id: 4, Description: $translate.instant('basics.audittrail.FilterLast30Days')},
				{Id: 5, Description: $translate.instant('basics.audittrail.FilterCustom')}
			];

			deferred.resolve(_period);
			return deferred.promise;
		};

		service.getList = function getList() {
			return _period;
		};

		return service;
	}

	basicsAudittrailPeriodService.$inject = ['$translate', '$q'];

	angular.module('basics.audittrail').factory('basicsAudittrailPeriodService', basicsAudittrailPeriodService);
})(angular);

