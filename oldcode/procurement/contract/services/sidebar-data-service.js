/**
 * Created by lnb on 11/17/2014.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.contract').factory('procurementContractSidebarDataService', ['$http', function ($http) {
		var setReportingDate = function setReportingDate(ConStatusFk, DateReported) {
			return $http.post(
				globals.webApiBaseUrl + 'procurement/contract/wizard/setreportingdate',
				{
					ConStatusFk: ConStatusFk,
					DateReported: DateReported
				}
			);
		};

		return {
			setReportingDate:setReportingDate
		};
	}]);
})(angular);