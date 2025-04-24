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

	//engtype Layout Config
	angModule.value('productionplanningConfigurationEngtypeLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//engtype Layout
	angModule.factory('productionplanningConfigurationEngtypeLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator'];
	function Layout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.configuration.engtype.detailForm',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: [
						'descriptioninfo', 'isdefault', 'islive', 'icon', 'sorting', 'rubriccategoryfk'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				icon: {
					grid: {
						lookupField: 'Icon',
						formatter: 'imageselect',
						editor: 'imageselect',
						formatterOptions: {
							serviceName: 'platformStatusIconService'
						}
					},
					detail: {
						model: 'Icon',
						type: 'imageselect',
						editorOptions: {
							serviceName: 'platformStatusIconService'
						}
					}
				},
				rubriccategoryfk:{
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							lookupOptions: {
								filterKey: 'productionplanning-configuration-engtype-rubric-category',
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: { 'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description' },
						width: 125
					},
					detail:{
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'productionplanning-configuration-engtype-rubric-category',
								showClearButton: true
							}
						}
					}
				}
			}
		};
	}

})(angular);