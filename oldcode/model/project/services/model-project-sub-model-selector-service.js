/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectSubModelSelectorService
	 * @function
	 *
	 * @description Provides utilities for having users choose sub-models if a composite model is selected.
	 */
	angular.module('model.project').factory('modelProjectSubModelSelectorService', ['_', '$q',
		'modelViewerModelSelectionService', 'platformModalFormConfigService', '$translate',
		function (_, $q, modelViewerModelSelectionService, platformModalFormConfigService, $translate) {
			var service = {};

			/**
			 * @ngdoc method
			 * @name selectSubModelByDialog
			 * @constructor
			 * @methodOf modelProjectSubModelSelectorService
			 * @description Displays a dialog box for selecting a sub-model from a given model.
			 * @param {ParentModel} selModel The information object of the model whose sub-models can be selected.
			 * @param {Object} dialogOptions An object that contains settings for the dialog box. The object is expected
			 *                               to have an optional `dialogTitle` and an optional `modelFilter` function.
			 * @returns {Promise<Object>} A promise that will get resolved to an object with the `modelId` and the
			 *                            `subModelId` properties if the selection is confirmed by the user, otherwise
			 *                            the promise will be rejected.
			 */
			function selectSubModelByDialog(selModel, dialogOptions) {
				var data = {
					subModelId: null
				};

				var actualDialogOptions = _.assign({
					dialogTitle: $translate.instant('model.project.selectSubModel'),
					modelFilter: function () {
						return true;
					}
				}, dialogOptions || {});

				var selectionDialogConfig = {
					title: actualDialogOptions.dialogTitle,
					resizeable: false,
					dataItem: data,
					formConfiguration: {
						fid: 'model.project.subModelSelection',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'model',
							model: 'subModelId',
							type: 'select',
							options: {
								items: _.map(_.filter(selModel.subModels, actualDialogOptions.modelFilter), function (sm) {
									return {
										value: sm.subModelId,
										text: sm.info.getNiceName()
									};
								}),
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							}
						}]
					}
				};

				return platformModalFormConfigService.showDialog(selectionDialogConfig).then(function (result) {
					if (result) {
						if (result.data.subModelId) {
							var selSubModel = selModel.bySubModelId[result.data.subModelId];
							return {
								subModelId: selSubModel.subModelId,
								modelId: selSubModel.info.modelId
							};
						} else {
							return $q.reject();
						}
					} else {
						return $q.reject();
					}
				});
			}

			/**
			 * @ngdoc method
			 * @name selectSubModelByDialog
			 * @constructor
			 * @methodOf modelProjectSubModelSelectorService
			 * @description Selects a sub-model from the currently selected model and, if required, shows a dialog box
			 *              to the user.
			 * @param {Object} dialogOptions An object that contains settings for the dialog box. The object is expected
			 *                               to have an optional `dialogTitle` and an optional `modelFilter` function.
			 * @returns {Promise<Object>} A promise that will get resolved to an object with the `modelId` and the
			 *                            `subModelId` properties. If no sub-model can be selected, the promise will
			 *                            be rejected.
			 */
			service.selectSubModel = function (dialogOptions) {
				var selModel = modelViewerModelSelectionService.getSelectedModel();
				if (selModel) {
					if (selModel.info.isComposite) {
						return selectSubModelByDialog(selModel, dialogOptions);
					} else {
						return $q.when({
							subModelId: 1,
							modelId: selModel.info.modelId
						});
					}
				} else {
					return $q.reject();
				}
			};

			return service;
		}]);
})(angular);
