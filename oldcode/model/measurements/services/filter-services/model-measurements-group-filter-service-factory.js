/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */

	const moduleName = 'model.measurements';
	angular.module(moduleName).factory('modelMeasurementFilterServiceProvider', [function () {

		const service = {}, instanceCache = {};

		function FilterServiceProvider() {

			let currentFilterItems = [];
			const filterConfig = {
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
				const instance = new FilterServiceProvider();
				instanceCache[filterId] = instance;
				return instance;
			}
		};

		return service;

	}]);

})(angular);