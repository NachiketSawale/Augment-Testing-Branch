/**
 * Created by welss on 2015-11-11
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';
	/**
	 * @ngdoc factory
	 * @name controlling.structure.services:controllingStructureSidebarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all controlling structure wizards
	 */
	angular.module(moduleName).factory('controllingStructureSidebarWizardService',
		['globals', 'platformModalService', '$translate', '$injector', 'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService', 'projectMainForCOStructureService', 'controllingStructureMainService',
			function (globals, platformModalService, $translate, $injector, platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService, projectMainForCOStructureService, controllingStructureMainService) {

				var service = {};

				// wizard functions
				var changeControllingUnitStatus = function changeControllingUnitStatus() {
					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							projectField: 'ProjectFk',
							statusName: 'ControllingUnit',
							mainService: projectMainForCOStructureService,
							dataService: controllingStructureMainService,
							statusField: 'ControllingunitstatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'controlling.structure.wizardChangeControllingUnitStatus',
							updateUrl: 'controlling/structure/changestatus'
						}
					);
				};
				service.changeControllingUnitStatus = changeControllingUnitStatus().fn;

				service.createActivities = function createActivities() {
					$injector.get('controllingStructureCreateActivitiesWizardService').createActivities();
				};

				service.generateControllingUnits = function generateControllingUnits() {
					var selectedProject = projectMainForCOStructureService.getSelected(),
						title = 'controlling.structure.generateControllingUnits',
						msg = $translate.instant('controlling.structure.noCurrentProjectSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedProject, title, msg)) {

						platformModalService.showDialog({
							headerTextKey: 'controlling.structure.generateControllingUnits',
							templateUrl: globals.appBaseUrl + 'controlling.structure/templates/generate-dialog.html',
							controller: 'controllingStructureGenerateWizardController',
							resizeable: true
						});
					}
				};

				service.updateEstimate = function updateEstimate() {
					$injector.get('controllingStructureUpdateEstimateWizardService').updateEstimate();
				};

				service.changeCompany = function changeCompany() {
					$injector.get('controllingStructureChangeCompanyWizardService').showChangeCompanyWizard();
				};

				service.controllingDataTrans = function controllingDataTrans() {

					let option = {
						project: projectMainForCOStructureService.getSelected(),
						controllingVersionDataService: $injector.get('controllingVersionsListDataService')
					};

					$injector.get('controllingStructureTransferDataToBisDataService').showTransferToBisWizard(option);
				};

				service.generateControllingUnitsFromTemplate = function generateControllingUnitsFromTemplate() {
					$injector.get('controllingStructureGenerateControllingUnitsFromTemplateWizardService').generateControllingUnitsFromTemplateWizard();
				};

				service.createControllingUnitTemplate = function createControllingUnitTemplate() {
					$injector.get('controllingStructureCreateControllingunittemplateWizardService').createControllingUnitTemplateWizard();
				};

				service.createControllingExportSchedulerTask = function createControllingExportSchedulerTask() {
					$injector.get('controllingStructureTransferSchedulerTaskService').showDialog();
				};

				return service;
			}
		]);
})();
