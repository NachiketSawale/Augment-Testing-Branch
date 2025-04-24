/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAnnotationModule = angular.module('model.annotation');

	modelAnnotationModule.factory('modelAnnotationBcfExportWizardService',
		modelAnnotationBcfExportWizardService);

	modelAnnotationBcfExportWizardService.$inject = ['_', 'platformTranslateService',
		'platformModalFormConfigService', '$translate', 'modelAnnotationDataService',
		'$http', 'platformDialogService', 'projectMainPinnableEntityService',
		'modelProjectPinnableEntityService', '$window', 'basicsLookupdataConfigGenerator'];

	function modelAnnotationBcfExportWizardService(_, platformTranslateService,
		platformModalFormConfigService, $translate, modelAnnotationDataService,
		$http, platformDialogService, projectMainPinnableEntityService,
		modelProjectPinnableEntityService, $window, basicsLookupdataConfigGenerator) {

		const service = {};

		function showDialog() {
			const hasLoadedItems = !_.isEmpty(modelAnnotationDataService.getList());
			const hasSelection = hasLoadedItems && !_.isEmpty(modelAnnotationDataService.getSelectedEntities());

			const exportSettings = {
				source: hasSelection ? 's' : (hasLoadedItems ? 'p' : 'a'),
				bcfFileName: 'Annotations_{date}{.bcf}',
				bcfVersion: 'V3_0'
			};

			const dlgConfig = {
				title: $translate.instant('model.annotation.bcf.exportTitle'),
				width: '70%',
				height: '30%',
				resizeable: true,
				dataItem: exportSettings,
				formConfiguration: {
					fid: 'model.annotation.bcfExport',
					showGrouping: false,
					groups: [{
						gid: 'scope'
					}, {
						gid: 'default'
					}],
					rows: [{
						gid: 'scope',
						rid: 'source',
						type: 'radio',
						model: 'source',
						options: {
							valueMember: 'value',
							labelMember: 'label',
							disabledMember: 'disabled',
							groupName: 'sourceOptions',
							items: [{
								value: 'a',
								label$tr$: 'model.annotation.bcf.sourceAll'
							}, {
								value: 'p',
								label$tr$: 'model.annotation.bcf.sourcePage',
								disabled: !hasLoadedItems
							}, {
								value: 's',
								label$tr$: 'model.annotation.bcf.sourceSelection',
								disabled: !hasSelection
							}]
						}
					}, {
						gid: 'default',
						rid: 'bcfFileName',
						label$tr$: 'model.annotation.bcf.bcfFileName',
						model: 'bcfFileName',
						type: 'description',
						maxLength: 252
					}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'modelAnnotationBcfVersionLookupDataService',
						enableCache: true
					}, {
						gid: 'default',
						rid: 'bcfVersion',
						label$tr$: 'model.annotation.bcf.bcfVersion',
						model: 'bcfVersion'
					})
					]
				}
			};

			platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
			return platformModalFormConfigService.showDialog(dlgConfig);
		}

		service.runExport = function () {
			return showDialog().then(function (result) {
				if (result.ok) {
					const requestData = {
						ProjectId: projectMainPinnableEntityService.getPinned(),
						ModelId: modelProjectPinnableEntityService.getPinned(),
						AnnotationIds: (function prepareAnnotationIds() {
							switch (result.data.source) {
								case 'p':
									return _.map(modelAnnotationDataService.getList(), item => item.Id);
								case 's':
									return _.map(modelAnnotationDataService.getSelectedEntities(), item => item.Id);
								default:
									return null;
							}
						})(),
						BCFFileName: result.data.bcfFileName,
						BCFVersion: result.data.bcfVersion
					};

					return $http.post(globals.webApiBaseUrl + 'model/annotation/bcf/exportfile', requestData).then(function (response) {
						const downloadUrl = `${$window.location.origin}${globals.baseUrl}downloads/${response.data}`;

						const win = $window.open(downloadUrl);
						if (win) {
							win.focus();
						}

						return platformDialogService.showMsgBox('model.annotation.bcf.popupHint', 'model.annotation.bcf.exportDone', 'info', 'model.annotation.bcf.dlpopuphint', {
							showOption: true,
							defaultActionButtonId: 'ok'
						});
					}, function (reason) {
						return platformDialogService.showDialog({
							headerText$tr$: 'cloud.common.errorDialogTitle',
							bodyText$tr$: 'model.annotation.bcf.failureMessage',
							bodyText$tr$param$: {
								message: _.get(reason, 'data.ErrorMessage') || reason
							},
							showOkButton: true,
							iconClass: 'error'
						});
					});
				}
			});
		};

		return service;
	}
})(angular);
