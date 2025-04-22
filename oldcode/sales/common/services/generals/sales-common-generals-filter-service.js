/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {


	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('salesCommonGeneralsFilterService',
		['_', 'basicsLookupdataLookupFilterService',
			function (_, basicsLookupdataLookupFilterService) {

				var service = {},
					filters = [];

				service.setFilterKeys = function setFilterKeys(subModuleName, layout) {

					// set filter keys for controlling unit lookup (generals list)
					var submodule = subModuleName.toLowerCase().replace('.', '-');
					var filterName = submodule + '-generals-controlling-unit-filter';
					var ctrlUnit = 'overloads.controllingunitfk';

					_.set(layout, ctrlUnit + '.grid.editorOptions.lookupOptions.filterKey', filterName);
					_.set(layout, ctrlUnit + '.detail.options.lookupOptions.filterKey', filterName);
				};

				service.registerFilters = function registerFilters(subModuleName, parentService) {

					var submodule = subModuleName.toLowerCase().replace('.', '-'),
						filterKey = submodule + '-generals-controlling-unit-filter';

					var generalTypeFilter = {
						key: 'sales-common-generals-type-lookup',
						serverSide: true,
						fn: function () {
							return 'IsSales = true';
						}
					};
					basicsLookupdataLookupFilterService.registerFilter([generalTypeFilter]);

					if (!_.find(filters, {key: filterKey})) {
						// controlling unit filter
						var filterObject = {
							key: submodule + '-generals-controlling-unit-filter',
							serverKey: 'basics.masterdata.controllingunit.filterkey',
							serverSide: true,
							fn: function () {
								var currentItem = parentService.getSelected();
								if(currentItem && currentItem.ProjectFk !== null) {
									return { ProjectFk: currentItem.ProjectFk };
								}
							}
						};
						filters.push(filterObject);

						basicsLookupdataLookupFilterService.registerFilter([filterObject]);
					}
				};

				return service;
			}]);

})(angular);
