/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:formContainerStandardConfigService
	 * @description
	 * Creates a form container standard config from dto and high level description
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('project.main').service('projectMainSidebarWizardService', ProjectMainSidebarWizardService);

	ProjectMainSidebarWizardService.$inject = ['$http', '$injector', '_', '$q', 'moment', 'platformSidebarWizardConfigService', 'platformModalService',
		'projectMainService', '$translate', 'platformModalFormConfigService', 'platformGridAPI',
		'platformModalGridConfigService', 'platformTranslateService', 'platformSidebarWizardCommonTasksService',
		'basicsCommonChangeStatusService', 'basicsLookupdataSimpleLookupService',
		'modelProjectModelFileDataService', 'constructionSystemProjectInstanceHeaderService', 'modelProjectModelDataService',
		'estimateProjectService', 'platformRuntimeDataService', 'basicsCharacteristicBulkEditorService',
		'platformWizardDialogService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		'documentProjectDocumentsStatusChangeService', 'schedulingScheduleRescheduleService',
		'schedulingScheduleEditService', 'projectMainCurrencyRateDataService', 'projectMainUpdateMaterialPriceMainService',
		'projectMainItwoproject2Bim360DialogService', '$timeout',
		'projectMainAddressTcoGeoLocationService', 'globals', 'basicsCommonAddressGeoLocationConvertService','platformDialogService',
		'projectMainConstantValues', 'projectMainPhaseSelectionDataService', 'projectMainCopyEntityService', 'projectMainCreationInitialDialogService', 'projectMainCharacteristicService',
		'basicsCostGroupCatalogDataService', 'basicsCostGroupDataService'];

	function ProjectMainSidebarWizardService($http, $injector, _, $q, moment, platformSidebarWizardConfigService, platformModalService,
		projectMainService, $translate, platformModalFormConfigService, platformGridAPI,
		platformModalGridConfigService, platformTranslateService,
		platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService, basicsLookupdataSimpleLookupService,
		modelProjectModelFileDataService, constructionSystemProjectInstanceHeaderService, modelProjectModelDataService,
		estimateProjectService, platformRuntimeDataService, basicsCharacteristicBulkEditorService,
		platformWizardDialogService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService,
		documentProjectDocumentsStatusChangeService, schedulingScheduleRescheduleService,
		schedulingScheduleEditService, projectMainCurrencyRateDataService, projectMainUpdateMaterialPriceMainService,
		projectMainItwoproject2Bim360DialogService, $timeout,
		projectMainAddressTcoGeoLocationService, globals, basicsCommonAddressGeoLocationConvertService, platformDialogService,
		projectMainConstantValues, projectMainPhaseSelectionDataService, projectMainCopyEntityService, projectMainCreationInitialDialogService, projectMainCharacteristicService,
		basicsCostGroupCatalogDataService, basicsCostGroupDataService) {

		let self = this;

		this.createProject = function createProject() {
			projectMainService.createItem();
		};

		function assertProjectTypeAllowsAlternative(selPrj, title) {
			let allow = false;
			if (selPrj.TypeFk && selPrj.TypeFk >= 4) {
				allow = true;
			} else {
				let modalOptions = {
					headerText: $translate.instant(title),
					bodyText: '',
					iconClass: 'ico-info'
				};
				modalOptions.bodyText = 'The type of the selected project does not support project alternatives';

				platformModalService.showDialog(modalOptions);
			}

			return allow;
		}

		function assertProjectMainAllowsAlternative(selPrj, title) {
			let allow = false;
			if (selPrj.MainProject === 0 || selPrj.MainProject === 4 || selPrj.MainProject === 5) {
				allow = true;
			} else {
				let modalOptions = {
					headerText: $translate.instant(title),
					bodyText: '',
					iconClass: 'ico-info'
				};
				modalOptions.bodyText = 'Project alternatives can only be created for main project or active alternatives';

				platformModalService.showDialog(modalOptions);
			}

			return allow;
		}

		function assertProjectHasAlternatives(selPrj, title) {
			let allow = false;
			if (selPrj.MainProject === 4 || selPrj.MainProject === 5) {
				allow = true;
			} else {
				let modalOptions = {
					headerText: $translate.instant(title),
					bodyText: '',
					iconClass: 'ico-info'
				};
				modalOptions.bodyText = 'The selected project alternatives does not have alternatives';

				platformModalService.showDialog(modalOptions);
			}

			return allow;
		}

		this.createProjectAlternative = function createProjectAlternative() {
			let selPrj = projectMainService.getSelected();
			let title = 'project.main.createAlternativeTitle';

			if (platformSidebarWizardCommonTasksService.assertSelection(selPrj, title) &&
				assertProjectTypeAllowsAlternative(selPrj, title) &&
				assertProjectMainAllowsAlternative(selPrj, title)
			) {
				let stepAlternative =
					{
						id: 'phaseChangeAlternativeSelection',
						title$tr$: title,
						form: {
							fid: 'project.main.phaseChangeAlternativeSelection',
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
									rid: 'ProjectName',
									label$tr$: 'cloud.common.entityName',
									model: 'ProjectName',
									type: 'description',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'ProjectName2',
									label$tr$: 'project.main.name2',
									model: 'ProjectName2',
									type: 'description',
									sortOrder: 2
								},
								{
									gid: 'baseGroup',
									rid: 'setAlternativeActive',
									label$tr$: 'project.main.entitySetActive',
									type: 'boolean',
									model: 'SetNewAlternativeActive',
									sortOrder: 3
								},
								{
									gid: 'baseGroup',
									rid: 'VersionDescription',
									label$tr$: 'project.main.alternativeDescription',
									model: 'AlternativeDescription',
									type: 'description',
									sortOrder: 4
								},
								{
									gid: 'baseGroup',
									rid: 'VersionComment',
									label$tr$: 'project.main.alternativeComment',
									model: 'AlternativeComment',
									type: 'remark',
									sortOrder: 5
								}
							]
						}
					};

				let command = {
					SetNewAlternativeActive: true,
					StepAlternative: stepAlternative,
					AlternativeNo:'',
					AlternativeDescription:'',
					AlternativeComment:'',
					Project: selPrj,
					ProjectName: selPrj.ProjectName,
					ProjectName2: selPrj.ProjectName2,
					copySuccessCallback: function (data, copyIdentifier) {
						let savedProjects = data.Projects;
						projectMainService.mergeProjectsAfterAlternativeCreation(savedProjects);
					},
					projectEntityFormConfig: projectMainCreationInitialDialogService.getFormConfig()
				};

				projectMainCopyEntityService.copyProject(command);
			}
		};

		function loadAlternatives(prj) {
			return $http.get(globals.webApiBaseUrl + 'project/main/alternative/list?projectID=' + prj.Id);
		}

		this.setActiveProjectAlternative = function setActiveProjectAlternative() {
			let selPrj = projectMainService.getSelected();
			let loadedProjects = [];
			let title = 'project.main.setActiveAlternativeTitle';
			let newAlternative = null;

			if (platformSidebarWizardCommonTasksService.assertSelection(selPrj, title) &&
				assertProjectHasAlternatives(selPrj, title)
			) {
				let validator = {
					checkActive: function validateIsActive(entity, value) {
						if (value) {
							_.forEach(modalSetActiveAlternativeConfig.dataItems, function (item) {
								if (item.Id !== entity.Id && item.IsActive) {
									item.IsActive = false;
									platformGridAPI.rows.refreshRow({gridId: 'AE887AC248704A08A065BD8C04C831B0', item: item});
								}
							});
							newAlternative = entity;
						} else {
							newAlternative = null;
						}
					}
				};

				let modalSetActiveAlternativeConfig = {
					title: $translate.instant(title),
					dataItems: [],
					gridConfiguration: {
						uuid: 'AE887AC248704A08A065BD8C04C831B0',
						version: '0.2.4',
						columns: [
							{
								id: 'isactive',
								editor: 'boolean',
								formatter: 'boolean',
								field: 'IsActive',
								name: 'Is Active',
								name$tr$: 'cloud.common.entityIsLive',
								sortable: true,
								grouping: {
									title: 'Is Active',
									getter: 'IsActive',
									aggregators: [],
									aggregateCollapsed: true
								},
								validator: validator.checkActive
							},
							{
								id: 'projectno',
								formatter: 'code',
								field: 'ProjectNo',
								name: 'Code',
								name$tr$: 'project.main.projectNo',
								sortable: true,
								grouping: {
									title: 'Code',
									getter: 'ProjectNo',
									aggregators: [],
									aggregateCollapsed: true
								}
							},
							{
								id: 'index',
								formatter: 'integer',
								field: 'ProjectIndex',
								name: 'Index',
								name$tr$: 'cloud.common.entityIndex',
								sortable: true,
								grouping: {
									title: 'Index',
									getter: 'Index',
									aggregators: [],
									aggregateCollapsed: true
								}
							},
							{
								id: 'projectname',
								formatter: 'code',
								field: 'ProjectName',
								name: 'Name',
								name$tr$: 'cloud.common.entityName',
								sortable: true,
								grouping: {
									title: 'Name',
									getter: 'ProjectName',
									aggregators: [],
									aggregateCollapsed: true
								}
							},
							{
								id: 'projectname2',
								formatter: 'description',
								field: 'ProjectName2',
								name: 'Name 2',
								name$tr$: 'project.main.projectName2',
								sortable: true,
								grouping: {
									title: 'Name 2',
									getter: 'ProjectName2',
									aggregators: [],
									aggregateCollapsed: true
								}
							}
						]
					},

					handleOK: function handleOK() {
						const id = newAlternative ? newAlternative.Id : selPrj.Id;
						let project = _.find(loadedProjects, function (prj) {
							return prj.Id === id;
						});

						let action = {
							Action: 3,
							Project: project
						};

						$http.post(globals.webApiBaseUrl + 'project/main/execute', action
						).then(function () {// response not used
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
						});
					},
					dialogOptions: {
						disableOkButton: function () {
							return newAlternative === null;
						}
					}
				};

				loadAlternatives(selPrj).then(function (response) {
					_.forEach(response.data, function (alter) {
						loadedProjects.push(alter);
						if(alter.MainProject === 4) {
							newAlternative = alter;
						}
						modalSetActiveAlternativeConfig.dataItems.push({
							Id: alter.Id,
							IsActive: alter.MainProject === 4,
							ProjectNo: alter.ProjectNo,
							ProjectIndex: alter.ProjectIndex,
							ProjectName: alter.ProjectName,
							ProjectName2: alter.ProjectName2
						});
					});

					platformTranslateService.translateGridConfig(modalSetActiveAlternativeConfig.gridConfiguration.columns);

					modalSetActiveAlternativeConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalGridConfigService.showDialog(modalSetActiveAlternativeConfig);
				});
			}
		};

		this.createModelFile = function createModelFile() {
			if (platformSidebarWizardCommonTasksService.assertSelection(projectMainService.getSelected(), 'model.project.createModelFileTitle')) {
				modelProjectModelFileDataService.create(projectMainService.getSelected());
			}
		};

		this.resetModelFileState = function resetModelFileState() {
			if (platformSidebarWizardCommonTasksService.assertSelection(projectMainService.getSelected(), 'model.project.resetModelFileStateTitle')) {
				modelProjectModelFileDataService.resetModelFileState(projectMainService.getSelected());
			}
		};

		this.deleteCompleteModel = function deleteCompleteModel() {
			if (platformSidebarWizardCommonTasksService.assertSelection(projectMainService.getSelected(), 'model.project.deleteModelTitle')) {
				modelProjectModelDataService.deleteCompleteModel(projectMainService.getSelected());
			}
		};

		this.updateCompositeModel = function updateCompositeModel() {
			if (platformSidebarWizardCommonTasksService.assertSelection(projectMainService.getSelected(), 'model.project.updateCompositeModel')) {
				modelProjectModelDataService.updateCompositeModel(modelProjectModelDataService.getSelected());
			}
		};

		let disableModel = function disableProject() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(modelProjectModelDataService, 'disableModelTitle', 'model.project.disableModelTitle', 'Code',
				'model.project.disableModelDone', 'model.project.modelAlreadyDisabled', 'model', 15);
		};
		this.disableModel = disableModel().fn;

		let enableModel = function enableModel() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(modelProjectModelDataService, 'enableModelTitle', 'model.project.enableModelTitle', 'Code',
				'model.project.enableModelDone', 'model.project.modelAlreadyEnabled', 'model', 16);
		};
		this.enableModel = enableModel().fn;

		let changeProjectStatus;
		changeProjectStatus = function ChangeStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: projectMainService,
					statusField: 'StatusFk',
					codeField: 'ProjectNo',
					descField: 'ProjectName',
					projectField: 'Id',
					title: 'project.main.changeStatus',
					statusDisplayField: 'Description',
					statusName: 'project',
					statusProvider: function (entity) {
						return basicsLookupdataSimpleLookupService.refreshCachedData({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'project.main.status',

							filter: {
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								field: 'RubricCategoryFk'
							}
						}).then(function (respond) {

							return _.filter(respond, function (item) {
								return (item.RubricCategoryFk === entity.RubricCategoryFk && item.isLive) || (entity.StatusFk === item.Id);
							});
						});
					},
					updateUrl: 'project/main/changestatus',
					id: 14
				}
			);
		};
		this.changeProjectStatus = changeProjectStatus().fn;

		let disableProject = function disableProject() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(projectMainService, 'disableProjectTitle', 'project.main.disableProjectTitle', 'ProjectNo',
				'project.main.disableProjectDone', 'project.main.projectAlreadyDisabled', 'prj', 15);
		};
		this.disableProject = disableProject().fn;

		let enableProject = function enableProject() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(projectMainService, 'enableProjectTitle', 'project.main.enableProjectTitle', 'ProjectNo',
				'project.main.enableProjectDone', 'project.main.projectAlreadyEnabled', 'prj', 16);
		};
		this.enableProject = enableProject().fn;

		let makeTemplateProject = function makeTemplateProject() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'enableProjectTitle',
				captionTR: 'project.main.makeTemplateProjectTitle',
				codeField: 'ProjectNo',
				changeProp: 'IsTemplate',
				newVal: true,
				doneMsg: 'project.main.makeTemplateProjectDone',
				nothingToDoMsg: 'project.main.projectAlreadyTemplate',
				placeHolder: 'prj',
				id: 20
			});
		};
		this.makeTemplateProject = makeTemplateProject().fn;

		let makeNormalProject = function makeNormalProject() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'enableProjectTitle',
				captionTR: 'project.main.makeNormalProjectTitle',
				codeField: 'ProjectNo',
				changeProp: 'IsTemplate',
				newVal: false,
				doneMsg: 'project.main.makeNormalProjectDone',
				nothingToDoMsg: 'project.main.projectAlreadyNormal',
				placeHolder: 'prj',
				id: 21
			});
		};
		this.makeNormalProject = makeNormalProject().fn;

		let useProjectPermission = function useProjectPermission() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'enableProjectTitle',
				captionTR: 'project.main.useProjectPermissionTitle',
				codeField: 'ProjectNo',
				changeProp: 'CheckPermission',
				newVal: true,
				doneMsg: 'project.main.useProjectPermissionDone',
				nothingToDoMsg: 'project.main.projectAlreadyUsesPermissions',
				placeHolder: 'prj',
				id: 22
			});
		};
		this.useProjectPermission = useProjectPermission().fn;

		let dontUseProjectPermission = function dontUseProjectPermission() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'enableProjectTitle',
				captionTR: 'project.main.dontUseProjectPermissionTitle',
				codeField: 'ProjectNo',
				changeProp: 'CheckPermission',
				newVal: false,
				doneMsg: 'project.main.dontUseProjectPermissionDone',
				nothingToDoMsg: 'project.main.projectAlreadyDoesNotUsePermissions',
				placeHolder: 'prj',
				id: 23
			});
		};
		this.dontUseProjectPermission = dontUseProjectPermission().fn;

		let convertProjectTo5D = function convertProjectTo5D() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'makeProjectTo5DTitle',
				captionTR: 'project.main.makeProjectTo5DTitle',
				codeField: 'ProjectNo',
				changeProp: 'TypeFk',
				newVal: 4,
				doneMsg: 'project.main.projectIsConvertedInto5DProject',
				nothingToDoMsg: 'project.main.projectAlreadyIs5DProject',
				placeHolder: 'prj',
				id: 22
			});
		};
		this.convertProjectTo5D = convertProjectTo5D().fn;

		let convertProjectTo40 = function convertProjectTo40() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'makeProjectTo40Title',
				captionTR: 'project.main.makeProjectTo40Title',
				codeField: 'ProjectNo',
				changeProp: 'TypeFk',
				newVal: 5,
				doneMsg: 'project.main.projectIsConvertedInto40Project',
				nothingToDoMsg: 'project.main.projectAlreadyIs40Project',
				placeHolder: 'prj',
				id: 23
			});
		};
		this.convertProjectTo40 = convertProjectTo40().fn;

		let changeInstanceHeaderStatus = basicsCommonChangeStatusService.provideStatusChangeInstance(
			{
				id: 18,
				title: 'constructionsystem.project.changeInstanceHeaderStatus',
				mainService: projectMainService,
				dataService: constructionSystemProjectInstanceHeaderService,
				statusName: 'instanceheader',
				statusField: 'StateFk',
				codeField: 'ProjectNo',
				descField: 'ProjectName',
				updateUrl: 'constructionsystem/project/instanceheader/changestatus'
			});
		this.changeInstanceHeaderStatus = changeInstanceHeaderStatus.fn;

		function changeStatusForProjectDocument() {
			return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(projectMainService, 'project.main');
		}

		this.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

		let make5DTemplateProject = function make5DTemplateProject() {
			return platformSidebarWizardCommonTasksService.provideSetValueToSimpleField({
				dataService: projectMainService,
				caption: 'make5DTemplateProject',
				captionTR: 'project.main.makeProject5DTemplateTitle',
				codeField: 'ProjectNo',
				changeProp: 'TypeFk',
				newVal: 4,
				doneMsg: 'project.main.makeProject5DTemplateDone',
				nothingToDoMsg: 'project.main.alreadyProject5DTemplate',
				placeHolder: 'prj',
				id: 'make5DTemplateProject',
				validator: function checkProjectIsATemplate(entity) {
					return entity.IsTemplate;
				},
				validatorMsg: 'project.main.isNotATemplateProject'
			});
		};

		this.make5DTemplateProject = make5DTemplateProject().fn;

		this.updateMaterialPrices = function updateMaterialPrices(_isInSummary,userParam,desc,doNotClearEstHeader) {

			if(!doNotClearEstHeader) {
				$injector.get ('estimateMainService').setSelectedPrjEstHeader (null);
			}
			$injector.get('projectMainUpdatePriceFromCatalogMainService').isInSummary = _isInSummary;

			projectMainService.updateAndExecute(function () {
				projectMainUpdateMaterialPriceMainService.showDialog();
			});
		};

		this.updateCostCodesPriceByPriceList = function updateCostCodesPriceByPriceList(isInSummary, jobIds, costCodeIds) {
			if (!projectMainService.hasSelection() && !isInSummary) {
				let bodyText = $translate.instant('project.main.noCurrentSelection');
				let headerText = $translate.instant('project.main.updateCostCodesPricesTitle');
				platformModalService.showMsgBox(bodyText, headerText, 'ico-info');
				return;
			}
			projectMainService.updateAndExecute(function () {
				let projectCostCodesPriceListForJobDataService = $injector.get('projectCostCodesPriceListForJobDataService');
				projectCostCodesPriceListForJobDataService.setFilters(jobIds, _.isArray(costCodeIds) ? costCodeIds : []);
				let modalOptions = {
					headerTextKey: $translate.instant('project.main.updateCostCodesPricesTitle'),
					templateUrl: globals.appBaseUrl + 'project.costcodes/templates/update-costcodes-prices-from-job.html',
					width: '1000px',
					showCancelButton: true,
					showOkButton: false,
					resizeable: true
				};
				platformModalService.showDialog(modalOptions).then(function () {
				});
			});
		};

		this.compareCosInsHeader = function () {
			let selectedProject = projectMainService.getSelected();

			if (selectedProject) {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'constructionsystem.project/templates/compare-cos-template.html',
					controller: 'constructionSystemProjectCompareCosController',
					width: '800px',
					resolve: {
						'params': [
							function () {
								return {
									project: selectedProject,
									insHeader: constructionSystemProjectInstanceHeaderService.getSelected()
								};
							}
						]
					}
				}).then(function (res) {
					if (res.ok) {
						// todo-wui: handle result
						return true;
					}
				});
			} else {
				// select a project first.
				let modalOptions = {
					headerText: $translate.instant('project.main.projects'),
					bodyText: $translate.instant('project.main.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};

		let filterModels = [];
		let filter = {
			key: 'project-wizard-service-change-model-filter',
			serverSide: false,
			fn: function (dataItem) {
				let selectCosItem = constructionSystemProjectInstanceHeaderService.getSelected();
				let models = getModelForInstanceHeader(selectCosItem.EstimateHeaderFk);
				let inCludes = !models.includes(dataItem.Id);
				if (inCludes && !_.find(filterModels, {Id: dataItem.Id})) {
					filterModels.push(dataItem);
				}
				return inCludes;
			}
		};
		basicsLookupdataLookupFilterService.registerFilter(filter);

		function getModelForInstanceHeader(EstimateHeaderFk) {
			let models = [];
			let entities = constructionSystemProjectInstanceHeaderService.getList();
			_.forEach(entities, function (item) {
				if (item.EstimateHeaderFk === EstimateHeaderFk) {
					models.push(item.ModelFk);
				}
			});
			return models;
		}

		this.updateEquipmentAssembly = function () {
			$injector.get('projectPlantAssemblyWizardService').updateEquipmentAssembly();
		};

		// change the model of existed cos instance header;
		this.changeModel = function () {
			let modalOptions;
			let selectedProject = projectMainService.getSelected();
			let selectedCosItem = constructionSystemProjectInstanceHeaderService.getSelected();
			filterModels = [];
			if (selectedProject) {
				if (selectedCosItem) {
					if(selectedCosItem.ModelFk) {
						$q.all([$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/modelkind?modelId=' + selectedCosItem.ModelFk),
							$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/getuniqueforestimatandmodel?mainItemId=' + selectedProject.Id + '&estHeaderFk=' + selectedCosItem.EstimateHeaderFk)])
							.then(function (results) {
								let modelKind = results[0].data;
								let result = results[1];
								if (!result.data) {
									let wzConfig = {
										title$tr$: 'model.viewer.changeModelWz.title',
										steps: [{
											id: 'selectorStep',
											title$tr$: 'model.viewer.changeModelWz.selector',
											form: {
												fid: 'model.viewer.changeModelWz.selector.list',
												version: '1.0.0',
												showGrouping: false,
												skipPermissionsCheck: true,
												groups: [{
													gid: 'Id'
												}],
												rows: modelKind === 1 ? [getmodelConfig(selectedProject, modelKind)] : [getmodelConfig(selectedProject, modelKind), getModelChangeSetConfig(selectedCosItem)]
											},
											disallowBack: true,
											disallowNext: true,
											watches: [modelKind === 1 ?
												{
													expression: 'modelId',
													fn: function (info) {
														info.wizard.steps[0].disallowNext = !isAvailByModel(info['newValue']);
													}
												} : {
													expression: 'mdlChangeSetFk',
													fn: function (info) {
														info.wizard.steps[0].disallowNext = _.isNil(info['newValue']);
													}
												}
											]
										}, modelKind === 1 ? {
											id: 'update2DModelStep',
											title$tr$: 'model.viewer.changeModelWz.updateInstance',
											loadingMessage: 'Updating Data',
											canFinish: false,
											disallowBack: true,
											disallowNext: true
										} : {
											id: 'updateInstanceStep',
											title$tr$: 'model.viewer.changeModelWz.updateInstance',
											disallowBack: false,
											disallowNext: false,
											canFinish: false
										}
										]
									};
									platformWizardDialogService.translateWizardConfig(wzConfig);
									let obj = {
										selector: {},
										__selectorSettings: {}
									};
									modalOptions = {
										templateUrl: globals.appBaseUrl + 'constructionsystem.project/templates/change-model-template.html',
										width: '620',
										resolve: {
											'params': [
												function () {
													return {
														selectedProject: selectedProject,
														selectedCosItem: selectedCosItem
													};
												}
											]
										},
										value: {
											wizard: wzConfig,
											entity: obj,
											wizardName: 'wzdlg'
										},
										resizeable: true
									};
									return platformModalService.showDialog(modalOptions);
								} else {
									modalOptions = {
										headerText: $translate.instant('project.main.projects'),
										bodyText: $translate.instant('constructionsystem.project.noModelItem'),
										iconClass: 'ico-info'
									};
									platformModalService.showDialog(modalOptions);
								}
							});
					}else {
						modalOptions = {
							headerText: $translate.instant('model.viewer.changeModelWz.title'),
							bodyText: $translate.instant('model.viewer.changeModelWz.NoModelInSelection'),
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
					}
				} else {
					modalOptions = {
						headerText: $translate.instant('model.viewer.changeModelWz.title'),
						bodyText: $translate.instant('model.viewer.changeModelWz.noCurrentSelection'),
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);

				}
			} else {// select a project first.
				modalOptions = {
					headerText: $translate.instant('project.main.projects'),
					bodyText: $translate.instant('project.main.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}

			function getmodelConfig(selectedProject, modelKind) {
				let modelFkConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'modelProjectModelTreeLookupDataService',
					filter: function () {
						if (modelKind === 1) {
							return {
								projectId: selectedProject.Id,
								exclude: {
									models3D: true
								}
							};
						}

						return {
							projectId: selectedProject.Id,
							includeComposite: true,
							exclude: {
								models2D: true
							}
						};
					},
					filterKey: 'project-wizard-service-change-model-filter'
				}, {
					gid: 'Id',
					rid: 'model',
					model: 'modelId',
					label$tr$: 'model.viewer.changeModelWz.labelName',
					change: function (entity, field) {
						changeModelWz(entity, field);
					}
				});
				return modelFkConfig;
			}

			function getModelChangeSetConfig(selectedCosItem) {
				return {
					gid: 'Id',
					model: 'mdlChangeSetFk',
					label$tr$: 'constructionsystem.project.entityMdlChangeSetFk',
					type: 'directive',
					directive: 'basics-lookupdata-model-change-set-combobox',
					options: {
						filterOptions: {
							serverSide: true,
							fn: function (entity) {
								return {
									model1Fk: entity.modelId,
									model2Fk: selectedCosItem.ModelFk
								};
							}
						},
						pKeyMaps: [{fkMember: 'mdlChangeSetModelFk', pkMember: 'ModelFk'}],
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									let selected = args.selectedItem;
									let entity = args.entity;

									if (selectedCosItem.ModelFk === selected.ModelFk) {
										entity.modelId = selected.ModelCmpFk;
									} else {
										entity.modelId = selected.ModelFk;
									}
								}
							}
						]
					}
				};
			}

			function changeModelWz(entity, field) {
				let result = true;
				if (!isAvailByModel(entity[field])) {
					result = {
						apply: true,
						valid: false,
						error: $translate.instant('project.main.chooseSelection')
					};
				}
				platformRuntimeDataService.applyValidationResult(result, entity, field);
			}

			function isAvailByModel(_modelId) {
				if (!angular.isNumber(_modelId) && !_.find(filterModels, {Id: _.toInteger(_.replace(_modelId, 'R', ''))})) {
					return false;
				}
				return true;
			}
		};

		// change status of boq (in project module)
		let changeBoqHeaderStatus = function changeBoqHeaderStatus() {
			let boqProjectService = $injector.get('boqProjectService');
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					statusName: 'boq',
					mainService: projectMainService,
					// boqProjectService returns a composite object, entity is { BoqHeader: {...} }
					getDataService: function () {
						return {
							getSelected: function () {
								return _.get(boqProjectService.getSelected(), 'BoqHeader');
							},
							gridRefresh: function () {
								boqProjectService.gridRefresh();
							}
						};
					},
					statusField: 'BoqStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'boq.main.wizardChangeBoqStatus',
					updateUrl: 'boq/main/changeheaderstatus'
				}
			);
		};
		this.changeBoqHeaderStatus = changeBoqHeaderStatus().fn;

		this.makeItwoProject = function makeItwoProject() {
			let modalOptions = {
				headerText: $translate.instant('project.main.titleMakeCloudProject'),
				bodyText: '',
				iconClass: 'ico-info'
			};
			let selectedItem = projectMainService.getSelected();
			if (!_.isNil(selectedItem)) {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/projecttype/list').then(function (response) {
					if (selectedItem.TypeFk === response.data[3].Id) {// iTWO 5D Project
						selectedItem.TypeFk = response.data[4].Id;
						return $http.post(globals.webApiBaseUrl + 'project/main/save', selectedItem).then(function () {
							modalOptions.bodyText = $translate.instant('project.main.setMakeCloudProject');
							platformModalService.showDialog(modalOptions);
						},
						function (/* error */) {
						});
					}
					if (selectedItem.TypeFk === response.data[4].Id) {// iTWO Cloud Project
						modalOptions.bodyText = $translate.instant('project.main.isAlreadyMakeCloudProject');
					}
					if (selectedItem.TypeFk <= response.data[2].Id && selectedItem.TypeFk >= response.data[5].Id) {
						modalOptions.bodyText = $translate.instant('project.main.typeCannotBeChanged');
					}

					platformModalService.showDialog(modalOptions);
				},
				function (/* error */) {
				});
			}
		};

		let setScheduleStatus = function setScheduleStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: projectMainService,// schedulingProjectScheduleService,
					dataService: schedulingScheduleEditService,
					statusField: 'ScheduleStatusFk',
					descField: 'Description',
					projectField: 'ProjectFk',
					title: 'project.main.wizardChangeScheduleStatus',
					statusDisplayField: 'Description',
					statusName: 'schedulingschedulestatus',
					updateUrl: 'scheduling/schedule/changestatus',
					statusProvider: function (entity) {
						return basicsLookupdataSimpleLookupService.refreshCachedData({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.schedulestatus',

							filter: {
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								field: 'RubricCategoryFk'
							}
						}).then(function (respond) {

							return _.filter(respond, function (item) {
								return (item.RubricCategoryFk === entity.RubricCategoryFk && item.isLive) || (entity.ScheduleStatusFk === item.Id);
							});
						});
					},
					id: 999
				}
			);
		};
		this.setScheduleStatus = setScheduleStatus().fn;

		this.setCurrencyExchangeRates = function setCurrencyExchangeRates() {
			let title = $translate.instant('project.main.titleUpdateCurrencyExchangeRates');
			let serviceCurrencyRateData = projectMainCurrencyRateDataService;
			let selectedCurrencyRateData = serviceCurrencyRateData.getSelected();

			if (selectedCurrencyRateData && selectedCurrencyRateData.Id) {
				let modalCurrencyExchangeRatesConfig = {
					title: title,
					dataItem: {
						CurrencyRateTypeFk: selectedCurrencyRateData.CurrencyRateTypeFk
					},
					formConfiguration: {
						fid: 'scheduling.calendar.DescriptionInfoModal',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['CurrencyRateTypeFk']
							}
						],
						rows: [
							basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.currency.rate.type', 'Description', {
								gid: 'baseGroup',
								rid: 'CurrencyRateTypeFk',
								model: 'CurrencyRateTypeFk',
								label: 'Rate Type',
								label$tr$: 'basics.currency.RateType',
								sortOrder: 1

							})
						]
					},
					handleOK: function handleOK(result) {
						let currencyRateCreationData = {
							CurrencyHomeFk: selectedCurrencyRateData.CurrencyHomeFk,
							CurrencyForeignFk: selectedCurrencyRateData.CurrencyForeignFk,
							CurrencyRateTypeFk: result.data.CurrencyRateTypeFk
						};
						$http.post(globals.webApiBaseUrl + 'basics/currency/rate/ratebyconversionforeign', currencyRateCreationData).then(function (response) {
							// Load successful
							if (response.data !== null && !_.isEmpty(response.data)) {
								let ratedate = response.data.RateDate;
								let rate = response.data.Rate;
								serviceCurrencyRateData.createCurrencyRate().then(function (responseCurrencyRate) {
									responseCurrencyRate.CurrencyRateTypeFk = response.data.CurrencyRateTypeFk;
									responseCurrencyRate.CurrencyConversionFk = selectedCurrencyRateData.CurrencyConversionFk;
									responseCurrencyRate.CurrencyHomeFk = selectedCurrencyRateData.CurrencyHomeFk;
									responseCurrencyRate.CurrencyForeignFk = selectedCurrencyRateData.CurrencyForeignFk;
									responseCurrencyRate.RateDate = moment.utc(ratedate);
									responseCurrencyRate.Rate = rate;
									responseCurrencyRate.Basis = response.data.Basis;
									responseCurrencyRate.Comment = selectedCurrencyRateData.Comment;
									serviceCurrencyRateData.gridRefresh();
								});
							}
							else {
								platformDialogService.showInfoBox('project.main.infoUpdateCurrencyExchangeRates');
							}
						},
						function (/* error */) {
						});
					}
				};
				platformModalFormConfigService.showDialog(modalCurrencyExchangeRatesConfig);
			} else {
				// Error MessageText
				let modalOptions = {
					headerText: title,
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};

		let projectWizardID = 'projectMainSidebarWizards';

		let projectWizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			items: [
				{
					id: 1,
					text: 'projectWizardTitle',
					text$tr$: 'project.main.projectWizardTitle',
					groupIconClass: 'sidebar-icons ico-wiz-change-status',
					visible: true,
					subitems: [
						{
							id: 11,
							text: 'createProjectTitle',
							text$tr$: 'project.main.createProjectTitle',
							type: 'item',
							showItem: true,
							cssClass: 'rw md',
							fn: self.createProject
						},
						{
							id: 12,
							text: 'createAlternativeTitle',
							text$tr$: 'project.main.createAlternativeTitle',
							type: 'item',
							showItem: true,
							cssClass: 'rw md',
							fn: self.createProjectAlternative
						},
						{
							id: 13,
							text: 'setActiveAlternativeTitle',
							text$tr$: 'project.main.setActiveAlternativeTitle',
							type: 'item',
							showItem: true,
							cssClass: 'rw md',
							fn: self.setActiveProjectAlternative
						},
						changeProjectStatus(),
						disableProject(),
						enableProject(),
						{
							id: 17,
							text: 'createModelFileTitle',
							text$tr$: 'model.project.createModelFileTitle',
							type: 'item',
							showItem: true,
							cssClass: 'rw md',
							fn: self.createModelFile
						},
						changeInstanceHeaderStatus,
						{
							id: 19,
							text: ' Change Project Number',
							text$tr$: 'model.project.entityChangeProjectNumber',
							type: 'item',
							showItem: true,
							cssClass: 'rw md',
							fn: self.changeProjectNumber
						},
						{
							id: 25,
							text: ' Synchronize iTWO4.0 Project to BIM 360',
							text$tr$: 'project.main.autodesk.postProjectToAutodesk360Bim',
							type: 'item',
							showItem: true,
							cssClass: 'rw md',
							fn: self.postProjectToAutodeskBim360
						},
						makeTemplateProject(),
						makeNormalProject(),
						useProjectPermission(),
						dontUseProjectPermission(),
						changeStatusForProjectDocument(),
						changeProjectStatus(),
					]
				}
			]
		};

		function validateProjectNo(entity, value) {
			if (entity.ProjectNo === value) {
				return $q.when({
					apply: true,
					valid: false,
					error$tr$: 'cloud.common.uniqueValueErrorMessage',
					error$tr$param$: {object: $translate.instant('project.main.entityNewNumber').toLowerCase()}
				});

			} else {
				entity.runningValidation = true;

				/*
				let project = {
					ProjectNo: value,
					ProjectContextFk: entity.ProjectContextFk
				};
*/
				let project = _.cloneDeep(projectMainService.getSelected());
				project.ProjectNo = value;
				return $http.post(globals.webApiBaseUrl + 'project/main/validateProjectNo', project).then(function (response) {
					entity.runningValidation = false;

					if (response.data !== true) {
						return {
							apply: true,
							valid: false,// response && response.data,
							error$tr$: 'cloud.common.uniqueValueErrorMessage',
							error$tr$param$: {object: $translate.instant('project.main.entityNewNumber').toLowerCase()}
						};
					}
				},
				function (/* error */) {
					entity.runningValidation = false;
				});
			}
		}

		function checkProjectInBaselineAndExecute(project, mainAction, errorMsg, title){
			if(project.TypeFk !== projectMainConstantValues.values.iTwo5DProject) {
				return projectMainService.updateAndExecute(function () {
					$http.post(globals.webApiBaseUrl + 'project/main/execute', mainAction
					).then(function (response) {// response not used
						platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
						if (response && response.data && response.data.Projects[0]) {
							projectMainService.mergeAfterEditCostGroupConfig(projectMainService.getSelected(), response.data.Projects[0]);
						}

						return true;
					},
					function (/* error */) {
					});
				});
			}
			else {
				let action = {
					Action: 8,
					Project: project,
					CloseProject: false
				};
				return $http.post(globals.webApiBaseUrl + 'project/main/checkprojectinbaselineifopen', action
				).then(function (response) {// response not used
					if (response) {
						if (!response.data) {
							return projectMainService.updateAndExecute(function () {
								$http.post(globals.webApiBaseUrl + 'project/main/execute', mainAction
								).then(function (response) {// response not used
									platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title);
									if (response && response.data && response.data.Projects[0]) {
										projectMainService.mergeAfterEditCostGroupConfig(projectMainService.getSelected(), response.data.Projects[0]);
									}

									return true;
								},
								function (/* error */) {
								});
							});
						} else {
							let dialogService = $injector.get('platformDialogService');
							dialogService.showErrorBox(errorMsg, title);
						}
					}
				},
				function (/* error */) {
				});
			}
		}

		this.changeProjectNumber = function changeProjectNumber() {
			let titleKey = 'project.main.entityChangeProjectNumber';
			let selectedProject = projectMainService.getSelected();

			// Dialog or Error Dialog
			if (selectedProject) {
				let changeProjectNumberConfig = {
					title: $translate.instant(titleKey),
					dataItem: {
						ProjectNo: selectedProject.ProjectNo,
						NewNumber: null,
						ProjectName: selectedProject.ProjectName,
						ProjectName2: selectedProject.ProjectName2
					},
					formConfiguration: {
						fid: 'project.main.ChangeProjectNumber',
						version: '0.2.4',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['ProjectNo', 'NewNumber', 'ProjectName', 'ProjectName2']
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'ProjectNo',
								model: 'ProjectNo',
								label$tr$: 'project.main.projectNo',
								type: 'code',
								sortOrder: 1,
								readonly: true
							},
							{
								gid: 'baseGroup',
								rid: 'NewNumber',
								model: 'NewNumber',
								label$tr$: 'project.main.entityNewNumber',
								type: 'code',
								sortOrder: 2,
								asyncValidator: validateProjectNo
							},
							{
								gid: 'baseGroup',
								rid: 'ProjectName',
								model: 'ProjectName',
								label$tr$: 'cloud.common.entityName',
								type: 'description',
								sortOrder: 3,
								readonly: true
							},
							{
								gid: 'baseGroup',
								rid: 'ProjectName2',
								model: 'ProjectName2',
								label$tr$: 'project.main.name2',
								type: 'description',
								sortOrder: 4,
								readonly: true
							}
						]
					},
					handleOK: function handleOK(result) {
						if (result.ok === true) {
							let project = projectMainService.getSelected();
							let action = {
								Action: 6,
								Project: project,
								NewProjectNumber: result.data.NewNumber
							};
							checkProjectInBaselineAndExecute(project, action, 'project.main.wizardChangeProjectNumberInfoMsg', titleKey);
						}
					},
					dialogOptions: {
						disableOkButton: function () {
							return changeProjectNumberConfig.dataItem.runningValidation || platformRuntimeDataService.hasError(changeProjectNumberConfig.dataItem, 'NewNumber') ||
								_.isNil(changeProjectNumberConfig.dataItem.NewNumber) || (_.isString(changeProjectNumberConfig.dataItem.NewNumber) && changeProjectNumberConfig.dataItem.NewNumber.length <= 0);
						}
					}
				};

				// Show Dialog
				platformTranslateService.translateFormConfig(changeProjectNumberConfig.formConfiguration);
				platformModalFormConfigService.showDialog(changeProjectNumberConfig);
			} else {

				// Error MessageText
				let modalOptions = {
					headerText: titleKey,
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);

			}
		};

		this.setCharacteristics = function setCharacteristics() {
			let params = {};
			params.parentService = projectMainService;
			params.sectionId = 1;
			params.moduleName = 'project.main';
			basicsCharacteristicBulkEditorService.showEditor(params);
		};

		this.gaebImport = function gaebImport(wizardParameter) {

			let selectedProject = projectMainService.getSelected();
			if (selectedProject) {
				let options = {};
				options.boqRootItem = null; // will be created by boqMainGaebImportService
				options.projectId = selectedProject.Id;
				options.boqMainService = null;   // $injector.get('boqMainService');
				options.mainService = projectMainService;
				options.createItemService = $injector.get('boqProjectService');
				options.wizardParameter = wizardParameter;

				let boqMainGaebImportService = $injector.get('boqMainGaebImportService');
				boqMainGaebImportService.showImportMultipleFilesDialog(options);
			}
		};

		this.importCrbSia = function importCrbSia() {
			let selectedProject = projectMainService.getSelected();
			if (selectedProject) {
				$injector.get('boqMainCrbSiaService').importMultipleCrbSia(selectedProject.Id, $injector.get('boqProjectService'));
			}
		};

		this.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(projectWizardID, projectWizardConfig);
		};

		this.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(projectWizardID);
		};

		this.updateMaterialPricesFromYtwo = updateMaterialPricesFromYtwo;

		//
		this.ClearProjectStock = function () {
			let selectedproject = projectMainService.getSelected();
			if (selectedproject) {
				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.stock/templates/clear-projectstock-template.html',
					controller: 'procurementStockClearProjectStockController',
					width: '620px',
					resolve: {
						'params': [
							function () {
								return {
									projectId: selectedproject.Id
								};
							}
						]
					}
				}).then(function (res) {
					if (res.isClear) {
						let procurementStockTransactionDataService = $injector.get('procurementStockTransactionDataService');
						procurementStockTransactionDataService.callRefresh();
					}
				});
			} else {
				// select a project first.
				let modalOptions = {
					headerText: $translate.instant('project.main.projects'),
					bodyText: $translate.instant('project.main.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
		};
		// loads or updates translated strings
		let loadTranslations = function () {
			platformTranslateService.translateObject(projectWizardConfig, ['text']);
		};

		// register translation changed event
		platformTranslateService.translationChanged.register(loadTranslations);

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule('cloud.desktop')) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		this.reScheduleAllProjects = function reScheduleAllProjects() {
			let selPrj = projectMainService.getSelected();
			let title = 'project.main.rescheduleProjectSchedules';

			if (platformSidebarWizardCommonTasksService.assertSelection(selPrj, title)) {
				let prjIds = _.map(projectMainService.getSelectedEntities(), 'Id');
				schedulingScheduleRescheduleService.reScheduleAllProjects(prjIds).then(function (retVal) {
					giveOutRescheduleResult(retVal.data, 'project.main.rescheduleProjectSchedules');
				});
			}
		};

		this.reScheduleAllSchedules = function reScheduleAllSchedules() {
			let selPrj = _.head(schedulingScheduleEditService.getSelectedEntities());
			let title = 'project.main.rescheduleSelectedSchedules';

			if (platformSidebarWizardCommonTasksService.assertSelection(selPrj, title)) {
				let schedIds = _.map(schedulingScheduleEditService.getSelectedEntities(), 'Id');
				schedulingScheduleRescheduleService.reScheduleAllSchedules(schedIds).then(function (retVal) {
					giveOutRescheduleResult(retVal.data, 'project.main.rescheduleSchedules');
				});
			}
		};

		this.postProjectToAutodeskBim360 = function postProjectToAutodeskBim360() {
			let selPrj = projectMainService.getSelected();
			projectMainItwoproject2Bim360DialogService.showPostDialog(selPrj);
		};

		function giveOutRescheduleResult(retVal, title) {
			if (retVal.Succeeded) {
				platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(title, retVal.ResultMessage);
			}
		}


		// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
		this.generateProjectActions = function generateProjectActions() {
			let selectFromAndToSourceCode = 0;
			let selectedProject = projectMainService.getSelected();
			if (!selectedProject) {
				showMessage('', false);
				return;
			}

			let translationNamespace = 'project.main.generateProjectActions.';

			// get columns --> with UIStandart service for custome fields or just layout service for all fields

			// cost group catalog
			let basicsCostGroupCatalogUIStandardService = $injector.get('basicsCostGroupCatalogUIStandardService');
			let basicsCostGroupsCatalogGridLayout = _.cloneDeep(basicsCostGroupCatalogUIStandardService.getStandardConfigForListView().columns);
			// cost group
			let basicsCostGroupUIStandardService = $injector.get('basicsCostGroupUIStandardService');
			let basicsCostGroupGridLayout = _.cloneDeep(basicsCostGroupUIStandardService.getStandardConfigForListView().columns);

			// dynamicly created checkbox for selection of employees

			let checkBoxColumnCatalog = {
				editor: 'boolean',
				editorOptions: {},
				field: 'isSelectedForRecordCreation',
				formatter: 'boolean',
				fixed: true,
				width: 150,
				formatterOptions: {},
				id: 'SelectedForRecordCreation-checkbox',
				name: translationNamespace + 'isSelectedForRecordCreationCatalog',
				name$tr$: translationNamespace + 'isSelectedForRecordCreationCatalog',
				toolTip: translationNamespace + 'isSelectedForRecordCreationToolTipCatalog',
				toolTip$tr$: translationNamespace + 'isSelectedForRecordCreationToolTipCatalog',
			};
			let checkBoxColumnGroup = {
				editor: 'boolean',
				editorOptions: {},
				field: 'isSelectedForRecordCreation',
				formatter: 'boolean',
				fixed: true,
				width: 150,
				formatterOptions: {},
				id: 'SelectedForRecordCreation-checkbox',
				name: translationNamespace + 'isSelectedForRecordCreationGroup',
				name$tr$: translationNamespace + 'isSelectedForRecordCreationGroup',
				toolTip: translationNamespace + 'isSelectedForRecordCreationToolTipGroup',
				toolTip$tr$: translationNamespace + 'isSelectedForRecordCreationToolTipGroup',
			};
			basicsCostGroupsCatalogGridLayout.unshift(checkBoxColumnCatalog);
			basicsCostGroupGridLayout.unshift(checkBoxColumnGroup);

			// Dataitem after grid layouts have been created
			let dataItem = {
				generateActionsFor: null,
				projectFk: selectedProject.Id,
				projectCode: selectedProject.ProjectNo,
				jobFK: null,
				isActivity: null,
				isControllingUnit: null,
				scheduleFk:null,
				costGroupCatalogStep: {
					items: [],
					selectionListConfig: {
						multiSelect: false,
						idProperty: 'Id',
						columns: basicsCostGroupsCatalogGridLayout,
					},
				},
				costGroupsStep: {
					items: [],
					selectionListConfig: {
						multiSelect: false,
						idProperty: 'Id',
						columns: basicsCostGroupGridLayout,
					}
				},
				selectedOption: null
				,
			};

			// Step 1 rows
			let step1Rows = [
				{
					gid: 'baseGroup',
					rid: 'GenerateActionsFor',
					label: 'Generate Actions For',
					label$tr$: 'project.main.generateActions',
					type: 'radio',
					model: 'generateActionsFor',
					required: true,
					canFinish: true,
					options: {
						labelMember: 'Description',
						valueMember: 'Value',
						groupName: 'generateProjectActionsConfig',
						items: [
							{
								Id: 1,
								Description: $translate.instant('project.main.isControllingUnit'),
								Value: 'isControllingUnit'
							},
							{
								Id: 2,
								Description: $translate.instant('project.main.isJob'),
								Value: 'isJob'
							},
							{
								Id: 3,
								Description: $translate.instant('project.main.isActivity'),
								Value: 'isActivity'
							},
							{
								Id: 4,
								Description: $translate.instant('project.main.isCostGroup'),
								Value: 'isCostGroup'
							}
						]
					}
				}
			];

			// Step 2 rows
			let step2Rows = [
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'schedulingLookupScheduleDataService',
					showClearButton: true,
					filter: function (item) {
						return item && item.ProjectFk !== null ?selectedProject.Id : -1;
					}
				},
				{
					gid: 'baseGroup',
					rid: 'schedule',
					label: 'Schedule',
					label$tr$: 'schedule.main.entitySchedule',
					type: 'integer',
					model: 'scheduleFk',
					sortOrder: 8,
					visible: true,
					readonly: false
				}),
				{
					gid: 'baseGroup',
					rid: 'selectFromAndToSource',
					label: 'Select the valid from and to source fields',
					label$tr$: 'project.main.selectFromAndToSource',
					sortOrder: 9,
					type: 'select',
					model: 'selectFromAndToSource',
					options: {
						items: [
							{id: 0, description: '',Value:0},
							{id: 1, description: $translate.instant('project.main.plannedStartFinish'),Value:1},
							{id: 2, description: $translate.instant('project.main.earliestStartFinish'),Value:2},
							{id: 3, description: $translate.instant('project.main.latestStartFinish'),Value:3},
							{id: 4, description: $translate.instant('project.main.actualStartFinish'),Value:4},
							{id: 5, description: $translate.instant('project.main.currentStartFinish'),Value:5}
						],
						valueMember: 'id',
						displayMember: 'description',
					}
				}
			];

			// Step 1 definition
			let stepOne = {
				id: 'generateActionsStep1',
				title$tr$: 'project.main.createProjectActionsFor',
				form: {
					fid: 'project.main.createProjectActionsFor',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'baseGroup',
						attributes: ['generateActionsFor']
					}],
					rows: step1Rows
				},
				disallowBack: true,
				disallowNext: true,
				canFinish: false,
				watches: [{
					expression: 'generateActionsFor',
					fn: function (info) {
						let schedule = _.find(info.wizard.steps[1].form.rows, { rid: 'schedule' });

						switch (info.newValue) {
							case 'isControllingUnit':
								schedule.required = false;
								info.wizard.steps[0].canFinish = true;
								dataItem.selectedOption = 1;
								break;
							case 'isJob':
								schedule.required = false;
								info.wizard.steps[0].canFinish = true;
								dataItem.selectedOption = 2;
								break;
							case 'isActivity':
								schedule.required = true;
								info.wizard.steps[0].canFinish = false;
								info.wizard.steps[1].disallowNext = true;
								dataItem.selectedOption = 3;
								break;
							case 'isCostGroup':
								schedule.required = false;
								info.wizard.steps[0].canFinish = false;
								info.wizard.steps[1].disallowNext = false;
								dataItem.selectedOption = 4;
								// overwrite next step

								break;
							default:
								console.log('Unexpected generateActionsForValue "${info.newValue}"');
						}
						info.wizard.steps[0].disallowNext = info.wizard.steps[0].canFinish;
						info.scope.$broadcast('form-config-updated');
					}
				}]
			};

			// Step 2.1 definition
			let stepTwo = {
				id: 'generateActionsStep2',
				title$tr$: 'project.main.createProjectActionsConfig',
				form: {
					fid: 'project.main.createProjectActionsConfig',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'baseGroup',
					}],
					rows: step2Rows
				},
				disallowBack: false,
				disallowNext: true,
				canFinish: true,
				watches: [{
					expression: 'selectFromAndToSource',
					fn: function (info){
						selectFromAndToSourceCode = info.newValue;
					}
				}]
			};

			stepTwo.prepareStep = function (info){
				if (dataItem.selectedOption === 4 && info.previousStepIndex===0) {
					info.commands.goToNext();
				}
				if(info.previousStepIndex===2){
					info.commands.goToPrevious();
				}
			};

			// Step 2.2 definition
			let costGroupCatalogStep = platformWizardDialogService.createListStep({
				title$tr$: 'project.main.choosecostgroupcatalog',
				stepId: 'costGroupCatalogStep',
				model: 'costGroupCatalogStep',
			});

			costGroupCatalogStep.prepareStep = function (info){
				getFilteredList(1,null).then(function (costGroupCatalogs){
					dataItem.costGroupCatalogStep.items = costGroupCatalogs;
					markItemsAsModified(dataItem.costGroupCatalogStep.items);
					costGroupCatalogStep.canFinish = true;
					costGroupCatalogStep.disallowNext = false;
					costGroupCatalogStep.cssClass = '';
				});
			};

			// Step 3 definition
			let costGroupStep = platformWizardDialogService.createListStep({
				title$tr$: 'project.main.choosecostgroup',
				stepId: 'costGroupsStep',
				model: 'costGroupsStep',
			});

			costGroupStep.prepareStep = function (info){
				let selectedCostGroupCatalog = _.filter(dataItem.costGroupCatalogStep.items, { isSelectedForRecordCreation: true });
				// Throw error when multiple selected ???
				if (selectedCostGroupCatalog.length === 0) {
					// No cost group catalog set
					let errorMessage = {
						showGrouping: true,
						bodyText: 'There is no Cost Group Catalog selected',
						iconClass: 'ico-info',
					};
					platformModalService.showDialog(errorMessage).then(function () {
						info.commands.goToPrevious();
					});
				}
				if (selectedCostGroupCatalog.length > 1) {
					// No cost group catalog set
					let errorMessage = {
						showGrouping: true,
						bodyText: 'There are too many Cost Group Catalogs selected',
						iconClass: 'ico-info',
					};
					platformModalService.showDialog(errorMessage).then(function () {
						info.commands.goToPrevious();
					});
				}
				throw getFilteredList(2,selectedCostGroupCatalog[0]).then(function (costGroups){
					dataItem.costGroupsStep.items = costGroups;
					markItemsAsModified(dataItem.costGroupsStep.items);
					costGroupStep.canFinish = true;
					costGroupStep.cssClass = '';
				});
			};
			function markItemsAsModified(filteredCostGroupList) {
				let areNewItems = true;
				if (_.isArray(filteredCostGroupList) && !_.isEmpty(filteredCostGroupList)) {
					_.each(filteredCostGroupList, function (costGroup) {
						if (costGroup.Version !== 0) {
							areNewItems = false;
							return areNewItems;
						}
					});
				}
				if (areNewItems) {
					basicsCostGroupDataService.setList(filteredCostGroupList);
				}
			}

			// wizard  config
			let actionsWizard = {
				id: 'actionsWizard',
				title$tr$: 'project.main.createProjectActionsTitle',
				steps: [stepOne,stepTwo,costGroupCatalogStep,costGroupStep],height: '800px'
			};

			platformWizardDialogService.translateWizardConfig(actionsWizard);
			platformWizardDialogService.showDialog(actionsWizard, dataItem).then(function (result) {
				if (result.success) {
					// check if 3rd step finish --> too many cost Groups
					let selectedCostGroupCatalog = _.filter(dataItem.costGroupCatalogStep.items, { isSelectedForRecordCreation: true });
					if (selectedCostGroupCatalog.length > 1) {
						// No cost group catalog set
						let errorMessage = {
							showGrouping: true,
							bodyText: 'There are too many Cost Group Catalogs selected',
							iconClass: 'ico-info',
						};
						platformModalService.showDialog(errorMessage).then(function () {
							return;
						});
					}
					const obj = {
						ProjectId: result.data.projectFk,
						ScheduleId: result.data.scheduleFk,
						ProjectIds: _.map(projectMainService.getSelectedEntities(), 'Id'),
						IsControllingUnit: result.data.generateActionsFor === 'isControllingUnit',
						IsJob: result.data.generateActionsFor === 'isJob',
						IsActivity: result.data.generateActionsFor === 'isActivity',
						FromAndToSourceCode: selectFromAndToSourceCode,
						CostGroupCatalogSelected: _.filter(dataItem.costGroupCatalogStep.items, { isSelectedForRecordCreation: true }),
						CostGroupsSelected: _.filter(dataItem.costGroupsStep.items, { isSelectedForRecordCreation: true })
					};

					$http.post(globals.webApiBaseUrl + 'project/main/createdprojectactions', obj).then(function (result) {
						if (result.data.length > 0) {
							let modalOptions = {
								headerTextKey: 'project.main.generateProjectActions',
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
							platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage(actionsWizard.title$tr$);
						}
					});
				}
			});
		};

		// Get data for grid in generate ACtion Wizard
		function getFilteredList(filterType,costGroupCatalogToFilterFor) {
			// filterTyp 1 = Catalog , 2 = Cost Group To Catalog


			if (filterType === 1){
				var sendType = {
					ExecutionHints:	false,
					filter:	'',
					IncludeNonActiveItems:	false,
					isReadingDueToRefresh:	false,
					PageNumber:	0,
					PageSize:	700,
					Pattern:	null,
					PinningContext:	[],
					ProjectContextId:	null,
					UseCurrentClient:	null,
					UseCurrentProfitCenter:	null
				};

				return $http.post(globals.webApiBaseUrl + 'basics/costgroupcat/listfiltered',sendType).then(function (response) {
					if (response && response.data.dtos !== null) {
						return response.data.dtos;
					}
				});
			}else if(filterType === 2) {
				var sendType = {
					PKey1: costGroupCatalogToFilterFor.Id
				};

				return $http.post(globals.webApiBaseUrl + 'basics/CostGroups/costgroup/tree',sendType).then(function (response) {
					if (response && response.data !== null) {
						return response.data;
					}
				});
			}
		}
		function showMessage(prj, result) {
			let bodyTextKey;
			let headerTextKey;
			let iconClass = 'ico-error'; // error
			if (result && result.success === true) {
				headerTextKey = 'project.main.creationSuccess';
				iconClass = 'ico-info';
				bodyTextKey = headerTextKey;
			} else if (!prj) {
				headerTextKey = 'project.main.creationErrorNoProjectSelectedTitle';
				bodyTextKey = 'project.main.creationErrorNoProjectSelected';
			} else {
				headerTextKey = 'project.main.creationErrorNoProjectSelectedTitle';
				bodyTextKey = 'project.main.creationError';
			}
			platformModalService.showMsgBox(bodyTextKey, headerTextKey, iconClass);
		}

		/* ////////////////////////////////////////////////////// CHANGE PROJECT PHASE//////////////////////////////////////////////////////////////// */
		this.changeProjectPhase = function changeProjectPhase(){
			let titleKey = 'project.main.changeProjectPhaseTitleWizard.title';
			let selectedProject = projectMainService.getSelected();
			if (!selectedProject) {
				showMessage('', false);
			}

			let step1Rows = [
				{
					gid: 'baseGroup',
					rid: 'targetPhase',
					label:'Target phase',
					label$tr$: 'project.main.targetPhase',
					type: 'description',
					readonly: true,
					model: 'phaseChangeConfiguration.targetPhase',
					sortOrder: 1,
					formatter: function(row, cell, value /*, columnDef, dataContext, plainText, uniqueId*/) {
						let result = value;
						if(_.isNumber(value)) {
							switch(value) {
								case 1: result = $translate.instant('project.main.projectPhaseBid'); break;
								case 2: result = $translate.instant('project.main.projectPhaseContract'); break;
								case 3: result = $translate.instant('project.main.projectPhaseExecution'); break;
								case 4: result = $translate.instant('project.main.projectPhaseWarranty'); break;
							}
						}

						return result;
					}
				}, {
					gid: 'baseGroup',
					rid: 'stateShouldBeChanged',
					label:'State should be changed',
					label$tr$: 'project.main.stateShouldBeChanged',
					type: 'boolean',
					model: 'phaseChangeConfiguration.stateShouldBeChanged',
					sortOrder: 3,
					readonly: true
				}, {
					gid: 'baseGroup',
					rid: 'targetWithProjectAlternatives',
					label:'Target with project alternatives',
					label$tr$: 'project.main.targetWithProjectAlternatives',
					type: 'boolean',
					model: 'phaseChangeConfiguration.targetWithProjectAlternatives',
					sortOrder: 4
				}, {
					gid: 'baseGroup',
					rid: 'deleteAdvancedAllowance',
					label:'Delete advanced allowance',
					label$tr$: 'project.main.deleteAdvancedAllowance',
					type: 'boolean',
					model: 'phaseChangeConfiguration.deleteAdvancedAllowance',
					sortOrder: 5
				}
			];

			let step2Rows = [
				{
					gid: 'baseGroup',
					rid: 'projectAlternatives',
					type: 'directive',
					directive: 'project-main-phase-selection-grid-directive',
					sortOrder: 2
				}
			];

			let step3Rows = [
				{
					gid: 'baseGroup',
					rid: 'base',
					label:'Base items',
					label$tr$: 'project.main.resetAQQuantities.base',
					type: 'boolean',
					model: 'phaseChangeConfiguration.resetAQQuantities.base',
					sortOrder: 1
				},
				{
					gid: 'baseGroup',
					rid: 'alternative',
					label:'Alternative items',
					label$tr$: 'project.main.resetAQQuantities.alternative',
					type: 'boolean',
					model: 'phaseChangeConfiguration.resetAQQuantities.alternative',
					sortOrder: 2
				},
				{
					gid: 'baseGroup',
					rid: 'optionalNoTotal',
					label:'Optional items without item total',
					label$tr$: 'project.main.resetAQQuantities.optionalNoTotal',
					type: 'boolean',
					model: 'phaseChangeConfiguration.resetAQQuantities.optionalNoTotal',
					sortOrder: 3
				},
				{
					gid: 'baseGroup',
					rid: 'priceRequest',
					label:'Price Requests',
					label$tr$: 'project.main.resetAQQuantities.priceRequest',
					type: 'boolean',
					model: 'phaseChangeConfiguration.resetAQQuantities.priceRequest',
					sortOrder: 4
				},
				{
					gid: 'baseGroup',
					rid: 'optionalTotal',
					label:'Optional items with item total',
					label$tr$: 'project.main.resetAQQuantities.optionalTotal',
					type: 'boolean',
					model: 'phaseChangeConfiguration.resetAQQuantities.optionalTotal',
					sortOrder: 5
				},
				{
					gid: 'baseGroup',
					rid: 'dwtm',
					label:'DW/T+M items',
					label$tr$: 'project.main.resetAQQuantities.dwtm',
					type: 'boolean',
					model: 'phaseChangeConfiguration.resetAQQuantities.dwtm',
					sortOrder: 6
				},
			];

			let step4Rows = [
				{
					gid: 'baseGroup',
					rid: 'fromEstimate',
					label:'Generate budgets from estimate',
					label$tr$: 'project.main.budgets.fromEstimate',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.fromEstimate',
					sortOrder: 1
				},
				{
					gid: 'baseGroup',
					rid: 'fixedBudgets',
					label:'Generate fixed budgets for estimate details in assemblies',
					label$tr$: 'project.main.budgets.fixedBudgets',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.fixedBudgets',
					sortOrder: 2
				},
				{
					gid: 'baseGroup',
					rid: 'inclPercDiscounts',
					label:'Include percentage discounts in budgets of contract BoQ',
					label$tr$: 'project.main.budgets.inclPercDiscounts',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.inclPercDiscounts',
					sortOrder: 3
				},
				{
					gid: 'baseGroup',
					rid: 'copyDirectJobCosts',
					label:'Copy current direct job costs as original direct job costs',
					label$tr$: 'project.main.budgets.copyDirectJobCosts',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.copyDirectJobCosts',
					sortOrder: 4
				},
				{
					gid: 'baseGroup',
					rid: 'lumpSumBudgetNull',
					label:'Set budget of lump sum items without item total to 0',
					label$tr$: 'project.main.budgets.lumpSumBudgetNull',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.lumpSumBudgetNull',
					sortOrder: 5
				},
				{
					gid: 'baseGroup',
					rid: 'fixedContractLumpSum',
					label:'Set calculated budgets as fixed budgets on the level of contract lump sums',
					label$tr$: 'project.main.budgets.fixedContractLumpSum',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.fixedContractLumpSum',
					sortOrder: 6
				},
				{
					gid: 'baseGroup',
					rid: 'fixedDirectLumpSum',
					label:'Set calculated budgets as fixed budgets on the level of direct lump sum items',
					label$tr$: 'project.main.budgets.fixedDirectLumpSum',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.fixedDirectLumpSum',
					sortOrder: 7
				},
				{
					gid: 'baseGroup',
					rid: 'fixedNoLumpSum',
					label:'Set calculated budgets as fixed budgets on the level of not lump sum items',
					label$tr$: 'project.main.budgets.fixedNoLumpSum',
					type: 'boolean',
					resizeable: true,
					model: 'phaseChangeConfiguration.budgets.fixedNoLumpSum',
					sortOrder: 8
				},
				{
					gid: 'baseGroup',
					rid: 'fixedIndirectLumpSum',
					label:'Set calculated budgets as fixed budgets on the level of indirect lump sum items',
					label$tr$: 'project.main.budgets.fixedIndirectLumpSum',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.fixedIndirectLumpSum',
					sortOrder: 9
				},
				{
					gid: 'baseGroup',
					rid: 'fixedEstimateDetail',
					label:'Set calculated budgets as fixed budgets on the level of estimate details',
					label$tr$: 'project.main.budgets.fixedEstimateDetail',
					type: 'boolean',
					model: 'phaseChangeConfiguration.budgets.fixedEstimateDetail',
					sortOrder: 10
				}
			];

			if(selectedProject !== null){
				$http.post(globals.webApiBaseUrl + 'project/main/phase/configuration', selectedProject).then(function (result) {
					if(result && result.data && result.data.Result.Success){
						projectMainPhaseSelectionDataService.takeProjectAlternatives(result.data.ProjectAlternatives);

						let dataItem = {
							phaseChangeConfiguration:{
								project: selectedProject,
								projectCanBeHandled: result.data.Result.Success,
								stateShouldBeChanged: true,// result.data.StateShouldBeChanged,
								targetPhase: result.data.TargetPhase,
								projectAlternatives: null,
								targetWithProjectAlternatives: result.data.TargetWithProjectAlternatives,
								deleteAdvancedAllowance: result.data.DeleteAdvancedAllowance,
								resetAQQuantities: {
									base: result.data.ResetAQQuantities.Base,
									alternative: result.data.ResetAQQuantities.Alternative,
									optionalNoTotal: result.data.ResetAQQuantities.OptionalNoTotal,
									priceRequest: result.data.ResetAQQuantities.PriceRequest,
									optionalTotal: result.data.ResetAQQuantities.OptionalTotal,
									dwtm: result.data.ResetAQQuantities.DWTM
								},
								budgets: {
									fromEstimate: result.data.Budgets.FromEstimate,
									fixedBudgets: result.data.Budgets.FixedBudgets,
									inclPercDiscounts: result.data.Budgets.InclPercDiscounts,
									copyDirectJobCosts: result.data.Budgets.CopyDirectJobCosts,
									lumpSumBudgetNull: result.data.Budgets.LumpSumBudgetNull,
									fixedContractLumpSum: result.data.Budgets.FixedContractLumpSum,
									fixedDirectLumpSum: result.data.Budgets.FixedDirectLumpSum,
									fixedNoLumpSum: result.data.Budgets.FixedNoLumpSum,
									fixedIndirectLumpSum: result.data.Budgets.FixedIndirectLumpSum,
									fixedEstimateDetail: result.data.Budgets.FixedEstimateDetail
								}
							}
						};
						let changeProjectPhaseWizard = {
							id: 'projectMainWizard',
							title: $translate.instant(titleKey),
							steps: [
								{
									id: 'phaseChangeConfiguration',
									title$tr$: 'project.main.changeProjectPhaseTitleWizard.step1Title',
									form: {
										fid: 'project.main.phaseChangeConfiguration',
										version: '1.0.0',
										showGrouping: false,
										skipPermissionsCheck: true,
										groups: [
											{
												gid: 'baseGroup'
											}
										],
										rows: step1Rows
									},
									disallowBack: false,
									disallowNext: false,
									canFinish: false,
									watches: [],
								},
								{
									id: 'phaseChangeAlternativeSelection',
									title$tr$: 'project.main.changeProjectPhaseTitleWizard.step2Title',
									form: {
										fid: 'project.main.phaseChangeAlternativeSelection',
										version: '1.0.0',
										showGrouping: false,
										skipPermissionsCheck: true,
										groups: [
											{
												gid: 'baseGroup'
											}
										],
										rows: step2Rows
									},
									disallowBack: false,
									disallowNext: false,
									canFinish: false,
									watches: [],
								},
								{
									id: 'resetAQQuantitiesConfiguration',
									title$tr$: 'project.main.changeProjectPhaseTitleWizard.step3Title',
									form: {
										fid: 'project.main.resetAQQuantitiesConfiguration',
										version: '1.0.0',
										showGrouping: false,
										skipPermissionsCheck: true,
										groups: [
											{
												gid: 'baseGroup'
											}
										],
										rows: step3Rows
									},
									disallowBack: false,
									disallowNext: false,
									canFinish: true,
									prepareStep:  function prepareStep(info) {
										if ((!info.model.phaseChangeConfiguration.projectCanBeHandled)){
											info.commands.goToPrevious();
											platformModalService.showErrorBox('project.main.changeProjectPhaseTitleWizard.ErrorProjectCanNotBeHandled');
										}
										if(info.model.phaseChangeConfiguration.targetPhase !== 3){
											info.step.disallowNext = true;
										}
									},
									watches: [],
								}
							]
						};

						if(dataItem.phaseChangeConfiguration.targetPhase === 3) {
							changeProjectPhaseWizard.steps.push({
								id: 'budgetConfiguration',
								title$tr$: 'project.main.changeProjectPhaseTitleWizard.step4Title',
								form: {
									fid: 'project.main.budgetConfiguration',
									version: '1.0.0',
									showGrouping: false,
									skipPermissionsCheck: true,
									groups: [
										{
											gid: 'baseGroup'
										}
									],
									rows: step4Rows
								},
								disallowBack: false,
								disallowNext: false,
								canFinish: true,
								watches: [],
							});
						}

						platformWizardDialogService.translateWizardConfig(changeProjectPhaseWizard);
						platformWizardDialogService.showDialog(changeProjectPhaseWizard, dataItem).then(function (result) {
							if (result.success) {
								let finalConf = result.data.phaseChangeConfiguration;
								const phaseChangeConfig = {
									Project: selectedProject,
									StateShouldBeChanged: true,// finalConf.stateShouldBeChanged,
									TargetPhase: finalConf.targetPhase,
									ProjectAlternatives: projectMainPhaseSelectionDataService.getProjectAlternatives(),
									TargetWithProjectAlternatives: finalConf.targetWithProjectAlternatives,
									DeleteAdvancedAllowance: finalConf.deleteAdvancedAllowance,
									ResetAQQuantities: {
										Base: finalConf.resetAQQuantities.base,
										Alternative: finalConf.resetAQQuantities.alternative,
										OptionalNoTotal: finalConf.resetAQQuantities.optionalNoTotal,
										PriceRequest: finalConf.resetAQQuantities.priceRequest,
										OptionalTotal: finalConf.resetAQQuantities.optionalTotal,
										DWTM: finalConf.resetAQQuantities.dwtm
									},
									Budgets: {
										FromEstimate: finalConf.budgets.fromEstimate,
										FixedBudgets: finalConf.budgets.fixedBudgets,
										InclPercDiscounts: finalConf.budgets.inclPercDiscounts,
										CopyDirectJobCosts: finalConf.budgets.copyDirectJobCosts,
										LumpSumBudgetNull: finalConf.budgets.lumpSumBudgetNull,
										FixedContractLumpSum: finalConf.budgets.fixedContractLumpSum,
										FixedDirectLumpSum: finalConf.budgets.fixedDirectLumpSum,
										FixedNoLumpSum: finalConf.budgets.fixedNoLumpSum,
										FixedIndirectLumpSum: finalConf.budgets.fixedIndirectLumpSum,
										FixedEstimateDetail: finalConf.budgets.fixedEstimateDetail
									}
								};
								$http.post(globals.webApiBaseUrl + 'project/main/phase/change', phaseChangeConfig).then(function (response) {
									if (response && response.data && response.data.Result.Success) {
										let modalOptions = {
											headerTextKey: $translate.instant('project.main.changeProjectPhaseTitleWizard.title'),
											bodyTextKey: $translate.instant('project.main.changeProjectPhaseTitleWizard.doneSuccess'),
											showOkButton: true,
											showCancelButton: true,
											resizeable: true,
											height: '500px',
											iconClass: 'info'
										};
										platformModalService.showDialog(modalOptions);
									}
									else {
										// something happened
										platformModalService.showMsgBox(
											result.data.Result.Information,
											$translate.instant('project.main.changeProjectPhaseTitleWizard.title'),
											'warning');
									}
								});
							}
						});
					}
					else {
						platformModalService.showMsgBox(
							result.data.Result.Information,
							$translate.instant('project.main.changeProjectPhaseTitleWizard.title'),
							'info');
					}
				});
			}
		};


		// /////////////////////////////////////
		function updateMaterialPricesFromYtwo() {
			if (!projectMainService.hasSelection()) {

				let bodyText = $translate.instant('project.main.noCurrentSelection');
				let headerText = $translate.instant('project.main.updateMaterialPricesFromYtwo');

				platformModalService.showMsgBox(bodyText, headerText, 'ico-info');
				return;
			}
			projectMainService.updateAndExecute(function () {
				let selectedPrj = projectMainService.getSelected();
				let selectedPrjId = selectedPrj && angular.isDefined(selectedPrj.Id) ? selectedPrj.Id : null;
				let modalOptions = {
					headerText: $translate.instant('project.main.updateMaterialPricesFromYtwo'),
					updateBtn: $translate.instant('project.main.update'),
					gridId: '349333cd7b0e4cfea6096ab0947d776e',
					getUrl: 'project/material/getmaterialsfromytwo?prjId=',
					getRequestParams: selectedPrjId,
					updateUrl: 'project/material/updatepricefromytwo',
					updateRequestParams: {
						ProjectId: selectedPrjId,
						NewEntities: '##updateData##'
					},
					customMapData: function customMapData(result) {
						return {
							ListPrice: result.ListPrice,
							RetailPrice: result.RetailPrice,
							Discount: result.Discount,
							Charges: result.Charges,
							PriceExtra: result.PriceExtra,
							PriceConditionFk: result.PriceConditionFk,
							PriceConditions: result.PriceConditions
						};
					},
					templateUrl: globals.appBaseUrl + 'basics.material/templates/wizards/update-prices-from-ytwo.html',
					resizeable: true,
					width: '800px',
					windowClass: 'form-modal-dialog',
					showCancelButton: true
				};

				platformModalService.showDialog(modalOptions).then(function (result) {
					if (!result) {
						return;
					}
					if (result.success) {
						platformModalService.showMsgBox($translate.instant('project.main.updateMaterialPricesSuccess'), $translate.instant('project.main.updateMaterialPricesFromYtwo'), 'ico-info').then(function (response) {
							if (response.ok === true) {
								projectMainService.deselect();
								projectMainService.load().then(function () {
									projectMainService.setSelected(selectedPrj);
									projectMainService.gridRefresh();
								});
							}
						});
					} else if (result.success === false) {
						platformModalService.showMsgBox($translate.instant('project.main.updateMaterialPricesFailed'), $translate.instant('project.main.updateMaterialPricesFromYtwo'), 'ico-info'); // jshint ignore:line
					}
				});
			});
		}

		this.changeProjectGroup = function changeProjectGroup() {
			let titleKey = 'project.main.entityChangeProjectGroup';
			let selectedProject = projectMainService.getSelected();

			// Dialog or Error Dialog
			if (selectedProject) {
				let changeProjectGroupConfig = {
					title: $translate.instant(titleKey),
					dataItem: {
						ProjectNo: selectedProject.ProjectNo,
						ProjectName: selectedProject.ProjectName,
						ProjectName2: selectedProject.ProjectName2,
						Group: selectedProject.ProjectGroupFk,
						NewGroup: null
					},
					formConfiguration: {
						fid: 'project.main.changeProjectGroup',
						version: '1.0.0',
						showGrouping: false,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['ProjectNo', 'ProjectName', 'ProjectName2', 'Group', 'NewGroup']
							}
						],
						rows: [
							{
								gid: 'baseGroup',
								rid: 'ProjectNo',
								model: 'ProjectNo',
								label$tr$: 'project.main.projectNo',
								type: 'code',
								sortOrder: 1,
								readonly: true
							},
							{
								gid: 'baseGroup',
								rid: 'ProjectName',
								model: 'ProjectName',
								label$tr$: 'cloud.common.entityName',
								type: 'description',
								sortOrder: 2,
								readonly: true
							},
							{
								gid: 'baseGroup',
								rid: 'ProjectName2',
								model: 'ProjectName2',
								label$tr$: 'project.main.name2',
								type: 'description',
								sortOrder: 3,
								readonly: true
							},
							{
								gid: 'baseGroup',
								rid: 'Group',
								model: 'Group',
								label$tr$: 'project.main.entityProjectGroup',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-group-data-dialog',
									descriptionMember: 'DescriptionInfo.Description'
								},
								sortOrder: 4,
								readonly: true
							},
							{
								gid: 'baseGroup',
								rid: 'NewGroup',
								model: 'NewGroup',
								label$tr$: 'project.main.entityNewProjectGroup',
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'project-group-data-dialog',
									descriptionMember: 'DescriptionInfo.Description'
								},
								sortOrder: 5,
							}
						]
					},
					handleOK: function handleOK(result) {
						if (result.ok === true) {
							let project = projectMainService.getSelected();
							let action = {
								Action: 7,
								Project: project,
								NewProjectGroup: result.data.NewGroup
							};
							checkProjectInBaselineAndExecute(project, action, 'project.main.wizardChangeProjectGroupInfoMsg', titleKey);
						}
					},
					dialogOptions: {
						disableOkButton: function () {
							return _.isNil(changeProjectGroupConfig.dataItem.NewGroup);
						}
					}
				};

				// Show Dialog
				platformTranslateService.translateFormConfig(changeProjectGroupConfig.formConfiguration);
				platformModalFormConfigService.showDialog(changeProjectGroupConfig);
			} else {

				// Error MessageText
				let modalOptions = {
					headerText: titleKey,
					bodyText: $translate.instant('cloud.common.noCurrentSelection'),
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);

			}
		};

		this.convertAddressGeoCoordinate = function convertAddressGeoCoordinate() {
			let selectedPrjs = projectMainService.getSelectedEntities();
			if (!selectedPrjs || selectedPrjs.length < 1) {
				return platformModalService.showMsgBox('project.main.geographicLocationInfo.selectError',
					'basics.common.geographicLocationInfo.title', 'ico-info');
			}

			let ids = _.map(selectedPrjs, 'Id');

			projectMainAddressTcoGeoLocationService.getProjectcAddresses(ids)
				.then(function (entityAddresses) {
					basicsCommonAddressGeoLocationConvertService.showDialog({
						custom: {
							data: entityAddresses,
							additionalColumns: [
								{
									id: 'addressConvertProjectNo',
									field: 'projectNo',
									name: 'Project No.',
									name$tr$: 'project.main.projectNo',
									formatter: 'description',
									width: 120
								},
								{
									id: 'addressConvertProject2AddressDesc',
									field: 'project2AddressDescription',
									name: 'Project Address Description',
									name$tr$: 'project.main.geographicLocationInfo.projectAddressDescription',
									formatter: 'description',
									width: 120
								}
							]
						},
						okCallback: function () {
							projectMainService.refresh();
						}
					});
				});
		};
		this.generateActionEmployees = function generateActionEmployees(){
			// get Project
			let selectedProject = projectMainService.getSelected();
			if (!selectedProject) {
				showMessage('', false);
				return;
			}
			// build step wizard --> 1 step with 2 check boxes --> second step if nothing is selected
			let dataItem = {
				stepOneCheckboxes:{
					fromPlanningBoard: false,
					fromClerk: false
				},
				stepTwoCheckbox:{
					allEmployees: false
				},
				optionSelected: 4
			};

			let step1Rows = [
				{
					gid: 'baseGroup',
					rid: 'planningBoard',
					label:'Consider Logistic Jobs from planning board',
					label$tr$: 'project.main.fromPlanningBoard',
					type: 'boolean',
					model: 'stepOneCheckboxes.fromPlanningBoard',
					sortOrder: 1
				},
				{
					gid: 'baseGroup',
					rid: 'clerks',
					label:'Consider only clerks of this project',
					label$tr$: 'project.main.fromClerk',
					type: 'boolean',
					model: 'stepOneCheckboxes.fromClerk',
					sortOrder: 2
				}
			];
			let step2Rows = [
				{
					gid: 'baseGroup',
					rid: 'allEmployees',
					label:'Do you want to add all employees to all actions ?',
					label$tr$: 'project.main.allEmployees',
					resizeable: true,
					type: 'boolean',
					model: 'stepTwoCheckbox.allEmployees',
					sortOrder: 1
				}
			];
			let step1 = {
				id: 'stepOneCheckboxes',
				title$tr$: 'project.main.generateActionEmployeesWizard.step1Title',
				form: {
					fid: 'project.main.generateActionEmployeesWizard.step1Title',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'baseGroup'
					}],
					rows: step1Rows
				},
				disallowBack: true,
				disallowNext: false,
				canFinish: false,
				watches: [{
					expression: 'stepOneCheckboxes.fromPlanningBoard',
					fn: function (info) {
						let selectFromAndToSourceCode = info.newValue;
						checkStatus(info);
					}
				},{
					expression: 'stepOneCheckboxes.fromClerk',
					fn: function (info) {
						let selectFromAndToSourceCode = info.newValue;
						checkStatus(info);
					}}
				]
			};

			let step2 = {
				id: 'stepOneCheckboxes',
				title$tr$: 'project.main.generateActionEmployeesWizard.step2Title',
				form: {
					fid: 'project.main.generateActionEmployeesWizard.step2Title',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'baseGroup'
					}],
					rows: step2Rows
				},
				disallowBack: false,
				disallowNext: false,
				canFinish: false,
				watches: [{
					expression: 'stepTwoCheckbox.allEmployees',
					fn: function (info) {
						if (info.model.stepTwoCheckbox.allEmployees === true){
							info.wizard.steps[1].canFinish = true;
						}else {
							info.wizard.steps[1].canFinish = false;
						}
					}
				}]
			};

			let generateActionEmployeesWizard = {
				id: 'projectMainWizard',
				title: $translate.instant('project.main.generateActionEmployeesWizard.generateActionEmployeesWizardTitle'),
				steps: [step1,step2],height: '800px'
			};

			platformWizardDialogService.translateWizardConfig(generateActionEmployeesWizard);
			platformWizardDialogService.showDialog(generateActionEmployeesWizard,dataItem).then(function (result) {
				if (result.success) {
					// servercall
					var obj = {
						projectId: selectedProject.Id,
						selectedOption: result.data.optionSelected
					};
					$http.post(globals.webApiBaseUrl + 'project/main/action/createActionEmployees',obj).then(function (result) {
						if (result.data !== null) {
							platformModalService.showMsgBox('Number of newly created action employees: ' + result.data, 'Wizard executed successfully! ', 'ico-info');
							return;
						}
					});
				}
			}
			);
		};
		function checkStatus(info){
			var fromplanningBoard = info.model.stepOneCheckboxes.fromPlanningBoard;
			var clerk = info.model.stepOneCheckboxes.fromClerk;
			// Case 1 + 2 + 3
			if (fromplanningBoard === true && clerk === false || fromplanningBoard === false && clerk === true || fromplanningBoard === true && clerk === true){
				info.wizard.steps[0].canFinish = true;
				info.wizard.steps[0].disallowNext = true;
				info.scope.$broadcast('form-config-updated');
				if (fromplanningBoard === false){
					info.model.optionSelected = 2;
				}else if (clerk === false){
					info.model.optionSelected = 1;
				}else {
					info.model.optionSelected = 3;
				}

				return;
			}else // Case 4
			if (fromplanningBoard === false && clerk === false){
				info.wizard.steps[0].canFinish = false;
				info.wizard.steps[0].disallowNext = false;
				info.scope.$broadcast('form-config-updated');
				info.model.optionSelected = 4;
			}
		}
	}
})(angular);
