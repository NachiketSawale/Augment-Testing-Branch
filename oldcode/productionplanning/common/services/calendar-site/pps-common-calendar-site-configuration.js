(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

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

	angular.module(moduleName).value('ppsCommonCalendarSiteLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('ppsCommonCalendarSiteLayout', Layout);
	Layout.$inject = ['$injector', '$translate', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',  'basicsCommonComplexFormatter', 'basicsCommonCommunicationFormatter'];
	function Layout($injector, $translate, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, basicsCommonComplexFormatter, communicationFormatter) {


		return {
			'fid': 'productionplanning.common.calendarsiteLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: ['ppsentityfk', 'calcalendarfk', 'commenttext']
			}, {
				gid: 'userDefTextGroup',
				isUserDefText: true,
				attCount: 5,
				attName: 'userdefined',
				noInfix: true
			}],
			'overloads': {
				ppsentityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					cacheEnable: true,
					filterKey: 'productionplanning-configuration-eventtype-ppsentityfk-filter'
				}),
				calcalendarfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarDataService',
					enableCache: true
				})
			}
		};
	}
})(angular);
