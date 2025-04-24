/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

((angular) => {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformGridDialogService
	 * @function
	 * @requires _, platformDialogService
	 *
	 * @description Displays a dialog box with a single grid inside.
	 */
	angular.module('platform').factory('platformGridDialogService', ['_', 'platformDialogService',
		(_, platformDialogService) => {
			let service = {};

			service.showDialog = externalConfig => {
				let config = _.cloneDeep(externalConfig);
				let actualConfig = _.assign({
					isReadOnly: false,
					idProperty: 'id',
					showColumnFilter: false,
					showGridFilter: false,
					allowMultiSelect: true
				}, _.isObject(config) ? config : {});
				if (!_.isArray(actualConfig.columns)) {
					actualConfig.columns = [];
				}
				if (!_.isArray(actualConfig.items)) {
					actualConfig.items = [];
				}

				let dlgOptions = _.assign({
					width: '70%',
					showOkButton: true,
					showCancelButton: !actualConfig.isReadOnly,
					resizeable: true,
					backdrop: 'static'
				}, actualConfig, {
					bodyTemplateUrl: globals.appBaseUrl + 'app/components/griddialog/partials/grid-dialog-body.html',
					windowClass: 'grid-dialog'
				});
				dlgOptions.dataItem = {
					cfg: dlgOptions // ToDo: This is no longer necessary with the new dialog service. The options can be accessed with $scope.dialog.modalOptions
				};
				dlgOptions.value = {
					selectedIds: []
				};

				if (dlgOptions.topText) {
					dlgOptions.topDescription = dlgOptions.topText;
				}
				if (dlgOptions.bottomText) {
					dlgOptions.topDescription = dlgOptions.bottomText;
				}

				return platformDialogService.showDialog(dlgOptions).then(result => {
					let selectedIds = result.value.selectedIds;

					return {
						success: true,
						ok: true,
						value: actualConfig.items,
						selectedIds: _.isArray(selectedIds) ? selectedIds : []
					};
				}, () => {
					return {
						success: false,
						ok: false,
						value: actualConfig.items,
						selectedIds: []
					};
				});
			};

			return service;
		}]);
})(angular);
