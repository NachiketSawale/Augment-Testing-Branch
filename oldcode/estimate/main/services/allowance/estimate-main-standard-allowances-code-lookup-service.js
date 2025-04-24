(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainAllowanceCodeLookupService',
		['$http', '$q', 'globals', function ($http, $q, globals) {

			let service = {};
			let SelectedId = -1;
			let lookupData = [];
			let SelectedCode = -1;

			service.getList = function () {
				let deferred = $q.defer();
				$http.get(globals.webApiBaseUrl + 'estimate/main/estimateallowance/getMdcAllowances')
					.then(function (response) {
						lookupData = response.data;
						deferred.resolve(response.data);
						return deferred.promise;
					});
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
				return lookupData;
			};

			service.getItemByKey = function getItemByKey(value) {
				return _.find(lookupData, {Id: value});
			};

			return service;
		}]);
})(angular);