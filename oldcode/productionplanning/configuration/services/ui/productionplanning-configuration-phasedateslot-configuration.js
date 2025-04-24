(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	angModule.factory('productionplanningConfigurationPhaseDateSlotLayout', Layout);
	Layout.$inject = ['$translate', 'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator', 'productionplanningCommonLayoutHelperService', 'ppsEntityConstant'];

	function Layout($translate, basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator, ppsCommonLayoutHelperService, ppsEntityConstant) {
		// register filters
		let filters = [{
			key: 'productionplanning-configuration-phasedateslot-ppsentityfk-filter',
			fn: (entity) => {
				return entity.Id === ppsEntityConstant.PPSProduct;
			}
		}];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		function getColumnSelections() {
			return [
				{id: 0, description: $translate.instant('productionplanning.configuration.plannedstart')},
				{id: 1, description: $translate.instant('productionplanning.configuration.plannedfinish')},
				{id: 2, description: $translate.instant('productionplanning.configuration.earlieststart')},
				{id: 3, description: $translate.instant('productionplanning.configuration.earliestfinish')},
				{id: 4, description: $translate.instant('productionplanning.configuration.lateststart')},
				{id: 5, description: $translate.instant('productionplanning.configuration.latestfinish')}
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
			'fid': 'productionplanning.configuration.phasedateslot.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [{
				gid: 'baseGroup',
				attributes: [
					'columntitle', 'ppsphasetypefk', 'columnselection', 'ppsentityfk', 'datetimeformat'
				]
			}, {
				gid: 'entityHistory',
				isHistory: true
			}
			],
			'overloads': {
				ppsphasetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsphasetype', null, {}),
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
					filterKey: 'productionplanning-configuration-phasedateslot-ppsentityfk-filter'
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