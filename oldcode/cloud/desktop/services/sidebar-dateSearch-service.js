(function (angular, globals) {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarDateSearchService', cloudDesktopSidebarDateSearchService);

	cloudDesktopSidebarDateSearchService.$inject = ['$http', '_', '$q', 'platformModalService', '$translate', 'moment'];

	function cloudDesktopSidebarDateSearchService($http, _, $q, platformModalService, $translate, moment) {
		var service = {
			fetchVariablePeriods: fetchVariablePeriods,
			fetchSearchColumns: fetchSearchColumns,
			setParameters: setParameters,
			resetFilter: resetFilter,
			filterRequested: filterRequested
		};

		var varPeriods, searchColumnLists = [];
		service.selectedParameters = {};
		service.currentSearchColumns = [];
		service.currentModule;

		// enhancedfilter  messengers
		service.onFilterChanged = new Platform.Messenger();

		function fetchVariablePeriods() {
			if (!varPeriods) {
				// fetch environment expressions
				return $http.post(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/envexprs', ['date'])
					.then(function (response) {
						if (!_.isUndefined(response.data)) {
							varPeriods = response.data;
							return varPeriods;
						}
					});
			} else {
				return $q.when(varPeriods);
			}
		}

		function fetchSearchColumns(moduleName, route) {
			if (!_.find(searchColumnLists, {module: moduleName})) {
				return $http.get(route + 'getadditionalsimplesearchcolumnfilterlist')
					.then(function (response) {
						if (!_.isUndefined(response.data)) {
							var result = _.orderBy(response.data, ['Label']);
							searchColumnLists.push({list: result, module: moduleName});
							return result;
						}
					});
			} else {
				return $q.when(_.find(searchColumnLists, {module: moduleName}).list);
			}
		}

		function setParameters(value) {
			if (value && value.parameters) {
				if (_.isString(value.parameters.date)) {
					value.parameters.date = moment.utc(value.parameters.date);
				}
				service.selectedParameters = value;
			}
		}

		function resetFilter(options, params) {
			var defaultParameters = {
				tab: {
					tags: true,
					calendar: false
				},
				formattedDate: '|',
				selectedTag: '-',
				parameters: {
					field: undefined,
					date: undefined,
					time: [0, 1439]
				}
			};
			setParameters(params || defaultParameters);
			if (options && !_.isNil(options.includeDateSearch)) {
				service.currentModule = options.moduleName;
				fetchSearchColumns(options.moduleName, options.httpRoute).then(function (columns) {
					service.currentSearchColumns = columns;
					service.onFilterChanged.fire();
				});
			}
		}

		function filterRequested(newValue) {
			let filterReq = false;
			if (!_.isNil(newValue)) {
				filterReq = newValue;
			}
			return filterReq;
		}

		return service;
	}
})(angular, globals);