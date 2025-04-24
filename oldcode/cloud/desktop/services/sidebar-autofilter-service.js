(function (angular, globals) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarAutofilterService', cloudDesktopSidebarAutofilterService);

	cloudDesktopSidebarAutofilterService.$inject = ['$http', '_', '$q'];

	function cloudDesktopSidebarAutofilterService($http, _, $q) {
		var service = {
			saveAutofilterDefinition: saveAutofilterDefinition,
			deleteAutofilterDefinition: deleteAutofilterDefinition,
			getCurrentFilter: getCurrentFilter,
			loadAutofilter: loadAutofilter
		};

		var autoFilterLists = [];

		function saveAutofilterDefinition(modulename, accessLevel, value, id) {
			if (_.isString(modulename) && modulename.length > 0) {
				var currentFilter = getFilter(modulename, accessLevel);
				if (_.isNull(currentFilter)) {
					// filter hasn't loaded yet
					return loadAutofilter(modulename).then(function (loaded) {
						if (loaded) {
							saveAutofilterDefinition(modulename, accessLevel, value, id);
						}
					});
				}
				if (_.isUndefined(currentFilter)) {
					currentFilter = {
						accessLevel: accessLevel,
						moduleName: modulename,
						filterDef: {}
					};
				}
				// validate changes
				var oldFilterDef = _.cloneDeep(currentFilter.filterDef);
				currentFilter.filterDef = id ? _.set(currentFilter.filterDef, id, value) : value;
				if (!_.isEqual(currentFilter.filterDef, oldFilterDef)) {
					return $http.post(
						globals.webApiBaseUrl + 'cloud/common/autofilter/save',
						currentFilter
					).then(function (result) {
						var moduleFilters = _.find(autoFilterLists, {module: modulename});
						moduleFilters.filters = _.unionBy(moduleFilters.filters, [result.data], 'id');
					});
				} else {
					return $q.when();
				}
			} else {
				console.warn('modulename is invalid! value: ' + modulename);
				return $q.when();
			}
		}

		function deleteAutofilterDefinition(modulename, accessLevel) {
			var currentFilter = getFilter(modulename, accessLevel);
			if (currentFilter) {
				return $http.post(
					globals.webApiBaseUrl + 'cloud/common/autofilter/delete',
					currentFilter
				).then(function (result) {
					if (result.data) {
						var moduleFilters = _.find(autoFilterLists, {module: modulename});
						_.remove(moduleFilters.filters, {accessLevel: accessLevel});
					}
				});
			}
		}

		function getCurrentFilter(modulename, id) {
			var currentFilter = getFilter(modulename, 'u') || getFilter(modulename, 'g');
			return id ? _.get(currentFilter, 'filterDef.' + id) : currentFilter;
		}

		function loadAutofilter(modulename) {
			if (!modulename || _.find(autoFilterLists, {module: modulename})) {
				return $q.when(true);
			} else {
				return $http({
					url: globals.webApiBaseUrl + 'cloud/common/autofilter/list',
					method: 'GET',
					params: {modulename: modulename}
				}).then(function (result) {
					var moduleFilters = {
						module: modulename,
						filters: result.data,
						paused: false
					};
					autoFilterLists.push(moduleFilters);
					return true;
				});
			}
		}

		// private methods

		function getFilter(modulename, accessLevel) {
			var modFilters = _.find(autoFilterLists, {module: modulename});
			return modFilters ? _.find(modFilters.filters, {accessLevel: accessLevel}) : null;
		}

		return service;
	}
})(angular, globals);