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
	 * @name modelAdministrationPropertyKeyBulkWizardService
	 * @function
	 *
	 * @description
	 * Contains the client-side part of a wizard for processing property keys in bulk operations.
	 */
	modelAdministrationModule.factory('modelAdministrationPropertyKeyBulkWizardService',
		modelAdministrationPropertyKeyBulkWizardService);

	modelAdministrationPropertyKeyBulkWizardService.$inject = ['_', '$q', '$translate',
		'platformModalFormConfigService', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
		'platformRuntimeDataService', 'projectMainPinnableEntityService', 'modelProjectPinnableEntityService',
		'$http', 'platformDialogService'];

	function modelAdministrationPropertyKeyBulkWizardService(_, $q, $translate,
		platformModalFormConfigService, platformTranslateService, basicsLookupdataConfigGenerator,
		platformRuntimeDataService, projectMainPinnableEntityService, modelProjectPinnableEntityService,
		$http, platformDialogService) {

		const service = {};

		function showDialog() {
			const bulkSettings = {
				Action: 't',
				ProjectId: projectMainPinnableEntityService.getPinned(),
				ModelId: modelProjectPinnableEntityService.getPinned()
			};

			function copySettingsForTransfer() {
				const resultData = _.cloneDeep(bulkSettings);
				platformRuntimeDataService.clear(resultData);
				delete resultData.AffectedPkCount;
				return resultData;
			}

			function updateModelRefState() {
				platformRuntimeDataService.readonly(bulkSettings, [{
					field: 'ModelId',
					readonly: !_.isInteger(bulkSettings.ProjectId)
				}, {
					field: 'ExclusiveToModel',
					readonly: !_.isInteger(bulkSettings.ProjectId) || !_.isInteger(bulkSettings.ModelId)
				}]);
			}

			updateModelRefState();

			function updateActionSettingsState() {
				platformRuntimeDataService.readonly(bulkSettings, [{
					field: 'ResultingPkTagIds',
					readonly: bulkSettings.Action !== 't' && bulkSettings.Action !== 'u'
				}]);
			}

			updateActionSettingsState();

			let lastUpdateCallInfo = null;
			const updatePkCount = _.debounce(function () {
				const callInfo = {};
				lastUpdateCallInfo = callInfo;

				bulkSettings.AffectedPkCount = null;

				const request = copySettingsForTransfer();
				delete request.Action;
				delete request.ResultingPkTagIds;
				delete request.AffectedPkCount;
				$http.post(globals.webApiBaseUrl + 'model/administration/propertykey/countbulkprocessed', request).then(function (response) {
					if (callInfo === lastUpdateCallInfo) {
						bulkSettings.AffectedPkCount = response.data;
					}
				});
			}, 2000);
			updatePkCount();

			const dlgConfig = {
				title: $translate.instant('model.administration.propertyKeys.bulkTitle'),
				dataItem: bulkSettings,
				formConfiguration: {
					fid: 'model.administration.propkey.bulk',
					showGrouping: true,
					groups: [{
						gid: 'filter',
						header$tr$: 'model.administration.propertyKeys.bulkFilter',
						isOpen: true
					}, {
						gid: 'actions',
						header$tr$: 'model.administration.propertyKeys.bulkActions',
						isOpen: true
					}],
					rows: [{
						gid: 'filter',
						rid: 'name',
						label$tr$: 'model.administration.propertyKeys.onlyWithName',
						type: 'description',
						maxLength: 255,
						model: 'Name',
						change: function () {
							updatePkCount();
						}
					}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.mdlvaluetype', 'Description', {
						gid: 'filter',
						rid: 'valuetype',
						model: 'ValueTypeId',
						label$tr$: 'model.administration.propertyKeys.onlyWithValueType',
						type: 'lookup',
						change: function () {
							updatePkCount();
						}
					}, false, {
						showClearButton: true
					}), {
						gid: 'filter',
						rid: 'reqPkTags',
						label$tr$: 'model.administration.propertyKeys.onlyTagged',
						type: 'directive',
						directive: 'model-administration-property-key-tag-selector',
						options: {
							model: 'RequiredPkTagIds',
							change: function () {
								updatePkCount();
							}
						}
					}, {
						gid: 'filter',
						rid: 'projectId',
						label$tr$: 'model.administration.propertyKeys.onlyFromProject',
						model: 'ProjectId',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-project-project-dialog',
							descriptionMember: 'ProjectName',
							lookupOptions: {
								showClearButton: true
							}
						},
						change: function () {
							if (!_.isInteger(bulkSettings.ProjectId)) {
								bulkSettings.ModelId = undefined;
							}
							updateModelRefState();
							updatePkCount();
						}
					}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'modelProjectModelTreeLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.ProjectId;
						},
						showClearButton: true
					}, {
						gid: 'filter',
						rid: 'modelId',
						label$tr$: 'model.administration.propertyKeys.onlyFromModel',
						model: 'ModelId',
						change: function () {
							updateModelRefState();
							updatePkCount();
						}
					}), {
						gid: 'filter',
						rid: 'exclusiveToModel',
						type: 'boolean',
						model: 'ExclusiveToModel',
						label$tr$: 'model.administration.propertyKeys.exclusiveToModel',
						change: function () {
							updatePkCount();
						}
					}, {
						gid: 'filter',
						rid: 'user',
						model: 'UserId',
						label$tr$: 'model.administration.propertyKeys.user',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'usermanagement-user-user-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						},
						change: function () {
							updatePkCount();
						}
					}, {
						gid: 'actions',
						rid: 'action',
						model: 'Action',
						type: 'radio',
						label$tr$: 'model.administration.propertyKeys.targetOp',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							items: [{
								value: 'd',
								label$tr$: 'model.administration.propertyKeys.actionDelete'
							}, {
								value: 't',
								label$tr$: 'model.administration.propertyKeys.actionTag',
							}, {
								value: 'u',
								label$tr$: 'model.administration.propertyKeys.actionUntag',
							}]
						},
						change: function () {
							updateActionSettingsState();
						}
					}, {
						gid: 'actions',
						rid: 'resultingPkTags',
						label$tr$: 'model.administration.propertyKeys.tags',
						type: 'directive',
						directive: 'model-administration-property-key-tag-selector',
						options: {
							model: 'ResultingPkTagIds'
						}
					}, {
						gid: 'actions',
						rid: 'affectedPkCount',
						label$tr$: 'model.administration.propertyKeys.affectedPkCount',
						type: 'integer',
						model: 'AffectedPkCount',
						readonly: true
					}]
				},
				dialogOptions: {
					disableOkButton: function disableOkButton() {
						return ((bulkSettings.Action === 't' || bulkSettings.Action === 'u') && _.isEmpty(bulkSettings.ResultingPkTagIds)) ||
							(!_.isInteger(bulkSettings.AffectedPkCount) || bulkSettings.AffectedPkCount <= 0);
					}
				}
			};

			platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
			return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
				if (result.ok) {
					let confirmationPromise;
					if (bulkSettings.Action === 'd') {
						confirmationPromise = platformDialogService.showYesNoDialog('model.administration.propertyKeys.deletePropKeys', 'model.administration.propertyKeys.confirmTitle', 'no').then(function (result) {
							if (result.yes) {
								return true;
							} else {
								return $q.reject('User did not confirm deletion.');
							}
						});
					} else {
						confirmationPromise = $q.when(true);
					}

					return confirmationPromise.then(function () {
						return copySettingsForTransfer();
					});
				} else {
					return $q.reject('Cancelled by user.');
				}
			});
		}

		service.run = function () {
			return showDialog().then(function (result) {
				return $http.post(globals.webApiBaseUrl + 'model/administration/propertykey/bulkprocess', result).then(function (response) {
					if (response.data.Success) {
						return platformDialogService.showMsgBox('model.administration.propertyKeys.bulkOpStartedDesc', 'model.administration.propertyKeys.bulkOpStarted', 'info');
					} else {
						return platformDialogService.showDialog({
							headerText$tr$: 'model.administration.propertyKeys.bulkOpError',
							bodyText$tr$: 'model.administration.propertyKeys.bulkOpNotStarted',
							bodyText$tr$param$: {
								reason: response.data.Message
							},
							showOkButton: true,
							iconClass: 'error'
						});
					}
				});
			});
		};

		return service;
	}
})(angular);
