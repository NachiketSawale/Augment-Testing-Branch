(function (angular) {
	'use strict';

	var moduleName = 'logistic.job';
	angular.module(moduleName).service('logisticJobSidebarWizardService', LogisticJobSidebarWizardService);

	LogisticJobSidebarWizardService.$inject = ['logisticJobDataService', 'basicsCommonChangeStatusService', '$translate', '$http',
		'platformModalService', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
		'platformModalFormConfigService', 'platformSidebarWizardCommonTasksService', '$q', '$injector',
		'logisticJobPlantLocationDataService', 'logisticJobAdjustAllocationDialogService', 'platformLayoutHelperService', '_', 'globals','documentProjectDocumentsStatusChangeService'];

	function LogisticJobSidebarWizardService(logisticJobDataService, basicsCommonChangeStatusService, $translate, $http,
											 platformModalService, basicsLookupdataConfigGenerator, platformTranslateService,
											 platformModalFormConfigService, platformSidebarWizardCommonTasksService, $q, $injector,
											 logisticJobPlantLocationDataService, logisticJobAdjustAllocationDialogService,
											 platformLayoutHelperService, _, globals,documentProjectDocumentsStatusChangeService ) {
		var setJobStatus = function setJobStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: logisticJobDataService,
					statusField: 'JobStatusFk',
					codeField: 'Code',
					descField: 'Description',
					projectField: 'ProjectFk',
					title: 'basics.customize.jobstatus',
					statusName: 'logisticjobstatus',
					updateUrl: 'logistic/job/changestatus',
					id: 1
				}
			);
		};

		function changeStatusForProjectDocument() {
			return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(logisticJobDataService, 'logistic.job');
		}

		this.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

		this.setJobStatus = setJobStatus().fn;

		this.adjustQuantities = function adjustQuantities() {
			var selected = logisticJobPlantLocationDataService.getSelected();
			if (!selected) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('logistic.job.adjustQuantities');
			} else if (selected && selected.Quantity >= 0) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('logistic.job.adjustQuantities', $translate.instant('logistic.job.noNegativeQuantity'));
			} else {
				// if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'resource.equipment.adjustQuantities')) {
				logisticJobAdjustAllocationDialogService.showLookup();
			}
		};

		this.clearProject = function clearProject() {
			var selected = logisticJobDataService.getSelected();
			var data = {
				projectFk: null,
				jobFk: null,
				stockFk: null,
				stockLocationFk: null
			};

			function getJobRow() {
				var jobRow = platformLayoutHelperService.provideJobLookupOverload().detail;
				angular.extend(jobRow, {
					sortOrder: 1, required: true,
					gid: 'baseGroup',
					rid: 'job',
					label: 'Receiving Job',
					label$tr$: 'logistic.job.receivingJob',
					model: 'jobFk'
				});
				return jobRow;
			}
			function getProjectFromSelectedJob(id){
				var descriptor = $injector.get('basicsLookupdataLookupDescriptorService');
				var item = descriptor.getLookupItem('logisticJob', id);
				if(item && item.ProjectFk){
					return item.ProjectFk;
				}
				return null;
			}

			if (!selected) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('logistic.job.clearProject');
			} else {
				var modalCreateConfig = {
					title: $translate.instant('logistic.job.clearProject'),
					dataItem: data,
					formConfiguration: {
						fid: 'logistic.job.clearProject',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup'
							}
						],
						rows: [getJobRow(),
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'projectStockLookupDataService',
								enableCache: true,
								filter: function (item) {
									let project = null;
									if (item.jobFk) {
										project = getProjectFromSelectedJob(item.jobFk);
									}
									let prj = {PKey1: null, PKey2: null, PKey3: null};
									if (_.isNil(project)) {
										prj.PKey3 = 0;
									} else {
										prj.PKey3 = project;
									}
									return prj;
								}
							}, {
								gid: 'baseGroup',
								rid: 'receivingStock',
								label: 'Receiving Stock',
								label$tr$: 'logistic.job.receivingStock',
								type: 'lookup',
								model: 'stockFk',
								sortOrder: 2
							}),{
								gid: 'baseGroup',
								rid: 'receivingStockLocation',
								label: 'Receiving Stock Location',
								label$tr$: 'logistic.job.receivingStockLocation',
								model: 'stockLocationFk',
								sortOrder: 3,
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-stock-location-dialog-lookup',
									displayMember: 'Code',
									descriptionMember: 'DescriptionInfo.Translated',
									showClearButton: true,
									lookupOptions: {
										additionalFilters: [{
											'projectFk': 'projectFk',
											projectFkReadOnly: true,
											getAdditionalEntity: function (item) {
												let prj = null;
												if (item.jobFk) {
													prj = getProjectFromSelectedJob(item.jobFk);
												}
												return {
													'projectFk': prj
												};
											}
										}, {
											'projectStockFk': 'stockFk',
											projectStockFkReadOnly: false,
											getAdditionalEntity: function (item) {
												return item;
											}
										}],
										showClearButton: true
									}
								}
							}
