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
	 * @name modelProjectModelDataService
	 * @function
	 *
	 * @description
	 * modelProjectModelServices is the data service for all model related functionality.
	 */
	angular.module('model.project').factory('modelProjectModelDataService', modelProjectModelDataService);

	modelProjectModelDataService.$inject = ['_', '$http', '$log',
		'$injector', '$translate', '$q', 'projectMainService', 'platformDataServiceFactory',
		'modelProjectModelValidationProcessor', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
		'platformModalFormConfigService', 'cloudDesktopPinningContextService', 'modelViewerModelSelectionService',
		'projectMainProjectSelectionService', 'projectMainFixedModuleConfigurationService',
		'ServiceDataProcessDatesExtension', 'platformRuntimeDataService'];

	function modelProjectModelDataService(_, $http, $log,
		$injector, $translate, $q, projectMainService, platformDataServiceFactory,
		modelProjectModelValidationProcessor, basicsLookupdataConfigGenerator, platformTranslateService,
		platformModalFormConfigService, cloudDesktopPinningContextService, modelViewerModelSelectionService,
		projectMainProjectSelectionService, projectMainFixedModuleConfigurationService,
		ServiceDataProcessDatesExtension, platformRuntimeDataService) {

		let serviceContainer;

		function updateModelTypeState(modelItem) {
			platformRuntimeDataService.readonly(modelItem, [{
				field: 'DocumentTypeFk',
				readonly: modelItem.IsImported || modelItem.IsComposite
			}]);
		}

		const exceptServiceOption = {
			flatNodeItem: {
				module: module,
				serviceName: 'modelProjectModelServices',
				entityNameTranslationID: 'model.project.translationDescModel',
				dataProcessor: [new ServiceDataProcessDatesExtension(['ExpiryDate']), {
					processItem: updateModelTypeState
				}],
				httpCreate: {
					route: globals.webApiBaseUrl + 'model/project/model/',
					endCreate: 'createmodel'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'model/project/model/'
				},
				actions: {
					create: 'flat'
				},
				entityRole: {
					node: {
						itemName: 'Models',
						parentService: projectMainService,
						handleUpdateDone: function () {
							if (Object.prototype.hasOwnProperty.call(serviceContainer.service, 'newModelId') && serviceContainer.service.newModelId !== null) {
								clearNewProjectCreatedId();
							}
						}
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData, svcData, creationOptions) {
							creationData.isComposite = false;
							if (creationOptions && !!creationOptions.asCompositeModel) {
								creationData.isComposite = creationOptions && !!creationOptions.asCompositeModel;
							}
							creationData.mainItemId = projectMainService.getSelected().Id;
							creationData.parentId = null;
						},
						handleCreateSucceeded: function (item) {
							setNewProjectCreatedId(item.Id);
							item.isNewlyCreated = true;
						}
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

		function setNewProjectCreatedId(id) {

			serviceContainer.service.newModelId = id;

		}

		function clearNewProjectCreatedId() {

			serviceContainer.service.newModelId = null;

		}

		serviceContainer.data.newEntityValidator = modelProjectModelValidationProcessor;

		function setCurrentPinningContext(dataService) {

			function setCurrentProjectToPinnningContext(dataService) {
				const currentItem = dataService.getSelected();
				if (currentItem) {
					let projectPromise = $q.when(true);
					const pinningContext = [];

					if (angular.isNumber(currentItem.Id)) {
						if (angular.isNumber(currentItem.ProjectFk)) {
							projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.ProjectFk).then(function (pinningItem) {
								pinningContext.push(pinningItem);
							});
						}
						pinningContext.push(
							new cloudDesktopPinningContextService.PinningItem('model.main', currentItem.Id,
								cloudDesktopPinningContextService.concate2StringsWithDelimiter(currentItem.Code, currentItem.Description, ' - '))
						);
					}

					return $q.all([projectPromise]).then(
						function () {
							if (pinningContext.length > 0) {
								cloudDesktopPinningContextService.setContext(pinningContext, dataService);
							}
						});
				}
			}

			setCurrentProjectToPinnningContext(dataService);
		}

		serviceContainer.service.getPinningOptions = function () {
			return {
				isActive: true,
				setContextCallback: setCurrentPinningContext // may own context service
			};
		};

		serviceContainer.service.updateItemList = function updateItemList(oldItem, newItem) {
			serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, serviceContainer.data);
			if (modelViewerModelSelectionService.getSelectedModelId() === newItem.Id) {
				modelViewerModelSelectionService.reevaluateSelectedModel();
			}
		};

		serviceContainer.service.updateModelState = function (modelId) {
			if (serviceContainer.data.itemList) {
				const item = _.find(serviceContainer.data.itemList, {Id: modelId});
				if (item) {
					$http.get(globals.webApiBaseUrl + 'model/project/model/getbyid?id=' + item.Id).then(function (response) {
						if (response.data) {
							serviceContainer.service.updateItemList(item, response.data);
						}
					});
				}
			}
		};

		serviceContainer.service.selectModelById = function (modelId) {
			if (modelId) {
				modelViewerModelSelectionService.setSelectedModelId(modelId);
			}
		};

		serviceContainer.service.deleteCompleteModel = function () {
			//result not used
			const platformModalService = $injector.get('platformModalService');
			const platformWizardService = $injector.get('platformSidebarWizardCommonTasksService');
			const entity = serviceContainer.service.getSelected();
			if (entity.Id) {
				const item = _.find(serviceContainer.data.itemList, {Id: entity.Id});
				if (item === null || angular.isUndefined(item)) {
					platformModalService.showErrorBox('model.project.alreadyDelete', 'model.project.deleteModelTitle');
				} else {
					platformModalService.showYesNoDialog('model.project.deleteQuestion', 'model.project.deleteModelTitle', 'no')
						.then(function (result) {
							if (result.yes) {
								$http.post(globals.webApiBaseUrl + 'model/project/model/deletecompletemodel', {mainItemId: entity.Id}
								).then(
									function (success) {
										serviceContainer.service.setSelected(null);
										serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
											return item.Id !== entity.Id;
										});
										serviceContainer.data.listLoaded.fire();
										$log.log(success);
										platformWizardService.showSuccessfullyDoneMessage();
									},
									function (failure) {
										$log.log(failure);
										platformModalService.showErrorBox('model.project.deleteFailed', 'model.project.deleteModelTitle');
									}
								);
							}
						});
				}
			}
		};

		serviceContainer.service.getQuickSelectableModels = function () {
			projectMainFixedModuleConfigurationService.updateProjectSelectionSource();
			const projectId = projectMainProjectSelectionService.getSelectedProjectId();
			if (projectId) {
				return $http.get(globals.webApiBaseUrl + 'model/project/model/list', {
					params: {
						mainItemId: projectId,
						include3D: true,
						include2D: false
					}
				}).then(function (response) {
					return _.isArray(response.data) ? response.data : [];
				});
			} else {
				return $q.resolve([]);
			}
		};

		serviceContainer.service.loadModelEntity = function (modelId) {
			return $http.post(globals.webApiBaseUrl + 'model/project/model/instance', {
				Id: modelId
			}).then(function (response) {
				return response.data;
			});
		};

		serviceContainer.service.groupModelList = function (items) {
			return _.compact(_.map(items, function processModelFamily(models) {
				models.forEach(m => m.modelId = m.Id);

				if (models.length <= 0) {
					return null;
				} else if (models.length === 1) {
					models[0].image = 'control-icons ico-model';
					return models[0];
				} else {
					models = _.sortBy(models, ['RevisionId']);
					let rootItem = _.clone(models[models.length - 1]);
					rootItem.Id = 'R' + rootItem.Id;
					rootItem.image = 'control-icons ico-model-root';
					rootItem.modelVersions = models;

					models.forEach(function updateModelVersion(modelVersion) {
						_.assign(modelVersion, {
							parentNodeId: rootItem.Id,
							image: 'control-icons ico-model-version'
						});
					});

					return rootItem;
				}
			}));
		};

		serviceContainer.service.updateModelTypeState = updateModelTypeState;

		serviceContainer.service.showPinningDocuments = {
			active: true,
			moduleName: 'model.main'
		};

		return serviceContainer.service;
	}
})(angular);
