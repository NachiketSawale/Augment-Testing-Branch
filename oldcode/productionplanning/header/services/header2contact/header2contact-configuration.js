/**
 * Created by zwz on 9/29/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';

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

	//header2Contact Layout
	angular.module(moduleName).value('productionplanningHeader2ContactLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningHeader2ContactLayout', PPSProductdescParamLayout);
	PPSProductdescParamLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function PPSProductdescParamLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.header.header2contactLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['contactfk', 'contactroletypefk', 'telephonenumberstring', 'telephonenumber2string', 'telephonenumbermobilestring', 'email' , 'islive', 'remark']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				contactfk: {
					detail: {
						type: 'directive',
						directive: 'business-partner-main-filtered-contact-combobox',
						options: {
							initValueField: 'FamilyName',
							filterKey: 'project-main-bizpartner-contact-filter',
							showClearButton: true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-filtered-contact-combobox',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'project-main-bizpartner-contact-filter'
							}
						},
						width: 125,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'contact',
							displayMember: 'FamilyName'
						},
						contactroletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype'),
					}
				},
				contactroletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.projectcontractroletype'),

				telephonenumberstring: {readonly: true},
				telephonenumber2string: {readonly: true},
				telephonenumbermobilestring: {readonly: true},
				email: {readonly: true},

			}
		};

	}

})(angular);
