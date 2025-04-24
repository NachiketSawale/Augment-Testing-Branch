/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelProjectModelSelectionDialogService
	 * @function
	 *
	 * @description Provides a dialog box for selecting a model.
	 */
	angular.module('model.project').factory('modelProjectModelSelectionDialogService', [
		'basicsLookupdataConfigGenerator', 'platformModalFormConfigService', 'projectMainService',
		'basicsLookupdataLookupFilterService',
		function (basicsLookupdataConfigGenerator, platformModalFormConfigService, projectMainService,
		          basicsLookupdataLookupFilterService) {
			var service = {};

			var filterKey = 'model-project-model-selection-dialog-filter';

			/**
			 * @ngdoc method
			 * @name showDialog
			 * @constructor
			 * @methodOf modelProjectModelSelectionDialogService
			 * @description Displays the dialog box.
			 * @param {Object} dialogOptions An object that contains settings for the dialog box. The object is expected
			 *                               to have a `dialogTitle` and an optional `projectId` property, as well as an
			 *                               optional `modelFilter` function.
			 * @returns {Number} The selected model ID, or `null` if the user canceled the dialog.
			 */
			service.showDialog = function (dialogOptions) {
				var data = {
					modelId: dialogOptions.modelId
				};

				basicsLookupdataLookupFilterService.registerFilter({
					key: filterKey,
					fn: function (modelEntity) {
						return angular.isFunction(dialogOptions.modelFilter) ? dialogOptions.modelFilter(modelEntity) : function () {
							return true;
						};
					}
				});
				var formConfig;
				var lookupDataService = '';
				if (dialogOptions.showModelVersions) {
					lookupDataService = 'modelProjectModelTreeLookupDataService';
				} else {
					lookupDataService = 'modelProjectModelLookupDataService';
				}

				formConfig = {
					fid: 'model.project.modelSelection',
					showGrouping: false,
					groups: [{
						gid: 'default'
					}],
					rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: lookupDataService,
						filter: function () {
							return dialogOptions.projectId || projectMainService.getSelected().Id;
						},
						filterKey: filterKey
					}, {
						gid: 'default',
						rid: 'model',
						model: 'modelId'
					})]

				};

				var selectionDialogConfig = {
					title: dialogOptions.dialogTitle,
					resizeable: false,
					dataItem: data,
					formConfiguration: formConfig
				};

				return platformModalFormConfigService.showDialog(selectionDialogConfig).then(function (result) {
					basicsLookupdataLookupFilterService.unregisterFilter({
						key: filterKey
					});

					if (result.ok) {
						return data.modelId;
					} else {
						return null;
					}
				});


			};

			return service;
		}]);
})(angular);
