/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectModelCompositeUpdateWizardService
	 * @function
	 *
	 * @description Provides a status change wizard for object sets.
	 */
	angular.module('model.project').service('modelProjectModelCompositeUpdateWizardService', ['_',
		'platformWizardDialogService', 'modelProjectModelDataService', 'projectMainService',
		'basicsLookupdataConfigGenerator', 'platformGridAPI', '$http', '$q', '$translate',
		function (_, platformWizardDialogService, modelProjectModelDataService, projectMainService,
		          basicsLookupdataConfigGenerator, platformGridAPI, $http, $q, $translate) {
			var service = {};
			var wzConfig = {
				title$tr$: 'model.project.updateCompositeModelVersion',
				steps: [{
					id: 'chooseCompositeModel',
					title$tr$: 'model.project.compositeModelVersionInformation',
					form: {
						id: 'newCompositeModelVersion',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [
							basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'modelProjectModelLookupDataService',
									filter: function () {
										//var selectedModel = modelProjectModelDataService.getSelected();
										return projectMainService.getSelected().Id;
									},
									filterKey: 'model-project-composite-model-available-for-update-filter'
								},
								{
									gid: 'default',
									rid: 'modelfk',
									label$tr$: 'model.project.compositeModel',
									model: 'ModelFk',
									visible: true,
									sortOrder: 1
								}
							),
							{
								gid: 'default',
								rid: 'newVersionCode',
								type: 'description',
								model: 'newversioncode',
								label$tr$: 'model.project.newVersionCode',
								visible: true,
								sortOrder: 2,
								placeholder: $translate.instant('model.project.emptyToGenerate')
							}, {
								gid: 'default',
								rid: 'newVersionDescription',
								type: 'description',
								model: 'newversiondescription',
								label$tr$: 'model.project.newVersionDescription',
								visible: true,
								sortOrder: 3,
								placeholder: $translate.instant('model.project.emptyToGenerate')
							}, {
								gid: 'default',
								rid: 'modelversion',
								type: 'description',
								model: 'modelVersion',
								label$tr$: 'model.project.modelVersion',
								visible: true,
								sortOrder: 4
							}, {
								gid: 'default',
								rid: 'modelrevision',
								type: 'description',
								model: 'modelRevision',
								label$tr$: 'model.project.modelRevision',
								visible: true,
								sortOrder: 5
							}]
					},
					watches: [{
						expression: 'ModelFk',
						fn: function (info) {
							getModelInfo(info.newValue).then(function (preInput) {
								info.model.modelVersion = preInput.modelVersion;
								info.model.modelRevision = preInput.modelRevision;
							});
						}
					}]
				}, {
					id: 'subModelsVersionsList',
					title$tr$: 'model.project.chooseSubModelsVersions',
					form: {
						fid: 'subModelsVersions',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'Hierarchy',
							label$tr$: 'model.project.updateCompositeModel',
							type: 'directive',
							directive: 'model-project-model-list',
							model: 'Levels',
							visible: true,
							// local validator for uom code field
							validator: 'validateUom',
							sortOrder: 1,
							image: 'ico-filter'
						}]
					},
					disallowBack: true,
					canFinish: true
				}]
			};
			platformWizardDialogService.translateWizardConfig(wzConfig);

			service.showDialog = function () {
				getModelInfo().then(function (preInput) {
					return platformWizardDialogService.showDialog(wzConfig,
						{
							ModelFk: (function () {
								if (modelProjectModelDataService.getSelected()) {
									if (modelProjectModelDataService.getSelected().IsComposite === true) {
										var model = modelProjectModelDataService.getSelected();
										return model.Id;
									}
								}
							})(),
							modelVersion: (function () {
								if (preInput) {
									return preInput.modelVersion;
								} else {
									return '';
								}
							})(),
							modelRevision: (function () {
								if (preInput) {
									return preInput.modelRevision;
								} else {
									return '';
								}
							})()
						}
					).then(function (result) {
						if (result.success) {
							platformGridAPI.grids.commitAllEdits();
							result.isComposite = true;
							result.mainItemId = projectMainService.getSelected().Id;
							result.parentId = null;
							result.modelRootFk = result.data.ModelFk;
							result.versionCode = result.data.newversioncode;
							result.versionDescription = result.data.newversiondescription;
							result.modelVersion = result.data.modelVersion;
							result.modelRevision = result.data.modelRevision;
							result.subModelIds = _.flattenDeep(result.data.subModelsData);
							$http.post(globals.webApiBaseUrl + 'model/project/model/createCompositeModelVersion', result).then(function () {
								modelProjectModelDataService.load();
							});
						}
					});
				});
			};

			function getModelInfo(selectedCompositeModelId) {
				var defaultSelectedModel = modelProjectModelDataService.getSelected();
				if (defaultSelectedModel) {
					if (!selectedCompositeModelId && defaultSelectedModel.IsComposite === true) {
						selectedCompositeModelId = modelProjectModelDataService.getSelected().Id;
					}
				}
				var preInput = [];
				if (selectedCompositeModelId) {
					return $http.get(globals.webApiBaseUrl + 'model/project/model/version/list?modelId=' + selectedCompositeModelId).then(function (response) {
						if (response) {
							var lastItemIndex;
							var lastRevisionId;
							if (response.data.length > 0) {
								lastItemIndex = response.data.length - 1;
								lastRevisionId = response.data[lastItemIndex].RevisionId;
							}

							if (lastRevisionId) {
								preInput.modelVersion = lastRevisionId + 1;
								preInput.modelRevision = lastRevisionId + 1 + 'A';
							} else {
								preInput.modelVersion = '';
								preInput.modelRevision = '';
							}
							return preInput;
						}
					});
				} else {
					return $q.resolve(preInput);
				}

			}

			return service;
		}]);
})(angular);
