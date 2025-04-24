/**
 * Created by zov on 22/04/2019.
 */
(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).factory('productionplanningDrawingWizardService', [
		'basicsCommonChangeStatusService',
		'productionplanningDrawingMainService',
		'platformSidebarWizardConfigService',
		'platformModalService',
		'platformSidebarWizardCommonTasksService',
		'productionplanningDrawingComponentDataService',
		'productionplanningDrawingContainerInformationService',
		'platformDataValidationService',
		'productionplanningDrawingStatusLookupService',
		'$translate',
		function (basicsCommonChangeStatusService,
				  mainService,
				  platformSidebarWizardConfigService,
				  platformModalService,
				  platformSidebarWizardCommonTasksService,
				  drawingComponentDataServiceFactory,
				  containerInformationService,
				  platformDataValidationService,
				  drawingStatusLookupService,
				  $translate) {
			var service = {};
			var wizardID = 'productionplanningDrawingSidebarWizards';
			var wizardConfig = {
				showImages: true,
				showTitles: true,
				showSelected: true,
				cssClass: 'sidebarWizard'
			};

			service.activate = function activate() {
				platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
			};

			service.deactivate = function deactivate() {
				platformSidebarWizardConfigService.deactivateConfig(wizardID);
			};

			function changeDrawingStatus() {
				return basicsCommonChangeStatusService.provideStatusChangeInstance({
					mainService: mainService,
					refreshMainService: false,
					statusField: 'EngDrawingStatusFk',
					title: 'productionplanning.drawing.wizard.changeDrawingStatusTitle',
					statusName: 'ppsdrawing',
					id: 1
				});
			}

			service.changeDrawingStatus = changeDrawingStatus().fn;

			service.importPartList = function () {
				mainService.updateAndExecute(function () {
					if (platformDataValidationService.hasErrors(mainService)) {
						return;//stop when still has errors
					}
					if (mainService.getSelected()) {
						var status = _.find(drawingStatusLookupService.getList(), {Id: mainService.getSelected().EngDrawingStatusFk});
						if (status && status.IsImportLock) {
							platformModalService.showDialog({
								headerTextKey: 'productionplanning.drawing.wizard.importPartList',
								bodyTextKey: '"' + status.DescriptionInfo.Translated + '"' + $translate.instant('productionplanning.drawing.wizard.errorStatus'),
								iconClass: 'ico-error'
							});
							return;
						}
					}
					platformModalService.showDialog({
						headerTextKey: 'productionplanning.drawing.wizard.importPartList',
						templateUrl: globals.appBaseUrl + moduleName + '/templates/productionplanning-drawing-import-part-list-dialog.html',
						backdrop: false,
						resizeable: true
					});
				});
			};

			service.enableDrawing = platformSidebarWizardCommonTasksService.provideEnableInstance(mainService, 'Enable Drawing',
				'productionplanning.drawing.wizard.enableDrawingCaption', 'Code',
				'productionplanning.drawing.wizard.enableDisableDrawingDone', 'productionplanning.drawing.wizard.drawingAlreadyEnabled',
				'drawing', 2).fn;

			service.disableDrawing = platformSidebarWizardCommonTasksService.provideDisableInstance(mainService, 'Disable Drawing',
				'productionplanning.drawing.wizard.disableDrawingCaption', 'Code',
				'productionplanning.drawing.wizard.enableDisableDrawingDone', 'productionplanning.drawing.wizard.drawingAlreadyDisabled',
				'drawing', 3).fn;

			var drawingComponentDataService = drawingComponentDataServiceFactory.getService(
				{
					serviceKey: 'productionplanning.drawing.component',
					parentService: 'productionplanningDrawingMainService'
				}
			);
			service.changeComponentStatus = basicsCommonChangeStatusService.provideStatusChangeInstance({
				mainService: mainService,
				refreshMainService: false,
				statusField: 'EngDrwCompStatusFk',
				title: 'productionplanning.drawing.drawingComponent.wizard.changeComponentStatusTitle',
				statusName: 'ppsdrawingcomponent',
				id: 4,
				getDataService: function () {
					return {
						getSelected: function () {
							return drawingComponentDataService.getSelected();
						},
						getSelectedEntities: function () {
							return drawingComponentDataService.getSelectedEntities();
						},
						gridRefresh: function () {
							drawingComponentDataService.gridRefresh();
						},
						processData: function (entities) {
							var simpleProcessors = _.filter(drawingComponentDataService.getDataProcessor(), function (proc) {
								return _.isFunction(proc.processItem) && proc.processItem.length === 1;
							});
							_.forEach(simpleProcessors, function (processor) {
								_.forEach(entities, processor.processItem);
							});
						}
					};
				}
			}).fn;

			service.enableComponent = platformSidebarWizardCommonTasksService.provideEnableInstance(drawingComponentDataService, 'Enable Component',
				'productionplanning.drawing.drawingComponent.wizard.enableComponentCaption', 'Description',
				'productionplanning.drawing.drawingComponent.wizard.enableDisableComponentDone', 'productionplanning.drawing.drawingComponent.wizard.componentAlreadyEnabled',
				'component', 5).fn;

			service.disableComponent = platformSidebarWizardCommonTasksService.provideDisableInstance(drawingComponentDataService, 'Disable Component',
				'productionplanning.drawing.drawingComponent.wizard.disableComponentCaption', 'Description',
				'productionplanning.drawing.drawingComponent.wizard.enableDisableComponentDone', 'productionplanning.drawing.drawingComponent.wizard.componentAlreadyDisabled',
				'component', 6).fn;

			var productTemplateDS = containerInformationService.getProductDescService();

			service.enableProductTemplate = platformSidebarWizardCommonTasksService.provideEnableInstance(productTemplateDS, 'Enable Product Template',
				'productionplanning.producttemplate.wizard.enableProductDesc',
				'Code',
				'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
				'productionplanning.producttemplate.wizard.productDescAlreadyEnabled',
				'code', 1).fn;

			service.disableProductTemplate = platformSidebarWizardCommonTasksService.provideDisableInstance(productTemplateDS, 'Disable Product Template',
				'productionplanning.producttemplate.wizard.disableProductDesc',
				'Code',
				'productionplanning.producttemplate.wizard.enableDisableProductDescDone',
				'productionplanning.producttemplate.wizard.productDescAlreadyDisabled',
				'code', 2).fn;

			return service;
		}
	]);
})();