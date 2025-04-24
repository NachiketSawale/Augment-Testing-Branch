(function (angular) {
	'use strict';

	let moduleName = 'project.main';
	angular.module(moduleName).service('projectMainCardChangeWOTOfAssignedPlantWizardService', ProjectMainCardChangeWOTOfAssignedPlantWizardService);

	ProjectMainCardChangeWOTOfAssignedPlantWizardService.$inject = [
		'_', '$http', '$q', '$translate', 'platformWizardDialogService', 'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataConfigGenerator', 'resourceCommonContextService',
		'projectMainManagedPlantLocService', 'platformModalService', 'projectMainService'];

	function ProjectMainCardChangeWOTOfAssignedPlantWizardService(
		_, $http, $q, $translate, platformWizardDialogService, platformRuntimeDataService,
		basicsLookupdataLookupFilterService, basicsLookupdataConfigGenerator, resourceCommonContextService,
		projectMainManagedPlantLocService, platformModalService, projectMainDataService) {
		let service = {};
		let self = this;
		self.workOperationFks = [];
		let changeWOTOfAssignedPlantData = {};
		let initChangeWOTOfAssignedPlantData = function initChangeWOTOfAssignedPlantData() {
			changeWOTOfAssignedPlantData = {
				wizardData: {
					select: {
						RubricCategoryFk: null,
						WorkoperationTypeFk: null,
						EffectiveDate: null
					},
					result: { Message: '' }
				}
			};
		};
		let initWOT = function initWOT() {
			changeWOTOfAssignedPlantData.wizardData.select.WorkoperationTypeFk = null;
		};
		initChangeWOTOfAssignedPlantData();
		let post = function post(relScope, elem) {
			return $http.post(globals.webApiBaseUrl + relScope, elem);
		};

		let validateSelectStep = function validateSelectStep(info) {
			let selectStep = _.find(info.wizard.steps, step => step.id === 'select');
			let select = info.model.wizardData.select;
			selectStep.disallowNext = _.isNil(select.RubricCategoryFk) || _.isNil(select.WorkoperationTypeFk) || _.isNil(select.EffectiveDate);
		};

		let asyncGetUnionOfAvailableWOTFksFromPlants = function asyncGetUnionOfAvailableWOTFksFromPlants(plantFks) {
			let promises = [
				resourceCommonContextService.init(),
				post('resource/wot/workoperationtype/getworkoperationtypbycontextandplants', plantFks)
			];
			return $q.all(promises).then(function (response) {
				let wots = response[1].data;
				let context = response[0];
				return _.map(_.filter(wots, w => w.EquipmentContextFk === context.EquipmentContextFk), w => w.Id);
			});
		};
		let showModalDialog = function showModalDialog(title, message) {
			let modalOptions = {
				headerText: $translate.instant(title),
				bodyText: $translate.instant(message),
				iconClass: 'ico-info'
			};
			return platformModalService.showDialog(modalOptions);
		};
		let showDialogNoPlantLocationsSelected = function showDialogNoPlantLocationsSelected() {
			return showModalDialog(
				'logistic.job.changeWOTOfDispatchNotesWizard.title',
				'logistic.job.changeWOTOfDispatchNotesWizard.noPlantLocationsSelected');
		};



		let getFirstWizardStep = function getFirstWizardStep() {
			let rubricCategoryRow = {
				gid: 'select',
				rid: 'rubricCategoryFk',
				model: 'wizardData.select.RubricCategoryFk',
				sortOrder: 1,
				label$tr$: 'resource.requisition.dispatchingWizard.entityRubric',
				label: 'Rubric Category',
				type: 'directive',
				directive: 'basics-lookupdata-lookup-composite',
				options: {
					lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
					descriptionMember: 'Description',
					lookupOptions: {
						filterKey: 'dispatch-nodes-rubric-category-lookup-filter',
						showClearButton: true
					}
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'RubricCategoryByRubricAndCompany',
					displayMember: 'Description'
				}
			};
			let workOperationTypeRow = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm(
				'resource.wot.workoperationtype',
				'Description',
				{
					gid: 'select',
					rid: 'workoperationTypeFk',
					model: 'wizardData.select.WorkoperationTypeFk',
					required: true,
					sortOrder: 1,
					label$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.entityWorkoperationType',
					label: 'Work Operation Type',
					showClearButton: false,
				},
				false,
				{
					filterKey: 'resource-wot-by-plant-type-filter',
				});
			let effectiveDateRow = {
				gid: 'select',
				rid: 'EffectiveDate',
				label: 'Effective Date',
				label$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.entityEffectiveDate',
				required: true,
				type: 'dateutc',
				model: 'wizardData.select.EffectiveDate',
				sortOrder: 4
			};
			return {
				id: 'select',
				title: 'Preselecting...',
				title$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.title',
				disallowNext: true,
				form: {
					fid: 'wzExample.nameForm',
					version: '1.0.0',
					showGrouping: true,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'select',
						header: 'Preselecting...',
						header$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.selectGroupTittle',
						isOpen: true
					}],
					rows: [
						rubricCategoryRow,
						workOperationTypeRow,
						effectiveDateRow
					]
				},
				watches:
					[{
						expression: 'wizardData.select.RubricCategoryFk',
						fn: function (info) {
							validateSelectStep(info);
						}
					}, {
						expression: 'wizardData.select.WorkoperationTypeFk',
						fn: function (info) {
							validateSelectStep(info);
						}
					}, {
						expression: 'wizardData.select.EffectiveDate',
						fn: function (info) {
							validateSelectStep(info);
						}
					}]
			};
		};
		let getSecondWizardStep = function getSecondWizardStep() {
			return {
				id: 'process',
				title: 'Processing...',
				title$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.ProcessingTitle',
				disallowNext: true,
				disallowBack: true,
				canFinish: false,
				disallowCancel: true,
				prepareStep: function (info) {
					let changeWOTOfAssignedPlantsData = {
						Locations: _.map(projectMainManagedPlantLocService.getSelectedEntities(), loc => { return { PlantFk: loc.PlantFk, PlantTypeFk: loc.PlantTypeFk , JobFk: loc.JobFk}; }),
						JobFk: -1
					};
					let promise = post('logistic/dispatching/header/changewotofassignedplants', Object.assign(changeWOTOfAssignedPlantsData, info.model.wizardData.select)).then(function (headerCode) {
						let resultStep = _.find(info.wizard.steps, step => step.id === 'result');
						resultStep.message = $translate.instant('logistic.job.changeWOTOfDispatchNotesWizard.EndMessageDescription') + headerCode.data;
						let processStep = _.find(info.wizard.steps, step => step.id === 'process');
						processStep.disallowNext = false;
						info.commands.goToNext();
					});
					initChangeWOTOfAssignedPlantData();
					return promise;
				},
				watches: []
			};
		};
		let getThirdWizardStep = function getThirdWizardStep() {
			return {
				id: 'result',
				title: 'Result',
				title$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.ResultTitle',
				disallowNext: true,
				canFinish: true,
				message: 'wizardData.result.Message',
				disallowBack: true,
				disallowCancel: true,
			};
		};
		let getWizardSteps = function getWizardSteps() {
			return [
				getFirstWizardStep(),
				getSecondWizardStep(),
				getThirdWizardStep()
			];
		};


		service.changeWOTOfAssignedPlant = function changeWOTOfAssignedPlant() {
			let wzConfig = {
				title: 'Change Work Operation Type of Assigned Plant',
				title$tr$: 'logistic.job.changeWOTOfDispatchNotesWizard.title',
				width: '20%',
				height: '45%',
				steps: getWizardSteps()
			};
			let selectedPlantLocations = projectMainManagedPlantLocService.getSelectedEntities();
			if (_.some(selectedPlantLocations)) {
				let allAppearingPlantFks = _.map(selectedPlantLocations, loc => loc.PlantFk);
				asyncGetUnionOfAvailableWOTFksFromPlants(allAppearingPlantFks).then(function (wOTFks) {
					self.workOperationFks = wOTFks;
					initWOT();
					platformWizardDialogService.showDialog(wzConfig, changeWOTOfAssignedPlantData);
				});
			}
			else {
				showDialogNoPlantLocationsSelected();
			}
		};

		let wizardLookupFilter = [
			{
				key: 'dispatch-nodes-rubric-category-by-rubric-filter',
				fn: function (lookupItem) {
					return lookupItem.RubricFk === 34; //Logistic Dispatching Rubric
				}
			},
			{
				key: 'resource-wot-by-plant-type-filter',
				fn: function (lookupItem) {
					return _.some(self.workOperationFks, wotFk => wotFk === lookupItem.Id);
				}
			},
			{
				key: 'dispatch-node-status-by-rubric-category-filter',
				fn: function (lookupItem, related) {
					return !_.isUndefined(related.wizardData.select.RubricCategoryFk) ?
						lookupItem.RubricCategoryFk === related.wizardData.select.RubricCategoryFk :
						false;
				}
			},
		];

		basicsLookupdataLookupFilterService.registerFilter(wizardLookupFilter);
		return service;
	}
})(angular);
