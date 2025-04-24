/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name  estimateMainGenerateBudgetCXBMDialogService

	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * estimateMainGenerateBudgetCXBMDialogService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('estimateMainGenerateBudgetCXBMDialogService', [
		'$q', '$http', '$translate', '$injector', 'platformModalService', 'platformDataServiceFactory', 'estimateMainService',
		'platformSidebarWizardCommonTasksService', 'basicsLookupdataLookupDescriptorService',
		function ($q, $http, $translate, $injector,  platformModalService, platformDataServiceFactory, estimateMainService,
			platformSidebarWizardCommonTasksService, lookupDescriptorService) {

			let externalConfigurationId;

			return {
				showDialog: showDialog,
				generateLiFromLS: generateLiFromLS,
				validateUserPermission: validateUserPermission,
				getExternalConfigId: getExternalConfigId,
				setExternalConfigId: setExternalConfigId
			};

			// show the dialog
			function showDialog(externalSources) {
				let selectedEstHeader = estimateMainService.getSelectedEstHeaderItem(),
					title = $translate.instant('estimate.main.generateBudgetCXBMWizard.title'),
					msg = $translate.instant('estimate.main.generateBudgetCXBMWizard.noSelectedEstHeader');

				if (platformSidebarWizardCommonTasksService.assertSelection(selectedEstHeader, title, msg)) {
					let defer = $q.defer();
					let defaultOptions = {
						currentItem: {
							GenerateBudgetScope: 1,
							ExternalSources: externalSources,
							GenerateBudgetScopeOption: 0
						},
						headerText: $translate.instant('estimate.main.generateBudgetCXBMWizard.title'),
						templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/estimate-main-generate-budget-cxbm-dialog.html',
						resizeable: true,
						backdrop: false,
						uuid: 'E4577534E5D74D5A9B105C144F931291'   // grid id (uuid)
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

			function generateLiFromLS(data) {

				let postData = {
					'StructureId': data.StructureId,
					'StructureName': data.StructureName,
					'RootItemId': data.RootItemId,
					// Create only new line items
					'CreateOnlyNewLineItem': true,
					// Create new line items (from new BoQ items) and update the existing items
					'UpdateExistedItem': true,

					'EstHeaderFk': estimateMainService.getSelectedEstHeaderId(),
					'ProjectFk': estimateMainService.getSelectedProjectId(),
					'EstStructureId': data.EstStructureId,
					'CopyCostGroup': false,
					'CopyPrjCostGroup': false,
					'CopyWic': false,
					'CopyControllingUnit': false,
					'CopyLocation': false,
					'CopyProcStructure': false,
					'CXBMEstimateID': data.EstimateId,
					'IsCreateFromAssembly': data.GenerateBudgetScope === 0,
					'BoqWicGroupId': data.BoqWicCatFk,
					'ExternalConfigId': externalConfigurationId,
					'IsCreateWithCost': data.GenerateBudgetScopeOption === 1,
					'MdcCostCodeFk': data.MdcCostCodeFk,
					'IsGenerateBudgetFromBenchMark':true,
					'IsDayWork': true
				};

				estimateMainService.setAoTQuantityRelationForWizard(postData);
				if (postData.ProjectFk > 0 && postData.EstHeaderFk > 0) {
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/generatefromleadingstructure', postData)
						.then(function (response) {
							// refresh line item container
							if (response.data && response.data.result) {
								let estimateProjectService = $injector.get('estimateProjectService');
								let projectCompositeItems = estimateProjectService.getList();
								if (projectCompositeItems && projectCompositeItems.length > 0) {
									let a = null;
									_.forEach(projectCompositeItems, function (item) {
										if (item.EstHeader.Id === estimateMainService.getSelectedEstHeaderId()) {
											a = item;
										}
									});

									if (a) {
										estimateMainService.setEstimateHeader(a, 'EstHeader.Code');
									}
								} else {
									estimateMainService.load();
								}
							}else if(response.data && response.data.isConcurrencyErr){
								$injector.get('estimateMainCommonService').showConcurrencyBox(response.data);
							}else {
								let title = $translate.instant('estimate.main.generateBudgetCXBMWizard.title'),
									msg = $translate.instant('estimate.main.generateBudgetCXBMWizard.selectMapModel');
								platformModalService.showMsgBox(msg, title, 'warning');
							}
						});
				}
			}

			function validateUserPermission(){
				return $http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getextersource2costxbm').then(function(response){
					return response.data;
				});
			}

			function getExternalConfigId(){
				return externalConfigurationId;
			}

			function setExternalConfigId(value) {
				externalConfigurationId = value;
			}
		}
	]);
})(angular);


