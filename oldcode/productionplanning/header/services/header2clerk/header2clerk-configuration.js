/**
 * Created by zwz on 10/10/2019.
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

	// header2Clerk Layout
	angular.module(moduleName).value('productionplanningHeader2ClerkLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningHeader2ClerkLayout', Layout);
	Layout.$inject = ['$translate', 'basicsLookupdataConfigGenerator'];
	function Layout($translate, basicsLookupdataConfigGenerator) {

		var fromItems = [{
			value: '',
			display: ''
		}, {
			value: 'PRJ',
			display: $translate.instant('project.main.sourceProject')
		},  {
			value: 'OrdHeader',
			display: $translate.instant('productionplanning.common.ordHeaderFk')
		}];

		return {
			'fid': 'productionplanning.header.header2ClerkLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'commenttext', 'from']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					cacheEnable: true
				}),
				clerkfk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							lookupOptions: {
								displayMember: 'Code',
								addGridColumns: [{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									width: 200,
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								additionalColumns: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Clerk',
							displayMember: 'Code',
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description'
						}
					}
				},
				from: {
					readonly: true,
					grid: {
						formatter: 'select',
						formatterOptions: {
							items: fromItems,
							valueMember: 'value',
							displayMember: 'display'
						}
					}
				}
			}
		};

	}

})(angular);