/*
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'projectStockLocationLookupDataService',
								enableCache: true,
								filter: function (item) {
									var prj;
									if (item) {
										prj = item.stockFk;
									}
									return prj;
								}
							}, {
								gid: 'baseGroup',
								rid: 'receivingStockLocation',
								label: 'Receiving Stock Location',
								label$tr$: 'logistic.job.receivingStockLocation',
								type: 'lookup',
								model: 'stockLocationFk',
								sortOrder: 1
							})
*/
						]
					},
					handleOK: function handleOK(result) {
						var inJobIds = _.uniq(_.map(logisticJobDataService.getSelectedEntities(), 'Id'));
						var data = {
							InJobIds: inJobIds,
							OutJobId: result.data.jobFk,
							StockId: result.data.stockFk,
							StockLocationId: result.data.stockLocationFk
						};
						$http.post(globals.webApiBaseUrl + 'logistic/dispatching/header/clearproject', data
						).then(function (response) {
							if (!response.data || response.data.length === 0) {
								platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
							} else {
								platformModalService.showMsgBox(response.data, modalCreateConfig.title, 'ico-info');
							}
						});
					}

				};
				modalCreateConfig.dialogOptions = {};
				modalCreateConfig.dialogOptions.disableOkButton = function () {
					return data.jobFk === null;
				};
				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				platformModalFormConfigService.showDialog(modalCreateConfig);
			}
		};

		this.reserveMaterialAndStock = function reserveMaterialAndStock() {
			var okDisable = false;
			var validationCheck = function () {
				return okDisable === false;
			};

			var title = 'logistic.job.titelreservematerialandstock';
			if (logisticJobDataService.getSelected() !== null) {
				var modalCreateConfig = {
					title: title,
					dataItem: {
						ProjectFk: logisticJobDataService.getSelected().ProjectFk,
						PrjStockFk: null
					},
					formConfiguration: {
						fid: 'logistic.job.reservematerialandstock',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['PrjStockFk']
							}
						],
						rows: [
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'projectStockLookupDataService',
								enableCache: true,
								filter: function (item) {
									var prj = {PKey1: null};
									if (item) {
										prj.PKey1 = item.ProjectFk;
										okDisable = true;
									}
									return prj;
								}
							}, {
								gid: 'baseGroup',
								rid: 'prjStock',
								label: 'Project Stock',
								label$tr$: 'logistic.job.entityStock',
								type: 'lookup',
								model: 'PrjStockFk',
								sortOrder: 1
							})
						]
					},
					handleOK: function handleOK(result) {
						var data = {
							ProjectStockId: result.data.PrjStockFk,
							Job: logisticJobDataService.getSelected()
						};
						$http.post(globals.webApiBaseUrl + 'logistic/card/card/reservematerial', data).then(function (response) {
							if (response && response.data) {
								return null;
							}
						});
					},
					dialogOptions: {
						disableOkButton: validationCheck
					}
				};

				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);
				platformModalFormConfigService.showDialog(modalCreateConfig);

			} else {
				//Error MessageText
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};

		var disableJob = function disableJob() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(logisticJobDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code',
				'logistic.job.disableDone', 'logistic.job.alreadyDisabled', 'code', 1);
		};
		this.disableJob = disableJob().fn;

		var enableJob = function enableJob() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(logisticJobDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code',
				'logistic.job.enableDone', 'logistic.job.alreadyEnabled', 'code', 2);
		};
		this.enableJob = enableJob().fn;

	}

})(angular);
