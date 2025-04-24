(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,console */

	var moduleName = 'procurement.package';
	/**
	 * @ngdoc controller
	 * @name procurementPackageGridController
	 * @require $scope, platformGridControllerBase, $filter,  procurementPackageDataService, procurementPackageUIStandardService, slickGridEditors, lookupDataService, reqHeaderElementValidationService,
	 *          modelViewerStandardFilterService
	 * @description controller for requisition header
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageGridController',
		['$injector', '$translate', '$scope', 'platformGridControllerService', 'procurementPackageDataService', 'procurementPackageUIStandardExtendedService',
			'procurementPackageValidationService', /* 'procurementCommonHelperService','platformToolbarService', */
			'modelViewerStandardFilterService', 'estimateProjectRateBookConfigDataService', 'procurementCommonNavigationService',
			'platformGridAPI','$timeout', '_', 'basicsCommonInquiryHelperService', 'procurementCommonClipboardService', '$sce','procurementCommonCreateButtonBySystemOptionService',
			function ($injector, $translate, $scope, gridControllerService, dataService, gridColumns, validationService, /* ,
			 procurementCommonHelperService, platformToolbarService */
				modelViewerStandardFilterService, estimateProjectRateBookConfigDataService, procurementCommonNavigationService,
				platformGridAPI, $timeout, _, basicsCommonInquiryHelperService, procurementCommonClipboardService, $sce,procurementCommonCreateButtonBySystemOptionService) {

				var containerInfoService = $injector.get('procurementPackageContainerInformationService');
				var gridContainerGuid = '1d58a4da633a485981776456695e3241';
				var gridConfig = {
					initCalled: false,
					columns: [],
					rowChangeCallBack: function (/* arg */) {
						var helperService = $injector.get('salesCommonContainerInformationHelperService');
						if (helperService) {
							helperService.initMasterDataFilter('procurementPackageDataService');
						}
					},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var field = arg.grid.getColumns()[arg.cell].field;
						var item = arg.item;
						dataService.cellChange(item, field);
						// handel characterist
						var colService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 48, gridContainerGuid, containerInfoService);
						var column = arg.grid.getColumns()[arg.cell];
						colService.fieldChange(arg.item, field, column);

					},
					type: 'procurement.package',
					dragDropService: procurementCommonClipboardService
				};

				gridColumns.extendExtraColumns();

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				// If entity modify we check AssetMasterFk is valid or not.
				dataService.registerDataModified(function () {
					var selectedItem = dataService.getSelected();
					if (selectedItem) {
						if (!selectedItem.AssetMasterFk) {
							validationService.validateAssetMasterFk(selectedItem, selectedItem.AssetMasterFk, 'AssetMasterFk');
						}
					}
				});

				procurementCommonNavigationService.createNavigationItem($scope, dataService);
				updateNavigationButton();

				basicsCommonInquiryHelperService.activateProvider($scope, true);

				function updateNavigationButton() {
					procurementCommonNavigationService.updateNavigationItem($scope, dataService);
				}

				dataService.registerSelectionChanged(updateNavigationButton);

				// handle characterist
				var characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory').getService(dataService, 48, gridContainerGuid.toUpperCase(), containerInfoService);

				var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, 48);

				// dev-10043: fix general performance issue, should be after initListController !important
				$injector.get('basicsCharacteristicColumnUpdateService').attachToGrid($scope, characterColumnService, characteristicDataService, dataService);

				var updateCodeEnum = {
					NotChange: 1,
					// todo-stone: add the hardcode to translation token.
					NotChangeMsg: 'No update. It\'s already latest version.',// $translate.instant('procurement.package.updatePackageFromBaseline.notChanged'),

					GetDataFromBaseLineSuccess: 2,
					GetDataFromBaseLineSuccessMsg: $translate.instant('procurement.package.updatePackageFromBaseline.getFromBaselineSuccessed'),

					GetDataFromBaseLineFailed: 3,
					GetDataFromBaseLineFailedMsg: $translate.instant('procurement.package.updatePackageFromBaseline.getFromBaselineFailed'),

					UpdateSuccess: 4,
					UpdateSuccessMsg: $translate.instant('procurement.package.updatePackageFromBaseline.updateSuccessed'),

					UpdateFailed: 5,
					UpdateFailedMsg: $translate.instant('procurement.package.updatePackageFromBaseline.updateFailed')
				};

				function asyncPackageDataFromBaseLine(e, entity) {

					dataService.lastSelectionItem = entity;

					if (!entity || !entity.BaselinePath || !entity.BaselineUpdate) {
						return;
					}

					var currentIsMaterialPackage = true;
					var testMaterialPackage = /\\[^\\]+?\s*V\d+\s*P\d+\\PAs\\[\d\w]+?\\\w+\d+-[\d\w]+\\([\d\w]+\\)*\w+\d+-[\d\w]+/ig;
					currentIsMaterialPackage = !!testMaterialPackage.exec(entity.BaselinePath);

					var currentPackageId = entity.Id;
					console.log(currentPackageId);

					if (dataService.existsCheckingPackageId(currentPackageId) || dataService.existsRefreshPackageId(currentPackageId)) {
						return;
					} else {
						dataService.setCheckingPackageId(currentPackageId);
					}
					dataService.isShowPackageAutoUpdateMessagebox().then(function (showBlockDialog) {
						var PackageStatus = $injector.get('basicsLookupdataLookupDescriptorService').getData('PackageStatus');
						var status = $injector.get('_').find(PackageStatus, {Id: entity.PackageStatusFk});
						if (!status.IsUpdateImport) {
							dataService.removeCheckingPackageId(currentPackageId);
							return;
						}

						dataService.hasContracts(entity.Id).then(function (hasContracts) {
							if (hasContracts && currentIsMaterialPackage) {
								var strTitle = $translate.instant('procurement.package.updatePackageFromBaseline.title');
								var strBody = $translate.instant('procurement.package.updatePackageFromBaseline.notUpdate');
								return showDialog(strBody, strTitle, 'ico-info', showBlockDialog).then(function () {
									dataService.removeCheckingPackageId(currentPackageId);
								});
							} else {
								var deadlineTime = entity.DeadlineTime;
								if (entity.DeadlineTime && _.isObject(entity.DeadlineTime)) {
									entity.DeadlineTime = entity.DeadlineTime.format('HH:mm:ss');
								}
								dataService.checkPackageIsChangedInBaseline(entity).then(function (packageIsChangedInBaseline) {
									var title = $translate.instant('procurement.package.updatePackageFromBaseline.title');
									if (packageIsChangedInBaseline && packageIsChangedInBaseline.IsChanged && packageIsChangedInBaseline.Id === entity.Id) {
										if (showBlockDialog) {
											dataService.showBlockDialog.fire();
										}

										dataService.checkAndUpdatePakcageFromBaseLine({Package: entity, ChangeResult:packageIsChangedInBaseline}).then(function (data) {
											if (showBlockDialog) {
												dataService.closeBlockDialog.fire();
											}
											if (data) {
												var msg = '';
												if (data.ResultCode === updateCodeEnum.NotChange) {
													msg = data.Message || updateCodeEnum.NotChangeMsg;
													// showDialog(msg, title, 'ico-info', showBlockDialog);
													dataService.removeCheckingPackageId(currentPackageId);
												} else if (data.ResultCode === updateCodeEnum.GetDataFromBaseLineSuccess) {
													msg = data.Message || updateCodeEnum.GetDataFromBaseLineSuccessMsg;
													// showDialog(msg, title, 'ico-info', showBlockDialog);
													dataService.removeCheckingPackageId(currentPackageId);
												} else if (data.ResultCode === updateCodeEnum.GetDataFromBaseLineFailed) {
													msg = data.Message || updateCodeEnum.GetDataFromBaseLineFailedMsg;

													showDialog(msg, title, 'ico-error').then(function () {
														dataService.removeCheckingPackageId(currentPackageId);
													});
												} else if (data.ResultCode === updateCodeEnum.UpdateSuccess) {
													dataService.setRefreshPackageId(currentPackageId);
													dataService.refresh().then(function () {
														msg = data.Message || updateCodeEnum.UpdateSuccessMsg;
														showDialog(msg, title, 'ico-info', showBlockDialog).then(function () {
															dataService.removeCheckingPackageId(currentPackageId);
															dataService.removeRefreshPackageId(currentPackageId);
														});
													});
												} else if (data.ResultCode === updateCodeEnum.UpdateFailed) {
													msg = data.Message || updateCodeEnum.UpdateFailedMsg;
													showDialog(msg, title, 'ico-error').then(function () {
														dataService.removeCheckingPackageId(currentPackageId);
													});
												}
											}
											dataService.removeCheckingPackageId(currentPackageId);
											entity.DeadlineTime = deadlineTime;
										}, function (/* error */) {
											if (showBlockDialog) {
												dataService.closeBlockDialog.fire();
											}
											dataService.removeCheckingPackageId(currentPackageId);
											entity.DeadlineTime = deadlineTime;
											// showDialog(error.errorMessage || 'failed', title, 'ico-error');
										});
									} else {
										var msg = packageIsChangedInBaseline.ErrorMsg;
										if (msg && !_.isEmpty(msg)){
											showDialog(msg, title, 'ico-error').then(function () {
												dataService.removeCheckingPackageId(currentPackageId);
											});
										}
										else{
											dataService.removeCheckingPackageId(currentPackageId);
										}
										entity.DeadlineTime = deadlineTime;
									}
								}, function () {
									dataService.removeCheckingPackageId(currentPackageId);
									entity.DeadlineTime = deadlineTime;
								});


							}
						});
					});
				}

				function showDialog(msg, title, iconCss, allowShowDialog) {
					if (allowShowDialog === false) {
						var $q = $injector.get('$q');
						return $q.when(false);
					} else {
						var platformModalService = $injector.get('platformModalService');
						return platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.package/templates/update-package-from-baseline-block-template.html',
							backdrop: false,
							headerText: title,
							iconClass: iconCss,
							bodyText: $sce.trustAsHtml(msg)
						});
					}

				}

				function updateToolBar() {
					$scope.tools.update();
				}

				function updateDeleteBtnStatus(selected, packageStatus) {
					if ($scope.tools) {
						var delBtn=_.find($scope.tools.items,function(item){
							return item.id==='delete';
						});
						if(!_.isNil(delBtn)){

							if (selected && !_.isEmpty(selected)) {
								if (selected.Version === 0) {
									delBtn.disabled = false;
								} else {
									if (packageStatus) {
										delBtn.disabled = packageStatus.IsReadonly;
									}

								}
							}

						}
						$scope.tools.update();
					}

				}

				function updateByChangeStatus(packageStatus){
					var selected = dataService.getSelected();
					if(!_.isNil(selected)){
						updateDeleteBtnStatus(selected, packageStatus);
						characterColumnService.setReadOnlyByMainEntity(selected);
					}
				}

				dataService.registerSelectionChanged(asyncPackageDataFromBaseLine);
				dataService.registerUpdateDone(updateToolBar);
				dataService.PackageStatusChangedByWizard.register(updateByChangeStatus);

				function showBlockDialog() {
					var platformModalService = $injector.get('platformModalService');
					return platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.package/templates/update-package-from-baseline-block-template.html',
						backdrop: false,
						headerText: $translate.instant('procurement.package.updatePackageFromBaseline.title'),
						iconClass: 'ico-info',
						bodyText: $translate.instant('procurement.package.updatePackageFromBaseline.checking')
					});
				}

				dataService.showBlockDialog.register(showBlockDialog);

				// dataService.registerListLoaded(goToFirst);
				// function goToFirst(){
				// if(!dataService.hasRefreshPackages()){
				// dataService.goToFirst();
				// }
				// }

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'procurementPackageDataService');

				// for hidden bulk editor button
				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
				// #109463. Rename the pin button as "Pin Project of Selected Item" in Procurement Modules
				for (var i = 0; i < $scope.tools.items.length; i++) {
					if ($scope.tools.items[i].id === 't-pinningctx') {
						$scope.tools.items[i].caption = $translate.instant('procurement.package.pinToolbarCaption');
					}
				}

				var deepCopyIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'createDeepCopy';
				});

				if (deepCopyIdx > -1) {
					$scope.tools.items[deepCopyIdx].permission = {
						'961ec511c2be495fbf227474555a240e': 4
					};
				}
				$injector.get('boqRuleComplexLookupService').setNavFromBoqProject();

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(asyncPackageDataFromBaseLine);
					dataService.unregisterSelectionChanged(updateNavigationButton);
					dataService.unregisterUpdateDone(updateToolBar);
					estimateProjectRateBookConfigDataService.clearData();
					dataService.showBlockDialog.unregister(showBlockDialog);
					dataService.clearIsShowMessageboxCache();
					dataService.PackageStatusChangedByWizard.unregister(updateByChangeStatus);
					// dataService.unregisterListLoaded(goToFirst);
				});
				procurementCommonCreateButtonBySystemOptionService.removeGridCreateButton($scope,['create']);
			}
		]);
})(angular);