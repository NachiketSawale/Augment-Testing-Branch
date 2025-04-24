(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationEventTypeSlotLayout', Layout);
	Layout.$inject = ['$translate', 'productionplanningCommonLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function Layout($translate, ppsCommonLayoutHelperService, basicsLookupdataConfigGenerator) {

		function getColumnSelections() {
			return [
				{id: 0, description: $translate.instant('productionplanning.configuration.plannedstart')},
				{id: 1, description: $translate.instant('productionplanning.configuration.plannedfinish')},
				{id: 2, description: $translate.instant('productionplanning.configuration.earlieststart')},
				{id: 3, description: $translate.instant('productionplanning.configuration.earliestfinish')},
				{id: 4, description: $translate.instant('productionplanning.configuration.lateststart')},
				{id: 5, description: $translate.instant('productionplanning.configuration.latestfinish')},
				{id: 20, description: $translate.instant('productionplanning.configuration.actualStart')},
				{id: 21, description: $translate.instant('productionplanning.configuration.actualFinish')}
			];
		}

		function getDateTimeFormat() {
			return [
				{id: 0, description: $translate.instant('productionplanning.configuration.datetime')},
				{id: 1, description: $translate.instant('productionplanning.configuration.date')},
				{id: 2, description: $translate.instant('productionplanning.configuration.time')}
			];
		}

		return {
			'fid': 'productionplanning.configuration.eventtypeslot.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: [
					'columntitle', 'ppseventtypefk', 'columnselection', 'ppsentityfk', 'ppsentityreffk', 'isreadonly', 'datetimeformat'
				]
			}, {
				gid: 'entityHistory',
				isHistory: true
			}
			],
			'overloads': {
				ppseventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload('productionplanning-configuration-eventtypeslot-eventtype-filter'),
				columnselection: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							items: getColumnSelections(),
							valueMember: 'id',
							displayMember: 'description'
						},
						editor: 'select',
						editorOptions: {
							items: getColumnSelections(),
							valueMember: 'id',
							displayMember: 'description'
						}
					}
				},
				ppsentityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					cacheEnable: true,
					filterKey: 'productionplanning-configuration-eventtypeslot-ppsentityfk-filter'
				}),
				ppsentityreffk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					cacheEnable: true,
					filterKey: 'productionplanning-configuration-eventtypeslot-ppsentityreffk-filter'
				}),
				datetimeformat: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							items: getDateTimeFormat(),
							valueMember: 'id',
							displayMember: 'description'
						},
						editor: 'select',
						editorOptions: {
							items: getDateTimeFormat(),
							valueMember: 'id',
							displayMember: 'description'
						}
					}
				},
			}
		};
	}
})(angular);