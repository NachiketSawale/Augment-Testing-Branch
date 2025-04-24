/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationViewerSettingsRuntimeService
	 * @description Provides methods to retrieve and select the runtime representation of viewer settings profiles.
	 */
	myModule.factory('modelAdministrationViewerSettingsRuntimeService',
		modelAdministrationViewerSettingsRuntimeService);

	modelAdministrationViewerSettingsRuntimeService.$inject = ['_', '$http',
		'platformUserInfoService'];

	function modelAdministrationViewerSettingsRuntimeService(_, $http,
		platformUserInfoService) {

		const service = {};

		function getStorageKey() {
			const userId = platformUserInfoService.getCurrentUserInfo().UserId;
			return globals.appBaseUrl + ':' + userId + '-3dViewerPrf';
		}

		service.getActiveProfileId = function () {
			const key = getStorageKey();
			const rawCfg = localStorage.getItem(key);
			const cfg = _.isNil(rawCfg) ? null : JSON.parse(rawCfg);
			const activeProfileId = parseInt(_.get(cfg, 'profileId'));
			return _.isInteger(activeProfileId) ? activeProfileId : undefined;
		};

		service.loadActiveSettings = function (localOverride) {
			const activeProfileId = service.getActiveProfileId();
			return $http.get(globals.webApiBaseUrl + 'model/administration/viewersettings/runtime', {
				params: {
					preferredSettingsId: _.isInteger(activeProfileId) ? activeProfileId : undefined
				}
			}).then(function (response) {
				const result = response.data;
				if (!_.isObject(result)) {
					throw new Error('Failed to fetch viewer settings from server.');
				}
				_.unset(result, 'Id');
				if (_.isObject(localOverride)) {
					_.assign(result, localOverride);
				}
				return result;
			});
		};

		service.markSettingsProfileAsActive = function (profileId) {
			const key = getStorageKey();
			const cfg = {
				profileId: _.isInteger(profileId) ? profileId : undefined
			};
			localStorage.setItem(key, JSON.stringify(cfg));
		};

		return service;
	}
})(angular);
