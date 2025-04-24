(function () {
	/* global globals, _ */
	'use strict';

	var boqMainModule = 'boq.main';
	/**
	 * @ngdoc service
	 * @name boqMainWizardService
	 * @description provides wizard configuarion
	 */
	/* jshint -W106 */ // Variable name is according usage in translation json
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(boqMainModule).factory('boqMainWizardService', ['$http', '$injector',
		'$translate',
		'boqMainService',
		'boqMainCrbSiaService',
		'platformModalService',
		'platformDialogService',
		'boqMainGaebImportService',
		'boqMainSelectGroupsService',
		'boqMainGaebExportService',
		'boqMainRenumberService',
		'boqMainElementValidationService',
		'boqMainSplitUrbService',
		'boqMainExportOptionsService',
		'boqMainImportOptionsService',
		'basicsExportService',
		'basicsImportService',
		'projectMainService',
		'platformWysiwygEditorSettingsService',
		'$q',
		function ($http,
			$injector,
			$translate,
			boqMainService,
			boqMainCrbSiaService,
			platformModalService,
			platformDialogService,
			boqMainGaebImportService,
			boqMainSelectGroupsService,
			boqMainGaebExportService,
			boqMainRenumberService,
			boqMainValidationService,
			boqMainSplitUrbService,
			boqMainExportOptionsService,
			boqMainImportOptionsService,
			basicsExportService,
			basicsImportService,
			projectMainService,
			platformWysiwygEditorSettingsService,
			$q) {

			// helper
			function assertBoqIsNotReadOnly(boqMainServiceName) {
				var message = $translate.instant('boq.main.boqInReadonlyStatus');
				return assertIsNotReadOnly(boqMainServiceName, message);
			}

			function assertIsNotReadOnly(boqMainServiceName, message) {
				return checkIsReadOnly(boqMainServiceName).then(response => {
					if (response) {
						showReadOnlyMsg(message);
						return false;
					}
					return true;
				});
			}

			function checkIsReadOnly(boqMainServiceName) {
				var rootBoqItem;

				if (boqMainServiceName === undefined || _.isEmpty(boqMainServiceName)) {
					rootBoqItem = boqMainService.getRootBoqItem();
				} else {
					rootBoqItem = boqMainServiceName.getRootBoqItem();
				}
				if (!rootBoqItem) {
					return $q.when(false);
				}
				return $http.get(globals.webApiBaseUrl + 'boq/main/header/isreadonly?boqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function (result) {
					return result.data;
				});
			}

			function showReadOnlyMsg(message) {
				var modalOptions = {
					headerText: $translate.instant('boq.main.information'),
					bodyText: message,
					iconClass: 'ico-info'
				};
				$injector.get('platformModalService').showDialog(modalOptions);
			}

			function gaebImport(wizardParameter) {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						}

						var options = {};
						options.boqMainService = boqMainService;
						options.wizardParameter = wizardParameter;
						boqMainGaebImportService.showImportDialog(options);
					}
				});
			}

			function gaebExport(wizardParameter) {
				if (boqMainService.isCrbBoq()) {
					platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
					return;
				}

				var options = {};
				options.boqMainService = boqMainService;
				options.wizardParameter = wizardParameter;
				boqMainGaebExportService.showDialog(options);
			}

			function excelExport(wizardParameter) {
				var options = boqMainExportOptionsService.getExportOptions(boqMainService);
				options.MainContainer.Id = '1';
				options.wizardParameter = wizardParameter;
				basicsExportService.showExportDialog(options);
			}

			function excelImport(wizardParameter) {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						} else if (boqMainService.isOenBoq()) {
							platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
							return;
						}

						var options = boqMainImportOptionsService.getImportOptions(boqMainService);
						options.wizardParameter = wizardParameter;
						basicsImportService.showImportDialog(options);
					}
				});
			}

			function importOenOnlv(boqMainSrvc) {
				assertBoqIsNotReadOnly(boqMainSrvc).then(response => {
					if (response) {
						if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
							boqMainSrvc = boqMainService;
						}

						$injector.get('boqMainOenOnlvService').importOenOnlv(boqMainSrvc);
					}
				});
			}

			function exportOenOnlv(boqMainSrvc) {
				if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
					boqMainSrvc = boqMainService;
				}

				$injector.get('boqMainOenOnlvService').exportOenOnlv(boqMainSrvc);
			}

			function exportOenOnlb(boqMainSrvc) {
				if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
					boqMainSrvc = boqMainService;
				}

				$injector.get('boqMainOenOnlvService').exportOenOnlb(boqMainSrvc);
			}

			function importCrbSia(boqMainSrvc) {
				assertBoqIsNotReadOnly(boqMainSrvc).then(response => {
					if (response) {
						if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
							boqMainSrvc = boqMainService;
						}
						boqMainCrbSiaService.importCrbSia(boqMainSrvc);
					}
				});
			}

			function exportCrbSia(boqMainSrvc) {
				if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
					boqMainSrvc = boqMainService;
				}

				boqMainCrbSiaService.exportCrbSia(boqMainSrvc);
			}

			function startQuantityInspector(boqMainSrvc) {
				if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
					boqMainSrvc = boqMainService;
				}

				var rootBoqItem = boqMainSrvc.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.selectTargetBoq');
					return;
				}

				$injector.get('boqMainQuantityInspectorService').start(boqMainSrvc);
			}

			function changeProjectChangeStatus(moduleMainService, boqMainSrvc) {
				if(boqMainSrvc.getSelected().PrjChangeFk === null)
				{
					platformDialogService.showInfoBox('boq.main.projectChangeMissing');
				}
				else if (boqMainSrvc.getSelected().PrjChangeStatusFk === null)
				{
					platformDialogService.showInfoBox('boq.main.projectChangeStatusMissing');
				}
				else
				{
					return $injector.get('boqMainProjectChangeService').changeProjectChangeStatus(moduleMainService, boqMainSrvc);
				}
			}

			function splitDiscount(boqMainService) {
				var rootBoqItem;

				rootBoqItem = boqMainService.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				}

				platformDialogService.showYesNoDialog('boq.main.SplitDiscountText', 'boq.main.SplitDiscountTitle').then(function (result) {
					if (result.yes) {
						$http.post(globals.webApiBaseUrl + 'boq/main/splitdiscount' + '?boqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function (response) {
							boqMainService.load();
							if (response.data) {
								platformDialogService.showDialog({bodyText: response.data, headerText$tr$: 'cloud.common.infoBoxHeader', iconClass: 'info', showOkButton: true});
							}
						});
					}
				});
			}

			function renumBoq() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						} else if (boqMainService.isOenBoq()) {
							platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
							return;
						}

						boqMainRenumberService.renumberBoqItems(boqMainService);
					}
				});
			}

			function renumberFreeBoq() {
				const boqMainStandardTypes = $injector.get('boqMainStandardTypes');
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						var modalOptions = {
							headerTextKey: $translate.instant('boq.main.freeBoqRenumber'),
							bodyTextKey: $translate.instant('boq.main.renumberBoqScope'),
							templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-renumber-freeboq.html',
							selectBoQs: $translate.instant('boq.main.renumberAllBoqs'),
							eachBoQ: $translate.instant('boq.main.renumberEachBoq'),
							currentPrj: $translate.instant('boq.main.renumberCurrentPrj'),
							renumberDependance: $translate.instant('boq.main.renumberDependance')
						};

						platformModalService.showDialog(modalOptions).then(function (result) {
							if (result.ok) {
								if (boqMainService.getStructure().BoqStandardFk !== boqMainStandardTypes.free) {
									platformModalService.showMsgBox($translate.instant('boq.main.freeBoqWarningMessage'),
										$translate.instant('boq.main.freeBoqRenumber'), 'warning');
									return;
								}
								if (result.isRenumberCurrent && result.isWithinBoq) {
									boqMainService.renumberFreeBoq(true, true);
								}
								else if (result.isRenumberCurrent && !result.isWithinBoq) {
									boqMainService.renumberFreeBoq(true, false);
								}
								else if (!result.isRenumberCurrent && result.isWithinBoq) {
									boqMainService.renumberFreeBoq(false, true);
								}
								else if (!result.isRenumberCurrent && !result.isWithinBoq) {
									boqMainService.renumberFreeBoq(false, false);
								}
							}
						});
					}
				});
			}

			function selectGroups(boqMainSrvc) {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
							boqMainSrvc = boqMainService;
						}

						if (boqMainSrvc.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						}
						else if (boqMainSrvc.isOenBoq()) {
							platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
							return;
						}

						boqMainSelectGroupsService.showEditor({boqMainService:boqMainSrvc});
					}
				});
			}

			function scanBoq() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						} else if (boqMainService.isOenBoq()) {
							platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
							return;
						}

						boqMainValidationService.scanBoqAndShowResult(boqMainService.getRootBoqItem(), '.x83');
					}
				});
			}

			function splitUrbItems() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						} else if (boqMainService.isOenBoq()) {
							platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
							return;
						}

						var params = {};
						params.boqMainService = boqMainService;
						boqMainSplitUrbService.showDialog(params);
					}
				});
			}

			function generateWicNumber() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.getRootBoqItem()) {
							if (boqMainService.getRootBoqItem().IsWicItem) {
								platformModalService.showErrorBox($translate.instant('boq.main.canNotGenerateWicNumberInWicBoQ'), $translate.instant('boq.main.generateWicNumber'));
							} else if (boqMainService.isCrbBoq()) {
								platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							} else if (boqMainService.isOenBoq()) {
								platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
								return;
							} else {
								var boqMainGenerateWicNumberDataService = $injector.get('boqMainGenerateWicNumberDataService');
								boqMainGenerateWicNumberDataService.showDialog();
							}
						}
					}
				});
			}

			function updateDatafromWIC() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.getRootBoqItem()) {
							if (boqMainService.getRootBoqItem().IsWicItem) {
								platformModalService.showErrorBox($translate.instant('boq.main.canNotUpdateDataWicBoQ'), $translate.instant('boq.main.updateDatafromWIC'));
							} else if (boqMainService.isCrbBoq()) {
								platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							} else if (boqMainService.isOenBoq()) {
								platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
								return;
							} else {
								var boqMainUpdateDataFromWicDataService = $injector.get('boqMainUpdateDataFromWicDataService');
								boqMainUpdateDataFromWicDataService.showDialog();
							}
						}
					}
				});
			}

			function updateBoq(boqMainSrvc, prjId, commonBoqDataService, headerData) {
				assertBoqIsNotReadOnly(boqMainSrvc).then(response => {
					if (response) {
						if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getRootBoqItem')) {
							boqMainSrvc = boqMainService;
						}
						if (!boqMainSrvc.isRootBoqItemLoaded()) {
							platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
							return;
						}
						$injector.get('salesCommonUpdateBoqDialogService').showDialog().then(function (result) {
							if (result.isOk) {
								var boqRootItem = boqMainSrvc.getRootBoqItem();
								var projectId = prjId ? prjId : boqMainSrvc.getSelectedProjectId();
								var postData = {
									ProjectId: projectId,
									BoqHeaderId: boqRootItem ? boqRootItem.BoqHeaderFk : null,
									Module: headerData ? headerData.Module : 'boq.main',
									HeaderId: headerData ? headerData.HeaderId : projectId || -1,
									ExchangeRate: headerData ? headerData.ExchangeRate : boqMainSrvc.getCurrentExchangeRate(),
									IsBaseOnCorrectedUPGross: result.isBaseOnCorrectedUPGross
								};
								$http.post(globals.webApiBaseUrl + 'boq/main/updateboq', postData).then(function () {
									if (_.isFunction(commonBoqDataService.refresh)) {
										commonBoqDataService.refresh();
									} else {
										boqMainSrvc.refresh();
									}
								});
							}
						});
					}
				});
			}

			function eraseEmptyDivisions(boqMainSrvc, headerDataService) {
				assertBoqIsNotReadOnly(boqMainSrvc).then(response => {
					if (response) {
						if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getSelectedHeaderFk')) {
							boqMainSrvc = boqMainService;
						}

						if (!boqMainSrvc.isRootBoqItemLoaded()) {
							platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing'); // Delivers a reasonable message although originally meant for boq import.
							return;
						}

						var selectedBoqHeaderFk = boqMainSrvc.getSelectedHeaderFk();
						$http.get(globals.webApiBaseUrl + 'boq/main/eraseemptydivisions?boqheaderid=' + selectedBoqHeaderFk).then(function (result) {
							if (_.isObject(headerDataService) && _.isFunction(headerDataService.refresh)) {
								headerDataService.refresh();
							} else {
								boqMainSrvc.refresh();
							}

							platformModalService.showMsgBox($translate.instant('boq.main.emptyDivisionErasureResult') + result.data, 'boq.main.emptyDivisionErasure', 'info');
						});
					}
				});
			}

			function resetServiceCatalogNo() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (boqMainService.isCrbBoq()) {
							platformDialogService.showInfoBox('boq.main.crbDisabledFunc');
							return;
						} else if (boqMainService.isOenBoq()) {
							platformDialogService.showInfoBox('boq.main.oenDisabledFunc');
							return;
						}

						var boqMainResetServiceCatalogNoService = $injector.get('boqMainResetServiceCatalogNoService');
						boqMainResetServiceCatalogNoService.resetServiceCatalogNoOfBoqItems(boqMainService);
					}
				});
			}

			function updateEstimate() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						var title = 'boq.main.updateEstimateWizard.title';
						var platformTranslateService = $injector.get('platformTranslateService');
						var platformSidebarWizardConfigService = $injector.get('platformSidebarWizardConfigService');
						var platformModalFormConfigService = $injector.get('platformModalFormConfigService');

						var updateEstimateConfig = {
							title: $translate.instant(title),
							dataItem: {
								selectedLevel: 'SelectedItems',
								IsUpdEstimate: true
							},
							formConfiguration: {
								fid: 'boq.main.updateEstimate',
								version: '0.1.1',
								showGrouping: false,
								groups: [
									{
										gid: 'baseGroup',
										attributes: ['selecteditem']
									}
								],
								'overloads': {},
								rows: [
									{
										gid: 'baseGroup',
										rid: 'SelectedItem',
										label: 'Select Boq Scope',
										label$tr$: 'boq.main.updateEstimateWizard.selectBoqScope',
										type: 'radio',
										model: 'selectedLevel',
										options: {
											labelMember: 'Description',
											valueMember: 'Value',
											groupName: 'updateEstimateBoqConfig',
											items: [
												{Id: 1, Description: $translate.instant('boq.main.updateEstimateWizard.highlightedBoqItems'), Value: 'SelectedItems'},
												{Id: 2, Description: $translate.instant('boq.main.updateEstimateWizard.entireBoqs'), Value: 'AllItems'}
											]
										},
										sortOrder: 1
									}]
							},
							handleOK: function handleOK(result) {
								if (!result || !result.ok || !result.data) {
									return;
								}
								if (result.data.selectedLevel === 'SelectedItems' && boqMainService.getIfSelectedIdElse() <= 0) {
									return;
								}
								var postData = {
									'ProjectFk': projectMainService.getIfSelectedIdElse(0),
									'SelectedLevel': result.data.selectedLevel,
									'BoqItemIds': _.map(boqMainService.getSelectedEntities(), 'Id'),
									'BoqHeaderIds': _.map(boqMainService.getSelectedEntities(), 'BoqHeaderFk')
								};

								function getSuccessfullMessage(response) {
									return $translate.instant('boq.main.updateEstimateWizard.countBoqforUpdatedEstimate', {
										count: response.data.length
									});
								}

								function updEstimate() {
									$http.post(globals.webApiBaseUrl + 'boq/main/updateestimate', postData)
										.then(function (response) {
											if (response && response.data && response.data.length) {
												var cols = [
													{
														id: 'reference',
														field: 'Reference',
														name: 'Reference',
														toolTip: 'Reference',
														name$tr$: 'boq.main.Reference',
														formatter: 'description',
														width: 150
													},
													{
														id: 'briefinfo',
														formatter: 'translation',
														editor: 'translation',
														field: 'BriefInfo',
														name: 'Brief Info',
														toolTip: 'Brief Info',
														name$tr$: 'boq.main.BriefInfo',
														width: 150
													},
													{
														id: 'budget',
														name$tr$: 'boq.main.BudgetTotal',
														formatter: 'decimal',
														field: 'BudgetTotal',
														width: 200
													}];
												return $injector.get('platformGridDialogService').showDialog({
													columns: cols,
													items: response.data,
													idProperty: 'Id',
													tree: true,
													childrenProperty: 'BoqItems',
													headerText$tr$: 'boq.main.updateEstimateWizard.updateEstimateSummaryTitle',
													topDescription: getSuccessfullMessage(response),
													isReadOnly: true
												}).then(function () {
													return {
														success: true
													};
												});

											} else {
												return $injector.get('platformModalService').showMsgBox('boq.main.updateEstimateWizard.updateEstimateErr', 'boq.main.updateEstimateWizard.title', 'info');
											}
										});

								}

								boqMainService.updateAndExecute(updEstimate);
							}
						};

						platformTranslateService.translateFormConfig(updateEstimateConfig.formConfiguration);
						updateEstimateConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
						platformModalFormConfigService.showDialog(updateEstimateConfig);
					}
				});
			}

			function formatBoQSpecification(boqMainSrvc, headerDataService) {
				assertBoqIsNotReadOnly(boqMainSrvc).then(response => {
					if (response) {
						var headerService = headerDataService;

						if (!Object.prototype.hasOwnProperty.call(boqMainSrvc, 'getSelectedHeaderFk')) {
							boqMainSrvc = boqMainService;
							headerService = boqMainSrvc;
						}
						var title = 'boq.main.formatBoQSpecification.title';
						var platformTranslateService = $injector.get('platformTranslateService');
						var platformSidebarWizardConfigService = $injector.get('platformSidebarWizardConfigService');
						var platformModalFormConfigService = $injector.get('platformModalFormConfigService');

						platformWysiwygEditorSettingsService.getBothSettings().then(function (result) {
							let availableFonts = platformWysiwygEditorSettingsService.getCurrentFonts(result.system);
							var data = {
								defaultAlignment: result.system.defaultAlignment,
								defaultFont: result.system.defaultFont,
								defaultFontSize: result.system.defaultFontSize,
								fontSizes:result.system.fontSizes,
								fonts:availableFonts,
							};
							var formConfig = platformWysiwygEditorSettingsService.getGeneralFormConfig(data);

							formConfig.rows.splice(-1);

							var formatBoQSpecificationConfig = {
								title: $translate.instant(title),
								dataItem: {
									defaultFont: result.system.defaultFont,
									defaultFontSize: parseInt(result.system.defaultFontSize),
									defaultAlignment: result.system.defaultAlignment
								},
								formConfiguration: _.assign({
									fid: 'boq.main.formatBoQSpecification',
									version: '0.1.1',
									showGrouping: false
								}, formConfig),
								handleOK: function handleOK(result) {
									if (!result || !result.ok || !result.data) {
										return;
									}

									var postData = {
										'BoqHeaderIds': _.map(boqMainSrvc.getSelectedEntities(), 'BoqHeaderFk'),
										'Font': result.data.defaultFont,
										'FontSize': result.data.defaultFontSize,
										'Alignment': result.data.defaultAlignment
									};

									function formatBoQSpec() {

										var processFormatBoQSpec = function (postData) {

											var $q = $injector.get('$q');

											var canceller = $q.defer();

											var cancel = function (reason) {
												canceller.resolve(reason);
											};

											var promise =
												$http.post(globals.webApiBaseUrl + 'boq/main/formatboqspecifications', postData, {timeout: canceller.promise}).then(
													function (response) {
														return response.data;
													}
												);

											return {
												promise: promise,
												cancel: cancel
											};
										};

										var request = processFormatBoQSpec(postData);
										return request.promise.then(function (response) {
											if (response.Result === true) {
												boqMainSrvc.refreshBoqData();  // call succeeded function
											}
										});
									}

									headerService.updateAndExecute(formatBoQSpec);

									boqMainSrvc.registerListLoaded(function () {
										boqMainSrvc.setSelected(boqMainSrvc.getRootBoqItem());
									});
								}
							};

							platformTranslateService.translateFormConfig(formatBoQSpecificationConfig.formConfiguration);
							formatBoQSpecificationConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
							platformModalFormConfigService.showDialog(formatBoQSpecificationConfig);
						});
					}
				});
			}

			var wizardsList = {
				showImages: true,
				showTitles: true,
				cssClass: 'sidebarWizard',
				items: [
					{
						id: 1,
						text: $translate.instant('cloud.desktop.sdWizzardsAccordionHeader1'),
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						visible: true,
						subitems: [
							{
								id: 12,
								text: $translate.instant('cloud.desktop.sdWizzardsAccordionHeader1Sub1'),
								fn: gaebImport
							},
							{
								id: 13,
								text: $translate.instant('cloud.desktop.sdWizzardsAccordionHeader1Sub2'),
								fn: gaebExport
							}]
					},
					{
						id: 2,
						text: $translate.instant('cloud.desktop.sdWizzardsAccordionHeader2'),
						groupIconClass: 'sidebar-icons ico-wiz-change-status',
						subitems: [
							{
								id: 21,
								text: $translate.instant('cloud.desktop.sdWizzardsAccordionHeader2Sub1'),
								fn: renumBoq
							}]
					}
				]
			};

			function addIndexToBoqStructure(boqMainService) {
				var rootBoqItem;

				rootBoqItem = boqMainService.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				}

				platformDialogService.showYesNoDialog('boq.main.addIndexToBoqStructureTitle', 'boq.main.addIndexToBoqStructureTitle').then(function (result) {
					if (result.yes) {
						$http.post(globals.webApiBaseUrl + 'boq/main/addindextoboqstructure' + '?boqHeaderId=' + boqMainService.getSelectedHeaderFk()).then(function () {
							boqMainService.load();
						});
					}
				});
			}

			function generateSplitQuantitiesWithBillToAssignment() {
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (!boqMainService.getRootBoqItem()) {
							platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
							return;
						}

						boqMainService.updateAndExecute(function () {
							platformDialogService.showYesNoDialog('boq.main.generateSplitQuantitiesWithBillToAssignmentTitle', 'boq.main.generateSplitQuantitiesWithBillToAssignmentTitle').then(function (result) {
								if (result.yes) {
									$http.post(globals.webApiBaseUrl + 'boq/main/splitquantity/generatesplitquantitieswithbilltoassignment' + '?boqHeaderId=' + boqMainService.getSelectedHeaderFk()).then(function (wizardresult) {
										boqMainService.load();
										if (!wizardresult || wizardresult.data !== '') {
											platformDialogService.showInfoBox('boq.main.boqContainsQtos');
										}
									});
								}
							});
						});
					}
				});
			}

			function copyUnitRateToBudgetUnit(boqMainService) {
				var rootBoqItem;

				rootBoqItem = boqMainService.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				}

				platformDialogService.showYesNoDialog('boq.main.copyUnitRateToBudgetUnitWizard.continueQuestion', 'boq.main.copyUnitRateToBudgetUnitWizard.title').then(function (result) {
					if (result.yes) {
						$http.post(globals.webApiBaseUrl + 'boq/main/copyunitratetobudgetunit' + '?boqHeaderId=' + boqMainService.getSelectedHeaderFk()).then(function () {
							boqMainService.load();
						});
					}
				});
			}

			function billToWizard(){
				assertBoqIsNotReadOnly().then(response => {
					if (response) {
						if (!boqMainService.getRootBoqItem()) {
							platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
							return;
						}

						boqMainService.updateAndExecute(function () {
							var projectId = boqMainService.getSelectedProjectId();

							if(!_.isNumber(projectId)) {
								console.log("Create BillToWizard -> Project Id is missing -> cannot proceed !")
								return;
							}

							return $http.post(globals.webApiBaseUrl + 'project/main/billto/listByParent', { PKey1:projectId })
								.then(function (response) {
									if (response && response.data && response.data.length) {
										function getGridColumnsConfig() {
											let cols =  [
												{
													id: 'Selected',
													name$tr$: 'boq.main.wizard.selected',
													formatter: 'boolean',
													field: 'Selected',
													width: 100,
													editor:'boolean',
													readonly: false
												},
												{
													id: 'Quantity',
													formatter: 'money',
													editor: 'money',
													field: 'QuantityPortion',
													name$tr$: 'boq.main.QuantityPortion',
													width: 150
												},
												{
													id: 'Code',
													field: 'Code',
													name$tr$: 'cloud.common.entityCode',
													formatter: 'code',
													width: 100
												},
												{
													id: 'Description',
													formatter: 'description',
													field: 'Description',
													name$tr$: 'cloud.common.entityDescription',
													width: 100
												},
												{
													id: 'Comment',
													name$tr$: 'cloud.common.entityComment',
													formatter: 'description',
													field: 'Comment',
													width: 100
												},
												{
													id: 'Remark',
													formatter: 'description',
													field: 'Remark',
													name$tr$: 'cloud.common.entityRemark',
													width: 100
												},
												{
													id: 'Businesspartnerfk',
													field: 'BusinessPartnerFk',
													name$tr$: 'project.main.entityBusinesspartnerFk',
													formatter: 'lookup',
													formatterOptions: {  lookupType: 'BusinessPartner', displayMember: 'BusinessPartnerName1' },
													width: 100
												},
												{
													id: 'Customerfk',
													formatter: 'lookup',
													field: 'CustomerFk',
													name$tr$: 'object.main.entityCustomerFk',
													formatterOptions: { 'lookupType': 'customer', 'displayMember': 'Code' },
													width: 100
												},
												{
													id: 'Subsidiaryfk',
													formatter: 'lookup',
													field: 'SubsidiaryFk',
													name$tr$: 'project.main.entitySubsidiary',
													formatterOptions: { lookupType: 'Subsidiary', displayMember: 'AddressLine' },
													width: 100
												}
											];

											let billToModes = $injector.get('billToModes');
											if(boqMainService.getCurrentBillToMode() === billToModes.quantityOrItemBased) {
												// Replace the checkbox with a radio button for in this mode one is only allowed so select one bill-to...
												let selectColumn = _.find(cols, {id: 'Selected'});
												if(_.isObject(selectColumn)) {
													selectColumn.formatter = 'marker';
													selectColumn.editor = 'marker';
													selectColumn.editorOptions = {multiSelect: false};
												}

												//...and remove the Quantity column
												_.remove(cols, {id: 'Quantity'});
											}

											return cols;
										}

										function getGridConfig(gridId, columnsConfig = getGridColumnsConfig()) {
											return {
												columns: columnsConfig,
												id: gridId,
												lazyInit: true,
												enableConfigSave: false,
												options: {
													idProperty: 'Id',
													editable: true,
													indicator: true,
													skipPermissionCheck: true
												}
											};
										}

										function getFormConfig() {

											return {
												fid: 'boq.main.billToWizard',
												version: '1.0.0',
												showGrouping: false,
												groups: [{
													gid: 'basic',
													isOpen: true,
													isVisible: true,
													sortOrder: 1,
												},
												{
													gid: 'billTo',
													isOpen: true,
													isVisible: true,
													sortOrder: 2,
												}],
												rows: [
													{
														gid: 'basic',
														rid: 'create',
														label: 'Action',
														type: 'radio',
														options: {
															valueMember: 'value',
															labelMember: 'label',
															groupName: 'billToAction',
															items: [{
																value: 1,
																label$tr$: 'boq.main.billToWizardCreateAction'
															}, {
																value: 2,
																label$tr$: 'boq.main.billToWizardDeleteAction'
															}]
														},
														change: function(entity) {
															let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
															if(entity.wizardAction== 1) {
																entity.includeSplitQuantities = false;
																platformRuntimeDataService.readonly(entity, [{field: 'includeSplitQuantities', readonly: false}]);
															}
															else {
																entity.includeSplitQuantities = true;
																platformRuntimeDataService.readonly(entity, [{field: 'includeSplitQuantities', readonly: true}]);
															}
														},
														visible: true,
														model: 'wizardAction'
													},
													{
														gid: 'basic',
														rid: 'IncludeSplitQuantities',
														label: 'Include Split Quantities',
														label$tr$: 'boq.main.IncludeSplitQuantities',
														type: 'boolean',
														model: 'includeSplitQuantities',
														visible: true,
														sortOrder: 1
													},
													{
														gid: 'billTo',
														rid: 'billTo',
														label$tr$: 'boq.main.billToEntity',
														visible: true,
														model: 'projectBillTos',
														type: 'directive',
														directive: 'platform-grid-form-control',
														options: {
															gridConfig: getGridConfig(gridId),
															height: '160px',
															width: '800px'
														}
													}
												]
											};
										}

										function getQueryDialogOptions(value) {
											let queryFormConfig = {
												fid: 'boq.main.BillToQuery',
												version: '1.0.0',
												showGrouping: false,
												groups: [{
													gid: 'basic',
													isOpen: true,
													isVisible: true,
													sortOrder: 1,
												}],
												rows: [
												{
													gid: 'basic',
													rid: 'keepOrOverwrite',
													type: 'radio',
													options: {
														valueMember: 'value',
														labelMember: 'label',
														groupName: 'billToAction',
														items: [{
															value: 1,
															label$tr$: 'boq.main.billToWizardKeepAssignment'
														}, {
															value: 2,
															label$tr$: 'boq.main.billToWizardOverwriteAssignment'
														}]
													},
													visible: true,
													model: 'keepOrOverwriteAssignment'
												}]
											};

											let topDescription = $translate.instant('boq.main.billToAssignmentsDetectedText');
											let queryDialogOptions = {
												formConfig: {
													configure: queryFormConfig
												},
												width: '600px',
												headerText$tr$: 'boq.main.billToAssignmentsDetectedHeader',
												topDescription: topDescription,
												value: value
											};

											return queryDialogOptions;
										}

										let settings = { wizardAction: 1, includeSplitQuantities: false, projectBillTos: response.data, keepOrOverwriteAssignment: 2};
										let gridId = '759d1c0b75934cdf974640832e6b8107';

										let formDialogOptions = {
											formConfig: {
												configure: getFormConfig()
											},
											value: settings,
											headerText$tr$: 'boq.main.createUpdateBillToWizardTitle'
										};

										return $injector.get('platformDialogFormService').showDialog(formDialogOptions).then(function (wizardDialogResult) {
											let returnValue = {success : false};

											if(wizardDialogResult.ok) {
												let selectedBoqItems = boqMainService.getSelectedEntities();
												let boqHeaderFk = boqMainService.getSelectedHeaderFk();
												let postData = _.isArray(selectedBoqItems) ? _.map(selectedBoqItems, function (boqItem) {
													return boqItem.Id;
												}) : null;
												let hasBillToAssignmentsPromise = $q.when(true);

												let billToModes = $injector.get('billToModes');
												let selectedProjectBillTos = _.isObject(wizardDialogResult.value) && _.isArray(wizardDialogResult.value.projectBillTos) ? wizardDialogResult.value.projectBillTos.filter((item) => {
													return item.Selected;
												}) : [];
												let wizardAction = _.isObject(wizardDialogResult.value) && _.isNumber(wizardDialogResult.value.wizardAction) ? wizardDialogResult.value.wizardAction : 1; // CreateOrUpdate is default.

												if(boqMainService.getCurrentBillToMode() === billToModes.percentageBased &&
													(_.sum(_.map(selectedProjectBillTos, 'QuantityPortion')) > 100) &&
													(wizardDialogResult.value.wizardAction === 1)) {
													// Inform about crossing the 100 percent and stop here !
													platformModalService.showErrorBox($translate.instant('boq.main.billToWizardPercentCheckText'), $translate.instant('boq.main.billToWizardPercentCheckHeader'));
													return returnValue;
												}

												// The following query is only relevant if the wizard action is set to createOrUpdate (1)
												if(_.isObject(wizardDialogResult.value) && _.isNumber(wizardDialogResult.value.wizardAction) && (wizardDialogResult.value.wizardAction == 1)) {
													hasBillToAssignmentsPromise = $http.post(globals.webApiBaseUrl + 'boq/main/checkForBillToAssignments' + '?boqHeaderFk=' + boqHeaderFk, postData)
														.then(function (result) {
															if (_.isObject(result) && _.isObject(result.data)) {
																if (result.data.hasBillToAssignments) {
																	return $injector.get('platformDialogFormService').showDialog(getQueryDialogOptions(settings)).then(function (dialogResult) {
																		return dialogResult.ok ? true : null;
																	});
																} else {
																	// If we don't have Bill-To assignments and the deletion of Bill-Tos is requested we can leave here -> therefore return null.
																	return _.isObject(wizardDialogResult.value) && _.isNumber(wizardDialogResult.value.wizardAction) && (wizardDialogResult.value.wizardAction == 1) ? false : null;
																}
															} else {
																return null;
															}
														}
													);
												}

												hasBillToAssignmentsPromise.then(function (result) {
													if (_.isBoolean(result)) {
														postData = {
															BoqHeaderFk: boqHeaderFk,
															SelectedBoqItems: selectedBoqItems,
															ProjectBillTos: selectedProjectBillTos,
															WizardAction: wizardAction,
															IncludeSplitQuantities: _.isObject(wizardDialogResult.value) && _.isBoolean(wizardDialogResult.value.includeSplitQuantities) ? wizardDialogResult.value.includeSplitQuantities : false,
															KeepOrOverwriteAssignment: _.isObject(wizardDialogResult.value) && _.isNumber(wizardDialogResult.value.keepOrOverwriteAssignment) ? wizardDialogResult.value.keepOrOverwriteAssignment : 1, // Keep the Bill-To assignment is default.
														};

														$http.post(globals.webApiBaseUrl + 'boq/main/maintainBoqBillTos', postData)
															.then(function (res) {
																 boqMainService.load(); // Reload boq to have direct access to changed bill-tos

																 if (!res || res.data.errorMessage !== '') {
																	 platformDialogService.showInfoBox('boq.main.boqContainsQtos');
																 }

																 // Todo-BH: Check res before returning
																 return returnValue.success = true;
															 }
														 );
													}
												});
											}
										});
									}
								}
							);
						});
					}
				});
			}

			return {
				getWizardList: function () {
					return wizardsList;
				},
				getWizardListForProject: function () {
					return wizardsList.items[0];
				},
				gaebImport: gaebImport,
				gaebExport: gaebExport,
				excelImport: excelImport,
				excelExport: excelExport,
				importOenOnlv: importOenOnlv,
				exportOenOnlv: exportOenOnlv,
				exportOenOnlb: exportOenOnlb,
				importCrbSia: importCrbSia,
				exportCrbSia: exportCrbSia,
				startQuantityInspector: startQuantityInspector,
				changeProjectChangeStatus: changeProjectChangeStatus,
				splitDiscount: splitDiscount,
				renumBoq: renumBoq,
				renumberFreeBoq: renumberFreeBoq,
				selectGroups: selectGroups,
				generateWicNumber: generateWicNumber,
				updateDatafromWIC: updateDatafromWIC,
				scanBoq: scanBoq,
				splitUrbItems: splitUrbItems,
				updateBoq: updateBoq,
				eraseEmptyDivisions: eraseEmptyDivisions,
				resetServiceCatalogNo: resetServiceCatalogNo,
				updateEstimate: updateEstimate,
				formatBoQSpecification: formatBoQSpecification,
				addIndexToBoqStructure: addIndexToBoqStructure,
				generateSplitQuantitiesWithBillToAssignment: generateSplitQuantitiesWithBillToAssignment,
				copyUnitRateToBudgetUnit: copyUnitRateToBudgetUnit,
				billToWizard:billToWizard
			};
		}
	]);

})();
