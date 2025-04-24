(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'basics.site';
	angular.module(moduleName).factory('basSiteClerkLayout', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'basics.site.site2clerk.Layout',
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

	var moduleName = 'basics.site';
	angular.module(moduleName).service('basSiteClerkUIService', [
		'platformUIConfigInitService', 'basSiteClerkLayout',
		'basicsSiteTranslationService',
		function (platformUIConfigInitService, basSiteClerkLayout,
		          translationService) {
			platformUIConfigInitService.createUIConfigurationService({
				dtoSchemeId: {typeName: 'Site2ClerkDto', moduleSubModule: 'Basics.Site'},
				layout: basSiteClerkLayout,
				translator: translationService,
				service: this
			});
		}
	]);
})();