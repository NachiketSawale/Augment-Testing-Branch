(function () {
	'use strict';

	var moduleName = 'basics.workflow';
	var editors = [];
	var clientActions = [];

	function registerModule(basicsReportingSidebarService) {
		basicsReportingSidebarService.registerModule(moduleName);
	}

	angular.module('basics.workflow').constant('basicsWorkflowModuleOptions', {
		'moduleName': moduleName,
		'actionEditors': editors,
		'clientActions': clientActions,
		'resolve': {
			'loadDomains': ['platformSchemaService', function (platformSchemaService) {
				return platformSchemaService.getSchemas([
					{
						typeName: 'ApproverConfigDto',
						moduleSubModule: 'Basics.Workflow'
					},
					{
						typeName: 'ApproverDto',
						moduleSubModule: 'Basics.Workflow'
					},
					{typeName: 'OrdHeaderDto', moduleSubModule: 'Sales.Contract'},
					{typeName: 'DispatchRecordDto', moduleSubModule: 'Logistic.Dispatching'},
					{typeName: 'DispatchHeaderDto', moduleSubModule: 'Logistic.Dispatching'}]);
			}],
			'loadEntityDescriptions': ['basicWorkflowEntityDescriptionService', 'platformModuleStateService',
				function (basicWorkflowEntityDescriptionService, platformModuleStateService) {
					var state = platformModuleStateService.state('basics.workflow');
					return basicWorkflowEntityDescriptionService.getEntityDescriptions().then(function (response) {
						state.entityDescriptions = response;
					});
				}],
			'loadMasterData': ['_', 'basicsWorkflowMasterDataService', 'platformModuleStateService', '$q', 'basicsWorkflowGlobalContextUtil','basicsWorkflowEventService',
				function (_, basicsWorkflowMasterDataService, platformModuleStateService, $q, basicsWorkflowGlobalContextUtil, basicsWorkflowEventService) {
					var promiseList = [];
					var state = platformModuleStateService.state('basics.workflow');

					promiseList.push(basicsWorkflowMasterDataService.getActions().then(function (response) {
						state.actions = response.data;
					}));
					promiseList.push(basicsWorkflowMasterDataService.getPriority(state));
					promiseList.push(basicsWorkflowMasterDataService.getDefaultPriority());
					promiseList.push(basicsWorkflowMasterDataService.getEntities());
					promiseList.push(basicsWorkflowMasterDataService.getDataEntities());
					promiseList.push(basicsWorkflowMasterDataService.getCreateEntities());
					promiseList.push(basicsWorkflowMasterDataService.getKind());
					promiseList.push(basicsWorkflowMasterDataService.getType());
					promiseList.push(basicsWorkflowMasterDataService.getModule().then(function (response) {
						basicsWorkflowMasterDataService.getAllWizards(response.map(function (item) {
							return item.Id;
						}));
					}));
					promiseList.push(basicsWorkflowMasterDataService.getEntityStatus());
					promiseList.push(basicsWorkflowMasterDataService.getGlobalScriptFiles());
					promiseList.push(basicsWorkflowGlobalContextUtil.loadActions());
					promiseList.push(basicsWorkflowGlobalContextUtil.loadTextModules());
					promiseList.push(basicsWorkflowEventService.getEvents());
					return $q.all(promiseList);
				}],
			'registerModule': ['basicsReportingSidebarService', registerModule],
			'registerActionEditors': ['basicsWorkflowActionEditorService', function (basicsWorkflowActionEditorService) {
				for (var i = 0; i < editors.length; i++) {
					basicsWorkflowActionEditorService.registerEditor(editors[i]);
				}
			}]
		}
	});

})();
