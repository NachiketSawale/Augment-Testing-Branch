/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const modelExpiryJobConfigPermissionGuid = 'cc2c8d4010bd4a398623345423024bca';

			const options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{ typeName: 'HighlightingSchemeDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'HighlightingItemDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'DataTreeDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'DataTreeLevelDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'DataTreeNodeDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'DataTree2ModelDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelComparePropertykeyBlackListDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ViewerSettingsDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'PropertyKeyDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'PropertyKeyTagDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'PropertyKeyTagCategoryDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelImportProfileDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelImportPropertyKeyRuleDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelDefaultImportProfileDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelImportPropertyProcessorDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelFilterTreeTemplateDto', moduleSubModule: 'Model.Administration' },
							{ typeName: 'ModelFilterTreeNodeTemplateDto', moduleSubModule: 'Model.Administration' }
						]);
					}],
					loadPermissions: ['platformPermissionService', function (platformPermissionService) {
						return platformPermissionService.loadPermissions([
							'ca493532bf0447788dafcb79a482cc6e', // global model import profiles access
							modelExpiryJobConfigPermissionGuid
						]);
					}],
					loadServiceFunc: ['basicsConfigWizardSidebarService',
						function (basicsConfigWizardSidebarService) {
							const wizardData = [{
								serviceName: 'modelAdministrationPropertyKeyBulkWizardService',
								wizardGuid: 'e57405ac61464d2ca4808e323053f7fd',
								methodName: 'run',
								canActivate: true
							}, {
								serviceName: 'modelProjectExpiryService',
								wizardGuid: '290504feaaf74bf0ab3efcb3b5c34ae3',
								methodName: 'editExpiry',
								canActivate: true
							}];

							basicsConfigWizardSidebarService.registerWizard(wizardData);
						}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]);

})(angular);

