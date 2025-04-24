(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('trsRouteClerkLayout', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'transportplanning.transport.clerk.Layout',
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
					from: { readonly: true }
				}
			};
		}
	]);
})();



(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).service('trsRouteClerkUIService', [
		'platformUIConfigInitService', 'trsRouteClerkLayout',
		'transportplanningTransportTranslationService',
		function (platformUIConfigInitService, trsRouteClerkLayout,
		          translationService) {
			platformUIConfigInitService.createUIConfigurationService({
				dtoSchemeId: {typeName: 'Route2ClerkDto', moduleSubModule: 'TransportPlanning.Transport'},
				layout: trsRouteClerkLayout,
				translator: translationService,
				service: this
			});
		}
	]);
})();