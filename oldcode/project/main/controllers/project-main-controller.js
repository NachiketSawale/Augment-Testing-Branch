/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).controller('projectMainController',
		['$scope', 'platformMainControllerService', 'projectMainService',
			'projectMainTranslationService', 'projectMainSidebarWizardService',
			'cloudDesktopSidebarService', 'projectMainNumberGenerationSettingsService',
			'projectMaterialPriceConditionServiceNew', 'projectMainDocumentsProjectService',
			'$injector', 'basicsWorkflowSidebarRegisterService', '_', 'estimateProjectRateBookConfigDataService',
			'projectCalendarCalendarDataService', 'projectMainActionCostGroupService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformMainControllerService, projectMainService,
			          projectMainTranslationService, projectMainSidebarWizardService,
			          cloudDesktopSidebarService, projectMainNumberGenerationSettingsService,
			          projectMaterialPriceConditionService, projectMainDocumentsProjectService,
			          $injector, basicsWorkflowSidebarRegisterService, _, estimateProjectRateBookConfigDataService,
			          projectCalendarCalendarDataService, projectMainActionCostGroupService) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: true, auditTrail: '0ed890f9f5e44b82a156e59212e579c2'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, projectMainService, mc, projectMainTranslationService, moduleName, opt);


				// region add export capability

				var exportOptions = {
					ModuleName: moduleName,
					permission: '4c869d7b2ee44830991ffd57cf3db23c#e',
					MainContainer: {
						Id: '1',
						Label: 'project.main.projectListTitle'
					},
					SubContainers: [
						//{
						//	Id: 'businesspartner.main.contactgrid',      // must match an entry in the module-containers.json!
						//	Qualifier: 'contact',                        // unique identifier for subcontainers (used on server side!)
						//	Label: 'businesspartner.main.contactGridContainerTitle', // listbox item text
						//	Selected: false                              // pre-select container in the listbox
						//},
						{
							Id: 'project.main.characteristic.container',
							Qualifier: 'characteristic',
							Label: 'project.main.characteristics',
							Selected: false
						}
					]
				};

				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				// ---

				//sidebar | information
				var info = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'project.main/templates/sidebar-info.html'
				};

				cloudDesktopSidebarService.registerSidebarContainer(info, true);

				projectMainSidebarWizardService.activate();

				projectMainDocumentsProjectService.register();


				var moduleContext = $injector.get('procurementContextService');
				//set module context variables
				moduleContext.setLeadingService(projectMainService);
				moduleContext.setMainService(projectMainService);

				// To Register Required EntityFacade For Project Module
				basicsWorkflowSidebarRegisterService.registerEntityForModule('1FC97A914F544F50A7901056F2E45758', 'project.main', false,
					function getSelectedModelId() {
						var modelProjectModelVersionDataService = $injector.get('modelProjectModelDataService');
						var selModel = modelProjectModelVersionDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						var modelProjectModelDataService = $injector.get('modelProjectModelDataService');
						var items = modelProjectModelDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('A823312C8CA14F4F9B6FC706FD719AF8', 'project.main', false,
					function getSelectedModelId() {
						var projectDataService = $injector.get('projectMainService');
						var selModel = projectDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						var projectDataService = $injector.get('projectMainService');
						var items = projectDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('a459af22905b41a29b8d544cc66d373c', 'project.main', false,
					function getSelectedModelId() {
						var projectGeneralDataService = $injector.get('projectMainGeneralService');
						var selModel = projectGeneralDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						var projectGeneralDataService = $injector.get('projectMainGeneralService');
						var items = projectGeneralDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('a5599f51df104273b8bd2be0f5dadce5', 'project.main', false,
					function getSelectedModelId() {
						var projectClerkDataService = $injector.get('projectClerkService');
						var selModel = projectClerkDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						var projectClerkDataService = $injector.get('projectClerkService');
						var items = projectClerkDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('a029462b8e9342dfb1030f8884ed080b', 'project.main', false,
					function getSelectedModelId() {
						var project2BusinessDataService = $injector.get('projectPrj2BPService');
						var selModel = project2BusinessDataService.getSelected();
						if (selModel) {
							return selModel.Id;
						}
						return undefined;
					}, function getModelIdList() {
						var project2BusinessDataService = $injector.get('projectPrj2BPService');
						var items = project2BusinessDataService.getList();
						return _.map(_.isArray(items) ? items : [], function (modelEntity) {
							return modelEntity.Id;
						});
					}, angular.noop, angular.noop, angular.noop, true);

				basicsWorkflowSidebarRegisterService.registerEntityForModule('32017FB8755D43DEBA51F74A35B6F9D6', 'project.main', false, function getSelectedEstimateId() {
					let estimateProjectService = $injector.get('estimateProjectService');
					let selEstimateProject = estimateProjectService.getSelected();
					let selEstimate = selEstimateProject ? selEstimateProject.EstHeader : null;
					if (selEstimate) {
						return selEstimate.Id;
					}
					return undefined;
				}, function getEstimateIdList() {
					let estimateProjectService = $injector.get('estimateProjectService');
					let items = estimateProjectService.getList();
					return _.map(_.isArray(items) ? items : [], function (estimateProject) {
						let estHeader = estimateProject.EstHeader;
						return estHeader ? estHeader.Id : null;
					});
				}, angular.noop, angular.noop, function getSelectedEstimateIdList() {
					let estimateProjectService = $injector.get('estimateProjectService');
					let items = estimateProjectService.getSelectedEntities();
					return _.map(_.isArray(items) ? items : [], function (estimateProject) {
						let estHeader = estimateProject.EstHeader;
						return estHeader ? estHeader.Id : null;
					});
				}, true);

				projectCalendarCalendarDataService.setReadOnlyAtStart();
				projectMainActionCostGroupService.init();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(projectMainService, sidebarReports, projectMainTranslationService, opt);
					projectMainSidebarWizardService.deactivate();
					cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
					projectMainDocumentsProjectService.unRegister();

					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					estimateProjectRateBookConfigDataService.clearData();
					projectCalendarCalendarDataService.setReadOnly(false);
				});
			}
		]);
})();
