(function (angular) {

	/* global _ */

	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainStandardAllowanceLookupService',
		['$http', '$q', 'estimateMainStandardAllowancesDataService', function ($http, $q, estimateMainStandardAllowancesDataService) {

			let service = {};
			let SelectedId = -1;
			let SelectedCode = -1;

			service.getList = function () {
				let deferred = $q.defer();
				let estAllowances = estimateMainStandardAllowancesDataService.getList();
				deferred.resolve(estAllowances);
				return deferred.promise;
			};

			service.getSelectedId = function getSelectedId() {
				return SelectedId;
			};

			service.setSelectedId = function setSelectedId(item) {
				SelectedId = item !== null ? item.Id : -1;
			};

			service.getSelectedCode = function getSelectedCode() {
				return SelectedCode;
			};

			service.setSelectedCode = function setSelectedCode(item) {
				SelectedCode = item !== null ? item.Code : -1;
			};

			service.getLookupData = function getLookupData() {
				return estimateMainStandardAllowancesDataService.getList();
			};

			service.getItemByKey = function getItemByKey(value) {
				return _.find(estimateMainStandardAllowancesDataService.getList(), {Id: value});
			};

			return service;
		}]);
})(angular);