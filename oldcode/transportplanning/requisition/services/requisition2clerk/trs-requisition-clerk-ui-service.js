(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).factory('trsRequisitionClerkLayout', [
		'basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			return {
				'fid': 'transportplanning.requisition.clerk.Layout',
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

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsRequisitionClerkUIService', [
		'platformUIConfigInitService', 'trsRequisitionClerkLayout',
		'transportplanningRequisitionTranslationService',
		function (platformUIConfigInitService, trsRequisitionClerkLayout,
		          transportplanningRequisitionTranslationService) {
			platformUIConfigInitService.createUIConfigurationService({
				dtoSchemeId: {typeName: 'Requisition2ClerkDto', moduleSubModule: 'TransportPlanning.Requisition'},
				layout: trsRequisitionClerkLayout,
				translator: transportplanningRequisitionTranslationService,
				service: this
			});
		}
	]);
})();