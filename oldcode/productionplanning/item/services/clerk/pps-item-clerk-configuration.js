(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('productionplanningItemClerkLayout', PPSItemClerkLayout);
	PPSItemClerkLayout.$inject = ['$translate', 'basicsLookupdataConfigGenerator'];
	function PPSItemClerkLayout($translate, basicsLookupdataConfigGenerator) {
		var fromItems = [{
			value: '',
			display: ''
		}, {
			value: 'PRJ',
			display: $translate.instant('project.main.sourceProject')
		}, {
			value: 'HEADER',
			display: $translate.instant('productionplanning.common.header.headerTitle')
		}, {
			value: 'ORDHEADER',
			display: $translate.instant('productionplanning.common.ordHeaderFk')
		}, {
			value: 'ENGTASK',
			display: $translate.instant('productionplanning.engineering.entityEngTask')
		}];

		return {
			'fid': 'productionplanning.item.clerkLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'comment', 'from']
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
							lookupDirective: 'cloud-clerk-clerk-dialog-without-teams',
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
					detail:{
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'cloud-clerk-clerk-dialog-without-teams',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'basics-clerk-only-group-filter'
							}
						},
						requiredInErrorHandling: true
					}
				},
				from: {
					grid: {
						editor: 'select',
						editorOptions: {
							items: fromItems,
							valueMember: 'value',
							displayMember: 'display'
						},
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
