/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAnnotationModule = angular.module('model.annotation');

	modelAnnotationModule.factory('modelAnnotationBcfImportWizardService',
		modelAnnotationBcfImportWizardService);

	modelAnnotationBcfImportWizardService.$inject = ['_', 'platformWizardDialogService',
		'$translate', 'basicsLookupdataConfigGenerator', 'projectMainPinnableEntityService',
		'modelProjectPinnableEntityService', 'basicsCommonSimpleUploadService', '$http',
		'$timeout', 'platformDialogService', 'modelAnnotationTypes'];

	function modelAnnotationBcfImportWizardService(_, platformWizardDialogService,
		$translate, basicsLookupdataConfigGenerator, projectMainPinnableEntityService,
		modelProjectPinnableEntityService, basicsCommonSimpleUploadService, $http,
		$timeout, platformDialogService, modelAnnotationTypes) {

		function scanFile(file, modelId) {
			return basicsCommonSimpleUploadService.uploadFile(file.file, {
				basePath: 'model/annotation/bcf/',
				customRequest: {
					DestModelId: modelId
				}
			});
		}

		function extractIdAssignments(items) {
			return _.map(items, function (item) {
				return {
					SourceValue: item.SourceValue,
					RawBaseType: item.BaseType,
					DestId: _.isString(item.DestValue) ? parseInt(item.DestValue.match(/\/(\d+)$/)[1]) : item.DestValue
				};
			});
		}

		function importFile(settings) {
			return $http.post(globals.webApiBaseUrl + 'model/annotation/bcf/import', {
				DestModelId: settings.modelId,
				FileArchiveDocId: settings.fileArchiveDocId,
				Priorities: extractIdAssignments(settings.priorities.items),
				Types: extractIdAssignments(settings.categories.items),
				States: extractIdAssignments(settings.statuses.items),
				UpdateExistingAnnotations: Boolean(settings.overwriteAnno),
				UpdateExistingComments: Boolean(settings.overwriteComments),
				UpdateExistingCameras: Boolean(settings.overwriteCameras)
			}).then(response => response.data);
		}

		function createAssignmentListColumns(sourceValueKey, destValueLookupFactory, definesBaseType) {
			const baseTypeColumn = {
				id: 'baseType',
				field: 'BaseType',
				name$tr$: 'model.annotation.type',
				width: 180,
				formatter: 'imageselect',
				formatterOptions: {
					serviceName: 'modelAnnotationTypeIconService',
					acceptFalsyValues: true
				}
			};

			if (definesBaseType) {
				baseTypeColumn.editor = 'imageselect';
				baseTypeColumn.editorOptions = {
					serviceName: 'modelAnnotationTypeIconService'
				};
			}

			const result = [];

			if (!definesBaseType) {
				result.push(baseTypeColumn);
			}

			result.push({
				id: 'sourceValue',
				field: 'SourceValue',
				name$tr$: sourceValueKey,
				width: 250,
				formatter: 'description'
			});

			if (definesBaseType) {
				result.push(baseTypeColumn);
			}

			result.push(destValueLookupFactory({
				id: 'destValue',
				field: 'DestValue',
				name$tr$: 'model.annotation.bcf.importAs',
				width: 250
			}));

			return result;
		}

		function createTypeAssignmentListModel(selectionCache) {
			const result = {
				items: null,
				selectionListConfig: {
					columns: createAssignmentListColumns('model.annotation.bcf.bcfCat', confObj => basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'modelAnnotationCategoryLookupPrefixLogicDataService',
						enableCache: true,
						filter: item => _.get(item, 'BaseType') || 0,
						gridLess: true
					}, confObj), true)
				}
			};

			result.cellChanged = function (info) {
				if (info.columnIndex === 1) { // base type
					info.item.DestValue = `${info.item.BaseType}/${selectionCache.DefaultCategoryIds[info.item.BaseType]}`;
					selectionCache.updateListsByBaseTypes();
				}
			};

			return result;
		}

		function createAssignmentListModel(sourceValueKey, destValueLookupFactory) {
			return {
				items: null,
				selectionListConfig: {
					columns: createAssignmentListColumns(sourceValueKey, destValueLookupFactory, false)
				}
			};
		}

		function createAssignmentStep(key, title, topDescription) {
			return platformWizardDialogService.createListStep({
				title: title,
				topDescription: topDescription,
				model: key,
				stepId: key,
				requireSelection: false
			});
		}

		function applyProfile(profile, currentSettings, selectionCache) {
			if (!_.isObject(profile)) {
				return;
			}

			const categoryBcf = currentSettings.categories.items;
			const categoryProf = profile.ModelAnnotationImportProfile2CategoryEntities;
			categoryBcf.forEach(function(bcf) {
				const profSettings = categoryProf.find(item => item.Text === bcf.SourceValue);
				if (profSettings) {
					bcf.BaseType = profSettings.RawAnnotationBaseType;
					bcf.DestValue =`${bcf.BaseType}/${profSettings.CategoryFk}`;
				}
			});

			const prioBcf = selectionCache.PriorityAssignments;
			const prioProf = profile.ModelAnnotationImportProfile2PriorityEntities;
			prioBcf.forEach(function(bcf) {
				const profSettings = prioProf.find(item => bcf.SourceValue === item.Text && bcf.BaseType === item.RawAnnotationBaseType);
				if (profSettings) {
					bcf.DestValue = profSettings.PriorityFk;
				}
			});

			const statusBcf = selectionCache.StatusAssignments;
			const statusProf = profile.ModelAnnotationImportProfile2StatusEntities;
			statusBcf.forEach(function(bcf) {
				const profSettings = statusProf.find(item => bcf.SourceValue === item.Text && bcf.BaseType === item.RawAnnotationBaseType);
				if (profSettings) {
					bcf.DestValue = profSettings.StatusFk;
				}
			});
		}

		function showDialog() {
			const selectionCache = {};

			function watchfn(changeInfo) {
				if (changeInfo.model.file && changeInfo.model.modelId) {
					_.find(changeInfo.wizard.steps, {id: 'upload'}).disallowNext = _.isNil(changeInfo.newValue);
				} else {
					_.find(changeInfo.wizard.steps, {id: 'upload'}).disallowNext = true;
				}

				if (_.isInteger(changeInfo.model.profile)) {
					$http.get(globals.webApiBaseUrl + 'model/annotation/importprf/byId', {
						params: {
							profileId: changeInfo.model.profile
						}
					}).then(function (response) {
						const item = response.data;

						applyProfile(item, changeInfo.model, selectionCache);
					});
				}
			}

			const settings = {
				modelId: modelProjectPinnableEntityService.getPinned(),
				overwriteAnno: true,
				overwriteComments: true,
				overwriteCameras: true,
				categories: createTypeAssignmentListModel(selectionCache),
				priorities: createAssignmentListModel('model.annotation.bcf.bcfPrio', confObj => basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
					lookupName: 'basics.customize.priority',
					att2BDisplayed: 'Description',
					confObj: confObj
				}), false),
				statuses: createAssignmentListModel('model.annotation.bcf.bcfStatus', confObj => basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
					lookupName: 'basics.customize.modelannotationstatus',
					att2BDisplayed: 'Description',
					confObj: confObj
				}), false),
				summary: {
					items: null,
					selectionListConfig: {
						columns: [{
							id: 'name',
							field: 'Name',
							name$tr$: 'model.annotation.bcf.name',
							width: 180,
							formatter: 'description'
						}, {
							id: 'value',
							field: 'Value',
							name$tr$: 'model.annotation.bcf.value',
							width: 100,
							formatter: 'dynamic',
							domain: item => item.domain
						}]
					}
				}
			};

			const prioListStep = _.assign(createAssignmentStep('priorities', $translate.instant('model.annotation.bcf.prioPage'), $translate.instant('model.annotation.bcf.prioDesc')));
			const catListStep = createAssignmentStep('categories', $translate.instant('model.annotation.bcf.catPage'), $translate.instant('model.annotation.bcf.catDesc'), {
				disallowBack: true
			});
			const statusListStep = createAssignmentStep('statuses', $translate.instant('model.annotation.bcf.statusPage'), $translate.instant('model.annotation.bcf.statusDesc'));

			const wzConfig = {
				title$tr$: 'model.annotation.bcf.importTitle',
				steps: [{
					id: 'upload',
					title$tr$: 'model.annotation.bcf.uploadPage',
					disallowNext: true,
					form: {
						fid: 'model.annotation.bcf.import.upload',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelProjectModelTreeLookupDataService',
							enableCache: true,
							filter: function () {
								return {
									projectId: projectMainPinnableEntityService.getPinned(),
									includeComposite: true
								};
							}
						}, {
							gid: 'default',
							rid: 'destModel',
							model: 'modelId',
							label$tr$: 'model.annotation.bcf.destModel',
						}), {
							gid: 'default',
							rid: 'file',
							label$tr$: 'model.annotation.bcf.fileToUpload',
							model: 'file',
							type: 'fileselect',
							options: {
								maxSize: '128MB',
								retrieveFile: true
							}
						}]
					},
					watches: [{
						expression: 'file',
						fn: watchfn
					}, {
						expression: 'modelId',
						fn: watchfn
					}],
				}, {
					id: 'scan',
					title$tr$: 'model.annotation.bcf.scanPage',
					message$tr$: 'model.annotation.bcf.scanMessage',
					disallowNext: true,
					disallowBack: true,
					disallowCancel: true,
					watches: [{
						expression: 'scan',
						fn: watchfn
					}]
				}, {
					id: 'importPrf',
					title$tr$: 'model.annotation.bcf.importPrf',
					topDescription$tr$: 'model.annotation.bcf.importPrfDesc',
					// disallowNext: true,
					disallowBack: true,
					form: {
						fid: 'model.annotation.bcf.importPrf',
						showGrouping: false,
						skipPermissionCheck: true,
						groups: [{
							gid: 'default',
						}],
						rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelAnnotationImportProfileLookupDataService',
							enableCache: true,
							showClearButton: true,
						}, {
							gid: 'default',
							rid: 'importPrf',
							model: 'profile',
							label$tr$: 'model.annotation.bcf.importPrf'
						}), {
							gid: 'default',
							rid: 'skipConfigSteps',
							model: 'skipConfigSteps',
							label$tr$: 'model.annotation.bcf.skipConfigSteps',
							type: 'boolean'
						}]
					},
					watches: [{
						expression: 'profile',
						fn: watchfn
					}]
				}, catListStep, prioListStep, statusListStep, {
					id: 'settings',
					title$tr$: 'model.annotation.bcf.settingsPage',
					topDescription$tr$: 'model.annotation.bcf.settingsDesc',
					form: {
						fid: 'model.annotation.bcf.import.settings',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'overwriteAnno',
							label$tr$: 'model.annotation.bcf.overwriteAnno',
							type: 'boolean',
							model: 'overwriteAnno',
						}, {
							gid: 'default',
							rid: 'overwriteComments',
							label$tr$: 'model.annotation.bcf.overwriteComments',
							type: 'boolean',
							model: 'overwriteComments',
						}, {
							gid: 'default',
							rid: 'overwriteCameras',
							label$tr$: 'model.annotation.bcf.overwriteCameras',
							type: 'boolean',
							model: 'overwriteCameras',
						}, {
							gid: 'default',
							rid: 'saveSettings',
							label$tr$: 'model.annotation.bcf.saveSettings',
							type: 'directive',
							directive: 'platform-btn-form-control',
							options: {
								caption: $translate.instant('model.annotation.bcf.save'),
								fnc: function () {
									return platformDialogService.showDialog({
										headerText$tr$: 'model.annotation.bcf.saveSettings',
										bodyTemplateUrl: 'model.annotation/templates/model-annotation-bcf-import-save-settings-template.html',
										value: {},
										showOkButton: true,
										showCancelButton: true,
										resizeable: true
									}).then(function (result) {
										if(result.ok){
											if (settings.profile) {
												$http.post(globals.webApiBaseUrl + 'model/annotation/importprf/saveProfile', {
													Id: settings.profile,
													Priorities: _.map(settings.priorities.items, function (item) {
														return {
															DestId: item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													Types: _.map(settings.categories.items, function (item) {
														return {
															DestId: _.isString(item.DestValue) ? parseInt(item.DestValue.match(/\/(\d+)$/)[1]) : item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													States: _.map(settings.statuses.items, function (item) {
														return {
															DestId: item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													Description: result.value.resultData,
													UpdateExistingAnnotations: settings.overwriteAnno,
													UpdateExistingCameras: settings.overwriteCameras,
													UpdateExistingComments: settings.overwriteComments
												});
											} else if (result.value.resultData.Id) {
												$http.post(globals.webApiBaseUrl + 'model/annotation/importprf/saveProfile', {
													Id: result.value.resultData.Id,
													Priorities: _.map(settings.priorities.items, function (item) {
														return {
															DestId: item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													Types: _.map(settings.categories.items, function (item) {
														return {
															DestId: _.isString(item.DestValue) ? parseInt(item.DestValue.match(/\/(\d+)$/)[1]) : item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													States: _.map(settings.statuses.items, function (item) {
														return {
															DestId: item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													Description: result.value.resultData.DescriptionInfo.Description,
													UpdateExistingAnnotations: settings.overwriteAnno,
													UpdateExistingCameras: settings.overwriteCameras,
													UpdateExistingComments: settings.overwriteComments
												});
											} else {
												$http.post(globals.webApiBaseUrl + 'model/annotation/importprf/saveProfile', {
													Priorities: _.map(settings.priorities.items, function (item) {
														return {
															DestId: item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													Types: _.map(settings.categories.items, function (item) {
														return {
															DestId: _.isString(item.DestValue) ? parseInt(item.DestValue.match(/\/(\d+)$/)[1]) : item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													States: _.map(settings.statuses.items, function (item) {
														return {
															DestId: item.DestValue,
															SourceValue: item.SourceValue,
															RawBaseType: item.BaseType
														};
													}),
													Description: result.value.resultData,
													UpdateExistingAnnotations: settings.overwriteAnno,
													UpdateExistingCameras: settings.overwriteCameras,
													UpdateExistingComments: settings.overwriteComments
												});
											}
										}
									});
								}
							}
						}]
					}
				}, {
					id: 'import',
					title$tr$: 'model.annotation.bcf.importPage',
					message$tr$: 'model.annotation.bcf.importMessage',
					disallowNext: true,
					disallowBack: true,
					disallowCancel: true
				}, _.assign(platformWizardDialogService.createListStep({
					title$tr$: 'model.annotation.bcf.importDone',
					topDescription$tr$: 'model.annotation.bcf.importDoneDesc',
					model: 'summary',
					stepId: 'summary',
					requireSelection: false
				}), {
					disallowBack: true,
					canFinish: true,
					disallowCancel: true
				})],
				onChangeStep: function (stepInfo) {
					switch (_.get(stepInfo, 'step.id')) {
						case 'scan':
							scanFile(stepInfo.model.file, stepInfo.model.modelId).then(function (defs) {
								(function prepareDefs() {
									const catIds = {};
									if (Array.isArray(defs.DefaultCategoryIds)) {
										for (let defCatId of defs.DefaultCategoryIds) {
											catIds[defCatId.RawType] = defCatId.CategoryFk || null;
										}
									}
									defs.DefaultCategoryIds = catIds;
								})();

								stepInfo.model.fileArchiveDocId = defs.FileArchiveDocId;

								selectionCache.DefaultCategoryIds = defs.DefaultCategoryIds;

								function prepareAssignments(setName, defaultName) {
									const allValues = _.uniq(_.flatten(_.map(defs.Types, t => t[setName])));
									const destId = defs[defaultName];
									let index = 0;
									return _.flatten(_.map(Object.keys(modelAnnotationTypes.byId).map(typeInfo => typeInfo.id), function (id) {
										const baseType = parseInt(id);
										return _.map(allValues, function (val) {
											return {
												id: ++index,
												BaseType: baseType,
												SourceValue: val,
												DestValue: destId
											};
										});
									}));
								}

								selectionCache.PriorityAssignments = prepareAssignments('Priorities', 'DefaultPriorityId');
								selectionCache.StatusAssignments = prepareAssignments('States', 'DefaultStatusId');
								var categoryPrefix = 11;
							
								stepInfo.model.categories.items = _.map(defs.Types, function (item, index) {
									var CategoryFk = defs.DefaultRawType+''+defs.DefaultCategoryIds[defs.DefaultRawType]
									return {
										id: index,
										SourceValue: item.TypeName,
										BaseType: defs.DefaultRawType,
										DestValue: parseInt(categoryPrefix+CategoryFk)
									};
								});

								selectionCache.updateListsByBaseTypes = function () {
									function doUpdateList(setName, assignmentsName) {
										const relevantItems = [];

										for (let typeAssignment of stepInfo.model.categories.items) {
											const typeDef = defs.Types.find(t => t.TypeName === typeAssignment.SourceValue);
											if (typeDef) {
												for (let val of typeDef[setName]) {
													const assignmentItem = selectionCache[assignmentsName].find(a => a.BaseType === typeAssignment.BaseType && a.SourceValue === val);
													if (assignmentItem && (relevantItems.indexOf(assignmentItem) < 0)) {
														relevantItems.push(assignmentItem);
													}
												}
											}
										}
										return relevantItems;
									}

									stepInfo.model.priorities.items = doUpdateList('Priorities', 'PriorityAssignments');
									stepInfo.model.statuses.items = doUpdateList('States', 'StatusAssignments');
								};
								selectionCache.updateListsByBaseTypes();

								if (!_.isInteger(stepInfo.model.profile)) {
									$http.get(globals.webApiBaseUrl +'model/annotation/importprf/defaultProfile').then(function (response) {
										const item = response.data;

										applyProfile(item, stepInfo.model, selectionCache);
									});
								}

								stepInfo.step.disallowNext = false;
								return $timeout(function () {
									return stepInfo.commands.goToNext();
								});
							});
							break;
						case 'import':
							importFile(stepInfo.model).then(function (summary) {
								stepInfo.model.summary.items = [{
									id: 1,
									Name: $translate.instant('model.annotation.bcf.importedFileType'),
									Value: summary.FileType,
									domain: 'description'
								}, {
									id: 10,
									Name: $translate.instant('model.annotation.bcf.newAnnotationCount'),
									Value: summary.NewAnnotationCount,
									domain: 'integer'
								}, {
									id: 20,
									Name: $translate.instant('model.annotation.bcf.changedAnnotationCount'),
									Value: summary.ChangedAnnotationCount,
									domain: 'integer'
								}, {
									id: 30,
									Name: $translate.instant('model.annotation.bcf.unchangedAnnotationCount'),
									Value: summary.UnchangedAnnotationCount,
									domain: 'integer'
								}, {
									id: 40,
									Name: $translate.instant('model.annotation.bcf.skippedTopicCount'),
									Value: summary.SkippedTopicCount,
									domain: 'integer'
								}];

								stepInfo.step.disallowNext = false;
								return $timeout(function () {
									return stepInfo.commands.goToNext();
								});
							});
							break;
						case 'priorities':
							selectionCache.updateListsByBaseTypes();
							if (stepInfo.model.skipConfigSteps === true) {
								stepInfo.commands.goToNext();
							}
							break;
						case 'statuses':
							if (stepInfo.model.skipConfigSteps === true) {
								stepInfo.commands.goToNext();
							}
							break;
						case 'categories':
							if (stepInfo.model.skipConfigSteps === true) {
								stepInfo.commands.goToNext();
							}
							break;
						case 'settings':
							if (stepInfo.model.skipConfigSteps === true) {
								stepInfo.step.disallowBack = true;
							}
							break;
					}
				}
			};
			platformWizardDialogService.translateWizardConfig(wzConfig);

			return platformWizardDialogService.showDialog(wzConfig, settings);
		}

		return {
			showDialog: showDialog
		};
	}
})(angular);
