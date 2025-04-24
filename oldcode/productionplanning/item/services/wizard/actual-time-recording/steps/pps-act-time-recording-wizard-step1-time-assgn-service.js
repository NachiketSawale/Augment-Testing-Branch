/**
 * Created by zwz on 01/06/2023.
 */

(function (angular) {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningActualTimeRecordingWizardStep1TimeAssignmentService', Service);
	Service.$inject = ['$http', '$injector', '$q', 'ppsActualTimeRecordingTimeAssignmentDataService'];

	function Service($http, $injector, $q, assignmentDataService) {

		let service = {};
		const cache = {
			date: null,
			siteId: null,
			timeSymbolId: null,
			exist(date, siteId, timeSymbolId) {
				return this.date === date && this.siteId === siteId && this.timeSymbolId === timeSymbolId;
			},
			set(date, siteId, timeSymbolId) {
				this.date = date;
				this.siteId = siteId;
				this.timeSymbolId = timeSymbolId;
			},
			clear() {
				this.date = this.siteId = this.timeSymbolId = null;
			},
		};

		service.initial = function initial(date, siteId, timeSymbolId) {
			if (cache.exist(date, siteId, timeSymbolId)) {
				setTimeout(() => assignmentDataService.fireReportLoaded(), 100);
				return $q.when(true);
			}

			cache.set(date, siteId, timeSymbolId);
			return assignmentDataService.load(date, siteId, timeSymbolId);
		};

		service.isValid = function () {
			return angular.isFunction(service.isLoading) && !service.isLoading();
		};

		service.active = function ($scope) {
			service.isLoading = () => $scope.isLoading;
			service.setLoadingStatus = status => $scope.isLoading = status;
		};

		service.unActive = function () {
			const platformGridAPI = $injector.get('platformGridAPI');
			platformGridAPI.grids.commitAllEdits();
			return $q.when(true);
		};

		service.apply = function () {
			service.setLoadingStatus(true);
			return assignmentDataService.update().then(() => {
				service.setLoadingStatus(false);
			});
		};

		service.canApply = function () {
			return assignmentDataService.hasModifiedReports();
		};

		service.clearCache = function () {
			cache.clear();
		};

		return service;
	}
})(angular);
