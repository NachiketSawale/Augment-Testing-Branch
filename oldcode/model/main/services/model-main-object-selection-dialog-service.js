/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelMainObjectSelectionDialogService
	 * @function
	 * @requires platformModalFormConfigService, basicsLookupdataConfigGenerator, modelViewerModelSelectionService
	 *
	 * @description Provides a dialog box for selecting a model object.
	 */
	angular.module('model.main').service('modelMainObjectSelectionDialogService', ['platformModalFormConfigService',
		'basicsLookupdataConfigGenerator', 'modelViewerModelSelectionService',
		function (platformModalFormConfigService, basicsLookupdataConfigGenerator, modelViewerModelSelectionService) {
			var service = {};

			/**
			 * @ngdoc method
			 * @name showDialog
			 * @constructor
			 * @methodOf modelMainObjectSelectionDialogService
			 * @description Displays the dialog box.
			 * @param {Object} dialogOptions An object that contains settings for the dialog box. The object is expected
			 *                               to have a `dialogTitle` and an optional `modelId` property.
			 * @returns {Number} The selected object ID, or `null` if the user canceled the dialog.
			 */
			service.showDialog = function (dialogOptions) {
				var data = {
					objectId: null
				};

				var selectionDialogConfig = {
					title: dialogOptions.dialogTitle,
					resizeable: false,
					dataItem: data,
					formConfiguration: {
						fid: 'model.viewer.main.objectSelection',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelMainObjectLookupDataService',
							enableCache: true,
							filter: function () {
								return dialogOptions.modelId || modelViewerModelSelectionService.getSelectedModelId();
							}
						}, {
							gid: 'default',
							rid: 'object',
							model: 'objectId'
						})]
					}
				};

				return platformModalFormConfigService.showDialog(selectionDialogConfig).then(function (result) {
					if (result.ok) {
						return data.objectId;
					} else {
						return null;
					}
				});
			};

			return service;
		}]);
})();