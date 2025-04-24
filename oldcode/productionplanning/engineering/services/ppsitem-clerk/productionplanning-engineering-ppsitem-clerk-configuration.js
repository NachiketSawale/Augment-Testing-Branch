(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).factory('ppsEngineeringItemClerkLayout', ClerkLayout);
	ClerkLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function ClerkLayout(basicsLookupdataConfigGenerator) {
		var clerkRoleConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
			dataServiceName: 'basicsCustomClerkRoleLookupDataService',
			cacheEnable: true
		});

		return {
			'fid': 'productionplanning.engineering.itemClerkLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'comment', 'from']
				}
			],
			'overloads': {
				clerkrolefk: _.merge(clerkRoleConfig, {readonly: true}),
				clerkfk: {
					readonly: true,
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
				},
				validfrom: {
					readonly: true
				},
				validto: {
					readonly: true
				},
				comment: {
					readonly: true
				},
				from: { readonly: true }
			}
		};
	}
})(angular);
