/**
 * Created by anl on 7/20/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).factory('productionplanningMountingWizardService', MountingWizardService);

	MountingWizardService.$inject = ['platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService',
		'projectMainService',
		'productionplanningMountingRequisitionDataService',
		'productionplanningMountingRequisitionForProjectDataService',
		'productionplanningMountingContainerInformationService','documentProjectDocumentsStatusChangeService',
		'$injector'];

	function MountingWizardService(platformSidebarWizardConfigService,
								   platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService,
								   projectMainService,
								   mntRequisitionDataService,
								   mntRequisitionDataServiceForProject,
								   mountingContainerInformationService,documentProjectDocumentsStatusChangeService,
								   $injector) {

		function  reloadAndSelect(dataService, item) {
			dataService.gridRefresh();
			dataService.load().then(function () {
				dataService.setSelected(item);
			});
		}

		var service = {};
		var wizardID = 'productionplanningMountingSidebarWizards';

		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var reportGUID = '518268e717e2413a8107c970919eea85';
		var actResReservation = 'a9e90275f8de429db681448f6caefce3';
		var trsResReservation = 'cce4e1d048ca486da12d36d97ffedca7';

		var changeRequisitionStatus = function changeRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 11,
					mainService: mntRequisitionDataService,
					statusField: 'ReqStatusFk',
					statusName: 'mntrequisition',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'productionplanning.mounting.requisition.wizard.changeRequisitionStatus',
					updateUrl: 'productionplanning/mounting/wizard/changereqstatus',
					supportMultiChange: true,
					HookExtensionOperation: HookExtensionOperation
				}
			);
		};
		service.changeRequisitionStatus = changeRequisitionStatus().fn;

		function HookExtensionOperation (options, dataItems) {
			var schemaOption = {
				typeName: 'RequisitionDto',
				moduleSubModule: 'ProductionPlanning.Mounting'
			};
			var translationSrv = $injector.get('productionplanningMountingTranslationService');
			return $injector.get('ppsCommonLoggingStatusChangeReasonsDialogService').showDialog(options, dataItems, schemaOption, translationSrv);
		}

		var changeActivityStatus = function changeProductStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 13,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'ActStatusFk',
					statusName: 'mntactivity',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'productionplanning.activity.wizard.changeActivityStatus',
					updateUrl: 'productionplanning/activity/wizard/changeactivitystatus',
					getDataService: function () {
						var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;
						return {
							getSelected: function () {
								return dynamicActivityService ? dynamicActivityService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return dynamicActivityService ? dynamicActivityService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								dynamicActivityService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, dynamicActivityService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		};
		service.changeActivityStatus = changeActivityStatus().fn;

		var changeReportStatus = function changeReportStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 14,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'RepStatusFk',
					statusName: 'mntreport',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'productionplanning.report.wizard.changeReportStatus',
					updateUrl: 'productionplanning/report/wizard/changereportstatus',
					getDataService: function () {
						var dynamicReportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;
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

		function changeMntRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: projectMainService,
					dataService: mntRequisitionDataServiceForProject,
					refreshMainService: false,
					statusField: 'ReqStatusFk',
					title: 'productionplanning.mounting.requisition.wizard.changeRequisitionStatus',
					statusName: 'mntrequisition',
					projectField: 'prjprojectfk',
					updateUrl: 'productionplanning/mounting/wizard/changereqstatus',
					id: 15,
					supportMultiChange: true,
					HookExtensionOperation: HookExtensionOperation,
				}
			);
		}

		service.changeMntRequisitionStatus = changeMntRequisitionStatus().fn;

		function changeTrsRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 17,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'TrsReqStatusFk',
					title: 'transportplanning.requisition.wizard.changeRequisitionStatus',
					statusName: 'trsRequisition',
					updateUrl: 'transportplanning/requisition/wizard/changeRequisitionStatus',
					getDataService: function () {
						var trsRequisitionDataService = $injector.get('productionplanningMountingTrsRequisitionDataService');
						return {
							getSelected: function () {
								return trsRequisitionDataService ? trsRequisitionDataService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return trsRequisitionDataService ? trsRequisitionDataService.getSelectedEntities() : null;
							},
							gridRefresh: function (item) {
								reloadAndSelect(trsRequisitionDataService, item);
							},
							processData: function(entities) {
								processDataByService(entities, trsRequisitionDataService);
							},
							getItemById: function (id) {
								return trsRequisitionDataService.getItemById(id);
							}
						};
					},
					supportMultiChange: true,
					HookExtensionOperation:$injector.get('transportplanningRequisitionWizardService').HookExtensionOperation
				}
			);
		}

		service.changeTrsRequisitionStatus = changeTrsRequisitionStatus().fn;

		function enableMountingRequisition() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(mntRequisitionDataService, 'enableMountingRequisitionTitle', 'productionplanning.mounting.enableMountingRequisitionTitle', 'Code',
				'productionplanning.mounting.enableDisableMountingRequisitionDone', 'productionplanning.mounting.mountingRequisitionAlreadyEnabled', 'req', 18);
		}

		service.enableMountingRequisition = enableMountingRequisition().fn;

		function disableMountingRequisition() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(mntRequisitionDataService, 'disableMountingRequisitionTitle', 'productionplanning.mounting.disableMountingRequisitionTitle', 'Code',
				'productionplanning.mounting.enableDisableMountingRequisitionDone', 'productionplanning.mounting.mountingRequisitionAlreadyDisabled', 'req', 19);
		}

		service.disableMountingRequisition = disableMountingRequisition().fn;

		service.AppendMethods = function () {//execute this after activity service is created
			function enableMountingActivity() {
				var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;
				return platformSidebarWizardCommonTasksService.provideEnableInstance(dynamicActivityService, 'enableMountingActivityTitle', 'productionplanning.mounting.enableMountingActivityTitle', 'Code',
					'productionplanning.mounting.enableDisableMountingActivityDone', 'productionplanning.mounting.mountingActivityAlreadyEnabled', 'act', 20);
			}

			service.enableMountingActivity = enableMountingActivity().fn;

			function disableMountingActivity() {
				var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;
				return platformSidebarWizardCommonTasksService.provideDisableInstance(dynamicActivityService, 'disableMountingActivityTitle', 'productionplanning.mounting.disableMountingActivityTitle', 'Code',
					'productionplanning.mounting.enableDisableMountingActivityDone', 'productionplanning.mounting.mountingActivityAlreadyDisabled', 'act', 21);
			}

			service.disableMountingActivity = disableMountingActivity().fn;
		};

		function changeActResRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					getDataService: function () {
						var actResRequisitionDataService = $injector.get('productionplanningMountingResRequisitionDataService');
						return {
							getSelected: function () {
								return actResRequisitionDataService.getSelected();
							},
							getSelectedEntities: function () {
								return actResRequisitionDataService.getSelectedEntities();
							},
							gridRefresh: function () {
								actResRequisitionDataService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, actResRequisitionDataService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeActResRequisitionStatus = changeActResRequisitionStatus().fn;

		function changeTrsResRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					getDataService: function () {
						var trsResRequisitionDataService = $injector.get('productionplanningMountingTrsRequisitionResRequisitionDataService');
						return {
							getSelected: function () {
								return trsResRequisitionDataService.getSelected();
							},
							getSelectedEntities: function () {
								return trsResRequisitionDataService.getSelectedEntities();
							},
							gridRefresh: function () {
								trsResRequisitionDataService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, trsResRequisitionDataService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeTrsResRequisitionStatus = changeTrsResRequisitionStatus().fn;


		function changeActResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var dynamicActResReservationService = mountingContainerInformationService.getContainerInfoByGuid(actResReservation).dataServiceName;
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
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var dynamicTrsResReservationService = mountingContainerInformationService.getContainerInfoByGuid(trsResReservation).dataServiceName;
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

		service.changeTrsResReservationStatus = changeTrsResReservationStatus().fn;

		service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(mntRequisitionDataService, 'productionplanning.mounting').fn;

		function changeBoardResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: mntRequisitionDataService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var boardReservationService = $injector.get('mountingReservationService');
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
					changeRequisitionStatus(),
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

