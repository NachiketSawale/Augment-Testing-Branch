/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsConfigurationService
	 * @function
	 *
	 * @description Provides a dialog box for configuring the Hoops Viewer and its operators.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsConfigurationService',
		modelViewerHoopsConfigurationService);

	modelViewerHoopsConfigurationService.$inject = ['_', '$q', '$translate',
		'platformTranslateService', 'platformRuntimeDataService', 'platformPermissionService',
		'permissions', 'platformMasterDetailDialogService', 'basicsLookupdataConfigGenerator',
		'modelAdministrationViewerSettingsRuntimeService'];

	function modelViewerHoopsConfigurationService(_, $q, $translate,
		platformTranslateService, platformRuntimeDataService, platformPermissionService,
		permissions, platformMasterDetailDialogService, basicsLookupdataConfigGenerator,
		modelAdministrationViewerSettingsRuntimeService) {

		const serverSideRenderingPermission = '9ba3ded9b7d64517b9000c9936d19e4a';

		function showDialogBox(config) {
			return $q.all({
				permissions: platformPermissionService.loadPermissions([serverSideRenderingPermission]),
				activeSettings: modelAdministrationViewerSettingsRuntimeService.loadActiveSettings()
			}).then(function (data) {
				const mayUseServerSideRendering = platformPermissionService.has(serverSideRenderingPermission, permissions.execute);

				const actualConfig = _.assign({
					settings: {}
				}, config);

				const renderModeOptions = [
					{
						text$tr$: 'model.viewer.hoops.renderModeServer',
						value: 's'
					}, {
						text$tr$: 'model.viewer.hoops.renderModeClient',
						value: 'c'
					}
				];
				platformTranslateService.translateObject(renderModeOptions, 'text');

				const streamingModeOptions = [
					{
						text$tr$: 'model.viewer.hoops.streamingModeFull',
						value: 'f'
					}, {
						text$tr$: 'model.viewer.hoops.streamingModeLazy',
						value: 'l'
					}
				];
				platformTranslateService.translateObject(streamingModeOptions, 'text');

				const drawingModeOptions = [
					{
						text$tr$: 'model.viewer.hoops.drawHidden',
						value: 'h'
					}, {
						text$tr$: 'model.viewer.hoops.drawShaded',
						value: 's'
					}, {
						text$tr$: 'model.viewer.hoops.drawWireframe',
						value: 'w'
					}, {
						text$tr$: 'model.viewer.hoops.drawWireframeOnShaded',
						value: 'a'
					}
				];
				platformTranslateService.translateObject(drawingModeOptions, 'text');

				const antiAliasingOptions = [
					{
						text$tr$: 'model.viewer.aaNone',
						value: '-'
					}, {
						text$tr$: 'model.viewer.aaSMAA',
						value: 'smaa'
					}
				];
				platformTranslateService.translateObject(antiAliasingOptions, 'text');

				const generalSettings = data.activeSettings; // loaded from active profile
				const settings = _.assign({}, actualConfig.settings); // set for current viewer

				const cleanUpRoutines = [];

				function generatePage(titleKey, settingsId, rows) {
					const activationProp = '_activate_' + settingsId;

					const readOnlyProps = {};

					const relevantPropNames = (function findProps() {
						const result = [];

						function processObjectWithModel(obj) {
							result.push(obj.model);
							if (obj.readonly) {
								readOnlyProps[obj.model] = true;
							}
							obj.model = 'settings.' + obj.model;
						}

						rows.forEach(function enrichRow(row) {
							row.gid = 'default';

							if (row.type === 'composite') {
								row.composite.forEach(function enrichCompositeElement(el) {
									processObjectWithModel(el);
								});
							} else {
								processObjectWithModel(row);
							}
						});

						return result;
					})();

					function updateByActivationState(obj, isActive) {
						platformRuntimeDataService.readonly(obj, _.map(_.filter(relevantPropNames, function (pn) {
							return !readOnlyProps[pn];
						}), function (pn) {
							return {
								field: 'settings.' + pn,
								readonly: !isActive
							};
						}));

						if (!isActive) {
							relevantPropNames.forEach(function (pn) {
								settings[pn] = generalSettings[pn];
							});
						}
					}

					const page = {
						name: $translate.instant(titleKey),
						settings: settings,
						form: {
							fid: 'model.viewer.hoops.config.' + settingsId,
							showGrouping: true,
							groups: [{
								gid: 'activation',
								header: '',
								isOpen: true,
								sortOrder: 100
							}, {
								gid: 'default',
								header$tr$: 'model.viewer.settingsHeader',
								isOpen: true,
								sortOrder: 200
							}],
							rows: _.concat({
								gid: 'activation',
								rid: '_activate',
								label$tr$: 'model.viewer.useSettings',
								type: 'boolean',
								model: 'settings.' + activationProp,
								change: function (obj, prop) {
									const isActive = Boolean(_.get(obj, prop));
									updateByActivationState(obj, isActive);
								}
							}, rows)
						}
					};

					(function initState() {
						const isActive = Boolean(settings[activationProp]);
						updateByActivationState(page, isActive);
					})();

					cleanUpRoutines.push(function () {
						if (!settings[activationProp]) {
							relevantPropNames.forEach(function (pn) {
								_.unset(settings, pn);
							});
						}
					});

					return page;
				}

				const dlgConfig = {
					dialogTitle: 'model.viewer.configTitle',
					itemDisplayMember: 'name',
					items: [generatePage('model.viewer.connectionSettings', 'connection', [{
						label$tr$: 'model.viewer.hoops.renderMode',
						type: 'select',
						options: {
							items: renderModeOptions,
							valueMember: 'value',
							displayMember: 'text',
							modelIsObject: false
						},
						model: 'renderMode',
						readonly: !mayUseServerSideRendering
					}, {
						label$tr$: 'model.viewer.hoops.streamingMode',
						type: 'select',
						options: {
							items: streamingModeOptions,
							valueMember: 'value',
							displayMember: 'text',
							modelIsObject: false
						},
						model: 'streamingMode'
					}, {
						label$tr$: 'model.viewer.preventTimeout',
						type: 'boolean',
						model: 'preventTimeout'
					}]), generatePage('model.viewer.cameraSettings', 'camera', [{
						label$tr$: 'model.viewer.projection',
						type: 'imageselect',
						options: {
							serviceName: 'modelAdministrationViewerSettingsProjectionIconService'
						},
						model: 'projection'
					}, {
						label$tr$: 'model.viewer.defaultView',
						type: 'imageselect',
						options: {
							serviceName: 'modelAdministrationViewerSettingsDefaultViewIconService'
						},
						model: 'defaultView'
					}, {
						label$tr$: 'model.viewer.transitions',
						type: 'boolean',
						model: 'transitions'
					}]), generatePage('model.viewer.renderingSettings', 'rendering', [{
						label$tr$: 'model.viewer.hoops.draw',
						type: 'select',
						options: {
							items: drawingModeOptions,
							valueMember: 'value',
							displayMember: 'text',
							modelIsObject: false
						},
						model: 'drawingMode'
					}, {
						label$tr$: 'model.viewer.aa',
						type: 'select',
						options: {
							items: antiAliasingOptions,
							valueMember: 'value',
							displayMember: 'text',
							modelIsObject: false
						},
						model: 'antiAliasing'
					}, {
						label$tr$: 'model.viewer.chunkedUpdates',
						type: 'boolean',
						model: 'chunkedUpdates'
					}, {
						label$tr$: 'model.viewer.bgColor',
						type: 'color',
						model: 'backgroundColor'
					}, {
						label$tr$: 'model.viewer.bgColor2',
						type: 'composite',
						composite: [{
							model: 'backgroundGradient',
							type: 'boolean',
							fill: false,
							tooltip: $translate.instant('model.viewer.gradientBG')
						}, {
							type: 'color',
							model: 'backgroundColor2',
							fill: false
						}]
					}, {
						label$tr$: 'model.viewer.selColor',
						type: 'color',
						model: 'selectionColor'
					}]), generatePage('model.viewer.inputSettings', 'input', [{
						label$tr$: 'model.viewer.areaSelectByDirection',
						type: 'boolean',
						model: 'areaSelectByDirection'
					}]), generatePage('model.administration.uomHeader', 'uom', [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}, {
						label$tr$: 'model.administration.uomLength',
						model: 'uomLengthFk'
					}), basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}, {
						label$tr$: 'model.administration.uomArea',
						model: 'uomAreaFk'
					}), basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true
					}, {
						label$tr$: 'model.administration.uomVolume',
						model: 'uomVolumeFk'
					})]), generatePage('model.viewer.infoSettings', 'info', [{
						label$tr$: 'model.viewer.showModelName',
						type: 'boolean',
						model: 'showModelName'
					}, {
						label$tr$: 'model.viewer.showSelectionInfo',
						type: 'boolean',
						model: 'showSelectionInfo'
					}, {
						label$tr$: 'model.viewer.showInputInfo',
						type: 'boolean',
						model: 'showInputInfo'
					}]), generatePage('model.viewer.toolbarSettings.title', 'toolbar', [{
						label$tr$: 'model.viewer.toolbarSettings.groupManipOps',
						type: 'boolean',
						model: 'groupManipOps'
					}, {
						label$tr$: 'model.viewer.toolbarSettings.groupCamOps',
						type: 'boolean',
						model: 'groupCamOps'
					}, {
						label$tr$: 'model.viewer.toolbarSettings.groupAnno',
						type: 'boolean',
						model: 'groupAnno'
					}]), {
						id: 'fallbackInfo',
						name: $translate.instant('model.viewer.fallbackInfo'),
						fbName: data.activeSettings.DescriptionInfo.Translated,
						form: {
							fid: 'model.viewer.hoops.config.fallbackInfo',
							showGrouping: false,
							groups: [{
								gid: 'default',
								isOpen: true,
								sortOrder: 100
							}],
							rows: [{
								gid: 'default',
								rid: 'fallbackName',
								label$tr$: 'model.viewer.activeFallback',
								type: 'description',
								model: 'fbName',
								readonly: true
							}]
						}
					}]
				};

				return platformMasterDetailDialogService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						cleanUpRoutines.forEach(function (f) {
							f();
						});

						return settings;
					} else {
						return false;
					}
				});
			});
		}

		return {
			showDialog: showDialogBox
		};
	}
})(angular);
