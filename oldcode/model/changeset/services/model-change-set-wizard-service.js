/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangeSetWizardService
	 * @function
	 *
	 * @description Provides a wizard for generating model change sets by comparing pairs of models.
	 */
	angular.module('model.changeset').factory('modelChangeSetWizardService', modelChangeSetWizardService);

	modelChangeSetWizardService.$inject = ['_', 'platformWizardDialogService', 'modelProjectPinnableEntityService',
		'projectMainPinnableEntityService', 'modelViewerModelSelectionService', 'projectMainProjectSelectionService',
		'modelProjectSimplifiedModelListRetrievalService', '$translate', 'projectMainNiceNameService', '$http',
		'modelProjectReusableWizardsService', 'modelChangeSetDataService', 'moment', 'modelProjectNiceNameService',
		'platformDialogService', 'basicsLookupdataConfigGenerator', 'platformModalFormConfigService', 'platformTranslateService'];

	function modelChangeSetWizardService(_, platformWizardDialogService, modelProjectPinnableEntityService,
		projectMainPinnableEntityService, modelViewerModelSelectionService, projectMainProjectSelectionService,
		modelProjectSimplifiedModelListRetrievalService, $translate, projectMainNiceNameService, $http,
		modelProjectReusableWizardsService, modelChangeSetDataService, moment, modelProjectNiceNameService,
		platformDialogService, basicsLookupdataConfigGenerator, platformModalFormConfigService, platformTranslateService) {

		const service = {};

		function createModel1SourceForm(pinnedModelName, pinnedProjectName) {
			const options = [];
			if (pinnedProjectName) {
				if (pinnedModelName) {
					options.push({
						value: 'pm',
						label: $translate.instant('model.changeset.changeSetWizard.usePinnedModel', {
							model: pinnedModelName
						})
					});
				}
				options.push({
					value: 'pp',
					label: $translate.instant('model.changeset.changeSetWizard.usePinnedProject', {
						project: pinnedProjectName
					})
				});
			}

			options.push({
				value: 'sm',
				label$tr$: 'model.changeset.changeSetWizard.selectModel'
			});

			return {
				fid: 'model.changeset.changeSetWizard.model1Source',
				version: '1.0.0',
				showGrouping: false,
				skipPermissionCheck: true,
				groups: [{
					gid: 'default'
				}],
				rows: [{
					gid: 'default',
					rid: 'model1Src',
					type: 'radio',
					model: 'model1Source',
					visible: true,
					sortOrder: 1,
					options: {
						valueMember: 'value',
						labelMember: 'label',
						groupName: 'model1SourceGroup',
						items: options
					}
				}]
			};
		}

		function updateWizardByModel1Source(steps, model) {
			switch (model.model1Source) {
				case 'pm':
					_.find(steps, {id: 'project1Sel'}).disabled = true;
					_.find(steps, {id: 'model1Sel'}).disabled = true;
					model.project1.selectedId = projectMainPinnableEntityService.getPinned();
					model.model1.selectedId = modelProjectPinnableEntityService.getPinned();
					break;
				case 'pp':
					_.find(steps, {id: 'project1Sel'}).disabled = true;
					_.find(steps, {id: 'model1Sel'}).disabled = false;
					model.project1.selectedId = projectMainPinnableEntityService.getPinned();
					model.model1.selectedId = null;
					break;
				case 'sm':
					_.find(steps, {id: 'project1Sel'}).disabled = false;
					_.find(steps, {id: 'model1Sel'}).disabled = false;
					model.project1.selectedId = null;
					model.model1.selectedId = null;
					break;
			}
			model.model1.items = null;
		}

		function createModel2SourceForm(model, pinnedModelId, pinnedModelName, pinnedProjectId, pinnedProjectName) {
			let pmOption, ppOption;

			const options = [];
			if (pinnedProjectId) {
				if (pinnedModelId) {
					options.push(pmOption = {
						value: 'pm',
						label: $translate.instant('model.changeset.changeSetWizard.usePinnedModel', {
							model: pinnedModelName
						}),
						disabled: false
					});
				}

				options.push(ppOption = {
					value: 'pp',
					label: $translate.instant('model.changeset.changeSetWizard.usePinnedProject', {
						project: pinnedProjectName
					}),
					disabled: false
				});
			}

			options.push({
				value: 'sp',
				label$tr$: 'model.changeset.changeSetWizard.useSameProject'
			});
			options.push({
				value: 'sm',
				label$tr$: 'model.changeset.changeSetWizard.selectModel'
			});

			return {
				fid: 'model.changeset.changeSetWizard.model2Source',
				version: '1.0.0',
				showGrouping: false,
				skipPermissionCheck: true,
				groups: [{
					gid: 'default'
				}],
				rows: [{
					gid: 'default',
					rid: 'model2Src',
					type: 'radio',
					model: 'model2Source',
					visible: true,
					sortOrder: 1,
					options: {
						valueMember: 'value',
						labelMember: 'label',
						disabledMember: 'disabled',
						groupName: 'model2SourceGroup',
						items: options
					}
				}],
				prepareWizardForm: function (info) {
					info.scope.$evalAsync(function () {
						if (pmOption) {
							pmOption.disabled = info.model.model1.selectedId === pinnedModelId;
						}
						if (ppOption) {
							ppOption.disabled = info.model.project1.selectedId === pinnedProjectId;
						}
					});
				}
			};
		}

		function updateWizardByModel2Source(steps, model) {
			switch (model.model2Source) {
				case 'pm':
					_.find(steps, {id: 'project2Sel'}).disabled = true;
					_.find(steps, {id: 'model2Sel'}).disabled = true;
					model.project2.selectedId = projectMainPinnableEntityService.getPinned();
					model.model2.selectedId = modelProjectPinnableEntityService.getPinned();
					break;
				case 'pp':
					_.find(steps, {id: 'project2Sel'}).disabled = true;
					_.find(steps, {id: 'model2Sel'}).disabled = false;
					model.project2.selectedId = projectMainPinnableEntityService.getPinned();
					model.model2.selectedId = null;
					break;
				case 'sp':
					_.find(steps, {id: 'project2Sel'}).disabled = true;
					_.find(steps, {id: 'model2Sel'}).disabled = false;
					model.project2.selectedId = model.project1.selectedId;
					model.model2.selectedId = null;
					break;
				case 'sm':
					_.find(steps, {id: 'project2Sel'}).disabled = false;
					_.find(steps, {id: 'model2Sel'}).disabled = false;
					model.project2.selectedId = null;
					model.model2.selectedId = null;
					break;
			}
			model.model2.items = null;
		}

		function createComparisonSettingsForm() {
			return {
				fid: 'model.changeset.changeSetWizard.model2Source',
				version: '1.0.0',
				showGrouping: false,
				skipPermissionCheck: true,
				groups: [{
					gid: 'default'
				}],
				rows: [{
					gid: 'default',
					rid: 'cmpModelColumns',
					type: 'boolean',
					label$tr$: 'model.changeset.changeSetWizard.compareModelColumns',
					model: 'compareModelColumns',
					visible: true,
					sortOrder: 5
				}, {
					gid: 'default',
					rid: 'cmpObjects',
					type: 'boolean',
					label$tr$: 'model.changeset.changeSetWizard.compareObjects',
					model: 'compareObjects',
					visible: true,
					sortOrder: 10
				}, {
					gid: 'default',
					rid: 'cmpObjectLocations',
					type: 'boolean',
					label$tr$: 'model.changeset.changeSetWizard.compareObjLocs',
					model: 'compareObjectLocations',
					visible: true,
					sortOrder: 15
				}, {
					gid: 'default',
					rid: 'cmpProps',
					type: 'boolean',
					label$tr$: 'model.changeset.changeSetWizard.compareProperties',
					model: 'compareProperties',
					visible: true,
					sortOrder: 20
				}, {
					gid: 'default',
					rid: 'excOpens',
					type: 'boolean',
					label$tr$: 'model.changeset.changeSetWizard.excludeOpenings',
					model: 'excludeOpenings',
					visible: true,
					sortOrder: 30
				}]
			};
		}

		function createComparisonDescriptionForm() {
			return {
				fid: 'model.changeset.changeSetWizard.model2Source',
				version: '1.0.0',
				showGrouping: false,
				skipPermissionCheck: true,
				groups: [{
					gid: 'default'
				}],
				rows: [{
					gid: 'default',
					rid: 'desc',
					type: 'description',
					model: 'comparisonDescription',
					label$tr$: 'cloud.common.descriptionInfo',
					visible: true,
					sortOrder: 10
				}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'basicsCommonLogLevelLookupDataService',
					enableCache: true
				}, {
					gid: 'default',
					rid: 'log',
					model: 'loggingLevel',
					label$tr$: 'model.changeset.logLevel',
					sortOrder: 50
				})]
			};
		}

		function findModelInNestedList(items, id) {
			const childrenProp = 'modelVersions';
			return _.find(_.flatten(_.map(items, function (item) {
				return _.isArray(item[childrenProp]) ? _.concat([item], item[childrenProp]) : [item];
			})), {Id: id});
		}

		function generateDescription(settings, pinnedModelId, pinnedModelName, pinnedProjectId, pinnedProjectName) {
			let project1Name, project2Name;
			let model1Name, model2Name, model1NameWithProject, model2NameWithProject, model1Code, model2Code;

			switch (settings.model1Source) {
				case 'pm':
					project1Name = pinnedProjectName;
					model1Name = pinnedModelName;
					break;
				case 'pp':
					project1Name = pinnedProjectName;
					(function () {
						const m = findModelInNestedList(settings.model1.items, settings.model1.selectedId);
						model1Name = modelProjectNiceNameService.generateNiceModelNameFromEntity(m);
						model1Code = m.Code;
					})();
					break;
				case 'sm':
					project1Name = projectMainNiceNameService.generateNiceProjectNameFromEntity(_.find(settings.project1.items, {Id: settings.project1.selectedId}));
					(function () {
						const m = findModelInNestedList(settings.model1.items, settings.model1.selectedId);
						model1Name = modelProjectNiceNameService.generateNiceModelNameFromEntity(m);
						model1Code = m.Code;
					})();
					break;
			}

			model1NameWithProject = projectMainNiceNameService.joinNameWithProjectName(model1Name, project1Name);

			switch (settings.model2Source) {
				case 'pm':
					project2Name = pinnedProjectName;
					model2Name = pinnedModelName;
					break;
				case 'pp':
					project2Name = pinnedProjectName;
					(function () {
						const m = findModelInNestedList(settings.model2.items, settings.model2.selectedId);
						model2Name = modelProjectNiceNameService.generateNiceModelNameFromEntity(m);
						model2Code = m.Code;
					})();
					break;
				case 'sp':
					project2Name = project1Name;
					(function () {
						const m = findModelInNestedList(settings.model2.items, settings.model2.selectedId);
						model2Name = modelProjectNiceNameService.generateNiceModelNameFromEntity(m);
						model2Code = m.Code;
					})();
					break;
				case 'sm':
					project2Name = projectMainNiceNameService.generateNiceProjectNameFromEntity(_.find(settings.project2.items, {Id: settings.project2.selectedId}));
					(function () {
						const m = findModelInNestedList(settings.model2.items, settings.model2.selectedId);
						model2Name = modelProjectNiceNameService.generateNiceModelNameFromEntity(m);
						model2Code = m.Code;
					})();
					break;
			}

			model2NameWithProject = projectMainNiceNameService.joinNameWithProjectName(model2Name, project2Name);

			const now = moment();
			const formattedDates = [
				now.format('YYYY-MM-DD'),
				now.format('YYYY-M-D'),
				now.format('YY-MM-DD'),
				now.format('YY-M-D'),
				now.format('M-D')
			];

			const maxDescLength = 42;
			const minDateLength = formattedDates[formattedDates.length - 1].length + 1;

			const descGenerators = [function () {
				return $translate.instant('model.changeset.changeSetWizard.modelDescPattern', {
					model1: model1NameWithProject,
					model2: model2NameWithProject
				});
			}];
			if (settings.project1.selectedId === settings.project2.selectedId) {
				descGenerators.push(function () {
					return $translate.instant('model.changeset.changeSetWizard.modelDescPattern', {
						model1: model1NameWithProject,
						model2: model2Name
					});
				});
			}
			descGenerators.push(function () {
				return $translate.instant('model.changeset.changeSetWizard.modelDescPattern', {
					model1: model1Name,
					model2: model2Name
				});
			});
			if (model1Code && model2Code) {
				descGenerators.push(function () {
					return $translate.instant('model.changeset.changeSetWizard.modelDescPattern', {
						model1: model1Code,
						model2: model2Code
					});
				});
			}
			descGenerators.push(function () {
				return $translate.instant('model.changeset.changeSetWizard.modelDescPattern', {
					model1: settings.model1.selectedId,
					model2: settings.model2.selectedId
				});
			});
			let desc;
			for (let i = 0; i < descGenerators.length; i++) {
				const modelDesc = descGenerators[i]();
				if (modelDesc.length + minDateLength <= maxDescLength) {
					desc = modelDesc;
					break;
				}
				if (i >= descGenerators.length - 1) {
					desc = modelDesc.substring(0, 42);
				}
			}

			for (let i = 0; i < formattedDates.length; i++) {
				if (desc.length + 1 + formattedDates[i].length <= maxDescLength) {
					desc = formattedDates[i] + ' ' + desc;
					break;
				}
			}
			return desc;
		}

		service.compareModels = function () {
			const selectedProjectId = projectMainPinnableEntityService.getPinned();
			let selectedModelId = modelProjectPinnableEntityService.getPinned();
			if (modelViewerModelSelectionService.getSelectedModelId()) {
				if (modelViewerModelSelectionService.getSelectedModel().info.isComposite) {
					selectedModelId = null;
				}
			}

			const obj = {
				model1Source: selectedModelId ? 'pm' : (selectedProjectId ? 'pp' : 'sm'),
				project1: {},
				model1: {},
				model2Source: 'sp',
				project2: {},
				model2: {},
				compareModelColumns: true,
				compareObjects: true,
				compareObjectLocations: true,
				compareProperties: true,
				excludeOpenings: true,
				loggingLevel: 0
			};

			// wizard steps ----------------------------------------------------------------
			const wzConfig = {
				title$tr$: 'model.changeset.changeSetWizard.createTitle',
				steps: [{
					title$tr$: 'model.changeset.changeSetWizard.introTitle',
					message$tr$: 'model.changeset.changeSetWizard.introMsg'
				}],
				onChangeStep: function (info) {
					switch (info.step.id) {
						case 'model2Source':
							updateWizardByModel2Source(wzConfig.steps, obj);
							break;
						case 'cmpDescStep':
							if (!info.model.comparisonDescription) {
								info.model.comparisonDescription = generateDescription(obj,
									selectedModelId, modelProjectPinnableEntityService.getPinnedInfo(),
									selectedProjectId, projectMainPinnableEntityService.getPinnedInfo());
							}
							break;
					}
				}
			};

			if (selectedModelId || selectedProjectId) {
				wzConfig.steps.push({
					title$tr$: 'model.changeset.changeSetWizard.model1Source',
					topDescription$tr$: 'model.changeset.changeSetWizard.model1SourceDesc',
					form: createModel1SourceForm(selectedModelId ? modelProjectPinnableEntityService.getPinnedInfo() : null, projectMainPinnableEntityService.getPinnedInfo()),
					watches: [{
						expression: 'model1Source',
						fn: function (info) {
							updateWizardByModel1Source(info.wizard.steps, info.model);
						}
					}]
				});
			}

			const model1Wz = modelProjectReusableWizardsService.createVersionedModelSelectionWizard(obj, {
				noLockToSelected: true,
				projectStepId: 'project1Sel',
				projectProperty: 'project1',
				projectStepTitle: $translate.instant('model.changeset.changeSetWizard.project1Title'),
				projectStepDesc: $translate.instant('model.changeset.changeSetWizard.project1Desc'),
				modelStepId: 'model1Sel',
				modelProperty: 'model1',
				modelStepTitle: $translate.instant('model.changeset.changeSetWizard.model1Title'),
				modelStepDesc: $translate.instant('model.changeset.changeSetWizard.model1Desc'),
				includeModel: function (modelEntity) {
					return !modelEntity.IsComposite;
				}
			});
			platformWizardDialogService.insertWizard(model1Wz, wzConfig);

			wzConfig.steps.push({
				id: 'model2Source',
				title$tr$: 'model.changeset.changeSetWizard.model2Source',
				topDescription$tr$: 'model.changeset.changeSetWizard.model2SourceDesc',
				form: createModel2SourceForm(obj, selectedModelId, modelProjectPinnableEntityService.getPinnedInfo(), selectedProjectId, projectMainPinnableEntityService.getPinnedInfo()),
				watches: [{
					expression: 'model2Source',
					fn: function (info) {
						updateWizardByModel2Source(info.wizard.steps, info.model);
					}
				}]
			});

			const model2Wz = modelProjectReusableWizardsService.createVersionedModelSelectionWizard(obj, {
				noLockToSelected: true,
				projectStepId: 'project2Sel',
				projectProperty: 'project2',
				projectStepTitle: $translate.instant('model.changeset.changeSetWizard.project2Title'),
				projectStepDesc: $translate.instant('model.changeset.changeSetWizard.project2Desc'),
				modelStepId: 'model2Sel',
				modelProperty: 'model2',
				modelStepTitle: $translate.instant('model.changeset.changeSetWizard.model2Title'),
				modelStepDesc: $translate.instant('model.changeset.changeSetWizard.model2Desc'),
				includeModel: function (modelEntity) {
					return !modelEntity.IsComposite && !((modelEntity.ProjectFk === obj.project1.selectedId) && (modelEntity.Id === obj.model1.selectedId));
				}
			});
			platformWizardDialogService.insertWizard(model2Wz, wzConfig);

			wzConfig.steps.push({
				title$tr$: 'model.changeset.changeSetWizard.cmpSettingsTitle',
				topDescription$tr$: 'model.changeset.changeSetWizard.cmpSettingsDesc',
				form: createComparisonSettingsForm()
			});

			wzConfig.steps.push({
				id: 'cmpDescStep',
				title$tr$: 'model.changeset.changeSetWizard.cmpDescTitle',
				topDescription$tr$: 'model.changeset.changeSetWizard.cmpDescDesc',
				form: createComparisonDescriptionForm()
			});

			wzConfig.steps.push({
				title$tr$: 'model.changeset.changeSetWizard.completionTitle',
				message$tr$: 'model.changeset.changeSetWizard.completionMsg',
				canFinish: true
			});

			updateWizardByModel1Source(wzConfig.steps, obj);
			updateWizardByModel2Source(wzConfig.steps, obj);

			// wizard execution ----------------------------------------------------------------

			platformWizardDialogService.translateWizardConfig(wzConfig);

			return platformWizardDialogService.showDialog(wzConfig, obj).then(function (data) {
				if (data.success) {
					$http.post(globals.webApiBaseUrl + 'model/changeset/compare', {
						model1: getActualModelId(data.data.model1.selectedId),
						model2: getActualModelId(data.data.model2.selectedId),
						comparisonDescription: data.data.comparisonDescription,
						compareModelColumns: data.data.compareModelColumns,
						compareObjects: data.data.compareObjects,
						compareObjectLocations: data.data.compareObjectLocations,
						compareProperties: data.data.compareProperties,
						excludeOpenings: data.data.excludeOpenings,
						loggingLevel: data.data.loggingLevel
					}).then(function (response) {
						if (response.data) {
							modelChangeSetDataService.addChangeSet(response.data);
						}
					});

					return true;
				} else {
					return false;
				}
			});
		};

		function getActualModelId(treeModelId) {
			if (_.isString(treeModelId)) {
				if (treeModelId.startsWith('R')) {
					return parseInt(treeModelId.substring(1));
				}
			}
			return treeModelId;
		}

		service.recompareModels = function () {
			const selComparison = modelChangeSetDataService.getSelected();
			if (!selComparison) {
				return platformDialogService.showInfoBox('model.changeset.changeSetSummary.noSelection', 'cloud.desktop.infoDialogHeader', 'info');
			}

			//ShowDialog Configuration for repeat comparision --------------------------------------------------------
			var dlgConfig = {
				title: $translate.instant('model.changeset.recompare'),
				width: '70%',
				resizeable: true,
				formConfiguration: {
					showGrouping: false,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'desc',
						type: 'description',
						model: 'recomparisonDescription',
						label$tr$: 'model.changeset.changeSetSummary.modelDescription',
						visible: true,
						sortOrder: 10,

					}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'basicsCommonLogLevelLookupDataService',
						enableCache: true
					}, {
						gid: 'default',
						rid: 'log',
						model: 'loggingLevel',
						label$tr$: 'model.changeset.logLevel',
						sortOrder: 50
					})]
				},
				dataItem: {
					recomparisonDescription: selComparison.DescriptionInfo.Translated,
					loggingLevel: selComparison.LoggingLevel
				}
			};
			platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
			return platformModalFormConfigService.showDialog(dlgConfig).then(function (resp) {
				if (resp.ok) {
					return $http.post(globals.webApiBaseUrl + 'model/changeset/recompare', {
						Model1Id: selComparison.ModelFk,
						ChangeSetId: selComparison.Id,
						Description: resp.data.recomparisonDescription,
						LoggingLevel: resp.data.loggingLevel
					}).then(function (response) {
						if (response.data) {
							modelChangeSetDataService.addChangeSet(response.data);
							return true;
						}
					});
				}
			});
		};
		return service;
	}
})(angular);
