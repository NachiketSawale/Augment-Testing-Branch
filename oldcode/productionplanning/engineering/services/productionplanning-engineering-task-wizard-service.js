(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('productionplanningEngineeringTaskWizardService', wizardService);

	wizardService.$inject = ['platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService',
		'basicsCommonChangeStatusService',
		'productionplanningEngineeringMainService',
		'productionplanningEngineeringProductDescriptionDataService',
		'basicsLookupdataLookupDescriptorService',
		'$injector',
		'productionplanningCommonDocumentDataServiceFactory',
		'productionplanningCommonDocumentDataServiceRevisionFactory',
		'platformModalService',
		'productionplanningCommonResReservationDataServiceFactory',
		'productionplanningCommonResRequisitionDataServiceFactory',
		'productionplanningItemUpstreamPackagesCreationWizardHandler',
		'platformModuleStateService',
		'platformModuleNavigationService',
		'$http', '$q', '$translate','documentProjectDocumentsStatusChangeService','basicsLookupdataSimpleLookupService'];


	function wizardService(platformSidebarWizardConfigService,
						   platformSidebarWizardCommonTasksService,
						   basicsCommonChangeStatusService,
						   mainService,
						   productDescDataService,
						   basicsLookupdataLookupDescriptorService,
						   $injector,
						   productionplanningCommonDocumentDataServiceFactory,
						   productionplanningCommonDocumentDataServiceRevisionFactory,
						   platformModalService,
						   commonResReservationDataServiceFactory,
						   commonResRequisitionDataServiceFactory,
						   productionplanningItemUpstreamPackagesCreationWizardHandler,
						   platformModuleStateService,
						   navigationService,
						   $http, $q, $translate,documentProjectDocumentsStatusChangeService,basicsLookupdataSimpleLookupService) {

		var service = {};
		var wizardID = 'productionplanningEngineeringSidebarWizards';


		function changeEngineeringTaskStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: mainService,
					statusField: 'EngTaskStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'productionplanning.engineering.wizard.changeTaskStatusTitle',
					statusName: 'engTask',
					updateUrl: 'productionplanning/engineering/task/changestatus',
					id: 11,
					supportMultiChange: true,
					HookExtensionOperation: function (options, dataItems) {
						var schemaOption = {typeName: 'EngTaskDto', moduleSubModule: 'ProductionPlanning.Engineering'};
						var translationSrv = $injector.get('productionplanningEngineeringTranslationService');
						return $injector.get('ppsCommonLoggingStatusChangeReasonsDialogService').showDialog(options, dataItems, schemaOption, translationSrv);
					}
				}
			);
		}

		service.changeEngineeringTaskStatus = changeEngineeringTaskStatus().fn;

		function uploadFiles() {
			var service = {};
			service.fn = function () {
/*
 * Remark: At the moment, because wizard “Import Product Description” is discarded, code of uploadFiles() will not be used any more.
 * But here we will still keep the code, in case we will reuse it in the future(e.g. reuse to patch CAD data in DB without accounting).(by zwz 2019/11/12)
				var selected = mainService.getSelected();
				var title = platformSidebarWizardCommonTasksService.prepareMessageText('productionplanning.engineering.wizard.importProductDescriptionTitle');
				if (platformSidebarWizardCommonTasksService.assertSelection(selected, title)) {
					if (!selected.PpsItemFk) {
						var errorMessage = platformSidebarWizardCommonTasksService.prepareMessageText('productionplanning.engineering.errors.noPPSItem');
						platformSidebarWizardCommonTasksService.showErrorNoSelection(title, errorMessage);
						return;//no pps item
					}
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + moduleName + '/partials/file-handler-lookup.html',
						backdrop: false
					});
				}
*/
			};
			return service;
		}

		service.uploadFiles = uploadFiles().fn;

		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.engineering.wizard.wizardGroupName',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					changeEngineeringTaskStatus()
					/*
					,
					uploadFiles()
					*/
				]
			}]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		function enableTask() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(mainService, 'enableTaskTitle', 'productionplanning.engineering.wizard.enableTaskTitle', 'Code',
				'productionplanning.engineering.wizard.enableDisableTaskDone', 'productionplanning.engineering.wizard.taskAlreadyEnabled', 'task', 17);
		}

		service.enableTask = function () {
			var modStorage = platformModuleStateService.state(mainService.getModule()).modifications;
			var mainItemId = modStorage.MainItemId;
			enableTask().fn().then(function () {
				modStorage.MainItemId = mainItemId;//revert the MainItemId
			});
		};

		function disableTask() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(mainService, 'disableTaskTitle', 'productionplanning.engineering.wizard.disableTaskTitle', 'Code',
				'productionplanning.engineering.wizard.enableDisableTaskDone', 'productionplanning.engineering.wizard.taskAlreadyDisabled', 'task', 18);
		}

		service.disableTask = function () {
			var modStorage = platformModuleStateService.state(mainService.getModule()).modifications;
			var mainItemId = modStorage.MainItemId;
			disableTask().fn().then(function () {
				modStorage.MainItemId = mainItemId;//revert the MainItemId
			});
		};

		function changeResRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: mainService,
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					getDataService: function () {
						var resRequisitionDataService = commonResRequisitionDataServiceFactory.getServiceByName('ProductionplanningEngineeringResRequisitionDataService');
						return {
							getSelected: function () {
								return resRequisitionDataService ? resRequisitionDataService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return resRequisitionDataService ? resRequisitionDataService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								resRequisitionDataService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, resRequisitionDataService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeResRequisitionStatus = changeResRequisitionStatus().fn;

		function changeResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: mainService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var resReservationService = commonResReservationDataServiceFactory.getServiceByName('ProductionplanningEngineeringResReservationDataService');
						return {
							getSelected: function () {
								return resReservationService ? resReservationService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return resReservationService ? resReservationService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								resReservationService.gridRefresh();
							},
							processData: function(entities) {
								processDataByService(entities, resReservationService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		function processDataByService(entities, service) {
			var simpleProcessors = _.filter(service.getDataProcessor(), function(proc) {
				return _.isFunction(proc.processItem) && proc.processItem.length === 1;
			});
			_.forEach(simpleProcessors, function(processor) {
				_.forEach(entities, processor.processItem);
			});
		}

		service.changeResReservationStatus = changeResReservationStatus().fn;


		let doCreateUpstreamPackages = () => {
			var upstreamItemDataService = $injector.get('ppsUpstreamItemDataService').getService({
				serviceKey: 'productionplanning.engineering.ppsitem.upstreamitem',
				parentService: 'productionplanningEngineeringMainService',
				ppsItemColumn: 'PPSItemFk',
				ppsHeaderColumn: 'PPSItem_PpsHeaderFk'
			});
			let getPackageRequestFn = (selectedItem, selectedUpstreamItems) => new Promise((resolve) => {
				basicsLookupdataLookupDescriptorService.loadItemByKey('ppsitem', selectedItem.PPSItemFk).then(function (ppsItem) {
					var packageRequest = {
						UpstreamItems: selectedUpstreamItems,
						ProjectId: selectedItem.ProjectId,
						PpsItemCode: ppsItem.Code
					};
					resolve(packageRequest);
				});
			});
			productionplanningItemUpstreamPackagesCreationWizardHandler.doCreateUpstreamPackages(upstreamItemDataService, mainService, getPackageRequestFn);
		};

		service.createUpstreamPackages = () => {
			mainService.update().then(() => doCreateUpstreamPackages());
		};

		service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(mainService, 'productionplanning.engineering').fn;

		var changeUpstreamStatus = function changeUpstreamStatus() {
			var upstreamItemDataService = $injector.get('ppsUpstreamItemDataService').getService({
				serviceKey: 'productionplanning.engineering.ppsitem.upstreamitem',
				parentService: 'productionplanningEngineeringMainService',
				ppsItemColumn: 'PPSItemFk',
				ppsHeaderColumn: 'PPSItem_PpsHeaderFk'
			});
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					statusName: 'upstream',
					mainService: mainService,
					dataService: upstreamItemDataService,
					refreshMainService: false,
					statusField: 'PpsUpstreamStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'Change Upstream Requirement Status',
					supportMultiChange: true
				}
			);
		};
		service.changeUpstreamStatus = changeUpstreamStatus().fn;

		return service;
	}

})(angular);

