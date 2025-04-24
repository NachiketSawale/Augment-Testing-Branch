/*
 * $Id: hsqe-CheckList-module.js 627131 2021-03-11 06:54:53Z yew $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'hsqe.checklist';

	angular.module(moduleName, ['ui.router', 'platform', 'basics.userform', 'model.main', 'model.annotation']);
	globals.modules.push(moduleName);

	/*
	 ** Module definition.
	 */
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {

			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadModuleConfigurations: ['platformModuleEntityCreationConfigurationService', function (platformModuleEntityCreationConfigurationService) {
						return platformModuleEntityCreationConfigurationService.load(moduleName);
					}],
					'loadDomains': ['platformSchemaService', 'platformTranslateService',
						function (platformSchemaService, platformTranslateService) {
							platformSchemaService.initialize();
							platformTranslateService.registerModule([
								moduleName
							]);
							return platformSchemaService.getSchemas([
								{typeName: 'HsqCheckListDto', moduleSubModule: 'Hsqe.CheckList'},
								{typeName: 'HsqCheckList2FormDto', moduleSubModule: 'Hsqe.CheckList'},
								{typeName: 'HsqCheckList2LocationDto', moduleSubModule: 'Hsqe.CheckList'},
								{typeName: 'HsqCheckList2ActivityDto', moduleSubModule: 'Hsqe.CheckList'},
								{typeName: 'HsqCheckList2MdlObectDto', moduleSubModule: 'Hsqe.CheckList'},
								{typeName: 'HsqCheckListDocumentDto', moduleSubModule: 'Hsqe.CheckList'},
								{typeName: 'CheckListGroupTemplateDto', moduleSubModule: 'Hsqe.CheckListTemplate'},
								{typeName: 'ObjectAttributeDto', moduleSubModule: 'Model.Main'},
								{typeName: 'ViewerLegendItemDto', moduleSubModule: 'Model.Main'},
								{typeName: 'ModelRulesetDto', moduleSubModule: 'Model.Evaluation'},
								{typeName: 'ModelRulesetGroupDto', moduleSubModule: 'Model.Evaluation'},
								{typeName: 'ModelRuleDto', moduleSubModule: 'Model.Evaluation'},
								{typeName: 'PrcDataViewDto', moduleSubModule: 'Procurement.Common'},
								{typeName: 'HsqChkListTemplateDto', moduleSubModule: 'Hsqe.CheckListTemplate'},
								{typeName: 'HsqCheckListGroupDto', moduleSubModule: 'Hsqe.CheckListTemplate'},
								{typeName: 'ModelAnnotationObjectLinkDto', moduleSubModule: 'Model.Annotation'},
								{typeName: 'MtgHeaderDto', moduleSubModule: 'Basics.Meeting' },
								{typeName: 'ModelAnnotationObjectLinkDto', moduleSubModule: 'Model.Annotation' },
								{typeName: 'SubsidiaryDto', moduleSubModule: 'BusinessPartner.Main' },
								{typeName: 'ContactDto', moduleSubModule: 'BusinessPartner.Contact' },
								{typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'}
							]);
						}],
					registerPermissionParentObjectTypes: ['platformPermissionService', 'permissionObjectType',
						(platformPermissionService, permissionObjectType) => {
							return platformPermissionService.registerParentObjectTypes(moduleName, [permissionObjectType.project]);
						}],
					loadLookup: ['basicsLookupdataLookupDefinitionService', 'platformSchemaService', function (basicsLookupdataLookupDefinitionService, platformSchemaService) {
						platformSchemaService.getSchemas([
							{typeName: 'ObjectSetDto', moduleSubModule: 'Model.Main'}
						]).then(function () {
							basicsLookupdataLookupDefinitionService.load(['defectMainObjectSetLookup', 'defectQuestionStatusCombobox']);
						});
					}],
					'registerWizards': ['basicsConfigWizardSidebarService', 'platformSidebarWizardDefinitions', function (wizardService, platformSidebarWizardDefinitions) {

						var wizardData = _.concat([{
							serviceName: 'checkListWizardService',
							wizardGuid: '2ad89ac71bd24bbbbcea0b13d693023c',
							methodName: 'createCheckListFromTemplate',
							canActivate: true
						}, {
							serviceName: 'checkListWizardService',
							wizardGuid: '3e8459f0dc9a4f13a5b1b29c7a85df90',
							methodName: 'createDefectFromCheckList',
							canActivate: true
						}, {
							serviceName: 'checkListWizardService',
							wizardGuid: '030b5bd293b844e5b4800d54b86af643',
							methodName: 'changeStatus',
							canActivate: true
						},{
							serviceName: 'checkListFormWizardService',
							wizardGuid: '1687AA0E8C904EE5A1DAAC8D3AD90FE4',
							methodName: 'createCheckListForm',
							canActivate: true
						}
						], platformSidebarWizardDefinitions.model.sets.default);

						wizardService.registerWizard(wizardData);
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', 'basicsWorkflowEventService',
		function ($injector, naviService, basicsWorkflowEventService) {
			naviService.registerNavigationEndpoint(
				{
					moduleName: 'hsqe.checklist',
					navFunc: function (item, triggerField) {
						$injector.get('hsqeCheckListDataService').navigateTo(item, triggerField);
					}
				}
			);
			basicsWorkflowEventService.registerEvent('afd20e64c22a43e2a518be7fda25eafe', 'New CheckList Created');
			basicsWorkflowEventService.registerEvent('89229bf88fd64a88be453bedbdf258e0', 'Upload CheckList Document');
		}]);

})(angular);
