/**
 * Created by anl on 2/2/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityWizardService', ActivityWizardService);

	ActivityWizardService.$inject = ['platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService',
		'productionplanningActivityActivityDataService',
		'$injector',
		'productionplanningActivityContainerInformationService',
		'platformModuleStateService',
		'productionpalnningActivitySynchronizeWizardService'];

	function ActivityWizardService(platformSidebarWizardConfigService,
								   platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService,
								   activityDataService,
								   $injector,
								   activityContainerInformationService,
								   platformModuleStateService,
								   activitySynchronizeWizardService) {

		function reloadAndSelect(dataService, item) {
			dataService.gridRefresh();
			dataService.load().then(function () {
				dataService.setSelected(item);
			});
		}

		var service = {};
		var wizardID = 'productionplanningActivitySidebarWizards';

		var reportGUID = '1435d4d81ed6429bb7cdcfb80ff39f2b';
		var actResReservation = 'ff65929c43634e1791dba161302d98c6';
		var trsResReservation = 'd227d73d05a6406bad800e8c0dee7b46';

		var changeActivityStatus = function changeProductStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 11,
					mainService: activityDataService,
					refreshMainService: false,
					statusField: 'ActStatusFk',
					statusName: 'mntactivity',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'productionplanning.activity.wizard.changeActivityStatus',
					updateUrl: 'productionplanning/activity/wizard/changeactivitystatus',
					supportMultiChange: true
				}
			);
		};
		service.changeActivityStatus = changeActivityStatus().fn;

		var changeReportStatus = function changeReportStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 12,
					mainService: activityDataService,
					refreshMainService: false,
					statusField: 'RepStatusFk',
					statusName: 'mntreport',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'productionplanning.report.wizard.changeReportStatus',
					updateUrl: 'productionplanning/report/wizard/changereportstatus',
					getDataService: function () {
						var dynamicReportService = activityContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;
						return {
							getSelected: function () {
								return dynamicReportService ? dynamicReportService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return dynamicReportService ? dynamicReportService.getSelectedEntities() : null;
							},
							gridRefresh: function (item) {
								reloadAndSelect(dynamicReportService, item);
							},
							processData: function(entities) {
								processDataByService(entities, dynamicReportService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		};
		service.changeReportStatus = changeReportStatus().fn;

		function changeTrsRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 14,
					mainService: activityDataService,
					dataService: $injector.get('productionplanningActivityTrsRequisitionDataService'),
					refreshMainService: false,
					statusField: 'TrsReqStatusFk',
					title: 'transportplanning.requisition.wizard.changeRequisitionStatus',
					statusName: 'trsRequisition',
					updateUrl: 'transportplanning/requisition/wizard/changeRequisitionStatus',
					supportMultiChange: true,
					HookExtensionOperation:$injector.get('transportplanningRequisitionWizardService').HookExtensionOperation
				}
			);
		}

		service.changeTrsRequisitionStatus = changeTrsRequisitionStatus().fn;

		function changeActResRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: activityDataService,
					dataService: $injector.get('productionplanningActivityResRequisitionDataService'),
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					supportMultiChange: true
				}
			);
		}

		service.changeActResRequisitionStatus = changeActResRequisitionStatus().fn;

		function changeTrsResRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: activityDataService,
					dataService: $injector.get('productionplanningActivityTrsRequisitionResRequisitionDataService'),
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					supportMultiChange: true
				}
			);
		}

		service.changeTrsResRequisitionStatus = changeTrsResRequisitionStatus().fn;


		function changeActResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: activityDataService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var dynamicActResReservationService = activityContainerInformationService.getContainerInfoByGuid(actResReservation).dataServiceName;
						return {
							getSelected: function () {
								return dynamicActResReservationService ? dynamicActResReservationService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return dynamicActResReservationService ? dynamicActResReservationService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								dynamicActResReservationService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, dynamicActResReservationService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeActResReservationStatus = changeActResReservationStatus().fn;

		function changeTrsResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: activityDataService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var dynamicTrsResReservationService = activityContainerInformationService.getContainerInfoByGuid(trsResReservation).dataServiceName;
						return {
							getSelected: function () {
								return dynamicTrsResReservationService ? dynamicTrsResReservationService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return dynamicTrsResReservationService ? dynamicTrsResReservationService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								dynamicTrsResReservationService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, dynamicTrsResReservationService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		function changeBoardResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: activityDataService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var boardReservationService = $injector.get('activityReservationService');
						return {
							getSelected: function () {
								return boardReservationService.getSelected();
							},
							getSelectedEntities: function () {
								return boardReservationService.getSelectedEntities();
							},
							gridRefresh: function () {
								boardReservationService.fireStatusChanged();
								boardReservationService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, boardReservationService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeBoardResReservationStatus = changeBoardResReservationStatus().fn;

		service.changeTrsResReservationStatus = changeTrsResReservationStatus().fn;

		function enableMountingActivity() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(activityDataService, 'enableMountingActivityTitle', 'productionplanning.mounting.enableMountingActivityTitle', 'Code',
				'productionplanning.mounting.enableDisableMountingActivityDone', 'productionplanning.mounting.mountingActivityAlreadyEnabled', 'act', 20);
		}

		service.enableMountingActivity = function () {
			var modStorage = platformModuleStateService.state(activityDataService.getModule()).modifications;
			var mainItemId = modStorage.MainItemId;
			enableMountingActivity().fn().then(function () {
				modStorage.MainItemId = mainItemId;//revert the MainItemId
			});
		};

		function disableMountingActivity() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(activityDataService, 'disableMountingActivityTitle', 'productionplanning.mounting.disableMountingActivityTitle', 'Code',
				'productionplanning.mounting.enableDisableMountingActivityDone', 'productionplanning.mounting.mountingActivityAlreadyDisabled', 'act', 21);
		}

		service.disableMountingActivity = function () {
			var modStorage = platformModuleStateService.state(activityDataService.getModule()).modifications;
			var mainItemId = modStorage.MainItemId;
			disableMountingActivity().fn().then(function () {
				modStorage.MainItemId = mainItemId;//revert the MainItemId
			});
		};

		service.synchronizeActivityPlanningInfo = function () {
			var selectedItems = activityDataService.getSelectedEntities();
			if (selectedItems.length > 0) {
				activitySynchronizeWizardService.showActivitySynchronizeWizardDialog(selectedItems);
			} else {
				$injector.get('productionpalnningActivityCreationWizardService').showInfoDialog('noSelectedError');
			}
		};

		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.mounting.wizard.wizardGroup',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					changeActivityStatus(),
					changeReportStatus()
				]
			}]
		};

		function processDataByService(entities, service) {
			var simpleProcessors = _.filter(service.getDataProcessor(), function(proc) {
				return _.isFunction(proc.processItem) && proc.processItem.length === 1;
			});
			_.forEach(simpleProcessors, function(processor) {
				_.forEach(entities, processor.processItem);
			});
		}

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		return service;
	}

})(angular);

