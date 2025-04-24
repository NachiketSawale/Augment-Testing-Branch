/*
 * $Id: documents-centralquery-module.js 633880 2021-04-26 03:07:00Z pel $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global ,globals */
	var moduleName = 'documents.centralquery';

	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function(platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'DocumentDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentRevisionDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'DocumentHistoryDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'},
							{typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
							{typeName: 'Document2mdlObjectDto', moduleSubModule: 'Documents.Project'},
							{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main'}
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService','basicsLookupdataLookupDescriptorService', function (basicsLookupdataLookupDefinitionService,basicsLookupdataLookupDescriptorService) {
						basicsLookupdataLookupDescriptorService.loadData('projectdocumenttypelookup');
						return basicsLookupdataLookupDefinitionService.load([
							'documentsProjectHasDocumentRevisionCombobox']);
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', '_', 'platformSidebarWizardDefinitions', '$injector',
						function (wizardService, _, platformSidebarWizardDefinitions) {

							// function wizardIsActivate(){
							// var queryCentralService=$injector.get('centralQueryClerkService');
							// return queryCentralService.wizardIsActivate();
							// }

							var wizardData = _.concat([
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '1951cfa8f4e4425aa5a2c1e4d93b2089',
									methodName: 'changeStatusForProjectDocument',
									canActivate: true
								},
								{
									serviceName: 'modelViewerSelectionWizardService',
									wizardGuid: '550bbf52325741c5901cbed2ba126934',
									methodName: 'showDialog',
									canActivate: true
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '1db192a34c234076a849a955ed787e51',
									methodName: 'syncBim360Document2itwo40',
									canActivate: true
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: 'c6d1233e576e45f4bfa81e582152858c',
									methodName: 'syncItwo40Document2bim360',
									canActivate: true
								},
								{
									serviceName: 'documentsCentralQueryWizardService',
									wizardGuid: '09e2088390c740e1ab8da6c98cf61fcc',
									methodName: 'changeRubricCategory',
									canActivate: true,
									userParam: {
										'moduleName': moduleName
									}
								}

							],
							platformSidebarWizardDefinitions.model.sets.default);
							wizardService.registerWizard(wizardData);
						}],
					'loadPermissions': ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'f86aa473785b4625adcabc18dfde57ac',
							'9eaa7843becc49f1af5b4b11e8fa09ee'
						]);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);
