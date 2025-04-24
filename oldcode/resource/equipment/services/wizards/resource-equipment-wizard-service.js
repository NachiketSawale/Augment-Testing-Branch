(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.equipment';
	angular.module(moduleName).service('resourceEquipmentSidebarWizardService', ResourceEquipmentSidebarWizardService);

	ResourceEquipmentSidebarWizardService.$inject = ['_', '$injector', '$q', 'resourceMasterMainService', 'platformSidebarWizardCommonTasksService', 'platformWizardDialogService', 'resourceEquipmentPlantDataService', 'basicsCommonChangeStatusService',
		'resourceEquipmentMaintenanceDataService', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
		'platformModalFormConfigService', '$translate', '$http', 'platformRuntimeDataService', 'platformModalService', 'platformContextService',
		'moment', 'servicesSchedulerUIFrequencyValues', 'resourceEquipmentPlantLocationDataService', 'resourceEquipmentAdjustAllocationDialogService',
		'resourceEquipmentPlantComponentDataService', 'resourceEquipmentPlantComponentMaintSchemaDataService',
		'procurementContractNumberGenerationSettingsService', 'basicsLookupdataLookupDescriptorService',
		'resourceEquipmentWarrantyDataService', 'procurementCommonCreateService', 'procurementContractHeaderFilterService', 'basicsCompanyNumberGenerationInfoService', 'procurementContextService'];

	function ResourceEquipmentSidebarWizardService(_, $injector, $q, resourceMasterMainService, platformSidebarWizardCommonTasksService, platformWizardDialogService, resourceEquipmentPlantDataService, basicsCommonChangeStatusService,
		resourceEquipmentMaintenanceDataService, basicsLookupdataConfigGenerator, platformTranslateService,
		platformModalFormConfigService, $translate, $http, platformRuntimeDataService, platformModalService, platformContextService,
		moment, servicesSchedulerUIFrequencyValues, resourceEquipmentPlantLocationDataService, resourceEquipmentAdjustAllocationDialogService,
		resourceEquipmentPlantComponentDataService, resourceEquipmentPlantComponentMaintSchemaDataService,
		procurementContractNumberGenerationSettingsService, basicsLookupdataLookupDescriptorService,
		resourceEquipmentWarrantyDataService, procurementCommonCreateService, procurementContractHeaderFilterService, basicsCompanyNumberGenerationInfoService, procurementContextService) {


		var setPlantMaintenanceStatus = function setPlantMaintenanceStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceEquipmentPlantDataService,
					dataService: resourceEquipmentMaintenanceDataService,
					statusField: 'MaintenanceStatusFk',
					codeField: 'Code',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.maintenancestatus',
					statusName: 'equipmentmaintenancestatus',
					updateUrl: 'resource/equipment/plantmaintenance/changestatus',
					id: 4
				}
			);
		};
		this.setPlantMaintenanceStatus = setPlantMaintenanceStatus().fn;

		var setPlantComponentWarrantyStatus = function setPlantComponentWarrantyStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: resourceEquipmentPlantDataService,
					dataService: resourceEquipmentWarrantyDataService,
					statusField: 'WarrantyStatusFk',
					codeField: 'Code',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.warrantystatus',
					statusName: 'equipmentwarrantystatus',
					updateUrl: 'resource/equipment/component/warranty/changestatus',
					id: 5
				}
			);
		};
		this.setPlantComponentWarrantyStatus = setPlantComponentWarrantyStatus().fn;

		this.createRequisitionsOrReservations = function createRequisitionsOrReservations() {
			let selectedPlant = resourceEquipmentPlantDataService.getSelected();
			var genReqResJobData = {
				wizardData: {
					filter: {
						PlantGroupFk: null,
						PlantCompMaintSchemaFk: null,
						EndDate: null,
						StartDate: null,
						OnlySelectedPlants: false,
						PlantFks: null,
						FilterChanged: true
					},
					selection: [],
					defaults: {
						projectFk: null,
						jobTypeFk: null,
						selectedJob: true,
						jobFk : null
					},
					savedData:{
						projectFk: null,
						jobTypeFk: null,
						jobFk : null
					}
				}
			};

			function createGridStep() {
				var title = $translate.instant('resource.equipment.CreateReqAndResSelectTitle');// translationNamespace + 'reservationStepList';
				var topDescription = $translate.instant('resource.equipment.CreateReqAndResSelectTitle');// translationNamespace + 'topDescription';
				var model = {
					items: genReqResJobData.wizardData.selection,
					selectedId: null,
					id: 'selection',
					selectionListConfig: {
						selectedIdProperty: 'SelectedId',
						idProperty: 'MaintenanceFk',
						columns: $injector.get('resourceEquipmentMaintenanceViewLayoutService').getStandardConfigForListView().columns,
						options: {
							tree: false
						},
						multiSelect: true
					}
				};
				genReqResJobData.wizardData.listModel = model;
				var gridStep = platformWizardDialogService.createListStep($translate.instant(title), $translate.instant(topDescription), 'wizardData.listModel', 'selection');
				gridStep.watches = {
					expression: 'wizardData.selection',
					fn: function (info) {
						_.find(info.model.steps, function (item) {
							return item.id === 'selection';
						}).disallowNext =
							_.some(info.model.wizardData.selection, function (item) {
								return item.rt$isIncluded;
							});
					}
				};
				gridStep.disallowNext = false;
				gridStep.cssClass = '';
				return gridStep;
			}

			var wzConfig = {
				title: 'Generate Requisitions, Reservations and Job Cards',
				title$tr$: 'resource.equipment.createReqAndRes',
				width: '80%',
				height: '500px',
				steps: [
					{
						id: 'filter',
						title: 'Filter',
						title$tr$: 'resource.equipment.LoadingSelection',
						form: {
							fid: 'wzExample.nameForm',
							version: '1.0.0',
							showGrouping: true,
							skipPermissionsCheck: true,
							groups: [
								{
									gid: 'filter',
									header: 'Set prefilter for plant selection',
									header$tr$: 'resource.requisition.SelectFilter',
									isOpen: true
								}],
							rows: [
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'resourceEquipmentGroupLookupDataService',
									cacheEnable: true,
									additionalColumns: false,
									showClearButton: true
								}, {
									gid: 'filter',
									rid: 'group',
									label: 'Equipment Group',
									label$tr$: 'resource.equipmentgroup.entityResourceEquipmentGroup',
									type: 'integer',
									model: 'wizardData.filter.PlantGroupFk',
									sortOrder: 1
								}),
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
									cacheEnable: true,
									additionalColumns: false,
									showClearButton: true
								}, {
									gid: 'filter',
									rid: 'maintenanceScheme',
									label: 'Plant Maintenance Scheme',
									label$tr$: 'resource.maintenance.entityMaintenanceScheme',
									type: 'integer',
									model: 'wizardData.filter.PlantCompMaintSchemaFk',
									required: false,
									sortOrder: 2
								}),
								{
									gid: 'filter',
									rid: 'StartDate',
									label: 'Start',
									label$tr$: 'cloud.common.entityStartDate',
									type: 'dateutc',
									model: 'wizardData.filter.StartDate',
									sortOrder: 4
								}, {
									gid: 'filter',
									rid: 'EndDate',
									label: 'Finish',
									label$tr$: 'cloud.common.entityEndDate',
									type: 'dateutc',
									model: 'wizardData.filter.EndDate',
									sortOrder: 5
								},
								{
									gid: 'filter',
									rid: 'onlyselectedPlants',
									label: 'Selected Plant(s) only',
									label$tr$: 'resource.reservation.OnlySelectedPlant',
									type: 'boolean',
									model: 'wizardData.filter.OnlySelectedPlants',
									sortOrder: 8
								}]
						},
						watches:
							[{
								expression: 'wizardData.filter.PlantGroupFk',
								fn: function (info) {
									var loadingSelection = _.find(info.wizard.steps, function (step) {
										return step.id === 'loadingSelection';
									});
									loadingSelection.disallowNext = true;
								}
							}, {
								expression: 'wizardData.filter.PlantCompMaintSchemaFk',
								fn: function (info) {
									var loadingSelection = _.find(info.wizard.steps, function (step) {
										return step.id === 'loadingSelection';
									});
									loadingSelection.disallowNext = true;
								}
							}, {
								expression: 'wizardData.filter.EndDate',
								fn: function (info) {
									var loadingSelection = _.find(info.wizard.steps, function (step) {
										return step.id === 'loadingSelection';
									});
									loadingSelection.disallowNext = true;
								}
							}, {
								expression: 'wizardData.filter.StartDate',
								fn: function (info) {
									var loadingSelection = _.find(info.wizard.steps, function (step) {
										return step.id === 'loadingSelection';
									});
									loadingSelection.disallowNext = true;
								}
							}, {
								expression: 'wizardData.filter.OnlySelectedPlants',
								fn: function (info) {
									var loadingSelection = _.find(info.wizard.steps, function (step) {
										return step.id === 'loadingSelection';
									});
									loadingSelection.disallowNext = true;
								}
							}, {
								expression: 'wizardData.filter.PlantFks',
								fn: function (info) {
									var loadingSelection = _.find(info.wizard.steps, function (step) {
										return step.id === 'loadingSelection';
									});
									loadingSelection.disallowNext = true;
								}
							}]
					},
					{
						id: 'loadingSelection',
						title: 'Loading Selection',
						title$tr$: 'resource.equipment.LoadingSelection',
						disallowNext: true,
						prepareStep: function prepareSelectionHandle(info) {
							var asnycGetSelectionData = function (info) {
								return $http.post(globals.webApiBaseUrl + 'resource/equipment/plantmaintenancev/listbyfilter', genReqResJobData.wizardData.filter).then(function (result) {
									info.model.wizardData.selection.push.apply(info.model.wizardData.selection, result.data);
									info.model.wizardData.filter.FilterChanged = false;
									info.step.disallowNext = false;
									info.commands.goToNext();
								});
							};
							if (info.previousStep.id === 'selection') {
								info.commands.goToPrevious();
							} else if (info.previousStep.id === 'filter') {
								if (info.step.disallowNext) {
									genReqResJobData.wizardData.selection.length = 0;
									if (info.model.wizardData.filter.OnlySelectedPlants) {
										var selectedPlants = resourceEquipmentPlantDataService.getSelectedEntities();
										if (_.some(selectedPlants)) {
											info.model.wizardData.filter.PlantFks = _.map(selectedPlants, function (ent) {
												return ent.Id;
											});
											return asnycGetSelectionData(info);
										} else {
											info.commands.goToPrevious();
											platformModalService.showErrorBox('resource.equipment.ErrorNoPlantsSelected', 'resource.equipment.createReqAndRes');
										}
									} else {
										info.model.wizardData.filter.PlantFks = null;
										return asnycGetSelectionData(info);
									}
								} else {
									info.commands.goToNext();
								}
							}
						}
					},
					createGridStep(),
					{
						id: 'defaults',
						title: 'Defaults',
						title$tr$: 'resource.requisition.DefaultsConfiguration',
						form: {
							fid: 'wzExample.nameForm',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [
								{
									gid: 'default',
									header: 'Defaults',
									header$tr$: 'resource.requisition.Defaults',
									isOpen: true
								}],
							rows: [
								{
									gid: 'default',
									rid: 'SelectedJob',
									label: 'Select a Job',
									label$tr$: 'resource.equipment.DefaultsConfiguration',
									type: 'radio',
									model: 'wizardData.defaults.selectedJob',
									visible: true,
									options: {
										labelMember: 'Description',
										valueMember: 'Value',
										groupName: 'genReqResJobData',
										items: [
											{Id: 1, Description: $translate.instant('resource.equipment.selectedJob'), Value : true },
											{Id: 2, Description: $translate.instant('resource.equipment.chooseNewJob'), Value : false }
										]},
									sortOrder: 0
								},
								{
									gid: 'default',
									rid: 'project',
									label: 'Project',
									label$tr$: 'cloud.common.entityProject',
									type: 'directive',
									directive: 'basics-lookup-data-project-project-dialog',
									model: 'wizardData.defaults.projectFk',
									sortOrder: 1,
									visible: true
								},
								{
									gid: 'default',
									rid: 'Job',
									label: 'Job',
									label$tr$: 'logistic.job.entityJob',
									type: 'directive',
									directive: 'logistic-job-paging-lookup',
									model: 'wizardData.defaults.jobFk',
									sortOrder: 2,
									required: true,
									visible: true
								},
								basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm({
										dataServiceName: 'basicsCustomLogisticJobTypeLookupDataService',
										cacheEnable: true,
										additionalColumns: false,
										showClearButton: true,
										filterKey: 'logistic-job-is-maintenance-filter',
									},
									{
										gid: 'default',
										rid: 'jobtype',
										label: 'Job Type',
										label$tr$: 'logistic.job.entityJobType',
										type: 'integer',
										model: 'wizardData.defaults.jobTypeFk',
										sortOrder: 3
									}),
								{
									gid: 'default',
									rid: 'requisition',
									label: 'Requisition',
									label$tr$: 'resource.requisition.entityRequisition',
									type: 'boolean',
									model: 'wizardData.defaults.isRequisition',
									sortOrder: 6
								},
								{
									gid: 'default',
									rid: 'reservation',
									label: 'Reservation and Requisition',
									label$tr$: 'resource.reservation.ReqAndRes',
									type: 'boolean',
									model: 'wizardData.defaults.isReqAndRes',
									sortOrder: 7
								},
								{
									gid: 'default',
									rid: 'jobCard',
									label: 'Job Card',
									label$tr$: 'basics.customize.j obcardfk',
									type: 'boolean',
									model: 'wizardData.defaults.isJobCard',
									sortOrder: 8
								}],
						},
						disallowNext: false,
						canFinish: false,
						watches:
							[{
								expression: 'wizardData.defaults.selectedJob',
								fn: function (info) {
									let defaults = _.find(info.wizard.steps, function (step) {
										return step.id === 'defaults';
									});
									let job = _.find(info.wizard.steps[3].form.rows, { rid: 'Job' });
									job.required = info.newValue === true;
									job.Id = info.model.wizardData.defaults.jobFk;
									defaults.disallowNext = false;
									handleProjectAndJobType(info);
									info.scope.$broadcast('form-config-updated');
								},
								deep: true
							},
								{
									expression: 'wizardData.defaults.jobFk',
									fn: function (info) {
										let defaults = _.find(info.wizard.steps, function (step) {
											return step.id === 'defaults';
										});
										let job = _.find(info.wizard.steps[3].form.rows, { rid: 'Job' });
										if(!job.required){
											defaults.disallowNext = false;
										}
									}
								},],
						prepareStep: function prepareStep(info) {
							if (!_.some(info.model.wizardData.selection, function (item) {
								return item.rt$isIncluded;
							})) {
								info.commands.goToPrevious();
								platformModalService.showErrorBox('resource.equipment.ErrorNoMaintenancesSelected', 'resource.equipment.createReqAndRes');
							}
							if(_.filter(info.model.wizardData.selection, item => item.rt$isIncluded).length > 1) {
								info.model.wizardData.defaults.selectedJob = false;
								handleProjectAndJobType(info);
								info.step.form.rows[0].visible = false;
							}
							else{
								info.model.wizardData.defaults.selectedJob = true;
								info.step.form.rows[0].visible = true;
								if (selectedPlant) {
									handleProjectAndJobType(info);
								}
							}
						}
					},
					{
						id: 'proccessing',
						title: 'Generating Requisitions and Reservations...',
						title$tr$: 'resource.equipment.GeneratingReqAndRes',
						disallowNext: true,
						disallowBack: true,
						prepareStep: function (info) {
							let data;
							if(info.model.wizardData.defaults.jobFk){
								data = {
									GroupId: info.model.wizardData.defaults.groupFk,
									StartDate: info.model.wizardData.filter.startDate,
									EndDate: info.model.wizardData.filter.endDate,
									ProjectId: info.model.wizardData.defaults.jobFk? null : info.model.wizardData.defaults.projectFk,
									IsRequisition: info.model.wizardData.defaults.isRequisition,
									IsRequisitonAndReservation: info.model.wizardData.defaults.isReqAndRes,
									IsJobCard: info.model.wizardData.defaults.isJobCard,
									JobTypeFk: info.model.wizardData.defaults.jobFk? null : info.model.wizardData.defaults.jobTypeFk,
									JobFk: genReqResJobData.wizardData.savedData.jobFk,
									PlantMaintenances: _.filter(info.model.wizardData.selection, function (item) {
										return item.rt$isIncluded;
									})
								};
							}
							else {
								data = {
									GroupId: info.model.wizardData.defaults.groupFk,
									StartDate: info.model.wizardData.filter.startDate,
									EndDate: info.model.wizardData.filter.endDate,
									ProjectId: info.model.wizardData.defaults.jobFk? null : info.model.wizardData.defaults.projectFk,
									IsRequisition: info.model.wizardData.defaults.isRequisition,
									IsRequisitonAndReservation: info.model.wizardData.defaults.isReqAndRes,
									IsJobCard: info.model.wizardData.defaults.isJobCard,
									JobTypeFk: info.model.wizardData.defaults.jobFk? null : info.model.wizardData.defaults.jobTypeFk,
									JobFk: info.model.wizardData.defaults.jobFk,
									PlantMaintenances: _.filter(info.model.wizardData.selection, function (item) {
										return item.rt$isIncluded;
									})
								};
							}
							$http.post(globals.webApiBaseUrl + 'resource/equipment/plant/createreqandres', data
							).then(function (result) {
								var completition = _.find(info.wizard.steps, function (step) {
									return step.id === 'completition';
								});
								if (result.data.length > 0) {
									var modalOptions = {
										headerTextKey: 'resource.equipment.createReqAndRes',
										bodyTextKey: result.data,
										showOkButton: true,
										showCancelButton: true,
										resizeable: true,
										height: '500px',
										iconClass: 'info'
									};
									completition.message = $translate.instant('resource.equipment.CreateReqAndResFinished');
									info.step.disallowNext = false;
									info.commands.goToNext();
									platformModalService.showDialog(modalOptions);

								} else {
									completition.message = $translate.instant('resource.equipment.CreateReqAndResError');
									info.step.disallowNext = false;
									info.commands.goToNext();
								}

							});
						}
					},
					{
						id: 'completition',
						title: 'Completion',
						message: '',
						disallowBack: true,
						canFinish: true
					}
				]
			};
			var promises = [
				$http.get(globals.webApiBaseUrl + 'project/main/getadministrationproject').then(function (response) {
					if (response && response.data) {
						genReqResJobData.wizardData.defaults.projectFk = response.data;
						genReqResJobData.wizardData.savedData.projectFk = genReqResJobData.wizardData.defaults.projectFk;
					}
				}),
				$http.post(globals.webApiBaseUrl + 'basics/customize/jobtype/list', {filter: ''}).then(function (response) {
					if (response && response.data) {
						var firstIsMaintenance = _.first(_.filter(response.data, function (item) {
							return item.IsMaintenance;
						}));
						genReqResJobData.wizardData.defaults.jobTypeFk = !_.isUndefined(firstIsMaintenance) ? firstIsMaintenance.Id : null;
						genReqResJobData.wizardData.savedData.jobTypeFk = genReqResJobData.wizardData.defaults.jobTypeFk;
					}
				}),
				$http.get(globals.webApiBaseUrl + 'logistic/job/getbyplantfk?plantFk=' + selectedPlant.Id).then(function (result) {
					if(result && result.data){
						genReqResJobData.wizardData.savedData.jobFk = result.data.Id;
					}
				})
			];

			$q.all(promises).then(function () {
				platformWizardDialogService.showDialog(wzConfig, genReqResJobData).then(function (result) {
					if (result.success) {
						// console.log(result.data.firstName + ' ' + result.data.middleName + ' ' + result.data.lastName + ', ' + result.data.age);
					}
				});
			});

			// TODO: source code enhancement is required
			function handleProjectAndJobType(info) {
				let readonly;
				let data = info.model.wizardData;
				if(_.filter(data.selection, item => item.rt$isIncluded).length === 1){
					if (data.defaults.selectedJob === true) {
						data.defaults.projectFk = null;
						data.defaults.jobTypeFk = null;
						data.defaults.jobFk =  genReqResJobData.wizardData.savedData.jobFk;
						readonly = true;
					} else {
						readonly = false;
						data.defaults.jobFk = null;
						data.defaults.projectFk = genReqResJobData.wizardData.savedData.projectFk;
						data.defaults.jobTypeFk = genReqResJobData.wizardData.savedData.jobTypeFk;
					}
					platformRuntimeDataService.readonly(genReqResJobData, [
						{
							field: 'wizardData.defaults.projectFk',
							readonly: readonly
						},
						{
							field: 'wizardData.defaults.jobTypeFk',
							readonly: readonly
						},
						{
							field: 'wizardData.defaults.jobFk',
							readonly: !readonly
						}
					]);
				}
				else {
					let job = _.find(info.wizard.steps[3].form.rows, { rid: 'Job' });
					job.required = false;
					data.defaults.jobFk = null;
					data.defaults.projectFk = genReqResJobData.wizardData.savedData.projectFk;
					data.defaults.jobTypeFk = genReqResJobData.wizardData.savedData.jobTypeFk;
					platformRuntimeDataService.readonly(genReqResJobData, [
						{
							field: 'wizardData.defaults.projectFk',
							readonly: false
						},
						{
							field: 'wizardData.defaults.jobTypeFk',
							readonly: false
						},
						{
							field: 'wizardData.defaults.jobFk',
							readonly: false
						}
					]);
				}
			}
		};

		this.createMaintenances = function createMaintenances() {
			var title = $translate.instant('resource.equipment.createMaintenances');
			var selected = resourceEquipmentPlantComponentDataService.getSelected();
			var componentMaintList = $injector.get('resourceEquipmentPlantComponentMaintSchemaDataService').getList();
			if (!selected) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection(title);
				return;
			}
			if(!selected.MaintenanceSchemaFk && componentMaintList.length === 0){
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText:  $translate.instant('resource.equipment.createMaintenanceRecordsWizard.noSchemaAndComponentSchema'),
					iconClass: 'ico-info',
					disableOkButton: false
				};
				platformModalService.showDialog(modalOptions);
				return;
			}

			var componentId = selected.Id;

			var validate = function (entity, value, field) {
				var errobj = {
					apply: true,
					valid: true
				};
				if (!value) {
					errobj.valid = false;
					errobj.error = '...';
					errobj.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
					errobj.error$tr$param$ = {fieldName: field.toLowerCase()};
				}
				return errobj;
			};

			var dataItem = {
				startDate: selected.ValidFrom
			};

			platformRuntimeDataService.applyValidationResult(validate(dataItem, selected.ValidFrom, 'Start'), dataItem, 'startDate');

			validate(dataItem, null, 'startDate');
			var modalCreateConfig = {
				title: title,
				dataItem: dataItem,
				formConfiguration: {
					fid: 'resource.equipment.wizardCreate',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'startDate',
							label: 'Start',
							label$tr$: 'cloud.common.entityStartDate',
							type: 'dateutc',
							model: 'startDate',
							sortOrder: 3,
							required: true,
							validator: validate
						}
					]
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return dataItem.startDate === null;
					}
				},

				handleOK: function handleOK(result) {
					var error = validate(result.data, result.data.startDate, 'startDate');
					if (error && error.valid) {
						var data = {
							StartDate: result.data.startDate,
							ComponentId: componentId
						};
						$http.post(globals.webApiBaseUrl + 'resource/equipment/plantmaintenance/createmaintenances', data
						).then(function (response) {
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
							if (response && response.data) {
								return resourceEquipmentMaintenanceDataService.load().then(function () {
									resourceEquipmentPlantComponentDataService.takeOver(response.data.PlantComponent);
									resourceEquipmentPlantComponentMaintSchemaDataService.takeOverFromResourceEquipmentSidebarWizardCreateMaintenances(response.data.PlantComponentMaintSchemaToSave);
									return resourceEquipmentPlantComponentMaintSchemaDataService.load().then(function () {
									});
								});
							}
						});
					}
				}

			};

			platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

			platformModalFormConfigService.showDialog(modalCreateConfig);

		};

		function setModalCreateConfig() {
			return {
				title: $translate.instant('resource.equipment.setMaintenanceToDue'),
				dataItem: {
					divisionFk: null,
					groupFk: null,
					kindFk: null,
					typeFk: null,
					componentTypeFk: null
				},
				formConfiguration: {
					fid: 'resource.equipment.setMaintenanceToDue',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.equipmentdivision', '',
							{
								gid: 'baseGroup',
								rid: 'division',
								label: 'Plant Division',
								label$tr$: 'basics.customize.equipmentdivision',
								type: 'integer',
								model: 'divisionFk',
								sortOrder: 1,
								readonly: true,
							}, false, {required: false}),
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'resourceEquipmentGroupLookupDataService',
								cacheEnable: true,
								additionalColumns: false,
								showClearButton: true
							},
							{
								gid: 'baseGroup',
								rid: 'group',
								label: 'Equipment Group',
								label$tr$: 'resource.equipmentgroup.entityResourceEquipmentGroup',
								type: 'integer',
								model: 'groupFk',
								sortOrder: 2
							}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.plantkind', '',
							{
								gid: 'baseGroup',
								rid: 'kind',
								label: 'Plant Kind',
								label$tr$: 'basics.customize.plantkind',
								type: 'integer',
								model: 'kindFk',
								sortOrder: 3
							}, false, {required: false}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.planttype', '',
							{
								gid: 'baseGroup',
								rid: 'type',
								label: 'Type',
								label$tr$: 'basics.customize.planttype',
								type: 'integer',
								model: 'typeFk',
								sortOrder: 4
							}, false, {required: false}),

						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('resource.componenttype.plantcomponenttype', '',
							{
								gid: 'baseGroup',
								rid: 'componentType',
								label: 'Plant Component Type',
								label$tr$: 'resource.equipment.entityPlantComponentTypeFk',
								type: 'integer',
								model: 'componentTypeFk',
								sortOrder: 5
							}, false, {required: false})
					]
				}
			};
		}

		// ***************************** Create Request for External Maintenance ****************************************************************
		this.createRequestForExternalMaintenance = function createRequestForExternalMaintenance() {
			function setProcurementService() {
				let serviceName = 'procurementContractHeaderDataService';

				procurementContextService.setMainService($injector.get(serviceName));
				procurementContextService.setLeadingService($injector.get(serviceName));
			}
			procurementContractHeaderFilterService.registerFilters();
			let selectedMaintRecord = resourceEquipmentMaintenanceDataService.getSelected();
			if (!selectedMaintRecord) {
				showMessage('', false);
				return;
			}
			let dataItem = {
				selection: null,
				processData: {
					jobFk: null,
					projectFk: null,
					jobTypeFk: null
				},
				currentSerivce: {},
				procurementProcess: {
					code: null,
					configurationFk: null,
					materialFk: null,
					businessPartnerFk: null,
					dataOrdered: moment().utc().startOf('day'),
					dateEffective: moment().utc().startOf('day')
				},
				currentItem: {},
			};

			let step1Rows = [
				{
					gid: 'baseGroup',
					rid: 'selection',
					label: 'Create request',
					label$tr$: 'resource.equipment.createRequestForExternalMaintenance',
					type: 'radio',
					model: 'selection',
					required: true,
					canFinish: true,
					options: {
						labelMember: 'Description',
						valueMember: 'Value',
						groupName: 'createRequestForExternalMaintenanceConfig',
						items: [
							{
								Id: 1,
								Description: $translate.instant('resource.equipment.createRequestForExternalMaintenanceWizard.isExistingJob'),
								Value: 'isExistingJob'
							},
							{
								Id: 2,
								Description: $translate.instant('resource.equipment.createRequestForExternalMaintenanceWizard.isNewJob'),
								Value: 'isNewJob'
							}
						]
					}
				},
			];

			let step2Rows = [
				{
					gid: 'baseGroup',
					rid: 'job',
					label: 'Job',
					type: 'directive',
					visible: true,
					directive: 'logistic-job-paging-lookup',
					readOnly: false,
					options: {
						showClearButton: false,
					},
					model: 'processData.jobFk',
					sortOrder: 1
				},
				{
					gid: 'baseGroup',
					rid: 'project',
					model: 'processData.projectFk',
					sortOrder: 2,
					required: true,
					label: 'Project',
					label$tr$: 'cloud.common.entityProjectName',
					type: 'directive',
					visible: true,
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-lookup-data-project-project-dialog',
						descriptionMember: 'ProjectName',
						lookupOptions: {
							initValueField: 'ProjectNo',
							showClearButton: false
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					}
				},
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm({
					dataServiceName: 'basicsCustomLogisticJobTypeLookupDataService',
					cacheEnable: true,
					additionalColumns: false,
					showClearButton: true,
					filterKey: 'logistic-job-is-maintenance-filter',
				},
				{
					gid: 'baseGroup',
					rid: 'jobtype',
					label: 'Job Type',
					type: 'integer',
					visible: true,
					required: true,
					model: 'processData.jobTypeFk',
					sortOrder: 3
				})
			];

			let step3Rows = [
				{
					gid: 'baseGroup',
					rid: 'code',
					model: 'procurementProcess.code',
					required: true,
					label$tr$: 'cloud.common.entityCode',
					type: 'code',
					sortOrder: 0
				},
				{
					gid: 'baseGroup',
					rid: 'materialFk',
					model: 'procurementProcess.materialFk',
					required: false,
					sortOrder: 2,
					label: 'Material',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'basics-material-material-lookup',
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'resource-requisition-material-filter'
						}
					}
				},
				{
					gid: 'baseGroup',
					rid: 'businessPartnerFk',
					model: 'procurementProcess.businessPartnerFk',
					required: true,
					sortOrder: 3,
					label: 'Business Partner',
					type: 'directive',
					directive: 'filter-business-partner-dialog-lookup',
					lookupOptions: {
						displayMember: 'BusinessPartnerName1',
					}
				},
				{
					gid: 'baseGroup',
					rid: 'dataOrdered',
					label: 'Data Ordered',
					type: 'dateutc',
					required: true,
					model: 'procurementProcess.dataOrdered',
					sortOrder: 4
				},
				{
					gid: 'baseGroup',
					rid: 'dateEffective',
					label: 'Date Effective',
					type: 'dateutc',
					required: true,
					model: 'procurementProcess.dateEffective',
					sortOrder: 5
				},

			];
			let checkDisallowNextStep1 = function () {
				return dataItem.selection !== 'isExistingJob' && dataItem.selection !== 'isNewJob';
			};
			let checkDisallowNextStep2 = function () {
				if(dataItem.selection === 'isExistingJob'){
					return dataItem.processData.jobFk === null;
				}
				else if(dataItem.selection === 'isNewJob'){
					return dataItem.processData.jobTypeFk === null || dataItem.processData.projectFk === null;
				}
			};

			let checkCanFinish = function () {
				return dataItem.procurementProcess.configurationFk && dataItem.procurementProcess.code && dataItem.procurementProcess.businessPartnerFk && dataItem.procurementProcess.dataOrdered
					&& dataItem.procurementProcess.dateEffective;
			};
			setProcurementService();

			let infoService;

			function updateCode() {
				if (!infoService) {
					return false;
				}
			}

			procurementCommonCreateService.init('procurement.contract', dataItem)
				.then(function () {
					infoService = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('procurementContractHeaderDataService', dataItem.currentSerivce.RubricFk);
					return infoService.load();
				})
				.then(function () {
					dataItem.procurementProcess.configurationFk = dataItem.currentItem.ConfigurationFk;
					const isReadonly = updateCode();
					platformRuntimeDataService.readonly(dataItem, [{ field: 'procurementProcess.code', readonly: isReadonly }]);
					addProcurementConfigurationLookup(dataItem);

					let maintWizard = {
						id: 'maintWizard',
						steps:  [
							{
								id: 'selection',
								title$tr$: 'resource.equipment.createRequestForExternalMaintenanceWizard.createFromExistingJobOrCreateNewJob',
								form: {
									fid: 'resource.equipment.selection',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [{
										gid: 'baseGroup',
										attributes: ['selection']
									}],
									rows: step1Rows
								},
								disallowBack: true,
								disallowNext: true,
								canFinish: false,
								watches: [{
									expression: 'selection',
									fn: function (info) {
										let checkJob = _.find(info.wizard.steps[1].form.rows, { rid: 'job' });
										let checkJobType = _.find(info.wizard.steps[1].form.rows, { rid: 'jobtype' });
										let checkProject = _.find(info.wizard.steps[1].form.rows, { rid: 'project' });

										switch (info.newValue) {
											case 'isExistingJob':
												checkJob.visible = true;
												checkJobType.visible = false;
												checkProject.visible = false;
												break;
											case 'isNewJob':
												checkJob.visible = false;
												checkJobType.visible = true;
												checkProject.visible = true;
												break;
											default:
												console.log('Unexpected generateActionsForValue "${info.newValue}"');
										}
										info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
										info.wizard.steps[1].disallowNext = checkDisallowNextStep2();
										info.wizard.steps[0].canFinish = false;
										info.scope.$broadcast('form-config-updated');
									},
									deep: true
								}]
							},
							{
								id: 'processData',
								title$tr$: 'resource.equipment.createRequestForExternalMaintenanceWizard.createRequestForExternalMaintenanceConfig',
								form: {
									fid: 'resource.equipment.processData',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [{
										gid: 'baseGroup',
										attributes:['processData']
									}],
									rows: step2Rows
								},
								disallowBack: false,
								disallowNext: true,
								canFinish: false,
								watches: [{
									expression: 'processData',
									fn: function (info) {
										info.wizard.steps[1].disallowNext = checkDisallowNextStep2();
										info.scope.$broadcast('form-config-updated');
									},
									deep: true
								}],
							},
							{
								id: 'procurementProcess',
								title$tr$: 'resource.equipment.createRequestForExternalMaintenanceWizard.createRequestForExternalMaintenanceConfig2',
								form: {
									fid: 'resource.equipment.procurementProcess',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [{
										gid: 'baseGroup',
										attributes:['procurementProcess']
									}],
									rows: step3Rows
								},
								disallowBack: false,
								disallowNext: true,
								watches: [{
									expression: 'procurementProcess',
									fn: function (info) {
										info.wizard.steps[2].canFinish = checkCanFinish();
										info.scope.$broadcast('form-config-updated');
									},
									deep: true
								}, {
									expression: 'procurementProcess.configurationFk',
									deep: false,
									fn: function (info) {
										const isReadonly = updateCode();
										platformRuntimeDataService.readonly(dataItem, [{ field: 'procurementProcess.code', readonly: isReadonly }]);
										info.scope.$broadcast('form-config-updated');
									}
								}],
							}
						],
						onChangeStep: function (info) {
							handleCreationType(info, dataItem);
							if (dataItem.currentSerivce && dataItem.currentSerivce.ValidationService) {
								dataItem.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model, info.model.currentItem.ConfigurationFk);
							}
						}
					};

					function handleCreationType(info, dataItem) {
						if (dataItem) {
							setProcurementService();
							procurementCommonCreateService.init('procurement.contract', dataItem).then(function () {
								addProcurementConfigurationLookup(dataItem);
								info.scope.$broadcast('form-config-updated');
							});
							if (dataItem.currentSerivce && dataItem.currentSerivce.ValidationService) {
								dataItem.currentSerivce.ValidationService.validateDialogConfigurationFk(info.model, info.model.currentItem.ConfigurationFk);
							}
						}
					}

					function addProcurementConfigurationLookup(dataItem) {
						let formConfig = procurementCommonCreateService.getFormConfigForDialog(dataItem);
						let model = 'procurementProcess.configurationFk';
						_.remove(step3Rows, { model: model });
						let prcConfig = _.find(formConfig.rows, { model: 'ConfigurationFk' });
						prcConfig.model = model;
						prcConfig.gid = 'baseGroup';
						prcConfig.visible = true;
						step3Rows.push(prcConfig);
					}

					platformWizardDialogService.translateWizardConfig(maintWizard);
					platformWizardDialogService.showDialog(maintWizard, dataItem).then(function (result) {

						if(result.success){
							let selectedMaints = resourceEquipmentMaintenanceDataService.getSelectedEntities();
							CreateRequestedForExternalMaint(selectedMaints, dataItem);
						}
						procurementContractHeaderFilterService.unRegisterFilters();
					});
				});


			function CreateRequestedForExternalMaint (maintList, dataItem){

				let code = dataItem.procurementProcess.code;

				const obj = {
					Code: code,
					JobFk: dataItem.processData.jobFk,
					ProjectFk: dataItem.processData.projectFk ? dataItem.processData.projectFk : 0,
					JobTypeFk: dataItem.processData.jobTypeFk ? dataItem.processData.jobTypeFk : 0,
					ConfigurationFk: dataItem.procurementProcess.configurationFk,
					BusinessPartnerFk: dataItem.procurementProcess.businessPartnerFk,
					MdcMaterialFk: dataItem.procurementProcess.materialFk,
					DateOrdered: dataItem.procurementProcess.dataOrdered,
					DateEffective: dataItem.procurementProcess.dateEffective,
					MaintenanceRecordIds: _.map(resourceEquipmentMaintenanceDataService.getSelectedEntities(), 'Id')
				};

				$http.post(globals.webApiBaseUrl + 'procurement/contract/wizard/createrequestforexternalmaintenance', obj).then(function (result) {
					if (result.data.length > 0) {
						var modalOptions = {
							headerTextKey: 'resource.equipment.createRequestForExternalMaintenanceWizard.createRequestForExternalMaintenance',
							bodyTextKey: result.data,
							showOkButton: true,
							showCancelButton: true,
							resizeable: true,
							height: '500px',
							iconClass: 'info'
						};

						platformModalService.showDialog(modalOptions);

					}
					else {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('resource.equipment.createRequestForExternalMaintenanceWizard.createRequestForExternalMaintenanceTitle');
					}
				});

			}
		};

		function showMessage(maintRec, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'resource.equipment.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!maintRec) {
				headerTextKey = 'resource.equipment.createRequestForExternalMaintenanceWizard.creationErrorNoMaintenanceRecordSelectedTitle';
				bodyTextKey = 'resource.equipment.createRequestForExternalMaintenanceWizard.creationErrorNoMaintenanceRecordSelected';
			} else {
				headerTextKey = 'resource.equipment.createRequestForExternalMaintenanceWizard.creationErrorNoMaintenanceRecordSelectedTitle';
				bodyTextKey = 'resource.equipment.createRequestForExternalMaintenanceWizard.creationError';
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}


		this.setMaintenanceToDue = function setMaintenanceToDue() {
			var companyId = platformContextService.getContext().clientId;
			$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId
			).then(function (response) {
				var modalCreateConfig = setModalCreateConfig();
				if (response && response.data) {
					modalCreateConfig.dataItem.divisionFk = response.data.EquipmentDivisionFk;
				}
				modalCreateConfig.handleOK = function handleOK(result) {
					var data = {
						Action: 5,
						Context: companyId,
						PlantDivision: result.data.divisionFk,
						PlantGroup: result.data.groupFk,
						PlantKind: result.data.kindFk,
						PlantType: result.data.typeFk,
						PlantComponentType: result.data.componentTypeFk
					};
					$http.post(globals.webApiBaseUrl + 'resource/equipment/plant/execute', data
					).then(function () {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
						if (resourceEquipmentPlantDataService.getSelected()) {
							resourceEquipmentMaintenanceDataService.load();
						}
					});
				};

				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				platformModalFormConfigService.showDialog(modalCreateConfig);
			});
		};

		/* ---------------------------------------------------------------------------------*/
		/***********************/
		this.CreateInitialAllocationForPlants = function CreateInitialAllocationForPlants() {
			let currentPlantItems = resourceEquipmentPlantDataService.getSelectedEntities();

			if(currentPlantItems.length === 0){
				showCreateAllocMessage('', false);
				return;
			}
			let gid = 'group';
			let translationNamespace = 'resource.equipment.createInitialAllocationForPlantsWizard.';
			const wot2plantStepUuid = 'bf1636523da944cca80442b04acd13c7';
			const allocStepUuid = '3bd4ee3fd63947e99a43d73ea4a7b1e0';

			let resourceEquipmentPlantUIStandardService = $injector.get('resourceEquipmentPlantUIStandardService');
			let plantGridLayout = _.cloneDeep(resourceEquipmentPlantUIStandardService.getStandardConfigForListView());

			/**
			 * Prepare data for the second step
			 */
			let gridLayout = _.cloneDeep($injector.get('moduleWot2PlantTypeUIStandardService').getStandardConfigForListView());

			let plantTypeFks = _.uniq(currentPlantItems.map(function (e) {
				return e.PlantTypeFk;
			}));

			let isLoading = true;
			let gridEntries = plantTypeFks.map(function (plantTypeFk, idx) {
				return {
					Id: idx,
					PlantTypeFk: plantTypeFk,
					WorkOperationTypeFk: null,
					PreWorkOperationTypeFk: null,
					IsBulk: null,
				};
			});

			let promises = gridEntries.map(function (entry) {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/planttype/instance', { Id: entry.PlantTypeFk })
					.then(function (response) {
						entry.IsBulk = response && response.data.IsBulk === true;
					})
					.catch(function (err) {
						console.error(err);
					});
			});

			Promise.all(promises).then(function () {
				isLoading = false;
			});
			/**/

			_.each(plantGridLayout.columns, function (column) {
				column.readonly = false;
				column.editor = null;
			});

			_.each(plantGridLayout.rows, function (row) {
				row.gid = gid;
			});

			let dataItem = {
				wizardData :{
					Selection:{
						performingJobCode: null,
						jobFk: null,
						allocatedFrom: null
					},
					Wot2Plant:{
						Wot2PlantList: []
					},
					Plants: {
						PlantList:currentPlantItems,
					}
				}
			};

			$http.get(globals.webApiBaseUrl + 'logistic/job/getvoidjob')
				.then(function (response) {
					if(response && response.data){
						dataItem.wizardData.Selection.performingJobCode = response.data.Code;
					}
					console.log(response.data);
				})
				.catch(error => {

					console.error(error);
				});

			let checkDisallowNextStep1 = function () {
				return !dataItem.wizardData.Selection.jobFk
					|| !dataItem.wizardData.Selection.allocatedFrom
					|| dataItem.wizardData.Wot2Plant.Wot2PlantList.some((e) => e.WorkOperationTypeFk === null || e.IsBulk === null);
			};

			let checkCanFinishStep2 = function() {
				let isBulkDict = dataItem.wizardData.Wot2Plant.Wot2PlantList.reduce(function (obj, e) {
					if (typeof obj[e.PlantTypeFk] !== 'undefined') {
						console.warn(`Overwriting PlantTypeFk "${e.PlantTypeFk}"`);
					}

					if (e.IsBulk !== null) {
						obj[e.PlantTypeFk] = e.IsBulk;
					}
					return obj;
				}, {});

				return dataItem.wizardData.Plants.PlantList.every(function (plant) {
					return !isBulkDict[plant.PlantTypeFk] === false || plant.Quantity !== undefined;
				});
			};


			function filterWot2PlantTypeGridStep() {
				dataItem.wizardData.Wot2Plant.Wot2PlantList.push(...gridEntries);

				let title = translationNamespace + 'createAllocStepList';
				let topDescription = translationNamespace + 'topDescription';
				let wotColumn = _.find(gridLayout.columns, { id: 'workoperationtypefk' });
				if (wotColumn) {
					wotColumn.required = true;
				}

				dataItem.wizardData.Wot2PlantListModel = {
					items: dataItem.wizardData.Wot2Plant.Wot2PlantList,
					selectedId: null,
					id: wot2plantStepUuid,
					selectionListConfig: {
						idProperty: 'Id',
						columns: gridLayout.columns,
						options: {
							readonly: false,
						}
					}
				};

				let gridStep = platformWizardDialogService.createListStep(title, topDescription, 'wizardData.Wot2PlantListModel', wot2plantStepUuid);
				gridStep.cssClass = '';
				gridStep.watches = [];
				gridStep.disallowNext = checkDisallowNextStep1();
				gridStep.disallowBack = false;
				gridStep.disallowCancel = false;
				gridStep.canFinish = true;
				return gridStep;
			}

			function createGridStep() {
				let title = translationNamespace + 'createAllocStepList';
				let topDescription = translationNamespace + 'topDescription';

				dataItem.wizardData.listModel = {
					items: dataItem.wizardData.Plants.PlantList,
					selectedId: null,
					stepId: allocStepUuid,
					selectionListConfig: {
						selectedIdProperty: 'SelectedId',
						idProperty: 'Id',
						columns: plantGridLayout.columns,
						multiSelect: false
					}
				};
				let listStep = platformWizardDialogService.createListStep($translate.instant(title), $translate.instant(topDescription), 'wizardData.listModel', allocStepUuid);
				listStep.disallowNext = true;
				listStep.canFinish = checkCanFinishStep2();

				listStep.cssClass = '';
				listStep.height = '500px';

				if (typeof listStep.watches === 'undefined') {
					listStep.watches = [];
				}
				listStep.watches.push({
					expression: 'wizardData.Plants.PlantList',
					fn: function (info) {
						info.wizard.steps[1].canFinish = checkCanFinishStep2();
					},
					deep: true,
				});

				return listStep;
			}

			let quantityColumn = {
				editor: 'integer',
				editorOptions: {},
				field: 'Quantity',
				formatter: 'quantity',
				fixed: true,
				width: 120,
				formatterOptions: {},
				id: 'PlantsQuantity-column',
				name: translationNamespace + 'quantity',
				name$tr$: translationNamespace + 'quantity'
			};
			plantGridLayout.columns.unshift(quantityColumn);

			let wotColumn = _.cloneDeep(_.find(gridLayout.columns, { id: 'workoperationtypefk' }));
			let preWotColumn = _.cloneDeep(wotColumn);

			wotColumn.id = 'wot-column';

			preWotColumn.id = 'prewot-column';
			preWotColumn.field = 'WorkOperationTypeFk';
			preWotColumn.required = false;
			preWotColumn.name = 'Precalculated Work operation type';
			preWotColumn.name$tr$ = 'Precalculated Work operation type';

			plantGridLayout.columns.unshift(preWotColumn);
			plantGridLayout.columns.unshift(wotColumn);

			let step1Row = [
				{
					gid: 'baseGroup',
					rid: 'Selection',
					label: 'Performing Job',
					label$tr$: 'resource.reservation.performingJobFk',
					model: 'wizardData.Selection.performingJobCode',
					type: 'code',
					required: false,
					readonly: true,
					sortOrder: 0
				},
				{
					gid: 'baseGroup',
					rid: 'Selection',
					label: ' Receiving Job',
					label$tr$: 'resource.requisition.entityJob',
					model: 'wizardData.Selection.jobFk',
					type: 'directive',
					required: true,
					directive: 'logistic-job-paging-lookup',
					options: {
						showClearButton: true
					},
					sortOrder: 1
				},
				{
					gid: 'baseGroup',
					rid: 'wizardData.Selection.allocatedFrom',
					label: 'Allocated From',
					label$tr$: 'logistic.job.allocatedFrom',
					type: 'dateutc',
					model: 'wizardData.Selection.allocatedFrom',
					readonly: false,
					required: true,
					sortOrder: 3,
				}
			];

			let step2 = filterWot2PlantTypeGridStep();

			let modalCreateConfig = {
				title: $translate.instant('resource.equipment.createInitialAllocationForPlantsWizard.createAllocTitle'),
				dataItem: dataItem,
				steps: [
					{
						id: 'Selection',
						title$tr$: 'resource.equipment.createInitialAllocationForPlantsWizard.createAllocSelection',
						form: {
							fid: 'resource.equipment.selection',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'baseGroup',
								attributes: ['Selection'],
								isOpen: true,
								visible: true,
								sortOrder: 1
							}, {
								gid: 'default',
								attributes: ['Wot2PlantListModel'],
								isOpen: true,
								visible: true,
								sortOrder: 2
							}],
							rows: [
								...step1Row,
								step2.form.rows[0],
							]
						},
						disallowBack: false,
						disallowNext: true, // isLoading
						canFinish: false,
						watches: [
							{
								expression: 'wizardData.Selection',
								fn: function (info) {
									info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
								},
								deep: true,
							},
							{
								expression: 'wizardData.Wot2Plant.Wot2PlantList',
								fn: function (info) {
									info.wizard.steps[0].disallowNext = checkDisallowNextStep1();
								},
								deep: true,
							},
						]
					},
					createGridStep()
				],

				onChangeStep: function (info) {
					for (let e of dataItem.wizardData.Plants.PlantList) {
						let wotEntry = _.find(dataItem.wizardData.Wot2Plant.Wot2PlantList, { PlantTypeFk: e.PlantTypeFk });
						if (wotEntry) {
							e.WorkOperationTypeFk = wotEntry.WorkOperationTypeFk;

							// Helper function to update the readonly value of the given field
							let setReadonlyIfNotExists = function(fieldName, readonlyValue) {
								let field = _.find(e.__rt$data.readonly, { 'field': fieldName });
								if (field && field.readonly === !readonlyValue) {
									field.readonly = readonlyValue;
								} else if (e.__rt$data.readonly) {
									e.__rt$data.readonly.push({'field': fieldName, 'readonly': readonlyValue});
								}
							};

							setReadonlyIfNotExists('WorkOperationTypeFk', true);

							if (wotEntry.IsBulk) {
								e.PreWOTFk = wotEntry.WorkOperationTypeFk;
								setReadonlyIfNotExists('Quantity', false);
							} else {
								e.Quantity = 1;
								setReadonlyIfNotExists('Quantity', true);
							}
						}
					}
					info.wizard.steps[1].canFinish = checkCanFinishStep2();
				}
			};

			platformWizardDialogService.translateWizardConfig(modalCreateConfig);

			platformWizardDialogService.showDialog(modalCreateConfig, dataItem).then(function (result){
				if (result.success) {
					createAllocationForPlants(dataItem.wizardData);
				}
			});
		};



		function createAllocationForPlants(wizardData) {

			let payload = {
				Entities: wizardData.Plants.PlantList.map(function (e) {
					return {
						PlantId: e.Id,
						WotId: e.WorkOperationTypeFk,
						Quantity: e.Quantity,
					};
				}),
				JobId: wizardData.Selection.jobFk,
				AllocatedFrom : wizardData.Selection.allocatedFrom,
			};

			return $http.post(globals.webApiBaseUrl + 'logistic/job/plantallocation/createinitialallocationforplants', payload).then(function(result){
				if (result.config) {
					let modalOptions = {
						headerTextKey: 'resource.equipment.createInitialAllocationForPlantsWizard.createAllocTitle',
						bodyTextKey: $translate.instant('resource.equipment.createInitialAllocationForPlantsWizard.doneSuccess'),
						showOkButton: true,
						showCancelButton: true,
						resizeable: true,
						height: '500px',
						iconClass: 'info'
					};

					platformModalService.showDialog(modalOptions);

				} else {
					//	platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
				}
			});
		}

		function showCreateAllocMessage(plant, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'resource.equipment.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!plant) {
				headerTextKey = 'resource.equipment.creationErrorNoPlantSelectedTitle';
				bodyTextKey = 'resource.equipment.creationErrorNoPlantSelected';
			} else {
				headerTextKey = 'resource.equipment.creationErrorNoPlantSelectedTitle';
				bodyTextKey = 'resource.equipment.creationError';
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}


		this.createJobForMaintenanceToDue = function createJobForMaintenanceToDue() {
			var companyId = platformContextService.getContext().clientId;
			$http.get(globals.webApiBaseUrl + 'basics/company/getCompanyById?companyId=' + companyId
			).then(function (response) {
				var modalCreateConfig = setModalCreateConfig();
				var divisionFk = null;
				if (response && response.data) {
					divisionFk = response.data.EquipmentDivisionFk;
				}
				platformTranslateService.translateObject(servicesSchedulerUIFrequencyValues, ['description']);
				modalCreateConfig.title = $translate.instant('resource.equipment.createJobToSetMaintenanceToDue');
				modalCreateConfig.dataItem = {
					divisionFk: divisionFk,
					groupFk: null,
					kindFk: null,
					typeFk: null,
					componentTypeFk: null,
					jobRepeatCount: null,
					jobRepeatUnit: null,
					startTime: moment()
				};
				modalCreateConfig.formConfiguration.rows.push({
					gid: 'baseGroup',
					rid: 'repeatUnit',
					label: 'Repeat Unit',
					label$tr$: 'services.schedulerui.columns.repeatunit',
					type: 'select',
					model: 'jobRepeatUnit',
					options: {
						displayMember: 'description',
						valueMember: 'Id',
						items: 'servicesSchedulerUIFrequencyValues'
					},
					sortOrder: 6
				});
				modalCreateConfig.formConfiguration.rows.push({
					gid: 'baseGroup',
					rid: 'repeatCount',
					label: 'Repeat Count',
					label$tr$: 'services.schedulerui.columns.repeatcount',
					type: 'integer',
					model: 'jobRepeatCount',
					sortOrder: 7
				});
				modalCreateConfig.formConfiguration.rows.push({
					gid: 'baseGroup',
					rid: 'startTime',
					label: 'Start Time',
					label$tr$: 'services.schedulerui.columns.starttime',
					type: 'datetime',
					model: 'startTime',
					sortOrder: 8
				});

				modalCreateConfig.handleOK = function handleOK(result) {
					var data = {
						Action: 6,
						Context: platformContextService.getContext().clientId,
						PlantDivision: result.data.divisionFk,
						PlantGroup: result.data.groupFk,
						PlantKind: result.data.kindFk,
						PlantType: result.data.typeFk,
						PlantComponentType: result.data.componentTypeFk,
						JobRepeatCount: result.data.jobRepeatCount,
						JobRepeatUnit: result.data.jobRepeatUnit,
						StartDate: result.data.startTime.utc()
					};
					$http.post(globals.webApiBaseUrl + 'resource/equipment/plant/execute', data
					).then(function () {
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(modalCreateConfig.title);
						if (resourceEquipmentMaintenanceDataService.hasSelected) {
							resourceEquipmentMaintenanceDataService.load();
						}
					});
				};
				platformTranslateService.translateFormConfig(modalCreateConfig.formConfiguration);

				platformModalFormConfigService.showDialog(modalCreateConfig);
			});
		};
		this.adjustQuantities = function adjustQuantities() {
			var selected = resourceEquipmentPlantLocationDataService.getSelected();
			if (!selected) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('logistic.job.adjustQuantities');
			} else if (selected && selected.Quantity >= 0) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection('logistic.job.adjustQuantities', $translate.instant('logistic.job.noNegativeQuantity'));
			} else {
				// if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'resource.equipment.adjustQuantities')) {
				resourceEquipmentAdjustAllocationDialogService.showLookup();
			}
		};
	}
})(angular);
