/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerModelDisplaySettingsDialogService
	 * @function
	 *
	 * @description Provides a dialog box for configuring model-specific display settings.
	 */
	angular.module('model.project').factory('modelProjectModelDrawingDialogService', ['_', '$translate',
		'platformScopedConfigDialogService', 'platformTranslateService', 'modelViewerModelSettingsService',
		'modelViewerModelSelectionService', 'modelViewerUtilitiesService', 'basicsCommonConfigLocationListService',
		function (_, $translate, platformScopedConfigDialogService, platformTranslateService, modelSettingsService,
		          modelSelectionService, viewerUtils, configLocations) {
			var service = {};

			service.showDialog = function () {
				if (!modelSelectionService.getSelectedModelId()) {
					throw new Error('Currently, no model is selected.');
				}

				var showModelOptions = [
					{
						text$tr$: 'model.viewer.showModelSettingShow',
						value: true
					}, {
						text$tr$: 'model.viewer.showModelSettingHide',
						value: false
					}
				];
				platformTranslateService.translateObject(showModelOptions, 'text');

				var dlgOptions = {
					formConfiguration: {
						fid: 'model.view.drawingSetting',
						version: '1.0.0',
						showGrouping: false,
						groups: [{
							gid: 1,
							header: 'Drawing Settings'
						}],
						rows: [{
							gid: 1,
							rid: 'Base UoM',
							label$tr$: 'model.project.baseUoM',
							type: 'select',
							model: 'baseUoM'
						}, {
							gid: 1,
							rid: 'Horizontal Scale',
							label$tr$: 'model.project.horizontalScale',
							type: 'select',
							model: 'horizontalScale'
						}, {
							gid: 1,
							rid: 'Vertical Scale',
							label$tr$: 'model.project.verticalScale',
							type: 'select',
							model: 'verticalScale'
						}]
					},
					fallbackDataItem: null,
					dataItem: {},
					headerText$tr$: 'model.project.modelSettingsTitle',
					permissions: modelSettingsService.getPermissionsForPart('displaySettings'),
					handleOK: function () {
						var settings = modelSettingsService.getSettingsPart('displaySettings');
						configLocations.createItems().forEach(function (cfgScope) {
							var scopedDataItem = dlgOptions.dataItem[cfgScope.id];
							var origSettings = settings[cfgScope.id];
							if (!origSettings) {
								origSettings = settings[cfgScope.id] = {};
							}

							if (angular.isDefined(scopedDataItem.selColor)) {
								origSettings.selColor = viewerUtils.intToRgbColor(scopedDataItem.selColor);
							} else {
								delete origSettings.selColor;
							}
							origSettings.showModel = scopedDataItem.showModel;
							origSettings.showBackfaces = scopedDataItem.showBackfaces;
						});

						modelSettingsService.untrackSettings(settingsReady, ['displaySettings']);
						modelSettingsService.modifyDisplaySettings();
					},
					handleCancel: function () {
						modelSettingsService.untrackSettings(settingsReady, ['displaySettings']);
					}
				};
				platformTranslateService.translateFormConfig(dlgOptions.formConfiguration);

				function settingsReady() {
					var settings = modelSettingsService.getSettingsPart('displaySettings');
					configLocations.createItems().forEach(function (cfgScope) {
						var scopedDataItem = {};
						dlgOptions.dataItem[cfgScope.id] = scopedDataItem;
						var origSettings = settings[cfgScope.id];

						if (origSettings) {
							if (origSettings.selColor && !_.isUndefined(origSettings.selColor) && (origSettings.selColor !== null)) {
								scopedDataItem.selColor = viewerUtils.rgbColorToInt(origSettings.selColor);
							}
							scopedDataItem.showModel = origSettings.showModel;
							scopedDataItem.showBackfaces = origSettings.showBackfaces;
						}
					});

					platformScopedConfigDialogService.showDialog(dlgOptions);
				}

				modelSettingsService.trackSettings(settingsReady, ['displaySettings']);
			};

			return service;
		}]);
})(angular);
