/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelProjectModelImportDialog
	 * @function
	 */
	angular.module('model.project').factory('modelProjectModelImportDialog',
		modelProjectModelImportDialog);

	modelProjectModelImportDialog.$inject = ['_', '$http', '$timeout', '$injector',
		'modelProjectModelVersionDataService', 'platformDataServiceFactory', '$translate',
		'basicsLookupdataConfigGenerator', 'platformModalService',
		'basicsCommonServiceUploadExtension', 'platformWizardDialogService',
		'platformDialogService', 'basicsCommonSimpleUploadService', 'platformGridAPI'];

	function modelProjectModelImportDialog(_, $http, $timeout, $injector,
		modelProjectModelVersionDataService, platformDataServiceFactory, $translate,
		basicsLookupdataConfigGenerator, platformModalService,
		basicsCommonServiceUploadExtension, platformWizardDialogService,
		platformDialogService, basicsCommonSimpleUploadService, platformGridAPI) {

		const service = {};

		const configPageIndex = 3;

		function showDialog(config) {
			const effectiveConfig = _.assign({
				projectId: null
			}, _.isObject(config) ? config : {});

			const creationData = {
				ModelFk: effectiveConfig.modelId,
				Convert: true,
				GenerateIFCTree: true,
				projectId: effectiveConfig.projectId,
				newModelCodePattern: 'M{{filename}}',
				newModelDescPattern: 'Model {{filename}}',
				compositeModelCodePattern: 'MCombined',
				compositeModelDescPattern: 'Complete Model',
				importOptions: 2
			};

			const MergeGroup = ['Cpixml'];

			function updateFileMessage(item) {
				if (item.fileScanResult.is3DModel) {
					if (item.Convert) {
						wzConfig.steps[configPageIndex].message = $translate.instant('model.project.modelFile3DSelected');
					} else {
						wzConfig.steps[configPageIndex].message = $translate.instant('model.project.modelFile3DNotSelected');
					}
				} else {
					if (item.Convert) {
						wzConfig.steps[configPageIndex].message = $translate.instant('model.project.modelFile2DSelected');
					} else {
						wzConfig.steps[configPageIndex].message = $translate.instant('model.project.modelFile2DNotSelected');
					}
				}
			}

			function updateFirstStepComplete(item) {
				wzConfig.steps[0].disallowNext = !(item.ModelFk && _.get(creationData.fileScanResult, 'errorCode'));
			}

			function scanFile(file) {
				return basicsCommonSimpleUploadService.uploadFile(file.file, {
					basePath: 'model/main/filescan/',
					customRequest: {
						OriginalFileName: file.file.name
					}
				});
			}

			function handleScanResults(stepInfo, scanResult) {
				creationData.fileScanResult = scanResult;
				creationData.FileArchiveDocFk = scanResult.FileArchiveDocId;
				creationData.DocumentTypeFk = scanResult.documentTypeId;

				creationData.bulkModelInfo = scanResult.modelData;
				if (Array.isArray(creationData.bulkModelInfo)) {
					creationData.bulkModelInfo.forEach(function (fileItem, index) {
						fileItem.Id = index;
						if (index === 0) {
							fileItem.ModelFk = effectiveConfig.modelId;
						}
					});
				}

				updateFileMessage(creationData);
				updateFirstStepComplete(creationData);

				if (scanResult.errorCode !== 0) {
					return platformDialogService.showDialog({
						headerText$tr$: 'model.project.errorTitle',
						bodyText$tr$: 'model.project.errorMsgNoModelRecognized',
						bodyText$tr$param$: {
							errorMessage: scanResult.errorMessage,
							errorCode: scanResult.errorCode
						},
						showOkButton: true,
						iconClass: 'error'
					});
				} else if (!scanResult.is2DModel && !scanResult.is3DModel) {
					return platformModalService.showErrorBox('model.project.errorMsgNoModel', 'model.project.errorTitle');
				}

				let configPage = null;

				/* // use as inspiration for ALM 136198
				function createDocTypeLookup() {
					return basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.documenttype', null, {
						gid: 'baseGroup',
						model: 'DocumentTypeFk',
						label$tr$: 'model.project.modelDocType',
						readonly: true
					}, true);
				}
				 */

				if (scanResult.is2DModel) {
					configPage = {
						title$tr$: 'model.project.create2dModelFileTitle',
						canFinish: false,
						form: {
							fid: 'model.project.ModelImportDialog',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'baseGroup'
							}],
							rows: [{
								gid: 'baseGroup',
								rid: 'conversion',
								label$tr$: 'model.project.convert',
								change: updateFileMessage,
								model: 'Convert',
								type: 'boolean',
							}]
						},
					};
				} else if (scanResult.is3DModel) {
					configPage = {
						title$tr$: 'model.project.create3dModelFileTitle',
						canFinish: false,
						form: {
							fid: 'model.project.ModelImportDialog',
							showGrouping: false,
							skipPermissionsCheck: true,
							groups: [{
								gid: 'baseGroup'
							}],
							rows: [{
								gid: 'baseGroup',
								rid: 'conversion',
								label$tr$: 'model.project.convert',
								change: updateFileMessage,
								model: 'Convert',
								type: 'boolean',
							}, {
								gid: 'baseGroup',
								rid: 'generation',
								label$tr$: 'model.project.generate',
								model: 'GenerateIFCTree',
								type: 'boolean',
							}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelAdministrationModelImportProfileWithAutoselectLookupDataService',
								enableCache: true
							}, {
								gid: 'baseGroup',
								rid: 'importprf',
								model: 'ImportProfileFk',
								label$tr$: 'model.project.modelImportPrf'
							}), {
								gid: 'baseGroup',
								rid: 'trace',
								model: 'EnableTracing',
								sortOrder: 200,
								label$tr$: 'model.project.enableImportTracing',
								type: 'boolean'
							}, {
								gid: 'baseGroup',
								rid: 'tags',
								sortOrder: 100,
								label$tr$: 'model.project.importedPkTags',
								type: 'directive',
								directive: 'model-administration-property-key-tag-selector',
								options: {
									model: 'TagIds'
								}
							}]
						},
					};
				}

				if (!configPage) {
					throw new Error('Invalid state: No config step created.');
				}

				configPage.disallowBack = true;
				platformWizardDialogService.translateWizardSteps([configPage]);
				wzConfig.steps[configPageIndex] = configPage;

				stepInfo.step.disallowNext = false;
				return $timeout(function () {
					return stepInfo.commands.goToNext();
				});
			}

			function createModelFile(settings) {
				const bulkCreationData = {
					ProjectFk: effectiveConfig.projectId,
					NewModelCodePattern: settings.newModelCodePattern,
					NewModelDescriptionPattern: settings.newModelDescPattern,
					StartConversion: Boolean(settings.Convert),
					GenerateIFCTree: Boolean(settings.GenerateIFCTree),
					ImportProfileFk: settings.ImportProfileFk >= 1 ? settings.ImportProfileFk : null,
					EnableTracing: Boolean(settings.EnableTracing),
					TagIds: settings.TagIds,
					Files: Array.isArray(settings.bulkModelInfo) ? settings.bulkModelInfo.map(function (mi) {
						return {
							FileName: mi.fileName,
							ModelFk: mi.ModelFk,
							ModelDocumentTypeFk: mi.documentTypeId,
							SkipAction: mi.skipModel,
							IsMerge: mi.IsMerge,
							ModelFileType: mi.modelFileType
						};
					}) : null,
					FileArchiveDocFk: settings.FileArchiveDocFk,
					CompositeModelCodePattern: settings.compositeModelCodePattern,
					CompositeModelDescPattern: settings.compositeModelDescPattern,
					CreatecompositeModel: settings.createcompositeModel,
					ImportOption: settings.importOptions,
					MergeGroup: MergeGroup
				};

				return $http.post(globals.webApiBaseUrl + 'model/project/modelfile/createformodel', bulkCreationData).then(function (response) {
					const retrievedEntities = response.data;
					creationData.retrievedEntities = retrievedEntities;
					if (Array.isArray(retrievedEntities) && retrievedEntities.length > 0) {
						const services = {
							modelFile: $injector.get('modelProjectModelFileDataService')
						};

						const modelProjectModelDataService = $injector.get('modelProjectModelDataService');
						return modelProjectModelDataService.load().then(function () {
							for (let mf of retrievedEntities) {
								services.modelFile.updateOrAddItem(mf);
							}
						});
					}
				});
			}

			function checkReadyForUpload(changeInfo) {
				if (changeInfo.model.OriginFile) {
					_.find(changeInfo.wizard.steps, {id: 'upload'}).disallowNext = _.isNil(changeInfo.newValue);
				} else {
					_.find(changeInfo.wizard.steps, {id: 'upload'}).disallowNext = true;
				}
			}

			function checkImportOption(importOptionData) {

				if (importOptionData.newValue === 1) {

					const mergeable = [];
					let cpiXml = [];
					let other = [];
					const copy = structuredClone(creationData.bulkModelInfo); //To clone the object

					copy.forEach(function (fileData) {

						if (fileData.IsMerge === true) {

							if (cpiXml.length === 0) {
								cpiXml = fileData;
								mergeable.push(cpiXml);
							} else {
								cpiXml.fileName = cpiXml.fileName + ',' + fileData.fileName;
							}
						} else {
							other = fileData;
							mergeable.push(other);
						}

					});

					platformGridAPI.items.data('46fbbcff3b274d938e965ea1b1278b1d', mergeable);
				} else {
					platformGridAPI.items.data('46fbbcff3b274d938e965ea1b1278b1d', creationData.bulkModelInfo);
				}
			}

			// creates a form row with the grid that lists models
			function createModelsGrid(gid) {
				const columnsConfig = [
					{
						id: 'modelFileName',
						name$tr$: 'model.project.import.modelFileName',
						formatter: 'description',
						field: 'fileName',
						width: 150
					}, {
						id: 'modelFileType',
						field: 'documentTypeId',
						name: 'documenttype',
						name$tr$: 'model.project.modelDocType',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.documenttype'
						}).formatterOptions
					}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
						dataServiceName: 'modelProjectModelLookupDataService',
						enableCache: true,
						filter: () => _.isInteger(effectiveConfig.projectId) ? effectiveConfig.projectId : -1
					}, {
						id: 'modelfk',
						field: 'ModelFk',
						name$tr$: 'model.project.import.importInModel',
						width: 125
					}), {
						id: 'modelKind',
						name$tr$: 'model.project.import.modelKind',
						formatter: 'description',
						field: 'modelKind',
						width: 50
					}, {
						id: 'skipModel',
						name$tr$: 'model.project.import.skipModel',
						formatter: 'boolean',
						editor: 'boolean',
						field: 'skipModel',
						width: 50,
						disabled: false
					}
				];

				// configuration of the grid.
				const gridConfig = {
					id: '46fbbcff3b274d938e965ea1b1278b1d',
					columns: columnsConfig,
					lazyInit: true,
					enableConfigSave: false,
					options: {
						idProperty: 'Id',
						editable: true,
						indicator: true,
						skipPermissionCheck: true,
						disabled: false
					}
				};

				return {
					gid,
					rid: 'tags',
					sortOrder: 100,
					model: 'bulkModelInfo',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						gridConfig: gridConfig,
						height: '120px'
					}
				};
			}

			function getModelsSummaryGrid(gid) {
				// configuration for the columns of the grid.
				let summaryColumnConfig = [{
					id: 'ModelCode',
					name$tr$: 'model.project.modelSelWizard.modelCode',
					formatter: 'description',
					field: 'ModelCode',
					width: 150
				}, {
					id: 'ModelDescription',
					name$tr$: 'model.project.modelSelWizard.modelDesc',
					formatter: 'description',
					field: 'ModelDescription',
					width: 250
				}, {
					id: 'OriginFileName',
					name$tr$: 'model.project.import.modelFileName',
					formatter: 'description',
					field: 'OriginFileName',
					width: 220
				}, {
					id: 'conversionLaunched',
					name$tr$: 'model.project.import.conversionLaunched',
					formatter: 'boolean',
					field: 'Conversion',
					width: 120,
					disabled: true
				}, {
					id: 'isCompositeModel',
					name$tr$: 'model.project.import.isCompositeModel',
					formatter: 'boolean',
					field: 'IsCompositeModel',
					width: 100,
					disabled: true
				}];

				// configuration of the grid.
				const summaryGridConfig = {
					id: 'C716434A962540F8BB0C39FDA4471A4B',
					columns: summaryColumnConfig,
					lazyInit: true,
					enableConfigSave: false,
					options: {
						idProperty: 'Id',
						editable: true,
						indicator: true,
						skipPermissionCheck: true
					}
				};

				return {
					gid,
					rid: 'summary',
					sortOrder: 100,
					model: 'retrievedEntities',
					type: 'directive',
					directive: 'platform-grid-form-control',
					options: {
						gridConfig: summaryGridConfig,
						height: '120px'
					}
				};
			}

			const wzConfig = {
				title: $translate.instant('model.project.modelImportTitle'),
				steps: [{
					id: 'upload',
					disallowNext: true,
					form: {
						fid: 'model.project.ModelImportDialog',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'baseGroup'
						}],
						rows: [{
							gid: 'baseGroup',
							rid: 'projectName',
							label$tr$: 'cloud.common.entityProject',
							model: 'projectId',
							type: 'directive',
							sortOrder: 1,
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName'
							},
							readonly: true
						}, {
							gid: 'baseGroup',
							rid: 'file',
							label$tr$: 'model.project.entityFileArchiveDoc',
							model: 'OriginFile',
							type: 'fileselect',
							options: {
								maxSize: '10GB',
								retrieveFile: true
							},
							change: updateFirstStepComplete,
							sortOrder: 2
						}]
					},
					watches: [{
						expression: 'OriginFile',
						fn: checkReadyForUpload
					}]
				}, {
					id: 'scan',
					title$tr$: 'model.project.import.scanTitle',
					message$tr$: 'model.project.import.scanDesc',
					disallowNext: true,
					disallowBack: true,
					disallowCancel: true
				}, {
					id: 'destModels',
					title$tr$: 'model.project.import.destModels',
					topDescription$tr$: 'model.project.import.destModelsDesc',
					canFinish: false,
					form: {
						fid: 'model.project.ModelImportDialog',
						showGrouping: true,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'importModels',
							header$tr$: 'model.project.modelImportTitle',
							isOpen: true
						}, {
							gid: 'targetModels',
							header$tr$: 'model.project.import.targetModels',
							isOpen: true
						}, {
							gid: 'newModels',
							header$tr$: 'model.project.import.newModels',
							isOpen: true
						}, {
							gid: 'compositeModel',
							header$tr$: 'model.project.compositeModel',
							isOpen: true
						}],
						rows: [{
							gid: 'importModels',
							rid: 'importOptions',
							type: 'radio',
							model: 'importOptions',
							sortOrder: 0,
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'importOptions',
								items: [{
									Id: 2,
									Description: $translate.instant('model.project.import.importIndividually'),
									Value: 2
								}, {
									Id: 1,
									Description: $translate.instant('model.project.import.mergeIntoOneModel'),
									Value: 1
								}]
							}
						}, createModelsGrid('targetModels'), {
							gid: 'newModels',
							rid: 'code',
							label$tr$: 'cloud.common.entityCode',
							type: 'description',
							model: 'newModelCodePattern'
						}, {
							gid: 'newModels',
							rid: 'desc',
							label$tr$: 'cloud.common.entityDescription',
							type: 'description',
							model: 'newModelDescPattern'
						}, {
							gid: 'compositeModel',
							rid: 'createcompositeModel',
							label$tr$: 'model.project.import.createCompositeModel',
							model: 'createcompositeModel',
							type: 'boolean',
						}, {
							gid: 'compositeModel',
							rid: 'code',
							label$tr$: 'cloud.common.entityCode',
							type: 'description',
							model: 'compositeModelCodePattern'
						}, {
							gid: 'compositeModel',
							rid: 'description',
							label$tr$: 'cloud.common.entityDescription',
							type: 'description',
							model: 'compositeModelDescPattern'
						}]
					},
					watches: [{
						expression: 'importOptions',
						fn: checkImportOption
					}]
				}, {}, {
					id: 'createModelFile',
					title$tr$: 'model.project.import.createFileTitle',
					message$tr$: 'model.project.import.createFileDesc',
					disallowNext: true,
					disallowBack: true,
					disallowCancel: true
				}, {
					id: 'completion',
					title$tr$: 'model.project.modelFileCreatedTitle',
					topDescription$tr$: 'model.project.modelFileCreatedMsg',
					disallowBack: true,
					canFinish: true,
					form: {
						fid: 'model.project.ModelImportDialog',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'modelSummary',
							header$tr$: 'model.project.import.modelSummary',
							isOpen: true
						}],
						rows: [getModelsSummaryGrid('modelSummary')]
					}
				}],
				onChangeStep: function (stepInfo) {
					switch (_.get(stepInfo, 'step.id')) {
						case 'scan':
							return scanFile(stepInfo.model.OriginFile).then(function (scanResult) {
								return handleScanResults(stepInfo, scanResult);
							});
						case 'createModelFile':
							return createModelFile(stepInfo.model).then(function () {
								stepInfo.step.disallowNext = false;

								return $timeout(function () {
									return stepInfo.commands.goToNext();
								});
							});
					}
				},
				onStepChanging: function (stepInfo) {
					switch (_.get(stepInfo, 'step.id')) {
						case 'destModels':
							platformGridAPI.grids.commitAllEdits();
					}
				}

			};
			platformWizardDialogService.translateWizardConfig(wzConfig);
			return platformWizardDialogService.showDialog(wzConfig, creationData).then(function (result) {
				if (result.success) {
					return {
						ModelFk: result.data.ModelFk,
						FileArchiveDocFk: result.data.FileArchiveDocFk,
						Description: result.data.Description,
						OriginFileName: result.data.OriginFile.name,
						StartConversion: Boolean(result.data.Convert),
						ImportProfileFk: result.data.ImportProfileFk >= 1 ? result.data.ImportProfileFk : null,
						EnableTracing: Boolean(result.data.EnableTracing),
						TagIds: result.data.TagIds,
						DocumentTypeFk: result.data.fileScanResult.documentTypeId
					};
				}
				return null;
			});
		}

		service.showDialog = showDialog;

		service.showDialogForCurrentProject = function () {
			const projectMainService = $injector.get('projectMainService');
			const modelProjectModelDataService = $injector.get('modelProjectModelDataService');

			const selProject = projectMainService.getSelected();
			const selModel = null;  //modelProjectModelDataService.getSelected();

			//show dialog if poject is selected
			if (selProject) {
				return showDialog({
					projectId: selProject.Id,
					modelId: selModel ? selModel.Id : null
				});
			} else {

			}
		};

		return service;
	}
})(angular);
