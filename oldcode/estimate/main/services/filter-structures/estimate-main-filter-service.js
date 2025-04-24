/**
 * Created by janas on 10.03.2015.
 */

(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainFilterService
	 * @function
	 *
	 * @description
	 * estimateMainFilterService for filtering e.g. line items container by combination of several filters.
	 */
	angular.module(moduleName).factory('estimateMainFilterService', ['_', '$injector', 'estimateCommonFilterServiceProvider', 'platformGridAPI', 'cloudCommonGridService', '$timeout',
		function (_, $injector, estimateCommonFilterServiceProvider, platformGridAPI, cloudCommonGridService, $timeout) {

			let service = estimateCommonFilterServiceProvider.getInstance('estimate', 'main');

			// support for server side filtering
			let structure2FilterIds = {}, filterRequest = {};

			service.setFilterIds = function (key, ids, isIgnoreLoadData) {
				structure2FilterIds[key] = ids;

				if(!!isIgnoreLoadData){
					return;
				}

				let dataService = service.getServiceToBeFiltered();
				if (dataService && _.isFunction(dataService.load)) {
					dataService.load();
				}
			};

			service.getAllFilterIds = function () {
				return structure2FilterIds;
			};

			// activate support for filtering the leading structure on given property
			service.addLeadingStructureFilterSupport = function (leadingStructreDataService, propertyName) {
				let dataService = service.getServiceToBeFiltered() || $injector.get('estimateMainService');
				if (dataService && _.isFunction(dataService.getList)) {
					leadingStructreDataService.setItemFilter(function (item) {
						let ids = _.uniq(_.compact(_.map(dataService.getList(), propertyName)));
						return ids.indexOf(item.Id) >= 0;
					});
				}
			};

			service.getFilterRequest = function () {
				return filterRequest;
			};

			service.setFilterRequest = function (_filterRequest) {
				filterRequest = _filterRequest;
			};

			service.getMultiSelectStatus = function (serviceContainer) {
				let multiSelect = false;
				if (serviceContainer.data.usingContainer && serviceContainer.data.usingContainer[0]) {
					let existedGrid = platformGridAPI.grids.exist(serviceContainer.data.usingContainer[0]);
					if (existedGrid) {
						let columns = platformGridAPI.columns.getColumns(serviceContainer.data.usingContainer[0]);
						let markerColumn = _.find(columns, {'field': 'IsMarked'});
						if (markerColumn && markerColumn.editorOptions) {
							multiSelect = markerColumn.editorOptions.multiSelect;
						}
					}
				}
				return multiSelect;
			};

			service.handleMarkStatus = function (filterKey, serviceContainer, dtos, childProp) {
				let filterIds = service.getAllFilterIds();
				let multiSelect = service.getMultiSelectStatus(serviceContainer);
				if (filterIds[filterKey] && _.isArray(filterIds[filterKey])) {
					let flatList = cloudCommonGridService.flatten(dtos, [], childProp);
					let filterItem = _.filter(flatList, function (item) {
						return (multiSelect ? _.includes(filterIds[filterKey], item.Id) : item.Id === filterIds[filterKey][0]);
					});

					if (filterItem && _.isArray(filterItem) && filterItem[0]) {
						// IsMarked used by the UI config service as filter field
						_.each(filterItem, function (item) {
							item.IsMarked = true;
						});

						let grids = serviceContainer.data.usingContainer;
						_.each(grids, function (gridId) {
							if (gridId) {
								$timeout(function () {
									platformGridAPI.rows.scrollIntoViewByItem(gridId, filterItem[0]);
									serviceContainer.service.setSelected(filterItem[0]);
								});
							}
						});
					}
				}
			};

			return service;
		}]);
})();
