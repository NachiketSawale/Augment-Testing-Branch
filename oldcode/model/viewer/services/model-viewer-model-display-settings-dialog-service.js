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
	angular.module('model.viewer').factory('modelViewerModelDisplaySettingsDialogService', ['_', '$translate',
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
						fid: 'model.viewer.modelDisplaySettingsForm',
						version: '1.0.0',
						showGrouping: false,
						groups: [{
							gid: 1,
							header: ''
						}],
						rows: [{
							gid: 1,
							rid: 'showModel',
							label$tr$: 'model.viewer.showModelSetting',
							type: 'select',
							options: {
								items: showModelOptions,
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							},
							model: 'showModel'
						}, {
							gid: 1,
							rid: 'selColor',
							label$tr$: 'model.viewer.selColor',
							type: 'color',
							model: 'selColor',
							fill: false
						}, {
							gid: 1,
							rid: 'showBackfaces',
							label$tr$: 'model.viewer.showBackfaces',
							type: 'boolean',
							model: 'showBackfaces'
						}]
					},
					fallbackDataItem: {
						showModel: true,
						selColor: 0xFFFF00,
						showBackfaces: true
					},
					dataItem: {},
					headerText$tr$: 'model.viewer.modelSettingsTitle',
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
