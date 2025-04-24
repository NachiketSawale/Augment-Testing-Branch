(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module('procurement.requisition').factory('procurementRequisitionCopyRequisitionHttpService',
		['$http',
			function ($http) {

				let service = {};

				service.copyRequisitionById = function (id,prcHeaderId) {
					return $http.get(globals.webApiBaseUrl + 'requisition/requisition/wizard/copyrequisition?reqHeaderId=' + id + '&prcHeaderId=' + prcHeaderId);
				};
				return service;
			}]);
})(angular);