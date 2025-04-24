/**
 * Created by lja on 2016-2-1.
 */

// <reference path='../help/10_angular/angular.js' />
(function (angular) {
	'use strict';

	/*
	 ** procurement.requisition module is created.
	 */
	/* global ,globals */
	var moduleName = 'documents.project';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {
				var options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {
							return platformSchemaService.getSchemas([
								{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}
							]);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService','basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDefinitionService,basicsLookupdataLookupDescriptorService) {
							basicsLookupdataLookupDescriptorService.loadData('projectdocumenttypelookup');
							return basicsLookupdataLookupDefinitionService.load([
								'documentsProjectHasDocumentRevisionCombobox']);
						}],
						'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
							return platformPermissionService.loadPermissions([
								'4EAA47C530984B87853C6F2E4E4FC67E',
								'684F4CDC782B495E9E4BE8E4A303D693'
							]);
						}],
						registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
							(platformPermissionService, permissionObjectType) => {
								return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
							}],
					}
				};

				platformLayoutService.registerModule(options);
			}
		]
		).run(['basicsWorkflowEventService',
			function (basicsWorkflowEventService) {

				basicsWorkflowEventService.registerEvent('33886D6F8DCC4EB5AC0257EAEBA43F6B', 'Upload Project Document');

			}]);

})(angular);