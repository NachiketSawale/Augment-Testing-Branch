/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHlSchemeMenuService
	 * @function
	 *
	 * @description Provides code to assemble the selection menu for static highlighting schemes.
	 */
	angular.module('model.viewer').factory('modelViewerHlSchemeMenuService', ['_', '$translate',
		'modelAdministrationStaticHlSchemeDataService', 'basicsCommonConfigLocationListService', 'PlatformMessenger',
		function (_, $translate, modelAdministrationStaticHlSchemeDataService, basicsCommonConfigLocationListService,
		          PlatformMessenger) {
			var service = {};

			service.createMenu = function (initialSelection, config) {
				var actualConfig = _.assign({
					menuUpdated: function () {
					}
				}, _.isObject(config) ? config : {});

				var headers = {};
				basicsCommonConfigLocationListService.createItems(true).forEach(function (sl) {
					headers[sl.id] = $translate.instant('model.viewer.hlSchemesBase', {
						scopeLevel: sl.title
					});
				});

				var privateState = {
					filterEngine: null,
					onHlSchemeChanged: new PlatformMessenger(),
					hlSchemeSelectionFunctionsById: {},
					itemsLoaded: false
				};
				privateState.menuMgr = basicsCommonConfigLocationListService.createMenuItems([], {
					asRadio: true,
					headers: headers,
					clickFunc: function (itemId, item) {
						privateState.hlSchemeSelectionFunctionsById[item.hlSchemeId]();
					}
				});
				privateState.menuMgr.registerSelectionChanged(function hlSchemeMenuSelectionChanged() {
					if (privateState.filterEngine && privateState.itemsLoaded) {
						var fn = privateState.hlSchemeSelectionFunctionsById[privateState.menuMgr.getSelection()];
						if (_.isFunction(fn)) {
							fn();
						}
					}
				});

				var result = {
					setFilterEngine: function (filterEngine) {
						if (privateState.filterEngine !== filterEngine) {
							privateState.filterEngine = filterEngine;
							if (filterEngine && privateState.itemsLoaded) {
								var fn = privateState.hlSchemeSelectionFunctionsById[privateState.menuMgr.getSelection()];
								if (_.isFunction(fn)) {
									fn();
								}
							}
						}
					},
					getFilterEngine: function () {
						return privateState.filterEngine;
					},
					menuItem: privateState.menuMgr.menuItem,
					registerHlSchemeChanged: function (handler) {
						privateState.onHlSchemeChanged.register(handler);
					},
					unregisterHlSchemeChanged: function (handler) {
						privateState.onHlSchemeChanged.unregister(handler);
					}
				};

				modelAdministrationStaticHlSchemeDataService.retrieveAllItems().then(function (items) {
					var someItemId = null;
					privateState.menuMgr.updateItems(_.map(items, function (item) {
						if (_.isNil(someItemId)) {
							someItemId = item.Id;
						}
						privateState.hlSchemeSelectionFunctionsById[item.Id] = function () {
							if (privateState.filterEngine) {
								privateState.filterEngine.setDefaultStaticHighlightingScheme(item.Id);
							}
							privateState.onHlSchemeChanged.fire({
								hlSchemeId: item.Id
							});
						};
						return {
							id: item.Id,
							caption: _.isEmpty(_.get(item, 'DescriptionInfo.Translated')) ? $translate.instant('model.viewer.unnamedHlScheme', {
								id: item.Id
							}) : item.DescriptionInfo.Translated,
							hlSchemeId: item.Id,
							scopeLevel: item.ScopeLevel
						};
					}));
					privateState.itemsLoaded = true;
					privateState.menuMgr.setSelection(_.isObject(initialSelection) ? initialSelection.hlSchemeId : someItemId);
					actualConfig.menuUpdated();
				});

				return result;
			};

			return service;
		}]);
})(angular);
