/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('model.administration').factory('modelAdministrationRuntimeHlSchemeService',
		modelAdministrationRuntimeHlSchemeService);

	modelAdministrationRuntimeHlSchemeService.$inject = ['_', '$q', '$http',
		'basicsCommonDrawingUtilitiesService'];

	function modelAdministrationRuntimeHlSchemeService(_, $q, $http,
		basicsCommonDrawingUtilitiesService) {

		const service = {};

		const state = {
			cachedSchemes: {},
			cleanUpCache: _.debounce(function () {
				const that = this;
				Object.keys(that.cachedSchemes).forEach(function (id) {
					id = parseInt(id);
					if (that.cachedSchemes[id].userCount <= 0) {
						delete that.cachedSchemes[id];
					}
				});
			}, 30000)
		};

		function loadScheme(id, controllerName) {
			const scheme = state.cachedSchemes[id];
			if (scheme) {
				scheme.userCount++;
				return $q.when(scheme.data);
			} else {
				return $http.get(globals.webApiBaseUrl + 'model/administration/' + controllerName + '/getrtscheme?id=' + id).then(function (response) {
					if (response.data) {
						const scheme = {
							userCount: 1,
							data: {
								bgColor: _.isNumber(response.data.BackgroundColor) ? basicsCommonDrawingUtilitiesService.intToRgbColor(response.data.BackgroundColor) : null,
								selColor: _.isNumber(response.data.SelectionColor) ? basicsCommonDrawingUtilitiesService.intToRgbColor(response.data.SelectionColor) : null,
								items: {}
							}
						};
						response.data.HighlightingItemEntities.forEach(function (item) {
							// noinspection UnnecessaryLocalVariableJS // readability
							const itemData = {
								color: _.isNumber(item.Color) ? basicsCommonDrawingUtilitiesService.intToRgbColor(item.Color) : null,
								useObjectColor: !!item.UseObjectColor,
								opacity: item.Opacity,
								transparency: _.isNumber(item.Opacity) ? item.Opacity : null,
								visibility: (function () {
									switch (item.ObjectVisibilityFk) {
										case 1:
											return 'v';
										case 2:
											return 'h';
										default:
											return 'm';
									}
								})(),
								selectable: !!item.Selectable
							};
							scheme.data.items[item.FilterStateEntity ? item.FilterStateEntity.Code : item.Id] = itemData;
						});

						state.cachedSchemes[id] = scheme;
						return scheme.data;
					} else {
						return $q.reject('No highlighting scheme data received.');
					}
				});
			}
		}

		service.loadStaticScheme = function (id) {
			return loadScheme(id, 'statichlscheme');
		};

		service.loadDynamicScheme = function (id) {
			return loadScheme(id, 'dynhlscheme');
		};

		service.unloadScheme = function (id) {
			const scheme = state.cachedSchemes[id];
			if (scheme) {
				scheme.userCount--;
				state.cleanUpCache();
			}
		};

		return service;
	}
})(angular);
