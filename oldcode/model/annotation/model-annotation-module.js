/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName, [
		'defect.main',
		'model.project',
		'model.evaluation',
		'model.main'
	]);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			const wizardData = [{
				serviceName: 'modelAnnotationBcfExportWizardService',
				wizardGuid: 'b988e017af494a6cbaeff019c9bf65df',
				methodName: 'runExport',
				canActivate: true
			}, {
				serviceName: 'modelAnnotationBcfImportWizardService',
				wizardGuid: 'e534459bdded4013b5ad29920bd16d33',
				methodName: 'showDialog',
				canActivate: true
			}, {
				serviceName: 'modelAnnotationStatusWizardService',
				wizardGuid: '0b774ff87d5d4f58985fef4b545eca2c',
				methodName: 'showDialog',
				canActivate: true
			}, {
				serviceName: 'modelAnnotationSendMessageWizardService',
				wizardGuid: 'a460692cb924402b91289e94835db0b4',
				methodName: 'showDialog',
				canActivate: true
			}];

			const options = {
				moduleName: moduleName,
				resolve: {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {
						return platformSchemaService.getSchemas([
							{typeName: 'ModelAnnotationDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationReferenceDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationObjectLinkDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationCameraDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationClipDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationDocumentDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ModelAnnotationMarkerDto', moduleSubModule: 'Model.Annotation'},
							{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
							{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
							{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'}
						]);
					}],
					loadServiceFunc: ['basicsConfigWizardSidebarService', function (basicsConfigWizardSidebarService) {
						basicsConfigWizardSidebarService.registerWizard(wizardData);
					}],
					loadTranslation: ['platformTranslateService', function (platformTranslateService) {
						return platformTranslateService.registerModule([moduleName], true);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, naviService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: moduleName,
					navFunc: function (item, triggerField) {
						$injector.get('modelAnnotationDataService').selectAfterNavigation(item, triggerField);
					}
				}
			);
		}]);

})(angular);
