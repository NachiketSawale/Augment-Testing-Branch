/**
 * Created by zwz on 5/13/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	//producttemplate Layout
	angular.module(moduleName).value('productionplanningProducttemplateProductDescParamLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningProducttemplateProductDescParamLayout', PPSProductdescParamLayout);
	PPSProductdescParamLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function PPSProductdescParamLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.producttemplate.productDescParamLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['descriptioninfo', 'variablename', 'quantity', 'uomfk', 'sorting']
				}
			],
			'overloads': {
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				}),
				'quantity': {
					disallowNegative: true
				}
			}
		};

	}

})(angular);
