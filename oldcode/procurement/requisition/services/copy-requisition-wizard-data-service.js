(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.requisition').factory('procurementRequisitionCopyRequisitionDataService',
		['procurementRequisitionCopyRequisitionHttpService', '$q',
			function (procurementRequisitionCopyRequisitionHttpService, $q) {

				let service = {};

				service.copyRequisitionById = function (id,prcHeaderId) {
					let defer = $q.defer();
					procurementRequisitionCopyRequisitionHttpService.copyRequisitionById(id,prcHeaderId).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				};
				return service;
			}]);
})(angular);