/**
 * Created by gvj on 9/3/2018.
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineAiWizardService
	 * @function
	 *
	 * @description
	 * This service provides Ai wizard,it compromise of
	 * 1) mapping function which can mapping the line items to BoQs based on their description.
	 *
	 */
	angular.module(moduleName).factory('estimateMainAiWizardService',
		['_', '$http', '$translate', 'platformModalService', 'estimateMainService', 'estimateMainLiSelStatementListValidationService', 'basicsCommonAIService',
			'platformTranslateService', 'platformModalFormConfigService', 'platformSidebarWizardConfigService',
			function (_, $http, $translate, platformModalService, estimateMainService, estimateMainLiSelStatementListValidationService, basicsCommonAIService,
				platformTranslateService, platformModalFormConfigService, platformSidebarWizardConfigService) {
				// initial service
				let service = {};
				// line-item-boq-ai-mapping service
				service.lineItemsBoQAiMapping = function () {
					basicsCommonAIService.checkPermission('af7aee3e27bd4242ad7d2f03ae9b1921', true).then(function (canProceed) {
						if (!canProceed) {
							return;
						}
						doLineItemBoqAiMapping();
					});
				};

				service.lineItemsActivityAiMapping = function () {
					basicsCommonAIService.checkPermission('17fcdd3770ab4ab594e05be50ab5db22', true).then(function (canProceed) {
						if (!canProceed) {
							return;
						}
						doLineItemActivityAiMapping();
					});
				};

				service.lineItemsCostGroupAiMapping = function () {
					basicsCommonAIService.checkPermission('f7faf05bcfae44499118cea5aa112c9e', true).then(function (canProceed) {
						if (!canProceed) {
							return;
						}
						doLineItemCostGroupAiMapping();
					});
				};

				function doLineItemBoqAiMapping() {
					let params = {
						gridId: 'CA4AC6DC41A54D6C97194BE60679FCEE',
						mappingData: null
					};
					let _param = estimateMainService.getList();

					if (_param.length === 0) {
						platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.lineItemsBoqAiMappingWarning'), '', 'ico-info');
						return;
					}
					let boqLineTypes = estimateMainLiSelStatementListValidationService.getValidBoqLineTypes();
					let be_data = {};
					be_data.ProjectFk = _param[0].ProjectFk;
					be_data.EstHeaderFk = _param[0].EstHeaderFk;
					be_data.BoqLineTypeFks = boqLineTypes;

					function lineBoqMap() {
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/mtwoai/lineitem2boqmapping', be_data)
							.then(function (response) {

								if (!response.data.HasBoqItem) {
									platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.lineItemsBoqAiMappingWarning_no_Boq'), '', 'warning');
									return;
								}

								if (!response.data.Main || response.data.Main.length === 0) {
									platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.lineItemsBoqAiMappingWarning_no_Main'), '', 'warning');
									return;
								}

								params.mappingData = response.data;
								let modalOptions = {
									templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/ai/line-items-boq-ai-mapping.html',
									backdrop: false,
									windowClass: 'form-modal-dialog',
									lazyInit: true,
									resizeable: true,
									width: '70%',
									height: '70%',
									params: params
								};
								estimateMainService.updateAndExecute(function () {
									platformModalService.showDialog(modalOptions);
								});

							}, function (/* error */) {

							});
					}

					lineBoqMap();
				}

				function doLineItemActivityAiMapping() {
					let params = {
						gridId: '5F75BAA8D1CC48BA956BF0D9D3E1A68B',
						mappingData: null
					};
					let _param = estimateMainService.getList();

					if (_param.length === 0) {
						platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.noLineItemsAiMappingWarning'), '', 'ico-info');
						return;
					}

					let be_data = {};
					be_data.ProjectFk = _param[0].ProjectFk;
					be_data.EstHeaderFk = _param[0].EstHeaderFk;

					let title = 'estimate.main.aiWizard.selectModelFeature';
					let selectFeatureConfig = {
						title: $translate.instant(title),
						dataItem: {
							IsSchedule: true
						},
						formConfiguration: {
							fid: 'estimate.main.aiWizard.selectModelFeature',
							version: '0.1.1',
							showGrouping: false,
							groups: [
								{
									gid: 'baseGroup',
									attributes: ['location', 'boq']
								}
							],
							'overloads': {},
							rows: [
								{
									gid: 'baseGroup',
									rid: 'Location',
									label$tr$: 'estimate.main.aiWizard.location',
									type: 'boolean',
									model: 'hasLocation',
									sortOrder: 1
								},
								{
									gid: 'baseGroup',
									rid: 'Boq',
									label$tr$: 'estimate.main.aiWizard.boq',
									type: 'boolean',
									model: 'hasBoq',
									sortOrder: 2
								}
							]
						},
						handleOK: function handleOK(result) {
							if (result && result.ok && result.data) {
								let selectFeatureItem = {
									'HasLocation': result.data.hasLocation,
									'HasBoq': result.data.hasBoq
								};
								lineActivityMap(selectFeatureItem);
							}
						}
					};

					function lineActivityMap(selectFeatureItem) {
						be_data.ModelFeature = selectFeatureItem;
						$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/mtwoai/lineitem2activitymapping', be_data)
							.then(function (response) {

								if (!response.data.HasSchedulingActivity) {
									platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.lineItemsActivityAiMappingWarning_no_Activity'), '', 'warning');
									return;
								}

								if (!response.data.Main || response.data.Main.length === 0) {
									platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.lineItemsActivityAiMappingWarning_no_Main'), '', 'warning');
									return;
								}

								params.mappingData = response.data;
								let modalOptions = {
									templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/ai/line-items-activity-ai-mapping.html',
									backdrop: false,
									windowClass: 'form-modal-dialog',
									lazyInit: true,
									resizeable: true,
									width: '70%',
									height: '70%',
									params: params
								};
								estimateMainService.updateAndExecute(function () {
									platformModalService.showDialog(modalOptions);
								});

							}, function (/* error */) {

							});
					}

					// lineActivityMap();
					platformTranslateService.translateFormConfig(selectFeatureConfig.formConfiguration);
					selectFeatureConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
					platformModalFormConfigService.showDialog(selectFeatureConfig);
				}

				function doLineItemCostGroupAiMapping() {

					let projectId = estimateMainService.getSelectedProjectId();
					if (!projectId) {
						platformModalService.showMsgBox($translate.instant('estimate.main.createMaterialPackageWizard.noProjectItemSelected'), '', 'ico-info');
						return;
					}

					let lineItems = estimateMainService.getList();
					if (lineItems.length === 0) {
						platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.noLineItemsAiMappingWarning'), '', 'ico-info');
						return;
					}

					let IsAllLineItemDescriptionEmpty= true;
					_.forEach(lineItems, function (lineItem) {
						if (lineItem.DescriptionInfo !== null && lineItem.DescriptionInfo.Description !== null && lineItem.DescriptionInfo.Description !== '') {
							IsAllLineItemDescriptionEmpty = false;
						}
					});

					if (IsAllLineItemDescriptionEmpty) {
						platformModalService.showMsgBox($translate.instant('estimate.main.aiWizard.lineItemDescriptionAllEmpty'), '', 'ico-info');
						return;
					}

					function lineCostGroupMap() {
						let modalOptions = {
							templateUrl: globals.appBaseUrl + 'estimate.main/templates/wizard/ai/line-items-cost-group-select-level.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							lazyInit: true,
							resizeable: true
						};
						estimateMainService.updateAndExecute(function () {
							platformModalService.showDialog(modalOptions);
						});
					}

					lineCostGroupMap();
				}

				return service;
			}
		]);
})(angular);
