/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const module = angular.module('model.project');

	/**
	 * @ngdoc service
	 * @name modelProjectModelFileDataService
	 * @function
	 *
	 * @description
	 * modelProjectModelFileDataService is the data service for all model related functionality.
	 */
	angular.module('model.project').factory('modelProjectModelFileDataService', modelProjectModelFileDataService);

	modelProjectModelFileDataService.$inject = ['_', '$http', 'modelProjectModelDataService', 'modelProjectModelVersionDataService', 'platformDataServiceFactory', 'basicsCommonFileUploadServiceLocator',
		'PlatformMessenger', 'modelProjectFileActionProcessor', 'platformRuntimeDataService', '$translate',
		'platformModalFormConfigService', 'platformTranslateService', 'basicsLookupdataConfigGenerator', 'platformModalService',
		'modelProjectFileConversionService', 'basicsCommonServiceUploadExtension', '$injector', 'servicesSchedulerUIStatusNotificationService',
		'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService', '$q',
		'modelAdministrationModelImportProfileWithAutoselectLookupDataService'];

	function modelProjectModelFileDataService(_, $http, modelProjectModelDataService, modelProjectModelVersionDataService, platformDataServiceFactory, basicsCommonFileUploadServiceLocator,
		PlatformMessenger, modelProjectFileActionProcessor, platformRuntimeDataService, $translate,
		platformModalFormConfigService, platformTranslateService, basicsLookupdataConfigGenerator, platformModalService,
		modelProjectFileConversionService, basicsCommonServiceUploadExtension, $injector, servicesSchedulerUIStatusNotificationService,
		basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService, $q,
		modelAdministrationModelImportProfileWithAutoselectLookupDataService) {

		// The instance of the main service - to be filled with functionality below
		let service;
		let serviceContainer;

		let jobIds = [];
		const exceptServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'modelProjectModelFileDataService',
				entityNameTranslationID: 'model.project.translationDescModelFile',
				httpCreate: {route: globals.webApiBaseUrl + 'model/project/modelfile/'},
				httpRead: {
					route: globals.webApiBaseUrl + 'model/project/modelfile/',
					initReadData: function (readData) {
						let modelId;
						const selectedModel = modelProjectModelDataService.getSelected();
						const selectedModelVersion = modelProjectModelVersionDataService.getSelected();
						if (selectedModelVersion) {
							modelId = selectedModelVersion.Id;
						} else if (selectedModel) {
							modelId = selectedModel.Id;
						}
						if (modelId) {
							readData.filter = '?mainItemId=' + modelId;
						} else {
							readData.filter = '?mainItemId=' + 0;
						}

					}
				},
				dataProcessor: [
					{
						processItem: processItem
					},
					modelProjectFileActionProcessor,
					{
						processItem: function (item) {
							if (!_.isInteger(item.ImportProfileFk)) {
								item.ImportProfileFk = -1;
							}
						}
					}
				],
				actions: {delete: false, create: ''},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							delete creationData.MainItemId;
							creationData.Id = modelProjectModelDataService.getSelected().Id;
						},
						incorporateDataRead: function (itemList, data) {
							angular.forEach(itemList, function (item) {
								item.Status = {
									Status: 'Status',
									actionList: []
								};

								item.Action = {
									Action: item.FileArchiveDocFk ? 'Conversion' : '',
									actionList: []
								};
							});
							if (jobIds.length > 0) {
								servicesSchedulerUIStatusNotificationService.unregisterHandler(jobIds, serviceContainer.service.updateModelFileState);
							}
							jobIds = _.map(_.filter(itemList, function (item) {
								return item.State < 2;
							}), 'JobFk');
							servicesSchedulerUIStatusNotificationService.registerHandler(jobIds, serviceContainer.service.updateModelFileState);
							return serviceContainer.data.handleReadSucceeded(itemList, data);
						}
					}
				},
				entityRole: {leaf: {itemName: 'ModelFiles', parentService: modelProjectModelDataService}}
			}
		};

		function processItem(item) {
			if (item) {
				item.fileFilter = item.fileFilter || serviceContainer.service.getExtension();
			}
		}

		basicsLookupdataLookupFilterService.registerFilter([{
			key: 'model-project-model-available-for-2d-upload-filter',
			fn: function (modelEntity) {
				return !modelEntity.IsComposite && !modelEntity.Is3D;
			}
		}]);

		basicsLookupdataLookupFilterService.registerFilter([{
			key: 'model-project-model-available-for-3d-upload-filter',
			fn: function (modelEntity) {
				return !modelEntity.IsComposite && modelEntity.Is3D;
			}
		}]);

		basicsLookupdataLookupFilterService.registerFilter([{
			key: 'model-project-composite-model-available-for-update-filter',
			fn: function (modelEntity) {
				return modelEntity.IsComposite;
			}
		}]);

		serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

		serviceContainer.data.deleteRequested = new PlatformMessenger();

		service = serviceContainer.service;

		serviceContainer.data.usesCache = false;

		initUpload(service);

		/**
		 * @ngdoc function
		 * @name getExtension
		 * @function
		 *
		 * @methodOf modelProjectModelFileDataService
		 * @description get extension according to the id of the document type.
		 * @returns {string} the extension of the document type.
		 * @param documentTypeId
		 */
		service.getExtension = getExtension;

		function getExtension() {
			return '.zip.12da, .12daz, .4da,' +
				'.dgn, .dwf, .dwfx, .dwg, .dxf,' +
				'.pdf, .bmp, .gif, .jpg, .jpeg, .png, .tif, .tiff, .skp, .u3d, ' + getBimFiles();
		}

		function showDialog(modalCreateModelFileConfig) {
			platformTranslateService.translateFormConfig(modalCreateModelFileConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalCreateModelFileConfig);
		}

		function initUpload(service) {
			const uploadOptions = {
				uploadServiceKey: 'model.file',
				uploadConfigs: {
					SectionType: 'Model',
					appId: '17221f9d254d4304b2683915ab92c14a'
				},
				uploadFilesCallBack: uploadFilesCallBack,
				getExtension: getExtension
			};
			basicsCommonServiceUploadExtension.extendForCustom(service, uploadOptions);

			function uploadFilesCallBack(currItem, data) {
				currItem.FileArchiveDocFk = data.FileArchiveDocId;
				currItem.OriginFileName = data.fileName;
				currItem.Description = data.fileName.substr(0, 42);
			}
		}

		serviceContainer.service.resetModelFileState = function resetModelFileState(project) {
			let lastModelId;
			let fileExists = false;
			let modelFile;
			const getModelFile = function (modelId) {
				let item = null;
				if (modelId && modelId !== lastModelId) {
					let item = _.find(serviceContainer.service.getList(), {ModelFk: modelId});
					if (item) {
						fileExists = true;
						return $q.when(item);
					}

					return $http.get(globals.webApiBaseUrl + 'model/project/modelfile/list?mainItemId=' + modelId).then(function (response) {//response not used
						let item;
						if (response.data && response.data.length > 0) {
							fileExists = true;
							item = response.data[0];
						}
						return item;
					});
				}
				return item;
			};

			const canResetFile = function canResetFile(entity, value) {
				if (value && value !== lastModelId || !lastModelId) {
					getModelFile(value).then(function (response) {
						if (response) {
							fileExists = true;
							modelFile = response;
						} else {
							fileExists = false;
						}
					});
					return true;
				} else if (value === lastModelId) {
					return fileExists;
				}
				return fileExists;
			};

			if (serviceContainer.data.parentService.hasSelection()) {
				canResetFile(serviceContainer.data.parentService.getSelected(), serviceContainer.data.parentService.getSelected().Id);
			}
			if (modelProjectModelVersionDataService.hasSelection()) {
				canResetFile(modelProjectModelVersionDataService.getSelected(), modelProjectModelVersionDataService.getSelected().Id);
			}
			const entity = {
				Id: 0,
				ModelFk: serviceContainer.data.parentService.hasSelection() ? serviceContainer.data.parentService.getSelected().Id : null
			};

			const modalResetModelFileStateConfig = {
				title: $translate.instant('model.project.resetModelFileStateTitle'),
				//resizeable: true,
				dataItem: entity,
				formConfiguration: {
					fid: 'model.project.resetModelFileModal',
					version: '0.2.4',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['modelfk']
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelProjectModelLookupDataService',
								filter: function () {
									return project.Id;
								},
								enableCache: true
							},
							{
								gid: 'baseGroup',
								rid: 'modelfk',
								label$tr$: 'model.project.translationDescModel',
								model: 'ModelFk',
								validator: canResetFile,
								sortOrder: 1
							}
						)
					]
				},
				handleOK: function handleOK() {//result not used
					if (entity.ModelFk && canResetFile(entity, entity.ModelFk)) {
						let newItem = _.cloneDeep(modelFile);
						newItem.State = -1;
						$http.post(globals.webApiBaseUrl + 'model/project/modelfile/resetstate', newItem
						).then(function (response) {//response not used
							if (_.isArray(response.data)) {
								newItem = response.data[0];
							} else {
								newItem = response.data;
							}

							newItem.Status = {
								Status: 'Status',
								actionList: []
							};

							newItem.Action = {
								Action: newItem.FileArchiveDocFk ? 'Conversion' : '',
								actionList: []
							};
							if (newItem.JobFk) {
								servicesSchedulerUIStatusNotificationService.registerHandler([item.JobFk], serviceContainer.service.updateModelFileState);
							}
							service.updateItemList(modelFile, newItem);
							serviceContainer.data.listLoaded.fire();
						});
					}
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return !fileExists;
					},
					disableCancelButton: function disableCancelButton() {
						return false;
					}
				}
			};

			showDialog(modalResetModelFileStateConfig);

		};
		serviceContainer.service.create = function createModelFile(project) {
			if (serviceContainer.data.parentService.hasSelection()) {
				const selected = _.find(serviceContainer.data.parentService.getList(), {Id: serviceContainer.data.parentService.getSelected().Id});
				if (selected && selected.Version <= 0) {
					platformModalService.showMsgBox($translate.instant('model.project.errorModelNotSaved'), $translate.instant('model.project.createModelFileTitle'), 'info');
					return;
				}
			}
			$injector.get('modelProjectModelLookupDataService').resetCache({lookupType: 'model'});
			const entity = {
				Id: 0,
				Description: '',
				OriginFileName: '',
				FileArchiveDocFk: null,
				Convert: true,
				ModelFk: serviceContainer.data.parentService.hasSelection() ? (function () {
					const selModel = serviceContainer.data.parentService.getSelected();
					if (selModel.IsComposite) {
						return null;
					} else {

						return selModel.Id;
					}
				})() : null,
				ImportProfileFk: modelAdministrationModelImportProfileWithAutoselectLookupDataService.getDefaultItemId(),
				EnableTracing: false,
				Is3d: serviceContainer.data.parentService.hasSelection() ? (function () {
					const selModel = serviceContainer.data.parentService.getSelected();
					const modelType = basicsLookupdataLookupDescriptorService.getLookupItem('MdlType', selModel.TypeFk);

					return modelType ? modelType.Is3d : true;

					// if (selModel.IsComposite) {
					//     return null;
					// } else {
					//     return selModel.TypeFk;//TODO: Change when DB gets updated to show Is_3d
					// }
				})() : null
			};

			const canCreateFile = function canCreateFile() {
				return true;
			};
			//Enabling Uploading Model Versions
			const canUploadFile = function canUploadFile() {
				return function () {
					return true;
				};
			};

			function uploadFilesCallBack(currItem, data) {
				currItem.FileArchiveDocFk = data.FileArchiveDocId;
				currItem.OriginFileName = data.fileName;
			}

			let uploadConfig;
			if (!entity.Is3d) {//TODO: change boolean to match true/false when DB fixed
				uploadConfig = {

					gid: 'baseGroup',
					rid: 'originfilename',
					label$tr$: 'model.project.entityFileArchiveDoc',
					model: 'OriginFileName',
					sortOrder: 3,
					type: 'directive',
					directive: 'model-project-file-upload-2d-input',
					'options': {
						formData: {
							sectionType: 'Model',
							action: 'Upload',
							appId: '17221f9d254d4304b2683915ab92c14a'
						},
						uploadServiceKey: 'model.file',
						fileFilter: '.dgn, .dwf, .dwg, .pdf, .bmp, .jpg, .jpeg, .png, .tif, .tiff',
						canUpload: canUploadFile,
						uploadFilesCallBack: uploadFilesCallBack
					}

				};
			} else {
				uploadConfig = {

					gid: 'baseGroup',
					rid: 'originfilename',
					label$tr$: 'model.project.entityFileArchiveDoc',
					model: 'OriginFileName',
					sortOrder: 3,
					type: 'directive',
					directive: 'model-project-file-upload-input',
					'options': {
						formData: {
							sectionType: 'Model',
							action: 'Upload',
							appId: '17221f9d254d4304b2683915ab92c14a'
						},
						uploadServiceKey: 'model.file',
						fileFilter: getBimFiles(),
						canUpload: canUploadFile

					}
				};
			}

			const modalCreateModelFileConfig = {
				title: $translate.instant(entity.Is3d ? 'model.project.create3dModelFileTitle' : 'model.project.create2dModelFileTitle'),
				//resizeable: true,
				dataItem: entity,
				formConfiguration: {
					fid: 'model.project.createModelFileModal',
					version: '0.2.4',
					showGrouping: Boolean(entity.Is3d),
					groups: [
						{
							gid: 'baseGroup',
							header$tr$: 'model.project.basicImportSettings',
							isOpen: true
						}, {
							gid: 'modelCnvGroup',
							header$tr$: 'model.project.modelCnvGroup',
							isOpen: true
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelProjectModelLookupDataService',
								filter: function () {
									return project.Id;
								},
								filterKey: entity.Is3d ? 'model-project-model-available-for-3d-upload-filter' : 'model-project-model-available-for-2d-upload-filter'
							},
							{
								gid: 'baseGroup',
								rid: 'modelfk',
								label$tr$: 'model.project.translationDescModel',
								model: 'ModelFk',
								validator: canCreateFile,
								sortOrder: 1
							}
						),
						{
							gid: 'baseGroup',
							rid: 'description',
							label$tr$: 'cloud.common.entityDescription',
							model: 'Description',
							type: 'description',
							sortOrder: 2
						},

						uploadConfig,
						{
							gid: entity.Is3d ? 'modelCnvGroup' : 'baseGroup',
							rid: 'conversion',
							model: 'Convert',
							sortOrder: 4,
							label$tr$: 'model.project.convert',
							type: 'boolean'
						}
					],
				},
				handleCancel: function handleCancel() {
					service.getUploadService().deleteUploadItemByEntity(entity);
					if (entity.FileArchiveDocFk) {
						$http.post(globals.webApiBaseUrl + 'model/project/modelfile/deletefilearchive?id=' + entity.FileArchiveDocFk);
					}
				},
				handleOK: function handleOK(result) {//result not used
					if (entity.ModelFk && entity.FileArchiveDocFk) {
						const creationData = {
							ModelFk: result.data.ModelFk,
							FileArchiveDocFk: result.data.FileArchiveDocFk,
							Description: result.data.Description,
							OriginFileName: result.data.OriginFileName,
							StartConversion: Boolean(result.data.Convert),
							ImportProfileFk: result.data.ImportProfileFk >= 1 ? result.data.ImportProfileFk : null,
							EnableTracing: Boolean(entity.EnableTracing),
							TagIds: entity.TagIds
						};
						$http.post(globals.webApiBaseUrl + 'model/project/modelfile/createformodel', creationData).then(function (response) {
							const retrievedEntity = response.data;
							if (entity && entity.ModelFk) {
								response.data.Action = 'Conversion';
								response.data.Status = 'Status';

								response.data.Status = {
									Status: 'Status',
									actionList: []
								};

								response.data.Action = {
									Action: 'Conversion',
									actionList: []
								};
								if (!_.find(serviceContainer.data.itemList, function (mf) {
									return (mf.ModelFk === response.data.ModelFk) && (mf.Id === response.data.Id);
								})) {
									serviceContainer.data.itemList.push(response.data);
								}
								const newItem = response.data;

								let conversionPromise;
								if (result.data.Convert) {
									const newModelVersion = retrievedEntity.ModelFk !== entity.ModelFk;
									const loadPromise = newModelVersion ? modelProjectModelDataService.load() : $q.when(true);

									conversionPromise = loadPromise.then(function () {
										if (newModelVersion) {
											const newModelItem = _.find(modelProjectModelDataService.getList(), {Id: retrievedEntity.ModelFk});
											modelProjectModelDataService.setSelected(newModelItem);
										}
										servicesSchedulerUIStatusNotificationService.registerHandler([response.data.JobFk], serviceContainer.service.updateModelFileState);
									});
								} else {
									conversionPromise = $q.when(true);
								}

								return conversionPromise.then(function () {
									service.updateItemList(response.data, newItem);
									serviceContainer.data.listLoaded.fire();
								});
							}
						});
					} else {
						platformModalService.showMsgBox($translate.instant('model.project.errorEmptyInput'), $translate.instant('model.project.createModelFileTitle'), 'info');
						showDialog(modalCreateModelFileConfig);
					}
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return !(entity.ModelFk && entity.FileArchiveDocFk);
					},
					disableCancelButton: function disableCancelButton() {
						return false;
					}
				}
			};

			if (entity.Is3d) {
				modalCreateModelFileConfig.formConfiguration.rows.push(basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'modelAdministrationModelImportProfileWithAutoselectLookupDataService',
					enableCache: true
				}, {
					gid: 'modelCnvGroup',
					rid: 'importprf',
					model: 'ImportProfileFk',
					sortOrder: 6,
					label$tr$: 'model.project.modelImportPrf'
				}), {
					gid: 'modelCnvGroup',
					rid: 'trace',
					model: 'EnableTracing',
					sortOrder: 200,
					label$tr$: 'model.project.enableImportTracing',
					type: 'boolean'
				}, {
					gid: 'modelCnvGroup',
					rid: 'tags',
					sortOrder: 100,
					label$tr$: 'model.project.importedPkTags',
					type: 'directive',
					directive: 'model-administration-property-key-tag-selector',
					options: {
						model: 'TagIds'
					}
				});
			}

			showDialog(modalCreateModelFileConfig);
		};

		service.updateItemList = function updateItemList(oldItem, newItem) {
			serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, serviceContainer.data);
		};

		service.updateModelFileState = function updateModelFileState(arg) {
			const item = _.find(serviceContainer.data.itemList, {JobFk: arg.jobId});
			if (item) {
				$http.get(globals.webApiBaseUrl + 'model/project/modelfile/getbyid?id=' + item.Id).then(function (response) {
					if (arg.isFinal && arg.state === 3) {
						response.data.State = 100;
					}
					service.updateItemList(item, response.data);
					if (arg.isFinal && response.data) {
						modelProjectModelDataService.updateModelState(response.data.ModelFk);
						serviceContainer.data.listLoaded.fire();
					}
				});
			}
		};

		function selectionChanged() {
			service.load();
		}

		modelProjectModelVersionDataService.registerSelectionChanged(selectionChanged);

		service.unregisterAll = function () {
			if (jobIds.length > 0) {
				servicesSchedulerUIStatusNotificationService.unregisterHandler(jobIds, service.updateModelFileState);
			}
		};
		const possibleFiles = ['7z', 'cpixml', 'cpixmlz', 'ifc', 'rvt', 'zip'];

		//
		function getBimFiles() {
			return _.join(_.map(possibleFiles, function (v) {
				return '.' + v;
			}), ',');
		}

		service.getBimFiles = getBimFiles;

		//
		function getBimFilesAsGlob() {
			return _.join(_.map(possibleFiles, function (v) {
				return '*.' + v;
			}), ',');
		}

		service.getBimFilesAsGlob = getBimFilesAsGlob;

		service.updateOrAddItem = function (item) {
			if (Array.isArray(serviceContainer.data.itemList)) {
				const existingItem = _.find(serviceContainer.data.itemList, {Id: item.Id});
				if (existingItem) {
					serviceContainer.data.mergeItemAfterSuccessfullUpdate(existingItem, item, true, serviceContainer.data);
				} else {
					serviceContainer.data.itemList.push(item);
				}

				item.Status = {
					Status: 'Status',
					actionList: []
				};

				item.Action = {
					Action: 'Conversion',
					actionList: []
				};

				service.updateModelFileState(item);
				serviceContainer.data.listLoaded.fire();

				if (_.isInteger(item.JobFk)) {
					servicesSchedulerUIStatusNotificationService.registerHandler([item.JobFk], service.updateModelFileState);
				}
			}
		};

		return service;
	}
})(angular);
