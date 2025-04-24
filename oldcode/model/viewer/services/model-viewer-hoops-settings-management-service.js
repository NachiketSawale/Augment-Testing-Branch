/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';
	const myModule = angular.module('model.viewer');

	/**
	 * @ngdoc service
	 * @name modelViewerHoopsSettingsManagementService
	 * @description Provides a management class for HOOPS viewer settings.
	 */
	myModule.factory('modelViewerHoopsSettingsManagementService', modelViewerHoopsSettingsManagementService);

	modelViewerHoopsSettingsManagementService.$inject = ['_', 'PlatformMessenger',
		'modelAdministrationViewerSettingsRuntimeService', 'mainViewService',
		'modelViewerHoopsConfigurationService'];

	function modelViewerHoopsSettingsManagementService(_, PlatformMessenger,
		modelAdministrationViewerSettingsRuntimeService, mainViewService,
		modelViewerHoopsConfigurationService) {

		const service = {};

		const settingsKey = 'bimViewerSettings';

		function SettingsManager(viewUuid) {
			this.viewUuid = viewUuid;
			this._uomSettingsMessenger = new PlatformMessenger();
		}

		SettingsManager.prototype._fireUomSettingsChanged = function (settings) {
			this._uomSettingsMessenger.fire({
				uomLengthFk: settings.uomLengthFk,
				uomAreaFk: settings.uomAreaFk,
				uomVolumeFk: settings.uomVolumeFk
			});
		};

		SettingsManager.prototype.load = function () {
			const that = this;
			const containerSettings = _.assign({}, mainViewService.customData(this.viewUuid, settingsKey));
			return modelAdministrationViewerSettingsRuntimeService.loadActiveSettings(containerSettings).then(function (result) {
				that._fireUomSettingsChanged(result);
				return result;
			});
		};

		SettingsManager.prototype.configure = function () {
			const that = this;
			const containerSettings = _.assign({}, mainViewService.customData(that.viewUuid, settingsKey));
			return modelViewerHoopsConfigurationService.showDialog({
				settings: containerSettings
			}).then(function (result) {
				if (_.isObject(result)) {
					mainViewService.customData(that.viewUuid, settingsKey, result);

					return modelAdministrationViewerSettingsRuntimeService.loadActiveSettings(result).then(function (result) {
						that._fireUomSettingsChanged(result);
						return result;
					});
				}
			});
		};

		SettingsManager.prototype.registerUomSettingsChanged = function (handler) {
			this._uomSettingsMessenger.register(handler);
		};

		SettingsManager.prototype.unregisterUomSettingsChanged = function (handler) {
			this._uomSettingsMessenger.unregister(handler);
		};

		service.createManager = function (viewUuid) {
			return new SettingsManager(viewUuid);
		};

		return service;
	}
})(angular);
