/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectReusableWizardsService
	 * @function
	 *
	 * @description Provides reusable wizards.
	 */
	angular.module('model.project').factory('modelProjectReusableWizardsService', ['modelViewerModelSelectionService',
		'projectMainProjectSelectionService', 'platformWizardDialogService', '$translate', '_',
		'modelProjectSimplifiedModelListRetrievalService', 'projectMainSimplifiedProjectListRetrievalService',
		'projectMainService', 'basicsLookupdataConfigGenerator', '$http', 'modelProjectModelDataService',
		function (modelViewerModelSelectionService, projectMainProjectSelectionService, platformWizardDialogService,
		          $translate, _, modelProjectSimplifiedModelListRetrievalService,
		          projectMainSimplifiedProjectListRetrievalService, projectMainService, basicsLookupdataConfigGenerator,
		          $http, modelProjectModelDataService) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name createModelSelectionWizard
			 * @function
			 * @methodOf modelProjectReusableWizardsService
			 * @description Creates a wizard configuration for selecting a model.
			 * @param {Object} model The underlying data object being filled by the wizard.
			 * @param {Object} settings Optionally, a settings object.
			 * @return {Object} The wizard configuration.
			 */
			service.createModelSelectionWizard = function (model, settings) {
				var actualSettings = settings || {};

				var projectStepId = actualSettings.projectStepId || 'projectSelectionStep';
				var projectModel = actualSettings.projectProperty || 'project';

				var modelStepId = actualSettings.modelStepId || 'modelSelectionStep';
				var modelModel = actualSettings.modelProperty || 'model';

				if (!angular.isDefined(model[projectModel])) {
					model[projectModel] = {};
				}
				model[projectModel].selectionListConfig = {
					idProperty: 'Id',
					columns: [{
						id: 'number',
						field: 'ProjectNo',
						name$tr$: 'model.project.modelSelWizard.pjNo',
						width: 220,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}, {
						id: 'name',
						field: 'ProjectName',
						name$tr$: 'model.project.modelSelWizard.pjName',
						width: 220,
						formatter: 'Description',
						sortable: true,
						searchable: true,
						resizeable: true
					}]
				};
				model[projectModel].filterItem = function (item, filterText) {
					return (item.ProjectNo || '').toLowerCase().includes(filterText) ||
						(item.ProjectName || '').toLowerCase().includes(filterText);
				};

				if (!angular.isDefined(model[modelModel])) {
					model[modelModel] = {};
				}
				model[modelModel].selectionListConfig = {
					idProperty: 'Id',
					columns: [{
						id: 'code',
						field: 'Code',
						name$tr$: 'model.project.modelSelWizard.modelCode',
						width: 180,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}, {
						id: 'desc',
						field: 'Description',
						name$tr$: 'model.project.modelSelWizard.modelDesc',
						width: 220,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}]
				};
				model[modelModel].filterItem = function (item, filterText) {
					return (item.Code || '').toLowerCase().includes(filterText) ||
						(item.Description || '').toLowerCase().includes(filterText);
				};

				var selectedModelId = null;
				var selectedProjectId = null;
				if (!actualSettings.noLockToSelected) {
					var selectedModel = modelViewerModelSelectionService.getSelectedModel();
					if (selectedModel) {
						selectedModelId = selectedModel.modelId;
						selectedProjectId = selectedModel.projectId;
					} else {
						selectedProjectId = projectMainProjectSelectionService.getSelectedProjectId();
					}

					model[projectModel].selectedId = selectedProjectId;
					model[modelModel].selectedId = selectedModelId;
				}

				var steps = [];
				if (!selectedProjectId) {
					steps.push(platformWizardDialogService.createListStep(actualSettings.projectStepTitle || $translate.instant('model.project.modelSelWizard.projectSelTitle'),
						actualSettings.projectStepDesc || $translate.instant('model.project.modelSelWizard.projectSelDesc'),
						projectModel, projectStepId));
				}
				if (!selectedModelId) {
					steps.push(platformWizardDialogService.createListStep(actualSettings.modelStepTitle || $translate.instant('model.project.modelSelWizard.modelSelTitle'),
						actualSettings.modelStepDesc || $translate.instant('model.project.modelSelWizard.modelSelDesc'),
						modelModel, modelStepId));
				}

				return {
					steps: steps,
					onChangeStep: function (info) {
						if (info.step.id === projectStepId) {
							if (!info.model[projectModel].items) {
								info.step.loadingMessage = $translate.instant('model.project.modelSelWizard.loadingProjects');
								projectMainSimplifiedProjectListRetrievalService.getModelOwnerProjects().then(function (items) {
									info.model[projectModel].items = items;
									info.step.loadingMessage = null;
								});
							}
						} else if (info.step.id === modelStepId) {
							(function () {
								var selPjId = info.model[projectModel].selectedId;
								if (!info.model[modelModel].items && selPjId) {
									info.step.loadingMessage = $translate.instant('model.project.modelSelWizard.loadingModels');
									modelProjectSimplifiedModelListRetrievalService.getModelsForProject(selPjId).then(function (items) {
										info.model[modelModel].items = (function (items) {
											if (angular.isArray(items) && angular.isFunction(actualSettings.includeModel)) {
												return _.filter(items, actualSettings.includeModel);
											}
											return items;
										})(items);
										info.step.loadingMessage = null;
									});
								}
							})();
						}
					},
					watches: [{
						expression: projectModel + '.selectedId',
						fn: function (info) {
							info.model[modelModel].items = null;
						}
					}]
				};
			};

			service.createVersionedModelSelectionWizard = function (model, settings) {
				function clone(obj) {
					if (_.isNil(obj) || 'object' !== typeof obj) {
						return obj;
					}
					var copy = obj.constructor();
					for (var attr in obj) {
						if (Object.prototype.hasOwnProperty(obj, attr)) {
							copy[attr] = obj[attr];
						}
					}
					return copy;
				}

				var actualSettings = settings || {};
				var projectStepId = actualSettings.projectStepId || 'projectSelectionStep';
				var projectModel = actualSettings.projectProperty || 'project';

				var modelStepId = actualSettings.modelStepId || 'modelSelectionStep';
				var modelModel = actualSettings.modelProperty || 'model';

				if (!angular.isDefined(model[projectModel])) {
					model[projectModel] = {};
				}
				model[projectModel].selectionListConfig = {
					idProperty: 'Id',
					columns: [{
						id: 'number',
						field: 'ProjectNo',
						name$tr$: 'model.project.modelSelWizard.pjNo',
						width: 220,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}, {
						id: 'name',
						field: 'ProjectName',
						name$tr$: 'model.project.modelSelWizard.pjName',
						width: 220,
						formatter: 'Description',
						sortable: true,
						searchable: true,
						resizeable: true
					}]
				};
				model[projectModel].filterItem = function (item, filterText) {
					return (item.ProjectNo || '').toLowerCase().includes(filterText) ||
						(item.ProjectName || '').toLowerCase().includes(filterText);
				};

				if (!angular.isDefined(model[modelModel])) {
					model[modelModel] = {};
				}

				model[modelModel].selectionListConfig = {
					idProperty: 'Id',
					valMember: 'Id',
					dispMember: 'Code',
					showIcon: true,
					columns: [{
						id: 'code',
						field: 'Code',
						name$tr$: 'model.project.modelSelWizard.modelCode',
						width: 180,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}, {
						id: 'Description',
						field: 'Description',
						name$tr$: 'model.project.modelSelWizard.modelDesc',
						width: 220,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}, {
						id: 'ModelRevision',
						field: 'ModelRevision',
						name$tr$: 'model.project.modelSelWizard.modelRevision',
						width: 220,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}, {
						id: 'ModelVersion',
						field: 'ModelVersion',
						name$tr$: 'model.project.modelSelWizard.modelVersion',
						width: 220,
						formatter: 'description',
						sortable: true,
						searchable: true,
						resizeable: true
					}],
					options: {
						presenter: {
							tree: {
								parentProp: 'parentNodeId',
								childProp: 'modelVersions'
							}
						},
						skipPermissionCheck: true,
						tree: {
							parentProp: 'parentNodeId',
							childProp: 'modelVersions',
							childSort: false,
							isInitialSorted: true,
							sortOptions: {
								initialSortColumn: {field: 'Code', id: 'code'},
								isAsc: true
							}
						}
					},
					parentProp: 'parentNodeId',
					childProp: 'modelVersions',
					childSort: false,
					isInitialSorted: true,
					sortOptions: {
						initialSortColumn: {field: 'Code', id: 'code'},
						isAsc: true
					},
					uuid: '7591bccc23b9469284b93785fcb2e718'
				};
				var selectedModelId = null;
				var selectedProjectId = null;
				if (!actualSettings.noLockToSelected) {
					var selectedModel = modelViewerModelSelectionService.getSelectedModel();
					if (selectedModel) {
						selectedModelId = selectedModel.modelId;
						selectedProjectId = selectedModel.projectId;
					} else {
						selectedProjectId = projectMainProjectSelectionService.getSelectedProjectId();
					}

					model[projectModel].selectedId = selectedProjectId;
					model[modelModel].selectedId = selectedModelId;
				}

				var steps = [];
				if (!selectedProjectId) {
					steps.push(platformWizardDialogService.createListStep(actualSettings.projectStepTitle || $translate.instant('model.project.modelSelWizard.projectSelTitle'),
						actualSettings.projectStepDesc || $translate.instant('model.project.modelSelWizard.projectSelDesc'),
						projectModel, projectStepId));
				}
				if (!selectedModelId) {

					steps.push(platformWizardDialogService.createListStep(actualSettings.modelStepTitle || $translate.instant('model.project.modelSelWizard.modelSelTitle'),
						actualSettings.modelStepDesc || $translate.instant('model.project.modelSelWizard.modelSelDesc'),
						modelModel, modelStepId));
				}

				return {
					steps: steps,
					onChangeStep: function (info) {
						if (info.step.id === projectStepId) {
							if (!info.model[projectModel].items) {
								info.step.loadingMessage = $translate.instant('model.project.modelSelWizard.loadingProjects');
								projectMainSimplifiedProjectListRetrievalService.getModelOwnerProjects().then(function (items) {
									info.model[projectModel].items = items;
									info.step.loadingMessage = null;
								});
							}
						} else if (info.step.id === modelStepId) {
							(function () {
								var selPjId = info.model[projectModel].selectedId;
								if (!info.model[modelModel].items && selPjId) {
									info.step.loadingMessage = $translate.instant('model.project.modelSelWizard.loadingModels');

									$http.get(globals.webApiBaseUrl + 'model/project/model/listAllHeaders?mainItemId=' + selPjId).then(function (response) {
										info.model[modelModel].items = (function (response) {
											var items = response.data;
											var orderedItems = modelProjectModelDataService.groupModelList(items);
											return orderedItems;
										})(response);
										info.step.loadingMessage = null;
									});
								}
							})();
						}
					},
					watches: [{
						expression: projectModel + '.selectedId',
						fn: function (info) {
							info.model[modelModel].items = null;
						}
					}]
				};
			};

			return service;
		}]);
})(angular);
