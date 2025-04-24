/*
 * $Id: basics-common-field-selector-dialog-service.js 634323 2021-04-27 22:05:46Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonFieldSelectorDialogService
	 * @function
	 *
	 * @description Provides a dialog box for selecting a field in a hierarchical structure.
	 */
	angular.module('basics.common').factory('basicsCommonFieldSelectorDialogService', ['_', 'platformModalService',
		'$q', 'platformTranslateService', '$translate',
		function (_, platformModalService, $q, platformTranslateService, $translate) {
			const service = {};

			const privateState = {
				nextDialogId: 1,
				mode: 'simple'
			};

			service.showDialog = function (config) {
				const actualConfig = _.assign({
					headerText: $translate.instant('basics.common.fieldSelector.title'),
					searchHint: $translate.instant('basics.common.fieldSelector.searchHint'),
					backdrop: 'static'
				}, _.isObject(config) ? config : {}, {
					width: '70%',
					height: '70%',
					resizeable: true,
					showOkButton: true,
					showCancelButton: true,
					bodyTemplateUrl: globals.appBaseUrl + '/basics.common/templates/field-selector/basics-common-field-selector-dialog-body.html',
					dataItem: {
						id: privateState.nextDialogId++,
						mode: {
							id: privateState.mode
						},
						isESV2: config.isESV2
					}
				});

				actualConfig.disableOkButton = function () {
					if (_.isFunction(actualConfig.dataItem.isSelectionValid)) {
						return !actualConfig.dataItem.isSelectionValid();
					} else {
						return true;
					}
				};

				if (_.isObject(actualConfig.schemaGraphProvider)) {
					actualConfig.dataItem.schemaGraphProvider = actualConfig.schemaGraphProvider;
				} else {
					throw new Error('No schema graph provider supplied.');
				}
				delete actualConfig.schemaGraphProvider;

				actualConfig.dataItem.uiTypeId = _.isString(actualConfig.uiTypeId) ? actualConfig.uiTypeId : null;
				delete actualConfig.uiTypeId;

				// id is in model evalution master container and in Bulk-dialog a string value. In search-enhaced an integer value
				actualConfig.dataItem.selectedId = actualConfig.value ? actualConfig.value : null;

				// TODO: migrate to platformModalService at some point
				platformTranslateService.translateObject(actualConfig, ['headerText', 'searchHint'], {
					recursive: false
				});

				const prepareSelectionPromise = (function prepareSelection() {
					if (_.isNil(actualConfig.value)) {
						return $q.resolve();
					}

					return actualConfig.dataItem.schemaGraphProvider.expandPath(actualConfig.value);
				})();

				return prepareSelectionPromise.then(function () {
					return platformModalService.showDialog(actualConfig).then(function (result) {
						_.assign(result, {
							value: actualConfig.dataItem.selectedId
						});
						privateState.mode = actualConfig.dataItem.mode.id;
						return result;
					}, function (reason) {
						return $q.reject(reason);
					});
				});
			};

			return service;
		}]);
})(angular);
