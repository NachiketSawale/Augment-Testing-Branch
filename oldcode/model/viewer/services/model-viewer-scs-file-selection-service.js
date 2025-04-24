/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerScsFileSelectionService
	 * @function
	 *
	 * @description Manages the selection state of SCS model files.
	 */
	angular.module('model.viewer').factory('modelViewerScsFileSelectionService', ['$rootScope', 'PlatformMessenger',
		'$window', 'modelProjectSelectedModelInfoService',
		function ($rootScope, PlatformMessenger, $window, modelProjectSelectedModelInfoService) {
			var service = {};

			var state = {
				selectionChanged: new PlatformMessenger(),
				selected: null
			};

			service.registerSelectionChanged = function (handler) {
				state.selectionChanged.register(handler);
			};

			service.unregisterSelectionChanged = function (handler) {
				state.selectionChanged.unregister(handler);
			};

			$rootScope.$on('selectedScsFileChanged', function (e, info) {
				if (info) {
					if (info.url) {
						state.selected = {
							uuid: '',
							uri: info.url,
							description: info.description || ''
						};
					} else {
						state.selected = {
							uuid: info.uuid,
							uri: $window.location.origin + globals.webApiBaseUrl + 'model/main/scs/getscsfile?docID=' + info.uuid,
							description: info.description || ''
						};
					}
				} else {
					state.selected = null;
				}

				state.selectionChanged.fire();
			});

			service.isModelSelected = function () {
				return !!state.selected;
			};

			service.getSelectedModel = function () {
				if (state.selected) {
					var result = modelProjectSelectedModelInfoService.createVirtualModelInfo();
					result.info.modelUuid = state.selected.uuid;
					result.info.modelUri = state.selected.uri;
					result.info.modelDesc = state.selected.description;
					return result;
				} else {
					return null;
				}
			};

			return service;
		}]);
})(angular);
