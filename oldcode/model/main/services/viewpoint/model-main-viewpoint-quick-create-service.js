/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelMainViewpointQuickCreateService
	 * @function
	 *
	 * @description Provides a dialog box that allows to input settings for a new stored camera position.
	 */
	angular.module('model.main').factory('modelMainViewpointQuickCreateService', modelMainViewpointQuickCreateService);

	modelMainViewpointQuickCreateService.$inject = ['_', 'platformTranslateService', '$translate',
		'basicsCommonConfigLocationListService', 'platformModalFormConfigService',
		'modelViewerModelSettingsService', 'basicsLookupdataConfigGenerator',
		'$http', 'modelViewerModelSelectionService', 'modelAnnotationCameraUtilitiesService',
		'modelMainViewpointDataService','modelAnnotationViewpointDataService'];

	function modelMainViewpointQuickCreateService(_, platformTranslateService, $translate,
												  configLocations, platformModalFormConfigService,
												  modelSettingsService, basicsLookupdataConfigGenerator,
												  $http, modelViewerModelSelectionService, modelAnnotationCameraUtilitiesService,
												  modelMainViewpointDataService,modelAnnotationViewpointDataService) {

		/**
		 * @ngdoc function
		 * @name showDialog
		 * @function
		 * @methodOf modelMainViewpointQuickCreateService
		 * @description Shows a dialog that allows the user to enter settings for a new camera position.
		 * @returns Promise<Object> A promise that will be resolved when the dialog is closed. The `ok` property
		 *                          of the passed data object will indicated whether the settings in the dialog were
		 *                          confirmed, and the `data` property will hold the input data.
		 */
		function showDialog() {
			return configLocations.checkAccessRights(modelSettingsService.getPermissionsForPart('camPos')).then(function (grantedPermissions) {
				const newViewpointSettings = {
					Description: '',
					Scope: 'u',
					IsImportant: false
				};

				const options = {
					title: $translate.instant('model.viewer.newCustomCameraPos'),
					dataItem: newViewpointSettings,
					formConfiguration: {
						fid: 'model.viewer.newCameraPosition',
						showGrouping: false,
						groups: [
							{
								gid: '1'
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'code',
								label$tr$: 'cloud.common.entityCode',
								type: 'code',
								model: 'Code',
								visible: true,
								sortOrder: 10
							}, {
								gid: '1',
								rid: 'name',
								label$tr$: 'model.viewer.customCameraPosName',
								type: 'description',
								model: 'Description',
								visible: true,
								sortOrder: 20
							}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.modelviewpointtype', 'Description', {
								gid: '1',
								rid: 'type',
								label$tr$: 'model.main.viewpointType',
								model: 'ViewpointTypeFk',
								sortOrder: 30
							}), {
								gid: '1',
								rid: 'scope',
								label$tr$: 'basics.common.configLocation.label',
								type: 'select',
								options: {
									items: _.filter(configLocations.createItems(), function (scopeLevel) {
										return grantedPermissions[scopeLevel.id];
									}),
									valueMember: 'id',
									displayMember: 'title',
									modelIsObject: false
								},
								model: 'Scope',
								visible: true,
								sortOrder: 40
							}, {
								gid: '1',
								rid: 'important',
								label$tr$: 'model.viewer.customCameraPosImportant',
								type: 'boolean',
								model: 'IsImportant',
								visible: true,
								sortOrder: 50
							}
						]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !newViewpointSettings.Code || !newViewpointSettings.ViewpointTypeFk;
						}
					}
				};
				platformTranslateService.translateFormConfig(options.formConfiguration);
				return platformModalFormConfigService.showDialog(options).then(function (dlgResult) {
					if (dlgResult.ok) {
						return newViewpointSettings;
					}

					return null;
				});
			});
		}

		function addViewpoint(viewerInfo) {
			return showDialog().then(function (vpData) {
				if (vpData) {
					vpData.ModelFk = modelViewerModelSelectionService.getSelectedModelId();
					vpData.Camera = {};
					return modelAnnotationCameraUtilitiesService.enrichCameraEntityFromView(viewerInfo.info, vpData.Camera).then(function () {
						return $http.post(globals.webApiBaseUrl + 'model/main/viewpoint/quickcreate', vpData).then(function (response) {
							modelMainViewpointDataService.addItem(response.data);
							modelAnnotationViewpointDataService.addItem(response.data);
							return response.data;
						});
					});
				}
			});
		}

		return {
			addViewpoint: addViewpoint
		};
	}
})(angular);
