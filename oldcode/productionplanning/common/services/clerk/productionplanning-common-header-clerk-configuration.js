(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('productionplanningCommonHeaderClerkLayout', ClerkLayout);
	ClerkLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function ClerkLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.common.headerClerkLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'commenttext']
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
					}
				}
			}
		};
	}
})(angular);
