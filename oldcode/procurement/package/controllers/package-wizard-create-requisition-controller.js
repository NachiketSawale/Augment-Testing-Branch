(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module(moduleName).value('procurementPackageWizardPackageGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'CreateReqId',
						field: 'package2HeaderId',
						formatter: 'boolean',
						editor: 'boolean',
						width: 50,
						validator: 'package2HeaderIdChange'
					},
					{
						id: 'CreateReqDescription',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 110
					},
					{
						id: 'CreateReqHeaderFk',
						field: 'ReqHeaderFk',
						name: 'code',
						name$tr$: 'procurement.package.reqCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ReqHeaderLookupView',
							displayMember: 'Code'
						},
						width: 110
					},
					{
						id: 'ReqDescription',
						field: 'ReqHeaderFk',
						name: 'Description',
						name$tr$: 'procurement.package.entityReqDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ReqHeaderLookupView',
							displayMember: 'Description'
						},
						width: 110
					},
					{
						id: 'CreateReqRequire',
						field: 'ReqHeaderFk',
						name: 'Description',
						'name$tr$': 'procurement.package.entityReqRequired',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ReqHeaderLookupView',
							displayMember: 'DateRequired',
							domain: 'dateutc'
						},
						width: 110
					},
					{
						id: 'CreateReqStatus',
						field: 'ReqHeaderFk',
						name: 'Req Status',
						name$tr$: 'procurement.package.entityReqState',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ReqHeaderLookupView',
							displayMember: 'Status'
						},
						width: 80
					},
					{
						id: 'CreateReqStructureCode',
						field: 'PrcHeaderEntity.StructureFk',
						name$tr$: 'cloud.common.entityStructureCode',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'prcstructure',
							'displayMember': 'Code'
						},
						width: 100
					},
					{
						id: 'CreateReqStructureDesc',
						field: 'PrcHeaderEntity.StructureFk',
						name$tr$: 'cloud.common.entityStructureDescription',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'prcstructure',
							'displayMember': 'DescriptionInfo.Translated'
						},
						width: 100
					},
					{
						id: 'CreateReqstrategy',
						field: 'PrcHeaderEntity.StrategyFk',
						name: 'Strategy',
						name$tr$: 'procurement.requisition.headerGrid.reqheaderStrategy',

						formatter: 'lookup',
						formatterOptions: {'lookupType': 'prcconfig2strategy', 'displayMember': 'Description'},
						width: 85
					},
					{
						id: 'CreateReqCommentText',
						field: 'CommentText',
						name: 'CommentText',
						name$tr$: 'cloud.common.entityCommentText',
						width: 110
					}
				]
			};
		}
	});

	angular.module(moduleName).value('procurementPackageWizardReqHeaderColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'CreateReqCode',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'CreateReqDescription',
						field: 'Description',
						name: 'Descripiton',
						name$tr$: 'cloud.common.entityReferenceName',
						width: 100
					},
					{
						id: 'DateRequired',
						field: 'DateRequired',
						name: 'DateRequired',
						name$tr$: 'cloud.common.entityRequired',
						formatter: 'date',
						width: 100
					},
					{
						id: 'Status',
						field: 'ReqStatusFk',
						name: 'Status',
						name$tr$: 'cloud.common.entityState',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'reqStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						},
						width: 100
					},
					{
						id: 'ClerkReqFk',
						field: 'ClerkReqFk',
						name$tr$: 'cloud.common.entityRequisitionOwner',
						formatter: 'lookup',
						formatterOptions: {
							'lookupType': 'clerk',
							'displayMember': 'Code'
						},
						width: 100
					}
				]
			};
		}
	});

	/**
	 * controller of wizard 'create requisition' dialog.
	 */
	angular.module(moduleName).controller('procurementPackageWizardCreateRequisitionController', [
		'$scope', '$translate', '$injector', '$http', 'procurementPackageWizardCreateRequisitionService', 'procurementPackageDataService', 'procurementPackagePackage2HeaderService', 'basicsLookupdataLookupDescriptorService', 'platformModuleNavigationService', 'platformModuleInfoService', 'basicsWorkflowWizardContextService',
		function ($scope, $translate, $injector, $http, createRequisitionWizardService, packageDataService, subPackageDataService, lookupDescriptionService, platformModuleNavigationService, platformModuleInfoService,basicsWorkflowWizardContextService) {

			var translatePrefix = 'procurement.package.wizard.createRequisition.';
			$scope.defaultChange = $scope.modalOptions.defaultChange;
			let hasContractItem = $scope.modalOptions.hasContractItem;
			let resultPromiseFromScope= $scope.modalOptions.resultPromise;
			$scope.modalOptions = {
				headerText: $translate.instant(translatePrefix + 'caption'),
				headerTitle: $translate.instant(translatePrefix + 'caption'),
				selectSubPackageTitle: $translate.instant(translatePrefix + 'selectPackageMessage'),
				createRequisitionTitle: $translate.instant(translatePrefix + 'chooseMessage'),
				basedOnExistedRequisitionTitle: $translate.instant(translatePrefix + 'basedOnExistedRequisition'),
				basedOnExistedContractTitle: $translate.instant(translatePrefix + 'basedOnExistedContract'),
				overwriteRequisitionText: $translate.instant(translatePrefix + 'overwriteRequisition'),
				changeOrderRequisitionText: $translate.instant(translatePrefix + 'changeRequisition'),
				changeRequestText: $translate.instant(translatePrefix + 'changeRequest'),
				btnOkText: $translate.instant('cloud.common.ok'),
				btnCloseText: $translate.instant('cloud.common.cancel'),
				btnPreviousText: $translate.instant('cloud.common.previousStep'),
				btnNextText: $translate.instant('cloud.common.nextStep'),
				navigateTitle: platformModuleInfoService.getNavigatorTitle('procurement.requisition'),
				doesCopyHeaderTextFromPackage: $scope.modalOptions.reqType === 'createNewBase',
				isBtnNextDisabled: true,
				isBtnPreviousDisabled: false,
				isBtnOKDisabled: false,
				isBtnNavigateDisabled: true,
				setchangeItem: function (value) {
					$scope.modalOptions.changeOrder.isChangeItem = value;
				},
				changeOrder: {
					changeItemEnum: {
						req: 1,
						changeReq: 2,
						contract: 3
					},
					isChangeItem: null,
					// isChangeItem:false,
					overwriteDisabled: false,
					showBtnPrevious: false,
					selectedBtnRadioValue: 'overwriteRequisition',
					isOrderStatus: false
				},
				step: '',
				dialogLoading: false,
				loadingInfo: '',
				requisitionEntity: {Id: -1},

				onPrevious: function () {
					createRequisitionWizardService.showInfo(false, '', 0);
					$scope.modalOptions.step = 'step1';
					$scope.modalOptions.isBtnNextDisabled = true;
					$scope.modalOptions.isBtnOKDisabled = false;
				},
				onNext: function () {
					createRequisitionWizardService.showCreateRequisitionInfoDialog(hasContractItem, false, resultPromiseFromScope );
				},
				onOK: function () {
					$scope.modalOptions.isBtnOKDisabled = true;
					// overwrite the exsiting requisition
					if ($scope.modalOptions.reqType === 'overwriteReq') {
						createRequisitionWizardService.overwriteRequisition(createRequisitionWizardService.selectedSubPackage.Id, $scope.modalOptions.doesCopyHeaderTextFromPackage).then(function (response) {
							packageDataService.load();
							setResultPromise(resultPromiseFromScope,response.data);
							$scope.modalOptions.requisitionEntity = response.data.RequsitionId;
							createRequisitionWizardService.showNavigationPage(response.data.RequsitionId, false);
							$scope.modalOptions.isBtnNavigateDisabled = false;
						}, function (error) {
							createRequisitionWizardService.requestDataFail(error);
						});
					}
					// create a change order requisition
					else if ($scope.modalOptions.changeOrder.isOrderStatus) {
						createRequisitionWizardService.basecontract(createRequisitionWizardService.selectedSubPackage.Id).then(function (responsData) {
							if (responsData) {
								var changeId = $scope.projectChange ? $scope.projectChange.Id : null;
								var baseReqId = $scope.modalOptions.selectedBaseReq ? $scope.modalOptions.selectedBaseReq.Id : null;
								createRequisitionWizardService.createChangeOrderFromContract(createRequisitionWizardService.selectedSubPackage.Id, changeId, responsData.data.Id, baseReqId).then(function (response) {
									// when create change order, if items/boq's quantity has not changed (no difference: response.data == -1),
									// show a message dialog for user to choose 'continue create' or 'cancel'.
									setResultPromise(resultPromiseFromScope,response.data);
									$scope.modalOptions.requisitionEntity = response.data;
									createRequisitionWizardService.showNavigationPage(response.data, true);
									$scope.modalOptions.isBtnNavigateDisabled = false;
								}, function (error) {
									createRequisitionWizardService.requestDataFail(error);
								});
							}
						});
					} else if ($scope.modalOptions.reqType === 'createNewBase') {
						createRequisitionWizardService.createNewBaseRequisition(createRequisitionWizardService.selectedSubPackage.Id).then(function (response) {
							// when create change order, if items/boq's quantity has not changed (no difference: response.data == -1),
							// show a message dialog for user to choose 'continue create' or 'cancel'.
							packageDataService.load();
							setResultPromise(resultPromiseFromScope,response.data);
							$scope.modalOptions.requisitionEntity = response.data.RequsitionId;
							createRequisitionWizardService.showNavigationPage(response.data.RequsitionId, true);
							$scope.modalOptions.isBtnNavigateDisabled = false;
						}, function (error) {
							createRequisitionWizardService.requestDataFail(error);
						});
					} else {
						createRequisitionWizardService.createChangeOrderRequisition(createRequisitionWizardService.selectedSubPackage.Id, $scope.modalOptions.selectedBaseReq.Id, $scope.projectChange.Id, false, $scope.modalOptions.doesCopyHeaderTextFromPackage).then(function (response) {
							// when create change order, if items/boq's quantity has not changed (no difference: response.data == -1),
							// show a message dialog for user to choose 'continue create' or 'cancel'.
							setResultPromise(resultPromiseFromScope,response.data);
							$scope.modalOptions.requisitionEntity = response.data;
							createRequisitionWizardService.showNavigationPage(response.data, true);
							$scope.modalOptions.isBtnNavigateDisabled = false;
						}, function (error) {
							createRequisitionWizardService.requestDataFail(error);
						});
					}
				},
				onClose: function () {
					$scope.$close(false);
					setResultPromise(resultPromiseFromScope);
				},
				cancel: function () {
					$scope.$close(false);
					setResultPromise(resultPromiseFromScope);
				},
				onNavigate: function () {
					$scope.$close(false);
					platformModuleNavigationService.navigate({
						moduleName: 'procurement.requisition',
						registerService: 'procurementRequisitionHeaderDataService'
					}, {Id: $scope.modalOptions.requisitionEntity}, 'Id');
				}
			};

			$scope.hasContractMessage = !!hasContractItem;
			$scope.lookupOptions = {
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(e, args) {
						if (args.selectedItem) {
							$scope.projectChange = args.selectedItem;
						}
					}
				}],
				showClearButton: false,
				createOptions: {
					initCreateData: function (createData) {
						var packageItem = createRequisitionWizardService.selectedPackage || {};
						createData.PKey1 = packageItem.ProjectFk;
						return createData;
					},
					typeOptions: {
						isProcurement: true,
						isChangeOrder: true
					}
				},
				filterOptions: {
					serverKey: 'project-change-lookup-for-procurement-common-filter',
					serverSide: true,
					fn: function () {
						var packageItem = createRequisitionWizardService.selectedPackage || {};
						return {
							ProjectFk: packageItem.ProjectFk || 0,
							IsProcurement : true
						};
					}
				}
			};

			function setResultPromise(resultPromise, responseData) {
				if (resultPromise) {
					if (responseData) {
						basicsWorkflowWizardContextService.setResult(responseData);
						resultPromise.resolve();
					} else {
						resultPromise.resolve({cancel: false});
					}
				}
			}

			// cache controller scope
			createRequisitionWizardService.scope = $scope;
			// $scope.modalOptions.step = '';
			$scope.modalOptions.dialogLoading = true;
			createRequisitionWizardService.setDataForCreateRequisition(createRequisitionWizardService.selectedSubPackage.Id, hasContractItem, createRequisitionWizardService.selectedPackage,resultPromiseFromScope);
			$scope.$on('$destroy', function () {
				createRequisitionWizardService.scope = null;
				createRequisitionWizardService.selectedSubPackage = null;
			});
		}
	]);

	/**
	 * controller for SubPackage grid of wizard 'create requisition' dialog in module 'procurement.package'.
	 */
	angular.module(moduleName).controller('procurementPackageCreateRequisitionWizardSubPackageController', [
		'$scope', '$timeout', 'procurementPackageWizardCreateRequisitionService',
		'procurementPackageCreateRequisitionWizardSubPackageService', 'procurementPackageWizardPackageGridColumns',
		'basicsCommonDialogGridControllerService', 'platformGridDomainService', 'basicsLookupdataLookupDescriptorService',
		function ($scope, $timeout, packageWizardCreateRequisitionService,
			dataService, gridColumnsDef,
			dialogGridControllerService, platformGridDomainService, lookupDescriptionService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				uuid: '106745809A624F308577572A22354E9Y'
			};

			// TODO: workaround: use to formatter dateUtc, because lookup formatter can't format dateutc, so it need rewrite it and use user defined formatter
			var columns = angular.copy(gridColumnsDef.getStandardConfigForListView().columns);
			_.find(columns, {id: 'CreateReqRequire'}).formatter = function lookupDomainFormatter(row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
				var targetData = lookupDescriptionService.getData(columnDef.formatterOptions.lookupType);
				value = _.get(dataContext, columnDef.field);
				var item;
				if (targetData) {
					item = targetData[value];
				}

				var result = '';

				if (targetData && item) {
					var css = platformGridDomainService.alignmentCssClass(columnDef.formatterOptions.domain);
					var formatter = platformGridDomainService.formatter(columnDef.formatterOptions.domain);

					result = formatter(row, cell, value, {field: columnDef.formatterOptions.displayMember}, item, plainText);
					if (css) {
						result = '<div class="' + css + '">' + result + '</div>';
					}
					return result;
				}

				return '';
			};

			var gridColumns = {
				getStandardConfigForListView: function () {
					return {columns: columns};
				}
			};

			dialogGridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

			dataService.registerSelectionChanged(onSelectionChanged);
			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(onSelectionChanged);
			});

			// load data after contrller initialized.
			$timeout(function () {
				dataService.load();
			});

			function onSelectionChanged() {
				// uncheck all
				_.each(dataService.getList(), function (item) {
					item.package2HeaderId = false;
				});

				// checked the selected item
				var selctedItem = dataService.getSelected();
				if (selctedItem && !selctedItem.package2HeaderId) {
					selctedItem.package2HeaderId = true;
				}

				dataService.gridRefresh();

				if (selctedItem) {
					packageWizardCreateRequisitionService.selectedSubPackage = selctedItem;
					packageWizardCreateRequisitionService.initData(selctedItem.Id);
				}
			}
		}
	]);

	/**
	 * controller for Requisition grid of wizard 'create requisition' dialog in module 'procurement.package'.
	 */
	angular.module(moduleName).controller('procurementPackageCreateRequisitionWizardRequisitionController', [
		'$scope', '$timeout', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
		'procurementPackageWizardReqHeaderColumns', 'procurementPackageCreateRequisitionWizardRequisitionService',
		function ($scope, $timeout, platformGridAPI, dialogGridControllerService, columnsDef, dataService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				uuid: 'E571571C85384EF2925013A2D9124383'
			};

			dialogGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);

			$timeout(function () {
				platformGridAPI.grids.resize($scope.gridId);
			});
		}
	]);

	/**
	 * controller for Package wizard 'create contract' changed item grid in module 'procurement.package'.
	 */
	angular.module(moduleName).controller('procurementPackageCreateRequisitionChangedItemController', [
		'$scope', '$timeout', 'basicsCommonDialogGridControllerService',
		'procurementPackageCreateRequisitionChangedItemService', 'procurementPackageWizardCreateRequisitionService',
		function ($scope, $timeout, dialogGridControllerService, dataService, PackageWizardCreateRequisitionService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				uuid: 'ad4ef8d064b7466a8be763631fb3f2c6'
			};

			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'status',
								field: 'StatusFk',
								name: 'Status',
								name$tr$: 'cloud.common.entityState',
								sortable: true,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								},
								width: 100
							},
							{
								id: 'code',
								field: 'Code',
								name: 'Code',
								name$tr$: 'cloud.common.entityCode',
								formatter: 'description',
								sortable: true,
								width: 125
							},
							{
								id: 'Description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'comment',
								sortable: true,
								width: 125
							},
							{
								id: 'packageQuantity',
								field: 'PackageQuantity',
								name: 'Package Quantity',
								name$tr$: 'procurement.package.wizard.packageQuantity',
								formatter: 'quantity',
								sortable: true,
								width: 85
							},
							{
								id: 'contractQuantity',
								field: 'ContractQuantity',
								name: 'Contracted Quantity',
								name$tr$: 'procurement.package.wizard.requisitionQuantity',
								formatter: 'quantity',
								sortable: true,
								width: 85
							},
							{
								id: 'varianceQuantity',
								field: 'VarianceQuantity',
								name: 'Variance Quantity',
								name$tr$: 'procurement.package.wizard.varianceQuantity',
								formatter: 'quantity',
								sortable: true,
								width: 85
							},
							{
								id: 'uom',
								field: 'UomFk',
								name$tr$: 'cloud.common.entityUoM',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								sortable: true,
								width: 100
							}
						]
					};
				}
			};

			dialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);

			// load data after contrller initialized.
			$timeout(function () {
				if (PackageWizardCreateRequisitionService.scope.modalOptions.changeOrder.overwriteDisabled) {
					dataService.load();
				}
			});
		}
	]);

	/**
	 * controller for Package wizard 'create contract' changed item grid in module 'procurement.package'.
	 */
	angular.module(moduleName).controller('procurementComaprePackageWithContractChangedItemController', [
		'$scope', '$timeout', 'basicsCommonDialogGridControllerService',
		'procurementComparePackageWithContractChangedItemService',
		function ($scope, $timeout, dialogGridControllerService, dataService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				uuid: 'e28c898b272940928e58d34a1279b39d'
			};

			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'status',
								field: 'StatusFk',
								name: 'Status',
								name$tr$: 'cloud.common.entityState',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcItemStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								},
								width: 100
							},
							{
								id: 'code',
								field: 'Code',
								name: 'Code',
								name$tr$: 'cloud.common.entityCode',
								formatter: 'description',
								width: 125
							},
							{
								id: 'Description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'comment',
								width: 125
							},
							{
								id: 'packageQuantity',
								field: 'PackageQuantity',
								name: 'Package Quantity',
								name$tr$: 'procurement.package.wizard.packageQuantity',
								formatter: 'quantity',
								width: 85
							},
							{
								id: 'contractQuantity',
								field: 'ContractQuantity',
								name: 'Contracted Quantity',
								name$tr$: 'procurement.package.wizard.contractedQuantity',
								formatter: 'quantity',
								width: 85
							},
							{
								id: 'varianceQuantity',
								field: 'VarianceQuantity',
								name: 'Variance Quantity',
								name$tr$: 'procurement.package.wizard.varianceQuantity',
								formatter: 'quantity',
								width: 85
							},
							{
								id: 'uom',
								field: 'UomFk',
								name$tr$: 'cloud.common.entityUoM',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								width: 100
							}
						]
					};
				}
			};

			dialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);

			// load data after contrller initialized.
			$timeout(function () {
				dataService.load();
			});
		}
	]);

	/**
	 * existedValidBaseRequisitionController
	 */
	angular.module(moduleName).controller('existedValidBaseRequisitionController', [
		'$scope', '$timeout', 'basicsCommonDialogGridControllerService', 'platformRuntimeDataService', 'platformGridAPI',
		'procurementBaseRequisitionService', 'procurementPackageWizardCreateRequisitionService',
		function ($scope, $timeout, dialogGridControllerService, platformRuntimeDataService, platformGridAPI, dataService, createRequisitionService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				uuid: 'ad4ef8d064b7466a8be763631fb3f2c8'
			};

			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'Selected',
								field: 'Selected',
								name: 'Selected',
								name$tr$: 'cloud.common.entitySelected',
								editor: 'boolean',
								formatter: 'boolean',
								sortable: true,
								width: 80
							},
							{
								id: 'status',
								field: 'ReqStatusFk',
								name: 'Status',
								name$tr$: 'cloud.common.entityState',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'reqStatus',
									displayMember: 'DescriptionInfo.Translated',
									imageSelector: 'platformStatusIconService'
								},
								sortable: true,
								width: 100
							},
							{
								id: 'code',
								field: 'Code',
								name: 'Requisition Code',
								name$tr$: 'cloud.common.entityCode',
								formatter: 'description',
								sortable: true,
								width: 125
							},
							{
								id: 'description',
								field: 'Description',
								name: 'Requisition Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'comment',
								sortable: true,
								width: 125
							},
							{
								id: 'TotalQuantity',
								field: 'TotalQuantity',
								name: 'Total',
								name$tr$: 'procurement.package.wizard.total',
								formatter: 'quantity',
								sortable: true,
								width: 85
							}
						]
					};
				}
			};

			dialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);

			// load data after contrller initialized.
			$timeout(function () {
				if (createRequisitionService.scope.modalOptions.changeOrder.overwriteDisabled) {
					dataService.load();
					var dataList = dataService.getList();
					if (dataList && dataList.length > 0) {
						dataList[0].Selected = true;
					}
					_.forEach(dataList, function (item) {
						platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: true}]);
					});
					dataService.gridRefresh();
				}
			});
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);

			function onCellModified(e, arg) {
				var columns = arg.grid.getColumns(), field = columns[arg.cell].field, item = arg.item;
				if (field === 'Selected') {
					if (item.Selected) {
						var list = dataService.getList();
						_.forEach(list, function (entity) {
							if (entity.Id !== item.Id) {
								entity.Selected = false;
							}
						});
						dataService.gridRefresh();
					}
					createRequisitionService.scope.modalOptions.isSelectedBase = item.Selected;
					createRequisitionService.scope.modalOptions.selectedBaseReq = item;
				}
			}

			var unwatch = $scope.$watch(createRequisitionService.selectedButtonReadonly, function (newValue, oldValve) {
				var readonly = newValue || newValue === oldValve;
				var dataList = dataService.getList();
				_.forEach(dataList, function (item) {
					item.Selected = false;
					platformRuntimeDataService.readonly(item, [{field: 'Selected', readonly: readonly}]);
				});
				createRequisitionService.scope.modalOptions.isSelectedBase = readonly;
				if (readonly) {
					createRequisitionService.scope.projectChange = null;
					$scope.modalOptions.selectedBaseReq = null;
				} else {
					if (!!dataList && dataList.length === 1) {
						dataList[0].Selected = true;
						createRequisitionService.scope.modalOptions.isSelectedBase = true;
						createRequisitionService.scope.modalOptions.selectedBaseReq = dataList[0];
					}
					createRequisitionService.scope.projectChange = createRequisitionService.scope.defaultChange;
				}
				$scope.modalOptions.doesCopyHeaderTextFromPackage = $scope.modalOptions.reqType === 'createNewBase';
				dataService.gridRefresh();
			});

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
				if (angular.isFunction(unwatch)) {
					unwatch();
				}
			});
		}
	]);

	/**
	 * procurementBaseRequisitionController
	 */
	angular.module(moduleName).controller('procurementBaseRequisitionController', [
		'$scope', 'platformTranslateService',
		function ($scope, platformTranslateService) {

			var formConfig = {
				fid: 'Existed valid base requisition(s) under current sub package ppp:',
				'version': '1.0.0',
				'showGrouping': true,
				'skipTools': true,
				groups: [
					{
						gid: 'existed.base',
						header: 'Existed valid base requisition(s) under current sub package:',
						header$tr$: 'Existed valid base requisition(s) under current sub package:',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: 'existed.base',
						label: '',
						rid: 1,
						type: 'directive',
						model: 'reqFields',
						directive: 'existed-valid-base-requisition-directive'
					}
				]
			};
			platformTranslateService.translateFormConfig(formConfig);

			$scope.containerOptions = {
				formOptions: {
					configure: formConfig
				}
			};
		}
	]);

})(angular);