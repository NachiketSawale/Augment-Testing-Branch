(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name procurementContractHeaderGridController
	 * @require $scope, platformContextService, platformGridControllerBase, $filter,  procurementContractHeaderDataService, procurementContractHeaderGridColumns,  contractHeaderElementValidationService,
	 *          modelViewerStandardFilterService
	 * @description controller for contract header
	 */
	angular.module('procurement.contract').controller('procurementContractHeaderGridController',
		['$injector', '$scope', 'platformGridControllerService', 'procurementContractHeaderDataService',
			'contractHeaderElementValidationService', 'procurementContractHeaderUIStandardService',
			'cloudDesktopSidebarService','prcContractBillingSchemaDataService', 'modelViewerStandardFilterService', 'estimateProjectRateBookConfigDataService', 'procurementCommonNavigationService',
			'platformGridAPI','$timeout', '_', 'basicsCommonInquiryHelperService', '$translate', 'procurementCommonClipboardService','procurementCommonCreateButtonBySystemOptionService',
			function ($injector,$scope, gridControllerService, dataService, validationService, uiStandardService, cloudDesktopSidebarService,prcContractBillingSchemaDataService,modelViewerStandardFilterService, estimateProjectRateBookConfigDataService, procurementCommonNavigationService,platformGridAPI,$timeout, _, basicsCommonInquiryHelperService, $translate, procurementCommonClipboardService,procurementCommonCreateButtonBySystemOptionService) {
				// var gridContainerGuid = 'E5B91A61DBDD4276B3D92DDC84470162';
				// var containerInfoService = $injector.get('procurementContractContainerInformationService');
				var gridConfig = {
					columns: [],
					rowChangeCallBack: function (/* arg */) {
						dataService.gridRowChangeCallBack();
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						dataService.gridCellChangeCallBack(arg);
					},
					type: 'procurement.contract',
					dragDropService: procurementCommonClipboardService
				};

				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();
				basicsCommonInquiryHelperService.activateProvider($scope, true);

				prcContractBillingSchemaDataService.registerBillingSchemaChangeEvent();
				prcContractBillingSchemaDataService.registerParentEntityCreateEvent();

				modelViewerStandardFilterService.attachMainEntityFilter($scope, dataService.getServiceName());

				function selectionChangeed(e, entity) {
					dataService.gridSelectionChangeed(entity);
				}

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				var updateCodeEnum = {
					NotChange: 1,
					NotChangeMsg: 'No update. It\'s already latest version.',

					GetDataFromBaseLineSuccess: 2,
					GetDataFromBaseLineSuccessMsg: $translate.instant('procurement.contract.updateContractFromBaseline.getFromBaselineSuccessed'),

					GetDataFromBaseLineFailed: 3,
					GetDataFromBaseLineFailedMsg: $translate.instant('procurement.contract.updateContractFromBaseline.getFromBaselineFailed'),

					UpdateSuccess: 4,
					UpdateSuccessMsg: $translate.instant('procurement.contract.updateContractFromBaseline.updateSuccessed'),

					UpdateFailed: 5,
					UpdateFailedMsg: $translate.instant('procurement.contract.updateContractFromBaseline.updateFailed'),

					NotFoundFileExported: 6,
					NotFoundFileExportedMsg: $translate.instant('procurement.contract.updateContractFromBaseline.notFoundFileExported')
				};

				function asyncCOContractDataFromBaseLine(e, entity) {
					dataService.lastSelectionItem = entity;

					if (!entity || !entity.BaselineUpdate) {
						return;
					}

					let currentContractId = entity.Id;
					if (dataService.existsCheckingContractId(currentContractId) || dataService.existsRefreshContractId(currentContractId)) {
						return;
					} else {
						dataService.setCheckingContractId(currentContractId);
					}

					$injector.get('procurementPackageDataService').getPackageById(entity.PackageFk)
						.then(function(response){
							dataService.isShowContractAutoUpdateMessagebox().then(function(showBlockDialog){
								let conStatus = $injector.get('basicsLookupdataLookupDescriptorService').getData('ConStatus');
								let status = $injector.get('_').find(conStatus, {Id: entity.ConStatusFk});
								let strTitle = '';
								let strBody = '';
								if (!status.IsUpdateImport) {
									strTitle = $translate.instant('procurement.contract.updateContractFromBaseline.title');
									strBody = $translate.instant('procurement.common.errorTip.recordIsReadOnlyBody');
									return showDialog(strBody, strTitle, 'ico-info', showBlockDialog).then(function () {
										dataService.removeCheckingContractId(currentContractId);
									});
								}

								dataService.checkCOContractIsChangedInBaseline(entity).then(function (contractIsChangedInBaseline) {
									if (contractIsChangedInBaseline && contractIsChangedInBaseline.IsChanged && contractIsChangedInBaseline.Id === entity.Id) {
										if (showBlockDialog) {
											dataService.showBlockDialog.fire();
										}

										var request = {
											Contract: entity,
											ChangeResult : contractIsChangedInBaseline
										};

										var title = $translate.instant('procurement.contract.updateContractFromBaseline.title');
										dataService.checkAndUpdateCOContractFromBaseLine(request).then(function (data) {
											if (showBlockDialog) {
												dataService.closeBlockDialog.fire();
											}

											if (data){
												let msg = '';
												if (data.ResultCode === updateCodeEnum.NotChange) {
													msg = data.Message || updateCodeEnum.NotChangeMsg;
													dataService.removeCheckingContractId(currentContractId);
												}else if (data.ResultCode === updateCodeEnum.GetDataFromBaseLineSuccess) {
													msg = data.Message || updateCodeEnum.GetDataFromBaseLineSuccessMsg;
													dataService.removeCheckingContractId(currentContractId);
												} else if (data.ResultCode === updateCodeEnum.GetDataFromBaseLineFailed) {
													msg = data.Message || updateCodeEnum.GetDataFromBaseLineFailedMsg;

													showDialog(msg, title, 'ico-error').then(function () {
														dataService.removeCheckingContractId(currentContractId);
													});
												}else if (data.ResultCode === updateCodeEnum.UpdateSuccess) {
													dataService.setRefreshContractId(currentContractId);
													dataService.refresh().then(function () {
														msg = data.Message || updateCodeEnum.UpdateSuccessMsg;
														showDialog(msg, title, 'ico-info', showBlockDialog).then(function () {
															dataService.removeCheckingContractId(currentContractId);
															dataService.removeRefreshContractId(currentContractId);
														});
													});
												}else if (data.ResultCode === updateCodeEnum.UpdateFailed) {
													msg = data.Message || updateCodeEnum.UpdateFailedMsg;
													showDialog(msg, title, 'ico-error').then(function () {
														dataService.removeCheckingContractId(currentContractId);
													});
												}else if (data.ResultCode === updateCodeEnum.NotFoundFileExported) {
													msg = data.Message || updateCodeEnum.NotFoundFileExportedMsg;
													showDialog(msg, title, 'ico-error').then(function () {
														dataService.removeCheckingContractId(currentContractId);
													});
												}
											}

											dataService.removeCheckingContractId(currentContractId);
										}, function () {
											if (showBlockDialog) {
												dataService.closeBlockDialog.fire();
											}
											dataService.removeCheckingContractId(currentContractId);
										});
									} else {
										let msg = contractIsChangedInBaseline.ErrorMsg;
										if (msg && !_.isEmpty(msg)){
											showDialog(msg, title, 'ico-error').then(function () {
												dataService.removeCheckingContractId(currentContractId);
											});
										}
										else{
											dataService.removeCheckingContractId(currentContractId);
										}
									}
								}, function () {
									dataService.removeCheckingContractId(currentContractId);
								});

								dataService.removeCheckingContractId(currentContractId);
							});
						});
				}

				function showDialog(msg, title, iconCss, allowShowDialog) {
					if (allowShowDialog === false) {
						let $q = $injector.get('$q');
						return $q.when(false);
					} else {
						return showBlockDialog(title, iconCss, msg);
					}
				}

				function showBlockDialog(title, ico, body) {
					let platformModalService = $injector.get('platformModalService');
					return platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.contract/templates/update-contract-from-baseline-block-template.html',
						backdrop: false,
						headerText: title ? title : $translate.instant('procurement.contract.updateContractFromBaseline.title'),
						iconClass: ico ? ico : 'ico-info',
						bodyText: body ? body : $translate.instant('procurement.contract.updateContractFromBaseline.checking')
					});
				}
				dataService.showBlockDialog.register(showBlockDialog);
				dataService.registerSelectionChanged(asyncCOContractDataFromBaseLine);
				dataService.registerSelectionChanged(selectionChangeed);
				dataService.registerSelectionChanged(updateNavigationButton);

				function updateToolBar() {
					$scope.tools.update();
				}

				dataService.registerUpdateDone(updateToolBar);
				var characterColumnService = dataService.characterColumnService();

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 46);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				var deepCopyIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'createDeepCopy';
				});

				if (deepCopyIdx > -1) {
					$scope.tools.items[deepCopyIdx].permission = {
						'349f4683cd194ebb9af98026ec9a2126': 4
					};
				}

				$scope.$on('$destroy', function () {

					// prcContractBillingSchemaDataService.unregisterBillingSchemaChangeEvent();
					// prcContractBillingSchemaDataService.unregisterParentEntityCreateEvent();
					dataService.showBlockDialog.unregister(showBlockDialog);
					dataService.unregisterSelectionChanged(asyncCOContractDataFromBaseLine);
					dataService.unregisterSelectionChanged(selectionChangeed);
					dataService.unregisterSelectionChanged(updateNavigationButton);
					estimateProjectRateBookConfigDataService.clearData();
					dataService.unregisterUpdateDone(updateToolBar);
					dataService.clearIsShowMessageboxCache();
				});
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create']);
			}]
	);
})(angular);