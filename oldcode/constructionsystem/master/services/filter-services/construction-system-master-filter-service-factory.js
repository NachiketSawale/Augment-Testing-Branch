
(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterFilterServiceProvider', [function () {

		var service = {}, instanceCache = {};

		function FilterServiceProvider() {

			var currentFilterItems = [];
			var filterConfig = {
				filterService: null,
				tobeFilterService: null
			};

			this.onFilterModified = new Platform.Messenger();

			this.isFilter = function () {
				return true;
			};

			this.removeFilter = function () {
				this.setFilter([]);
			};

			this.getTobeFilterService = function () {
				return filterConfig.tobeFilterService;
			};

			this.setTobeFilterService = function (dataService) {
				filterConfig.tobeFilterService = dataService;
			};

			this.setFilter = function (filterItems) {
				currentFilterItems = filterItems;
				this.onFilterModified.fire();
			};

			this.getFilter = function () {
				return currentFilterItems;
			};
		}

		service.getFilterService = function (filterId) {
			if (instanceCache[filterId]) {
				return instanceCache[filterId];
			} else {
				var instance = new FilterServiceProvider();
				instanceCache[filterId] = instance;
				return instance;
			}
		};

		return service;

	}]);

})(angular);