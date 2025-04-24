(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

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

	//eventtype2restype Layout Config
	angModule.value('productionplanningConfigurationEventtype2restypeLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//eventtype2restype Layout
	angModule.factory('productionplanningConfigurationEventtype2restypeLayout', Layout);
	Layout.$inject = ['$translate', 'basicsLookupdataConfigGenerator', 'productionplanningConfigurationEventtype2restypeDataService', 'platformLayoutHelperService'];
	function Layout($translate, basicsLookupdataConfigGenerator, dataService, platformLayoutHelperService) {

		function getDateshiftModeResRequisitionOptions() {
			var items = [
				{id: 0, description: $translate.instant('productionplanning.configuration.disabled')},
				{id: 1, description: $translate.instant('productionplanning.configuration.interlocked')}
			];
			return {
				items: items,
				valueMember: 'id',
				displayMember: 'description'
			};
		}

		return {
			'fid': 'productionplanning.configuration.eventtype2restype.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'change': function (entity, field) {
				dataService.onValueChanged(entity, field);
			},
			'groups': [
				{
					gid: 'baseGroup',
					attributes: [
						'basresourcecontextfk', 'restypefk', 'resresourcefk', 'commenttext',
						'islinkedfixtoreservation', 'istruck', 'isdriver', 'dateshiftmoderesrequisition'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				restypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceTypeLookupDataService', // TODO-pep: Wait new lookup filter by resource context by Frank.
					navigator: {
						moduleName: 'resource.type'
					}
				}, {
					required: true
				}),
				dateshiftmoderesrequisition: {
					grid: {
						formatter: 'select',
						formatterOptions: getDateshiftModeResRequisitionOptions(),
						editor: 'select',
						editorOptions: getDateshiftModeResRequisitionOptions()
					},
					detail: {
						type:'select',
						options: getDateshiftModeResRequisitionOptions()
					},
				},
				resresourcefk: platformLayoutHelperService.provideResourceLookupOverload(),
				basresourcecontextfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.company.resourcecontext')
			}
		};
	}

})(angular);