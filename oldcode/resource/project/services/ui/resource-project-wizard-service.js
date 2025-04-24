(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.project';
	angular.module(moduleName).service('resourceProjectWizardService', ResourceProjectWizardService);

	ResourceProjectWizardService.$inject = [
		'_', 'moment', '$http', 'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService', 'resourceProjectDataService',
		'resourceProjectPlanningBoardReservationService', 'basicsLookupdataConfigGenerator', 'platformModalService', '$translate',
		'platformWizardDialogService', 'platformTranslateService', 'resourceProjectPlanningBoardResourceService',
		'resourceProjectPlanningBoardRequisitionService', 'resourceProjectEstimateHeaderDataService', 'platformModalFormConfigService',
		'$injector', 'resourceProjectExePlannerItemDataService', 'basicsLookupdataSimpleLookupService', 'resourceProjectProjectRequisitionsDataService',
		'resourceProjectRequisitionTimeslotDataService'
	];

	function ResourceProjectWizardService(
		_, moment, $http, platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService, resourceProjectDataService,
		resourceProjectPlanningBoardReservationService, basicsLookupdataConfigGenerator, platformModalService, $translate,
		platformWizardDialogService, platformTranslateService, resourceProjectPlanningBoardResourceService,
		resourceProjectPlanningBoardRequisitionService, resourceProjectEstimateHeaderDataService,platformModalFormConfigService,
		$injector, resourceProjectExePlannerItemDataService, basicsLookupdataSimpleLookupService, resourceProjectProjectRequisitionsDataService,
		resourceProjectRequisitionTimeslotDataService) {

		function changeActionItemStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance({
				refreshMainService: false,
				mainService: resourceProjectDataService,
				dataService: resourceProjectExePlannerItemDataService,
				statusField: 'ActionItemStatusFk',
				codeField: 'Code',
				descField: 'Description',
				projectField: '',
				statusDisplayField: 'Description',
				title: 'basics.customize.logisticsactionitemstatus',
				statusName: 'actionitemstatus',
				statusProvider: function () {
					return basicsLookupdataSimpleLookupService.getList({
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.logisticsactionitemstatus',
						filter: {
							customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
						}
					}).then(function (respond) {
						return _.filter(respond, function (item) {
							return item.isLive === true;
						});
					});
				},
				updateUrl: 'resource/project/execplanneritems/changestatus',
				id: 1
			});
		}

		this.changeActionItemStatus = changeActionItemStatus().fn;

		var changeReservationStatus = function changeReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceProjectDataService,
					dataService: resourceProjectPlanningBoardReservationService,
					statusField: 'ReservationStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.reservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					id: 1,
					supportMultiChange: true
				}
			);
		};
		this.changeReservationStatus = changeReservationStatus().fn;

		let changeRequisitionStatus = function changeRequisitionStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: resourceProjectDataService,
					dataService: resourceProjectPlanningBoardRequisitionService,
					statusField: 'RequisitionStatusFk',
					descField: 'Description',
					projectField: '',
					title: 'resource.requisition.changeRequisitionStatusWizard.title',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					id: 1,
					supportMultiChange: true
				}
			);
		};
		this.changeRequisitionStatus = changeRequisitionStatus().fn;

		this.createReservation = function createReservation() {
			let selectedProject = resourceProjectDataService.getSelected();
			if (!selectedProject) {
				showMessage('', false);
				return;
			}
			let wizardData = {
				dataItem: {
					RequisitionFk: null,
					ResourceFk: null,
					UomFk: null,
					Description: null,
					ReservedFrom: null,
					ReservedTo: null
				}
			};

			function checkCanFinish () {
				return wizardData.dataItem.RequisitionFk && wizardData.dataItem.ResourceFk && wizardData.dataItem.UomFk && wizardData.dataItem.ReservedFrom && wizardData.dataItem.ReservedTo;
			}

			let actionsWizard = {
				id: 'resProjectWizard',
				title$tr$: 'resource.project.projectWizard.titel',
				steps: [
					{
						title$tr$: 'resource.project.projectWizard.titel',
						id: 'generateReservationStep1',
						form: {
							fid: 'resource.project.createReservation',
							version: '1.0.0',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [
								{
									gid: 'baseGroup'
								}
							],
							rows: [
								{
									gid: 'baseGroup',
									rid: 'requisition',
									label: 'Requisition',
									label$tr$: 'resource.reservation.RequisitionFk',
									type: 'directive',
									directive: 'resource-requisition-lookup-dialog-new',
									options: {
										lookupDirective: 'resource-requisition-lookup-dialog-new',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											defaultFilter: {
												projectFk: selectedProject.Id,
												resourceFk: 'ResourceFk'
											}
										}
									},
									model: 'dataItem.RequisitionFk',
									required: true,
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'resource',
									label: 'Resource',
									label$tr$: 'resource.reservation.ResourceFk',
									type: 'directive',
									directive: 'resource-master-resource-lookup-dialog-new2',
									options: {
										lookupDirective: 'resource-master-resource-lookup-dialog-new2',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true,
											defaultFilter: {
												projectFk: selectedProject.Id,
											}
										}
									},
									model: 'dataItem.ResourceFk',
									required: true,
									sortOrder: 2
								},
								/*
								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'resourceResourceFilterBySkillLookupDataService',
									filter: function () {
										return {
											ProjectFk: selectedProject.Id,
											RequisitionFk: wizardData.dataItem.RequisitionFk,
										};
									},
									showClearButton: true,
								},
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Resource',
									label$tr$: 'resource.reservation.entityResourceFk',
									type: 'integer',
									model: 'dataItem.ResourceFk',
									required: true,
									sortOrder: 2
								}),

								 */

								basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'basicsUnitLookupDataService',
									showClearButton: true
								},
								{
									gid: 'baseGroup',
									rid: 'group',
									label: 'Uom',
									label$tr$: 'resource.reservation.entityUomFk',
									type: 'integer',
									model: 'dataItem.UomFk',
									required: true,
									sortOrder: 3
								}),
								{
									gid: 'baseGroup',
									rid: 'description',
									label: 'Description',
									label$tr$: 'resource.requisition.description',
									type: 'description',
									model: 'dataItem.Description',
									required: false,
									sortOrder: 4
								},
								{
									gid: 'baseGroup',
									rid: 'reservedFrom',
									label: 'Reserved From',
									label$tr$: 'resource.requisition.ReservedFrom',
									type: 'datetimeutc',
									model: 'dataItem.ReservedFrom',
									required: true,
									sortOrder: 5
								},
								{
									gid: 'baseGroup',
									rid: 'reservedTo',
									label: 'Reserved To',
									label$tr$: 'resource.requisition.ReservedTo',
									type: 'datetimeutc',
									model: 'dataItem.ReservedTo',
									required: true,
									sortOrder: 6
								}
							]
						},
						disallowBack: true,
						disallowNext: true,
						canFinish: checkCanFinish(),
						watches: [
							{
								expression: 'dataItem.RequisitionFk',
								fn: function () {
									if (!wizardData.dataItem.RequisitionFk) {
										return;
									}

									$http.get(globals.webApiBaseUrl + 'resource/requisition/getById?Id=' + wizardData.dataItem.RequisitionFk)
										.then(function (response) {
											if (response && response.data) {
												wizardData.dataItem.Description = response.data.Description;
												wizardData.dataItem.ReservedFrom = response.data.RequestedFrom;
												wizardData.dataItem.ReservedTo = response.data.RequestedTo;

												// if (response.data.ResourceFk) {
												// 	wizardData.dataItem.ResourceFk = response.data.ResourceFk;
												// } else {
												// 	wizardData.dataItem.ResourceFk = null;
												// }

												if (response.data.UomFk) {
													wizardData.dataItem.UomFk = response.data.UomFk;
												} else {
													wizardData.dataItem.UomFk = null;
												}
											}
										});
								}
							},
							{
								expression: 'dataItem',
								fn: function (info) {
									info.wizard.steps[0].canFinish = checkCanFinish();
									info.scope.$broadcast('form-config-updated');
								},
								deep: true
							}
						]
					}
				]
			};

			platformWizardDialogService.translateWizardConfig(actionsWizard);
			platformWizardDialogService.showDialog(actionsWizard, wizardData).then(function (result) {
				if (result.success) {
					const data = {
						ProjectIds: _.map(resourceProjectDataService.getSelectedEntities(), 'Id'),
						RequisitionId: result.data.dataItem.RequisitionFk,
						ResourceId: result.data.dataItem.ResourceFk,
						UomId: result.data.dataItem.UomFk,
						Description: result.data.dataItem.Description,
						ReservedFrom: result.data.dataItem.ReservedFrom,
						ReservedTo: result.data.dataItem.ReservedTo
					};

					$http.post(globals.webApiBaseUrl + 'resource/reservation/createdreservationfromproject', data).then(function (response) {
						if (response.data.length > 0) {
							let modalOptions = {
								headerTextKey: 'resource.project.projectWizard.titel',
								bodyTextKey: response.data,
								showOkButton: true,
								showCancelButton: true,
								resizeable: true,
								height: '500px',
								iconClass: 'info'
							};

							platformModalService.showDialog(modalOptions);

						}
						else {
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(actionsWizard.title$tr$);
						}
						resourceProjectDataService.refreshSelectedEntities();
					});
				}
			});
		};

		this.genResRequisitionFromEst = function genResRequisitionFromEst() {
			let selectedEstimateHeader = resourceProjectEstimateHeaderDataService.getSelected();
			let selectedProject = resourceProjectDataService.getSelected();
			let genResReqFromEstData = {};
			if(selectedEstimateHeader !== null){
				genResReqFromEstData["wizardData"]  = {
					filter: {
						EstimateHeaderFk: selectedEstimateHeader.Id,
						EstimateHeaderCode: selectedEstimateHeader.Code,
						ProjectFk: selectedProject.Id
					}
				};
					 let wzConfig = {
						 title: 'Generate Resource Requisition from Estimate',
						 title$tr$: 'resource.project.genRequisitionWiz.title',
						 width: '80%',
						 height: '500px',
						 steps: [
							 {
								 id: 'filter',
								 title: 'Filter',
								 title$tr$: 'resource.project.genRequisitionWiz.filterSection.Title',
								 form: {
									 fid: 'wzExample.nameForm',
									 version: '1.0.0',
									 showGrouping: true,
									 skipPermissionsCheck: true,
									 groups: [
										 {
											 gid: 'filter',
											 header: 'Selections',
											 header$tr$: 'resource.project.genRequisitionWiz.filterSection.filterGroup',
											 isOpen: true
										 }],
									 rows: [
										 basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
											 dataServiceName: 'projectLookupDataService',
											 cacheEnable: true,
											 additionalColumns: false,
											 showClearButton: true
										 }, {
											 gid: 'filter',
											 rid: 'project',
											 label: 'Project',
											 label$tr$: 'resource.project.genRequisitionWiz.filterSection.entityProject',
											 type: 'integer',
											 model: 'wizardData.filter.ProjectFk',
											 readonly: true,
											 required: false,
											 sortOrder: 1
										 }),
										 // basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
											//  dataServiceName: 'estimateMainHeaderLookupDataService',
											//  cacheEnable: true,
											//  additionalColumns: false,
											//  showClearButton: true
										 // }, {
											//  gid: 'filter',
											//  rid: 'estimateHeader',
											//  label: 'Estimate Header',
											//  label$tr$: 'resource.project.genRequisitionWiz.filterSection.entityEstimateHeader',
											//  type: 'integer',
											//  model: 'wizardData.filter.EstimateHeaderFk',
											//  readonly: true,
											//  required: false,
											//  sortOrder: 2
										 // })
										 {
											 gid: 'filter',
											 rid: 'estimateHeader',
											 label: 'Estimate Header',
											 label$tr$: 'resource.project.genRequisitionWiz.filterSection.entityEstimateHeader',
											 type: 'code',
											 model: 'wizardData.filter.EstimateHeaderCode',
											 readonly: true,
											 required: false,
											 sortOrder: 2
										 }
									 ]
								 }
							 }, {
								 id: 'proccessing',
								 title: 'Generating Requisitions...',
								 title$tr$: 'resource.project.genRequisitionWiz.proccessing.title',
								 disallowNext: true,
								 disallowBack: true,
								 prepareStep: function (info) {
									 $http.post(globals.webApiBaseUrl + 'resource/requisition/creation/createrequisitionsbyestimate', info.model.wizardData.filter
									 ).then(function (result) {
										 var completition = _.find(info.wizard.steps, function (step) {
											 return step.id === 'completition';
										 });
										 completition.message = $translate.instant('resource.project.genRequisitionWiz.completition.message').replace('{0}', result.data);
										 info.step.disallowNext = false;
										 info.commands.goToNext();
									 });
								 }
							 },
							 {
								 id: 'completition',
								 title: 'Completion',
								 title$tr$: 'resource.project.genRequisitionWiz.completition.message',
								 message: 'Done!',
								 disallowBack: true,
								 canFinish: true
							 }
						 ]
					 };
					 platformWizardDialogService.showDialog(wzConfig, genResReqFromEstData).then(function (result) {
						 if (result.success) {
							 // console.log(result.data.firstName + ' ' + result.data.middleName + ' ' + result.data.lastName + ', ' + result.data.age);
						 }
					 });
			}
			else{
					 showErrorMessage("resource.project.genRequisitionWiz.title","No Estimate Header selected")
			}
		};

		function showMessage(prj, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'resource.project.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!prj) {
				headerTextKey = 'resource.project.projectWizard.creationErrorNoProjectSelectedTitle';
				bodyTextKey = 'resource.project.projectWizard.creationErrorNoProjectSelected';
			} else {
				headerTextKey = 'resource.project.projectWizard.creationErrorNoProjectSelectedTitle';
				bodyTextKey = 'resource.project.projectWizard.creationErrorNoProjectSelected';
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}
		 function showErrorMessage(titleKey, messageKey) {
			 let iconClass = 'ico-error'; // error
			 platformModalService.showMsgBox(messageKey, titleKey, iconClass);
		 }

