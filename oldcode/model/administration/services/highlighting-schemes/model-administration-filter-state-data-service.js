/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAdministrationModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationFilterStateDataService
	 * @function
	 *
	 * @description
	 * Manages the list of defined model object filter states on the client side.
	 */
	modelAdministrationModule.factory('modelAdministrationFilterStateDataService',
		modelAdministrationFilterStateDataService);

	modelAdministrationFilterStateDataService.$inject = ['$http', 'PlatformMessenger', '_', '$q'];

	function modelAdministrationFilterStateDataService($http, PlatformMessenger, _, $q) {
		const service = {};

		const state = {
			items: null,
			onListLoaded: new PlatformMessenger(),
			loadingPromise: null
		};

		service.registerListLoaded = function (handler) {
			state.onListLoaded.register(handler);
		};

		service.unregisterListLoaded = function (handler) {
			state.onListLoaded.unregister(handler);
		};

		service.getList = function () {
			return state.items ? _.cloneDeep(state.items) : null;
		};

		service.load = function () {
			if (state.items) {
				return $q.when(service.getList());
			} else {
				return service.reload();
			}
		};

		service.reload = function () {
			if (!state.loadingPromise) {
				state.loadingPromise = $http.get(globals.webApiBaseUrl + 'model/administration/filterstate/list').then(function (response) {
					state.items = response.data;
					state.onListLoaded.fire();
				}).then(function () {
					state.loadingPromise = null;
					return service.getList();
				});
			}
			return state.loadingPromise;
		};

		return service;
	}
})(angular);
