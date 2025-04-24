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
	 * @name modelProjectModelVersionDataService
	 * @function
	 *
	 * @description
	 * modelProjectModelVersionDataService is the data service for  model versions related functionality.
	 */
	angular.module('model.project').factory('modelProjectModelVersionDataService', modelProjectModelVersionDataService);

	modelProjectModelVersionDataService.$inject = ['_', '$http', '$log',
		'$injector', '$translate', '$q', 'projectMainService', 'modelProjectModelDataService',
		'platformDataServiceFactory', 'modelProjectModelValidationProcessor', 'basicsLookupdataConfigGenerator',
		'platformTranslateService', 'platformModalFormConfigService', 'cloudDesktopPinningContextService',
		'modelViewerModelSelectionService'];

	function modelProjectModelVersionDataService(_, $http, $log, $injector, $translate, $q, projectMainService, modelProjectModelDataService,
		platformDataServiceFactory, modelProjectModelValidationProcessor, basicsLookupdataConfigGenerator,
		platformTranslateService, platformModalFormConfigService, cloudDesktopPinningContextService,
		modelViewerModelSelectionService) {

		// The instance of the main service - to be filled with functionality below

		const exceptServiceOption = {
			flatNodeItem: {
				module: module,
				serviceName: 'modelProjectModelVersionDataService',
				entityNameTranslationID: 'model.project.modelVersion',
				dataProcessor: [{
					processItem: modelProjectModelDataService.updateModelTypeState
				}],
				httpRead: {
					route: globals.webApiBaseUrl + 'model/project/model/version/',
					initReadData: function (readData) {
						const selectedModel = modelProjectModelDataService.getSelected();
						readData.filter = '?modelId=' + selectedModel.Id;
					}
				},
				actions: {
					create: false
				},
				entityRole: {
					node: {
						itemName: 'ModelVersions',
						parentService: modelProjectModelDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);
		serviceContainer.data.newEntityValidator = modelProjectModelValidationProcessor;

		serviceContainer.service.deleteCompleteModel = function deleteCompleteModel(project) {
			const entity = {
				Id: serviceContainer.service.hasSelection() ? serviceContainer.service.getSelected().Id : null
			};
			$injector.get('modelProjectModelLookupDataService').resetCache({lookupType: 'model'});

			const modalDeleteCompleteModelFConfig = {
				title: $translate.instant('model.project.deleteModelTitle'),
				//resizeable: true,
				dataItem: entity,
				formConfiguration: {
					fid: 'model.project.deleteModelTitle',
					version: '0.2.4',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['id']
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelProjectModelLookupDataService',
								filter: function () {
									return project.Id;
								}
							},
							{
								gid: 'baseGroup',
								rid: 'Id',
								label$tr$: 'model.project.translationDescModel',
								model: 'Id',
								sortOrder: 1
							}
						)
					]
				},
				handleOK: function handleOK() {//result not used
					const platformModalService = $injector.get('platformModalService');
					const platformWizardService = $injector.get('platformSidebarWizardCommonTasksService');
					if (entity.Id) {
						const item = _.find(serviceContainer.data.itemList, {Id: entity.Id});
						if (item === null || angular.isUndefined(item)) {
							platformModalService.showErrorBox('model.project.alreadyDelete', 'model.project.deleteModelTitle');
						} else {
							platformModalService.showYesNoDialog('model.project.deleteQuestion', 'model.project.deleteModelTitle', 'no')
								.then(function (result) {
									if (result.yes) {
										$http.post(globals.webApiBaseUrl + 'model/project/model/deletemodelversion', {mainItemId: entity.Id}
										).then(
											function (success) {
												$log.log(success);
												// success#
												platformWizardService.showSuccessfullyDoneMessage();
												serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
													return item.Id !== entity.Id;
												});
												serviceContainer.data.listLoaded.fire();
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
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return entity.Id === null;
					},
					disableCancelButton: function disableCancelButton() {
						return false;
					}
				}
			};

			platformTranslateService.translateFormConfig(modalDeleteCompleteModelFConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalDeleteCompleteModelFConfig);
		};

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

		serviceContainer.service.deleteCompleteModel = function () {
			//result not used
			const platformModalService = $injector.get('platformModalService');
			const platformWizardService = $injector.get('platformSidebarWizardCommonTasksService');
			const entity = serviceContainer.service.getSelected();
			if (entity) {
				if (entity.Id) {
					const item = _.find(serviceContainer.data.itemList, {Id: entity.Id});
					if (item === null || angular.isUndefined(item)) {
						platformModalService.showErrorBox('model.project.alreadyDelete', 'model.project.deleteModelTitle');
					} else {
						platformModalService.showYesNoDialog('model.project.deleteQuestion', 'model.project.deleteModelTitle', 'no')
							.then(function (result) {
								if (result.yes) {
									$http.post(globals.webApiBaseUrl + 'model/project/model/deletemodelversion', {mainItemId: entity.Id}
									).then(
										function (success) {
											$log.log(success);
											// success#
											platformWizardService.showSuccessfullyDoneMessage();
											serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
												return item.Id !== entity.Id;
											});
											serviceContainer.data.listLoaded.fire();
											modelProjectModelDataService.load();
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

			}
		};

		return serviceContainer.service;
	}
})(angular);
