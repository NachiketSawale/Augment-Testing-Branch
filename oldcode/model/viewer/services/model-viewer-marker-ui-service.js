/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var modelViewer = 'model.viewer';
	var modelViewerModule = angular.module(modelViewer);

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerMarkerUiService
	 * @function
	 *
	 * @description Provides UI-related utilities for handling model markers.
	 */
	modelViewerModule.factory('modelViewerMarkerUiService', ['_', '$translate', 'modelViewerViewerRegistryService',
		function (_, $translate, modelViewerViewerRegistryService) {
			var service = {};

			service.createMarkerActions = function (config) {
				var actualConfig = _.assign({
					itemService: null,
					markerFkProperty: 'MarkerFk',
					modelFkProperty: 'ModelFk',
					isActionActive: function () {
						return true;
					}
				}, config || {});

				if (!_.isObject(actualConfig.item)) {
					throw new Error('No item to edit specified.');
				}
				if (!_.isFunction(actualConfig.getMarkerService)) {
					throw new Error('No getMarkerService function specified.');
				}
				if (!_.isFunction(actualConfig.pickPosition)) {
					throw new Error('No pickPosition function specified.');
				}

				var actionList = [];
				actionList.push({
					toolTip: $translate.instant('model.viewer.setMarker'),
					icon: 'control-icons ico-set-marker',
					callbackFn: actualConfig.pickPosition,
					readonly: !actualConfig.isActionActive(actualConfig.item[actualConfig.modelFkProperty])
				});
				if (actualConfig.item[actualConfig.markerFkProperty]) {
					actionList.push.apply(actionList, modelViewerViewerRegistryService.createViewerActionButtons({
						execute: function (viewerInfo) {
							actualConfig.getMarkerService().showInViewer(actualConfig.item[actualConfig.markerFkProperty], viewerInfo);
						},
						disabled: !actualConfig.isActionActive(actualConfig.item[actualConfig.modelFkProperty])
					}));
					actionList.push({
						toolTip: $translate.instant('model.viewer.deleteMarker'),
						icon: 'control-icons ico-input-delete',
						callbackFn: function () {
							var markerService = actualConfig.getMarkerService();
							var markerList = markerService.getList();
							var marker = _.find(markerList, {
								ModelFk: actualConfig.item[actualConfig.modelFkProperty],
								Id: actualConfig.item[actualConfig.markerFkProperty]
							});
							actualConfig.item[actualConfig.markerFkProperty] = null;
							if (_.isObject(actualConfig.itemService)) {
								actualConfig.itemService.setSelected(actualConfig.item);
								actualConfig.itemService.markItemAsModified(actualConfig.item);
							}
							markerService.deleteItem(marker);
						},
						readonly: !actualConfig.isActionActive(actualConfig.item[actualConfig.modelFkProperty])
					});
				}

				return actionList;
			};

			return service;
		}]);
})(angular);
