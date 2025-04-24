/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.cadimportconfig';

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

	angular.module(moduleName).value('ppsEngineeringCadValidationConfigLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('ppsEngineeringCadValidationConfigLayout', Layout);

	Layout.$inject = [];

	function Layout() {

		return {
			'fid': 'productionplanning.engineering.ppsEngineeringCadValidationConfigLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'ruleid', 'messagelevel'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				ruleid: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CadImportValidationRule',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'pps-cad-import-validation-rule-combobox',
							displayMember: 'Description'
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'pps-cad-import-validation-rule-combobox',
							descriptionMember: 'Description'
						}
					}
				},
				messagelevel: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CadImportMessageLevel',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService',
							version: 3
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'pps-cad-import-message-level-combobox',
							displayMember: 'Description'
						},
						width: 90
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'pps-cad-import-message-level-combobox',
							descriptionMember: 'Description'
						}
					}
				}
			}
		};
	}

})(angular);