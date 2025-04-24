/**
 * Created by lnt on 1/16/2020.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name  estimateMainUploadBenchmarkDialogService

	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * estimateMainUploadBenchmarkDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('estimateMainUploadBenchmarkDialogService', [
		'$q', '$http', '$translate', '$injector', 'platformModalService', 'platformDataServiceFactory', 'estimateMainService', 'platformSidebarWizardCommonTasksService',
		'basicsLookupdataLookupDescriptorService',
		function ($q, $http, $translate, $injector, platformModalService, platformDataServiceFactory, estimateMainService, platformSidebarWizardCommonTasksService,
			lookupDescriptorService) {

			let externalConfigurationId;

			return {
				showDialog: showDialog,
				validateUserPermission: validateUserPermission,
				getExternalConfigId: getExternalConfigId,
				setExternalConfigId: setExternalConfigId,
				uploadFileToBenchmark: uploadFileToBenchmark
			};

			// show the dialog
			function showDialog(externalSources) {
				let selectedEstHeader = estimateMainService.getSelectedEstHeaderItem(),
					title = $translate.instant('estimate.main.uploadEstimateToBenchmark.title'),
					msg = $translate.instant('estimate.main.generateBudgetCXBMWizard.noSelectedEstHeader');

				if (platformSidebarWizardCommonTasksService.assertSelection(selectedEstHeader, title, msg)) {
					let defer = $q.defer();
					let defaultOptions = {
						currentItem: {
							EstimateId: selectedEstHeader.Id,
							ProjectFk: estimateMainService.getProjectId(),
							ExternalSources: externalSources
						},
						headerText: $translate.instant('estimate.main.uploadEstimateToBenchmark.title'),
						templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-upload-benchmark-dialog.html',
						backdrop: false,
						uuid: 'FE2FDD1ACEC745EBB1A497FB5ECE7C9D'   // grid id (uuid)
					};

					if (!lookupDescriptorService.getLookupItem('EstimateGenerate4LeadingSource', 1)) {
						$injector.get('estimateWizardGenerateSourceLookupService').setIsCXBM(true);
						$injector.get('estimateMainSidebarWizardService').refreshGenerateLineItemsByLS();
					}

					platformModalService.showDialog(defaultOptions).then(function (result) {
						defer.resolve(result);
					});

					return defer.promise;
				}
			}

			function validateUserPermission() {
				return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getextersource2costxbm').then(function (response) {
					return response.data;
				});
			}

			function uploadFileToBenchmark(data) {
				let groupList = $injector.get('estimateMainGroupSettingService').getList();
				let leadStructures = [];
				_.each(groupList, function (group) {
					let leadStructure = {
						Id: group.Id,
						EstStructureId: group.EstStructureId,
						RootItemId: group.RootItemId,
						StructureName: group.StructureName
					};
					leadStructures.push(leadStructure);
				});
				let postData = {
					EstimateId: data.EstimateId,
					ProjectFk: data.ProjectFk,
					ExternalConfigId: externalConfigurationId,
					SourceDescData: leadStructures
				};
				$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/uploadfiletobenchmark', postData).then(function (data) {
					if (data) {
						platformModalService.showMsgBox($translate.instant('estimate.main.uploadEstimateToBenchmark.EstUploadSuccess'), $translate.instant('estimate.main.uploadEstimateToBenchmark.title'), 'info');
					} else {
						platformModalService.showMsgBox($translate.instant('estimate.main.uploadEstimateToBenchmark.EstUploadFailed'), $translate.instant('estimate.main.uploadEstimateToBenchmark.title'), 'info');
					}
				});
			}

			function getExternalConfigId() {
				return externalConfigurationId;
			}

			function setExternalConfigId(value) {
				externalConfigurationId = value;
			}
		}
	]);
})(angular);