///////////////////////////Create Execution Planner Item wizard ui logic part/////////////////////////////////////////////////
		this.createExecutionPlannerItem = function createExecutionPlannerItem(){

			const translationBasePath = 'resource.project.createExecPlannerItemWizard.';
			let selectedProject = resourceProjectDataService.getSelected();
			if (!selectedProject) {
				showMessage('', false);
				return;
			}
			let dataItem = {
					ProjectFk: selectedProject.Id,
					ActionItemTypeFk: null,
					UpdateExecutionPlannerItem: false,
					ActionItemTemplateFk: null
			};

			let step1Rows = [
				{
					gid: 'baseGroup',
					rid: 'UpdateExecutionPlannerItem',
					label: 'Update Existing Item',
					label$tr$: 'resource.project.createExecPlannerItemWizard.updateexecutionplanneritem',
					type: 'boolean',
					model: 'UpdateExecutionPlannerItem',
					width: 80,
					sortOrder: 0,
				},
				basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.logisticsactionitemtype', '',
					{
						gid: 'baseGroup',
						rid: 'ActionItemTypeFk',
						label: 'Action Item Type',
						label$tr$: 'basics.customize.logisticsactionitemtype',
						type: 'integer',
						model: 'ActionItemTypeFk',
						sortOrder: 1,
					},
					false,
					{
						showClearButton: true,
					}
				),
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'logisticActionItemTemplateLookupDataService',
					enableCache: true,
					showClearButton: true,
					filter: function ()  {
						return {
							Pkey1: 1
						}
					}
				},{
					gid: 'baseGroup',
					rid: 'ActionItemTemplateFk',
					label: 'Action Item Template',
					label$tr$: 'logistic.action.entityActionItemTemplate',
					type: 'integer',
					model: 'ActionItemTemplateFk',
					readonly: true,
					sortOrder: 2,
				}),
			];

			let stepOne = {
				id: 'createExecPlannerItemStep1',
				title: $translate.instant(translationBasePath + 'wizardDialogTitle'),
				form: {
					fid: 'resource.project.createExecPlannerItemStep1',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'baseGroup',
						attributes: ['UpdateExecutionPlannerItem']
					}],
					rows: step1Rows
				},
				disallowBack: true,
				disallowNext: true,
				canFinish: false,
				watches: [{
					expression: 'UpdateExecutionPlannerItem',
					fn: function (info) {
						console.log("Debugging fn: function", info);

						let formRows = info.wizard.steps[0].form.rows;
						let actionItemTemplate = _.find(formRows, { rid: 'ActionItemTemplateFk' });
						let actionItemType = _.find(formRows, { rid: 'ActionItemTypeFk' });

						if (actionItemTemplate && actionItemType) {
							let isChecked = info.newValue;

							actionItemTemplate.readonly = !isChecked;
							actionItemType.readonly = isChecked;

						}
						info.scope.$broadcast('form-config-updated');
					}
				}, {
					expression: 'ActionItemTypeFk',
					fn: async function (info) {
						updateFinishButtonState(info);
					}
				},{
					expression: 'ActionItemTemplateFk',
					fn: async function (info) {
						updateFinishButtonState(info);
					}
				}]
			};

			// updateNextButtonState
			function updateFinishButtonState(info) {
				if (info?.newValue) {
					info.wizard.steps[0].canFinish = true;
				}
				else {
					info.wizard.steps[0].canFinish = false;
				}

				info.scope.$broadcast('form-config-updated');
			}

			// wizard  config
			let actionsWizard = {
				id: 'actionsWizard',
				title: $translate.instant(translationBasePath + 'wizardDialogTitle'),
				steps: [stepOne]
			};

			platformWizardDialogService.translateWizardConfig(actionsWizard);
			platformWizardDialogService.showDialog(actionsWizard, dataItem).then(async function (result){
				if(result.success){

					let dataItem = {
						ActionItemTypeFk: result.data.ActionItemTypeFk || null,
						ActionItemTemplateFk: result.data.ActionItemTemplateFk || null,
						UpdateExecutionPlannerItem: result.data.UpdateExecutionPlannerItem,
						ProjectFk: selectedProject.Id,
					};
					let response = await $http.post(globals.webApiBaseUrl + 'resource/project/execplanneritems/createupdateexecplanneritem', dataItem);

					if (!response.data || response.data.length === 0) {
						showErrorMessage("resource.project.createExecPlannerItemWizard.wizardDialogTitle","Failed to create execution planner item.");
					} else {
						showSuccessDialog(response.data);
					}
				}
			});

			function showSuccessDialog(successMessage) {
				const messages = successMessage.split(/<br\/?>|\n/).filter(msg => msg.trim() !== "");
				const formattedMessage = `<ul>${messages.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
				let modalOptions = {
					headerText$tr$: 'resource.project.createExecPlannerItemWizard.wizardDialogTitle',
					bodyTemplate: formattedMessage,
					showOkButton: true,
					showCancelButton: false,
					resizeable: true
				};

				platformDialogService.showDialog(modalOptions);
			}
		}

		function provideAssignTimeslotWizardModalOptions(titleKey, wizardData) {
			return {
				title: $translate.instant(titleKey),
				dataItem: wizardData,
				formConfiguration: {
					fid: 'resource.project.assignTimeslot',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['Timeslot']
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'resourceProjectTimeslotLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: false,
							filter: function(item) { return item.ProjectId; },
						},	{
							gid: 'baseGroup',
							rid: 'Timeslot',
							label: 'Timeslot',
							label$tr$: 'resource.project.timeslot',
							type: 'integer',
							model: 'TimeslotId',
							required: true,
							sortOrder: 1
						})
					]
				},
				handleOK: function handleOK(result) {
					if (result.ok === true) {
						let action = {
							Action: 1,
							Project: null,
							Requisitions: result.data.Requisitions,
							Timeslots: [resourceProjectRequisitionTimeslotDataService.getItemById(result.data.TimeslotId)],
							UpdateReason: null
						};
						$http.post(globals.webApiBaseUrl + 'resource/project/action', action
						).then(function (response) {

						});
					}
				},
				dialogOptions: {
					disableOkButton: function () {
						return _.isNil(wizardData.TimeslotId);
					}
				}
			};
		}

		this.assignTimeslotToRequisition = function assignTimeslotToRequisition() {
			const titleKey = 'resource.project.assignTimeslotWizard.title';
			let requisitions = resourceProjectProjectRequisitionsDataService.getSelectedEntities();
			if(!_.isArray(requisitions) || requisitions.length === 0) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection(titleKey, $translate.instant('resource.project.assignTimeslotWizard.errNoRequisition'));
				return;
			}

			const timeslot = resourceProjectRequisitionTimeslotDataService.getSelected();

			const data = {
				TimeslotId: !_.isNil(timeslot) ? timeslot.Id : null,
				Requisitions: requisitions,
				ProjectId: requisitions[0].ProjectFk
			};

			const modalOptions = provideAssignTimeslotWizardModalOptions(titleKey, data);
			platformTranslateService.translateFormConfig(modalOptions.formConfiguration);
			platformModalFormConfigService.showDialog(modalOptions);
		};

		function provideUpdateTimeslotWizardModalOptions(titleKey, wizardData) {
			return {
				title: $translate.instant(titleKey),
				dataItem: wizardData,
				formConfiguration: {
					fid: 'resource.project.updateTimeslot',
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['AllTimeslots', 'Timeslot', 'UpdateReason']
						}
					],
					rows: [
						{
							gid: 'baseGroup',
							rid: 'NewStartDate',
							label: 'New Start Date',
							label$tr$: 'resource.projects.updateTimeslot.newStartDate',
							type: 'datetimeutc',
							model: 'NewStartDate',
							sortOrder: 1,
						}, {
							gid: 'baseGroup',
							rid: 'AllTimeslots',
							label: 'Update All Timeslots',
							label$tr$: 'resource.projects.updateTimeslot.allTimeslots',
							type: 'boolean',
							model: 'AllTimeslots',
							sortOrder: 2,
						},
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'resourceProjectTimeslotLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: false,
							filter: function(item) { return item.ProjectId; },
						},	{
							gid: 'baseGroup',
							rid: 'Timeslot',
							label: 'Timeslot',
							label$tr$: 'resource.project.timeslot',
							type: 'integer',
							model: 'TimeslotId',
							required: true,
							sortOrder: 3
						}),
						basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcetimeslotupdatereason', '',
							{
								gid: 'baseGroup',
								rid: 'UpdateReason',
								label: 'Update Reason',
								label$tr$: 'basics.customize.resourcetimeslotupdatereason',
								type: 'integer',
								model: 'UpdateReasonId',
								sortOrder: 4,
							},
							false,
							{
								showClearButton: false,
							}
						)
					]
				},
				handleOK: function handleOK(result) {
					if (result.ok === true) {
						let action = {
							Action: 2,
							NewStartDate: result.data.NewStartDate,
							Project: result.data.ProjectId,
							Timeslots: [],
							Requisitions: [],
							UpdateReason: result.data.UpdateReasonId
						};
						if(!result.data.AllTimeslots && !_.isNil(wizardData.TimeslotId)) {
							action.Timeslots.push(resourceProjectRequisitionTimeslotDataService.getItemById(result.data.TimeslotId));
						}
						$http.post(globals.webApiBaseUrl + 'resource/project/action', action
						).then(function (response) {

						});
					}
				},
				dialogOptions: {
					disableOkButton: function () {
						return (!wizardData.AllTimeslots || _.isNil(wizardData.TimeslotId)) && _.isNil(wizardData.UpdateReasonId);
					}
				}
			};
		}


		this.updateTimeslotToRequisition = function updateTimeslotToRequisition() {
			const titleKey = 'resource.project.updateTimeslotRequisitionsWizard.title';
			const project = resourceProjectDataService.getSelected();
			if(_.isNil(project)) {
				platformSidebarWizardCommonTasksService.showErrorNoSelection(titleKey, $translate.instant('resource.project.updateTimeslotRequisitionsWizard.errNoProject'));
				return;
			}

			const data = {
				AllTimeslots: false,
				NewStartDate: moment.utc(Date.now()),
				ProjectId: project.Id,
				TimeslotId: null,
				Requisitions: [],
				UpdateReasonId: null
			};

			const modalOptions = provideUpdateTimeslotWizardModalOptions(titleKey, data);
			platformTranslateService.translateFormConfig(modalOptions.formConfiguration);
			platformModalFormConfigService.showDialog(modalOptions);
		};
	}
})(angular);
